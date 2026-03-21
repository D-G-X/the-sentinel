import { scanSecurity } from "../tasks/security/scanner.js";

export async function analyzeCode(req, res) {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({
        error: "Invalid input: files array required"
      });
    }

    // 🔐 Step 1: deterministic security scan
    const issues = await scanSecurity(files);
    res.json({
      success:true,
      issues: issues
    })
  //  Only after getting the issues call the gemini api to send the prompt with the issues

  } catch (error) {
    console.error("❌ Analysis Error:", error);

    res.status(500).json({
      error: error.message || "Internal Server Error"
    });
  }
}