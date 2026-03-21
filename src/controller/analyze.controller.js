import { scanSecurity } from "../tasks/security/scanner.js";

export function analyzeCode(req, res) {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({
        error: "Invalid input: files array required"
      });
    }

    const issues = scanSecurity(files);

    res.json({
      success: true,
      issues
    });

  } catch (error) {
    console.error("❌ Analysis Error:", error);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
}