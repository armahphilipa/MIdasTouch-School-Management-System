
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Rss, 
  CalendarDays, 
  Plus, 
  MoreVertical, 
  Image as ImageIcon,
  Paperclip,
  Smile,
  Search,
  Check,
  Send,
  Clock,
  ShieldCheck,
  AlertCircle,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  ChevronLeft,
  ChevronRight,
  ToggleLeft as Toggle,
  ToggleRight,
  Circle,
  Megaphone,
  Heart,
  MessageSquare as CommentIcon,
  Share2,
  Filter,
  X,
  User as UserIcon,
  MapPin,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Ticket,
  CheckCircle2,
  Trash2,
  Printer,
  FileText,
  Loader2,
  Download
} from 'lucide-react';
import { UserRole, User, CalendarEvent, RSVPStatus } from '../types';
import { INITIAL_EVENTS } from '../mockData';

interface CommunicationProps {
  onAction: (id?: string) => void;
  currentUser: User;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  officeHours?: string;
  lastMessage?: string;
  unreadCount: number;
}

interface FeedPost {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  image?: string;
  category: 'Urgent' | 'Academic' | 'Event' | 'General';
  timestamp: string;
  likes: number;
  comments: number;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 'u1', name: 'Dr. Sarah Wilson', role: 'Principal', avatar: 'Sarah', isOnline: true, unreadCount: 0, lastMessage: 'Staff meeting at 4 PM.' },
  { id: 'u2', name: 'Prof. James Black', role: 'Math Teacher', avatar: 'James', isOnline: true, officeHours: '09:00 - 16:00', unreadCount: 1, lastMessage: 'The science reports are ready.' },
  { id: 'u3', name: 'Robert Johnson', role: 'Parent', avatar: 'Robert', isOnline: false, unreadCount: 0, lastMessage: 'Thank you for the update.' },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'u2': [
    { id: 'm1', senderId: 'u2', text: "Hello Timmy's parents, I've noticed a great improvement in his math scores this week. Keep up the encouragement!", timestamp: '09:42 AM', status: 'read' },
    { id: 'm2', senderId: 'current', text: "Thank you so much, Professor! We are working with him every evening. Is there any extra material he should look at?", timestamp: '10:15 AM', status: 'read' },
  ]
};

const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'p1',
    authorName: 'Dr. Sarah Wilson',
    authorRole: 'Principal',
    category: 'Urgent',
    content: "Please be advised that the main entrance will be closed tomorrow for essential maintenance. All students should enter through the North Wing gate. Thank you for your cooperation.",
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5
  },
  {
    id: 'p2',
    authorName: 'Prof. James Black',
    authorRole: 'Head of Mathematics',
    category: 'Academic',
    content: "The results for the Spring Mid-term Algebra assessment have been published. Congratulations to all students for their hard work. Individual feedback will be shared during class sessions.",
    image: 'https://images.unsplash.com/photo-1509228468518-180dd482195b?auto=format&fit=crop&q=80&w=800',
    timestamp: '5 hours ago',
    likes: 42,
    comments: 12
  },
];

