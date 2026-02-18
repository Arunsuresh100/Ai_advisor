
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account'); // Default to Account as requested
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isError, setIsError] = useState(false);

  // Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userMessages, setUserMessages] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Sync profile data when user context changes
  React.useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      fetchUserMessages();
    }
  }, [user]);

  const fetchUserMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages/my-messages', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setUserMessages(data.data);
        // Automatically select the first message if none selected
        if (data.data.length > 0 && !selectedInquiry) {
          // setSelectedInquiry(data.data[0]); // Optional: keep hidden initially
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const markAsSeen = async (msgId) => {
    try {
      await fetch(`http://localhost:5000/api/messages/${msgId}/seen`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUserMessages(prev => prev.map(m => m._id === msgId ? { ...m, userSeen: true } : m));
    } catch (err) {
      console.error('Failed to mark as seen:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsError(false);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: profileData.name })
      });

      const data = await response.json();

      if (data.success) {
        // Update context using the new updateUser function
        updateUser(data.data);
        
        let successMsg = 'Profile Name Updated Successfully';
        if (data._debug) successMsg += ` [Backend: ${data._debug}]`;
        
        setToastMsg(successMsg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Profile Update Failed:', err);
      setToastMsg(`Error: ${err.message}`);
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsError(false);

    if (profileData.newPassword !== profileData.confirmPassword) {
      setToastMsg('Passwords do not match');
      setIsError(true);
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setToastMsg('Password Updated Successfully');
        setShowToast(true);
        setProfileData({ ...profileData, currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      setToastMsg(err.message);
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete ALL chat history? This cannot be undone.')) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/chat/history/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setToastMsg('All History Cleared Successfully');
        setShowToast(true);
        localStorage.removeItem('currentChatId');
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(data.message || 'Deletion failed');
      }
    } catch (err) {
      setToastMsg(`Error: ${err.message}`);
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'cases':
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold font-display mb-8">My Cases</h2>
            <div className="space-y-4">
              {[
                { id: 'C-892', title: 'Labor Law Consultation', date: 'Feb 12, 2026', status: 'Active', category: 'Employment' },
                { id: 'C-885', title: 'Tenant Agreement Review', date: 'Feb 10, 2026', status: 'Resolved', category: 'Property' },
                { id: 'C-871', title: 'Start-up IP Strategy', date: 'Feb 05, 2026', status: 'Archived', category: 'Corporate' }
              ].map((c) => (
                <div key={c.id} className="glass-card p-6 flex items-center justify-between border-white/5 hover:border-primary-500/20 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-primary-500 text-xs shadow-inner">
                      {c.category.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{c.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{c.id}</span>
                        <span className="text-gray-700 text-xs">•</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{c.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      c.status === 'Active' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20' : 'bg-white/5 text-gray-500 border border-white/5'
                    }`}>
                      {c.status}
                    </span>
                    <button className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'vault':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold font-display">Digital Legal Vault</h2>
                <p className="text-gray-400 text-sm">Secure storage for your analyzed documents.</p>
              </div>
              <button className="premium-button px-6 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Upload Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Rent_Agreement_Draft.pdf', size: '2.4 MB', type: 'PDF' },
                { name: 'Notice_Reply_Police.docx', size: '1.1 MB', type: 'WORD' },
                { name: 'Business_Contract_V2.pdf', size: '4.8 MB', type: 'PDF' }
              ].map((file, i) => (
                <div key={i} className="glass-card p-6 border-white/5 hover:border-primary-500/20 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-primary-600/10 rounded-lg flex items-center justify-center text-primary-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <button className="text-gray-600 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <p className="font-bold text-gray-200 group-hover:text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{file.size} • {file.type}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="animate-fade-in flex flex-col h-[calc(100vh-180px)]">
            <header className="mb-8">
              <h2 className="text-3xl font-bold font-display">Support Hub</h2>
              <p className="text-gray-400 text-sm">Direct communication with our legal administrative team.</p>
            </header>

            <div className="flex-1 flex gap-8 overflow-hidden">
              {/* Message List */}
              <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {userMessages.length === 0 ? (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 text-center opacity-50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No Inquiries Found</p>
                  </div>
                ) : (
                  userMessages.map((msg) => (
                    <button 
                      key={msg._id}
                      onClick={() => {
                        setSelectedInquiry(msg);
                        if (!msg.userSeen) markAsSeen(msg._id);
                      }}
                      className={`p-5 rounded-2xl border transition-all text-left relative group ${
                        selectedInquiry?._id === msg._id 
                          ? 'bg-primary-600/10 border-primary-500/30' 
                          : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                      }`}
                    >
                      {!msg.userSeen && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></div>
                      )}
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{msg.subject}</p>
                      <p className="font-bold text-sm text-white truncate mb-2">{msg.message}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {/* Chat Thread */}
              <div className="flex-1 glass-card rounded-[40px] border-white/5 overflow-hidden flex flex-col bg-[#050505]/40 backdrop-blur-md">
                {selectedInquiry ? (
                  <>
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                      <h4 className="font-bold text-white text-lg">{selectedInquiry.subject}</h4>
                      <p className="text-xs text-gray-500 font-medium">Inquiry ID: {selectedInquiry._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                      {/* User Inquiry */}
                      <div className="flex flex-col items-end">
                        <div className="bg-white/10 p-5 rounded-3xl rounded-tr-none max-w-[80%] text-sm text-gray-200 border border-white/5">
                          {selectedInquiry.message}
                          <div className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-widest text-right">
                            Sent • {new Date(selectedInquiry.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Admin Replies */}
                      {selectedInquiry.replies?.map((reply, idx) => (
                        <div key={idx} className="flex flex-col items-start">
                          <div className="bg-primary-600/20 p-5 rounded-3xl rounded-tl-none max-w-[80%] text-sm text-primary-100 border border-primary-500/20 shadow-xl shadow-primary-900/10">
                            {reply.text}
                            <div className="text-[9px] text-primary-500/60 mt-2 font-black uppercase tracking-widest">
                              Admin • {new Date(reply.date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}

                      {selectedInquiry.replies?.length === 0 && (
                        <div className="py-12 text-center opacity-30">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Awaiting Admin Response</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    <p className="text-sm font-bold uppercase tracking-[0.3em]">Select an inquiry to view replies</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-3xl font-bold font-display mb-8">Account Settings</h2>
            
            {/* General Info Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-8 mb-12">
              <div className="flex items-center gap-8 p-6 glass-card rounded-3xl border-white/5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-3xl font-bold text-white shadow-2xl overflow-hidden ring-4 ring-white/5">
                    {profileData.name?.charAt(0) || 'U'}
                  </div>
                  <button type="button" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-widest text-white">
                    Change
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Personal Identifier</h4>
                  <p className="text-gray-500 text-sm">Update your public name and profile picture.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Identity Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Registered Email</label>
                  <input 
                    type="email" 
                    readOnly
                    value={profileData.email}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-gray-500 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="premium-button px-10 py-3 shadow-lg shadow-primary-600/20">Update Name</button>
              </div>
            </form>

            <div className="h-px bg-white/5 w-full my-12"></div>

            {/* Password Update Form */}
            <form onSubmit={handlePasswordUpdate} className="space-y-8">
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Security Credentials</h4>
              <div className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-[38px] text-gray-500 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.573 4.574m14.853 14.853l-5.307-5.307M19.543 12a10.051 10.051 0 001.562-3.029M16.125 5.587A10.07 10.07 0 0012 5c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 001.032 2.378" /></svg>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Min. 8 characters"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-[38px] text-gray-500 hover:text-white transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.573 4.574m14.853 14.853l-5.307-5.307M19.543 12a10.051 10.051 0 001.562-3.029M16.125 5.587A10.07 10.07 0 0012 5c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 001.032 2.378" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Selection</label>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Repeat new password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[38px] text-gray-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.573 4.574m14.853 14.853l-5.307-5.307M19.543 12a10.051 10.051 0 001.562-3.029M16.125 5.587A10.07 10.07 0 0012 5c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 001.032 2.378" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="premium-button px-10 py-3 shadow-lg shadow-primary-600/20">Change Password</button>
              </div>
            </form>

            <div className="h-px bg-white/5 w-full my-12"></div>

            {/* Data Management Section */}
            <div className="space-y-8">
               <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Data Management</h4>
               <div className="p-6 glass-card rounded-3xl border-red-500/20 bg-red-500/5 flex items-center justify-between">
                  <div>
                     <h4 className="font-bold text-lg text-red-400 mb-1">Clear Chat History</h4>
                     <p className="text-gray-500 text-sm">Permanently delete all your AI consultation records.</p>
                  </div>
                  <button 
                    onClick={handleClearHistory}
                    className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Delete All
                  </button>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-background font-sans text-white">
      <Navbar />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-slide-up">
          <div className={`${isError ? 'bg-red-500' : 'bg-emerald-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
            {isError ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            ) : (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            )}
            <span className="font-bold text-sm">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Modern Sidebar Integration */}
      <aside className="w-72 bg-surface-card border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 pt-24 z-40">
        <div className="flex-1 px-6 py-8 space-y-3">
          {[
            { id: 'account', label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'cases', label: 'My Cases', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'vault', label: 'Legal Vault', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
            { id: 'support', label: 'Support', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === link.id 
                  ? 'bg-primary-600/10 text-primary-500 border border-primary-500/20 shadow-lg shadow-primary-950/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
              </svg>
              {link.label}
              {link.id === 'support' && userMessages.some(m => !m.userSeen) && (
                <div className="ml-auto w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Profile Card Footer */}
        <div className="p-6 border-t border-white/5">
          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
              {profileData.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{profileData.name || 'Legal User'}</p>
              <p className="text-[10px] text-gray-500 font-bold truncate uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
      
      <main className="pl-72 pt-24 min-h-screen">
        <div className="p-12 max-w-6xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
