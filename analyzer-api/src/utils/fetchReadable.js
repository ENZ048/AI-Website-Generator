// src/utils/fetchReadable.js
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import http from "node:http";
import https from "node:https";

// Shared keep-alive agents; force IPv4 to dodge some v6 stalls
const httpAgent = new http.Agent({ keepAlive: true, family: 4 });
const httpsAgent = new https.Agent({ keepAlive: true, family: 4 });

const AXIOS = axios.create({
  maxRedirects: 10,
  timeout: 45000, // 45s
  httpAgent,
  httpsAgent,
  // Let Node handle compression; keep default decompress behavior
  headers: {
    // Use a very “real” UA
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Upgrade-Insecure-Requests": "1",
  },
});

// Retry helper (no extra deps)
async function withRetries(fn, { retries = 3, baseDelayMs = 800 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const code = err?.code || err?.cause?.code;
      // Only retry transient/timeouts/DNS-ish issues
      const retriable =
        code === "ECONNABORTED" ||
        code === "ETIMEDOUT" ||
        code === "ERR_SOCKET_TIMEOUT" ||
        code === "EAI_AGAIN" ||
        code === "ECONNRESET" ||
        code === "ENOTFOUND";
      if (!retriable || attempt === retries) break;
      const delay = baseDelayMs * Math.pow(2, attempt); // exp backoff
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// Try URL variants in case apex/https stalls
function buildUrlVariants(inputUrl) {
  try {
    const u = new URL(inputUrl);
    const host = u.hostname.startsWith("www.") ? u.hostname.slice(4) : u.hostname;
    const paths = u.pathname + (u.search || "");
    const candidates = [];

    // Keep scheme if provided
    candidates.push(`${u.protocol}//${u.hostname}${paths}`);

    // Swap scheme
    candidates.push(`${u.protocol === "https:" ? "http" : "https"}://${u.hostname}${paths}`);

    // Add/remove www.
    candidates.push(`${u.protocol}//www.${host}${paths}`);
    candidates.push(`${u.protocol === "https:" ? "http" : "https"}://www.${host}${paths}`);
    candidates.push(`https://${host}${paths}`);
    candidates.push(`http://${host}${paths}`);

    // De-dupe while preserving order
    return [...new Set(candidates)];
  } catch {
    // If not a full URL, assume https
    const normalized = `https://${inputUrl}`;
    return [normalized, normalized.replace("https://", "http://"), `https://www.${inputUrl}`, `http://www.${inputUrl}`];
  }
}

// Fallback fetch using native fetch (Node 18+)
async function fetchWithAbort(url, ms = 45000, headers = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      headers,
      redirect: "follow",
      signal: controller.signal,
    });
    if (!res.ok) {
      throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
    }
    return await res.text();
  } finally {
    clearTimeout(id);
  }
}

// Scrape readable text for URL mode
export async function fetchReadable(inputUrl) {
  const variants = buildUrlVariants(inputUrl);

  let html = null;
  let finalUrl = null;
  let lastErr = null;

  for (const url of variants) {
    try {
      // Try Axios first with retries
      const { data, request, config } = await withRetries(() => AXIOS.get(url), {
        retries: 2,
        baseDelayMs: 1000,
      });
      html = typeof data === "string" ? data : data?.toString("utf8");
      finalUrl = url;
      if (html && html.length) break;
    } catch (err1) {
      lastErr = err1;
      // Fallback to native fetch once per variant
      try {
        html = await fetchWithAbort(
          url,
          45000,
          AXIOS.defaults.headers.common
        );
        finalUrl = url;
        if (html && html.length) break;
      } catch (err2) {
        lastErr = err2;
      }
    }
  }

  if (!html) {
    // Surface the most recent error with context
    const msg = lastErr?.message || String(lastErr);
    const code = lastErr?.code ? ` [${lastErr.code}]` : "";
    throw new Error(`Failed to fetch HTML after retries${code}: ${msg}`);
  }

  // Parse & extract readable content
  const dom = new JSDOM(html, {
    url: finalUrl,
    pretendToBeVisual: true, // helps some Readability heuristics
  });
  const doc = dom.window.document;

  const reader = new Readability(doc);
  const article = reader.parse();

  const title =
    doc.querySelector("title")?.textContent?.trim() ||
    article?.title ||
    "";

  const metaDescription =
    doc
      .querySelector('meta[name="description"], meta[property="og:description"]')
      ?.getAttribute("content") || "";

  const structuralText = [...doc.querySelectorAll("h1,h2,h3,p,li")]
    .map((n) => n.textContent?.trim())
    .filter(Boolean)
    .join("\n");

  const rawText = [article?.textContent || "", structuralText].join("\n");
  const text = rawText.replace(/\s+/g, " ").slice(0, 140000);

  return { title, metaDescription, text };
}