const Communication: React.FC<CommunicationProps> = ({ onAction, currentUser }) => {
  const [activeTab, setActiveTab] = useState('messaging'); 
  const [selectedContact, setSelectedContact] = useState<Contact | null>(INITIAL_CONTACTS[1]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isOfficeHoursOn, setIsOfficeHoursOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [postCategory, setPostCategory] = useState<FeedPost['category']>('General');
  const [postContent, setPostContent] = useState('');
  const [feedFilter, setFeedFilter] = useState<'All' | FeedPost['category']>('All');

  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1));
  const [userRSVPs, setUserRSVPs] = useState<Record<string, RSVPStatus>>({ 'ev2': RSVPStatus.GOING });
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEventData, setNewEventData] = useState<Partial<CalendarEvent>>({
    type: 'General',
    date: '2024-05-29',
    startTime: '10:00',
    endTime: '11:00',
    rsvpRequired: true
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'messaging') scrollToBottom();
  }, [messages, selectedContact, activeTab]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setSelectedFile({ name: file.name, type: file.type, url: url });
        setIsUploading(false);
        onAction('10.1');
      }, 1000);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;
    if (!selectedContact) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      attachment: selectedFile || undefined
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    
    setInputText('');
    setSelectedFile(null);
    onAction('4.1'); 
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      category: postCategory,
      content: postContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0
    };

    setFeedPosts([newPost, ...feedPosts]);
    setPostContent('');
    onAction('4.2');
  };

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleRSVP = (eventId: string, status: RSVPStatus) => {
    setUserRSVPs(prev => ({ ...prev, [eventId]: status }));
    onAction('4.3');
  };

  const handlePTMBooking = (eventId: string, slotTime: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId && ev.slots) {
        return {
          ...ev,
          slots: ev.slots.map(s => s.time === slotTime ? { ...s, bookedBy: currentUser.id } : s)
        };
      }
      return ev;
    }));
    onAction('4.3');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventToAdd: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventData.title || 'New Event',
      description: newEventData.description || '',
      date: newEventData.date || '2024-05-30',
      startTime: newEventData.startTime || '09:00',
      endTime: newEventData.endTime || '10:00',
      type: newEventData.type || 'General',
      location: newEventData.location || 'Campus',
      organizerId: currentUser.id,
      rsvpRequired: newEventData.rsvpRequired || false,
      slots: newEventData.type === 'PTM' ? [{ time: '09:00' }, { time: '09:30' }, { time: '10:00' }] : undefined
    };
    setEvents([...events, eventToAdd]);
    setIsCreatingEvent(false);
    onAction('4.3');
  };

  const currentThread = selectedContact ? (messages[selectedContact.id] || []) : [];
  const filteredPosts = feedPosts.filter(p => feedFilter === 'All' || p.category === feedFilter);
  const canPost = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.TEACHER;

  const calendarDays = useMemo(() => {
    const days = [];
    const count = daysInMonth(currentMonth);
    const offset = firstDayOfMonth(currentMonth);
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= count; i++) days.push(i);
    return days;
  }, [currentMonth]);

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `2024-05-${day.toString().padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10 md:pb-20">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      {/* Responsive Navigation Header */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full xl:w-auto">
          {[
            { id: 'messaging', label: 'Chat', icon: MessageCircle },
            { id: 'feed', label: 'Feed', icon: Rss },
            { id: 'calendar', label: 'Events', icon: CalendarDays },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.charAt(0)}</span>
            </button>
          ))}
        </div>

        {activeTab === 'messaging' && (
          <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3 bg-slate-50 rounded-2xl border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-left sm:text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Office Hours</p>
              <p className={`text-[10px] font-black uppercase ${isOfficeHoursOn ? 'text-emerald-600' : 'text-rose-500'}`}>
                {isOfficeHoursOn ? 'Active' : 'DND'}
              </p>
            </div>
            <button 
              onClick={() => setIsOfficeHoursOn(!isOfficeHoursOn)}
              className={`transition-colors ${isOfficeHoursOn ? 'text-emerald-500' : 'text-slate-300'}`}
            >
              {isOfficeHoursOn ? <ToggleRight size={32} /> : <Toggle size={32} />}
            </button>
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
             <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
             <div className="flex bg-slate-100 p-1 rounded-xl w-full">
                {['All', 'Urgent', 'Academic', 'Event'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFeedFilter(f as any)}
                    className={`flex-1 px-2 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition-all ${feedFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>

      {activeTab === 'messaging' ? (
        <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[750px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden transition-all duration-500">
          {/* Responsive Chat Sidebar */}
          <div className={`w-full lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30 transition-all duration-300 ${selectedContact ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-6 md:p-8 border-b border-slate-100 bg-white">
              <h3 className="text-xl font-black text-slate-900 mb-6">Messages</h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Find conversation..." 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" 
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {INITIAL_CONTACTS.map((contact) => (
                <button 
                  key={contact.id} 
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 transition-all ${selectedContact?.id === contact.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'hover:bg-white hover:shadow-md'}`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 ${selectedContact?.id === contact.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                      {contact.name[0]}
                    </div>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-4 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-black text-sm truncate ${selectedContact?.id === contact.id ? 'text-white' : 'text-slate-900'}`}>{contact.name}</span>
                      <span className={`text-[9px] font-black uppercase ${selectedContact?.id === contact.id ? 'text-indigo-200' : 'text-slate-400'}`}>2m</span>
                    </div>
                    <p className={`text-xs truncate font-medium ${selectedContact?.id === contact.id ? 'text-indigo-100' : 'text-slate-500'}`}>{contact.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex-1 flex flex-col bg-white transition-all duration-300 ${!selectedContact ? 'hidden lg:flex' : 'flex'}`}>
            {selectedContact ? (
              <>
                <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 md:gap-5 min-w-0">
                    <button onClick={() => setSelectedContact(null)} className="lg:hidden p-2 bg-slate-50 rounded-xl mr-1 text-slate-500"><ChevronLeft size={20}/></button>
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-lg shadow-sm border border-indigo-100 shrink-0">
                      {selectedContact.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-900 text-base md:text-lg truncate">{selectedContact.name}</h4>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{selectedContact.role}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${selectedContact.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                          • {selectedContact.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100"><Phone size={18}/></button>
                    <button className="hidden sm:block p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100"><Video size={18}/></button>
                    <button className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100"><Info size={18}/></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-6 bg-slate-50/30">
                  {currentThread.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.senderId === 'current' ? 'flex-row-reverse' : ''}`}>
                      <div className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center font-black text-xs shrink-0 ${msg.senderId === 'current' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-400'}`}>
                        {msg.senderId === 'current' ? 'ME' : selectedContact.name[0]}
                      </div>
                      <div className={`max-w-[85%] sm:max-w-md p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm relative group ${msg.senderId === 'current' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                        {msg.attachment && (
                          <div className={`mb-3 p-3 rounded-xl border flex items-center gap-3 ${msg.senderId === 'current' ? 'bg-white/10 border-white/20' : 'bg-slate-50'}`}>
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-black uppercase truncate">{msg.attachment.name}</p>
                              <button className="text-[8px] font-black uppercase flex items-center gap-1 opacity-70 hover:opacity-100"><Download size={10} /> Download</button>
                            </div>
                          </div>
                        )}
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-2 mt-2 ${msg.senderId === 'current' ? 'justify-end' : ''}`}>
                           <span className={`text-[8px] md:text-[9px] font-black uppercase opacity-60`}>{msg.timestamp}</span>
                           {msg.senderId === 'current' && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 md:p-8 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3 md:gap-4">
                    <button type="button" onClick={handleFileClick} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 shrink-0"><Paperclip size={22} /></button>
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..." 
                        className="w-full px-6 py-4 md:py-5 bg-slate-50 border-2 border-transparent rounded-[1.75rem] md:rounded-[2rem] outline-none focus:border-indigo-500 focus:bg-white text-sm font-bold"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-indigo-600 text-white shadow-lg shrink-0"
                    >
                      <Send size={20} className="md:size-24" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-40">
                <MessageCircle size={80} className="text-slate-200 mb-6" />
                <h4 className="text-2xl font-black text-slate-800">Select a Conversation</h4>
                <p className="max-w-xs text-sm font-medium text-slate-500 mt-2">Choose a contact to start messaging within the faculty network.</p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'feed' ? (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           {canPost && (
             <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100">
               <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div className="hidden sm:flex w-14 h-14 bg-indigo-600 rounded-2xl shrink-0 items-center justify-center font-black text-white text-xl">
                    {currentUser.name[0]}
                  </div>
                  <div className="flex-1">
                     <textarea 
                        rows={3}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder={`Announce something in ${postCategory.toLowerCase()}...`}
                        className="w-full p-4 md:p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm font-medium mb-4 resize-none"
                     ></textarea>
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button className="flex-1 sm:flex-none p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"><ImageIcon size={18} /></button>
                           <button className="flex-1 sm:flex-none p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"><Paperclip size={18} /></button>
                        </div>
                        <button 
                          onClick={handlePostSubmit}
                          disabled={!postContent.trim()}
                          className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50"
                        >
                          Publish
                        </button>
                     </div>
                  </div>
               </div>
             </div>
           )}

           <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden">
                   <div className="p-6 md:p-10">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100 shrink-0">
                               {post.authorName[0]}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-black text-slate-900 text-sm md:text-base leading-none mb-1 truncate">{post.authorName}</h4>
                               <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{post.authorRole} • {post.timestamp}</p>
                            </div>
                         </div>
                         <span className={`px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                           post.category === 'Urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500'
                         }`}>
                           {post.category}
                         </span>
                      </div>
                      <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed mb-6">{post.content}</p>
                      {post.image && <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6"><img src={post.image} className="w-full h-auto max-h-[400px] object-cover" /></div>}
                      <div className="flex items-center gap-6 text-slate-400 border-t border-slate-50 pt-6">
                         <button className="flex items-center gap-2 hover:text-rose-500 transition-colors"><Heart size={18} /><span className="text-[10px] font-black">{post.likes}</span></button>
                         <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><CommentIcon size={18} /><span className="text-[10px] font-black">{post.comments}</span></button>
                         <button className="ml-auto hover:text-indigo-600 transition-colors"><Share2 size={18} /></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        /* Calendar View Responsiveness (Summary) */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-1 space-y-6">
              {isCreatingEvent ? (
                <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100">
                  <h3 className="text-lg font-black mb-6">Schedule Event</h3>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <input required className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none" placeholder="Title..." />
                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Broadcast</button>
                    <button type="button" onClick={() => setIsCreatingEvent(false)} className="w-full py-2 text-slate-400 text-[10px] font-black uppercase">Cancel</button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-900 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white shadow-xl">
                   <h3 className="text-xl font-black mb-6">Upcoming</h3>
                   <div className="space-y-4">
                      {events.slice(0, 3).map(ev => (
                        <div key={ev.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                           <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">{ev.date}</p>
                           <h4 className="text-sm font-bold truncate">{ev.title}</h4>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => setIsCreatingEvent(true)} className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase shadow-xl">New Schedule</button>
                </div>
              )}
           </div>

           <div className="lg:col-span-3 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-6 md:p-10 border-b flex items-center justify-between bg-slate-50/40">
                 <h3 className="text-2xl font-black text-slate-900">May 2024</h3>
                 <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-3 md:p-4 bg-white border rounded-xl hover:bg-slate-50 shadow-sm"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-3 md:p-4 bg-white border rounded-xl hover:bg-slate-50 shadow-sm"><ChevronRight size={20}/></button>
                 </div>
              </div>

              <div className="flex-1 grid grid-cols-7">
                 {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="py-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-r border-slate-50">{d}</div>)}
                 {calendarDays.map((day, idx) => {
                   const hasEv = getEventsForDay(day).length > 0;
                   return (
                     <div key={idx} className={`aspect-square sm:aspect-auto sm:min-h-[100px] p-2 md:p-3 border-b border-r border-slate-50 relative ${day ? 'hover:bg-indigo-50/30' : 'bg-slate-50/10'}`}>
                        {day && (
                          <>
                            <span className={`text-[10px] md:text-xs font-black ${day === 24 ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-lg' : 'text-slate-400'}`}>{day}</span>
                            {hasEv && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full sm:hidden"></div>}
                            <div className="hidden sm:block mt-2 space-y-1">
                               {getEventsForDay(day).map(e => <div key={e.id} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[8px] font-black truncate border border-indigo-100">{e.title}</div>)}
                            </div>
                          </>
                        )}
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
