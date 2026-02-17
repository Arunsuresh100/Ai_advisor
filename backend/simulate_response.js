const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function simulate() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const message = "What is the punishment for theft?";
    const context = "No direct matching laws found in the database. Provide general legal guidance based on common principles.";
    
    const prompt = `
      You are a professional Legal AI Advisor for an application called "AI Advisor".
      The user has asked the following legal query: "${message}"

      Here are some relevant sections from our legal database that might apply:
      ---
      ${context}
      ---

      Based on the provided laws, provide a human-like, empathic, and professional response. 
      If a specific law from the context applies, cite it clearly (e.g., "According to IPC Section...").
      Always include a disclaimer that this is for informational purposes only.
      Keep the response concise and formatted using Markdown.
    `;

    console.log("SIMULATION_START");
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    console.log("SIMULATION_END");
  } catch (err) {
    console.error("SIMULATION_ERROR:", err.message);
  }
}

simulate();
