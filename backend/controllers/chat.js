const Law = require('../models/Law');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Get AI Advisor Response (RAG-Enabled)
// @route   POST /api/chat/query
// @access  Private
exports.queryAdvisor = async (req, res, next) => {
  try {
    const { message, chatId } = req.body;
    console.log('AI Consultation Query:', message);

    if (!message) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    // 1. Retrieval Phase: Search database for relevant legal context
    // Improved for follow-ups: Recognize procedural questions and carry over context
    const isBriefFollowUp = message.length < 50 && (
      /section|punishment|charge|law|penalty/i.test(message) || 
      /approach|handle|steps|do next|what to do|process/i.test(message)
    );
    let searchQuery = message;

    if (isBriefFollowUp && chatId) {
      const prevChat = await Chat.findById(chatId);
      if (prevChat && prevChat.messages.length > 0) {
        const lastUserMsg = prevChat.messages.slice().reverse().find(m => m.role === 'user');
        if (lastUserMsg) searchQuery = `${lastUserMsg.text} ${message}`;
      }
    }

    // Expert Tokenization
    const stopWords = ['i', 'me', 'my', 'the', 'a', 'an', 'someone', 'somebody', 'who', 'how', 'what', 'where', 'when', 'is', 'am', 'are', 'was', 'were', 'to', 'for', 'with', 'in', 'on', 'at'];
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word) && word.length > 2);

    let searchConditions = keywords.map(kw => ({
      $or: [
        { title: { $regex: kw, $options: 'i' } },
        { description: { $regex: kw, $options: 'i' } },
        { keywords: { $in: [new RegExp(kw, 'i')] } }
      ]
    }));

    let relevantLaws = [];
    if (searchConditions.length > 0) {
      relevantLaws = await Law.find({ $or: searchConditions }).limit(5);
    }
    
    // Recovery: If zero results found for a follow-up, try searching with ONLY previous context keywords
    if (relevantLaws.length === 0 && isBriefFollowUp && searchQuery !== message) {
       const backupKeywords = searchQuery.split(' ')[0].toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word) && word.length > 2);
       if (backupKeywords.length > 0) {
          relevantLaws = await Law.find({ 
            $or: backupKeywords.map(kw => ({ title: { $regex: kw, $options: 'i' } })) 
          }).limit(5);
       }
    }

    const cleanMsg = message.trim();

    // 2. Local Intent Filter (Saves Quota)
    const intentRules = [
      { pattern: /^(hello|hi|hey|greetings|namaste)/i, response: "Hello! I am your Law Advisor. How can I help you today?" },
      { pattern: /(i\s+)?hav[ea]?\s+(a\s+)?(legal\s+)?doubts?/i, response: "Ok, I am ready to help. Please tell me exactly what happened or what your specific legal doubt is so I can find the right laws for you." },
      { pattern: /who (are|is) (you|the advisor)/i, response: "I am your professional Law Advisor, here to guide you through legal procedures and documents." },
      { pattern: /^(help|what can you do)/i, response: "I can analyze legal queries, explain IPC sections, and guide you on legal procedures for various cases." }
    ];

    const matchedRule = intentRules.find(r => r.pattern.test(cleanMsg));
    if (matchedRule) {
      aiResponse = matchedRule.response;
    } else {
      // 3. Contextual History for AI (Principal Mode)
      let historyContext = "";
      if (chatId) {
        const chat = await Chat.findById(chatId);
        if (chat) {
          historyContext = chat.messages.slice(-6)
            .map(m => `${m.role.toUpperCase()}: ${m.text}`)
            .join("\n");
        }
      }

      // 4. Final Response Generation
      if (!process.env.GEMINI_API_KEY) {
        aiResponse = "Environment error: Missing Gemini API Key.";
      } else {
        try {
          const callWithRetry = async (fn, maxRetries = 2, baseDelay = 2000) => {
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
              try { return await fn(); } 
              catch (err) {
                if (err.message.includes('429') && attempt < maxRetries) {
                  await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)));
                  continue;
                }
                throw err;
              }
            }
          };

          const context = relevantLaws.length > 0 
            ? relevantLaws.map(l => `Section ${l.section} (${l.title}): ${l.description}`).join("\n\n")
            : "No specific local laws found. Use general legal knowledge focus on Indian Statutes.";

          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

          const prompt = `
            You are an AI Legal Assistant specializing in Indian Law. You are a knowledgeable legal guide, NOT a judge and NOT the user's attorney.

            ### CORE GUIDELINES & GUARDRAILS:
            1. **Civil vs. Criminal Distinction (CRITICAL)**: 
               - DO NOT cite Criminal Law (IPC/BNS) for business disputes, late deliveries, or breach of contract unless fraud, theft, or forgery is explicitly mentioned.
               - For unpaid loans or service delays, prioritize Civil Remedies (Indian Contract Act, Consumer Protection Act).
            2. **Avoid Assumptions**: Use neutral language. Do not assume guilt.
            3. **Intent (Mens Rea)**: Explain that for crimes like Theft, "Dishonest Intention" must exist.
            4. **No Absolutes**: Use probabilistic language like "You may be entitled to..." or "This is likely a violation of...". Never say "You will win".
            5. **Correction Rule**: If user says "Burglary", use the legal term "House-breaking (IPC Section 445)".

            HISTORY:
            ---
            ${historyContext || "Start of conversation."}
            ---

            STRUCTURE (MANDATORY HEADERS):
            **1. Problem Explanation**
            (Brief summary of issue in simple English)

            **2. Legal Analysis & Sections**
            (Cite specific laws like IPC, Indian Contract Act. Explain WHY they apply to these facts. Use Grade 6 English.)

            **3. Actionable Steps**
            (3-4 bullet points on next steps like 'Send Legal Notice' or 'Gather evidence'.)

            **4. Disclaimer**
            (You MUST end with the EXACT disclaimer text below.)

            QUERY: "${message}"

            LEGAL CONTEXT:
            ---
            ${context}
            ---

            MANDATORY DISCLAIMER:
            Disclaimer: I am an AI, not a lawyer. This information is for educational purposes only and does not constitute legal advice. Please consult a qualified advocate for your specific case.
          `;

          console.log('Generating advanced structured response...');
          const result = await callWithRetry(() => model.generateContent(prompt));
          aiResponse = result.response.text();
        } catch (aiErr) {
          console.error('AI Processing Failure:', aiErr.message);
          
          if (aiErr.message.includes('429')) {
            // Updated Local Failback matching new advanced structure
            const isFollowUp = historyContext && historyContext.length > 0;
            const disclaimerText = "Disclaimer: I am an AI, not a lawyer. This information is for educational purposes only and does not constitute legal advice. Please consult a qualified advocate for your specific case.";
            const disclaimer = `\n\n**4. Disclaimer**\n*${disclaimerText}*`;

            if (isFollowUp) {
               aiResponse = `**1. Problem Explanation**\nI understand we are continuing our discussion. Let's look at the legal steps for your situation.\n\n`;
            } else {
               aiResponse = `**1. Problem Explanation**\nI understand you are facing a legal concern. Even though my main AI core is busy, I have retrieved the most important information from our records to help you.\n\n`;
            }
            
            if (relevantLaws.length > 0) {
              aiResponse += `**2. Legal Analysis & Sections**\nBased on your query, the following laws may apply:\n`;
              relevantLaws.forEach(law => {
                aiResponse += `- **Section ${law.section}: ${law.title}**: This law typically covers ${law.description.substring(0, 100).toLowerCase()}...\n`;
              });
              aiResponse += `\n**3. Actionable Steps**\n- **Remain Calm**: Legal matters take time.\n- **Consult a Professional**: Speak to a qualified advocate.\n- **Document Everything**: Keep records of all interactions.`;
              aiResponse += disclaimer;
            } else {
              aiResponse = `**1. Problem Explanation**\nI couldn't find a direct match in my local law records for those specific words.\n\n**2. Legal Analysis & Sections**\nPlease provide more details about the situation (e.g., is it about a contract, a police matter, or a property dispute?) so I can assist better.\n\n**3. Actionable Steps**\n- Rephrase your query.\n- Wait for the AI core to recover.\n- Consult a lawyer if urgent.` + disclaimer;
            }
          } else {
            aiResponse = "I encountered an internal error. Please try again later.";
          }
        }
      }
    }

    // 5. Persistence: Save to Chat Session
    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (chat && chat.user.toString() === req.user.id) {
        chat.messages.push({ role: 'user', text: message });
        chat.messages.push({ role: 'ai', text: aiResponse });
        // Set the chat title if it's the first message
        if (chat.messages.length === 2 && chat.title === 'New Legal Consultation') {
          chat.title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
        }
        await chat.save();
      }
    }

    res.status(200).json({
      success: true,
      data: aiResponse,
      sources: relevantLaws.map(l => l.section)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'AI processing error: ' + err.message });
  }
};
// @desc    Get Chat History
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const history = await Chat.find({ user: req.user.id }).select('title createdAt').sort('-createdAt');
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create New Chat Session
// @route   POST /api/chat/new
// @access  Private
exports.createNewChat = async (req, res) => {
  try {
    const { title } = req.body;
    const newChat = await Chat.create({
      user: req.user.id,
      title: title || 'New Legal Consultation',
      messages: []
    });
    res.status(201).json({ success: true, data: newChat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Messages for a Specific Chat
// @route   GET /api/chat/:id
// @access  Private
exports.getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    res.status(200).json({ success: true, data: chat.messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
