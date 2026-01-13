
import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Activity, 
  ChevronRight, 
  FileSearch, 
  AlertTriangle, 
  User as UserIcon, 
  Heart, 
  ClipboardList, 
  History,
  Mail,
  MoreHorizontal,
  Printer,
  ChevronLeft
} from 'lucide-react';

interface ProfilesProps {
  students: Student[];
  onView: () => void;
  currentUserRole: UserRole;
}

const Profiles: React.FC<ProfilesProps> = ({ students, onView, currentUserRole }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'academic' | 'conduct'>('overview');

  const canEdit = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.TEACHER;
  const isStaff = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.TEACHER;

  const calculateGPA = (history: Student['academicHistory']) => {
    if (history.length === 0) return 'N/A';
    const sum = history.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / history.length / 25).toFixed(2);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-in fade-in duration-500 min-h-[600px]">
      {/* Student List Sidebar - Responsive Toggle */}
      <div className={`w-full lg:w-80 space-y-4 transition-all duration-300 ${selectedStudent ? 'hidden lg:block' : 'block'}`}>
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-xl font-black text-slate-800">Directory</h2>
          <span className="text-[10px] bg-white border px-3 py-1 rounded-full font-black text-slate-400 uppercase tracking-widest shadow-sm">{students.length} Total</span>
        </div>
        
        <div className="space-y-2 lg:max-h-[750px] overflow-y-auto custom-scrollbar pr-1 pb-10">
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStudent(s);
                onView();
              }}
              className={`
                w-full flex items-center gap-4 p-4 rounded-[1.5rem] md:rounded-[2rem] border transition-all text-left group
                ${selectedStudent?.id === s.id 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02]' 
                  : 'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-md'}
              `}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl shrink-0 flex items-center justify-center font-black text-lg transition-colors ${selectedStudent?.id === s.id ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>
                {s.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate text-sm md:text-base leading-tight">{s.name}</p>
                <span className={`text-[10px] font-black uppercase tracking-tighter opacity-60`}>{s.grade}</span>
              </div>
              <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${selectedStudent?.id === s.id ? 'text-white translate-x-1' : 'text-slate-200'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className={`flex-1 transition-all duration-500 ${!selectedStudent ? 'hidden lg:block' : 'block'}`}>
        {selectedStudent ? (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {/* Profile Hero */}
              <div className="bg-indigo-900 p-8 md:p-12 text-white relative">
                <button onClick={() => setSelectedStudent(null)} className="lg:hidden absolute top-6 left-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"><ChevronLeft size={24}/></button>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-8 md:mt-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl font-black border-2 border-white/20 shadow-2xl">
                    {selectedStudent.name[0]}
                  </div>
                  <div className="text-center md:text-left flex-1 min-w-0">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight truncate mb-2">{selectedStudent.name}</h2>
                    <p className="text-indigo-300 font-bold uppercase text-xs mb-8">{selectedStudent.grade} • ID: {selectedStudent.id}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                        <p className="text-[9px] font-black text-indigo-300 uppercase leading-none mb-1">GPA</p>
                        <p className="text-xl font-black">{calculateGPA(selectedStudent.academicHistory)}</p>
                      </div>
                      <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                        <p className="text-[9px] font-black text-indigo-300 uppercase leading-none mb-1">Attendance</p>
                        <p className="text-xl font-black">94%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="px-6 md:px-12 py-2 bg-slate-50 border-b border-slate-100 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: 'Info', icon: UserIcon },
                  { id: 'academic', label: 'Academic', icon: Activity },
                  { id: 'conduct', label: 'Conduct', icon: ShieldCheck }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`flex items-center gap-2 py-5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeView === tab.id ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-12">
                {activeView === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><Mail className="w-4 h-4"/></div>
                        Contacts
                      </h3>
                      <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 border border-slate-100 space-y-6">
                        <div className="pb-6 border-b border-slate-200">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Guardian</p>
                          <p className="text-lg font-black text-slate-900">Robert Johnson</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-2xl border border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Phone</p><p className="text-xs font-black">+1 (555) 0123</p></div>
                          <div className="p-4 bg-white rounded-2xl border border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</p><p className="text-xs font-black text-emerald-600 uppercase">Authorized</p></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600"><Heart className="w-4 h-4"/></div>
                        Medical
                      </h3>
                      <div className="bg-rose-50 rounded-[2rem] p-6 md:p-8 border border-rose-100">
                         <div className="p-4 bg-white rounded-2xl border border-rose-100"><p className="text-[8px] font-black text-rose-800 uppercase mb-2">Conditions</p><p className="text-sm font-bold text-rose-900">Severe Peanut Allergy</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === 'academic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in slide-in-from-right-4">
                    {selectedStudent.academicHistory.length > 0 ? selectedStudent.academicHistory.map((rec, i) => (
                      <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-300 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <p className="font-black text-slate-900 text-base">{rec.subject}</p>
                          <span className="text-2xl font-black text-indigo-600">{rec.grade}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${rec.grade}%` }} />
                        </div>
                      </div>
                    )) : <p className="text-slate-400 font-bold italic col-span-2 py-10 text-center uppercase tracking-widest">No academic records found.</p>}
                  </div>
                )}

                {activeView === 'conduct' && (
                   <div className="space-y-4 animate-in slide-in-from-right-4">
                      {selectedStudent.disciplinaryRecords.length > 0 ? selectedStudent.disciplinaryRecords.map((rec, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                           <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                           <p className="text-sm font-bold text-slate-700">{rec}</p>
                        </div>
                      )) : (
                        <div className="py-20 text-center bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-emerald-900">
                           <ShieldCheck size={48} className="mx-auto mb-4 opacity-40" />
                           <p className="font-black uppercase tracking-widest">No conduct violations recorded</p>
                        </div>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
            <UserIcon size={120} className="text-slate-200 mb-8" />
            <h3 className="text-2xl font-black text-slate-800">Select a Profile</h3>
            <p className="max-w-xs text-sm font-medium mt-2">Access comprehensive 360° student data records from the directory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;
