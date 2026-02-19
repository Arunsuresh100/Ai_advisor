const Law = require('../models/Law');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Get AI Advisor Response (RAG-Enabled)
// @route   POST /api/chat/query
// @access  Private
exports.queryAdvisor = async (req, res, next) => {
  try {
    const { message, chatId } = req.body;
    console.log(`[${new Date().toISOString()}] Incoming Query: "${message.substring(0, 50)}..." | ChatID: ${chatId}`);

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
      
      // Ownership Check: If chat exists but doesn't belong to user, treat as new chat
      if (chat && chat.user.toString() !== req.user.id) {
         console.warn(`Unauthorized chat access attempt by user ${req.user.id} on chat ${currentChatId}`);
         currentChatId = null;
         chat = null;
         // Create new chat instead
         chat = await Chat.create({
            user: req.user.id,
            title: 'New Consultation',
            messages: []
         });
         currentChatId = chat._id;
      }
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

      // 3. Final Response Generation
      if (!process.env.GEMINI_API_KEY) {
        aiResponse = "Environment error: Missing Gemini API Key.";
      } else {
        try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          
          // Model Fallback List - prioritization for speed/cost/availability
          const modelCandidates = [
             "gemini-flash-latest", 
             "gemini-1.5-flash",
             "gemini-2.0-flash-lite-preview-02-05"
          ];

          let lastError = null;
          let generatedDetails = null;

          // Attempt generation with fallbacks
          for (const modelName of modelCandidates) {
             if (generatedDetails) break; // Success
             
             try {
                console.log(`Attempting generation with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                const callWithRetry = async (fn, maxRetries = 3, baseDelay = 2000) => {
                  for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    try { return await fn(); } 
                    catch (err) {
                      // Retry on Quota (429) or Service Unavailable (503)
                      if ((err.message.includes('429') || err.message.includes('Quota') || err.message.includes('503')) && attempt < maxRetries) {
                        const delay = baseDelay * Math.pow(2, attempt);
                        console.log(`[${modelName}] Error ${err.message.split(' ')[0]}. Retrying in ${delay}ms...`);
                        await new Promise(r => setTimeout(r, delay));
                        continue;
                      }
                      throw err;
                    }
                  }
                };

                const context = relevantLaws.length > 0 
                  ? relevantLaws.map(l => `Sec ${l.section}: ${l.title} - ${l.description}`).join("\n\n")
                  : "General Indian Legal Context.";

                const prompt = `
                  IDENTITY & PERSONA:
                  You are "AI Advisor", a sophisticated "Legal Technologist" specializing in Indian Law (BNS, BNSS, Bharatiya Sakshya Adhiniyam).
                  - Role: You are an expert in legal documentation, regulatory compliance, and procedural law.
                  - Tone: Empathetic but Objective. Professional, precise, and clear.
                  - Jurisdiction: STRICTLY INDIAN LAW. Do not provide information on US, UK, or other foreign laws.

                  MANDATORY SAFETY GUARDRAILS (NON-NEGOTIABLE):
                  1. DISCLAIMER: If this is the START of a conversation (History is empty) or the user asks about your identity/qualifications, you MUST start your response with:
                     "I am AI Advisor, an AI legal tool, not a licensed attorney. This information is for educational purposes and does not constitute legal advice."
                  2. ANTI-HALLUCINATION: If a specific statute, section, or case law is not 100% verifiable in your training data or the provided context, state:
                     "I do not have the specific citation for that, but the general legal principle is..."
                     NEVER invent or guess at law names or section numbers.
                  3. OUT-OF-SCOPE FILTER: If the user asks for coding help, recipes, creative writing, or general trivia unrelated to law, polite decline:
                     "I am a Legal Technologist designed to assist with Indian Law. I cannot assist with non-legal queries."

                  RESPONSE STRUCTURE:
                  1. [Legal Analysis]: Identify the core legal issue under Indian Law.
                  2. [Relevant Statutes]: CITE specific sections of BNS/BNSS if confident.
                  3. [Procedural Steps]: Explain the "Legal Journey" (e.g., FIR -> Investigation -> Court).
                  4. [Documentation]: List specific documents or evidence needed.

                  CONTEXT (Laws found in database):
                  ${context}

                  HISTORY (Previous Conversation):
                  ${historyContext || "No previous history."}

                  ACTIVE CASE CONTEXT:
                  ${activeCaseContext ? `[SUBJECT: ${activeCaseContext.subject}] [STATUS: ${activeCaseContext.status}]` : "No active case context."}

                  USER QUERY: "${message}"

                  *** RETURN FORMAT ***
                  Return a SINGLE valid JSON object.
                  {
                    "answer": "Your full, formatted response (Markdown supported). Ensure the DISCLAIMER is included if required.",
                    "metadata": {
                      "title": "Short conversation title (max 5 words)",
                      "summary": "One sentence summary",
                      "category": "Criminal", // STRICTLY ONE OF: 'Civil', 'Criminal', 'Property', 'Cyber', 'Consumer', 'General'
                      "activeCase": {
                         "subject": "e.g. BNS 303 Theft",
                         "description": "Short incident summary",
                         "status": "Open",
                         "severity": "High/Medium/Low"
                      } (OR null)
                    }
                  }
                `;

                console.log('Generating structured response (Answer + Metadata)...');
                const result = await callWithRetry(() => model.generateContent(prompt));
                generatedDetails = result; // Mark success
             } catch (modelErr) {
                console.warn(`[${modelName}] Failed: ${modelErr.message}`);
                lastError = modelErr;
                // Loop continues to next model
             }
          }

          if (!generatedDetails) {
             throw lastError || new Error("All models failed.");
          }

          const textResponse = generatedDetails.response.text();
          
          // Parse JSON
          try {
             // Remove markdown code blocks if present
             const cleanJson = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
             const parsed = JSON.parse(cleanJson);
             aiResponse = parsed.answer;
             
             // Update chat metadata IMMEDIATELY if available
             if (chat && parsed.metadata) {
                // Update title if it's new OR default
                if (chat.messages.length <= 4 || chat.title.startsWith('New')) {
                   chat.title = parsed.metadata.title;
                   chat.summary = parsed.metadata.summary;
                   chat.category = parsed.metadata.category;
                }
                if (parsed.metadata.activeCase) {
                   chat.activeCase = parsed.metadata.activeCase;
                }
                await chat.save();
             }
          } catch (parseErr) {
             console.error('JSON Parse Error:', parseErr);
             aiResponse = textResponse; // Fallback to raw text if parsing fails
          }
        } catch (aiErr) {
          console.error('AI Processing Failure:', aiErr.message);
          if (aiErr.message.includes('429')) {
            aiResponse = "The AI service is currently at maximum capacity (Quota Exceeded). We are trying to scale, but please wait a minute before trying again.";
          } else {
            aiResponse = `System Error: ${aiErr.message}. Please report this code.`;
          }
        }
      }


    // 5. Save complete history (User message + AI Response)
    if (chat && chat.user.toString() === req.user.id) {
       chat.messages.push({ role: 'user', text: message });
       chat.messages.push({ role: 'ai', text: aiResponse });
       await chat.save();
    }

    res.status(200).json({
      success: true,
      data: aiResponse,
      chatId: currentChatId,
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
