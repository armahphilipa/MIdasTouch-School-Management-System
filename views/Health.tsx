
import React, { useState, useMemo } from 'react';
import { User, UserRole, MedicalRecord, InfirmaryVisit, Student } from '../types';
import { 
  HeartPulse, 
  Stethoscope, 
  Thermometer, 
  Activity, 
  Search, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  History, 
  ChevronRight, 
  Smartphone, 
  Mail, 
  Phone,
  ClipboardList,
  CheckCircle2,
  Filter,
  MoreVertical,
  X,
  Clock,
  User as UserIcon,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { INITIAL_MEDICAL_RECORDS, INITIAL_INFIRMARY_VISITS, INITIAL_STUDENTS } from '../mockData';

interface HealthProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const Health: React.FC<HealthProps> = ({ currentUser, onAction }) => {
  const [activeTab, setActiveTab] = useState<'clinic' | 'profiles' | 'compliance'>('clinic');
  const [visits, setVisits] = useState<InfirmaryVisit[]>(INITIAL_INFIRMARY_VISITS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isParent = currentUser.role === UserRole.PARENT;

  const filteredVisits = useMemo(() => {
    return visits.filter(v => 
      v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.complaint.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visits, searchTerm]);

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const newVisit: InfirmaryVisit = {
        id: `IV-${Date.now()}`,
        studentId: 'SMS-2024-812034',
        studentName: 'Timmy Johnson',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        complaint: 'Migraine / Fatigue',
        treatment: 'Administered 500mg Ibuprofen, 20min rest',
        outcome: 'RETURN_TO_CLASS',
        nurseName: currentUser.name
      };
      setVisits([newVisit, ...visits]);
      setIsProcessing(false);
      setShowVisitModal(false);
      onAction('19.1');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Health Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-teal-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-teal-200">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Services</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Health & Wellness Management Hub</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('clinic')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'clinic' ? 'bg-white text-teal-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Clinical Ledger
          </button>
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'profiles' ? 'bg-white text-teal-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Medical Profiles
          </button>
          <button 
            onClick={() => setActiveTab('compliance')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'compliance' ? 'bg-white text-teal-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Vaccination Log
          </button>
        </div>
      </div>

      {activeTab === 'clinic' && (
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Find visit records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] outline-none font-bold text-slate-800" 
                />
              </div>
              {!isParent && (
                <button 
                  onClick={() => setShowVisitModal(true)}
                  className="px-8 py-5 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-teal-700 transition-all"
                >
                  <Plus size={18}/> Record Clinic Visit
                </button>
              )}
           </div>

           <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 text-[10px] font-black text-slate-300 uppercase tracking-widest border-b">
                          <th className="px-10 py-6">Incident Reference</th>
                          <th className="px-10 py-6">Clinical Assessment</th>
                          <th className="px-10 py-6 text-center">Status / Outcome</th>
                          <th className="px-10 py-6 text-right">Nurse / Author</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {filteredVisits.map((v) => (
                         <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center font-black text-teal-600 text-xs shadow-sm">
                                    <Thermometer size={18}/>
                                  </div>
                                  <div>
                                     <p className="font-black text-slate-900 text-sm">{v.studentName}</p>
                                     <p className="text-[10px] font-mono text-slate-400 uppercase">{v.date} • {v.time}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-8 max-w-md">
                               <p className="text-sm font-bold text-slate-700 truncate">{v.complaint}</p>
                               <p className="text-[10px] text-slate-400 font-medium italic mt-1">Rx: {v.treatment}</p>
                            </td>
                            <td className="px-10 py-8 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                 v.outcome === 'RETURN_TO_CLASS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                 v.outcome === 'SENT_HOME' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                 'bg-rose-50 text-rose-700 border-rose-100'
                               }`}>
                                  {v.outcome.replace(/_/g, ' ')}
                               </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <p className="text-xs font-black text-slate-800">{v.nurseName}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Certified RN</p>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
           {/* Summary Stats */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
                 <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                   <ShieldAlert className="text-teal-600" /> Allergy Registry
                 </h3>
                 <div className="space-y-4">
                    {['Peanut Allergy', 'Lactose Intol.', 'Asthma Cases'].map(tag => (
                      <div key={tag} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                        <span className="text-xs font-black text-slate-600">{tag}</span>
                        <span className="px-2 py-1 bg-white border rounded-lg text-[10px] font-black text-teal-600">12 Students</span>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden group">
                 <ShieldCheck className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                 <h4 className="text-xl font-black mb-4">Emergency Protocol</h4>
                 <p className="text-sm text-slate-400 font-medium leading-relaxed">Nurse office has direct override capability for attendance when medical leave is processed.</p>
              </div>
           </div>

           {/* Main Profiles Board */}
           <div className="lg:col-span-3 space-y-6">
              {INITIAL_MEDICAL_RECORDS.map(rec => {
                const student = INITIAL_STUDENTS.find(s => s.id === rec.studentId);
                return (
                  <div key={rec.studentId} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-10 group hover:-translate-y-1 transition-all">
                    <div className="shrink-0 flex flex-col items-center">
                       <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 font-black text-3xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                          {student?.name[0]}
                       </div>
                       <div className="mt-6 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Activity size={14}/> Blood Group: {rec.bloodGroup}
                       </div>
                    </div>

                    <div className="flex-1 space-y-8">
                       <div className="flex items-center justify-between">
                          <div>
                             <h4 className="text-2xl font-black text-slate-900 mb-1">{student?.name}</h4>
                             <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{student?.grade} • ID: {rec.studentId}</p>
                          </div>
                          <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-teal-600 transition-colors"><MoreVertical/></button>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Documented Allergies</p>
                             <div className="flex flex-wrap gap-2">
                                {rec.allergies.map(a => <span key={a} className="px-3 py-1 bg-white border-2 border-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase">{a}</span>)}
                             </div>
                          </div>
                          <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Prescription Log</p>
                             <div className="space-y-2">
                                {rec.medications.map(m => <p key={m} className="text-xs font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={12} className="text-teal-500"/> {m}</p>)}
                             </div>
                          </div>
                       </div>
                       
                       <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex gap-4">
                             <div className="flex items-center gap-2 text-slate-400">
                                <Phone size={14} />
                                <span className="text-[10px] font-black uppercase">+1 (555) 0123</span>
                             </div>
                          </div>
                          <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline flex items-center gap-2">Full Clinical File <ChevronRight size={14}/></button>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
           <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-3xl border-2 border-slate-200 flex items-center justify-center text-teal-600 shadow-sm"><Stethoscope size={32}/></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Immunization Control</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Health Governance & Global Compliance</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                 <ClipboardList size={18}/> Audit All Classes
              </button>
           </div>

           <div className="p-10">
              <div className="space-y-4">
                 {INITIAL_MEDICAL_RECORDS[0].vaccinations.map(v => (
                   <div key={v.name} className="flex items-center justify-between p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] hover:border-teal-500 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${v.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-600 animate-pulse'}`}>
                            {v.status === 'COMPLETED' ? <CheckCircle2 size={24}/> : <Clock size={24}/>}
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-slate-800">{v.name} Immunization</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Required for Grade 10 Enrollment</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status Report</p>
                         <div className="flex items-center gap-3">
                            <span className={`text-sm font-black uppercase ${v.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>{v.status}</span>
                            <span className="text-xs font-bold text-slate-400">• Verified {v.date}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Record Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-[230] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isProcessing && setShowVisitModal(false)}></div>
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-3xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
              <div className="p-10">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinic Ingestion Log</h3>
                    <button onClick={() => setShowVisitModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24}/></button>
                 </div>

                 <form onSubmit={handleAddVisit} className="space-y-6">
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Student Identity</label>
                          <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-sm outline-none appearance-none focus:border-teal-500 transition-all">
                             {INITIAL_STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id.split('-').pop()})</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Clinical Complaint</label>
                          <textarea rows={2} required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-teal-500 transition-all" placeholder="Patient symptoms..."></textarea>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Disposition</label>
                             <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs appearance-none">
                                <option value="RETURN_TO_CLASS">Return to Class</option>
                                <option value="SENT_HOME">Send Home</option>
                                <option value="HOSPITAL_REFERRAL">Emergency Referral</option>
                             </select>
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Patient Temp.</label>
                             <div className="relative">
                                <input type="text" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-sm outline-none focus:border-teal-500" placeholder="36.8" />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">°C</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                       <Smartphone className="text-indigo-600 shrink-0" />
                       <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-relaxed">
                          Saving this entry will automatically dispatch a health notification to the registered Parent/Guardian.
                       </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-6 bg-slate-900 text-white rounded-[1.75rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                      {isProcessing ? 'Synchronizing File...' : 'Finalize Record'}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Health;
