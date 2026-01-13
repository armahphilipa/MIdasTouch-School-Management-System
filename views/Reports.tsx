
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  History, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Calendar,
  DollarSign,
  FileText,
  ShieldCheck,
  ChevronRight,
  Printer,
  ListTodo
} from 'lucide-react';
import { ANALYTICS_DATA } from '../mockData';
import { ChecklistItem } from '../types';
import ChecklistSummary from '../components/ChecklistSummary';

interface ReportsProps {
  onAction: (id: string) => void;
  checklist: ChecklistItem[];
}

const Reports: React.FC<ReportsProps> = ({ onAction, checklist }) => {
  const [activeTab, setActiveTab] = useState<'academic' | 'attendance' | 'finance' | 'deployment'>('academic');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onAction('6.3'); 
    }, 1500);
  };

  const attendanceHeatmapData = [
    { day: 'Mon', week1: 94, week2: 92, week3: 98, week4: 95 },
    { day: 'Tue', week1: 96, week2: 98, week3: 97, week4: 99 },
    { day: 'Wed', week1: 88, week2: 85, week3: 92, week4: 90 },
    { day: 'Thu', week1: 95, week2: 94, week3: 96, week4: 95 },
    { day: 'Fri', week1: 91, week2: 82, week3: 88, week4: 85 },
  ];

  const financialAuditLogs = [
    { id: 'TX-9021', date: '2024-05-24 10:30', student: 'Timmy Johnson', amount: 1500, type: 'Tuition', method: 'Visa **4421', status: 'Success' },
    { id: 'TX-9020', date: '2024-05-24 09:15', student: 'Emily Davis', amount: 200, type: 'Lab Fees', method: 'Mobile Money', status: 'Success' },
    { id: 'TX-9019', date: '2024-05-23 16:45', student: 'Marcus Aurelius', amount: 1200, type: 'Tuition', method: 'MasterCard **1102', status: 'Pending' },
    { id: 'TX-9018', date: '2024-05-23 14:20', student: 'Sarah Parker', amount: 50, type: 'Late Fee', method: 'System Auto-Calc', status: 'Applied' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Hub</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Advanced Reporting & Deployment Status</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'academic', label: 'Academic', icon: BarChart3 },
            { id: 'attendance', label: 'Attendance', icon: LineChartIcon },
            { id: 'finance', label: 'Audit Log', icon: History },
            { id: 'deployment', label: 'Launch Deck', icon: ListTodo },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'academic') onAction('6.1');
                if (tab.id === 'attendance') onAction('6.2');
              }}
              className={`px-6 md:px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Activity className="text-indigo-600" /> Grade Distribution
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">
                  <TrendingUp size={12}/> +4% vs Last Term
                </div>
             </div>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={ANALYTICS_DATA.gradeDistribution} layout="vertical">
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                   <XAxis type="number" hide />
                   <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} width={100} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={32}>
                     {ANALYTICS_DATA.gradeDistribution.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <p className="mt-8 text-xs text-slate-400 font-medium italic leading-relaxed text-center">
               Data aggregated across 1,284 students. Majority of the population falls within the B-tier proficiency.
             </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="text-indigo-600" /> Subject Proficiency
                </h3>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">All Subjects</button>
             </div>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ANALYTICS_DATA.subjectPerformance}>
                   <PolarGrid stroke="#f1f5f9" />
                   <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                   <Radar name="Average Score" dataKey="avg" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                   <Radar name="Top Achievement" dataKey="top" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                   <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black uppercase text-slate-400">Class Avg</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-[10px] font-black uppercase text-slate-400">Top 10%</span></div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Attendance Intensity Map</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly patterns across the current term</p>
                 </div>
                 <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-xl text-[10px] font-black uppercase text-slate-500">
                       <Calendar size={14} className="text-indigo-500" /> This Month
                    </div>
                 </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceHeatmapData}>
                    <defs>
                      <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} unit="%" />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="week1" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAttend)" />
                    <Area type="monotone" dataKey="week2" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                    <Area type="monotone" dataKey="week3" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Weekly Peak', value: '98.2%', desc: 'Typically Tuesdays', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Average Dip', value: '84.1%', desc: 'Late Fridays', icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Chronic Rate', value: '2.4%', desc: 'Flagged Students', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                      <h4 className="text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</h4>
                      <p className="text-[10px] font-bold text-slate-500">{stat.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-8">
           <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><History size={28}/></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Transaction Audit Trail</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Immutable ledger for all financial movements</p>
                  </div>
                </div>
                <div className="flex gap-3">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="TX-ID or Name..." className="pl-11 pr-6 py-3 bg-white border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                   </div>
                   <button 
                     onClick={() => handleExport('pdf')}
                     disabled={isExporting}
                     className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3"
                   >
                     {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer size={16} />}
                     Secure Export
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b">
                      <th className="px-10 py-6">Reference ID</th>
                      <th className="px-10 py-6">Timestamp</th>
                      <th className="px-10 py-6">Entity (Student)</th>
                      <th className="px-10 py-6">Category</th>
                      <th className="px-10 py-6">Amount</th>
                      <th className="px-10 py-6 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {financialAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-10 py-8 font-mono font-black text-xs text-indigo-600">{log.id}</td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-500">{log.date}</td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">{log.student[0]}</div>
                              <span className="font-black text-slate-900 text-sm">{log.student}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-500">{log.type}</td>
                        <td className="px-10 py-8 font-black text-slate-900">₵{log.amount.toLocaleString()}</td>
                        <td className="px-10 py-8 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            log.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-indigo-50 text-indigo-700 border-indigo-100'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'deployment' && (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
           <ChecklistSummary checklist={checklist} />
        </div>
      )}
    </div>
  );
};

const AlertCircle = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg width={size || 24} height={size || 24} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default Reports;
