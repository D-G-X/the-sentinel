import promptGemini from "../gemini/gemini_2.5_API.js";

// Service for analyzing architecture
class ArchitectService {
  // Function to generate prompt from files and architect rules, then call promptGemini
  async analyzeArchitecture(files, architectRules) {
    if (!files || files.length === 0) {
      return "No files to analyze";
    }

    const formattedFiles = files
      .map(
        (f) => `
File: ${f.filename}
Changes:
${f.patch || "No changes"}
`,
      )
      .join("\n");

    const rules = JSON.stringify(architectRules, null, 2);

    const prompt = `
    ### Role
You are a Senior Software Architect and Security Auditor. Your goal is to strictly enforce the provided "Architecture Rules" and identify security vulnerabilities in Pull Request (PR) changes.

### 📋 Phase 1: Contextual Mapping (Internal Monologue)
Before generating the report, perform these steps internally:
1. Identify the 'Layer' of each file in the PR based on the 'path' defined in the Architecture Rules.
2. Check for 'forbidden_imports' for that specific layer.
3. Check for 'dependency_rules' violations.
4. Scan for Security Risks: XSS (innerHTML), Insecure Protocols (ws://), Unsanitized Inputs, and Open Redirects.

### 📊 Phase 2: Scoring Algorithm
Calculate the Drift Score using this EXACT logic:
1. **Weights:** CRITICAL: 4 | HIGH: 3 | MEDIUM: 2 | LOW: 1.
2. **Formula:** Normalized Score = Min((Sum of Weights / 20) * 10, 10).
3. **Risk Level:** 8+ (Critical), 5-7.9 (High), 3-4.9 (Moderate), <3 (Low).

### 🛠️ Input Data
**Architecture Rules:**
${rules}

**PR Changes (Diffs):**
${formattedFiles}

### 📝 Output Requirements (STRICT)
- Do not provide conversational filler. 
- You MUST find every violation present in the diff.
- If a layer is 'frontend', and it imports a 'forbidden_import', it is AUTOMATICALLY a CRITICAL issue.
- Use the Markdown format below exactly.

---

# 🏗️ Architecture Report
**Final Verdict:** [One sentence: e.g., "This PR introduces critical architectural drift and security vulnerabilities that must be resolved before merging."]

## 📊 Executive Summary
- **Drift Score:** [0.0 - 10.0]/10
- **Risk Level:** [Label from Mapping]
- 🚨 Critical: [Count]
- 🔴 High: [Count]
- 🟠 Medium: [Count]
- 🟡 Low: [Count]
- **Total Issues:** [Total Count]

---

## 🚨 Critical Issues
1. **[Violation Title]** ('[File Path]')
   - **Problem:** [Describe why it violates the specific rule in architecture.json]
   - **Fix:** [Specific code recommendation]

## 🔴 High Issues
1. **[Security/Pattern Title]** ('[File Path]')
   - **Problem:** [Describe the XSS, insecure protocol, or risky pattern]
   - **Fix:** [Specific remediation step]

## 🟠 Medium/🟡 Low Issues
[Group remaining issues here with clear headings]

## ⚠️ Pipeline Notice
- Architecture Scan: [Success/Fail]
- Rule Engine: v1.0.0
- Automated Review by: Arch-Guard AI

## Suggested next step
- [One concrete action, e.g., "Refactor the Socket hook to remove direct DOM manipulation and move DB imports to the backend."]
    `;

    const response = await promptGemini(prompt);
    return response;
  }
}

export default new ArchitectService();
