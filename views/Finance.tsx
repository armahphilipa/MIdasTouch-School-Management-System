
import React, { useState, useMemo } from 'react';
import { Invoice, User, UserRole, Student, FeeConfig, DiscountRule } from '../types';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ArrowUpRight, 
  Download, 
  AlertCircle,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Plus, 
  ArrowRight,
  ShieldCheck,
  Percent,
  TrendingUp,
  Settings,
  Mail,
  Bell,
  MoreVertical,
  X,
  CreditCard as CardIcon,
  Wallet,
  Loader2,
  Calendar,
  Clock,
  Printer,
  Stamp,
  Hash
} from 'lucide-react';
import { INITIAL_FEE_CONFIGS, INITIAL_DISCOUNT_RULES } from '../mockData';

interface FinanceProps {
  invoices: Invoice[];
  onAction: (id: string) => void;
  currentUser: User;
  students: Student[];
}

const Finance: React.FC<FinanceProps> = ({ invoices, onAction, currentUser, students }) => {
  const [activeView, setActiveView] = useState<'billing' | 'structure'>('billing');
  const [feeConfigs, setFeeConfigs] = useState<FeeConfig[]>(INITIAL_FEE_CONFIGS);
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(INITIAL_DISCOUNT_RULES);
  const [invoiceRegistry, setInvoiceRegistry] = useState<Invoice[]>(invoices);
  
  // Payment Simulation State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Mobile'>('Card');

  // Receipt/Invoice Preview State
  const [showDocumentPreview, setShowDocumentPreview] = useState<{ type: 'Receipt' | 'Invoice', invoice: Invoice } | null>(null);

  // New Invoice Modal
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isParent = currentUser.role === UserRole.PARENT;

  const stats = useMemo(() => {
    const total = invoiceRegistry.reduce((acc, inv) => acc + inv.amount, 0);
    const paid = invoiceRegistry.filter(i => i.status === 'PAID').reduce((acc, inv) => acc + inv.amount, 0);
    const overdue = invoiceRegistry.filter(i => i.status === 'LATE' || (i.status === 'UNPAID' && new Date(i.dueDate) < new Date())).reduce((acc, inv) => acc + inv.amount, 0);
    
    return [
      { label: 'Total Billed', value: `₵${total.toLocaleString()}`, color: 'text-indigo-600', trend: '+14%' },
      { label: 'Collected', value: `₵${paid.toLocaleString()}`, color: 'text-emerald-600', trend: '+12%' },
      { label: 'Overdue/Outstanding', value: `₵${overdue.toLocaleString()}`, color: 'text-rose-600', trend: '-2%' },
    ];
  }, [invoiceRegistry]);

  const handlePayNow = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPaymentStep('method');
  };

  const processPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setInvoiceRegistry(prev => prev.map(inv => 
        inv.id === payingInvoice?.id ? { ...inv, status: 'PAID' } : inv
      ));
      onAction('5.2');
      onAction('14.1'); // Task 14.1 completion: receipt logic activated
    }, 2000);
  };

  const handlePreviewDocument = (type: 'Receipt' | 'Invoice', inv: Invoice) => {
    setShowDocumentPreview({ type, invoice: inv });
    onAction('14.1');
  };

  const batchGenerate = () => {
    setIsBatchGenerating(true);
    setTimeout(() => {
      // Fix: Add version, lastModified, and modifiedBy to each generated Invoice (satisfying BaseEntity)
      const newInvoices: Invoice[] = students.map(s => {
        const config = feeConfigs.find(c => s.grade.includes(c.grade.split(' ')[1])) || feeConfigs[1];
        const base = config.baseTuition + config.labFees + config.activities;
        return {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId: s.id,
          studentName: s.name,
          amount: base,
          dueDate: '2024-07-01',
          status: 'UNPAID',
          type: 'Tuition',
          billingPeriod: '1st Term 2025',
          version: 1,
          lastModified: new Date().toISOString(),
          modifiedBy: currentUser.id
        };
      });
      setInvoiceRegistry([...newInvoices, ...invoiceRegistry]);
      setIsBatchGenerating(false);
      onAction('5.3');
      onAction('5.1'); 
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Finance Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{s.label}</span>
              <h3 className={`text-4xl font-black ${s.color}`}>{s.value}</h3>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
               <div className="flex items-center gap-1 text-[11px] font-black text-emerald-500">
                 <TrendingUp className="w-3.5 h-3.5" /> {s.trend}
               </div>
               <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Detail Report</button>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Global Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveView('billing')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeView === 'billing' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}
          >
            Ledger & Billing
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveView('structure')}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeView === 'structure' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}
            >
              Rules & Config
            </button>
          )}
        </div>
        
        <div className="flex gap-3">
          {isAdmin && (
            <>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-3">
                <FileText className="w-4 h-4" /> Export CSV
              </button>
              <button 
                onClick={batchGenerate}
                disabled={isBatchGenerating}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3"
              >
                {isBatchGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                Generate Next Cycle
              </button>
            </>
          )}
          {isParent && (
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3">
              <Download className="w-4 h-4" /> Financial Statement
            </button>
          )}
        </div>
      </div>

      {activeView === 'billing' ? (
        <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search invoices by student name..." className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl outline-none font-bold text-slate-800 shadow-sm" />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-[10px] font-black uppercase text-slate-500 flex items-center gap-3">
                 <Filter className="w-4 h-4" /> Filter Status
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-[10px] font-black uppercase text-slate-500 flex items-center gap-3">
                 <Calendar className="w-4 h-4" /> This Term
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b">
                  <th className="px-10 py-6">Reference ID</th>
                  <th className="px-10 py-6">Student / Context</th>
                  <th className="px-10 py-6">Amount Billed</th>
                  <th className="px-10 py-6">Due Date</th>
                  <th className="px-10 py-6">Lifecycle Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceRegistry.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-8 font-mono font-black text-indigo-600 text-xs">#{inv.id}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {inv.studentName[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-none mb-1.5">{inv.studentName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inv.billingPeriod} • {inv.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-lg font-black text-slate-800">₵{inv.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</span>
                        {inv.status === 'UNPAID' && new Date(inv.dueDate) < new Date() && (
                          <span className="text-[9px] text-rose-500 font-black uppercase mt-1 flex items-center gap-1 animate-pulse"><AlertCircle size={10} /> Late Fee Incurred</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`
                        inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                        ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          inv.status === 'UNPAID' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}
                      `}>
                        {inv.status === 'PAID' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handlePreviewDocument(inv.status === 'PAID' ? 'Receipt' : 'Invoice', inv)}
                          className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-200 shadow-sm"
                          title={inv.status === 'PAID' ? "View Receipt" : "View Invoice"}
                        >
                          <FileText size={18} />
                        </button>
                        {inv.status !== 'PAID' && (
                          <button 
                            onClick={() => handlePayNow(inv)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                          >
                            Pay Online
                          </button>
                        )}
                        <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-900 shadow-sm"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Configuration View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-3xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 className="w-64 h-64" /></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Academic Fee Scaling</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Base configurations for class cohorts</p>
                  </div>
                  <button className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100 hover:rotate-90 transition-transform"><Plus size={24} /></button>
                </div>
                
                <div className="space-y-6">
                  {feeConfigs.map((config, idx) => (
                    <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-300 hover:bg-white transition-all group">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <TrendingUp size={28} />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 leading-none mb-1.5">{config.grade}</h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Automatic Batch Generation Enabled</p>
                          </div>
                        </div>
                        <div className="flex gap-8 items-center">
                          <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Base</p>
                            <p className="text-3xl font-black text-slate-900">₵{(config.baseTuition + config.labFees + config.activities).toLocaleString()}</p>
                          </div>
                          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors shadow-sm"><Settings size={20}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
                         <div className="p-4 bg-white/50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Tuition</p>
                            <p className="font-black text-slate-800">₵{config.baseTuition}</p>
                         </div>
                         <div className="p-4 bg-white/50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Laboratory</p>
                            <p className="font-black text-slate-800">₵{config.labFees}</p>
                         </div>
                         <div className="p-4 bg-white/50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Facilities</p>
                            <p className="font-black text-slate-800">₵{config.activities}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl h-full border border-slate-800">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-indigo-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-400/20 shadow-lg shadow-indigo-500/10">
                    <Percent size={28} />
                  </div>
                  <h3 className="text-2xl font-black">Discount Logic</h3>
               </div>
               
               <div className="space-y-4">
                 {discountRules.map((rule) => (
                   <div key={rule.id} className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div>
                        <p className="font-black text-lg text-white mb-1">{rule.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{rule.type} ELIGIBILITY</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-indigo-400">-{rule.percentage}%</span>
                        <button className="p-2 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={18}/></button>
                      </div>
                   </div>
                 ))}
                 <button className="w-full py-5 rounded-[2rem] border-2 border-dashed border-white/10 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-3 mt-4">
                    <Plus size={16}/> Create Rule
                 </button>
               </div>

               <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-black mb-4">Calculation Engine</h4>
                    <p className="text-sm font-medium text-indigo-100 opacity-80 leading-relaxed mb-6">
                      Discounts are applied recursively to the Base Tuition. Late fees are set at a fixed 5% after the 7-day grace period.
                    </p>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-4 h-4 text-white" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Tax Compliant Logs</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal (14.1 Receipt/Invoice) */}
      {showDocumentPreview && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowDocumentPreview(null)}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-3xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-300">
             <div className="p-8 bg-slate-50 border-b flex items-center justify-between">
                <h4 className="text-xl font-black text-slate-900">Document Preview: Official {showDocumentPreview.type}</h4>
                <div className="flex gap-2">
                   <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100"><Printer size={16}/> Print</button>
                   <button onClick={() => setShowDocumentPreview(null)} className="p-3 bg-white border rounded-xl text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-12 bg-slate-200/20">
                <div className="bg-white p-16 shadow-2xl border border-slate-100 max-w-[210mm] mx-auto min-h-[297mm] flex flex-col">
                   {/* Branded Header */}
                   <div className="border-b-8 border-indigo-600 pb-10 mb-12 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl">E</div>
                         <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">EDUSTREAM PRO</h1>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Institutional Financial Registry</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <h2 className="text-2xl font-black text-slate-800 uppercase">{showDocumentPreview.type}</h2>
                         <div className="flex items-center gap-2 justify-end text-xs font-mono font-bold text-indigo-600 mt-1">
                            <Hash size={12}/> {showDocumentPreview.invoice.id}
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-12 mb-16 pb-8 border-b border-slate-100">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed To:</p>
                         <div>
                            <p className="text-xl font-black text-slate-900 uppercase">{showDocumentPreview.invoice.studentName}</p>
                            <p className="text-sm font-bold text-slate-500">ID: {showDocumentPreview.invoice.studentId}</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Guardian Registered Residence</p>
                         </div>
                      </div>
                      <div className="text-right space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Cycle:</p>
                         <div>
                            <p className="text-lg font-black text-slate-900">{showDocumentPreview.invoice.billingPeriod}</p>
                            <p className="text-sm font-bold text-slate-500">Term Academic Year 2024</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1">
                      <table className="w-full mb-12">
                         <thead>
                            <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
                               <th className="px-6 py-4 text-left">Description</th>
                               <th className="px-6 py-4 text-center">Reference</th>
                               <th className="px-6 py-4 text-right">Amount (GHS)</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            <tr>
                               <td className="px-6 py-6">
                                  <p className="text-sm font-black text-slate-800 uppercase">{showDocumentPreview.invoice.type}</p>
                                  <p className="text-xs text-slate-500 mt-1">Standard Tuition fees for the current academic session.</p>
                               </td>
                               <td className="px-6 py-6 text-center text-sm font-mono text-slate-400">#FS-2024-001</td>
                               <td className="px-6 py-6 text-right text-sm font-black text-slate-800">₵{showDocumentPreview.invoice.amount.toLocaleString()}.00</td>
                            </tr>
                         </tbody>
                      </table>

                      <div className="flex justify-end mt-12">
                         <div className="w-80 space-y-4">
                            <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl">
                               <span className="text-[10px] font-black text-slate-400 uppercase">Subtotal</span>
                               <span className="text-sm font-black text-slate-800">₵{showDocumentPreview.invoice.amount.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl">
                               <span className="text-[10px] font-black text-slate-400 uppercase">Tax (Exempt)</span>
                               <span className="text-sm font-black text-slate-800">₵0.00</span>
                            </div>
                            <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                               <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                               <span className="text-2xl font-black">₵{showDocumentPreview.invoice.amount.toLocaleString()}.00</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-20 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center text-slate-100 relative group overflow-hidden">
                            <Stamp size={48} className="rotate-12 group-hover:rotate-0 transition-transform" />
                            {showDocumentPreview.type === 'Receipt' && (
                              <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center text-emerald-600 border-4 border-emerald-500 rounded-full font-black text-[10px] uppercase -rotate-12">
                                 Paid In Full
                              </div>
                            )}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 uppercase leading-none">Bursary Dept.</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Digitally Verified Document</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-8">Authorizing Officer</p>
                         <div className="h-px bg-slate-300 w-48 mb-2"></div>
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Official Institutional Registry</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setPayingInvoice(null)}></div>
          
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
             {paymentStep === 'method' && (
               <div className="p-12">
                 <div className="flex items-center justify-between mb-12">
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h3>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Reference: {payingInvoice.id}</p>
                   </div>
                   <button onClick={() => setPayingInvoice(null)} className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
                 </div>

                 <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10 flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payable Amount</p>
                       <p className="text-4xl font-black text-slate-900">₵{payingInvoice.amount.toLocaleString()}</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       {payingInvoice.type}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-10">
                   <button 
                     onClick={() => setPaymentMethod('Card')}
                     className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 ${paymentMethod === 'Card' ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl shadow-indigo-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-100'}`}
                   >
                     <CardIcon size={32} />
                     <span className="font-black text-xs uppercase tracking-widest">Credit / Debit Card</span>
                   </button>
                   <button 
                     onClick={() => setPaymentMethod('Mobile')}
                     className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 ${paymentMethod === 'Mobile' ? 'bg-emerald-600 text-white border-emerald-400 shadow-xl shadow-indigo-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-100'}`}
                   >
                     <Smartphone size={32} />
                     <span className="font-black text-xs uppercase tracking-widest">Mobile Wallet</span>
                   </button>
                 </div>

                 <button 
                   onClick={processPayment}
                   className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black hover:-translate-y-2 transition-all flex items-center justify-center gap-4"
                 >
                   Confirm & Pay
                   <ArrowRight size={24} />
                 </button>
               </div>
             )}

             {paymentStep === 'processing' && (
               <div className="p-20 flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 rounded-full border-8 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-indigo-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <ShieldCheck className="w-12 h-12 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Authenticating...</h3>
                  <p className="text-slate-500 font-medium">Securing transaction via multi-factor tunnel</p>
               </div>
             )}

             {paymentStep === 'success' && (
               <div className="p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-3xl shadow-emerald-200 animate-bounce">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-2">Payment Received</h3>
                  <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-xs">Your payment of ₵{payingInvoice.amount.toLocaleString()} was successful. A receipt has been generated automatically.</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                     <button 
                        onClick={() => handlePreviewDocument('Receipt', payingInvoice)}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-white transition-colors flex items-center justify-center gap-2"
                     >
                        <Printer size={16}/> View Receipt
                     </button>
                     <button onClick={() => setPayingInvoice(null)} className="p-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">Dismiss</button>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
