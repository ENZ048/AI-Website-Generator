import { Router } from "express";
import OpenAI from "openai";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import puppeteer from "puppeteer";

import { fetchReadable } from "../utils/fetchReadable.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const require = createRequire(import.meta.url);

// Resolve repo root and template paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../../../"); // adjust if monorepo layout differs
const SCHEMA_PATH = path.join(
  ROOT,
  "templates/digital-marketing/maxreach/schema.json"
);
const PROMPT_PATH = path.join(
  ROOT,
  "templates/digital-marketing/maxreach/prompt.js"
);

// Ajv setup
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let schema;
try {
  schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
} catch (e) {
  console.error("Failed to read schema:", SCHEMA_PATH, e);
  // Throw early so the service crashes fast in misconfig instead of returning 500s later
  throw e;
}
const validate = ajv.compile(schema);

// OpenAI
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

// toggle structured outputs (keep ON by default)
const USE_STRUCTURED = process.env.USE_STRUCTURED !== "0";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  });
});

// Utility: load module from absolute path, supporting both ESM and CJS on Windows
async function loadModuleFromAbsolute(absolutePath) {
  const fileUrl = pathToFileURL(path.resolve(absolutePath)).href; // file:///C:/...
  try {
    return await import(fileUrl);
  } catch (e) {
    // If ESM import fails (e.g., target is CJS), try require()
    try {
      return require(absolutePath);
    } catch (e2) {
      // Preserve original cause, but log both attempts
      console.error("ESM import failed:", e);
      console.error("CJS require failed:", e2);
      throw e; // surface the first error
    }
  }
}

// Strip code fences and extract JSON block (fallback path)
function extractJson(text) {
  const unfenced = String(text || "")
    .replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1")
    .trim();
  // try to find the last {...} block
  const match = unfenced.match(/\{[\s\S]*\}$/);
  const candidate = match ? match[0] : unfenced;
  return JSON.parse(candidate);
}

// Try to pull structured JSON directly from Responses API output
function extractStructuredJson(resp) {
  // Newer SDKs: resp.output is an array of "items"; each has content[]
  // Look for content item with a .type carrying JSON (varies by SDK).
  try {
    const items = resp?.output || [];
    for (const it of items) {
      const content = it?.content || [];
      for (const c of content) {
        // some SDKs expose { type: "output_text" } only; others provide { type: "json", json: {...} }
        if (c?.type === "json" && c?.json && typeof c.json === "object") {
          return c.json;
        }
      }
    }
  } catch {}
  return null;
}

/**
 * POST /api/analyze
 * Body:
 * {
 *   industry: "digital-marketing",
 *   url?: "https://...",           // Path A: has website
 *   companyName?: "Acme Digital",  // Path B: no website
 * }
 *
 * Optional query: ?debug=true  -> returns extra fields to inspect the model output
 */
