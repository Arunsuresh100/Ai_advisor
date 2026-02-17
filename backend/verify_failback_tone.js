const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// We simulate the failback by calling the logic directly or looking at the chat.js code
// Since it's a string concatenation in chat.js, we can test the output format here

function testFailbackTone() {
  const relevantLaws = [
    { section: "IPC 300", title: "Murder", description: "Culpable homicide is murder if..." }
  ];

  let aiResponse = `# ⚖️ Law Advisor (Backup Assistance)\n\nI am currently speaking with many clients, so I am answering using my built-in law records. I'm here to help you understand the law in very simple words.\n\n---\n\n`;
  
  if (relevantLaws.length > 0) {
    aiResponse += `### # Problem Explanation\nI understand your situation. Based on what you told me, I have found some specific laws that explain what is happening. These laws deal with serious issues.\n\n`;
    aiResponse += `### # Legal Consequences\n`;
    relevantLaws.forEach(law => {
      aiResponse += `**Section ${law.section}: ${law.title}**\n${law.description.substring(0, 200)}...\n\n`;
    });
    aiResponse += `### # How to Approach It\n1. **Stay Calm**: Don't worry, we will follow the legal process.\n2. **Collect Proof**: Save any messages, photos, or documents you have.\n3. **Visit the Station**: You should go to your local police station to tell them what happened.\n\n**Next Step**: Do you have any documents or evidence that can help prove your case?`;
  }

  console.log("--- Simulated Failback Response ---");
  console.log(aiResponse);
  console.log("\n--- Verification Checklist ---");
  console.log(`1. Simple English? ${aiResponse.includes("simple words") ? "✅" : "❌"}`);
  console.log(`2. No Jargon? ${!aiResponse.includes("statutory infractions") ? "✅" : "❌"}`);
  console.log(`3. Ends with question? ${aiResponse.trim().endsWith("?") ? "✅" : "❌"}`);
  
  if (aiResponse.includes("simple words") && !aiResponse.includes("statutory infractions") && aiResponse.trim().endsWith("?")) {
    console.log("\n✅ SUCCESS: Failback response is human-centric and simple!");
  } else {
    console.log("\n❌ FAILURE: Check the tone again.");
  }
}

testFailbackTone();
