const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function verifyDynamicStructure() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Simulate history
    const historyContext = "USER: my funds were stolen online\nAI: # Problem Explanation: ... ### Legal Consequences: ...";
    const message = "what is the punishment specifically?";

    const prompt = `
            You are a "Law Advisor" who speaks like a helpful AI assistant (similar to ChatGPT). 
            Your goal is to make law very easy to understand for regular people.
            
            HISTORY:
            ---
            ${historyContext}
            ---

            CRITICAL RULES:
            1. **Simple Words**: Use extremely simple English (Grade 6 level).
            2. **STRUCTURE**:
               - **# Problem Explanation**: (ONLY include this if there is NO conversation history. If history is present, SKIP this section.)
               - ### Legal Consequences: (The law and penalty)
               - ### How to Approach It: (Simple steps to take)
            3. **CONVERSATIONAL HOOK**: You MUST end every response with a helpful question.

            QUERY: "${message}"

            LEGAL CONTEXT:
            ---
            Section 420 IPC: 7 years imprisonment.
            ---
    `;

    console.log("Testing Dynamic Structure (Follow-up)...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("\n--- AI RESPONSE ---\n");
    console.log(text);
    
    if (text.includes("# Problem Explanation")) {
      console.log("❌ Failure: 'Problem Explanation' should have been skipped.");
    } else {
      console.log("✅ Success: 'Problem Explanation' was correctly skipped in follow-up.");
    }

  } catch (err) {
    console.error(err.message);
  }
}

verifyDynamicStructure();
对比完毕。
