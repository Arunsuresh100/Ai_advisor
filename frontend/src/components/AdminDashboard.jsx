
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, inbox
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null); // stores user object to delete
  const [showMsgDeleteModal, setShowMsgDeleteModal] = useState(null); // stores message object to delete
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [inboxFilter, setInboxFilter] = useState('all'); // all, pending, replied

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [usersRes, messagesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/messages/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setUsers(usersRes.data.data);
      const fetchedMessages = messagesRes.data.data;
      setMessages(fetchedMessages);
      
      // Select first message by default if inbox is active and messages exist
      if (fetchedMessages.length > 0 && !selectedMessage) {
        setSelectedMessage(fetchedMessages[0]);
      }
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin data. Make sure you are logged in as the Super Admin (admin@gmail.com).');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    try {
      if (!replyText[messageId]) return;
      
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/messages/${messageId}/reply`, 
        { reply: replyText[messageId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedMessage = res.data.data;
      
      setMessages(messages.map(msg => 
        msg._id === messageId ? updatedMessage : msg
      ));
      
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(updatedMessage);
      }
      
      setReplyText({ ...replyText, [messageId]: '' });
      showToast('Response recorded and dispatched.');
    } catch (err) {
      showToast('Failed to send reply.', 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const remainingMessages = messages.filter(m => m._id !== messageId);
      setMessages(remainingMessages);
      
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(remainingMessages[0] || null);
      }
      
      showToast('Message removed from archives.');
      setShowMsgDeleteModal(null);
    } catch (err) {
      showToast('Failed to delete message.', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!showDeleteModal) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/messages/users/${showDeleteModal._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(u => u._id !== showDeleteModal._id));
      setShowDeleteModal(null);
      showToast(`${showDeleteModal.name} has been purged from the system.`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };
  const filteredMessages = (messages || []).filter(msg => {
    if (inboxFilter === 'pending') return !msg.isReplied;
    if (inboxFilter === 'replied') return msg.isReplied;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary-500/30 overflow-hidden">
      <Navbar />
      
      <div className="pt-24 flex h-screen overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 hidden lg:flex flex-col p-6 h-full">
          <div className="space-y-2 flex-1">
            {[
              { id: 'overview', label: 'Overview', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
              { id: 'users', label: 'Users', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
              { id: 'inbox', label: 'Inbox', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'inbox' && messages.length > 0 && !selectedMessage) {
                    setSelectedMessage(messages[0]);
                  }
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  activeTab === tab.id 
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">{tab.icon}</svg>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Refined Sidebar Branding Box */}
          <div className="mt-8 p-5 bg-white/[0.03] border border-white/5 rounded-3xl relative group overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-0.5">Verified Admin</p>
                <h4 className="text-sm font-bold text-white tracking-tight truncate">admin@gmail.com</h4>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors duration-700 -mr-8 -mt-8"></div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 lg:ml-0 overflow-y-auto ${activeTab === 'inbox' ? 'p-0' : 'p-6 md:p-12'} scroll-smooth`}>
          <div className={`${activeTab === 'inbox' ? 'h-full' : 'max-w-6xl mx-auto'}`}>
            {activeTab !== 'inbox' && (
              <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Management Portal</span>
                  </div>
                  <h1 className="text-5xl font-display font-bold text-white tracking-tighter leading-none">
                    {activeTab === 'overview' && <>Admin <span className="text-primary-500">Overview</span></>}
                    {activeTab === 'users' && <>User <span className="text-primary-500">Management</span></>}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Service Active
                  </span>
                  <span className="h-4 w-px bg-white/10"></span>
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </header>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-3xl mb-12 text-sm font-medium flex items-center gap-4 animate-shake">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            {/* Tab content with animations */}
            <div className={`animate-slide-up ${activeTab === 'inbox' ? 'h-full' : 'pb-24'}`}>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Members', value: users.length, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-blue-500/10 text-blue-500' },
                    { label: 'Platform Inquiries', value: messages.length, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', color: 'bg-emerald-500/10 text-emerald-500' },
                    { label: 'Awaiting Action', value: messages.filter(m => !m.isReplied).length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-amber-500/10 text-amber-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-[#0c0c0c] p-10 rounded-[40px] border border-white/5 relative group transition-all duration-500 hover:border-white/10">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                          <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-2xl`}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          </div>
                          <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest">Live Sync</div>
                        </div>
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{stat.label}</div>
                        <div className="text-6xl font-display font-bold text-white tracking-tighter">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="bg-[#0c0c0c] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-white/[0.02]">
                          <th className="px-10 py-7 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Access Profile</th>
                          <th className="px-8 py-7 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Security Role</th>
                          <th className="px-8 py-7 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Registration</th>
                          <th className="px-10 py-7 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">System Access</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gray-800 to-black border border-white/10 flex items-center justify-center text-primary-500 text-sm font-black shadow-inner">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-white tracking-tight">{user.name}</div>
                                  <div className="text-[11px] text-gray-500 font-medium tracking-wide">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                                user.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-xs font-bold text-gray-500 tracking-wide">
                              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-10 py-6 text-right">
                              {user.email !== 'admin@gmail.com' ? (
                                <button 
                                  onClick={() => setShowDeleteModal(user)}
                                  className="p-3 rounded-2xl bg-red-500/5 text-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 transform active:scale-90 group-hover:text-red-500/70"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              ) : (
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest px-4">Immortal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'inbox' && (
                <div className="flex h-full bg-[#050505]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-full text-center py-24">
                      <div className="w-24 h-24 bg-white/[0.02] rounded-3xl flex items-center justify-center text-gray-800 mb-8">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      </div>
                      <p className="text-gray-600 font-bold uppercase tracking-[0.4em] text-xs">No Pending Inquiries</p>
                    </div>
                  ) : (
                    <>
                      {/* Left Column: Message List */}
                      <div className="w-96 border-r border-white/5 flex flex-col h-full bg-[#0a0a0a]/50">
                        <div className="p-6 border-b border-white/5">
                          <h2 className="text-xl font-display font-bold text-white mb-4">Inbox</h2>
                          <div className="flex bg-white/[0.03] p-1 rounded-xl mb-4 border border-white/5">
                            {['all', 'pending', 'replied'].map((f) => (
                              <button
                                key={f}
                                onClick={() => setInboxFilter(f)}
                                className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                  inboxFilter === f ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-300'
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="Search conversations..." 
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            />
                            <svg className="w-4 h-4 text-gray-600 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                          {filteredMessages.map((message) => (
                            <button
                              key={message._id}
                              onClick={() => setSelectedMessage(message)}
                              className={`w-full p-6 text-left border-b border-white/[0.02] transition-all hover:bg-white/[0.02] relative group ${
                                selectedMessage?._id === message._id ? 'bg-primary-500/[0.03]' : ''
                              }`}
                            >
                              {selectedMessage?._id === message._id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                              )}
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                  message.isReplied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {message.isReplied ? 'Replied' : 'Pending'}
                                </span>
                                <span className="text-[10px] text-gray-600 font-bold">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-white mb-1 truncate">{message.fullName}</h3>
                              <p className="text-[11px] text-gray-500 font-bold truncate mb-2">{message.subject}</p>
                              <p className="text-xs text-gray-600 line-clamp-1">{message.message}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Detailed Conversation */}
                      <div className="flex-1 flex flex-col h-full bg-[#050505]">
                        {selectedMessage ? (
                          <>
                            {/* Message Header */}
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]/30 backdrop-blur-3xl">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-black text-lg shadow-xl">
                                  {selectedMessage.fullName.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-xl font-display font-bold text-white tracking-tight">{selectedMessage.fullName}</h3>
                                  <p className="text-xs text-gray-500 font-bold tracking-wide">{selectedMessage.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => setShowMsgDeleteModal(selectedMessage)}
                                  title="Delete Message"
                                  className="p-3 rounded-xl bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all transform active:scale-95 group"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>

                            {/* Thread Area */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                              <div className="flex flex-col gap-8">
                                {/* Subject Plate */}
                                <div className="flex justify-center mb-4">
                                  <span className="px-5 py-2 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    Inquiry: {selectedMessage.subject}
                                  </span>
                                </div>

                                {/* User Message (Left) */}
                                <div className="flex flex-col items-start max-w-[80%]">
                                  <div className="flex flex-col items-start group">
                                    <div className="bg-[#111111] border border-white/5 p-8 rounded-[40px] rounded-tl-none text-gray-300 text-lg font-medium leading-relaxed shadow-2xl">
                                      "{selectedMessage.message}"
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4 ml-4">
                                      {selectedMessage.fullName} • {new Date(selectedMessage.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Conversational History (Admin Replies) */}
                                {selectedMessage.replies && selectedMessage.replies.map((reply, ridx) => (
                                  <div key={ridx} className="flex flex-col items-end max-w-[80%] self-end">
                                    <div className="flex flex-col items-end animate-fade-in">
                                      <div className="bg-primary-500/10 border border-primary-500/20 p-8 rounded-[40px] rounded-tr-none text-primary-100 text-lg font-medium leading-relaxed shadow-2xl ring-1 ring-primary-500/10">
                                        "{reply.text}"
                                      </div>
                                      <span className="text-[10px] text-primary-500/60 font-black uppercase tracking-widest mt-4 mr-4 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        Admin Response • {new Date(reply.date).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Reply Input Area (Always Visible for Multi-Reply) */}
                            <div className="p-8 bg-[#0a0a0a]/50 border-t border-white/5">
                              <div className="max-w-4xl mx-auto flex flex-col gap-4">
                                <div className="relative">
                                  <textarea 
                                    value={replyText[selectedMessage._id] || ''}
                                    onChange={(e) => setReplyText({ ...replyText, [selectedMessage._id]: e.target.value })}
                                    placeholder="Write a follow-up or response..."
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-[32px] px-8 py-6 text-white text-base focus:outline-none focus:border-primary-500 transition-all font-medium placeholder:text-gray-800 resize-none h-32 shadow-inner"
                                  ></textarea>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Supports multiple follow-up responses
                                  </p>
                                  <button 
                                    onClick={() => handleReply(selectedMessage._id)}
                                    className="bg-primary-600 hover:bg-primary-500 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-primary-600/20 text-xs uppercase tracking-widest active:scale-[0.98] transform hover:-translate-y-1"
                                  >
                                    Send Response
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 bg-white/[0.01] rounded-full border border-white/5 flex items-center justify-center text-gray-800 mb-6">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <h3 className="text-xl font-display font-bold text-gray-500 mb-2">Select a Conversation</h3>
                            <p className="text-xs text-gray-700 font-bold uppercase tracking-widest">Select an inquiry from the side to begin review</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modern User Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowDeleteModal(null)}></div>
          <div className="bg-[#0f0f0f] max-w-lg w-full p-12 rounded-[50px] border border-red-500/20 shadow-[0_0_100px_rgba(239,68,68,0.1)] relative z-10 animate-slide-up">
            <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 mx-auto mb-10 shadow-3xl shadow-red-500/10 border border-red-500/10">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-4xl font-display font-bold text-white text-center mb-6 tracking-tight">System <span className="text-red-500">Purge</span></h2>
            <p className="text-gray-500 text-center font-medium leading-relaxed mb-12 text-lg">
              Authorized admin, are you sure you want to permanently remove <span className="text-white font-black">{showDeleteModal.name}</span>? This recursive action is irreversible.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="py-5 rounded-3xl bg-white/5 text-gray-400 font-black hover:bg-white/10 hover:text-white transition-all text-xs uppercase tracking-[0.2em]"
              >
                Abort
              </button>
              <button 
                onClick={handleDeleteUser}
                className="py-5 rounded-3xl bg-red-600 text-white font-black hover:bg-red-500 transition-all shadow-2xl shadow-red-600/40 text-xs uppercase tracking-[0.2em] transform active:scale-95"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Message Confirmation Modal */}
      {showMsgDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowMsgDeleteModal(null)}></div>
          <div className="bg-[#0f0f0f] max-w-lg w-full p-12 rounded-[50px] border border-red-500/20 shadow-[0_0_100px_rgba(239,68,68,0.1)] relative z-10 animate-slide-up">
            <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 mx-auto mb-10 shadow-3xl shadow-red-500/10 border border-red-500/10">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h2 className="text-4xl font-display font-bold text-white text-center mb-6 tracking-tight">Archive <span className="text-red-500">Purge</span></h2>
            <p className="text-gray-500 text-center font-medium leading-relaxed mb-12 text-lg">
              Are you sure you want to permanently remove this inquiry from <span className="text-white font-black">{showMsgDeleteModal.fullName}</span>?
            </p>
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setShowMsgDeleteModal(null)}
                className="py-5 rounded-3xl bg-white/5 text-gray-400 font-black hover:bg-white/10 hover:text-white transition-all text-xs uppercase tracking-[0.2em]"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteMessage(showMsgDeleteModal._id)}
                className="py-5 rounded-3xl bg-red-600 text-white font-black hover:bg-red-500 transition-all shadow-2xl shadow-red-600/40 text-xs uppercase tracking-[0.2em] transform active:scale-95"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] animate-toast-up">
          <div className={`px-10 py-5 rounded-[32px] border flex items-center gap-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em]">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
