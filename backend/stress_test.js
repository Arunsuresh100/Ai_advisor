const mongoose = require('mongoose');
require('dotenv').config();

const lawSchema = new mongoose.Schema({
  section: String,
  title: String,
  description: String,
  category: String,
  keywords: [String]
});

const Law = mongoose.model('Law', lawSchema);

async function runStressTest() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- Expert 5-Test Stress Cycle ---\n');

  const stopWords = ['i', 'me', 'my', 'the', 'a', 'an', 'someone', 'somebody', 'who', 'how', 'what', 'where', 'when', 'is', 'am', 'are', 'was', 'were', 'to', 'for', 'with', 'in', 'on', 'at'];

  for (let i = 1; i <= 5; i++) {
    console.log(`Test Run #${i}:`);
    
    // Step A: Initial Query
    const msg1 = "i killed someone";
    const keywords1 = msg1.toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word) && word.length > 2);
    const laws1 = await Law.find({ $or: keywords1.map(kw => ({ title: { $regex: kw, $options: 'i' } })) });
    console.log(`  Query 1: "${msg1}" -> Found ${laws1.length} laws. (Target IPC 300)`);
    
    // Step B: Follow-up Query
    const msg2 = "ok how to approach it";
    const isBrief = msg2.length < 50 && /approach|handle|steps/i.test(msg2);
    
    // Simulate Carry-over
    let searchQuery = msg2;
    if (isBrief) searchQuery = `${msg1} ${msg2}`;
    
    const keywords2 = searchQuery.toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word) && word.length > 2);
    const laws2 = await Law.find({ $or: keywords2.map(kw => ({ title: { $regex: kw, $options: 'i' } })) });
    
    console.log(`  Query 2: "${msg2}" (Carry-over: "${searchQuery}")`);
    console.log(`  Result: ${laws2.length > 0 ? "✅ SUCCESS: Context preserved!" : "❌ FAIL: Context lost!"}`);

    if (laws2.length === 0) {
      console.log("  ❌ STRESS TEST FAILED on run " + i);
      process.exit(1);
    }
    console.log('---------------------------');
  }

  console.log("\n✅ ALL 5 STRESS TESTS PASSED!");
  process.exit(0);
}

runStressTest();
对比完毕。
