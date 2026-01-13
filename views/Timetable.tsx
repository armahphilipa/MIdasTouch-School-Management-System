
import React, { useState, useMemo } from 'react';
import { User, UserRole, TimetableSlot } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download, 
  Printer, 
  Filter,
  Search,
  MoreVertical,
  Settings,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { INITIAL_TIMETABLE } from '../mockData';

interface TimetableProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

const Timetable: React.FC<TimetableProps> = ({ currentUser, onAction }) => {
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [isExporting, setIsExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [slots, setSlots] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isTeacher = currentUser.role === UserRole.TEACHER;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onAction('13.1');
    }, 1500);
  };

  const getSlot = (day: string, time: string) => {
    return slots.find(s => s.day === day && s.startTime === time);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Timetable Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Schedule</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">1st Term 2024 • Timetable Registry</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest text-slate-600 appearance-none shadow-sm focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>Grade 10-A</option>
              <option>Grade 10-B</option>
              <option>Grade 9-A</option>
              <option>Faculty Load</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          
          <button onClick={handleExport} disabled={isExporting} className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm flex items-center gap-3">
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            Export Schedule
          </button>

          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
              <Plus className="w-4 h-4" />
              Allocate Slot
            </button>
          )}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="w-24 p-6 border-b border-r border-slate-100"></th>
                {DAYS.map(day => (
                  <th key={day} className="p-6 border-b border-r border-slate-100 text-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((time, tIdx) => (
                <tr key={time} className="group">
                  <td className="p-6 border-b border-r border-slate-100 text-center bg-slate-50/20">
                    <span className="text-xs font-black text-slate-500">{time}</span>
                  </td>
                  {DAYS.map(day => {
                    const slot = getSlot(day, time);
                    const isLunch = time === '12:00';
                    const isBreak = time === '10:00';
                    
                    if (isLunch) {
                      return day === 'Monday' ? (
                        <td key={`${day}-${time}`} colSpan={5} className="p-3 border-b border-slate-100 bg-slate-100/50 text-center">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Mid-Day Recess & Nutrition</span>
                        </td>
                      ) : null;
                    }

                    if (isBreak && day === 'Monday') {
                        return (
                          <td key={`${day}-${time}`} colSpan={5} className="p-2 border-b border-slate-100 bg-indigo-50/30 text-center">
                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.3em]">Short Break</span>
                          </td>
                        );
                    }
                    if (isBreak || (isLunch && day !== 'Monday')) return null;

                    return (
                      <td key={`${day}-${time}`} className="p-3 border-b border-r border-slate-100 align-top relative h-32">
                        {slot ? (
                          <div className={`h-full w-full p-4 rounded-3xl ${slot.color} text-white shadow-lg shadow-indigo-200/20 group/slot transition-all hover:-translate-y-1 cursor-pointer`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-black text-sm leading-tight uppercase tracking-tight">{slot.subject}</h4>
                              {isAdmin && (
                                <button className="opacity-0 group-hover/slot:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded-lg">
                                  <MoreVertical size={14} />
                                </button>
                              )}
                            </div>
                            <div className="space-y-1.5 opacity-90">
                              <div className="flex items-center gap-2 text-[9px] font-bold">
                                <UserIcon size={12} className="shrink-0" />
                                <span className="truncate">{slot.teacher}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-bold">
                                <MapPin size={12} className="shrink-0" />
                                <span>{slot.room}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full border-2 border-dashed border-slate-50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             {isAdmin && <button className="p-2 bg-slate-50 text-slate-300 rounded-full hover:text-indigo-600 transition-colors"><Plus size={16} /></button>}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Info */}
        <div className="p-10 bg-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Clock className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                 <h4 className="text-xl font-black">Live Deployment View</h4>
                 <p className="text-sm font-medium text-indigo-300 opacity-80">Students and staff are notified automatically of any schedule deviations in real-time.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="px-5 py-2 bg-white/10 rounded-xl border border-white/20 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Master Conflict Check: OK</span>
              </div>
           </div>
        </div>
      </div>

      {/* Add Modal Simulation */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-3xl overflow-hidden relative z-10 p-10 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900">Allocate Schedule Slot</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24}/></button>
             </div>
             
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day of Week</label>
                      <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none appearance-none">
                         {DAYS.map(d => <option key={d}>{d}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Block</label>
                      <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none appearance-none">
                         {TIMES.map(t => <option key={t}>{t}</option>)}
                      </select>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Subject</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none" placeholder="e.g. Physics" />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Faculty</label>
                   <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none appearance-none">
                      <option>Prof. James Black</option>
                      <option>Dr. Sarah Wilson</option>
                      <option>Mr. David Atten</option>
                   </select>
                </div>

                <div className="pt-6">
                   <button onClick={() => setShowAddModal(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                      <CheckCircle2 size={24}/> Confirm Allocation
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