router.post("/", async (req, res) => {
  const { industry, url, companyName } = req.body || {};
  const debug = String(req.query.debug || "") === "true";

  // Basic checks
  if (!industry) return res.status(400).json({ error: "industry required" });
  if (!url && !companyName) {
    return res.status(400).json({ error: "Provide either url or companyName" });
  }

  // Only MaxReach for now
  const templateId = "digital-marketing/maxreach";

  // Lazy-load prompt builders from template (Windows-safe)
  let buildPromptFromUrl, buildPromptFromSeed;
  try {
    const mod = await loadModuleFromAbsolute(PROMPT_PATH);
    buildPromptFromUrl = mod.buildPromptFromUrl || mod.promptFromUrl;
    buildPromptFromSeed = mod.buildPromptFromSeed || mod.promptFromSeed;

    if (
      typeof buildPromptFromUrl !== "function" ||
      typeof buildPromptFromSeed !== "function"
    ) {
      throw new Error(
        "Prompt builder exports not found. Expected buildPromptFromUrl/buildPromptFromSeed."
      );
    }
  } catch (e) {
    console.error("Failed to load prompt builders:", e);
    return res.status(500).json({ error: "Prompt builder not found" });
  }

  try {
    let prompt = "";
    let meta = { title: "", description: "" };

    if (url) {
      const { title, metaDescription, text } = await fetchReadable(url);
      meta = { title, description: metaDescription || "" };
      prompt = buildPromptFromUrl({
        url,
        title,
        metaDescription,
        text,
        industry,
      });
    } else {
      prompt = buildPromptFromSeed({ companyName, industry });
    }

    let resp;
    let data;
    let usedStructured = false;
    let outText = "";

    // Prefer STRUCTURED OUTPUTS (strongly recommended)
    if (USE_STRUCTURED) {
      try {
        resp = await client.responses.create({
          model: MODEL,
          input: prompt,
          temperature: 0.2, // lower temp for deterministic, schema-constrained output
          text: {
            format: {
              type: "json_schema",
              name: "MaxReachSiteContent",
              // json_schema: {
              //   name: "MaxReachSiteContent",
              //   schema,
              //   strict: true, // reject extra/missing properties
              // },
              schema,
              strict: true, // reject extra/missing properties
            },
          },
        });

        // try direct JSON
        data = extractStructuredJson(resp);

        // Some SDKs also expose concatenated text; keep for debug
        outText = (resp?.output_text || "").trim();

        usedStructured = true;
      } catch (e) {
        console.warn(
          "[analyze] Structured output call failed; falling back to text JSON parse:",
          e?.message || e
        );
      }
    }

    // Fallback: plain text + parse
    if (!data) {
      if (!resp) {
        resp = await client.responses.create({
          model: MODEL,
          input: prompt,
          temperature: 0.2,
        });
      }
      outText = (resp?.output_text || "").trim();
      try {
        data = extractJson(outText);
      } catch (jsonErr) {
        fs.writeFileSync(
          path.join(ROOT, "last-model-output.txt"),
          outText || "<empty>",
          "utf8"
        );
        if (debug) {
          return res.status(500).json({
            error: "Model returned invalid JSON",
            jsonError: String(jsonErr),
            savedTo: "last-model-output.txt",
            output_text: outText,
            raw: {
              id: resp?.id,
              model: resp?.model,
              status: resp?.status,
              output: resp?.output,
            },
          });
        }
        console.error("Model returned invalid JSON:", jsonErr);
        return res.status(500).json({ error: "Model returned invalid JSON" });
      }
    }

    // Validate against schema
    const valid = validate(data);
    if (!valid) {
      if (debug) {
        return res.status(422).json({
          error: "Validation failed",
          issues: validate.errors,
          receivedKeys: Object.keys(data || {}),
          usedStructured,
          output_text: outText,
        });
      }
      return res.status(422).json({
        error: "Validation failed",
        issues: validate.errors,
      });
    }

    const siteContent = data;

    // Emit a ready-to-use file
    const siteContentJs = `// Generated via ${templateId}${
      url ? ` from: ${url}` : companyName ? ` for: ${companyName}` : ""
    } (industry: ${industry})
export const siteContent = ${JSON.stringify(siteContent, null, 2)};
export default siteContent;`;

    if (debug) {
      return res.json({
        templateId,
        meta,
        siteContent,
        siteContentJs,
        _debug: {
          usedStructured,
          output_text: outText,
          rawOutputItems: resp?.output?.length ?? 0,
        },
      });
    }

    return res.json({
      templateId,
      meta,
      siteContent,
      siteContentJs,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Analyze failed", details: String(e?.message || e) });
  }
});

async function waitForPageComplete(page, { timeout = 30000 } = {}) {
  // wait for "complete"
  await page.waitForFunction(() => document.readyState === "complete", {
    timeout,
  });

  // wait for fonts
  try {
    await page.evaluate(() =>
      window.document.fonts ? window.document.fonts.ready : Promise.resolve()
    );
  } catch {}

  // wait for images
  try {
    await page.evaluate(async () => {
      const imgs = Array.from(document.images || []);
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
              })
        )
      );
    });
  } catch {}
}

