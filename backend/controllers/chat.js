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

    // 0. Auto-Create Chat if missing
    let currentChatId = chatId;
    let chat = null;
    
    if (!currentChatId) {
      chat = await Chat.create({
        user: req.user.id,
        title: 'New Consultation',
        messages: []
      });
      currentChatId = chat._id;
    } else {
      chat = await Chat.findById(currentChatId);
    }

    // 1. Retrieval Phase: Search database for relevant legal context
    // Improved for follow-ups: Recognize procedural questions and carry over context
    const isBriefFollowUp = message.length < 50 && (
      /section|punishment|charge|law|penalty/i.test(message) || 
      /approach|handle|steps|do next|what to do|process|consequences|happens next/i.test(message)
    );
    let searchQuery = message;
    let activeCaseContext = null;

    if (currentChatId) {
      // Use the chat object we already fetched or created
      if (chat) {
         // Check for Active Case
         if (chat.activeCase && chat.activeCase.status === 'Open') {
            activeCaseContext = chat.activeCase;
            // If checking for follow-up on an active case, trust the active case context primarily
            if (isBriefFollowUp) {
               searchQuery = `${activeCaseContext.subject} ${message}`;
            }
         } else if (chat.messages.length > 0 && isBriefFollowUp) {
            // Fallback to last message if no formal active case
            const lastUserMsg = chat.messages.slice().reverse().find(m => m.role === 'user');
            if (lastUserMsg) searchQuery = `${lastUserMsg.text} ${message}`;
         }
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
      currentChatId 
        ? (chat ? Promise.resolve(chat) : Chat.findById(currentChatId).select('messages').lean())
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
    // BYPASS if there is an active case - serious context requires AI handling

    
    const intentRules = [
      { pattern: /^(hello|hi|hey|greetings|namaste)/i, response: "Hello! I am your Law Advisor. How can I help you today?" },
      { pattern: /(i\s+)?hav[ea]?\s+(a\s+)?(legal\s+)?doubts?/i, response: "Ok, I am ready to help. Please tell me exactly what happened or what your specific legal doubt is so I can find the right laws for you." },
      { pattern: /who (are|is) (you|the advisor)/i, response: "I am your professional Law Advisor, here to guide you through legal procedures and documents." },
      { pattern: /^(help|what can you do)/i, response: "I can analyze legal queries, explain BNS sections, and guide you on legal procedures for various cases." },
      { pattern: /thank/i, response: "You're welcome! Feel free to ask if you have more questions." }
    ];

    const matchedRule = intentRules.find(r => r.pattern.test(cleanMsg));
    if (matchedRule && !activeCaseContext) { // Only use local intent if NO active case
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
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
            
            IMPORTANT PERSONA INSTRUCTIONS (EXPLAIN LIKE I'M 5):
            1. SIMPLE LANGUAGE: You are a "Helpful Legal Guide", not a robot lawyer. Use plain English. Avoid legalese.
            2. TONE: Be calm, reassuring, and clear. Do not be overly dramatic.
            3. EXPLAIN CONCEPTS: If you use a legal term (e.g., "Culpable Homicide"), immediately explain it in simple words (e.g., "which means causing death but without the full intent of murder").

            MANDATORY STRUCTURE (Keep Accuracy, Improve Clarity):
            1. MEMORY RECALL: Check history. If they asked "What is the punishment?", answer for the crime they already confessed to.
            2. LOGIC LOCK: Treat follow-ups as a continuous conversation.
            3. VISUAL FLOW: Always show the path: [Incident] -> [Police Case (FIR)] -> [Investigation] -> [Court Trial] -> [Final Decision].
            4. EFFICIENCY: Use Bullet points. precise and easy to read.

            OUTPUT FORMAT:
            - Header: Simple summary of the situation.
            - The Law: Section 103 BNS (Murder) - Explain simply what it covers.
            - The Process: The Visual Flowchart.
            - Next Steps: 3 simple things to do (e.g., "Call a lawyer", "Don't speak until they arrive").

            ACTIVE CASE CONTEXT:
            ${activeCaseContext ? `[SUBJECT: ${activeCaseContext.subject}] [SEVERITY: ${activeCaseContext.severity}] - USER IS ASKING FOLLOW-UP.` : "Checking HISTORY for context..."}

            CONTEXT (Laws):
            ${context}

            HISTORY (Previous Conversation):
            ${historyContext || "ERROR: No History Found."}

            QUERY: "${message}"
          `;

          console.log('Generating ultra-fast structured response...');
          const result = await callWithRetry(() => model.generateContent(prompt));
          aiResponse = result.response.text();
        } catch (aiErr) {
          console.error('AI Processing Failure:', aiErr.message);
          if (aiErr.message.includes('429')) {
            aiResponse = "The AI service is currently at maximum capacity (Quota Exceeded). Please wait a minute before trying again.";
          } else {
            aiResponse = "I encountered an error processing your request. Please try again in a few seconds.";
          }
        }
      }
    }

    // 5. Fire-and-Forget Persistence: Respond immediately, save in background
    res.status(200).json({
      success: true,
      data: aiResponse,
      chatId: currentChatId,
      sources: relevantLaws.map(l => l.section)
    });

    // background Task: Save and generate metadata without blocking the response
    setImmediate(async () => {
      try {
        if (currentChatId) {
          // If we created the chat in memory, we need to save messages to it. 
          // However, since setImmediate is async, it is safer to fetch again to avoid race conditions 
          // or use the instance if it's still valid. 
          const chatToUpdate = await Chat.findById(currentChatId);
          if (chatToUpdate && chatToUpdate.user.toString() === req.user.id) {
            chatToUpdate.messages.push({ role: 'user', text: message });
            chatToUpdate.messages.push({ role: 'ai', text: aiResponse });
            await chatToUpdate.save();
            
             // Professional Metadata & Active Case Analysis (Background)
             // We do this for EVERY pertinent message if it might be a new case
             try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                
                const analysisPrompt = `
                  Analyze the following user query and conversation to determine if a NEW legal case is being disclosed.
                  Query: "${message}"
                  Context: ${aiResponse.substring(0, 500)}
                  
                  Return ONLY JSON.
                  If a specific legal incident (crime, dispute) is disclosed, fill "activeCase".
                  If it's just general talk, leave "activeCase" null.
                  
                  Structure:
                  {
                    "title": "Short chat title",
                    "summary": "One line summary",
                    "category": "Civil/Criminal/etc",
                    "activeCase": {
                      "subject": "e.g. Murder, Theft",
                      "description": "Short details",
                      "severity": "High/Medium/Low"
                    } (OR null)
                  }
                `;
                
                const metaResult = await model.generateContent(analysisPrompt);
                const match = metaResult.response.text().match(/\{[\s\S]*\}/);
                const jsonStr = match ? match[0] : "{}";
                const metadata = JSON.parse(jsonStr);
                
                if (chatToUpdate.messages.length <= 2) {
                   chatToUpdate.title = metadata.title || chatToUpdate.title;
                   chatToUpdate.summary = metadata.summary || chatToUpdate.summary;
                   chatToUpdate.category = metadata.category || chatToUpdate.category;
                }
                
                // Update Active Case if detected
                if (metadata.activeCase) {
                   chatToUpdate.activeCase = {
                      ...metadata.activeCase,
                      status: 'Open'
                   };
                }
                
                await chatToUpdate.save();
             } catch (e) { console.error('BG Analysis Err:', e.message); }
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

// @desc    Delete Single Chat
// @route   DELETE /api/chat/:id
// @access  Private
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (chat.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await chat.deleteOne();
    res.status(200).json({ success: true, message: 'Chat removed', chatId: req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Clear All Chat History
// @route   DELETE /api/chat/history/clear
// @access  Private
exports.clearChatHistory = async (req, res) => {
  try {
    await Chat.deleteMany({ user: req.user.id });
    res.status(200).json({ success: true, message: 'All history cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
