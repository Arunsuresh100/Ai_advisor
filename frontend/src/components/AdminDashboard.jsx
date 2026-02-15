
import React from 'react';
import Navbar from './Navbar';
import DashboardSidebar from './DashboardSidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans">
      <Navbar />
      <DashboardSidebar role="admin" />
      
      <main className="pl-64 pt-20">
        <div className="p-8 max-w-7xl mx-auto">
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Internal <span className="text-gradient">Admin Panel</span></h1>
              <p className="text-gray-400">System metrics and management for LegalBot AI.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Emergency Stop</button>
              <button className="premium-button text-sm">Refresh Services</button>
            </div>
          </header>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', val: '1,284', grow: '+12%', color: 'primary' },
              { label: 'AI API Hits', val: '85.2k', grow: '+5.4%', color: 'primary' },
              { label: 'Active Sessions', val: '422', grow: '-2%', color: 'gray' },
              { label: 'System Health', val: '99.8%', grow: 'Stable', color: 'primary' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 border-surface-border group hover:border-primary-500/30 transition-all">
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold font-display">{stat.val}</div>
                  <div className={`text-[10px] font-bold ${stat.color === 'primary' ? 'text-primary-500' : 'text-gray-500'}`}>
                    {stat.grow}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Logs */}
            <div className="lg:col-span-2 glass-card p-8 border-surface-border">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-display">Service Monitor</h3>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Latency</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'NLP Model Service', latency: '42ms', status: 'Healthy', load: '14%' },
                  { name: 'Legal Guidelines DB', latency: '12ms', status: 'Healthy', load: '6%' },
                  { name: 'User Auth Service', latency: '28ms', status: 'Healthy', load: '22%' },
                  { name: 'Frontend CDN', latency: '8ms', status: 'Healthy', load: '31%' }
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-background/30 rounded-xl border border-surface-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-primary-600/20 rounded-full overflow-hidden">
                        <div className="bg-primary-500 h-1/2 w-full"></div>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{service.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{service.latency} latency</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">{service.status}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase">{service.load} Load</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Training Status */}
            <div className="glass-card p-8 border-primary-500/20 bg-primary-950/10 h-full">
              <h3 className="text-xl font-bold mb-6 font-display">Model Training</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span className="text-gray-400">GPT-4 Legal Fine-tune</span>
                    <span className="text-primary-500">88%</span>
                  </div>
                  <div className="w-full bg-surface-background h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full w-[88%] shadow-lg shadow-primary-500/30"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span className="text-gray-400">NLP Entity Extraction</span>
                    <span className="text-primary-500">Completed</span>
                  </div>
                  <div className="w-full bg-surface-background h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full w-full shadow-lg shadow-primary-500/30"></div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-surface-border/50">
                   <p className="text-xs text-gray-500 mb-6 italic leading-relaxed">
                     "The current model is performing within 98% accuracy on Indian Penal Code queries."
                   </p>
                   <button className="premium-button w-full text-xs">Run Diagnostic</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
