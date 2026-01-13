import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  MessageSquare, 
  Wallet, 
  Menu, 
  X,
  Power,
  CalendarDays,
  LibraryBig,
  HardDrive,
  Briefcase,
  HeartPulse,
  Wifi,
  WifiOff,
  Trophy,
  Database,
  Settings as SettingsIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.RootNode;
  currentUser: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentUser, 
  onLogout,
  activeTab, 
  setActiveTab
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    
    // Initial check for pending queue on mount
    const updateQueueCount = () => {
      const queue = JSON.parse(localStorage.getItem('edu_sync_queue') || '[]');
      setPendingSyncCount(queue.length);
    };

    updateQueueCount();

    // Listen for custom sync events dispatched by handleSystemAction in App.tsx
    const handleSyncPulse = (e: any) => setPendingSyncCount(e.detail?.count || 0);

    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    window.addEventListener('edu-sync-pulse', handleSyncPulse as EventListener);
    
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      window.removeEventListener('edu-sync-pulse', handleSyncPulse as EventListener);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Intelligence', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { id: 'sis', label: 'Registry', icon: Users, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
    { id: 'library', label: 'Inventory', icon: LibraryBig, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
    { id: 'archiving', label: 'Archiving', icon: HardDrive, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { id: 'hr', label: 'Staffing', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'health', label: 'Health', icon: HeartPulse, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { id: 'ecosystem', label: 'Ecosystem', icon: Trophy, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { id: 'grading', label: 'Academic', icon: GraduationCap, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { id: 'communication', label: 'Messages', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT] },
    { id: 'finance', label: 'Finance', icon: Wallet, roles: [UserRole.ADMIN] },
    { id: 'reports', label: 'Analytics', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'settings', label: 'Control Center', icon: SettingsIcon, roles: [UserRole.ADMIN] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="font-bold text-lg text-slate-800">Midas Touch EduStream</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 z-[70] transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">E</div>
              <div className="flex flex-col">
                <span className="font-black text-white tracking-tight leading-none mb-1 text-xs">Midas Touch EduStream</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Pro Edition</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-10">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40' 
                    : 'hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile & Sync Status */}
          <div className="p-4 bg-slate-800/30 border-t border-slate-800 m-4 rounded-[2rem]">
            <div className="flex items-center justify-between mb-6 px-2">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'}`} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{isOnline ? 'Network Live' : 'Offline Mode'}</span>
               </div>
               {pendingSyncCount > 0 ? (
                 <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-lg animate-pulse">
                    <Database size={10} />
                    <span className="text-[8px] font-black">{pendingSyncCount}</span>
                 </div>
               ) : (
                 isOnline ? <Wifi size={12} className="text-slate-600" /> : <WifiOff size={12} className="text-amber-500" />
               )}
            </div>

            <div className="flex items-center gap-4 mb-4 p-2">
              <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-xl border-2 border-slate-700 shadow-lg" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-white truncate">{currentUser.name}</span>
                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{currentUser.role}</span>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="w-full py-3 bg-rose-500/10 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-white transition-all flex items-center justify-center gap-3 border border-rose-500/20"
            >
              <Power size={14} /> End Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-slate-50 overflow-y-auto custom-scrollbar relative">
        {children}
      </main>
    </div>
  );
};

const BarChart3 = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);

export default Layout;