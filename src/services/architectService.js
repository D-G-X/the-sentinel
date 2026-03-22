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
You are a senior software architect
Analyze the PR changes based on the architecture rules. I am sure this has some issues please find

Focus on:
- Architecture violations
- Security issues (XSS, secrets, insecure protocol)
- Risky patterns (eval, innerHTML, redirects)

Architecture Rules:
${rules}

PR Changes:
${formattedFiles}

Architectural Drift Calculation Logic

After identifying violations, you must calculate a Drift Score (0 to 10) using the following weighted algorithm:

1. Assign Severity Weights:

CRITICAL: 4 points (e.g., Layer violations, forbidden imports)

HIGH: 3 points (e.g., Security risks, broken encapsulation)

MEDIUM: 2 points (e.g., Circular dependencies, missing guards)

LOW: 1 point (e.g., Naming convention warnings, missing documentation)

2. Scoring Formula:

Raw Score: Sum of all violation weights.

Normalized Score: (RawScore/20)×10.

Final Score: Cap the result at a maximum of 10.0 and round to one decimal place.

3. Risk Assessment Mapping:

Score ≥8: Critical Risk (Block Merge)

Score ≥5: High Risk (Requires Senior Review)

Score ≥3: Moderate Risk (Warning)

Score <3: Low Risk (Clean)

give me descriptive answer for:
- Drift Score and Assessment
- Issues Found
  - [File: name]
    - Issue:
    - Severity:
    - Fix:
- Summary
  - Total Issues:
  - Critical Issues:
`;

    const response = await promptGemini(prompt);
    return response;
  }
}

export default new ArchitectService();
