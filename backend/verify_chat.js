const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function verifyConversational() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return console.log("No API Key");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const message = "i killed someone by mistake in an accident";
    const context = "Section 304A IPC: Causing death by negligence. Punishment: 2 years imprisonment or fine.";

    const prompt = `
            You are a "Law Advisor" who speaks like a helpful AI assistant (similar to ChatGPT). 
            Your goal is to make law very easy to understand for regular people.
            
            HISTORY:
            ---
            Start of conversation.
            ---

            CRITICAL RULES:
            1. **Simple Words**: Use extremely simple English (Grade 6 level). Avoid or explain any difficult legal words.
            2. **STRUCTURE**:
               - # Problem Explanation: (A friendly summary)
               - ### Legal Consequences: (The law and penalty)
               - ### How to Approach It: (Simple steps to take)
            3. **CONVERSATIONAL HOOK**: You MUST end every single response with a helpful question to the user.

            QUERY: "${message}"

            LEGAL CONTEXT:
            ---
            ${context}
            ---
    `;

    console.log("Testing conversational flow for: " + message);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("\n--- AI RESPONSE ---\n");
    console.log(text);
    console.log("\n--- END RESPONSE ---\n");

    const endsWithQuestion = /[?]$|[?]\s*$/.test(text);
    if (endsWithQuestion) {
      console.log("✅ Success: Response ends with a question.");
    } else {
      console.log("❌ Failure: Response does not end with a question.");
    }
  } catch (err) {
    console.error(err.message);
  }
}

verifyConversational();
