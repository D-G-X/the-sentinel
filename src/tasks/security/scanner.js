// src/tasks/security/scanner.js
import {detectInsecureWebSocket} from  './rules/websockets.js'
export function scanSecurity(files) {
  let results = [];

  const rules = [
    detectInsecureWebSocket,
    detectUnsafeJSONParse,
    detectInnerHTML,
    detectUnsafeNavigation,
    detectSensitiveLogging
  ];

  for (const file of files) {
    for (const rule of rules) {
      const issues = rule(file.content, file.path);
      results.push(...issues);
    }
  }

  return sortBySeverity(results);
}

// severity sorter
function sortBySeverity(issues) {
  const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

  return issues.sort((a, b) => order[b.severity] - order[a.severity]);
}