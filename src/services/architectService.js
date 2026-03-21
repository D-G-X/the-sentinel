import promptGemini from '../gemini/gemini_2.5_API.js';

// Service for analyzing architecture
class ArchitectService {
  // Function to generate prompt from files and architect rules, then call promptGemini
  async analyzeArchitecture(files, architectRules) {
    if (!files || files.length === 0) {
      return "No files to analyze";
    }

    const formattedFiles = files.map(f => `
File: ${f.filename}
Changes:
${f.patch || "No changes"}
`).join("\n");

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

Return in json format:
Issues Found
- [File: name]
  - Issue:
  - Severity:
  - Fix:
Summary
- Total Issues:
- Critical Issues:
`;

    return await promptGemini(prompt);
  }
}

export default new ArchitectService();