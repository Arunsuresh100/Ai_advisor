const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function verifyLegalAccuracy() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return console.log("No API Key");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Simulate scenario: User asked about online theft before, now asks about the section
    const historyContext = "USER: my money was stolen online\nAI: # Problem Explanation: ... ### Legal Consequences: ...";
    const message = "what section they will charge?";
    
    // Scenarios where RAG found the law earlier
    const context = "Section 420 IPC: Cheating and dishonestly inducing delivery of property. Punishment: 7 years. Section 66D IT Act: Punishment for cheating by personation by using computer resource.";

    const prompt = `
            You are a "Law Advisor" who speaks like a helpful AI assistant (similar to ChatGPT). 
            Your goal is to make law very easy to understand for regular people.
            
            HISTORY:
            ---
            ${historyContext}
            ---

            CRITICAL RULES:
            1. **Explicit Sections**: You MUST mention the specific **Section Number** and **Law Name** (e.g., Section 420 IPC) and explain what it is for.
            2. **Simple Words**: Use extremely simple English (Grade 6 level).
            3. **STRUCTURE**:
               - **# Problem Explanation**: (ONLY include this if there is NO conversation history. If history is present, SKIP this section.)
               - ### Legal Consequences: (Mandatory: Mention the Section Number, Law Name, and Penalty clearly).
               - ### How to Approach It: (Simple steps to take)
            4. **CONVERSATIONAL HOOK**: You MUST end every response with a helpful question.

            QUERY: "${message}"

            LEGAL CONTEXT:
            ---
            ${context}
            ---
    `;

    console.log("Testing legal detail accuracy for: " + message);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("\n--- AI RESPONSE ---\n");
    console.log(text);
    console.log("\n--- END RESPONSE ---\n");

    const hasSpecificSection = text.includes("420") || text.includes("66D");
    if (hasSpecificSection) {
      console.log("✅ Success: Response includes specific section numbers.");
    } else {
      console.log("❌ Failure: Response missing section numbers.");
    }
  } catch (err) {
    console.error(err.message);
  }
}

verifyLegalAccuracy();
