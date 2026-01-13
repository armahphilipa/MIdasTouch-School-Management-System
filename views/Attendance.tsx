
import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus, SchoolNotification, LeaveRequest, RequestStatus, User, UserRole } from '../types';
import { INITIAL_LEAVE_REQUESTS } from '../mockData';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Bell, 
  MessageSquare,
  Calendar,
  Send,
  Users,
  Search,
  Check,
  ChevronRight,
  Loader2,
  Filter,
  Smartphone,
  ShieldAlert,
  History,
  ClipboardList,
  Plane,
  X,
  FileText,
  UserCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface AttendanceProps {
  students: Student[];
  onAction: () => void;
  onAlertsGenerated: (alerts: SchoolNotification[]) => void;
  currentUser: User;
}

interface AttendanceSession {
  [studentId: string]: AttendanceStatus;
}

const Attendance: React.FC<AttendanceProps> = ({ students, onAction, onAlertsGenerated, currentUser }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Math-A');
  const [activeSubView, setActiveSubView] = useState<'marking' | 'logs' | 'leave'>(currentUser.role === UserRole.PARENT ? 'leave' : 'marking');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  
  // Pre-fill marking based on approved leave requests
  const initialSession = useMemo(() => {
    return students.reduce((acc, s) => {
      const hasApprovedLeave = leaveRequests.some(lr => 
        lr.studentId === s.id && 
        lr.status === RequestStatus.APPROVED && 
        date >= lr.startDate && 
        date <= lr.endDate
      );
      return { ...acc, [s.id]: hasApprovedLeave ? AttendanceStatus.EXCUSED : AttendanceStatus.PRESENT };
    }, {} as AttendanceSession);
  }, [students, leaveRequests, date]);

  const [session, setSession] = useState<AttendanceSession>(initialSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [localLogs, setLocalLogs] = useState<SchoolNotification[]>([]);

  // Leave Form State
  const [leaveFormData, setLeaveFormData] = useState({
    studentId: students.find(s => s.parentId === currentUser.id)?.id || students[0]?.id || '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const isStaff = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.TEACHER;
  const isParent = currentUser.role === UserRole.PARENT;

  const statuses = [
    { label: 'Present', value: AttendanceStatus.PRESENT, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', activeBg: 'bg-emerald-500' },
    { label: 'Late', value: AttendanceStatus.LATE, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', activeBg: 'bg-amber-500' },
    { label: 'Excused', value: AttendanceStatus.EXCUSED, icon: AlertCircle, color: 'text-indigo-500', bg: 'bg-indigo-50', activeBg: 'bg-indigo-500' },
    { label: 'Unexcused', value: AttendanceStatus.UNEXCUSED, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', activeBg: 'bg-rose-500' },
  ];

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    if (!isStaff) return;
    setSession(prev => ({ ...prev, [studentId]: status }));
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    const unexcusedAbsences = students.filter(s => session[s.id] === AttendanceStatus.UNEXCUSED);
    
    setTimeout(() => {
      if (unexcusedAbsences.length > 0) {
        // Requirement 2.2: Trigger automated alerts
        const newAlerts: SchoolNotification[] = unexcusedAbsences.map(student => ({
          id: `NT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          recipientId: student.parentId,
          studentId: student.id,
          studentName: student.name,
          message: `URGENT: ${student.name} was marked UNEXCUSED for the ${selectedClass} session today (${date}). Please confirm status immediately.`,
          channel: 'PUSH',
          timestamp: new Date().toISOString(),
          status: 'DELIVERED'
        }));
        
        setLocalLogs(prev => [...newAlerts, ...prev]);
        onAlertsGenerated(newAlerts); // Pass to App for global handling and Parent dashboard visibility
      }
      setIsSubmitting(false);
      onAction();
    }, 1500);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === leaveFormData.studentId);
    const newRequest: LeaveRequest = {
      id: `LR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      studentId: leaveFormData.studentId,
      studentName: student?.name || 'Unknown',
      parentId: currentUser.id,
      startDate: leaveFormData.startDate,
      endDate: leaveFormData.endDate,
      reason: leaveFormData.reason,
      status: RequestStatus.PENDING,
      submittedAt: new Date().toISOString()
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setLeaveFormData({ ...leaveFormData, startDate: '', endDate: '', reason: '' });
    onAction();
  };

  const handleLeaveStatus = (id: string, status: RequestStatus) => {
    setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status } : lr));
    onAction();
  };

  const markingStats = useMemo(() => {
    const values = Object.values(session);
    return {
      total: values.length,
      present: values.filter(v => v === AttendanceStatus.PRESENT).length,
      late: values.filter(v => v === AttendanceStatus.LATE).length,
      excused: values.filter(v => v === AttendanceStatus.EXCUSED).length,
      unexcused: values.filter(v => v === AttendanceStatus.UNEXCUSED).length,
    };
  }, [session]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Sub-Navigation */}
      <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl w-fit border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        {isStaff && (
          <button 
            onClick={() => setActiveSubView('marking')}
            className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeSubView === 'marking' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mark Daily Registry
          </button>
        )}
        <button 
          onClick={() => setActiveSubView('leave')}
          className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeSubView === 'leave' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {isParent ? 'Excuse My Child' : 'Leave Requests'}
          {leaveRequests.filter(r => r.status === RequestStatus.PENDING).length > 0 && isStaff && (
            <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded-lg text-[9px] font-black">{leaveRequests.filter(r => r.status === RequestStatus.PENDING).length}</span>
          )}
        </button>
        {isStaff && (
          <button 
            onClick={() => setActiveSubView('logs')}
            className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeSubView === 'logs' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Alert Analytics
          </button>
        )}
      </div>

      {activeSubView === 'marking' && isStaff && (
        <>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                <Calendar className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Daily Registry Mark</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">{selectedClass} Session</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
               <div className="text-center">
                  <p className="text-2xl font-black text-slate-800 leading-none">{markingStats.total}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Expected</p>
               </div>
               <div className="w-px h-10 bg-slate-200" />
               <div className="text-center">
                  <p className="text-2xl font-black text-emerald-600 leading-none">{markingStats.present}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Present</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-3xl border border-slate-100 overflow-hidden">
             <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
              <div className="relative w-full md:w-[450px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search student manifest..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 rounded-3xl bg-white border-none outline-none font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all"
                />
              </div>
              <div className="flex gap-4">
                 <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white outline-none font-black text-xs uppercase tracking-widest focus:border-indigo-500 transition-all shadow-sm" />
                 <button className="p-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all"><Filter/></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                   <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b">
                      <th className="px-10 py-6">Student Profile</th>
                      <th className="px-10 py-6 text-center">Status Control</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="group hover:bg-slate-50 transition-all">
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white border-4 border-slate-50 flex items-center justify-center font-black text-slate-800 text-2xl shadow-xl group-hover:scale-105 transition-transform">{student.name[0]}</div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-none mb-2">{student.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {student.id} • {student.grade}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center justify-center gap-4">
                          {statuses.map((status) => (
                            <button
                              key={status.value}
                              onClick={() => handleMark(student.id, status.value)}
                              className={`p-4 rounded-2xl transition-all border-4 ${session[student.id] === status.value ? `${status.activeBg} text-white border-white shadow-xl` : 'bg-slate-50 text-slate-300 border-transparent hover:bg-white hover:border-slate-100'}`}
                              title={status.label}
                            >
                              <status.icon size={28} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><ShieldAlert size={24}/></div>
                 <p className="text-xs font-bold text-slate-400 max-w-sm leading-relaxed italic">Requirement 2.2: Finalizing this registry will commit values to the academic database and dispatch automated push alerts to guardians for Unexcused entries.</p>
              </div>
              <button onClick={handleFinalize} disabled={isSubmitting} className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center gap-4 group">
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <UserCheck size={24} className="group-hover:scale-110 transition-transform" />} Formalize Registry
              </button>
            </div>
          </div>
        </>
      )}

      {activeSubView === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
               <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Plane size={28} /></div>
                  <h3 className="text-2xl font-black text-slate-900">{isParent ? 'Excuse Child' : 'Absence Policy'}</h3>
               </div>
               
               {isParent ? (
                 <form onSubmit={handleLeaveSubmit} className="space-y-6">
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Student Associate</label>
                          <select 
                            value={leaveFormData.studentId}
                            onChange={e => setLeaveFormData({...leaveFormData, studentId: e.target.value})}
                            className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-black text-sm outline-none appearance-none focus:border-indigo-500 transition-all"
                          >
                            {students.filter(s => s.parentId === currentUser.id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Start Date</label>
                             <input type="date" required value={leaveFormData.startDate} onChange={e => setLeaveFormData({...leaveFormData, startDate: e.target.value})} className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-xs outline-none focus:border-indigo-500 transition-all" />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">End Date</label>
                             <input type="date" required value={leaveFormData.endDate} onChange={e => setLeaveFormData({...leaveFormData, endDate: e.target.value})} className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-xs outline-none focus:border-indigo-500 transition-all" />
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Formal Reason for Absence</label>
                          <textarea required rows={4} value={leaveFormData.reason} onChange={e => setLeaveFormData({...leaveFormData, reason: e.target.value})} className="w-full p-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50 font-medium text-sm outline-none focus:border-indigo-500 transition-all" placeholder="e.g. Medical appointment, family bereavement, or travel..."></textarea>
                       </div>
                    </div>
                    <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                      <Send size={18} /> Send Request
                    </button>
                 </form>
               ) : (
                 <div className="space-y-6">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic border-l-4 border-amber-400 pl-6 py-2">System Protocol: Any approved leave request automatically overrides the daily marking status to 'EXCUSED' for the specified dates.</p>
                    <div className="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100">
                       <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">Registry Backlog</p>
                       <p className="text-3xl font-black text-amber-900">{leaveRequests.filter(r => r.status === RequestStatus.PENDING).length} Pending Review</p>
                    </div>
                 </div>
               )}
            </div>
            
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden group">
               <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-indigo-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
               <div className="relative z-10">
                 <h4 className="text-xl font-black mb-4">Leave Governance</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">All absence requests are logged in the student's permanent file. Medical leave for &gt;3 days requires a digital signature from a certified physician.</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><History className="text-indigo-500" /> Historical Logs</h3>
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Export Record</button>
            </div>
            
            <div className="space-y-4">
              {leaveRequests.length > 0 ? leaveRequests.map((lr) => (
                <div key={lr.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10 group hover:border-indigo-300 transition-all">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center shrink-0 border-4 border-white shadow-xl group-hover:bg-indigo-50 transition-colors">
                     <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{new Date(lr.startDate).toLocaleString('default', { month: 'short' })}</span>
                     <span className="text-3xl font-black text-slate-800 leading-none">{new Date(lr.startDate).getDate()}</span>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                      <h4 className="text-xl font-black text-slate-900">{lr.studentName}</h4>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                        lr.status === RequestStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        lr.status === RequestStatus.REJECTED ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                        'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                      }`}>
                        {lr.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-indigo-600 mb-2">{lr.startDate} <ArrowRight className="inline mx-2" size={14}/> {lr.endDate}</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{lr.reason}"</p>
                  </div>

                  {isStaff && lr.status === RequestStatus.PENDING ? (
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => handleLeaveStatus(lr.id, RequestStatus.APPROVED)} className="p-4 bg-white border border-slate-200 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-md"><Check size={24} /></button>
                      <button onClick={() => handleLeaveStatus(lr.id, RequestStatus.REJECTED)} className="p-4 bg-white border border-slate-200 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-md"><X size={24} /></button>
                    </div>
                  ) : (
                    <div className="p-4 text-slate-200"><ShieldCheck size={32} /></div>
                  )}
                </div>
              )) : (
                <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
                  <Plane size={64} className="text-slate-200 mx-auto mb-6" />
                  <p className="font-black text-slate-300 uppercase tracking-[0.3em]">No active leave history detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'logs' && isStaff && (
        <div className="bg-white p-12 rounded-[3.5rem] shadow-3xl border border-slate-100">
           <div className="flex items-center justify-between mb-12">
              <div><h3 className="text-3xl font-black text-slate-900">Communication Audit Trail</h3><p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Automated Alerts & Guardian Dispatch History</p></div>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"><FileText size={16}/> System Export</button>
           </div>
           
           <div className="space-y-4">
            {localLogs.map(log => (
               <div key={log.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-8 group hover:bg-white hover:shadow-xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform"><Bell size={32}/></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2"><p className="text-lg font-black text-slate-800">Priority Dispatch: {log.studentName}</p><span className="text-[10px] font-black text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span></div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{log.message}</p>
                    <div className="flex items-center gap-4 mt-4">
                       <span className="text-[10px] font-black text-indigo-500 uppercase bg-white border border-slate-100 px-3 py-1 rounded-lg">Channel: {log.channel}</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-50 px-3 py-1 rounded-lg">Status: Verified Delivered</span>
                    </div>
                  </div>
               </div>
            ))}
            {localLogs.length === 0 && (
              <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                 <Users size={64} className="text-slate-200 mx-auto mb-6" />
                 <p className="font-black text-slate-300 uppercase tracking-[0.2em]">Registry not yet finalized today</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
