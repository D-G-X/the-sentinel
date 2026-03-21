import { getLineNumber } from "../utilities/helpers.js";

export function detectUnsafeJSONParse(code, file) {
  const issues = [];
  const regex = /JSON\.parse\(/g;

  let match;
  while ((match = regex.exec(code))) {
    issues.push({
      type: "UNSAFE_JSON_PARSE",
      severity: "MEDIUM",
      message: "Wrap JSON.parse in try/catch",
      file,
      line: getLineNumber(code, match.index)
    });
  }

  return issues;
}