
import React, { useState, useMemo } from 'react';
import { User, UserRole, TransportRoute, Student } from '../types';
import { 
  Bus, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  History,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Zap,
  RotateCcw
} from 'lucide-react';
import { INITIAL_TRANSPORT_ROUTES, INITIAL_STUDENTS } from '../mockData';

interface TransportProps {
  currentUser: User;
  onAction: (id: string) => void;
}

const Transport: React.FC<TransportProps> = ({ currentUser, onAction }) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'routes' | 'my-route'>('fleet');
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_TRANSPORT_ROUTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isParent = currentUser.role === UserRole.PARENT;

  const filteredRoutes = useMemo(() => {
    return routes.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [routes, searchTerm]);

  // Simulation: Trigger Refresh
  const handleRefresh = () => {
    onAction('17.1');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Transport Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Fleet & Logistics</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Transport Monitoring</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'fleet' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Active Fleet
          </button>
          <button 
            onClick={() => setActiveTab('routes')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'routes' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Route Registry
          </button>
          {isParent && (
            <button 
              onClick={() => setActiveTab('my-route')}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'my-route' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Track My Bus
            </button>
          )}
        </div>
      </div>

      {activeTab === 'fleet' ? (
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Find bus or route..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] outline-none font-bold text-slate-800" 
                />
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={handleRefresh} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"><RotateCcw size={24}/></button>
                 {isAdmin && (
                   <button className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                     <Plus size={18}/> Add Vehicle
                   </button>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all group">
                   <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                           route.status === 'IN_ROUTE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
                           route.status === 'MAINTENANCE' ? 'bg-rose-100 text-rose-600' :
                           'bg-slate-100 text-slate-400'
                         }`}>
                           <Bus size={28} />
                         </div>
                         <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              route.status === 'IN_ROUTE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse' :
                              route.status === 'MAINTENANCE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                               {route.status.replace('_', ' ')}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">Update: {route.lastUpdate}</p>
                         </div>
                      </div>

                      <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight">{route.name}</h4>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">Plate: {route.vehiclePlate}</p>

                      <div className="space-y-4 mb-8">
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm"><UserIcon size={14}/></div>
                               <span className="text-sm font-bold text-slate-600">{route.driverName}</span>
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800 transition-colors"><Phone size={16}/></button>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm"><Zap size={14}/></div>
                               <span className="text-sm font-bold text-slate-600">Capacity Load</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">{route.activeStudents} / {route.capacity}</span>
                         </div>
                      </div>

                      <button 
                        onClick={() => setSelectedRoute(route)}
                        className="w-full py-4 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                      >
                        Detail Telemetry <ArrowRight size={14}/>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : activeTab === 'routes' ? (
        <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
           <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/40">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-3xl border-2 border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm"><Navigation size={32}/></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Global Stop Registry</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Route Mapping & Geographic Compliance</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <MapPin size={18}/> Global Optimize
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest border-b">
                       <th className="px-10 py-6">Route Identity</th>
                       <th className="px-10 py-6">Terminal Stops</th>
                       <th className="px-10 py-6 text-center">First Pickup</th>
                       <th className="px-10 py-6 text-right">Route Control</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {routes.map((route) => (
                      <tr key={route.id} className="hover:bg-slate-50/50 transition-all group">
                         <td className="px-10 py-8">
                            <div>
                               <p className="font-black text-slate-900 text-sm mb-1">{route.name}</p>
                               <p className="text-[10px] font-mono text-indigo-500 uppercase">{route.id}</p>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-600">{route.stops[0].name}</span>
                               <ArrowRight size={12} className="text-slate-300" />
                               <span className="text-sm font-bold text-slate-600">{route.stops[route.stops.length - 1].name}</span>
                            </div>
                         </td>
                         <td className="px-10 py-8 text-center font-black text-slate-900">
                            {route.stops[0].time}
                         </td>
                         <td className="px-10 py-8 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                               <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 shadow-sm"><Settings size={18}/></button>
                               <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-900 shadow-sm"><MoreVertical size={18}/></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : (
        /* Parent View: Track My Bus */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-indigo-950 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden">
                 <Navigation className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 -rotate-12" />
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                          <h3 className="text-3xl font-black mb-2">Track: North-East Express</h3>
                          <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs">Route A • GV-2024-01</p>
                       </div>
                       <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] font-black uppercase">Active GPS Link</span>
                       </div>
                    </div>

                    <div className="space-y-12">
                       {routes[0].stops.map((stop, idx) => (
                         <div key={idx} className="relative flex items-center gap-8 group">
                            {idx !== routes[0].stops.length - 1 && (
                              <div className={`absolute left-5 top-10 w-0.5 h-16 ${stop.arrived ? 'bg-emerald-500' : 'bg-white/10'}`} />
                            )}
                            <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 transition-all ${
                              stop.arrived ? 'bg-emerald-500 border-emerald-200 shadow-lg shadow-emerald-500/20' : 'bg-indigo-950 border-white/20'
                            }`}>
                               {stop.arrived ? <CheckCircle2 size={20}/> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-1">
                                  <h4 className={`text-lg font-black ${stop.arrived ? 'text-white' : 'text-white/40'}`}>{stop.name}</h4>
                                  <span className={`text-xs font-black ${stop.arrived ? 'text-indigo-400' : 'text-white/20'}`}>{stop.time}</span>
                               </div>
                               <p className={`text-[10px] font-bold uppercase tracking-widest ${stop.arrived ? 'text-emerald-400' : 'text-white/20'}`}>
                                  {stop.arrived ? 'Arrived & Departed' : 'Estimated Arrival'}
                               </p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                 <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                   <UserIcon className="text-indigo-600" /> Driver Details
                 </h4>
                 <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-white shadow-xl">
                       SM
                    </div>
                    <div>
                       <p className="text-lg font-black text-slate-900 leading-none mb-1">Samuel Mensah</p>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Certified School Driver</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    <Phone size={18}/> Contact Driver
                 </button>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
                 <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 -rotate-12 transition-transform duration-700" />
                 <div className="relative z-10">
                    <h3 className="text-xl font-black mb-6">Transit Policy</h3>
                    <div className="space-y-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Pickup Buffer</p>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">Students must arrive at stops 5 minutes before scheduled time.</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Guest Policy</p>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">Guest boarding requires a 24h advance pass from the logistics office.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Selected Route Telemetry Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedRoute(null)}></div>
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
              <div className="p-10">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vehicle Telemetry</h3>
                    <button onClick={() => setSelectedRoute(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><RotateCcw size={24}/></button>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Fuel Economy</p>
                       <p className="text-2xl font-black text-slate-900">8.4 km/L</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Route Adherence</p>
                       <p className="text-2xl font-black text-emerald-600">98%</p>
                    </div>
                 </div>

                 <div className="space-y-6 mb-10">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <UsersIcon size={16} className="text-indigo-600" /> Assigned Student Manifest
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                       {INITIAL_STUDENTS.filter(s => s.assignedRouteId === selectedRoute.id).map(student => (
                         <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center font-black text-xs">{student.name[0]}</div>
                               <span className="text-sm font-bold text-slate-800">{student.name}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-indigo-600">{student.grade}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Audit Engine Logs</button>
                    <button onClick={() => setSelectedRoute(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">Close Dashboard</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple wrapper for lucide-react names to prevent missing exports if any
const UsersIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default Transport;
