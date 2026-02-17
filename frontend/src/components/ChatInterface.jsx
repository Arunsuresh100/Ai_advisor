import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(localStorage.getItem('currentChatId') || null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check authentication and load initial data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchHistory();
      if (currentChatId) {
        loadChat(currentChatId);
      } else {
        // Initial greeting if no chat selected
        setMessages([{ 
          role: 'ai', 
          text: 'Hello! I am your AI Advisor. How can I assist you with legal queries today?', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
      }
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const loadChat = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/chat/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        setCurrentChatId(id);
        localStorage.setItem('currentChatId', id);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'New Legal Consultation' }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentChatId(data.data._id);
        localStorage.setItem('currentChatId', data.data._id);
        setMessages([]);
        fetchHistory();
      }
    } catch (err) {
      console.error('Failed to create new chat:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || loading) return;

    const userMessage = { 
      role: 'user', 
      text: input, 
      attachment: attachment ? attachment.name : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setAttachment(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // In a real scenario, we'd use FormData for attachments
      const response = await fetch('http://localhost:5000/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput, chatId: currentChatId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: data.data, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
      } else {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + (data.message || 'Verification failed') }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Cannot connect to the AI Advisor service. Please ensure the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-background font-sans text-white flex flex-col xl:flex-row overflow-hidden">
      <Navbar />
      
      {/* Premium Sidebar: The Legal Library */}
      <aside className="w-full xl:w-80 bg-surface-card/30 backdrop-blur-3xl border-r border-white/5 pt-28 pb-8 px-6 flex flex-col gap-8 hidden xl:flex relative z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary-500">Legal Vault</h3>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Active Sessions</p>
          </div>
          <button 
            onClick={handleNewChat}
            title="New Chat"
            className="p-2.5 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition-all border border-primary-500/20 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
        
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide relative z-10">
          {history.length === 0 ? (
            <div className="text-center py-10 opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">No History Yet</p>
            </div>
          ) : (
            history.map((chat) => (
              <button 
                key={chat._id} 
                onClick={() => loadChat(chat._id)}
                className={`w-full group text-left p-4 rounded-2xl text-xs font-bold transition-all border ${currentChatId === chat._id ? 'bg-primary-600/10 text-primary-400 border-primary-600/20 shadow-lg' : 'text-gray-500 border-transparent hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentChatId === chat._id ? 'bg-primary-500 animate-pulse' : 'bg-gray-700'}`}></div>
                  <span className="truncate">{chat.title}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Removed Upgrade to Pro Section */}
        <div className="relative z-10 pt-4 border-t border-white/5">
           <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                 <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-500">Security State</p>
                 <p className="text-[11px] font-bold text-white">Quantum Encrypted</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Sanctuary Interface */}
      <main className="flex-1 flex flex-col h-screen pt-20 xl:pt-0 relative overflow-hidden bg-surface-background">
        {/* Dynamic Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Integrated Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-surface-background/20 backdrop-blur-3xl flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
             <div className="hidden xl:block">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500/50 mb-1">Current File</p>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Consultation</h2>
             </div>
             <div className="h-8 w-[1px] bg-white/5 hidden xl:block"></div>
             <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></div>
                   <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary-500 animate-ping opacity-25"></div>
                </div>
                <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Neural Core Alpha-7 Online</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase text-gray-500">Latency</p>
                <p className="text-[11px] font-bold text-primary-500">24ms</p>
             </div>
             <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
             </button>
          </div>
        </div>

        {/* Sanctuary Message Stream */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-10 scrollbar-hide relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse animate-slide-up' : 'flex-row animate-slide-up'}`}>
                <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center text-[11px] font-black transition-transform hover:scale-110 shadow-2xl ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-surface-card text-primary-500 border border-white/10 shadow-primary-900/50'}`}>
                  {msg.role === 'user' ? user?.name?.[0]?.toUpperCase() : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  )}
                </div>
                <div className={`max-w-[80%] group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block px-8 py-5 rounded-[32px] text-base leading-relaxed font-medium transition-all duration-500 border ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none border-primary-500 hover:bg-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'bg-white/[0.03] backdrop-blur-2xl text-gray-300 border-white/5 rounded-tl-none hover:border-primary-500/30'
                  }`}>
                    {msg.attachment && (
                      <div className="mb-3 flex items-center gap-3 px-3 py-2 bg-black/20 rounded-xl border border-white/5 text-xs">
                         <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.486 8.486L20.5 13"/></svg>
                         <span className="truncate max-w-[150px]">{msg.attachment}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-3 mt-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{msg.time}</p>
                    {msg.role === 'ai' && (
                       <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                       </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-6 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center">
                   <svg className="w-5 h-5 text-primary-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-8 py-5 rounded-[32px] rounded-tl-none flex gap-3 items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-primary-500/50">Synthesizing Logic</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Global Input Console */}
        <div className="p-6 md:p-10 bg-surface-background/80 backdrop-blur-3xl border-t border-white/5 relative z-30">
          <div className="max-w-4xl mx-auto">
            {attachment && (
              <div className="mb-4 flex items-center gap-3 animate-slide-up">
                 <div className="px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-xl flex items-center gap-3">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.486 8.486L20.5 13"/></svg>
                    <span className="text-xs font-bold text-white max-w-[200px] truncate">{attachment.name}</span>
                    <button onClick={removeAttachment} className="ml-2 p-1 hover:bg-black/20 rounded-md transition-colors">
                       <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                 </div>
              </div>
            )}
            
            <form onSubmit={handleSend} className="relative group flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden" 
              />
              
              <div className="flex-1 relative group flex items-center">
                <div className="absolute inset-0 bg-primary-600/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-gray-500 hover:text-primary-400 z-20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.486 8.486L20.5 13"/></svg>
                </button>
                <textarea 
                  rows="1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Analyze legal documents or ask a complex query..."
                  className="w-full bg-surface-card border border-white/10 rounded-2xl pl-16 pr-16 py-5 text-base text-white focus:outline-none focus:border-primary-500/50 transition-all shadow-inner relative z-10 font-medium placeholder:text-gray-600 resize-none scrollbar-hide min-h-[64px] max-h-[200px]"
                />
                <button 
                  type="submit"
                  disabled={loading || (!input.trim() && !attachment)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center text-white hover:bg-primary-500 transition-all duration-500 shadow-xl shadow-primary-950/40 disabled:opacity-20 disabled:grayscale z-20 group/btn"
                >
                  <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
