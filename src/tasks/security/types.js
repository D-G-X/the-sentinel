// src/tasks/security/types.js

export const SEVERITY = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW"
};

export const ISSUE_TYPES = {
  XSS: "XSS_RISK",
  JSON_PARSE: "UNSAFE_JSON_PARSE",
  WEBSOCKET: "INSECURE_WEBSOCKET",
  NAVIGATION: "OPEN_REDIRECT",
  LOGGING: "SENSITIVE_LOGGING"
};

export const SEVERITY_ORDER = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

export function createIssue({
  type,
  severity,
  message,
  file,
  line,
  codeSnippet = ""
}) {
  return {
    type,
    severity,
    message,
    file,
    line,
    codeSnippet,
    source: "SECURITY_ENGINE",
    timestamp: new Date().toISOString()
  };
}