import { getLineNumber } from "../utilities/helpers.js";

export function detectSensitiveLogging(code, file) {
  const issues = [];
  const regex = /console\.log\((.*data.*)\)/g;

  let match;
  while ((match = regex.exec(code))) {
    issues.push({
      type: "SENSITIVE_LOGGING",
      severity: "LOW",
      message: "Avoid logging sensitive data",
      file,
      line: getLineNumber(code, match.index)
    });
  }

  return issues;
}