
import React, { useState, useMemo } from 'react';
import { User, UserRole, StaffRecord, Payslip } from '../types';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  History, 
  X,
  FileText,
  Loader2,
  Calendar,
  Building2,
  Phone,
  Mail,
  Zap,
  Stamp,
  Hash
} from 'lucide-react';
import { INITIAL_STAFF_RECORDS, INITIAL_PAYSLIPS } from '../mockData';

interface HRProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const HR: React.FC<HRProps> = ({ currentUser, onAction }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'payroll' | 'performance'>('directory');
  const [staff, setStaff] = useState<StaffRecord[]>(INITIAL_STAFF_RECORDS);
  const [payslips, setPayslips] = useState<Payslip[]>(INITIAL_PAYSLIPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [showPayslipPreview, setShowPayslipPreview] = useState<Payslip | null>(null);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const handleProcessPayroll = () => {
    setIsProcessingPayroll(true);
    setTimeout(() => {
      setIsProcessingPayroll(false);
      onAction('18.1');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HR Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staffing & Payroll</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Human Capital Management Hub</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Directory
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('payroll')}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'payroll' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Payroll Ledger
            </button>
          )}
          <button 
            onClick={() => setActiveTab('performance')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Performance
          </button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Find staff by name or dept..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] outline-none font-bold text-slate-800" 
                />
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"><Filter size={24}/></button>
                 {isAdmin && (
                   <button className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                     <Plus size={18}/> New Contract
                   </button>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredStaff.map((person) => (
                <div key={person.id} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all group">
                   <div className="p-8">
                      <div className="flex items-start justify-between mb-8">
                         <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 text-3xl font-black border-4 border-white shadow-xl">
                           {person.name[0]}
                         </div>
                         <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              person.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              person.status === 'PROBATION' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                               {person.status}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">ID: {person.id}</p>
                         </div>
                      </div>

                      <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight">{person.name}</h4>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">{person.designation} • {person.department}</p>

                      <div className="space-y-4 mb-8">
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                               <Calendar size={14} className="text-slate-400" />
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenure Since</span>
                            </div>
                            <span className="text-xs font-bold text-slate-700">{person.joiningDate}</span>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                               <TrendingUp size={14} className="text-slate-400" />
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Perf. Score</span>
                            </div>
                            <span className={`text-xs font-black ${person.performanceScore >= 90 ? 'text-emerald-600' : 'text-indigo-600'}`}>{person.performanceScore}%</span>
                         </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-4 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">Profile</button>
                        <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"><MoreVertical size={16}/></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Monthly Payout</p>
                 <h3 className="text-3xl font-black text-slate-900">₵124,500</h3>
                 <div className="mt-4 flex items-center gap-1 text-[11px] font-black text-emerald-500">
                   <TrendingUp className="w-3.5 h-3.5" /> +2.4% Adjustment
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Run Date</p>
                 <h3 className="text-3xl font-black text-indigo-600">June 25, 2024</h3>
                 <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Automatic Disbursement Enabled</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Status</p>
                 <div className="flex items-center gap-3">
                   <ShieldCheck className="text-emerald-500" />
                   <h3 className="text-3xl font-black text-slate-900 uppercase">Verified</h3>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Tax Compliant</p>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-3xl border-2 border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm"><DollarSign size={32}/></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Payroll Registry</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">May 2024 Academic Cycle</p>
                  </div>
                </div>
                <div className="flex gap-4">
                   <button 
                    onClick={handleProcessPayroll}
                    disabled={isProcessingPayroll}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-black transition-all"
                   >
                      {isProcessingPayroll ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18}/>} 
                      {isProcessingPayroll ? 'Processing...' : 'Run Batch Disbursement'}
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest border-b">
                          <th className="px-10 py-6">Staff Associate</th>
                          <th className="px-10 py-6">Identity</th>
                          <th className="px-10 py-6 text-center">Gross Pay</th>
                          <th className="px-10 py-6 text-center">Lifecycle</th>
                          <th className="px-10 py-6 text-right">Documents</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {payslips.map((ps) => (
                         <tr key={ps.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">{ps.staffName[0]}</div>
                                  <span className="font-black text-slate-900 text-sm">{ps.staffName}</span>
                               </div>
                            </td>
                            <td className="px-10 py-8 font-mono text-xs text-indigo-600">#{ps.staffId}</td>
                            <td className="px-10 py-8 text-center font-black text-slate-900">
                               ₵{(ps.baseSalary + ps.allowances).toLocaleString()}
                            </td>
                            <td className="px-10 py-8 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                 ps.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                               }`}>
                                  {ps.status}
                               </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <button 
                                onClick={() => setShowPayslipPreview(ps)}
                                className="px-5 py-2 bg-white border border-slate-200 text-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto"
                               >
                                 <FileText size={14}/> Digital Payslip
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Award className="text-indigo-600" /> Faculty Benchmarking</h3>
              <div className="space-y-8">
                 {staff.map(s => (
                   <div key={s.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="font-black text-slate-900">{s.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{s.designation}</p>
                         </div>
                         <span className="text-lg font-black text-indigo-600">{s.performanceScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${s.performanceScore}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
              <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><ShieldCheck className="w-8 h-8 text-indigo-400" /> Appraisal Policy</h3>
                 <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                       <p className="text-xs font-black text-indigo-400 uppercase mb-2">Annual Reviews</p>
                       <p className="text-sm text-slate-400 font-medium leading-relaxed">Quantitative metrics are compiled from student attendance rates, curriculum coverage, and parent feedback logs.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                       <p className="text-xs font-black text-indigo-400 uppercase mb-2">Merit Bonuses</p>
                       <p className="text-sm text-slate-400 font-medium leading-relaxed">Staff maintaining a &gt;95% score for three consecutive terms are eligible for professional development grants.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showPayslipPreview && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowPayslipPreview(null)}></div>
           <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-3xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300">
             <div className="p-8 bg-slate-50 border-b flex items-center justify-between">
                <h4 className="text-xl font-black text-slate-900">Official Payslip Preview</h4>
                <div className="flex gap-2">
                   <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100"><Printer size={16}/> Print</button>
                   <button onClick={() => setShowPayslipPreview(null)} className="p-3 bg-white border rounded-xl text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-12 bg-slate-200/20">
                <div className="bg-white p-16 shadow-2xl border border-slate-100 max-w-[210mm] mx-auto min-h-[297mm] flex flex-col">
                   <div className="border-b-8 border-indigo-600 pb-10 mb-12 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl">E</div>
                         <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">EDUSTREAM PRO</h1>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Faculty & Personnel Services</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <h2 className="text-2xl font-black text-slate-800 uppercase">PAYSLIP</h2>
                         <div className="flex items-center gap-2 justify-end text-xs font-mono font-bold text-indigo-600 mt-1">
                            <Hash size={12}/> {showPayslipPreview.id}
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">Period: {showPayslipPreview.month} {showPayslipPreview.year}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-12 mb-16 pb-8 border-b border-slate-100">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Information:</p>
                         <div>
                            <p className="text-xl font-black text-slate-900 uppercase">{showPayslipPreview.staffName}</p>
                            <p className="text-sm font-bold text-slate-500">Employee ID: {showPayslipPreview.staffId}</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Dept of Sciences • Full-Time Associate</p>
                         </div>
                      </div>
                      <div className="text-right space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status:</p>
                         <div>
                            <p className="text-lg font-black text-emerald-600 uppercase">FULLY DISBURSED</p>
                            <p className="text-sm font-bold text-slate-500">Reference: {showPayslipPreview.disbursementDate || 'Processing'}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1">
                      <table className="w-full mb-12">
                         <thead>
                            <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
                               <th className="px-6 py-4 text-left">Earnings / Deductions</th>
                               <th className="px-6 py-4 text-right">Amount (GHS)</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            <tr>
                               <td className="px-6 py-6"><p className="text-sm font-black text-slate-800 uppercase">Base Contract Salary</p></td>
                               <td className="px-6 py-6 text-right text-sm font-black text-slate-800">₵{showPayslipPreview.baseSalary.toLocaleString()}.00</td>
                            </tr>
                            <tr>
                               <td className="px-6 py-6"><p className="text-sm font-black text-slate-800 uppercase">Faculty Allowances</p></td>
                               <td className="px-6 py-6 text-right text-sm font-black text-emerald-600">+ ₵{showPayslipPreview.allowances.toLocaleString()}.00</td>
                            </tr>
                            <tr>
                               <td className="px-6 py-6"><p className="text-sm font-black text-slate-800 uppercase">Statutory Deductions (SSNIT/Tax)</p></td>
                               <td className="px-6 py-6 text-right text-sm font-black text-rose-600">- ₵{showPayslipPreview.deductions.toLocaleString()}.00</td>
                            </tr>
                         </tbody>
                      </table>

                      <div className="flex justify-end mt-12">
                         <div className="w-80 space-y-4">
                            <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                               <span className="text-xs font-black uppercase tracking-widest">NET PAYABLE</span>
                               <span className="text-2xl font-black">₵{showPayslipPreview.netSalary.toLocaleString()}.00</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-20 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center relative overflow-hidden group">
                            <Stamp size={48} className="text-slate-100" />
                            <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center text-indigo-600 border-4 border-indigo-500 rounded-full font-black text-[10px] uppercase -rotate-12">
                               Authorized
                            </div>
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 uppercase leading-none">Bursary Dept.</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Institutional Record Log</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-8">Authorizing Officer</p>
                         <div className="h-px bg-slate-300 w-48 mb-2"></div>
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Digitally Signed Document</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
