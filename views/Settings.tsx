
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Settings as SettingsIcon, 
  Users, 
  ShieldCheck, 
  Palette, 
  Globe, 
  Bell, 
  Lock, 
  Smartphone, 
  History, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Plus, 
  ShieldAlert,
  Fingerprint,
  ToggleLeft as Toggle,
  ToggleRight,
  Loader2,
  Save,
  ChevronRight,
  CloudLightning,
  Database
} from 'lucide-react';
import { INITIAL_USERS } from '../mockData';

interface SettingsProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onAction }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'security' | 'sync'>('users');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [schoolName, setSchoolName] = useState('EduStream International Academy');
  const [academicYear, setAcademicYear] = useState('2023-2024');

  const handleMfaToggle = () => {
    setIsMfaEnabled(!isMfaEnabled);
    onAction('7.3');
  };

  const handleSaveSystem = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onAction('7.2');
    }, 1500);
  };

  const handleUserAction = () => {
    onAction('7.1');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl">
            <SettingsIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Control Center</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">System Administration & Infrastructure</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar max-w-full">
          {[
            { id: 'users', label: 'User Registry', icon: Users },
            { id: 'system', label: 'Preferences', icon: Palette },
            { id: 'sync', label: 'Data & Sync', icon: CloudLightning },
            { id: 'security', label: 'Security', icon: ShieldCheck },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search users by name, email or role..." className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl outline-none font-bold text-slate-800 shadow-sm" />
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-[10px] font-black uppercase text-slate-500 flex items-center gap-3">
                 <Filter className="w-4 h-4" /> All Roles
              </button>
              <button onClick={handleUserAction} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3">
                 <Plus className="w-4 h-4" /> Onboard User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b">
                  <th className="px-10 py-6">User Entity</th>
                  <th className="px-10 py-6">Identity / Email</th>
                  <th className="px-10 py-6 text-center">Authorization</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <img src={user.avatar} className="w-12 h-12 rounded-xl border-2 border-slate-100 shadow-sm" alt="" />
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-none mb-1.5">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Mail className="w-4 h-4 text-slate-300" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        user.role === UserRole.TEACHER ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black uppercase text-slate-500">Active</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={handleUserAction} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-200 shadow-sm"><RefreshCw size={18} /></button>
                        <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-600 hover:border-rose-200 shadow-sm"><Trash2 size={18} /></button>
                        <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-900 shadow-sm"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white p-12 rounded-[3.5rem] shadow-3xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                 <CloudLightning className="w-8 h-8 text-indigo-600" /> Offline Synchronization
              </h3>
              <div className="space-y-8">
                 <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] group hover:border-indigo-500 transition-all">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                             <Database size={32} />
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-slate-900 leading-none mb-2">Local Database</h4>
                             <p className="text-xs text-slate-500 font-medium">Persist changes when offline</p>
                          </div>
                       </div>
                       <button className="text-indigo-600"><ToggleRight size={48} /></button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Used</span>
                       <span className="text-sm font-black text-slate-800">2.4 MB / 50 MB</span>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] group hover:border-indigo-500 transition-all">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                             <RefreshCw size={32} />
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-slate-900 leading-none mb-2">Auto-Reconcile</h4>
                             <p className="text-xs text-slate-500 font-medium">Resolve conflicts using Last Write Wins</p>
                          </div>
                       </div>
                       <button className="text-indigo-600"><ToggleRight size={48} /></button>
                    </div>
                 </div>

                 <button 
                  onClick={() => onAction('13.1')}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                 >
                   <History size={24}/> View Audit Logs
                 </button>
              </div>
           </div>

           <div className="bg-indigo-900 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group flex flex-col justify-between">
              <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10">
                 <h4 className="text-3xl font-black mb-6">Pro Integrity Shield</h4>
                 <p className="text-lg text-indigo-100 opacity-80 leading-relaxed mb-10">
                    EduStream Pro uses a cryptographic sync tunnel. All local data is AES-256 encrypted at rest, ensuring student PII never leaves the hardware without a secure handshake.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 p-5 bg-white/10 rounded-2xl border border-white/5">
                       <CheckCircle2 className="text-emerald-400" />
                       <span className="text-xs font-black uppercase tracking-widest">Versioned Entity Control</span>
                    </div>
                    <div className="flex items-center gap-3 p-5 bg-white/10 rounded-2xl border border-white/5">
                       <CheckCircle2 className="text-emerald-400" />
                       <span className="text-xs font-black uppercase tracking-widest">Transactional Replay Queue</span>
                    </div>
                 </div>
              </div>
              <button className="relative z-10 w-full py-5 bg-white text-indigo-900 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all mt-10">Download Compliance Report</button>
           </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-3xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Palette className="w-8 h-8 text-indigo-600" /> Branding & Aesthetics
              </h3>
              
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academy Name</label>
                    <input 
                      type="text" 
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none font-bold text-slate-800 focus:border-indigo-500 focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Cycle</label>
                    <select 
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none font-bold text-slate-800 focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                    >
                      <option>2023-2024</option>
                      <option>2024-2025</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Logo</label>
                  <div className="flex items-center gap-8 p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] group hover:border-indigo-400 transition-all">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 text-3xl font-black">
                      E
                    </div>
                    <div>
                      <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Replace Asset</button>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Recommended: SVG or PNG (Transparent, 512x512)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                   <button 
                    onClick={handleSaveSystem}
                    disabled={isSaving}
                    className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center gap-3"
                   >
                     {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                     Commit Preferences
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl h-full border border-slate-800">
               <h3 className="text-xl font-black mb-8 flex items-center gap-4">
                 <Globe className="w-8 h-8 text-indigo-400" /> Regional Settings
               </h3>
               
               <div className="space-y-6">
                 {[
                   { label: 'Timezone', value: 'UTC -05:00 (EST)', icon: History },
                   { label: 'Currency', value: 'USD ($)', icon: DollarSign },
                   { label: 'Measurement', value: 'Metric System', icon: Globe },
                 ].map((opt, i) => (
                   <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
                          <opt.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">{opt.label}</p>
                          <p className="text-sm font-black">{opt.value}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-700 group-hover:text-white transition-colors" />
                   </div>
                 ))}
               </div>

               <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-black mb-4">Instance Health</h4>
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle2 size={14} className="text-white" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Database: Synchronized</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-white" />
                       <span className="text-[10px] font-black uppercase tracking-widest">API Latency: 42ms</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-12 rounded-[3rem] shadow-3xl border border-slate-100">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-5">
                   <ShieldAlert className="w-10 h-10 text-rose-500" /> Protection Suite
                </h3>
             </div>

             <div className="space-y-8">
                <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <Fingerprint size={32} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 leading-none mb-2">Multi-Factor Auth</h4>
                        <p className="text-xs text-slate-500 font-medium">Add an extra layer of biometric security</p>
                      </div>
                   </div>
                   <button 
                    onClick={handleMfaToggle}
                    className={`transition-colors ${isMfaEnabled ? 'text-indigo-600' : 'text-slate-300'}`}
                   >
                     {isMfaEnabled ? <ToggleRight size={48} /> : <Toggle size={48} />}
                   </button>
                </div>

                <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <Lock size={32} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 leading-none mb-2">Session Expiry</h4>
                        <p className="text-xs text-slate-500 font-medium">Auto-logout after 30 minutes of inactivity</p>
                      </div>
                   </div>
                   <button className="text-indigo-600"><ToggleRight size={48} /></button>
                </div>

                <div className="p-8 bg-indigo-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <ShieldCheck className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
                   <h4 className="text-xl font-black mb-4">Active Compliance</h4>
                   <p className="text-sm text-indigo-300 opacity-80 leading-relaxed mb-6">
                     EduStream adheres to global data protection protocols including GDPR and SOC2 standards for student privacy.
                   </p>
                   <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Download Certificate</button>
                </div>
             </div>
          </div>

          <div className="bg-white p-12 rounded-[3rem] shadow-3xl border border-slate-100">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                   <History className="w-8 h-8 text-indigo-600" /> Access Audit Log
                </h3>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Download Full Log</button>
             </div>

             <div className="space-y-4">
                {[
                  { user: 'Dr. Sarah Wilson', event: 'Login Successful', ip: '192.168.1.42', time: 'Just now', type: 'SUCCESS' },
                  { user: 'Prof. James Black', event: 'Weighting Rules Updated', ip: '192.168.1.102', time: '12 min ago', type: 'INFO' },
                  { user: 'Unknown Entity', event: 'Failed Login Attempt', ip: '203.0.113.5', time: '1h ago', type: 'WARNING' },
                  { user: 'System Bot', event: 'Batch Invoices Generated', ip: 'Internal', time: '4h ago', type: 'INFO' },
                ].map((log, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          log.type === 'SUCCESS' ? 'bg-emerald-500' :
                          log.type === 'WARNING' ? 'bg-rose-500 animate-pulse' :
                          'bg-indigo-500'
                        }`}></div>
                        <div>
                           <p className="text-sm font-black text-slate-900">{log.event}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.user} • {log.ip}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400">{log.time}</span>
                  </div>
                ))}
             </div>

             <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100">
                <div className="flex items-start gap-4">
                   <AlertCircle className="text-rose-500 shrink-0" />
                   <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1.5">Security Notice</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                         There was an unauthorized access attempt from an unrecognized IP address in Shanghai. MFA successfully blocked the entry. No data compromise detected.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DollarSign = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

export default Settings;
