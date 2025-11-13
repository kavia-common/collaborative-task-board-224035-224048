import DOMPurify from "dompurify";

/**
 * Utility helpers used across the app.
 */

// PUBLIC_INTERFACE
export function sanitizeText(input, maxLen = 256) {
  const trimmed = String(input || "").slice(0, maxLen);
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

// PUBLIC_INTERFACE
export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

// PUBLIC_INTERFACE
export function calcProgress(grouped) {
  const total = Object.values(grouped || {}).flat().length;
  const completed = (grouped?.done || []).length;
  return {
    total,
    completed,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// PUBLIC_INTERFACE
export function notEmpty(val) {
  return val !== null && val !== undefined && String(val).trim() !== "";
}
