// templates/digital-marketing/maxreach/prompt.js

// Shared schema-aligned structure hint
const STRUCTURE_HINT = `
You MUST return a single JSON object that EXACTLY matches the JSON Schema provided.
- All required keys MUST appear.
- No extra keys are allowed.
- Arrays MUST have the exact number of items specified in the schema (minItems = maxItems).
- Strings MUST respect maxLength constraints from the schema.
- If a value cannot be determined from context, return an empty string "" (but still include the key).
`;

// Rules to align output with schema
const BASE_RULES = `
Rules:
- Use ORIGINAL, professional, benefit-driven digital marketing copy.
- Keep tone persuasive yet credible.
- Do NOT add or rename keys.
- Do NOT add comments, markdown, or text outside the JSON object.
- Use only Feather icon names (react-icons/fi), e.g. "FiZap", "FiEdit3", "FiSettings".
- For statistics values/suffixes, keep numbers/units as strings to match schema.
- Keep array sizes EXACT: e.g. 4 steps, 8 FAQ items, 3 testimonials, etc.
- Keep within maxLength constraints by using concise, clear sentences.
- If unsure, output an empty string "" instead of skipping a field.
`;

// Minimal skeleton: ensures all keys present, arrays have exact lengths
const MINIMAL_SKELETON = JSON.stringify({
  header: { logo: "FiZap", companyName: "" },
  hero: {
    badge: { new: "", welcome: "" },
    heading: { prefix: "", rotatingTexts: ["", "", ""] },
    description: "",
    buttons: { getStarted: "", viewAchievements: "" }
  },
  workPrinciples: {
    badge: "",
    heading: "",
    description: "",
    statistics: [{ value: "", label: "" }, { value: "", label: "" }],
    features: [
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" }
    ]
  },
  keyFeature: {
    badge: "",
    heading: { prefix: "", highlight: "", suffix: "" },
    description: "",
    button: ""
  },
  whyUs: {
    badge: "",
    heading: { prefix: "", rotatingTexts: ["", ""] },
    description: "",
    features: [
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" }
    ]
  },
  statsCounter: {
    statistics: [
      { value: "", suffix: "", label: "" },
      { value: "", suffix: "", label: "" },
      { value: "", suffix: "", label: "" },
      { value: "", suffix: "", label: "" }
    ]
  },
  offeringsGrid: {
    badge: "",
    heading: "",
    description: "",
    services: [
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" }
    ]
  },
  threeSteps: {
    badge: "",
    heading: "",
    description: "",
    steps: [
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" },
      { icon: "FiZap", title: "", description: "" }
    ]
  },
  testimonials: {
    badge: "",
    heading: "",
    description: "",
    testimonials: [
      { rating: 5, quote: "" },
      { rating: 5, quote: "" },
      { rating: 5, quote: "" }
    ]
  },
  maxReachAdvantage: {
    heading: "",
    description: "",
    benefits: ["", "", ""],
    button: ""
  },
  faq: {
    leftSection: { heading: "", description: "", button: "" },
    faqItems: [
      { id: 1, question: "", answer: "" },
      { id: 2, question: "", answer: "" },
      { id: 3, question: "", answer: "" },
      { id: 4, question: "", answer: "" },
      { id: 5, question: "", answer: "" },
      { id: 6, question: "", answer: "" },
      { id: 7, question: "", answer: "" },
      { id: 8, question: "", answer: "" }
    ]
  },
  footer: {
    logo: "FiZap",
    companyName: "",
    branding: {
      tagline: "",
      heading: { prefix: "", highlight: "" },
      connect: ""
    },
    navigation: {
      services: ["", "", "", "", ""],
      company: ["", "", ""],
      support: ["", "", ""]
    }
  }
}, null, 2);

// Trim helper
function trimText(t = "", max = 120000) {
  return String(t).replace(/\s+/g, " ").slice(0, max);
}

export function buildPromptFromUrl({ url, title, metaDescription, text, industry }) {
  const safeText = trimText(text);
  return `
You are generating STRICT schema-aligned JSON for a website clone in the "${industry}" industry.

Source context:
- URL: ${url}
- Title: ${title || "N/A"}
- Meta: ${metaDescription || "N/A"}

SOURCE (trimmed):
"""
${safeText}
"""

${STRUCTURE_HINT}

Here is a minimal JSON skeleton to follow (all required keys present, arrays exact length):
${MINIMAL_SKELETON}

${BASE_RULES}
Return ONLY the final JSON object now.
`;
}

export function buildPromptFromSeed({ companyName, industry }) {
  return `
You are generating STRICT schema-aligned JSON for a new website clone in the "${industry}" industry.
There is no source website. Write original marketing copy for "${companyName}".

Brand seed:
- Company: ${companyName}
- Industry: ${industry}
- Voice: professional, credible, conversion-focused

${STRUCTURE_HINT}

Here is a minimal JSON skeleton to follow (all required keys present, arrays exact length):
${MINIMAL_SKELETON}

${BASE_RULES}
Return ONLY the final JSON object now.
`;
}
