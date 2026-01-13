
import React, { useState } from 'react';
import { User, UserRole, Student } from '../types';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  GraduationCap, 
  Users, 
  AlertCircle, 
  ChevronLeft,
  School,
  Heart,
  Sparkles,
  LayoutDashboard,
  Fingerprint,
  Hash,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  allUsers: User[];
  students: Student[];
}

type PortalType = 'STAFF' | 'FAMILY' | null;

const Auth: React.FC<AuthProps> = ({ onLogin, allUsers, students }) => {
  const [portal, setPortal] = useState<PortalType>(null);
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login fields
  const [identifier, setIdentifier] = useState(''); // Email for Staff, Student ID for Family
  const [password, setPassword] = useState('');
  
  // Sign up fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupIdentifier, setSignupIdentifier] = useState(''); // Student ID for Family signup claim
  const [signupRole, setSignupRole] = useState<UserRole>(UserRole.STUDENT);
  const [signupPassword, setSignupPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStaffAuth = () => {
    const foundUser = allUsers.find(u => u.email.toLowerCase() === identifier.toLowerCase());
    if (foundUser) {
      const isStaff = foundUser.role === UserRole.ADMIN || foundUser.role === UserRole.TEACHER;
      if (!isStaff) {
        setErrorMessage("Credential mismatch: This account belongs to the Family Hub.");
        setIsLoading(false);
        return;
      }
      
      // Mock password check
      if (password === foundUser.password || password === 'password123') {
        onLogin(foundUser);
      } else {
        setErrorMessage("Access Denied: Invalid credentials for this faculty node.");
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Authentication failed: Faculty account not recognized.");
      setIsLoading(false);
    }
  };

  const handleFamilyAuth = () => {
    // For simulation, find student by ID
    const studentRecord = students.find(s => s.id.toUpperCase() === identifier.toUpperCase());
    if (studentRecord) {
      // Find associated user (Student or Parent)
      // Since mock users have u3/u4, we search by those
      // In this simulation, we'll favor the Student user (u4) or Parent user (u3) based on identifier
      const user = allUsers.find(u => (u.role === UserRole.STUDENT && u.id === 'u4') || (u.role === UserRole.PARENT && u.id === 'u3')); 
      
      // Mock password check
      if (user && (password === user.password || password === 'password123')) {
        onLogin(user);
      } else {
        setErrorMessage("Access Denied: Invalid credentials for this Student ID.");
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Access denied: Invalid Student ID provided.");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      if (view === 'login') {
        if (portal === 'STAFF') handleStaffAuth();
        else handleFamilyAuth();
      } else if (view === 'signup') {
        // Sign up simulation
        if (portal === 'STAFF') {
          const newUser: User = {
            id: `u-${Date.now()}`,
            name: signupName,
            email: signupEmail,
            role: signupRole,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupEmail}`
          };
          onLogin(newUser);
        } else {
          // Family claim flow
          const studentRecord = students.find(s => s.id.toUpperCase() === signupIdentifier.toUpperCase());
          if (studentRecord) {
            const newUser: User = {
              id: `u-${Date.now()}`,
              name: studentRecord.name,
              email: signupEmail,
              role: signupRole, // Parent or Student
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupEmail}`
            };
            onLogin(newUser);
          } else {
            setErrorMessage("Validation error: Provided Student ID does not exist in our registry.");
            setIsLoading(false);
          }
        }
      }
    }, 1500);
  };

  const portalConfigs = {
    STAFF: {
      title: 'Faculty Hub',
      subtitle: 'Institutional Administration',
      color: 'indigo',
      icon: ShieldCheck,
      bg: 'bg-slate-950',
      accent: 'bg-indigo-600',
      label: 'Staff Email',
      placeholder: 'admin@school.com',
      idIcon: Mail
    },
    FAMILY: {
      title: 'Family Portal',
      subtitle: 'Parent & Student Access',
      color: 'rose',
      icon: Heart,
      bg: 'bg-indigo-950',
      accent: 'bg-rose-500',
      label: 'Student ID Number',
      placeholder: 'SMS-2024-XXXXXX',
      idIcon: Hash
    }
  };

  if (!portal) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
           <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] animate-pulse"></div>
           <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[150px] animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-4xl relative z-10 space-y-12 text-center">
           <div className="space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                 <School size={48} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                Midas Touch <span className="text-indigo-500">EduStream</span> Pro
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto">
                Select your institutional node to proceed with authentication.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              <button 
                onClick={() => { setPortal('STAFF'); setView('login'); setIdentifier(''); }}
                className="group relative bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 text-left transition-all hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
              >
                 <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-white mb-2">Admin & Staff</h3>
                 <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                   Administrative portal for teachers, directors, and personnel. Authenticate via Staff Email.
                 </p>
                 <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    Enter Portal <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                 </div>
              </button>

              <button 
                onClick={() => { setPortal('FAMILY'); setView('login'); setIdentifier(''); }}
                className="group relative bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 text-left transition-all hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
              >
                 <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform">
                    <Heart size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-white mb-2">Students & Parents</h3>
                 <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                   Family access node for grades, attendance, and registry. Authenticate via Student ID.
                 </p>
                 <div className="flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest">
                    Enter Portal <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                 </div>
              </button>
           </div>

           <div className="pt-8 flex items-center justify-center gap-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              <span className="flex items-center gap-2"><Fingerprint size={14}/> Node Encryption Ready</span>
              <span className="flex items-center gap-2"><LayoutDashboard size={14}/> Build 4.2.0-STABLE</span>
              <span className="flex items-center gap-2"><Sparkles size={14}/> Neural Assistant Active</span>
           </div>
        </div>
      </div>
    );
  }

  const config = portalConfigs[portal];

  return (
    <div className={`min-h-screen ${config.bg} flex items-center justify-center p-4 md:p-6 relative overflow-hidden transition-colors duration-1000`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
         <div className={`absolute -top-20 -left-20 w-96 h-96 ${config.accent} rounded-full blur-[120px] animate-pulse`}></div>
         <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-600 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-[540px] relative z-10 animate-in zoom-in-95 duration-500">
        <button 
          onClick={() => { setPortal(null); setErrorMessage(null); }}
          className="absolute -top-16 left-0 text-slate-400 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Portal Selection
        </button>

        <div className="bg-white/10 backdrop-blur-3xl p-1 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-3xl">
           <div className="bg-white p-6 md:p-12 rounded-[2.3rem] md:rounded-[3rem] shadow-inner">
              <div className="flex flex-col items-center text-center mb-8 md:mb-10">
                 <div className={`w-16 h-16 md:w-20 md:h-20 ${config.accent} rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-2xl mb-6`}>
                    <config.icon className="w-8 h-8 md:w-10 md:h-10" />
                 </div>
                 <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{config.title}</h1>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-2">{config.subtitle}</p>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 md:mb-10">
                 <button 
                  onClick={() => { setView('login'); setErrorMessage(null); }} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'login' ? `bg-white ${config.accent.replace('bg-', 'text-')} shadow-sm` : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    Sign In
                 </button>
                 <button 
                  onClick={() => { setView('signup'); setErrorMessage(null); }} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'signup' ? `bg-white ${config.accent.replace('bg-', 'text-')} shadow-sm` : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    Sign Up
                 </button>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-[11px] md:text-xs font-bold text-rose-700 leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                {view === 'login' && (
                  <>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{config.label}</label>
                       <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><config.idIcon size={18}/></div>
                          <input 
                            type="text" 
                            required 
                            value={identifier} 
                            onChange={(e) => setIdentifier(e.target.value)} 
                            placeholder={config.placeholder} 
                            className={`w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:${config.color === 'rose' ? 'border-rose-400' : 'border-indigo-500'} focus:bg-white font-bold text-slate-800 transition-all text-sm`} 
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                       <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={18}/></div>
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••" 
                            className={`w-full pl-14 pr-14 py-4 md:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:${config.color === 'rose' ? 'border-rose-400' : 'border-indigo-500'} focus:bg-white font-bold text-slate-800 transition-all text-sm`} 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                          >
                             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                       </div>
                       <div className="flex justify-end">
                         <button type="button" onClick={() => setView('forgot')} className={`text-[9px] font-black text-slate-400 uppercase hover:${config.color === 'rose' ? 'text-rose-500' : 'text-indigo-600'} transition-colors`}>
                           Recovery Protocol
                         </button>
                       </div>
                    </div>
                  </>
                )}

                {view === 'signup' && (
                  <>
                    {portal === 'STAFF' ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                          <div className="relative">
                             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><UserIcon size={18}/></div>
                             <input type="text" required value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Dr. Jane Doe" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
                          <div className="relative">
                             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Mail size={18}/></div>
                             <input type="email" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="jane@school.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                          <select 
                            value={signupRole} 
                            onChange={e => setSignupRole(e.target.value as UserRole)}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm appearance-none"
                          >
                            <option value={UserRole.TEACHER}>Teacher / Faculty</option>
                            <option value={UserRole.ADMIN}>Administrator</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Student ID</label>
                          <div className="relative">
                             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Hash size={18}/></div>
                             <input type="text" required value={signupIdentifier} onChange={e => setSignupIdentifier(e.target.value)} placeholder="SMS-2024-XXXXXX" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-400 font-bold text-sm uppercase" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                          <select 
                            value={signupRole} 
                            onChange={e => setSignupRole(e.target.value as UserRole)}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-400 font-bold text-sm appearance-none"
                          >
                            <option value={UserRole.STUDENT}>Student Account</option>
                            <option value={UserRole.PARENT}>Parent / Guardian Account</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                          <div className="relative">
                             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Mail size={18}/></div>
                             <input type="email" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="family@email.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-400 font-bold text-sm" />
                          </div>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                           <Info className="text-indigo-600 shrink-0 mt-0.5" size={14} />
                           <p className="text-[10px] font-bold text-indigo-800 leading-relaxed">Account Claim: Access is granted only after matching Student ID with institutional records.</p>
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
                       <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={18}/></div>
                          <input 
                            type="password" 
                            required 
                            value={signupPassword} 
                            onChange={(e) => setSignupPassword(e.target.value)} 
                            placeholder="••••••••" 
                            className={`w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:${config.color === 'rose' ? 'border-rose-400' : 'border-indigo-500'} font-bold text-sm`} 
                          />
                       </div>
                    </div>
                  </>
                )}

                {view === 'forgot' ? (
                  <div className="space-y-8 animate-in slide-in-from-bottom-2 text-center py-4">
                     <h4 className="text-xl font-black text-slate-900">Credential Recovery</h4>
                     <p className="text-xs text-slate-500 font-medium">Enter your {portal === 'STAFF' ? 'Staff Email' : 'Student ID'} to initiate recovery.</p>
                     <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><config.idIcon size={18}/></div>
                        <input type="text" placeholder={config.placeholder} className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:${config.color === 'rose' ? 'border-rose-400' : 'border-indigo-500'} font-bold text-sm`} />
                     </div>
                     <button type="button" onClick={() => setView('login')} className={`w-full py-5 ${config.accent} text-white rounded-2xl font-black text-xs uppercase shadow-xl`}>Send Secure Link</button>
                     <button type="button" onClick={() => setView('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Return to login</button>
                  </div>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className={`w-full py-5 md:py-6 ${portal === 'STAFF' ? 'bg-slate-900' : 'bg-indigo-600'} text-white rounded-[1.5rem] md:rounded-[1.75rem] font-black md:text-lg shadow-2xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70`}
                  >
                    {isLoading ? <Loader2 className="animate-spin size-5 md:size-6" /> : <Fingerprint size={20}/>}
                    {view === 'login' ? 'Authenticate' : 'Finalize Account'}
                  </button>
                )}
              </form>

              <div className="mt-10 md:mt-12 flex flex-col items-center gap-4 text-center">
                 <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter max-w-[300px]">
                    Internal institutional access secured by TLS 1.3 encryption. All sessions are monitored.
                 </p>
                 <div className="flex items-center gap-4">
                    <span className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={10}/> Node Verified</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
