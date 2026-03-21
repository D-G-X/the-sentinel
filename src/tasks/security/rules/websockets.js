// ✅ CORRECT
import { getLineNumber } from '../utils/helpers.js'

export function detectInsecureWebSocket(code, file) {
  const issues = [];

  // Detect ws:// usage (insecure WebSocket)
  const regex = /new\s+WebSocket\s*\(\s*['"`]ws:\/\//g;

  let match;
  while ((match = regex.exec(code))) {
    issues.push({
      type: "INSECURE_WEBSOCKET",
      severity: "HIGH",
      message: "Use wss:// instead of ws:// (unencrypted WebSocket connection)",
      file,
      line: getLineNumber(code, match.index),
      codeSnippet: match[0]
    });
  }

  return issues;
}