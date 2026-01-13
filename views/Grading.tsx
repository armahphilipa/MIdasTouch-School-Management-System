import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  Calculator, 
  FileText, 
  Settings, 
  Download, 
  Save, 
  PieChart, 
  Search, 
  BookOpen, 
  Scale, 
  Percent, 
  TrendingUp, 
  AlertCircle, 
  ChevronDown, 
  Plus, 
  Filter, 
  CheckCircle2, 
  MoreVertical, 
  Activity, 
  Layers, 
  ArrowRight, 
  Printer, 
  FileCheck, 
  MessageSquare, 
  ShieldCheck, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Trophy, 
  Medal, 
  Award, 
  ScrollText, 
  Star, 
  X, 
  User as UserIcon, 
  Check,
  Info,
  ShieldAlert,
  Hash,
  History,
  Calendar,
  ChevronRight as ChevronRightIcon,
  Zap,
  Target
} from 'lucide-react';

interface GradingProps {
  students: Student[];
  onAction: (id: string) => void;
}

type GradingScale = 'Percentage' | 'BECE' | 'NaCCA_Proficiency';
type AssessmentType = 'Formative' | 'Summative';

interface Assessment {
  id: string;
  name: string;
  date: string;
  type: AssessmentType;
  category: 'Homework' | 'Quiz' | 'Exam';
  maxScore: number;
}

const INITIAL_ASSESSMENTS: Assessment[] = [
  { id: 'AS-001', name: 'Algebra Fundamentals', date: '2024-05-10', type: 'Formative', category: 'Quiz', maxScore: 50 },
  { id: 'AS-002', name: 'Geometry Mid-term', date: '2024-05-22', type: 'Summative', category: 'Exam', maxScore: 100 },
  { id: 'AS-003', name: 'Problem Set #4', date: '2024-05-15', type: 'Formative', category: 'Homework', maxScore: 20 },
];

