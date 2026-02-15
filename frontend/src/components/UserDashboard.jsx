
import React from 'react';
import Navbar from './Navbar';
import DashboardSidebar from './DashboardSidebar';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans">
      <Navbar />
      <DashboardSidebar role="user" />
      
      <main className="pl-64 pt-20">
        <div className="p-8 max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-display font-bold mb-2">Welcome back, <span className="text-gradient">Legal User</span></h1>
            <p className="text-gray-400">Here's what's happening with your legal research and cases.</p>
          </header>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-8 border-primary-500/10">
              <div className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-2">Active Inquiries</div>
              <div className="text-3xl font-bold mb-4 font-display">12</div>
              <div className="w-full bg-surface-background h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-600 h-full w-2/3 shadow-lg shadow-primary-600/50"></div>
              </div>
            </div>
            <div className="glass-card p-8 border-surface-border">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Documents Analyzed</div>
              <div className="text-3xl font-bold mb-4 font-display">48</div>
              <div className="w-full bg-surface-background h-1.5 rounded-full overflow-hidden">
                <div className="bg-gray-700 h-full w-4/5"></div>
              </div>
            </div>
            <div className="glass-card p-8 border-surface-border">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Legal Base Access</div>
              <div className="text-3xl font-bold mb-4 font-display text-primary-500">Premium</div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Expires in 245 days</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 glass-card p-8 border-surface-border">
              <h3 className="text-xl font-bold mb-8 font-display">Recent AI Advisor Consultations</h3>
              <div className="space-y-6">
                {[
                  { title: 'Property Dispute Guidelines', date: '2 hours ago', status: 'Completed' },
                  { title: 'Rental Agreement Review', date: 'Yesterday', status: 'Analyzed' },
                  { title: 'Cyber Law Inquiry', date: 'Feb 12, 2026', status: 'In Progress' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-background/50 rounded-xl border border-surface-border/50 hover:border-primary-500/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-card flex items-center justify-center text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{item.title}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Completed' ? 'bg-primary-600/10 text-primary-500' : 'bg-surface-border text-gray-500'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 border border-surface-border rounded-xl text-gray-400 text-sm font-bold hover:text-white hover:border-primary-500/20 transition-all">View All Activity</button>
            </div>

            {/* AI Advisor Card */}
            <div className="glass-card p-8 border-primary-500/20 bg-gradient-to-tr from-surface-card to-primary-950/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold mb-4 font-display">Need Quick Advice?</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Connect with the AI Advisor now for instant legal guidance and research analysis.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-primary-950/20 border border-primary-900/50 rounded-xl">
                  <p className="text-primary-400 text-xs font-bold mb-1 italic">Pro Tip:</p>
                  <p className="text-gray-500 text-[11px]">Upload documents in PDF format for the most accurate AI analysis results.</p>
                </div>
                <button className="premium-button w-full">Start Chatting</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
