import { scanSecurity } from "../tasks/security/scanner.js";
import promptGemini from "../gemini/gemini_2.5_API.js";

class SecurityService {
  async analyzeSecurity(files) {
    if (!files || files.length === 0) {
      return "No files to analyze";
    }

    const issues = await scanSecurity(files);

    if (issues.length == 0) {
      return "";
    }

    const prompt = `
        You are a senior security engineer reviewing a pull request.

        You are given a list of VERIFIED security issues detected by:
        - static code analysis
        - OSV vulnerability database

        These issues are FACTUAL. Do NOT question or modify them.
        Do NOT invent new issues.

        Your job is to generate a high-quality, developer-friendly security review with clear mitigation strategies.

        ---

        For EACH issue, provide:

        1. **What’s wrong**
        - Explain the issue clearly in simple terms

        2. **Why it matters**
        - Describe real-world impact (security risk, performance, exploitation)

        3. **Mitigation (VERY IMPORTANT)**
        - Be SPECIFIC and ACTIONABLE
        - For dependencies:
            - Suggest a SAFE version (e.g., upgrade from X → Y)
        - For code issues:
            - Provide a corrected code snippet

        4. **Confidence note**
        - Mention that this is based on verified data (no guessing)

        ---

        ## Output Format (STRICT)

        Use markdown exactly as follows:

        # 🏗️ Architecture & Security Review Report
        **Final Verdict:** <one-sentence summary>

        ## 📊 Executive Summary
        - 🚨 Critical: <count>
        - 🔴 High: <count>
        - 🟠 Medium: <count>
        - 🟡 Low: <count>
        - Total: <count>

        ---

        ## 🚨 Critical Issues
        1. **<Title>** ('<file path>')
           - Problem: <description>
           - Fix: <recommendation>
        2. ...

        ## 🔴 High Issues
        1. **<Title>** ('<file path>')
           - Problem: <description>
           - Fix: <recommendation>

        ## 🟠 Medium Issues
        1. ...

        ## 🟡 Low Issues
        1. ...

        ## ⚠️ Pipeline Notice
        - <pipeline scan details>

        ## Suggested next step
        - <concrete remediation step>

        ---

        ## IMPORTANT RULES

        - Do NOT hallucinate
        - Do NOT add new issues
        - Do NOT be vague
        - Always give actionable fixes
        - Prefer exact version upgrades when possible
        - Keep explanations concise but meaningful

        ---

        ## Input Data:
        ${issues}
    `;

    const response = await promptGemini(prompt);
    return response;
  }
}

export default new SecurityService();
