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
            : "No specific local laws found. Use general legal knowledge.";

          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

          const prompt = `
            You are a Professional Law Advisor (ChatGPT-like persona).
            
            HISTORY:
            ---
            ${historyContext || "Start of conversation."}
            ---

            CRITICAL RULES:
            1. **Conditional Legal Info**: 
               - If the user has NOT provided details of a specific case or scenario, DO NOT provide "Legal Consequences" or "How to Approach It" sections. 
               - Instead, just ask them politely to share the details of their doubt or problem.
            2. **Explicit Sections**: If answering a specific case, you MUST mention the specific **Section Number** and **Law Name**.
            3. **Simple Words**: Use Grade 6 English.
            4. **STRUCTURE**:
               - **# Problem Explanation**: (Friendly summary. Skip if history is present.)
               - ### Legal Consequences: (Mandatory Section/Law/Penalty).
               - ### How to Approach It: (Simple steps).
            5. **CONVERSATIONAL HOOK**: End every response with a helpful question.

            QUERY: "${message}"

            LEGAL CONTEXT:
            ---
            ${context}
            ---
          `;

          console.log('Generating structured response with Resilience Layer...');
          const result = await callWithRetry(() => model.generateContent(prompt));
          aiResponse = result.response.text();
        } catch (aiErr) {
          console.error('Final Resilience Failure:', aiErr.message);
          
          if (aiErr.message.includes('429')) {
            // Empathetic Expert Local Failback logic
            const hasSeriousCrime = keywords.some(k => ['kill', 'killed', 'murder', 'stole', 'stolen', 'fraud', 'rape', 'assault'].includes(k));
            const isFollowUp = historyContext && historyContext.length > 0;

            if (isFollowUp) {
               aiResponse = `# ⚖️ Law Advisor (Follow-up Assistance)\n\nI understand. Let's look closer at your situation using our local records.\n\n---\n\n`;
            } else {
               aiResponse = `# ⚖️ Law Advisor (Professional Guidance)\n\nI am your Law Advisor. I understand this is a very serious and concerning situation for you. Even though my main AI core is busy, I have retrieved the most important information from our local legal database to help you immediately.\n\n---\n\n`;
            }
            
            if (relevantLaws.length > 0) {
              if (hasSeriousCrime && !isFollowUp) {
                aiResponse += `### # Regarding the Incident\nDealing with matters like this is the most serious thing under the law. It affects people's lives and property in a major way. I am here to guide you through the legal consequences step by step.\n\n`;
              } else if (!isFollowUp) {
                aiResponse += `### # Simple Explanation\nI understand your doubt. Based on our built-in records, here is how the law works for your situation in very simple words.\n\n`;
              }

              aiResponse += `### # Legal Consequences (Sections)\n`;
              relevantLaws.forEach(law => {
                aiResponse += `**Section ${law.section}: ${law.title}**\nThis law is used when ${law.description.substring(0, 150).toLowerCase()}... The punishment for this can be very serious.\n\n`;
              });

              aiResponse += `### # How to Handle This\n1. **Remain Calm**: Take a deep breath. We will follow the law to solve this.\n2. **Speak to Authority**: You should visit the nearest Police Station or your Lawyer as soon as possible.\n3. **Do Not Hide Facts**: Be completely honest when reporting what happened.\n\n**Lawyer's Question**: I am here to support you. Would you like me to explain exactly what happened next at the police station etc?`;
            } else {
              aiResponse += `I'm sorry, I couldn't find a direct match in my local law records for those specific words. \n\n**Could you please tell me more details about what happened so I can try searching again?**`;
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