// auto-scroll to trigger lazy loading
async function autoScrollAndSettle(
  page,
  { step = 800, pause = 300, settle = 600, maxScrolls = 30 } = {}
) {
  // scroll down in steps, pause so observers/lazy loaders run
  let total = 0;
  for (let i = 0; i < maxScrolls; i++) {
    const { scrolled, atBottom } = await page.evaluate(
      ({ step }) => {
        const before = window.scrollY;
        window.scrollBy(0, step);
        const after = window.scrollY;
        const atBottom =
          window.innerHeight + window.scrollY + 2 >= document.body.scrollHeight;
        return { scrolled: after - before, atBottom };
      },
      { step }
    );
    await sleep(pause);
    total += scrolled;
    if (atBottom) break;
  }

  // small settle time so new network requests can finish
  await sleep(settle);

  // optional: quick scroll back to top for full-page screenshots that look nicer
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
}

// --- UPDATED: screenshot with viewport & fullPage options ---
router.get("/screenshot", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL parameter required" });

  // options
  const fullPage = String(req.query.fullPage || "true") === "true";
  const width = parseInt(req.query.width || "1366", 10);
  const height = parseInt(req.query.height || "900", 10);
  const dpr = Math.max(1, Math.min(3, parseFloat(req.query.dpr || "1"))); // devicePixelRatio
  const delay = parseInt(req.query.delay || "0", 10); // extra delay after everything (ms)
  const waitSelector = req.query.waitSelector || ""; // CSS selector to wait for if you know a key element
  const maxScrolls = parseInt(req.query.maxScrolls || "30", 10);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // or "new" on newer versions
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--force-color-profile=srgb",
      ],
      // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // if your host needs it
    });

    const page = await browser.newPage();

    // a realistic desktop UA helps some sites render full layout
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    );

    await page.setViewport({ width, height, deviceScaleFactor: dpr });

    // Reduce animations; helps avoid capturing mid-transition frames
    await page.evaluateOnNewDocument(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        * { animation: none !important; transition: none !important; }
        html { scroll-behavior: auto !important; }
      `;
      document.documentElement.appendChild(style);
    });

    // Load the page; use a conservative waitUntil, then we do our own waits
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Optional: wait for a specific element if the site has a known main container
    if (waitSelector) {
      try {
        await page.waitForSelector(waitSelector, { timeout: 10000 });
      } catch {}
    }

    await waitForPageComplete(page);
    await autoScrollAndSettle(page, { maxScrolls });

    if (delay > 0) await sleep(delay);

    const png = await page.screenshot({ type: "png", fullPage });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=900"); // 15 min
    return res.send(png);
  } catch (error) {
    console.error(`Screenshot error for ${url}:`, error);
    return res.status(500).json({
      error: "Failed to take screenshot",
      details: error.message,
      url,
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
});

// --- NEW: quick check if a URL allows embedding ---
function cspBlocksFraming(csp) {
  if (!csp) return false; // no CSP => we won't block
  const parts = csp.split(";").map((s) => s.trim().toLowerCase());
  const fa = parts.find((p) => p.startsWith("frame-ancestors"));
  if (!fa) return false; // no frame-ancestors => don't block here
  // Generic project: if frame-ancestors is present, assume blocked unless you implement origin matching
  return true;
}

router.get("/can-embed", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL parameter required" });

  try {
    // Try HEAD, then fallback to GET so we can follow redirects and still read headers
    let r = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!r.ok || r.status >= 400) {
      r = await fetch(url, { method: "GET", redirect: "follow" });
    }

    const xfo = (r.headers.get("x-frame-options") || "").toLowerCase();
    const csp = r.headers.get("content-security-policy") || "";

    const xfoBlocks = xfo.includes("deny") || xfo.includes("sameorigin");
    const cspBlocks = cspBlocksFraming(csp);

    const embeddable = !(xfoBlocks || cspBlocks);
    return res.json({
      embeddable,
      reasons: {
        xFrameOptions: xfo || null,
        contentSecurityPolicy: csp || null,
      },
    });
  } catch (e) {
    // If we can’t fetch headers, be conservative and say not embeddable
    return res.json({
      embeddable: false,
      reasons: { error: String(e?.message || e) },
    });
  }
});

export default router;
