
import React, { useState, useMemo } from 'react';
import { User, UserRole, LibraryAsset, AssetStatus, BorrowingRecord } from '../types';
import { 
  Book, 
  Search, 
  Filter, 
  History, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Barcode, 
  MapPin, 
  User as UserIcon, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Layers,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { INITIAL_LIBRARY_ASSETS, INITIAL_BORROWING_RECORDS } from '../mockData';

interface LibraryProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const Library: React.FC<LibraryProps> = ({ currentUser, onAction }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-borrowings' | 'admin'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<LibraryAsset[]>(INITIAL_LIBRARY_ASSETS);
  const [records, setRecords] = useState<BorrowingRecord[]>(INITIAL_BORROWING_RECORDS);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isStaff = isAdmin || currentUser.role === UserRole.TEACHER;

  const filteredAssets = useMemo(() => {
    return assets.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  const handleReturn = (recordId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: 'RETURNED', returnDate: new Date().toISOString().split('T')[0] } : r));
      setIsProcessing(false);
      onAction('15.1');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Book className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Media & Assets</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Library Catalog & Equipment Ledger</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'catalog' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Digital Catalog
          </button>
          {!isAdmin && (
            <button 
              onClick={() => setActiveTab('my-borrowings')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my-borrowings' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              My Borrowings
            </button>
          )}
          {isStaff && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Audit & Circulation
            </button>
          )}
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-6">
              <div className="relative flex-1 w-full">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input 
                  type="text" 
                  placeholder="Find books, tablets, or lab equipment..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10" 
                 />
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"><Filter size={24}/></button>
                 <button className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3"><Barcode size={18}/> Scan Asset</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden hover:-translate-y-2 transition-all group">
                   <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                      {asset.coverImage ? (
                        <img src={asset.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={asset.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200"><Smartphone size={80}/></div>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-lg backdrop-blur-md ${
                        asset.status === AssetStatus.AVAILABLE ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-600'
                      }`}>
                         {asset.status}
                      </div>
                   </div>
                   <div className="p-8">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{asset.category}</p>
                      <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 line-clamp-1">{asset.title}</h4>
                      <p className="text-sm text-slate-500 font-medium mb-6">by {asset.author}</p>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                         <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{asset.location}</span>
                         </div>
                         <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Details</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : activeTab === 'my-borrowings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Current Activity</h3>
              <div className="space-y-4">
                 {records.map(record => (
                   <div key={record.id} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-8 group">
                      <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                        {record.assetId.startsWith('BK') ? <Book size={32}/> : <Smartphone size={32}/>}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                            <h4 className="text-xl font-black text-slate-900">{record.assetName}</h4>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              record.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                               {record.status}
                            </span>
                         </div>
                         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Billed ID: {record.assetId}</p>
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
                            <div className="flex items-center gap-2">
                               <Clock size={16} className="text-slate-300" />
                               <div className="text-left">
                                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Borrow Date</p>
                                  <p className="text-xs font-black text-slate-700">{record.borrowDate}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <AlertCircle size={16} className={record.status === 'OVERDUE' ? 'text-rose-500' : 'text-indigo-500'} />
                               <div className="text-left">
                                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Due Date</p>
                                  <p className={`text-xs font-black ${record.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-700'}`}>{record.dueDate}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Request Extension</button>
                        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-all">Report Issue</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
                 <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><ShieldCheck className="w-8 h-8 text-indigo-400" /> Policy Hub</h3>
                    <div className="space-y-6">
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                          <p className="text-xs font-black text-indigo-400 uppercase mb-2">Loan Period</p>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">Textbooks are issued for 14 days. Lab equipment must be returned same-day before 4:00 PM.</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                          <p className="text-xs font-black text-indigo-400 uppercase mb-2">Overdue Protocol</p>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">Overdue items incur a ₵5.00 daily fine. 3 consecutive strikes suspend borrowing privileges.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        /* Administrative Audit View */
        <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
           <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-3xl border-2 border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm"><Layers size={32}/></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Circulation Audit</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Inventory Tracking</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <Plus size={18}/> New Purchase Order
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest border-b">
                       <th className="px-10 py-6">Asset / Identification</th>
                       <th className="px-10 py-6">Current Holder</th>
                       <th className="px-10 py-6 text-center">Status Cycle</th>
                       <th className="px-10 py-6 text-right">Circulation Control</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-all group">
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                 <Barcode size={24}/>
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 text-sm">{record.assetName}</p>
                                  <p className="text-[10px] font-mono text-indigo-500 uppercase">{record.assetId}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon size={14}/></div>
                               <div>
                                  <p className="text-sm font-black text-slate-800">{record.studentName}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">{record.studentId}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              record.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                              record.status === 'RETURNED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                               {record.status}
                            </span>
                         </td>
                         <td className="px-10 py-8 text-right">
                            {record.status !== 'RETURNED' ? (
                              <button 
                                onClick={() => handleReturn(record.id)}
                                disabled={isProcessing}
                                className="px-5 py-2 bg-white border border-slate-200 text-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto"
                              >
                                {isProcessing ? <Loader2 className="w-3 h-3 animate-spin"/> : <CheckCircle2 size={14}/>} Confirm Return
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                 <ShieldCheck size={14}/> Processed {record.returnDate}
                              </div>
                            )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
