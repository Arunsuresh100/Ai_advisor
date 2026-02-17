const intentRules = [
  { pattern: /^(hello|hi|hey|greetings|namaste)/i, response: "Hello! I am your Law Advisor. How can I help you today?" },
  { pattern: /(i\s+)?hav[ea]?\s+(a\s+)?(legal\s+)?doubts?/i, response: "Ok, I am ready to help. Please tell me exactly what happened or what your specific legal doubt is so I can find the right laws for you." },
  { pattern: /who (are|is) (you|the advisor)/i, response: "I am your professional Law Advisor, here to guide you through legal procedures and documents." },
  { pattern: /^(help|what can you do)/i, response: "I can analyze legal queries, explain IPC sections, and guide you on legal procedures for various cases." }
];

const testCases = [
  "i have a doubt",
  "i hava a doubt",
  "have a doubt",
  "hava a doubt",
  " i have a doubt ",
  "I HAVE A DOUBT"
];

console.log("--- Expert Intent Verification ---");
testCases.forEach(msg => {
  const clean = msg.trim();
  const matched = intentRules.find(r => r.pattern.test(clean));
  if (matched) {
    console.log(`✅ MATCH: [${msg}] -> ${matched.response.substring(0, 20)}...`);
  } else {
    console.log(`❌ FAIL: [${msg}]`);
  }
});

const allPassed = testCases.every(msg => intentRules.find(r => r.pattern.test(msg.trim())));

if (allPassed) {
  console.log("\n✅ VERIFICATION COMPLETE: All greeting variants matched locally.");
} else {
  console.log("\n❌ VERIFICATION FAILED: Some variants missing.");
}
