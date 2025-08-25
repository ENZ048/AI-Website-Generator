// Two prompt builders: from URL (has website) and from seed (no website)
// Shape is tailored for your MaxReach clone.

const STRUCTURE_HINT = `
Use EXACTLY these keys (no extras, no comments):

{
  "header": { "logo"?: string, "companyName": string },
  "hero": {
    "badge"?: { "new"?: string, "welcome"?: string },
    "heading"?: { "prefix"?: string, "rotatingTexts"?: string[] },
    "description"?: string,
    "buttons"?: { "getStarted"?: string, "viewAchievements"?: string }
  },
  "workPrinciples": {
    "badge"?: string,
    "heading": string,
    "description"?: string,
    "statistics"?: [{ "value": string, "label": string }],
    "features"?: [{ "icon": string, "title": string, "description": string }]
  },
  "keyFeature": {
    "badge"?: string,
    "heading": { "prefix"?: string, "highlight"?: string, "suffix"?: string },
    "description": string,
    "button"?: string
  },
  "whyUs": {
    "badge"?: string,
    "heading": { "prefix"?: string, "rotatingTexts"?: string[] },
    "description"?: string,
    "features"?: [{ "icon": string, "title": string, "description": string }]
  },
  "statsCounter": {
    "statistics": [{ "value": string, "suffix"?: string, "label": string }]
  },
  "offeringsGrid": {
    "badge"?: string, "heading": string, "description"?: string,
    "services": [{ "icon": string, "title": string, "description": string }]
  },
  "threeSteps": {
    "badge"?: string, "heading": string, "description"?: string,
    "steps": [{ "icon": string, "title": string, "description": string }]
  },
  "ourAdvantages": {
    "badge"?: string, "heading": string, "description"?: string,
    "advantages": [{
      "title": string, "description"?: string, "rating"?: string, "showStars"?: boolean, "phone"?: string, "button"?: string,
      "visualElement"?: { "type": string, "title"?: string, "button"?: string, "people"?: string,
        "metrics"?: [{ "type": string, "value": string }] }
    }]
  },
  "testimonials": {
    "badge"?: string, "heading": string, "description"?: string,
    "testimonials": [{ "rating": number|string, "quote": string }]
  },
  "maxReachAdvantage": { "heading": string, "description"?: string, "benefits"?: string[], "button"?: string },
  "faq": {
    "leftSection": { "heading": string, "description"?: string, "button"?: string },
    "faqItems": [{ "id": number|string, "question": string, "answer": string }]
  },
  "footer": {
    "logo"?: string, "companyName": string,
    "branding"?: { "tagline"?: string, "heading"?: { "prefix"?: string, "highlight"?: string }, "connect"?: string },
    "navigation"?: { "services"?: string[], "company"?: string[], "support"?: string[] }
  },
  "advantageBar": { "text": string, "button"?: string },
  "featureGrid": { "features": [{ "title": string, "desc": string }] }
}
`;

const BASE_RULES = `
Rules:
- ORIGINAL, concise copy aligned to the brand/industry. No copy-paste.
- Use Feather icon names like "FiZap", "FiEdit3", "FiSettings".
- Keep metrics as strings where shown (e.g., "3k+").
- Return VALID JSON ONLY (no markdown).
`;

export function promptFromUrl({ url, title, metaDescription, text, industry }) {
  return `
You are filling content for a website clone (industry: "${industry}").
Use the source site to infer tone, offers, and services.

Context:
- URL: ${url}
- Title: ${title || "N/A"}
- Meta: ${metaDescription || "N/A"}

SOURCE (trimmed):
"""
${text}
"""

${STRUCTURE_HINT}
${BASE_RULES}
`;
}

export function promptFromSeed({ companyName, industry }) {
  return `
You are creating ORIGINAL content for a website clone. There is NO existing website.
Use best practice copy for the "${industry}" industry tailored to "${companyName}".

${STRUCTURE_HINT}
${BASE_RULES}
`;
}
