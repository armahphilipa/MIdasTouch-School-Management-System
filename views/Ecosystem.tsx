
import React, { useState, useMemo } from 'react';
import { User, UserRole, AlumniRecord, CareerOpportunity, GraduationTask } from '../types';
import { 
  Trophy, 
  GraduationCap, 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Linkedin, 
  Mail, 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  FileText,
  Smartphone,
  Zap,
  Globe
} from 'lucide-react';
import { INITIAL_ALUMNI, INITIAL_CAREER_OPS, INITIAL_GRAD_TASKS } from '../mockData';

interface EcosystemProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const Ecosystem: React.FC<EcosystemProps> = ({ currentUser, onAction }) => {
  const [activeTab, setActiveTab] = useState<'alumni' | 'career' | 'graduation'>('alumni');
  const [searchTerm, setSearchTerm] = useState('');
  const [alumni] = useState<AlumniRecord[]>(INITIAL_ALUMNI);
  const [careers] = useState<CareerOpportunity[]>(INITIAL_CAREER_OPS);
  const [gradTasks, setGradTasks] = useState<GraduationTask[]>(INITIAL_GRAD_TASKS);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isTeacher = currentUser.role === UserRole.TEACHER;

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alumni, searchTerm]);

  const handleTaskToggle = (id: string) => {
    setGradTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t
    ));
    onAction('20.1');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Ecosystem Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Trophy size={160} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-[#1a237e] rounded-3xl flex items-center justify-center text-[#ffc107] shadow-xl shadow-blue-200">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Ecosystem</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Alumni Network & Career Intelligence</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl relative z-10">
          <button 
            onClick={() => setActiveTab('alumni')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'alumni' ? 'bg-white text-[#1a237e] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Alumni Registry
          </button>
          <button 
            onClick={() => setActiveTab('career')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'career' ? 'bg-white text-[#1a237e] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Career Portal
          </button>
          <button 
            onClick={() => setActiveTab('graduation')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'graduation' ? 'bg-white text-[#1a237e] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Graduation Hub
          </button>
        </div>
      </div>

      {activeTab === 'alumni' && (
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search alumni by name, university or company..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] outline-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10" 
                />
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"><Filter size={24}/></button>
                 {(isAdmin || isTeacher) && (
                   <button onClick={() => onAction('20.1')} className="px-8 py-5 bg-[#1a237e] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                     <Plus size={18}/> Archive Graduate
                   </button>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAlumni.map((alum) => (
                <div key={alum.id} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all group">
                   <div className="p-8">
                      <div className="flex items-start justify-between mb-8">
                         <img src={alum.avatar} className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform" alt="" />
                         <div className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-[9px] font-black uppercase tracking-widest">
                            Class of {alum.graduationYear}
                         </div>
                      </div>

                      <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight">{alum.name}</h4>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">Alumni Associate</p>

                      <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm"><Globe size={14}/></div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">University</p>
                               <p className="text-xs font-bold text-slate-700">{alum.university} • {alum.major}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm"><Briefcase size={14}/></div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Career Path</p>
                               <p className="text-xs font-bold text-slate-700">{alum.jobTitle} at {alum.currentCompany}</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-4 bg-[#1a237e] text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-lg shadow-blue-100">
                          <Linkedin size={14}/> Networking
                        </button>
                        <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"><Mail size={16}/></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'career' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <Zap className="text-amber-500 fill-amber-500" /> Opportunities Board
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global & Local</span>
              </div>
              
              <div className="space-y-4">
                 {careers.map(job => (
                   <div key={job.id} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-8 group hover:border-blue-300 transition-all">
                      <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-[#1a237e] shrink-0 border border-blue-100">
                        <Building2 size={32}/>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                            <h4 className="text-xl font-black text-slate-900">{job.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              job.type === 'Internship' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                               {job.type}
                            </span>
                         </div>
                         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{job.company} • {job.location}</p>
                         <p className="text-sm text-slate-500 font-medium leading-relaxed mt-4 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="shrink-0">
                         <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2">
                           Apply Now <ExternalLink size={14}/>
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-[#1a237e] p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
                 <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><Award className="w-8 h-8 text-[#ffc107]" /> Mentor Program</h3>
                    <div className="space-y-6">
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                          <p className="text-xs font-black text-[#ffc107] uppercase mb-2">Connect with Alumni</p>
                          <p className="text-sm text-slate-300 font-medium leading-relaxed">graduating seniors can now request a 1-on-1 mentorship session with alumni in their chosen fields.</p>
                       </div>
                       <button className="w-full py-4 bg-white text-[#1a237e] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">Browse Mentors</button>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Upcoming Workshops</h4>
                 <div className="space-y-6">
                    {[
                      { title: 'CV Optimization', date: 'June 05', icon: FileText },
                      { title: 'Interview Prep', date: 'June 12', icon: Smartphone }
                    ].map((w, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <w.icon size={20}/>
                         </div>
                         <div>
                            <p className="font-black text-slate-800 text-sm">{w.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{w.date}</p>
                         </div>
                         <ChevronRight className="ml-auto text-slate-200 group-hover:text-blue-500" size={18}/>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'graduation' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
           {/* Countdown & Hero */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-[#1a237e] to-[#0d1341] p-10 rounded-[3rem] text-white shadow-3xl text-center relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#ffc107]">Countdown to Glory</p>
                    <div className="text-6xl font-black mb-2">18</div>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-8">Days Remaining</p>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-8">
                       <div className="bg-[#ffc107] h-full w-[85%]" />
                    </div>
                    <p className="text-xs font-medium text-blue-200 leading-relaxed italic">"The future belongs to those who believe in the beauty of their dreams."</p>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                 <h4 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Venue Telemetry</h4>
                 <div className="flex items-center gap-4 mb-4">
                    <MapPin className="text-blue-600" />
                    <div>
                       <p className="text-sm font-black text-slate-800">Main Convocation Hall</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">East Campus • Gate 4</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    <ArrowRight size={14}/> Ceremony Logistics
                 </button>
              </div>
           </div>

           {/* Checklist & Tasks */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-slate-900">Graduation Readiness Audit</h3>
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Status of Senior Clearance Protocol</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                       <ShieldCheck size={20}/>
                       <span className="text-[10px] font-black uppercase">Verified Student Record</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gradTasks.map(task => (
                      <button 
                        key={task.id}
                        onClick={() => handleTaskToggle(task.id)}
                        className={`p-8 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between group ${
                          task.status === 'COMPLETED' ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-blue-300'
                        }`}
                      >
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              task.status === 'COMPLETED' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-300 group-hover:text-blue-500'
                            }`}>
                               {task.status === 'COMPLETED' ? <CheckCircle2 size={24}/> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                            </div>
                            <div>
                               <p className={`text-sm font-black ${task.status === 'COMPLETED' ? 'text-emerald-900' : 'text-slate-700'}`}>{task.title}</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{task.category} Verification</p>
                            </div>
                         </div>
                         <ChevronRight className={`transition-all ${task.status === 'COMPLETED' ? 'text-emerald-300' : 'text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1'}`} />
                      </button>
                    ))}
                 </div>

                 <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border-2 border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm"><Clock size={32}/></div>
                       <div>
                          <h4 className="text-xl font-black text-amber-900">Pending Library Clearance</h4>
                          <p className="text-sm font-medium text-amber-700 opacity-80">Please return all institutional equipment to the Central Library before June 10th to avoid diploma escrow.</p>
                       </div>
                    </div>
                    <button className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all">Check Inventory</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden group">
                    <BookOpen className="absolute -right-6 -bottom-6 w-24 h-24 text-blue-500/5 -rotate-12 group-hover:rotate-0 transition-transform" />
                    <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><BookOpen className="text-blue-600" /> Digital Yearbook</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Access your digital yearbook, upload memories, and sign your friends' virtual heritage wall.</p>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">Initialize Profile <ArrowRight size={14}/></button>
                 </div>
                 <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden group">
                    <FileText className="absolute -right-6 -bottom-6 w-24 h-24 text-blue-500/5 -rotate-12 group-hover:rotate-0 transition-transform" />
                    <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><FileText className="text-blue-600" /> Commencement Pack</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Download your digital invitation, guest passes, and ceremony itinerary in one secured package.</p>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">Download All <ArrowRight size={14}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Ecosystem;
