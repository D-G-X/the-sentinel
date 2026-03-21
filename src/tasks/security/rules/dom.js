import { createIssue, SEVERITY, ISSUE_TYPES } from "../types.js";

issues.push(
  createIssue({
    type: ISSUE_TYPES.XSS,
    severity: SEVERITY.CRITICAL,
    message: "Avoid innerHTML (XSS risk)",
    file,
    line: getLineNumber(code, match.index),
    codeSnippet: match[0]
  })
);