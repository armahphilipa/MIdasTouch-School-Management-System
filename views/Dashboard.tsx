
import React, { useState, useMemo } from 'react';
import { User, UserRole, Student, Invoice, AttendanceStatus, LibraryAsset, AssetStatus, SchoolNotification } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  UserPlus,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  Activity,
  Sparkles,
  Zap,
  BrainCircuit,
  ChevronRight,
  MessageSquare,
  Clock,
  HeartPulse,
  Award,
  Bell,
  Wallet,
  BookOpen,
  Package,
  History,
  Fingerprint,
  Smartphone,
  Trophy,
  ShieldAlert
} from 'lucide-react';
import { INITIAL_LIBRARY_ASSETS } from '../mockData';

interface DashboardProps {
  user: User;
  students: Student[];
  invoices: Invoice[];
  notifications?: SchoolNotification[];
  onAction?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, students, invoices, notifications = [], onAction }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const isAdmin = user.role === UserRole.ADMIN;
  const isTeacher = user.role === UserRole.TEACHER;
  const isParent = user.role === UserRole.PARENT;
  const isStudent = user.role === UserRole.STUDENT;

  // Generic Data
  const attendanceData = [
    { name: 'Mon', rate: 94 }, { name: 'Tue', rate: 96 }, { name: 'Wed', rate: 92 }, { name: 'Thu', rate: 95 }, { name: 'Fri', rate: 98 },
  ];

  const revenueData = [
    { name: 'Jan', amount: 45000 }, { name: 'Feb', amount: 52000 }, { name: 'Mar', amount: 48000 }, { name: 'Apr', amount: 61000 }, { name: 'May', amount: 55000 },
  ];

  // Logic for Parent/Student Hubs
  const activeStudentRecord = useMemo(() => {
    if (isStudent) return students.find(s => s.id === 'SMS-2024-812034') || students[0];
    if (isParent) return students.find(s => s.parentId === user.id) || students[0];
    return null;
  }, [students, user, isStudent, isParent]);

  const academicRadarData = useMemo(() => {
    return activeStudentRecord?.academicHistory.map(h => ({
      subject: h.subject,
      score: h.grade,
      fullMark: 100
    })) || [];
  }, [activeStudentRecord]);

  const relevantNotifications = useMemo(() => {
    // Filter notifications relevant to the current user (Parent/Student)
    return notifications.filter(n => n.recipientId === user.id).slice(0, 5);
  }, [notifications, user]);

  const stats = useMemo(() => {
    if (isAdmin) return [
      { label: 'Total Enrollment', value: '1,284', icon: Users, color: 'bg-blue-500', trend: '+2.5%', isUp: true },
      { label: 'Daily Attendance', value: '94.2%', icon: Calendar, color: 'bg-emerald-500', trend: '+0.4%', isUp: true },
      { label: 'Revenue (GHS)', value: '₵124.5k', icon: TrendingUp, color: 'bg-indigo-500', trend: '+12%', isUp: true },
      { label: 'System Alerts', value: '12', icon: AlertCircle, color: 'bg-rose-500', trend: 'Critical', isUp: false },
    ];
    if (isTeacher) return [
      { label: 'Active Classes', value: '6', icon: BookOpen, color: 'bg-indigo-500', trend: 'Today', isUp: true },
      { label: 'Student Avg', value: '88.4%', icon: TrendingUp, color: 'bg-emerald-500', trend: '+1.2%', isUp: true },
      { label: 'Pending Grades', value: '24', icon: FileText, color: 'bg-amber-500', trend: 'Next 24h', isUp: false },
      { label: 'Parent Messages', value: '3', icon: MessageSquare, color: 'bg-blue-500', trend: 'New', isUp: true },
    ];
    return [];
  }, [isAdmin, isTeacher]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onAction?.('7.1');
    }, 2000);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isParent ? 'Guardian Control' : isStudent ? 'Student Terminal' : 'Intelligence Engine'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isParent ? `Monitoring legacy for ${activeStudentRecord?.name}` : isStudent ? `Welcome back to your workspace, ${user.name}` : `Operational status for ${user.name}`} 
            <span className="uppercase text-[9px] tracking-widest bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-black ml-2">{user.role} NODE</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {isParent && (
            <>
              <button onClick={() => onAction?.('4.1')} className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm flex items-center justify-center gap-3"><MessageSquare size={16} /> Faculty Link</button>
              <button onClick={() => onAction?.('5.2')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"><Wallet size={16} /> Pay Dues</button>
            </>
          )}
          {isStudent && (
            <button onClick={() => onAction?.('11.1')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"><Calendar size={16} /> My Schedule</button>
          )}
          {(isAdmin || isTeacher) && (
            <button onClick={handleGenerateReport} disabled={isGenerating} className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm flex items-center justify-center gap-3">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText size={16} />} Compile Intelligence
            </button>
          )}
        </div>
      </div>

      {/* AI Contextual Insight Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-950 p-1 rounded-[2.5rem] md:rounded-[3.5rem] shadow-3xl shadow-indigo-200/50 group overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
           <BrainCircuit size={240} />
         </div>
         <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[2.3rem] md:rounded-[3.3rem] flex flex-col lg:flex-row items-center gap-10 relative z-10 border border-white/10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
               <Sparkles size={40} />
            </div>
            <div className="flex-1 text-center lg:text-left">
               <h2 className="text-2xl md:text-3xl font-black text-white mb-2">EduGenius Active Intelligence</h2>
               <p className="text-indigo-200 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                 {isParent ? `Your child is currently outperforming 82% of Grade 10 in Mathematics logic blocks. Total attendance consistency is high at 94%.` :
                  isStudent ? `Assessment #4 result is in. You scored in the top 10% for Geometric Proofs. Your Physics lab report is due in 18 hours.` :
                  isAdmin ? `Institutional revenue parity achieved 92.4% for 1st Term. Overall faculty performance score is trending upward by 4.2%.` :
                  `Your Grade 10 Algebra section is showing a 15% increase in engagement. 3 students require targeted intervention for next week's quiz.`}
               </p>
            </div>
            <button className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3">
               <Zap size={18} className="fill-indigo-900" /> Deep Analytics
            </button>
         </div>
      </div>

      {(isAdmin || isTeacher) && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between">
                  <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}><stat.icon size={24} /></div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.trend} {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                </div>
                <div className="mt-8">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div><h3 className="text-xl font-black text-slate-800">Engagement Persistence</h3><p className="text-[10px] font-black text-slate-400 uppercase mt-1">Institutional Weekly Average</p></div>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">1st Term Cycle</div>
               </div>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                       <YAxis hide />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                       <Bar dataKey="rate" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div><h3 className="text-xl font-black text-slate-800">{isAdmin ? 'Financial Parity' : 'Performance Vectors'}</h3><p className="text-[10px] font-black text-slate-400 uppercase mt-1">Growth Metrics</p></div>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Tracking</div>
               </div>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                       <defs><linearGradient id="colorRevGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                       <YAxis hide />
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                       <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevGrad)" strokeWidth={4} />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </>
      )}

      {isParent && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           <div className="xl:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
                 <div className="relative">
                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl font-black border-4 border-white shadow-2xl text-indigo-600">{activeStudentRecord?.name[0]}</div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg"><ShieldCheck size={20} /></div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                       <div><h2 className="text-3xl font-black text-slate-900">{activeStudentRecord?.name}</h2><p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{activeStudentRecord?.grade} • Primary Ward</p></div>
                       <button className="px-6 py-2 bg-slate-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">Report Card</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="p-5 bg-slate-50 rounded-[1.5rem] text-center border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">GPA</p><p className="text-xl font-black text-indigo-600">3.82</p></div>
                       <div className="p-5 bg-slate-50 rounded-[1.5rem] text-center border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Attend.</p><p className="text-xl font-black text-emerald-600">94%</p></div>
                       <div className="p-5 bg-slate-50 rounded-[1.5rem] text-center border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Merits</p><p className="text-xl font-black text-amber-500">420</p></div>
                       <div className="p-5 bg-slate-50 rounded-[1.5rem] text-center border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rank</p><p className="text-xl font-black text-slate-700">#4/120</p></div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3"><Activity className="text-indigo-600" /> Subject Proficiency</h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={academicRadarData}>
                             <PolarGrid stroke="#f1f5f9" />
                             <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                             <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                          </RadarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3"><DollarSign className="text-emerald-500" /> Financial Standing</h3>
                    <div className="space-y-6">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Outstanding Balance</p>
                          <p className="text-4xl font-black text-slate-900">₵1,500.00</p>
                       </div>
                       <div className="flex items-center gap-3 text-rose-500 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                          <AlertCircle size={18} /><p className="text-[10px] font-black uppercase">Due in 5 days (1st Term Tuition)</p>
                       </div>
                       <button onClick={() => onAction?.('5.2')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">Clear Balance Now</button>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3"><Bell className="text-indigo-600" /> Learning Timeline</h3>
              <div className="space-y-12 relative flex-1 overflow-y-auto no-scrollbar max-h-[600px] pr-2">
                 <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-50" />
                 
                 {/* Requirement 2.2: Automated Alerts injected into timeline */}
                 {relevantNotifications.map((notif, idx) => (
                   <div key={notif.id} className="relative pl-14 animate-in slide-in-from-right-4 duration-500">
                      <div className={`absolute left-0 top-0 w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm`}><ShieldAlert size={20} /></div>
                      <div>
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-black text-rose-900">System Alert: Attendance</h4>
                            <span className="text-[9px] font-black text-slate-400">{new Date(notif.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                         </div>
                         <p className="text-xs text-slate-600 leading-relaxed font-bold">{notif.message}</p>
                      </div>
                   </div>
                 ))}

                 {[
                   { title: 'Algebra Grade Posted', time: '2h ago', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                   { title: 'Marked Present', time: '8h ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   { title: 'Library Notice', time: 'Yesterday', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                   { title: 'PTA Invite', time: 'May 28', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
                 ].map((item, idx) => (
                   <div key={idx} className="relative pl-14">
                      <div className={`absolute left-0 top-0 w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center border-4 border-white shadow-sm`}><item.icon size={20} /></div>
                      <div><div className="flex items-center justify-between mb-1"><h4 className="text-sm font-black text-slate-900">{item.title}</h4><span className="text-[9px] font-black text-slate-400">{item.time}</span></div><p className="text-xs text-slate-500">Official log updated.</p></div>
                   </div>
                 ))}
              </div>
              <button onClick={() => onAction?.('4.1')} className="mt-12 w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Communication Center</button>
           </div>
        </div>
      )}

      {isStudent && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           <div className="xl:col-span-2 space-y-8">
              <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
                 <Fingerprint className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                 <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-5xl font-black border-2 border-white/20 shadow-2xl">{user.name[0]}</div>
                    <div className="flex-1 text-center md:text-left">
                       <h2 className="text-3xl font-black mb-1">Student Node: {user.name}</h2>
                       <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-8">Academic ID: SMS-2024-812034 • Grade 10</p>
                       <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-center"><p className="text-[9px] font-black text-indigo-400 uppercase mb-1">GPA</p><p className="text-2xl font-black">3.82</p></div>
                          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-center"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Global Rank</p><p className="text-2xl font-black">#4</p></div>
                          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-center"><p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Credits</p><p className="text-2xl font-black">112</p></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><Activity size={24} className="text-indigo-600" /> Latest Academic Results</h3>
                       <button onClick={() => onAction?.('9.1')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Log</button>
                    </div>
                    <div className="space-y-4">
                       {activeStudentRecord?.academicHistory.slice(0, 3).map((h, i) => (
                         <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                            <div><p className="font-black text-slate-900 text-sm leading-none mb-1.5">{h.subject}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{h.type}</p></div>
                            <div className="text-right"><span className="text-xl font-black text-indigo-600">{h.grade}%</span></div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><Package size={24} className="text-emerald-500" /> My Inventory</h3>
                       <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Library</button>
                    </div>
                    <div className="space-y-4">
                       {INITIAL_LIBRARY_ASSETS.slice(0, 2).map((item, i) => (
                         <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">{item.id.startsWith('BK') ? <BookOpen size={20}/> : <Smartphone size={20}/>}</div>
                            <div className="min-w-0"><p className="font-black text-slate-900 text-sm leading-none mb-1.5 truncate">{item.title}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Due: 24 May 2024</p></div>
                            <div className="ml-auto px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase">Active</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col h-full">
                 <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3"><Bell className="text-indigo-600" /> Notifications</h3>
                 <div className="space-y-6 overflow-y-auto no-scrollbar max-h-[400px]">
                   {relevantNotifications.map((notif) => (
                     <div key={notif.id} className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 relative group animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(notif.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{notif.message}</p>
                     </div>
                   ))}
                   {relevantNotifications.length === 0 && (
                     <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No new alerts</div>
                   )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
