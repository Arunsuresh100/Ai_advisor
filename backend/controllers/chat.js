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

    // Optimized Search: Use Text Index for speed if keywords exist
    // 1. Parallel Retrieval Phase: Law & History
    const [relevantLaws, prevChat] = await Promise.all([
      keywords.length > 0 
        ? Law.find({ $text: { $search: keywords.join(' ') } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .limit(4)
            .lean()
        : Promise.resolve([]),
      chatId 
        ? Chat.findById(chatId).select('messages').lean() 
        : Promise.resolve(null)
    ]);

    let historyContext = "";
    if (prevChat) {
      historyContext = prevChat.messages.slice(-4)
        .map(m => `${m.role.toUpperCase()}: ${m.text.substring(0, 300)}`)
        .join("\n");
    }

    const cleanMsg = message.trim();
    let aiResponse = "";

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
      // 3. Final Response Generation
      if (!process.env.GEMINI_API_KEY) {
        aiResponse = "Environment error: Missing Gemini API Key.";
      } else {
        try {
          const callWithRetry = async (fn, maxRetries = 1, baseDelay = 500) => {
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
            ? relevantLaws.map(l => `Sec ${l.section}: ${l.title} - ${l.description}`).join("\n\n")
            : "Focus on Indian Statutes.";

          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

          const prompt = `
            You are a Legal AI Assistant for the Indian Judicial System. 
            STRICT REQUIREMENT: As of 2026, the Indian Penal Code (IPC) has been replaced by the Bharatiya Nyaya Sanhita (BNS). You must never quote IPC sections unless specifically asked for historical context.

            Update your mapping for 'Offenses Against the Human Body' as follows:
            - Replace Section 299/300 IPC (Culpable Homicide/Murder) with Section 100/101 BNS.
            - Replace Section 302 IPC (Punishment for Murder) with Section 103 BNS.
            - Replace Section 304 IPC (Punishment for Culpable Homicide) with Section 105 BNS.
            - Replace Section 96-106 IPC (Private Defense) with Sections 34-44 BNS.

            When a user discloses a serious crime, prioritize: 
            1. Right to Silence (Art 20(3)) - Inform user they are not bound to incriminate themselves.
            2. Need for a Lawyer - Emphasize professional legal representation.
            3. BNS Legal Classification. 
            
            Maintain a professional, urgent, and cautious tone.

            Expert Indian Legal Assistant. Be concise. Structure:
            1. Problem: Short summary.
            2. Analysis: Cite BNS Sections (NOT IPC). Explain WHY.
            3. Steps: 3 bullet points.
            4. Disclaimer (MANDATORY): DISCLAIMER: I am an AI, not a lawyer. Educational use only. Consult an advocate.

            CONTEXT:
            ${context}

            HISTORY:
            ${historyContext || "Start."}

            QUERY: "${message}"
          `;

          console.log('Generating ultra-fast structured response...');
          const result = await callWithRetry(() => model.generateContent(prompt));
          aiResponse = result.response.text();
        } catch (aiErr) {
          console.error('AI Processing Failure:', aiErr.message);
          aiResponse = "I encountered a high-load error. Please try again in a few seconds.";
        }
      }
    }

    // 5. Fire-and-Forget Persistence: Respond immediately, save in background
    res.status(200).json({
      success: true,
      data: aiResponse,
      sources: relevantLaws.map(l => l.section)
    });

    // background Task: Save and generate metadata without blocking the response
    setImmediate(async () => {
      try {
        if (chatId) {
          const chat = await Chat.findById(chatId);
          if (chat && chat.user.toString() === req.user.id) {
            chat.messages.push({ role: 'user', text: message });
            chat.messages.push({ role: 'ai', text: aiResponse });
            await chat.save();
            
            // Professional Metadata (Only on first exchange)
            if (chat.messages.length === 2) {
               try {
                 const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                 const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
                 const metadataPrompt = `Analyze legal query and return JSON: {"title": "", "summary": "", "category": ""} for: "${message}"`;
                 const metaResult = await model.generateContent(metadataPrompt);
                 const metadata = JSON.parse(metaResult.response.text().replace(/```json|```/g, '').trim());
                 chat.title = metadata.title || chat.title;
                 chat.summary = metadata.summary || chat.summary;
                 chat.category = metadata.category || chat.category;
                 await chat.save();
               } catch (e) { console.error('BG Meta Err:', e.message); }
            }
          }
        }
      } catch (err) { console.error('BG Persistence Err:', err.message); }
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
    const history = await Chat.find({ user: req.user.id })
      .select('title summary category createdAt')
      .sort('-createdAt');
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
