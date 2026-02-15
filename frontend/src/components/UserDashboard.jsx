
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-mesh font-sans text-white">
      <Navbar />
      <DashboardSidebar role="user" />
      
      <main className="pl-64 pt-20">
        <div className="p-8 max-w-7xl mx-auto">
          <header className="mb-12 animate-fade-in">
            <div className="flex items-center gap-4 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-500 text-[10px] font-bold uppercase tracking-widest">
                Account Active
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500 text-xs font-medium">Session Secure</span>
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Welcome back, <span className="text-gradient font-extrabold">{user?.name || 'Legal User'}</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium">Your AI-powered legal intelligence dashboard is ready.</p>
          </header>

          {/* Core AI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
            <div className="glass-card p-6 border-primary-500/10 group hover:border-primary-500/30 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Chat Consultations</div>
                <div className="p-2 rounded-lg bg-primary-600/10 text-primary-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 font-display">24</div>
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                +12% this week
              </div>
            </div>

            <div className="glass-card p-6 border-surface-border group hover:border-primary-500/30 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Drafts Generated</div>
                <div className="p-2 rounded-lg bg-white/5 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 font-display text-white/90">08</div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider italic">Legal Drafts ready for review</p>
            </div>

            <div className="glass-card p-6 border-primary-500/20 bg-gradient-to-br from-primary-950/10 to-transparent group hover:border-primary-500/40 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className="text-primary-400 text-[10px] font-bold uppercase tracking-widest">Base Subscription</div>
                <div className="p-2 rounded-lg bg-primary-600/20 text-primary-400 shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2 font-display text-white">Premium Tier</div>
             <div className="w-full bg-white/5 h-1 rounded-full mt-4">
                <div className="bg-primary-500 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
             </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up [animation-delay:200ms]">
            {/* Recent AI Advisor Activity */}
            <div className="lg:col-span-2 glass-card p-8 border-surface-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Advisor Sessions</h3>
                  <p className="text-xs text-gray-500 font-medium">Your recent legal queries and resolutions.</p>
                </div>
                <button className="text-xs font-bold text-primary-500 hover:text-primary-400 uppercase tracking-widest transition-colors">History</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: 'Intellectual Property Protection', date: '2 hours ago', status: 'Completed', color: 'bg-primary-500' },
                  { title: 'Drafting Employment Contract', date: 'Yesterday', status: 'Analyzed', color: 'bg-blue-500' },
                  { title: 'Tax Compliance Review', date: 'Feb 12, 2026', status: 'Pending', color: 'bg-yellow-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl border border-white/5 hover:border-primary-500/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-gray-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white group-hover:text-primary-400 transition-colors">{item.title}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${item.color}`}></span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor Call to Action */}
            <div className="glass-card p-8 border-primary-500/10 bg-gradient-to-b from-slate-900 to-primary-950/20 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 font-display text-white">Legal Consultation</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                  Experience professional-grade legal research. Our AI analyzes thousands of cases to provide precision guidance.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold">
                    <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Law Analysis
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold">
                    <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Draft Generation
                  </div>
                </div>
              </div>
              
              <Link to="/ai-advisor" className="premium-button w-full shadow-[0_10px_30px_-5px_rgba(34,197,94,0.3)] hover:shadow-primary-600/40">
                Lauch AI Advisor
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
