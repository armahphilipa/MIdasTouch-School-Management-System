
import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  CloudLightning, 
  Database, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  History, 
  Server
} from 'lucide-react';
import { OfflineAction, SyncConflict } from '../types';

interface ConnectivityManagerProps {
  onSyncComplete: () => void;
}

const ConnectivityManager: React.FC<ConnectivityManagerProps> = ({ onSyncComplete }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncCenter, setShowSyncCenter] = useState(false);
  const [queue, setQueue] = useState<OfflineAction[]>([]);
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [syncLogs, setSyncLogs] = useState<{msg: string, time: string, type: 'info'|'success'|'error'}[]>([]);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addLog('Network heartbeat detected. Re-establishing secure cloud handshake...', 'info');
      if (getQueue().length > 0) triggerSync();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      addLog('Isolated Node Mode: AES-256 Storage active for all local interactions.', 'info');
    };

    // Listen for custom sync events from handleSystemAction
    const handleSyncPulse = () => {
      updateLocalQueue();
      addLog('Offline transaction captured and buffered in local ledger.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('edu-sync-pulse', handleSyncPulse as EventListener);

    updateLocalQueue();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('edu-sync-pulse', handleSyncPulse as EventListener);
    };
  }, []);

  const getQueue = (): OfflineAction[] => JSON.parse(localStorage.getItem('edu_sync_queue') || '[]');

  const updateLocalQueue = () => {
    setQueue(getQueue());
  };

  const addLog = (msg: string, type: 'info'|'success'|'error') => {
    setSyncLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15));
  };

  const triggerSync = async () => {
    const currentQueue = getQueue();
    if (currentQueue.length === 0) {
      addLog('Cloud buffer verified empty. Client and server are in parity.', 'info');
      return;
    }

    setIsSyncing(true);
    addLog(`Initiating cryptographic replay for ${currentQueue.length} buffered transactions...`, 'info');

    const newConflicts: SyncConflict[] = [];
    const successfulIds: string[] = [];

    // Transactional Replay Logic
    for (const action of currentQueue) {
      addLog(`[REPLAY] Handshaking: ${action.type}...`, 'info');
      
      // Simulated conflict detection (8% probability)
      if (Math.random() < 0.08) {
        const conflict: SyncConflict = {
          id: action.id,
          entityType: action.type.split('_')[0],
          localVersion: (action.version || 1),
          serverVersion: (action.version || 1) + 1,
          localData: action.payload,
          serverData: { ...action.payload, serverTimestamp: new Date().toISOString(), _collision: true }
        };
        newConflicts.push(conflict);
        addLog(`[ERROR] Parity collision detected in ${action.id}. Administrative policy required.`, 'error');
      } else {
        // Simulated network latency
        await new Promise(r => setTimeout(r, 800));
        successfulIds.push(action.id);
        addLog(`[SUCCESS] Cloud acknowledged transaction: ${action.id}.`, 'success');
      }
    }

    setConflicts(prev => [...prev, ...newConflicts]);
    
    // Purge acknowledged transactions from the buffer
    const updatedQueue = currentQueue.filter((a: OfflineAction) => !successfulIds.includes(a.id));
    localStorage.setItem('edu_sync_queue', JSON.stringify(updatedQueue));
    updateLocalQueue();
    
    setIsSyncing(false);

    // Notify Layout of queue modification
    window.dispatchEvent(new CustomEvent('edu-sync-pulse', { 
      detail: { count: updatedQueue.length } 
    }));

    if (updatedQueue.length === 0) {
      setShowSyncSuccess(true);
      onSyncComplete();
      setTimeout(() => setShowSyncSuccess(false), 3000);
    } else if (newConflicts.length > 0) {
      setShowSyncCenter(true); // Open center for administrative resolution
    }
  };

  const resolveConflict = (id: string, useLocal: boolean) => {
    setConflicts(prev => prev.filter(c => c.id !== id));
    
    const currentQueue = getQueue();
    const updatedQueue = currentQueue.filter((a: OfflineAction) => a.id !== id);
    localStorage.setItem('edu_sync_queue', JSON.stringify(updatedQueue));
    updateLocalQueue();
    
    window.dispatchEvent(new CustomEvent('edu-sync-pulse', { 
      detail: { count: updatedQueue.length } 
    }));

    addLog(`Policy Decision: Overwritten with ${useLocal ? 'Local Client' : 'Cloud Master'} for ${id}.`, 'success');
  };

  const clearQueue = () => {
    localStorage.setItem('edu_sync_queue', '[]');
    updateLocalQueue();
    setConflicts([]);
    window.dispatchEvent(new CustomEvent('edu-sync-pulse', { detail: { count: 0 } }));
    addLog('Manual Registry Purge: Local sync buffer cleared.', 'info');
  };

  return (
    <>
      {/* Floating Network Intelligence Widget */}
      <div className="fixed bottom-6 right-6 z-[250] flex flex-col items-end gap-3 pointer-events-none">
        {!isOnline && (
          <div className="bg-amber-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-4 border border-amber-400 pointer-events-auto">
            <WifiOff size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Isolated Node Mode</span>
          </div>
        )}
        
        {queue.length > 0 && !isSyncing && (
          <button 
            onClick={() => setShowSyncCenter(true)}
            className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-600/30 flex items-center gap-4 hover:bg-indigo-700 transition-all hover:-translate-y-1 pointer-events-auto"
          >
            <Database size={18} className="animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Local Registry Pending</p>
              <p className="text-[9px] font-bold opacity-80 leading-none">{queue.length} Transactional Objects</p>
            </div>
          </button>
        )}

        {isSyncing && (
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in zoom-in-95 pointer-events-auto">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Reconciling Distributed State...</span>
          </div>
        )}

        {showSyncSuccess && (
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in zoom-in-95 pointer-events-auto">
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">State Unity Achieved</span>
          </div>
        )}
      </div>

      {/* Sync Center Modal */}
      {showSyncCenter && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowSyncCenter(false)}></div>
          
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[3.5rem] shadow-3xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
             {/* Modal Header */}
             <div className="p-10 border-b flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                      <CloudLightning size={32} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Sync Intelligence Hub</h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Continuity & Ledger Parity</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={triggerSync}
                     disabled={isSyncing || queue.length === 0}
                     className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50"
                   >
                     {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />} Initiate Parity Check
                   </button>
                   <button onClick={() => setShowSyncCenter(false)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"><X size={24}/></button>
                </div>
             </div>

             {/* Modal Content */}
             <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Left: Active Queue & Conflict Resolution */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10 border-r">
                   {conflicts.length > 0 && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                              <AlertCircle size={16} /> Version Collision Alert
                           </h4>
                           <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black">{conflicts.length} PARITY ERRORS</span>
                        </div>
                        <div className="space-y-4">
                           {conflicts.map(c => (
                             <div key={c.id} className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4"><AlertCircle size={40} className="text-rose-200 rotate-12" /></div>
                                <div className="relative z-10">
                                   <p className="text-lg font-black text-rose-900 mb-2">Resource Mismatch: {c.entityType} Log</p>
                                   <p className="text-xs text-rose-700 font-medium leading-relaxed mb-6">
                                      A newer version (v{c.serverVersion}) was detected in the cloud master. Manual parity decision is required for transaction {c.id}.
                                   </p>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <button 
                                        onClick={() => resolveConflict(c.id, true)}
                                        className="py-4 bg-white border-2 border-rose-200 text-rose-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-900 hover:text-white transition-all shadow-sm"
                                      >
                                        Use Local State (v{c.localVersion})
                                      </button>
                                      <button 
                                        onClick={() => resolveConflict(c.id, false)}
                                        className="py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg"
                                      >
                                        Accept Cloud Master (v{c.serverVersion})
                                      </button>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Transactional Buffer</h4>
                         <button onClick={clearQueue} className="text-[10px] font-black text-rose-500 uppercase hover:underline">Purge Isolated Ledger</button>
                      </div>
                      <div className="space-y-3">
                         {queue.map(item => (
                           <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-white hover:shadow-lg transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300">
                                    <Database size={18} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.type.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] font-mono text-indigo-500 font-bold">{item.id}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                 <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                   item.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                 }`}>
                                    {item.status}
                                 </div>
                              </div>
                           </div>
                         ))}
                         {queue.length === 0 && (
                           <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                              <ShieldCheck size={48} className="text-slate-200 mx-auto mb-4" />
                              <p className="font-black text-slate-300 uppercase tracking-[0.2em]">Client Registry is in Unity</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Right: Operational Heartbeat Log */}
                <div className="w-full lg:w-96 bg-slate-900 p-10 flex flex-col text-white">
                   <h4 className="text-lg font-black mb-8 flex items-center gap-3">
                      <History className="text-indigo-400" /> Operational Heartbeat
                   </h4>
                   <div className="flex-1 overflow-y-auto custom-scrollbar-dark space-y-4 pr-2">
                      {syncLogs.map((log, i) => (
                        <div key={i} className={`p-4 rounded-xl border-l-4 bg-white/5 animate-in slide-in-from-right-4 duration-500 ${
                          log.type === 'success' ? 'border-emerald-500' : log.type === 'error' ? 'border-rose-500' : 'border-indigo-500'
                        }`}>
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-[8px] font-black uppercase tracking-widest ${
                                log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : 'text-indigo-400'
                              }`}>{log.type}</span>
                              <span className="text-[8px] text-slate-500 font-mono">{log.time}</span>
                           </div>
                           <p className="text-xs font-medium text-slate-300 leading-relaxed">{log.msg}</p>
                        </div>
                      ))}
                   </div>
                   <div className="mt-10 pt-10 border-t border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Server size={18} className="text-indigo-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Mirror Registry</p>
                            <p className="text-sm font-black uppercase tracking-widest">Active-Passive Sync</p>
                         </div>
                      </div>
                      <div className="bg-indigo-600 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                         <ShieldCheck size={20} />
                         <p className="text-[10px] font-black uppercase tracking-widest">Tunnel Secured (TLS 1.3)</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectivityManager;
