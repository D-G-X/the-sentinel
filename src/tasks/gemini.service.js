import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyCyHE1rgeXv2qrCFnVf_Or3_pJDaczfj-Y');

export async function enhanceIssue(issue) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are a security expert.

Issue:
${issue.message}

Library: ${issue.library || "N/A"}

Explain the risk and suggest a fix in simple terms.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}