const Grading: React.FC<GradingProps> = ({ students, onAction }) => {
  const [activeSubTab, setActiveSubTab] = useState<'entry' | 'config' | 'assessments' | 'reports' | 'transcripts'>('entry');
  const [activeScale, setActiveScale] = useState<GradingScale>('BECE');
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Score Entry State
  const [enteringScoresFor, setEnteringScoresFor] = useState<Assessment | null>(null);
  const [tempScores, setTempScores] = useState<Record<string, number>>({});

  // Report/Transcript State
  const [selectedReportStudent, setSelectedReportStudent] = useState<Student | null>(null);
  const [selectedTranscriptStudent, setSelectedTranscriptStudent] = useState<Student | null>(null);
  const [selectedHistoricalTerm, setSelectedHistoricalTerm] = useState<{term: string, year: string} | null>(null);
  const [teacherComments, setTeacherComments] = useState("Learner shows a high level of proficiency in knowledge, skills and values.");
  const [isExporting, setIsExporting] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // BECE (Ghana) Numerical Grading Scale Logic
  const getBECEGrade = (score: number) => {
    let grade = 9;
    let label = 'Lowest Achievement';
    let color = 'bg-slate-900';
    let range = '0-34%';
    let points = 3;

    if (score >= 90) { grade = 1; label = 'Highest Proficiency'; color = 'bg-emerald-600'; range = '90-100%'; points = 1; }
    else if (score >= 80) { grade = 2; label = 'Higher Proficiency'; color = 'bg-emerald-500'; range = '80-89%'; points = 1; }
    else if (score >= 70) { grade = 3; label = 'High Proficiency'; color = 'bg-indigo-500'; range = '70-79%'; points = 1; }
    else if (score >= 60) { grade = 4; label = 'High Average'; color = 'bg-blue-500'; range = '60-69%'; points = 2; }
    else if (score >= 55) { grade = 5; label = 'Average'; color = 'bg-cyan-500'; range = '55-59%'; points = 2; }
    else if (score >= 50) { grade = 6; label = 'Low Average'; color = 'bg-amber-500'; range = '50-54%'; points = 2; }
    else if (score >= 40) { grade = 7; label = 'Low Achievement'; color = 'bg-orange-500'; range = '40-49%'; points = 3; }
    else if (score >= 35) { grade = 8; label = 'Lower Achievement'; color = 'bg-rose-500'; range = '35-39%'; points = 3; }
    else { grade = 9; label = 'Lowest Achievement'; color = 'bg-slate-900'; range = '0-34%'; points = 3; }

    return { grade, label, color, range, points };
  };

  const getNaCCAGrade = (score: number) => {
    if (score >= 80) return { code: 'HP', label: 'Highly Proficient' };
    if (score >= 68) return { code: 'P', label: 'Proficient' };
    if (score >= 54) return { code: 'AP', label: 'Approaching Proficiency' };
    if (score >= 40) return { code: 'D', label: 'Developing' };
    return { code: 'E', label: 'Emerging' };
  };

  const calculateBECEAggregate = (history: Student['academicHistory']) => {
    const cores = ['Mathematics', 'English', 'Science', 'Social Studies'];
    const corePoints: number[] = [];
    const electivePoints: number[] = [];

    history.forEach(rec => {
      const { points } = getBECEGrade(rec.grade);
      if (cores.includes(rec.subject)) {
        corePoints.push(points);
      } else {
        electivePoints.push(points);
      }
    });

    // Best 2 electives
    electivePoints.sort((a, b) => a - b);
    const bestElectives = electivePoints.slice(0, 2);

    // If core subjects are missing, we use default point 4 (lowest tier) to simulate impact
    const missingCoresCount = Math.max(0, 4 - corePoints.length);
    const completedCorePoints = [...corePoints, ...Array(missingCoresCount).fill(4)];
    
    // Total aggregate (4 Cores + 2 Best Electives)
    const total = completedCorePoints.reduce((a, b) => a + b, 0) + bestElectives.reduce((a, b) => a + b, 0);
    return total;
  };

  const convertScore = (score: number, scale: GradingScale) => {
    if (scale === 'BECE') return `Grade ${getBECEGrade(score).grade}`;
    if (scale === 'NaCCA_Proficiency') return getNaCCAGrade(score).code;
    return `${score}%`;
  };

  const rankedStudents = useMemo(() => {
    return [...students].map(s => {
      const avg = s.academicHistory.length > 0 
        ? s.academicHistory.reduce((acc, curr) => acc + curr.grade, 0) / s.academicHistory.length 
        : 0;
      return { ...s, cumulativeAvg: avg };
    }).sort((a, b) => b.cumulativeAvg - a.cumulativeAvg);
  }, [students]);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onAction('9.1');
    }, 2000);
  };

  const saveScores = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setEnteringScoresFor(null);
      onAction('9.1');
    }, 1500);
  };

  const handleEnterScores = (as: Assessment) => {
    setEnteringScoresFor(as);
    const initialScores: Record<string, number> = {};
    students.forEach(s => initialScores[s.id] = Math.floor(Math.random() * as.maxScore));
    setTempScores(initialScores);
  };

  const groupedHistory = useMemo(() => {
    if (!selectedTranscriptStudent) return {};
    return selectedTranscriptStudent.academicHistory.reduce((acc, rec) => {
      const key = `${rec.year} - ${rec.term}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rec);
      return acc;
    }, {} as Record<string, typeof selectedTranscriptStudent.academicHistory>);
  }, [selectedTranscriptStudent]);

  const GradingLegend = () => (
    <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm text-indigo-600">
           <Info size={16} />
        </div>
        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">BECE Scale Policy</h4>
      </div>
      <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
        {[
          { g: 1, r: '90-100%', l: 'Highest Proficiency', c: 'bg-emerald-600', p: '1pt' },
          { g: 2, r: '80-89%', l: 'Higher Proficiency', c: 'bg-emerald-500', p: '1pt' },
          { g: 3, r: '70-79%', l: 'High Proficiency', c: 'bg-indigo-500', p: '1pt' },
          { g: 4, r: '60-69%', l: 'High Average', c: 'bg-blue-500', p: '2pt' },
          { g: 5, r: '55-59%', l: 'Average', c: 'bg-cyan-500', p: '2pt' },
          { g: 6, r: '50-54%', l: 'Low Average', c: 'bg-amber-500', p: '2pt' },
          { g: 7, r: '40-49%', l: 'Low Achievement', c: 'bg-orange-500', p: '3pt' },
          { g: 8, r: '35-39%', l: 'Lower Achievement', c: 'bg-rose-500', p: '3pt' },
          { g: 9, r: '0-34%', l: 'Lowest Achievement', c: 'bg-slate-900', p: '3pt' },
        ].map((item) => (
          <div key={item.g} className="flex gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
            <div className={`w-12 h-12 ${item.c} rounded-2xl shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-100`}>
              {item.g}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-black text-slate-900 uppercase leading-none">{item.l}</span>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">{item.p}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Band: {item.r}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-indigo-600 rounded-2xl text-white">
         <p className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-80">Aggregate Calculation</p>
         <p className="text-[11px] font-bold leading-relaxed">Sum of 4 Cores + Best 2 Elective points. Lower total indicates higher performance.</p>
      </div>
      <p className="text-[9px] text-slate-400 font-bold uppercase text-center pt-4 border-t border-slate-100">© MOE GHANA STANDARD GRADING</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Control</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">BECE Numerical Analysis Node</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'entry', label: 'Rankings', icon: Activity },
            { id: 'assessments', label: 'Scores', icon: Layers },
            { id: 'reports', label: 'Builder', icon: FileCheck },
            { id: 'transcripts', label: 'History', icon: ScrollText },
            { id: 'config', label: 'Setup', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'entry' ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {rankedStudents.slice(0, 3).map((s, idx) => (
               <div key={s.id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-all">
                  <div className={`absolute -top-4 -right-4 w-24 h-24 rotate-12 opacity-10 group-hover:rotate-45 transition-transform ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-orange-400'}`}>
                    {idx === 0 ? <Trophy size={96} /> : idx === 1 ? <Medal size={96} /> : <Award size={96} />}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${idx === 0 ? 'bg-amber-500 shadow-amber-200' : idx === 1 ? 'bg-slate-400 shadow-slate-200' : 'bg-orange-400 shadow-orange-200'} shadow-lg`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Top Performer</p>
                      <h4 className="font-black text-slate-900 truncate">{s.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                     <div>
                        <p className="text-3xl font-black text-indigo-600">{s.cumulativeAvg.toFixed(1)}%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Cumulative Avg</p>
                     </div>
                     <div className="text-right">
                        <div className={`px-4 py-1.5 ${getBECEGrade(s.cumulativeAvg).color} text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm mb-1`}>
                           Grade {getBECEGrade(s.cumulativeAvg).grade}
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Aggregate: {calculateBECEAggregate(s.academicHistory)}</p>
                     </div>
                  </div>
               </div>
             ))}
           </div>

           <div className="bg-white rounded-[3.5rem] shadow-3xl border border-slate-100 overflow-hidden">
             <div className="p-10 border-b flex items-center justify-between bg-slate-50/40">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Transcript Registry</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Class Rankings • BECE Numerical Protocol</p>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
                  <ScrollText className="w-5 h-5 text-indigo-400" /> Formalize Rankings
                </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] border-b">
                      <th className="px-10 py-8">Rank</th>
                      <th className="px-10 py-8">Student Official Name</th>
                      <th className="px-10 py-8 text-center">Avg Score</th>
                      <th className="px-10 py-8 text-center">Total Aggregate</th>
                      <th className="px-10 py-8 text-right">BECE Result</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {rankedStudents.map((s, idx) => (
                      <tr key={s.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                        <td className="px-10 py-10">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 ${idx < 3 ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-slate-400 border-slate-100'}`}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-10 py-10">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center font-black text-slate-800 shadow-sm">{s.name[0]}</div>
                              <div>
                                 <p className="font-black text-slate-900 leading-none mb-1.5">{s.name}</p>
                                 <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{s.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-10 text-center"><span className="text-xl font-black text-slate-900">{s.cumulativeAvg.toFixed(1)}%</span></td>
                        <td className="px-10 py-10 text-center">
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-black text-lg">
                              <Target size={16} />
                              {calculateBECEAggregate(s.academicHistory)}
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      ) : activeSubTab === 'transcripts' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4">
           <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Historical Records</h3>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                   <div className="p-4 border-b">
                      <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                         <input type="text" placeholder="Search archive..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" />
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                      {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                        <button key={s.id} onClick={() => { setSelectedTranscriptStudent(s); setSelectedHistoricalTerm(null); }} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedTranscriptStudent?.id === s.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                           <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-black text-xs">{s.name[0]}</div>
                           <div className="text-left min-w-0">
                              <p className="text-xs font-black truncate">{s.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{s.id.split('-').pop()}</p>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              
              {selectedTranscriptStudent && (
                 <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl space-y-8 animate-in fade-in zoom-in-95">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2"><History className="text-indigo-400" /> Archive Terms</h4>
                    <div className="space-y-3">
                       {Object.keys(groupedHistory).length > 0 ? Object.keys(groupedHistory).map(termKey => (
                         <button 
                           key={termKey} 
                           onClick={() => setSelectedHistoricalTerm({term: termKey.split(' - ')[1], year: termKey.split(' - ')[0]})}
                           className={`w-full p-5 rounded-[1.75rem] border-2 transition-all text-left flex items-center justify-between group ${selectedHistoricalTerm?.term === termKey.split(' - ')[1] && selectedHistoricalTerm?.year === termKey.split(' - ')[0] ? 'bg-indigo-600 border-indigo-400 shadow-xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                         >
                            <div className="flex items-center gap-4">
                               <Calendar size={18} className="text-indigo-300" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{termKey}</span>
                            </div>
                            <ChevronRightIcon size={14} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                         </button>
                       )) : (
                         <p className="text-[10px] text-slate-500 italic">Registry verified: No previous terms archived.</p>
                       )}
                    </div>
                 </div>
              )}

              <GradingLegend />
           </div>

           <div className="lg:col-span-3">
              {selectedTranscriptStudent && selectedHistoricalTerm ? (
                 <div className="space-y-8 animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-slate-900">Historical Report Card</h3>
                       <div className="flex gap-2">
                          <button onClick={() => setShowPrintPreview(true)} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 shadow-sm"><Printer size={16}/> Print Copy</button>
                          <button onClick={() => handleExportReport()} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl shadow-slate-200">
                             <Download size={16} /> Secure Export
                          </button>
                       </div>
                    </div>
                    
                    <div className="bg-white p-16 rounded-[4rem] shadow-3xl border border-slate-100 relative overflow-hidden text-left">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><ShieldCheck size={300} className="text-indigo-600" /></div>
                       
                       <div className="border-b-8 border-indigo-600 pb-12 mb-12 flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-8">
                             <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl">E</div>
                             <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">EDUSTREAM ACADEMY</h1>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Archived Academic Transcript</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <h2 className="text-3xl font-black text-slate-800 uppercase leading-none mb-1">{selectedHistoricalTerm.term}</h2>
                             <p className="text-base font-bold text-indigo-600">{selectedHistoricalTerm.year} Session</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-16 mb-16 pb-12 border-b border-slate-100 relative z-10">
                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Student Identification:</p>
                             <p className="text-2xl font-black text-slate-900 uppercase">{selectedTranscriptStudent.name}</p>
                             <div className="flex gap-4">
                               <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">ID: {selectedTranscriptStudent.id}</p>
                               <p className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">Class: {selectedTranscriptStudent.grade}</p>
                             </div>
                          </div>
                          <div className="text-right flex flex-col justify-end">
                             <div className="p-4 bg-slate-900 rounded-3xl text-center text-white shadow-xl">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Total BECE Aggregate</p>
                                <p className="text-4xl font-black text-amber-400">{calculateBECEAggregate(selectedTranscriptStudent.academicHistory)}</p>
                             </div>
                          </div>
                       </div>

                       <div className="relative z-10">
                          <table className="w-full mb-12 text-left">
                             <thead>
                                <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b-4 border-slate-100">
                                   <th className="px-8 py-6">Academic Discipline</th>
                                   <th className="px-8 py-6 text-center">Score (%)</th>
                                   <th className="px-8 py-6 text-right">Standard Result</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {groupedHistory[`${selectedHistoricalTerm.year} - ${selectedHistoricalTerm.term}`]?.map((h, i) => (
                                   <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                      <td className="px-8 py-6 text-lg font-black text-slate-800 uppercase tracking-tight">{h.subject}</td>
                                      <td className="px-8 py-6 text-lg font-bold text-center text-slate-600">{h.grade}%</td>
                                      <td className="px-8 py-6 text-right">
                                         <span className={`px-5 py-2 ${getBECEGrade(h.grade).color} text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-md`}>
                                            {convertScore(h.grade, 'BECE')}
                                         </span>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>

                          <div className="p-10 bg-indigo-50/20 rounded-[3rem] border-2 border-indigo-100/50 mb-16">
                             <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <MessageSquare size={16} className="text-indigo-500" /> Historical Qualitative Log
                             </h5>
                             <p className="text-lg text-slate-700 font-medium leading-relaxed italic border-l-8 border-indigo-400 pl-8 py-4">
                                "Learner demonstrated consistent application of fundamental concepts during this term. Peer collaboration scores remained in the top quintile. Academic discipline is excellent."
                             </p>
                          </div>
                       </div>

                       <div className="pt-20 flex items-center justify-between">
                          <div className="text-center w-64"><div className="h-[2px] bg-slate-200 w-full mb-4"></div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registrar General</p></div>
                          <div className="text-center w-64"><div className="h-[2px] bg-slate-200 w-full mb-4"></div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Principal</p></div>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="h-[700px] bg-slate-100/50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl"><History className="w-10 h-10 text-slate-300" /></div>
                    <h3 className="text-3xl font-black text-slate-800 mb-4">Historical Archive Viewer</h3>
                    <p className="text-slate-400 max-w-sm text-base font-medium leading-relaxed">Select a student and an archived term from the directory to load their historical performance record.</p>
                 </div>
              )}
           </div>
        </div>
      ) : activeSubTab === 'reports' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Active Students</h3>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
                   <div className="p-4 border-b">
                      <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                         <input type="text" placeholder="Quick search..." className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" />
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                      {students.map(s => (
                        <button key={s.id} onClick={() => setSelectedReportStudent(s)} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedReportStudent?.id === s.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                           <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-black text-xs">{s.name[0]}</div>
                           <div className="text-left min-w-0">
                              <p className="text-xs font-black truncate">{s.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{s.id.split('-').pop()}</p>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              
              <GradingLegend />
           </div>
           
           <div className="lg:col-span-3">
              {selectedReportStudent ? (
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">Live Report Builder</h3>
                      <div className="flex gap-2">
                        <button onClick={() => setShowPrintPreview(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 flex items-center gap-2 hover:bg-slate-50"><Printer size={16} /> Print</button>
                        <button onClick={handleExportReport} disabled={isExporting} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                          {isExporting ? 'Generating...' : 'Export PDF'}
                        </button>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 scale-[0.98] origin-top text-left">
                         <div className="border-b-4 border-indigo-600 pb-8 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-lg">E</div>
                               <div><h4 className="text-xl font-black text-slate-900 leading-none">EDUSTREAM PRO</h4><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Intelligence Hub</p></div>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6 mb-10">
                            <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Student</p><p className="text-sm font-black text-slate-900 uppercase truncate">{selectedReportStudent.name}</p></div>
                            <div className="text-right flex flex-col items-end">
                               <div className="bg-indigo-600 text-white px-3 py-1 rounded-xl shadow-lg mb-1">
                                  <p className="text-[8px] font-black uppercase opacity-60">Aggregate</p>
                                  <p className="text-lg font-black">{calculateBECEAggregate(selectedReportStudent.academicHistory)}</p>
                               </div>
                               <p className="text-[9px] font-black text-indigo-600 uppercase">{selectedReportStudent.grade}</p>
                            </div>
                         </div>
                         <table className="w-full mb-10">
                            <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase"><th className="px-4 py-4 text-left">Subject</th><th className="px-4 py-4 text-center">Score</th><th className="px-4 py-4 text-right">Result</th></tr></thead>
                            <tbody className="divide-y">{selectedReportStudent.academicHistory.map((h, i) => (<tr key={i}><td className="px-4 py-4 text-sm font-bold text-slate-700">{h.subject}</td><td className="px-4 py-4 text-sm font-black text-center">{h.grade}%</td><td className="px-4 py-4 text-sm font-black text-right text-indigo-600">{convertScore(h.grade, activeScale)}</td></tr>))}</tbody>
                         </table>
                         <div className="space-y-6">
                            <div><p className="text-[9px] font-black text-indigo-600 uppercase border-b border-indigo-100 pb-1 mb-2">Qualitative Assessment</p><p className="text-xs text-slate-600 font-medium italic leading-relaxed">"{teacherComments}"</p></div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-left">
                            <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500" /> Qualitative Feedback</h4>
                            <div className="space-y-6">
                               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Class Teacher's Comments</label><textarea rows={4} value={teacherComments} onChange={(e) => setTeacherComments(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm font-medium" placeholder="Describe learner proficiency..." /></div>
                               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Presets</label><div className="flex flex-wrap gap-2">
                                 {['Highest Proficiency', 'High Average', 'Average', 'Developing'].map(label => (
                                   <button key={label} onClick={() => setTeacherComments(`Learner demonstrates ${label.toLowerCase()} in all core understanding and logic application tasks.`)} className="px-4 py-2 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100">{label}</button>
                                 ))}
                               </div></div>
                            </div>
                         </div>
                         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl text-left"><h4 className="text-sm font-black mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-indigo-400" /> Regulatory Notice</h4><div className="space-y-4"><p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">This report adheres to the BECE Numerical Scaling guidelines. All computations are digitally signed and verified against institutional standards.</p></div></div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-[600px] bg-slate-100/50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95">
                   <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm"><FileText className="w-10 h-10 text-slate-300" /></div>
                   <h3 className="text-3xl font-black text-slate-800 mb-2">Build Active Report</h3>
                   <p className="text-slate-400 max-w-sm text-base font-medium">Select a student from the active cohort roster to begin generating a term-end report card.</p>
                </div>
              )}
           </div>
        </div>
      ) : activeSubTab === 'assessments' ? (
        <div className="space-y-8">
           {enteringScoresFor ? (
             <div className="bg-white rounded-[3.5rem] shadow-3xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-4">
                <div className="p-10 border-b flex items-center justify-between bg-slate-50/40">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setEnteringScoresFor(null)} className="p-4 bg-white border rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm"><ChevronLeft size={24}/></button>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Score Entry: {enteringScoresFor.name}</h3>
                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">Target Max Score: {enteringScoresFor.maxScore} pts</p>
                      </div>
                   </div>
                   <button onClick={saveScores} disabled={isSaving} className="px-10 py-5 bg-indigo-600 text-white rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                     {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20}/>} Commit Registry
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead><tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest border-b"><th className="px-10 py-8">Student Identification</th><th className="px-10 py-8 text-right">Raw Score</th><th className="px-10 py-8 text-right">BECE Equivalent</th></tr></thead>
                     <tbody className="divide-y divide-slate-100">
                        {students.map(s => {
                           const scoreVal = tempScores[s.id] || 0;
                           const percentage = (scoreVal / enteringScoresFor.maxScore) * 100;
                           return (
                             <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                               <td className="px-10 py-10"><div className="flex items-center gap-5"><div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-800 text-lg">{s.name[0]}</div><div><p className="font-black text-slate-900 text-base">{s.name}</p><p className="text-[10px] font-mono text-slate-400">{s.id}</p></div></div></td>
                               <td className="px-10 py-10 text-right"><input type="number" max={enteringScoresFor.maxScore} value={scoreVal} onChange={(e) => setTempScores({...tempScores, [s.id]: Number(e.target.value)})} className="w-28 px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white text-right font-black text-xl text-slate-800 transition-all" /></td>
                               <td className="px-10 py-10 text-right"><span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl text-white shadow-sm ${getBECEGrade(percentage).color}`}>Grade {getBECEGrade(percentage).grade}</span></td>
                             </tr>
                           );
                        })}
                     </tbody>
                   </table>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><Plus className="w-8 h-8 text-indigo-500" /> New Log</h3>
                  <form onSubmit={(e) => { e.preventDefault(); onAction('3.3'); }} className="space-y-5 text-left">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                       <input type="text" required className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold outline-none focus:border-indigo-500 transition-all" placeholder="Assessment Name" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Points</label>
                       <input type="number" required className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold outline-none focus:border-indigo-500 transition-all" placeholder="100" />
                    </div>
                    <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest">Initialize Entry</button>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white rounded-[3.5rem] shadow-3xl border border-slate-100 overflow-hidden">
                  <div className="p-10 border-b flex items-center justify-between bg-slate-50/40"><h3 className="text-2xl font-black text-slate-900">Current Session Evaluation Logs</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b"><th className="px-10 py-8">Evaluation Identity</th><th className="px-10 py-8 text-center">Max Points</th><th className="px-10 py-8 text-right">Actions</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">{assessments.map((as) => (
                        <tr key={as.id} className="group hover:bg-slate-50 transition-all">
                          <td className="px-10 py-10"><div><p className="font-black text-slate-900 text-lg">{as.name}</p><span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl uppercase tracking-widest">{as.category}</span></div></td>
                          <td className="px-10 py-10 text-center"><span className="text-base font-black text-slate-800">{as.maxScore} pts</span></td>
                          <td className="px-10 py-10 text-right"><button onClick={() => handleEnterScores(as)} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm">Enter Raw Scores</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
           )}
        </div>
      ) : activeSubTab === 'config' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><PieChart className="w-80 h-80" /></div>
                 <div className="relative z-10 text-left">
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Weighting Configuration</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Define impact parameters for final aggregate</p>
                    
                    <div className="space-y-12">
                       {['Homework & Classwork', 'Quizzes & Mid-terms', 'Final Examinations'].map((label, idx) => (
                         <div key={label} className="space-y-4">
                            <div className="flex justify-between items-center">
                               <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{label}</label>
                               <span className="text-2xl font-black text-indigo-600">{idx === 0 ? '20%' : idx === 1 ? '30%' : '50%'}</span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200 shadow-inner">
                               <div className={`h-full absolute left-0 top-0 transition-all duration-700 ${idx === 0 ? 'bg-amber-500 w-[20%]' : idx === 1 ? 'bg-blue-500 w-[30%]' : 'bg-indigo-600 w-[50%]'}`} />
                            </div>
                         </div>
                       ))}
                    </div>

                    <button className="w-full mt-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4">
                       <Save size={24} /> Commit Weighting Rules
                    </button>
                 </div>
              </div>
           </div>
           <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl text-left">
                 <h3 className="text-2xl font-black mb-10 flex items-center gap-4"><Scale size={32} className="text-indigo-400" /> Active Framework</h3>
                 <div className="space-y-4">
                    {[
                      { id: 'BECE', label: 'BECE (Ghana)', desc: 'Official 1-9 Numerical', icon: Hash, color: 'indigo' },
                      { id: 'NaCCA_Proficiency', label: 'NaCCA (Ghana)', desc: 'Competency Lvl 1-5', icon: ShieldAlert, color: 'blue' },
                      { id: 'Percentage', label: 'Raw Percentage', desc: '0-100% Standard Scale', icon: Percent, color: 'slate' },
                    ].map((scale) => (
                      <button 
                        key={scale.id} 
                        onClick={() => setActiveScale(scale.id as any)}
                        className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 group ${activeScale === scale.id ? 'bg-indigo-600 border-indigo-500 shadow-xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeScale === scale.id ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                            <scale.icon size={28} />
                         </div>
                         <div>
                            <p className="font-black text-base">{scale.label}</p>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{scale.desc}</p>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-left">
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Validation Integrity</h4>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                       <p className="text-xs font-bold text-slate-600">BECE Numerical calculations verified against GES 2024 handbook.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                       <p className="text-xs font-bold text-slate-600">Auto-rounding protocol set to 2 decimal places.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : null}

      {/* Shared Print Preview Overlay */}
      {showPrintPreview && (selectedReportStudent || selectedTranscriptStudent) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPrintPreview(false)}></div>
           <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-3xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-8 bg-slate-50 border-b flex items-center justify-between">
                 <h4 className="text-xl font-black text-slate-900">Official Certification Preview</h4>
                 <div className="flex gap-2">
                    <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100"><Printer size={16}/> Print</button>
                    <button onClick={() => setShowPrintPreview(false)} className="p-3 bg-white border rounded-xl text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-200/20">
                 <div className="bg-white p-16 shadow-2xl border border-slate-100 max-w-[210mm] mx-auto min-h-[297mm] flex flex-col text-left">
                    <div className="border-b-8 border-indigo-600 pb-10 mb-12 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl">E</div>
                          <div>
                             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">EDUSTREAM ACADEMY</h1>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Official Academic Registry</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-16 pb-8 border-b border-slate-100">
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Student Name:</p>
                          <p className="text-xl font-black text-slate-900 uppercase">{(selectedReportStudent || selectedTranscriptStudent)?.name}</p>
                          <p className="text-sm font-bold text-indigo-600">ID: {(selectedReportStudent || selectedTranscriptStudent)?.id}</p>
                       </div>
                       <div className="text-right space-y-2">
                          <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-xl">
                             <p className="text-[8px] font-black uppercase opacity-60">Aggregate Points</p>
                             <p className="text-2xl font-black">{calculateBECEAggregate((selectedReportStudent || selectedTranscriptStudent)!.academicHistory)}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1">
                       <table className="w-full mb-12 text-left">
                          <thead>
                             <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
                                <th className="px-6 py-4">Academic Discipline</th>
                                <th className="px-6 py-4 text-center">Score (%)</th>
                                <th className="px-6 py-4 text-right">BECE Result</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {(selectedReportStudent || selectedTranscriptStudent)?.academicHistory.map((h, i) => (
                                <tr key={i} className="group">
                                   <td className="px-6 py-5 text-sm font-black text-slate-800 uppercase tracking-tight">{h.subject}</td>
                                   <td className="px-6 py-5 text-sm font-bold text-center text-slate-600">{h.grade}%</td>
                                   <td className="px-6 py-5 text-sm font-black text-right text-indigo-700">{convertScore(h.grade, activeScale)}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>

                       <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 mb-12">
                          <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <MessageSquare size={14} /> Narrative Assessment
                          </h5>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed italic border-l-4 border-indigo-400 pl-6 py-2">
                             "{teacherComments}"
                          </p>
                       </div>
                    </div>

                    <div className="pt-20 flex items-center justify-between">
                       <div className="text-center w-48"><div className="h-px bg-slate-300 w-full mb-3"></div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registrar</p></div>
                       <div className="flex flex-col items-center"><ShieldCheck size={40} className="text-indigo-100" /><p className="text-[8px] font-black text-indigo-400 uppercase mt-2">Certified Record</p></div>
                       <div className="text-center w-48"><div className="h-px bg-slate-300 w-full mb-3"></div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Principal</p></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Grading;
