
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your AI Advisor, your personal legal research assistant. How can I assist you with legal guidance today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I am analyzing your query based on our legal database. This is a demonstration mode. Soon, I will be connected to the MERN backend to provide real legal insights.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-screen bg-mesh font-sans overflow-hidden flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col p-6 overflow-hidden">
        {/* Chat Header */}
        <div className="glass-card mb-6 p-6 flex items-center justify-between border-primary-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-green-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">AI Advisor</h2>
              <p className="text-xs text-primary-500 font-medium tracking-wide uppercase">Legal Intelligence Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <button className="px-4 py-2 border border-surface-border rounded-xl text-gray-400 hover:text-white transition-colors text-xs font-semibold">Clear History</button>
            <button className="px-4 py-2 bg-primary-600/10 border border-primary-500/30 rounded-xl text-primary-400 font-bold transition-all text-xs">Reference DB</button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar mb-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-primary-600 border-primary-500 text-white rounded-2xl rounded-tr-none shadow-lg' : 'glass-card text-gray-200 rounded-2xl rounded-tl-none border-surface-border'} p-4 animate-fade-in`}>
                <p className="leading-relaxed text-sm md:text-base font-medium">{msg.text}</p>
                <span className="text-[10px] opacity-50 block mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card p-4 rounded-2xl rounded-tl-none border-surface-border animate-pulse">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                   <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:200ms]"></div>
                   <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:400ms]"></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="glass-card p-4 border-primary-500/20">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Describe your legal concern..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-surface-background border border-surface-border rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
            />
            <button 
              onClick={handleSend}
              className="w-14 h-14 bg-primary-600 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary-600/20"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 text-center tracking-wide uppercase font-semibold">
            AI Advisor is an intelligent tool and should not replace professional legal advice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
