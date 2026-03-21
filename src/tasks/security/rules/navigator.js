import { getLineNumber } from "../utilities/helpers.js";

export function detectUnsafeNavigation(code, file) {
  const issues = [];
  const regex = /navigate\(\s*data\./g;

  let match;
  while ((match = regex.exec(code))) {
    issues.push({
      type: "OPEN_REDIRECT",
      severity: "HIGH",
      message: "Do not trust external input for navigation",
      file,
      line: getLineNumber(code, match.index)
    });
  }

  return issues;
}