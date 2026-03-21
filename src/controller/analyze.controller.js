import architectService from "../services/architectService.js";

export async function analyzeCode(req, res) {
  try {
    console.log("📡 Received /analyze request");
    
    // Get data from request body
    const { prFiles, architectRules } = req.body;

    // Validate inputs
    if (!prFiles || !Array.isArray(prFiles)) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid prFiles",
        message: "prFiles must be an array of file objects with filename and patch/diff properties"
      });
    }

    if (!architectRules) {
      return res.status(400).json({
        success: false,
        error: "Missing architectRules",
        message: "architectRules object is required"
      });
    }

    console.log(`✅ Analyzing ${prFiles.length} file(s)...`);
    
    const result = await architectService.analyzeArchitecture(prFiles, architectRules);

    // Parse result if it's a JSON string, otherwise treat as plain text
    let parsedResult = result;
    try {
      if (typeof result === 'string' && result.trim().startsWith('{')) {
        parsedResult = JSON.parse(result);
      }
    } catch (parseError) {
      // If parsing fails, keep as string
      console.log("Could not parse result as JSON, returning as text");
      parsedResult = result;
    }

    console.log("✅ Analysis complete");

    return res.status(200).json({
      success: true,
      analysis: parsedResult
    });

  } catch (error) {
    console.error("❌ Analysis Error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Analysis failed",
      message: error.message
    });
  }
}
