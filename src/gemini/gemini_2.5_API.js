import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { removeUntilFirstMarker } from "../tasks/security/utils/helpers.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL_NAME,
});

async function promptGemini(prompt) {
  try {
    const apiPromise = model.generateContent(prompt);
    const result = await Promise.race([apiPromise]);

    const text = result.response.text();

    return removeUntilFirstMarker(text, "###");
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    return {
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
}

export default promptGemini;
