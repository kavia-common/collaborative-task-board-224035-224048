const LEVELS = ["debug", "info", "warn", "error"];
const envLevel = (process.env.REACT_APP_LOG_LEVEL || "info").toLowerCase();
const levelIdx = LEVELS.indexOf(envLevel) >= 0 ? LEVELS.indexOf(envLevel) : 1;

function mask(val) {
  if (!val) return val;
  const str = String(val);
  if (str.length <= 6) return "***";
  return str.slice(0, 3) + "***" + str.slice(-2);
}

// PUBLIC_INTERFACE
export const logger = {
  /** Structured debug log */
  debug(msg, meta = {}) {
    if (levelIdx <= 0) console.debug(struct(msg, "DEBUG", meta));
  },
  /** Structured info log */
  info(msg, meta = {}) {
    if (levelIdx <= 1) console.info(struct(msg, "INFO", meta));
  },
  /** Structured warn log */
  warn(msg, meta = {}) {
    if (levelIdx <= 2) console.warn(struct(msg, "WARN", meta));
  },
  /** Structured error log */
  error(msg, meta = {}) {
    if (levelIdx <= 3) console.error(struct(msg, "ERROR", meta));
  },
};

function struct(message, level, meta) {
  const safeMeta = safe(maskSensitive(meta));
  return {
    timestamp: new Date().toISOString(),
    level,
    service: "task-board-frontend",
    message,
    ...safeMeta,
  };
}

function maskSensitive(meta) {
  if (!meta || typeof meta !== "object") return {};
  const out = {};
  for (const k of Object.keys(meta)) {
    const v = meta[k];
    if (k.toLowerCase().includes("key") || k.toLowerCase().includes("token")) {
      out[k] = mask(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function safe(obj) {
  try {
    JSON.stringify(obj);
    return obj;
  } catch {
    return { note: "unserializable meta" };
  }
}
