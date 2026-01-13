
import React from 'react';
import { ChecklistItem } from '../types';
import { CheckCircle2, Circle, ListTodo, ShieldCheck, Zap } from 'lucide-react';

interface ChecklistSummaryProps {
  checklist: ChecklistItem[];
}

const ChecklistSummary: React.FC<ChecklistSummaryProps> = ({ checklist }) => {
  const completedCount = checklist.filter(i => i.status === 'Completed').length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  const grouped = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Zap size={180} className="text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ListTodo size={24} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Deployment Readiness Log</h2>
            </div>
            <p className="text-indigo-200 font-medium max-w-lg">
              Dynamic verification of system requirements. Items are automatically marked as "Completed" upon live user interaction in the current session.
            </p>
          </div>
          <div className="text-center md:text-right bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 min-w-[200px]">
            <span className="text-6xl font-black text-indigo-400 tracking-tighter">{progress}%</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Operational Unity</p>
          </div>
        </div>
      </div>

      <div className="p-10 md:p-14 space-y-12">
        {(Object.entries(grouped) as [string, ChecklistItem[]][]).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap">{category} Registry</h3>
              <div className="h-px w-full bg-slate-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className={`
                    flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500
                    ${item.status === 'Completed' 
                      ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' 
                      : 'bg-slate-50/30 border-slate-100 opacity-60'}
                  `}
                >
                  {item.status === 'Completed' ? (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md animate-in zoom-in">
                      <CheckCircle2 size={14} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-200 shrink-0" />
                  )}
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-400 mb-1 block">ID {item.id}</span>
                    <p className={`text-xs font-bold leading-relaxed ${item.status === 'Completed' ? 'text-emerald-900' : 'text-slate-600'}`}>
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
               <ShieldCheck size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic max-w-sm">
               Compliance Check: All architectural patterns adhere to the Midas Touch Pro 4.2 standard.
            </p>
         </div>
         <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            Finalize Deployment Protocol
         </button>
      </div>
    </div>
  );
};

export default ChecklistSummary;
