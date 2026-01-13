
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, Send, Bot, User, Loader2, Minimize2, Maximize2, MessageSquare, BrainCircuit } from 'lucide-react';
import { Student, Invoice } from '../types';

interface AIAssistantProps {
  students: Student[];
  invoices: Invoice[];
  currentUser: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ students, invoices, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Greetings, ${currentUser.name}. I am EduGenius. I have analyzed the current institutional datasets. How may I assist your administration today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const context = `
        You are EduGenius, an elite AI administrative assistant for Midas Touch EduStream Pro.
        Current School Context:
        - Students: ${students.length} enrolled. Sample: ${students.slice(0, 3).map(s => s.name).join(', ')}.
        - Financials: Total invoices registry contains ${invoices.length} records.
        - User: ${currentUser.name} (Role: ${currentUser.role}).
        Respond professionally, concisely, and use data points when possible.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: context + "\nUser Question: " + userMsg,
        config: {
          systemInstruction: "You are a world-class school management AI. Provide insightful, data-driven, and supportive responses.",
          temperature: 0.7,
        },
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I apologize, but I encountered a parity error in my neural processing. Please retry." }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error: Neural link interrupted. Check network connectivity." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-[300] w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-indigo-700 transition-all duration-300 animate-float border-4 border-white"
      >
        <BrainCircuit size={32} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 left-8 z-[300] w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden flex flex-col transition-all duration-500 ${isMinimized ? 'h-20' : 'h-[600px]'}`}>
      {/* Header */}
      <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bot size={24} />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight">EduGenius AI</h4>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Neural Insights Active</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-rose-500 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[85%] ${msg.role === 'ai' ? 'bg-white border border-slate-100 text-slate-700' : 'bg-indigo-600 text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query institutional intelligence..."
                className="flex-1 pl-6 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-[9px] text-slate-400 font-bold text-center mt-4 uppercase tracking-widest">
              Secured by Google Gemini • Pro v4.2
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
