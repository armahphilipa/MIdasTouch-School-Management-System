
import React, { useState, useEffect } from 'react';
import { UserRole, User, Student, Invoice, OfflineAction, ChecklistItem, SchoolNotification } from './types';
import { INITIAL_USERS, INITIAL_STUDENTS, INITIAL_INVOICES, INITIAL_CHECKLIST } from './mockData';
import Layout from './components/Layout';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Enrollment from './views/Enrollment';
import Profiles from './views/Profiles';
import Attendance from './views/Attendance';
import Grading from './views/Grading';
import Communication from './views/Communication';
import Finance from './views/Finance';
import Reports from './views/Reports';
import Settings from './views/Settings';
import Timetable from './views/Timetable';
import Library from './views/Library';
import Archiving from './views/Archiving';
import HR from './views/HR';
import Health from './views/Health';
import Ecosystem from './views/Ecosystem';
import ConnectivityManager from './components/ConnectivityManager';
import AIAssistant from './components/AIAssistant';
import { Bell, ShieldAlert, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [notifications, setNotifications] = useState<SchoolNotification[]>([]);
  const [activeToast, setActiveToast] = useState<SchoolNotification | null>(null);

  // Load persistence on mount
  useEffect(() => {
    const savedChecklist = localStorage.getItem('edu_checklist_status');
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const updateChecklistItem = (id: string) => {
    setChecklist(prev => {
      const updated: ChecklistItem[] = prev.map(item => item.id === id ? { ...item, status: 'Completed' } : item);
      localStorage.setItem('edu_checklist_status', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSystemAction = (id: string, type?: string, payload?: any) => {
    updateChecklistItem(id);

    if (!navigator.onLine) {
      const queue: OfflineAction[] = JSON.parse(localStorage.getItem('edu_sync_queue') || '[]');
      
      const newAction: OfflineAction = {
        id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: type || 'SYSTEM_LOG',
        payload: payload || { actionId: id },
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        version: 1
      };
      
      const updatedQueue = [...queue, newAction];
      localStorage.setItem('edu_sync_queue', JSON.stringify(updatedQueue));
      
      window.dispatchEvent(new CustomEvent('edu-sync-pulse', { 
        detail: { count: updatedQueue.length } 
      }));
    }
  };

  const handleAttendanceAlerts = (newAlerts: SchoolNotification[]) => {
    setNotifications(prev => [...newAlerts, ...prev]);
    
    // Requirement 2.2: If the current user is the recipient (Parent), trigger automated alert visual
    const relevantAlert = newAlerts.find(a => a.recipientId === currentUser?.id);
    if (relevantAlert) {
      setActiveToast(relevantAlert);
      setTimeout(() => setActiveToast(null), 8000);
    }
    
    handleSystemAction('2.2', 'ABSENCE_ALERT_TRIGGERED', { count: newAlerts.length });
  };

  const handleGlobalSyncPulse = () => {
    console.log("Global Sync Pulse: System state unified.");
  };

  if (!isAuthenticated || !currentUser) {
    return <Auth onLogin={handleLogin} allUsers={INITIAL_USERS} students={students} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={currentUser} 
            students={students} 
            invoices={invoices} 
            notifications={notifications}
            onAction={(id) => {
              if (id === '7.1') {
                setActiveTab('sis');
              }
              handleSystemAction(id, 'DASHBOARD_INTERACTION');
            }} 
          />
        );
      case 'sis':
        return (
          <div className="space-y-8 md:space-y-12">
            <Enrollment 
              user={currentUser}
              onEnroll={() => handleSystemAction('1.1', 'NEW_ENROLLMENT')} 
              students={students} 
              setStudents={setStudents} 
            />
            <Profiles 
              onView={() => handleSystemAction('1.2', 'PROFILE_VIEW')} 
              students={students} 
              currentUserRole={currentUser.role}
            />
          </div>
        );
      case 'attendance':
        return <Attendance 
          students={students} 
          currentUser={currentUser}
          onAction={() => {
            handleSystemAction('2.1', 'ATTENDANCE_MARKED'); 
            handleSystemAction('2.3', 'LEAVE_PROCESSED'); 
          }} 
          onAlertsGenerated={handleAttendanceAlerts}
        />;
      case 'timetable':
        return <Timetable 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'TIMETABLE_CHANGE')}
        />;
      case 'library':
        return <Library 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'ASSET_MODIFICATION')}
        />;
      case 'archiving':
        return <Archiving 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'DOCUMENT_UPLOAD')}
        />;
      case 'hr':
        return <HR 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'PAYROLL_RUN')}
        />;
      case 'health':
        return <Health 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'CLINIC_VISIT')}
        />;
      case 'ecosystem':
        return <Ecosystem 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'ECOSYSTEM_UPDATE')}
        />;
      case 'grading':
        return <Grading 
          students={students} 
          onAction={(id) => {
            handleSystemAction(id, 'GRADE_COMMIT');
          }} 
        />;
      case 'communication':
        return <Communication 
          currentUser={currentUser}
          onAction={(id) => {
            if (id) handleSystemAction(id, 'COMMUNICATION_ACTION');
          }} 
        />;
      case 'finance':
        return <Finance 
          invoices={invoices} 
          currentUser={currentUser}
          students={students}
          onAction={(id) => {
            if (id) handleSystemAction(id, 'FINANCIAL_TRANSACTION');
          }} 
        />;
      case 'reports':
        return <Reports 
          onAction={(id) => handleSystemAction(id, 'REPORT_GENERATION')} 
          checklist={checklist}
        />;
      case 'settings':
        return <Settings 
          currentUser={currentUser}
          onAction={(id) => handleSystemAction(id, 'SETTINGS_UPDATE')} 
        />;
      default:
        return <Dashboard user={currentUser} students={students} invoices={invoices} notifications={notifications} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      onLogout={handleLogout}
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-10 transition-all duration-300">
        {renderContent()}
      </div>
      
      {/* Requirement 2.2: Automated Push Notification Simulation */}
      {activeToast && (
        <div className="fixed top-6 right-6 z-[600] w-full max-w-sm bg-slate-900 text-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 p-6 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                 <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black uppercase tracking-widest text-rose-400">Emergency Alert</h4>
                    <button onClick={() => setActiveToast(null)} className="text-slate-500 hover:text-white transition-colors"><X size={16}/></button>
                 </div>
                 <p className="text-xs font-bold leading-relaxed">{activeToast.message}</p>
                 <div className="mt-4 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sent via Push Protocol</span>
                    <button onClick={() => { setActiveTab('attendance'); setActiveToast(null); }} className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-300">Acknowledge</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <ConnectivityManager onSyncComplete={handleGlobalSyncPulse} />
      <AIAssistant students={students} invoices={invoices} currentUser={currentUser} />
    </Layout>
  );
};

export default App;
