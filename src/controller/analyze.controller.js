import { scanSecurity } from "../tasks/security/scanner.js";
import { enhanceIssue } from  '../tasks/gemini.service.js';

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
    // // 🧠 Step 2: AI enhancement
    // const enhanced = await Promise.all(
    //   issues.map(async (issue) => {
    //     const explanation = await enhanceIssue(issue);
    //     return {
    //       ...issue,
    //       explanation
    //     };
    //   })
    // );

    // // 📢 Step 3: return final response
    // res.json({
    //   success: true,
    //   issues: enhanced
    // });

  } catch (error) {
    console.error("❌ Analysis Error:", error);

    res.status(500).json({
      error: error.message || "Internal Server Error"
    });
  }
}