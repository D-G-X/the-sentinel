import architectService from "../services/architectService.js";

export async function analyzeCode(req, res) {
  try {
    const { prFiles, architectRules } = req.body;

    if (!prFiles || !Array.isArray(prFiles)) {
      return res.status(400).json({
        error: "Invalid input: prFiles array required"
      });
    }

    if (!architectRules) {
      return res.status(400).json({
        error: "Invalid input: architectRules required"
      });
    }

    const result = await architectService.analyzeArchitecture(prFiles, architectRules);

    res.json({
      success: true,
      analysis: result
    });

  } catch (error) {
    console.error("Analysis Error:", error);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
}