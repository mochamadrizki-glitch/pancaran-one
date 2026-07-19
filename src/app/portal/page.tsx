'use client';

import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowUpRight, LogOut, Loader2, Atom, 
  Activity, BarChart4, Route,
  Globe2, Menu, Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Message = { role: 'user' | 'assistant'; content: string; ts: Date };

// ============================================
// 🎬 PATH VIDEO BACKGROUND
// ============================================
const BACKGROUND_VIDEO_SRC = "/videos/company-video.mp4";

// ============================================
// 🔗 GANTI DENGAN WEBHOOK URL n8n KAMU
// ============================================
const N8N_WEBHOOK_URL = "https://n8n-rfiv126lxlii.jkt4.sumopod.my.id/webhook/atom-chat";
// ============================================

function fmt(t: string) {
  if (!t) return '';
  
  const codeBlocks: string[] = [];
  let tempText = t.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    codeBlocks.push(
      `<div class="my-4 rounded-[14px] overflow-hidden border border-white/20 bg-black/90 shadow-lg shadow-cyan-900/30 backdrop-blur-md">` +
        `<div class="px-4 py-2 bg-white/10 text-cyan-300/80 text-[11px] font-mono uppercase tracking-wider border-b border-white/10 flex items-center justify-between">` +
          `<span>${lang || 'CODE'}</span>` +
        `</div>` +
        `<pre class="p-4 overflow-x-auto custom-scrollbar"><code class="text-cyan-200 font-mono text-[13px] leading-relaxed">${escapedCode}</code></pre>` +
      `</div>`
    );
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  tempText = tempText
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-white/80">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-cyan-500/30">$1</code>')
    .replace(/\n/g, '<br/>');

  codeBlocks.forEach((block, index) => {
    tempText = tempText.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return tempText;
}

export default function AtomPremiumInterface() {
  const router = useRouter();
  
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [entranceReady, setEntranceReady] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId] = useState(() => `atom_sess_${Date.now()}`);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      
      const { data: profile } = await supabase
        .from('portal_users').select('id, full_name, role').eq('id', session.user.id).single();
      
      if (!profile) { router.push('/login'); return; }
      
      setUserName(profile.full_name || session.user.email || 'User');
      setRole(profile.role);
      setAuthLoading(false);
      
      setTimeout(() => setEntranceReady(true), 100);
      setTimeout(() => inputRef.current?.focus(), 2500);
    }
    init();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  useEffect(() => {
    if (videoRef.current && !authLoading) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay blocked:', err);
      });
    }
  }, [authLoading]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function submitQuery(text: string) {
    if (!text.trim() || isProcessing) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text.trim(), ts: new Date() }]);
    setInput('');
    setIsProcessing(true);
    if (inputRef.current) inputRef.current.style.height = 'auto';

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text.trim(), 
          session_id: sessionId, 
          user_name: userName,
          timestamp: new Date().toISOString(),
        }),
      });
      
      const data = await res.json();
      
      const responseText = 
        data.response ||
        data.output ||
        data.text ||
        data.message ||
        data.answer ||
        (Array.isArray(data) && data[0]?.output) ||
        (Array.isArray(data) && data[0]?.response) ||
        'ATOM menerima pesan Anda tapi belum ada respons yang bisa ditampilkan.';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseText, 
        ts: new Date() 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Koneksi ke n8n terputus. Periksa jaringan Anda atau URL webhook.', 
        ts: new Date() 
      }]);
    } finally { 
      setIsProcessing(false); 
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuery(input);
    }
  };

  const QUICK_ACTIONS = [
    { icon: <BarChart4 className="w-5 h-5" strokeWidth={2.5} />, title: "Market Forecast", text: "Analyze Q3 B2B logistics capacity demand." },
    { icon: <Globe2 className="w-5 h-5" strokeWidth={2.5} />, title: "Competitor Intel", text: "Scan operational sentiment in the heavy mining sector." },
    { icon: <Activity className="w-5 h-5" strokeWidth={2.5} />, title: "CAPEX Planner", text: "Optimize investments for the new dump truck fleet." },
    { icon: <Route className="w-5 h-5" strokeWidth={2.5} />, title: "Expansion Matrix", text: "Evaluate profitability for new route openings." },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen text-white relative overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* VIDEO BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-all ease-out ${
            entranceReady 
              ? 'scale-100 opacity-100 blur-0' 
              : 'scale-[2.5] opacity-0 blur-2xl'
          }`}
          style={{ 
            transitionDuration: '2000ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <source src={BACKGROUND_VIDEO_SRC} type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />
        
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }} />
      </div>

      {/* WORMHOLE / PORTAL EFFECT */}
      <div 
        className={`fixed inset-0 z-[60] pointer-events-none transition-all duration-[1800ms] ease-out ${
          entranceReady ? 'opacity-0 scale-[3]' : 'opacity-100 scale-100'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/60 blur-[100px] rounded-full scale-150 animate-pulse" />
            <div className="absolute inset-0 bg-blue-500/40 blur-[80px] rounded-full scale-125" />
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-700 relative flex items-center justify-center shadow-2xl">
              <Atom className="w-16 h-16 text-white animate-spin-slow" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div 
        className={`flex flex-col h-screen relative transition-all ease-out ${
          entranceReady 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
        style={{ 
          transitionDuration: '1500ms',
          transitionDelay: '800ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors md:hidden">
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/50 blur-md rounded-[10px]" />
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 border border-white/20 relative">
                <Atom className="w-5 h-5 text-white animate-spin-slow" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50 animate-pulse" />
              <span className="text-[12px] font-bold text-white tracking-wide">n8n Connected</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md border border-white/15 hover:border-white/25"
            >
              <span className="text-[13px] font-bold text-white hidden sm:block tracking-wide">{userName.split(' ')[0]}</span>
              <LogOut className="w-4 h-4 text-white/80" strokeWidth={2.5} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth pt-20 pb-40 z-10 custom-scrollbar flex flex-col">
          {/* Kontainer ini memanjang dari atas ke bawah, memastikan konten mulai sejajar dari bawah */}
          <div className="max-w-3xl mx-auto px-5 md:px-0 w-full flex-1 flex flex-col justify-end">
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] mt-8 mb-auto">
                
                <div 
                  className="relative mb-8 opacity-0 animate-fade-slide-up"
                  style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
                >
                  <div className="absolute inset-0 bg-cyan-400/60 blur-3xl rounded-full scale-150" />
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center relative shadow-2xl shadow-cyan-500/60 border-2 border-white/30">
                    <Atom className="w-11 h-11 text-white animate-spin-slow" strokeWidth={2} />
                  </div>
                </div>
                
                <h1 
                  className="text-[42px] md:text-[60px] font-black tracking-tight mb-4 leading-[1.05] text-center text-white opacity-0 animate-fade-slide-up"
                  style={{ 
                    textShadow: '0 0 40px rgba(6, 182, 212, 0.5), 0 2px 20px rgba(0,0,0,0.8)',
                    letterSpacing: '-0.03em',
                    animationDelay: '1200ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  Good afternoon, <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">{userName.split(' ')[0]}</span>.
                </h1>
                
                <p 
                  className="text-[20px] md:text-[22px] text-white text-center max-w-lg mb-3 font-semibold opacity-0 animate-fade-slide-up"
                  style={{ 
                    textShadow: '0 2px 15px rgba(0,0,0,0.9)',
                    letterSpacing: '-0.01em',
                    animationDelay: '1400ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  I am <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent font-black">ATOM</span>.
                </p>
                
                <p 
                  className="text-[16px] md:text-[17px] text-white/80 text-center max-w-lg mb-12 font-medium opacity-0 animate-fade-slide-up"
                  style={{ 
                    textShadow: '0 2px 15px rgba(0,0,0,0.9)',
                    animationDelay: '1500ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  Business intelligence and network analytics, ready.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => submitQuery(action.text)}
                      className="group relative flex flex-col items-start p-5 rounded-[20px] bg-black/50 backdrop-blur-2xl hover:bg-black/70 transition-all duration-300 text-left border border-white/15 hover:border-cyan-400/50 shadow-[0_8px_32px_rgb(0,0,0,0.5)] hover:shadow-[0_8px_40px_rgb(6,182,212,0.25)] overflow-hidden opacity-0 animate-fade-slide-up"
                      style={{ 
                        animationDelay: `${1700 + i * 100}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/15 group-hover:to-blue-500/15 transition-all duration-500" />
                      
                      <div className="relative mb-3 text-cyan-300 group-hover:text-cyan-200 transition-colors drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        {action.icon}
                      </div>
                      <h3 
                        className="relative text-[16px] font-bold text-white mb-1 tracking-tight"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                      >
                        {action.title}
                      </h3>
                      <p 
                        className="relative text-[14px] text-white/80 leading-snug font-medium"
                        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
                      >
                        {action.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* List Chat dengan Flex Col dan gap untuk membuatnya mengisi dari bawah ke atas */}
            <div className="flex flex-col gap-8 pt-8">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'user' ? (
                    <div className="relative max-w-[85%] md:max-w-[75%]">
                      <div className="absolute inset-0 bg-cyan-500/30 blur-xl" />
                      <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-xl text-white rounded-[24px] px-5 py-3.5 border border-cyan-300/30 shadow-lg shadow-cyan-500/30">
                        <p className="text-[16px] leading-relaxed font-semibold">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    /* 🎨 BUBBLE CHAT ATOM (DIUBAH POSISI LABELNYA) */
                    <div className="flex gap-3 sm:gap-4 w-full max-w-[90%] md:max-w-[85%] items-end">
                      <div className="flex-shrink-0 mb-1 hidden sm:block">
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-400/50 blur-md rounded-full" />
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center relative shadow-lg shadow-cyan-500/40 border border-white/20">
                            <Atom className="w-4 h-4 text-white animate-spin-slow" strokeWidth={2.2} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Kontainer Utama Bubble & Label */}
                      <div className="relative flex-1 flex flex-col items-start">
                        {/* Tulisan ATOM di Luar Bubble */}
                        <div className="text-[12px] font-bold text-cyan-300 mb-2 ml-2 tracking-wider uppercase flex items-center drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                          ATOM
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-500/20 blur-xl" />
                          <div className="relative bg-gradient-to-br from-black/80 via-black/60 to-cyan-950/50 backdrop-blur-2xl text-white rounded-[24px] rounded-tl-sm px-5 py-4 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
                            <div 
                              dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} 
                              className="prose prose-invert prose-p:leading-relaxed prose-p:text-[16px] prose-p:text-white prose-p:font-medium prose-strong:text-white prose-strong:font-bold max-w-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex gap-4 justify-start animate-in fade-in duration-300 items-end">
                  <div className="flex-shrink-0 mb-1 hidden sm:block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-400/60 blur-md rounded-full animate-pulse" />
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center relative shadow-lg shadow-cyan-500/40 border border-white/20">
                        <Atom className="w-4 h-4 text-white animate-spin" strokeWidth={2.2} />
                      </div>
                    </div>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce shadow-md shadow-cyan-400/60" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce shadow-md shadow-cyan-300/60" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce shadow-md shadow-blue-400/60" style={{ animationDelay: '300ms' }} />
                    <span className="text-[13px] text-white/60 ml-2 font-medium" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>ATOM is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} className="h-6" />
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            
            <div 
              className="relative group opacity-0 animate-fade-slide-up"
              style={{ 
                animationDelay: '2100ms',
                animationFillMode: 'forwards'
              }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[28px] opacity-30 group-focus-within:opacity-60 blur transition-opacity duration-500" />
              
              <div className="relative flex items-end gap-3 bg-black/70 backdrop-blur-3xl rounded-[28px] p-2 pl-5 transition-all duration-300 border border-white/15 shadow-[0_8px_32px_rgb(0,0,0,0.6)] focus-within:bg-black/80 focus-within:border-cyan-400/50">
                
                <button className="p-2 mb-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => { 
                    setInput(e.target.value); 
                    e.target.style.height = 'auto'; 
                    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; 
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  placeholder="Ask ATOM anything..."
                  className="flex-1 max-h-[200px] min-h-[40px] bg-transparent border-none focus:outline-none resize-none py-3 text-[16px] font-medium text-white placeholder:text-white/50 custom-scrollbar"
                  rows={1}
                />

                <button 
                  onClick={() => submitQuery(input)} 
                  disabled={!input.trim() && !isProcessing}
                  className={`p-2.5 mb-1 rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center ${
                    input.trim() && !isProcessing
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white hover:scale-105 shadow-lg shadow-cyan-500/50 border border-white/20' 
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} /> : <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />}
                </button>
              </div>
            </div>
            
            <div 
              className="flex justify-center mt-3 opacity-0 animate-fade-slide-up"
              style={{ 
                animationDelay: '2300ms',
                animationFillMode: 'forwards'
              }}
            >
              <p 
                className="text-[12px] text-white/70 font-semibold tracking-wide"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
              >
                ATOM Intelligence is connected to the n8n network.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body { background: #000; margin: 0; }
        html, body { overflow: hidden; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        
        p { letter-spacing: -0.01em; }
        h1, h2, h3 { letter-spacing: -0.02em; font-weight: 700; }
        
        .prose p { color: #ffffff; font-size: 16px; font-weight: 500; line-height: 1.65; }
        .prose strong { color: #ffffff; font-weight: 700; }
        .prose em { color: rgba(255,255,255,0.85); }
        .prose ul > li::marker { color: rgba(6, 182, 212, 0.8); }
        .prose ul, .prose ol { color: #ffffff; }
        
        ::selection { background: rgba(6, 182, 212, 0.5); color: white; }
        
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 1000ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}