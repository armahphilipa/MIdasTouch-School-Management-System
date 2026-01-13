
import React, { useState, useMemo } from 'react';
import { User, UserRole, ArchivalDocument, DocumentFolder } from '../types';
import { 
  Folder, 
  File, 
  Search, 
  Plus, 
  Upload, 
  MoreVertical, 
  ShieldCheck, 
  Download, 
  Filter, 
  HardDrive, 
  Clock, 
  ChevronRight, 
  Trash2, 
  Share2, 
  LayoutGrid, 
  List, 
  Cloud,
  FileText,
  Loader2,
  X,
  Database
} from 'lucide-react';
import { INITIAL_ARCHIVAL_DOCS, INITIAL_FOLDERS } from '../mockData';

interface ArchivingProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const Archiving: React.FC<ArchivingProps> = ({ currentUser, onAction }) => {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [docs, setDocs] = useState<ArchivalDocument[]>(INITIAL_ARCHIVAL_DOCS);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  
  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFolder = activeFolder ? d.folderId === activeFolder : true;
      
      // Accessibility Check: Students/Parents only see "Personal" documents or documents they own
      if (!isAdmin && currentUser.role !== UserRole.TEACHER) {
        return matchesSearch && matchesFolder && (d.category === 'Personal' || d.ownerId === currentUser.id);
      }
      return matchesSearch && matchesFolder;
    });
  }, [docs, searchTerm, activeFolder, currentUser, isAdmin]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: ArchivalDocument = {
        id: `doc-${Date.now()}`,
        name: 'New_Uploaded_Document.pdf',
        type: 'PDF',
        category: 'Academic',
        size: '1.2 MB',
        ownerId: currentUser.id,
        uploadDate: new Date().toISOString().split('T')[0],
        folderId: activeFolder || 'f1'
      };
      setDocs([newDoc, ...docs]);
      setIsUploading(false);
      setShowUploadModal(false);
      onAction('16.1');
    }, 2000);
  };

  const currentFolderName = INITIAL_FOLDERS.find(f => f.id === activeFolder)?.name || 'Central Repository';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Infrastructure Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Cloud className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Archive Hub</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Cloud Archiving & Digital Preservation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 px-8 py-4 bg-slate-50 rounded-[2rem] border border-slate-100">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Storage Quota</p>
              <p className="text-sm font-black text-slate-700 leading-none">12.4 GB / 50 GB</p>
           </div>
           <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[25%]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mb-10"
              >
                <Upload size={20}/> Cloud Upload
              </button>

              <div className="space-y-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">File Cabinets</h3>
                 <button 
                    onClick={() => setActiveFolder(null)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${!activeFolder ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-500'}`}
                 >
                    <div className="flex items-center gap-3">
                       <Database size={18} />
                       <span className="font-black text-xs uppercase tracking-widest">All Documents</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-50">{docs.length}</span>
                 </button>
                 {INITIAL_FOLDERS.map(folder => (
                   <button 
                      key={folder.id} 
                      onClick={() => setActiveFolder(folder.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeFolder === folder.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-500'}`}
                   >
                      <div className="flex items-center gap-3">
                         <Folder size={18} className={activeFolder === folder.id ? 'fill-indigo-700/20' : ''} />
                         <span className="font-black text-xs uppercase tracking-widest">{folder.name}</span>
                      </div>
                      <ChevronRight size={14} className={activeFolder === folder.id ? 'rotate-90' : 'opacity-30'} />
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-3xl">
              <h4 className="text-sm font-black mb-6 flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-indigo-400" /> Security Protocol</h4>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">AES-256 Encryption</p>
                    <p className="text-[11px] text-slate-400 font-medium">All documents are encrypted at rest and in transit.</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Audit Trail</p>
                    <p className="text-[11px] text-slate-400 font-medium">Download actions are logged and timestamped.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Explorer */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative flex-1 w-full">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder={`Search in ${currentFolderName}...`} 
                   className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" 
                 />
              </div>
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                 <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}><List size={20}/></button>
              </div>
           </div>

           {viewMode === 'grid' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 group hover:-translate-y-1 transition-all relative overflow-hidden">
                     {doc.isSigned && (
                       <div className="absolute -top-2 -right-12 w-32 h-10 bg-emerald-500 text-white font-black text-[8px] uppercase tracking-widest flex items-center justify-center rotate-45 shadow-lg">
                          Digitally Signed
                       </div>
                     )}
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                           doc.type === 'PDF' ? 'bg-rose-50 text-rose-500 shadow-rose-100' :
                           doc.type === 'XLSX' ? 'bg-emerald-50 text-emerald-500 shadow-emerald-100' :
                           'bg-indigo-50 text-indigo-500 shadow-indigo-100'
                        }`}>
                           <FileText size={28} />
                        </div>
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={20}/></button>
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 leading-tight mb-1 truncate">{doc.name}</h4>
                        <div className="flex items-center gap-2 mb-4">
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{doc.category}</span>
                           <span className="text-[10px] text-slate-300">•</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.size}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Clock size={12} className="text-slate-300" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{doc.uploadDate}</span>
                           </div>
                           <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                              <Download size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <div className="col-span-full py-40 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                     <Folder size={64} className="text-slate-200 mx-auto mb-6" />
                     <p className="font-black text-slate-400 uppercase tracking-[0.2em]">No documents found in this view</p>
                  </div>
                )}
             </div>
           ) : (
             <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                         <th className="px-10 py-6">Document Identity</th>
                         <th className="px-10 py-6">Category / Info</th>
                         <th className="px-10 py-6">Compliance</th>
                         <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {filteredDocs.map(doc => (
                        <tr key={doc.id} className="group hover:bg-slate-50 transition-colors">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    doc.type === 'PDF' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
                                 }`}>
                                    <File size={20} />
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-900 text-sm">{doc.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.uploadDate}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{doc.category} Registry</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase">{doc.size} • {doc.type} Object</span>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              {doc.isSigned ? (
                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                   <ShieldCheck size={14} /> Digital Signature verified
                                </div>
                              ) : (
                                <span className="text-slate-300 text-[10px] font-black uppercase italic">Signature Not Required</span>
                              )}
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                 <button className="p-3 bg-white border rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm"><Download size={18}/></button>
                                 <button className="p-3 bg-white border rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm"><Share2 size={18}/></button>
                                 <button className="p-3 bg-white border rounded-xl text-slate-400 hover:text-rose-500 shadow-sm"><Trash2 size={18}/></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isUploading && setShowUploadModal(false)}></div>
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-3xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
              <div className="p-10">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Cloud Ingestion</h3>
                    <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={24}/></button>
                 </div>

                 <form onSubmit={handleUpload} className="space-y-8">
                    <div className="p-12 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-indigo-400 transition-all cursor-pointer">
                       <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 group-hover:text-indigo-500 transition-colors">
                          <Upload size={40} />
                       </div>
                       <p className="text-lg font-black text-slate-800 mb-2">Drop institutional assets here</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supports PDF, DOCX, XLSX (Max 100MB per file)</p>
                    </div>

                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Destination Cabinet</label>
                          <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-sm outline-none appearance-none focus:border-indigo-500 transition-all">
                             {INITIAL_FOLDERS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                       </div>
                       <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <ShieldCheck className="text-indigo-600" />
                          <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-relaxed">
                             Documents are automatically scanned for malware and PII (Personally Identifiable Information) before archival.
                          </p>
                       </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-6 bg-slate-900 text-white rounded-[1.75rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4"
                    >
                      {isUploading ? (
                        <><Loader2 className="animate-spin" /> Tunneling Data...</>
                      ) : (
                        <><Cloud size={24}/> Initialize Upload</>
                      )}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Archiving;
