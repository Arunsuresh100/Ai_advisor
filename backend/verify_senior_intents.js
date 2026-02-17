const intentRules = [
  { pattern: /^(hello|hi|hey|greetings|namaste)/i, response: "Hello! I am your Law Advisor. How can I help you today?" },
  { pattern: /(i )?ha(v|v)a? (a )?doubt/i, response: "Ok, please ask your doubt." },
  { pattern: /who (are|is) (you|the advisor)/i, response: "I am your professional Law Advisor, here to guide you through legal procedures and documents." },
  { pattern: /^(help|what can you do)/i, response: "I can analyze legal queries, explain IPC sections, and guide you on legal procedures for various cases." }
];

function test(msg) {
  const matchedRule = intentRules.find(r => r.pattern.test(msg));
  if (matchedRule) {
    console.log(`Input: "${msg}" -> Local Match: "${matchedRule.response}"`);
    return true;
  }
  console.log(`Input: "${msg}" -> No Local Match (Will call AI)`);
  return false;
}

console.log("--- Testing Senior-Grade Fuzzy Intent Filter (English Only) ---");
test("Hello");
test("hi advisor");
test("i hava a doubt"); // catching the typo
test("hava doubt");
test("who are you?");
test("help me");
test("murder procedure"); // should NOT match
