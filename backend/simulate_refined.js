const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function simulateRefined() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Testing Identity
    console.log("--- TEST: Who are you? ---");
    const resWho = await model.generateContent("who are you?");
    console.log(resWho.response.text());

    // Testing Specific Theft Query
    console.log("\n--- TEST: Punishment for theft? ---");
    const prompt = `
          You are a professional "Law Advisor" specializing in legal analysis. 
          When users ask who you are, always identify yourself as their "Law Advisor".

          Your goal is to provide simple, understandable, and highly specific legal guidance.
          For every query, ensure you:
          1. Mention relevant IPC (Indian Penal Code) or local sections clearly (e.g., "Under IPC Section 379...").
          2. State specific punishments clearly, such as "3 years of imprisonment and/or a fine".
          3. Use a helpful, empathic, and professional tone.
          4. Use Markdown for formatting:
             - Use '#' for main headings (e.g., # Punishment for Theft).
             - Make important terms **bold**.
             - Avoid unnecessary symbols or 'AI Advisor' branding.

          The user has asked the following legal query: "What is the punishment for theft?"

          Here is relevant context from our database:
          ---
          No direct matching laws found in the database. Provide general legal guidance based on common principles.
          ---

          Always include a disclaimer that this is for informational purposes only and they should consult a professional lawyer for legal action.
    `;
    const resTheft = await model.generateContent(prompt);
    console.log(resTheft.response.text());
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

simulateRefined();
