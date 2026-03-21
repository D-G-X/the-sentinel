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
    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 30000);
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(
        () =>
          reject(
            new Error(`API call timeout after ${timeoutMs / 1000} seconds`),
          ),
        timeoutMs,
      );
    });

    const apiPromise = model.generateContent(prompt);

    let result;
    try {
      result = await Promise.race([apiPromise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId);
    }

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
