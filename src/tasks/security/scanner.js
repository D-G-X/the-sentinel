// src/tasks/security/scanner.js
import { checkVulnerabilityOSV } from "./osv.service.js";
import { detectUnsafeJSONParse } from './rules/json.js';

export async function scanSecurity(files) {
  const issues = [];

  for (const file of files) {
    try {
      if (!file || typeof file !== "object") continue;

      const { filename, content } = file;
      if (!content || typeof content !== "string") continue;

      // 🔐 JSON.parse detector
      const jsonIssues = detectUnsafeJSONParse(content, filename);
      issues.push(...jsonIssues);

      // 📦 OSV dependency scan
      if (filename.endsWith("package.json")) {
        let parsed;

        try {
          parsed = JSON.parse(content);
        } catch {
          continue;
        }

        const dependencies = {
          ...(parsed.dependencies || {}),
          ...(parsed.devDependencies || {})
        };

        for (const [lib, version] of Object.entries(dependencies)) {
          const cleanVersion = version.replace("^", "").replace("~", "");

          const vulns = await checkVulnerabilityOSV(lib, cleanVersion);

          if (vulns.length > 0) {
            issues.push({
              file: filename,
              type: "VULNERABILITY",
              library: lib,
              version: cleanVersion,
              severity: "HIGH",
              message: vulns[0].summary || "Known vulnerability",
              fix: "Update to latest secure version"
            });
          }
        }
      }

    } catch (err) {
      console.error("❌ Scan error:", err);
    }
  }

  return issues;
}