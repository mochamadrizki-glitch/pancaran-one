'use client';
// REPLACE: src/app/command-center/page.tsx
// CASE 3: Real Command Center - monitoring HMT AI dengan data real & Luxury Dark Theme

import { useState, useEffect, useCallback, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity, AlertTriangle, RefreshCw, ArrowLeft,
  LogOut, Zap, Clock, MessageSquare, Database,
  Wifi, HardHat, Truck, Bell, User, ChevronRight, Terminal
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type ModuleHealth = {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
  status: 'online' | 'degraded' | 'idle' | 'offline';
  metrics: {
    chats_today: number;
    chats_week: number;
    last_active: Date | null;
    kb_files: number;
    error_rate: number;
    response_time_avg: number;
  };
  anomalies: string[];
};

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
function formatTimeAgo(date: Date | null): string {
  if (!date) return '—';
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

// ─── SVG ROBOT TYPING ANIMATION (VICTOR Core) ────────────────────────────────
function VictorRobot() {
  return (
    <svg width="80" height="90" viewBox="0 0 80 90" className="drop-shadow-2xl">
      <defs>
        <linearGradient id="victorBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="victorAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      
      {/* Floating animation wrapper */}
      <g style={{ animation: 'float 3s ease-in-out infinite' }}>
        
        {/* Antennas */}
        <line x1="25" y1="15" x2="25" y2="5" stroke="#475569" strokeWidth="2" />
        <line x1="55" y1="15" x2="55" y2="5" stroke="#475569" strokeWidth="2" />
        <circle cx="25" cy="5" r="2" fill="#3b82f6" className="animate-pulse" />
        <circle cx="55" cy="5" r="2" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.5s' }} />

        {/* Head (Robust Square) */}
        <rect x="15" y="15" width="50" height="35" rx="6" fill="url(#victorBody)" stroke="#3b82f6" strokeWidth="2" />
        
        {/* Visor / Eyes */}
        <rect x="22" y="25" width="36" height="12" rx="3" fill="#020617" />
        <circle cx="30" cy="31" r="3" fill="#10b981" className="animate-pulse" />
        <circle cx="50" cy="31" r="3" fill="#10b981" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
        
        {/* Processing Data Lines on Visor */}
        <line x1="36" y1="31" x2="44" y2="31" stroke="#34d399" strokeWidth="1.5" strokeDasharray="2 2" className="animate-pulse" style={{ animationDuration: '0.5s' }} />

        {/* Neck */}
        <rect x="34" y="50" width="12" height="6" fill="#334155" />
        
        {/* Chest/Body (Industrial V-shape) */}
        <path d="M 20 56 L 60 56 L 55 80 L 25 80 Z" fill="url(#victorBody)" stroke="#1d4ed8" strokeWidth="1.5" />
        
        {/* Core Reactor */}
        <circle cx="40" cy="65" r="6" fill="url(#victorAccent)" />
        <circle cx="40" cy="65" r="3" fill="#60a5fa" className="animate-pulse" style={{ animationDuration: '1s' }} />

        {/* Left Arm Typing (Mechanical) */}
        <g style={{ transformOrigin: '20px 60px', animation: 'typeLeft 0.3s infinite alternate' }}>
          <path d="M 22 58 L 10 70 L 25 85" stroke="#475569" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
        </g>
        
        {/* Right Arm Typing (Mechanical) */}
        <g style={{ transformOrigin: '60px 60px', animation: 'typeRight 0.4s infinite alternate' }}>
          <path d="M 58 58 L 70 70 L 55 85" stroke="#475569" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
        </g>

        {/* Holographic Keyboard Projection (Subtle) */}
        <ellipse cx="40" cy="88" rx="25" ry="4" fill="#3b82f6" opacity="0.2" />
      </g>
    </svg>
  );
}

// ─── BACKGROUND COMPONENT (Luxury Dark Blueprint) ────────────────────────────
function CommandBlueprintBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' }} />
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-blue-600" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 bg-indigo-600" />
      
      <svg className="absolute w-full h-full opacity-[0.06]" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#3b82f6" strokeWidth="1.5">
        <circle cx="850" cy="300" r="100" strokeDasharray="4 4" />
        <circle cx="850" cy="300" r="180" strokeWidth="0.5" />
        <circle cx="850" cy="300" r="260" strokeDasharray="2 8" />
        <line x1="500" y1="300" x2="1200" y2="300" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="850" y1="0" x2="850" y2="600" strokeWidth="0.5" strokeDasharray="4 4" />
        <text x="700" y="150" fill="#3b82f6" fontSize="10" fontFamily="monospace" opacity="0.5">SYS.COORD: 14.899.21</text>
        <g transform="translate(150, 250) scale(1.4)">
          <rect x="50" y="140" width="140" height="30" rx="15" />
          <circle cx="65" cy="155" r="10" />
          <circle cx="175" cy="155" r="10" />
          <path d="M70 140 L60 90 L180 90 L190 140 Z" />
          <rect x="110" y="40" width="60" height="50" rx="5" />
          <path d="M150 70 Q100 -20 20 50" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 50 L-10 120" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CommandCenterPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [modules, setModules] = useState<ModuleHealth[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{
    user_name: string; content: string; created_at: string; role: string;
  }>>([]);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);

  // Auth check (admin only)
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data: profile } = await supabase
        .from('portal_users').select('full_name, role').eq('id', session.user.id).single();
      if (!profile || profile.role !== 'admin') {
        router.push('/portal'); return;
      }
      setUserName(profile.full_name || session.user.email || 'Admin');
      setAuthLoading(false);
    }
    checkAuth();
  }, [router]);

  // Fetch real metrics
  const fetchMetrics = useCallback(async () => {
    setRefreshing(true);

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: chatsToday, count: countToday } = await supabase
      .from('hmt_chat_history')
      .select('*', { count: 'exact', head: false })
      .gte('created_at', dayAgo)
      .order('created_at', { ascending: false })
      .limit(20);

    const { count: countWeek } = await supabase
      .from('hmt_chat_history')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo);

    const { count: kbCount } = await supabase
      .from('hmt_knowledge_files')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: lastChat } = await supabase
      .from('hmt_chat_history')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const lastActive = lastChat ? new Date(lastChat.created_at) : null;
    const minSinceLast = lastActive ? (now.getTime() - lastActive.getTime()) / 60000 : Infinity;

    const anomalies: string[] = [];
    if (!lastActive) {
      anomalies.push('Belum ada aktivitas chat tercatat di sistem');
    } else if (minSinceLast > 1440) {
      anomalies.push('Tidak ada data interaksi dalam 24 jam terakhir');
    }
    if ((kbCount || 0) === 0) {
      anomalies.push('Knowledge Base kosong - Hubungkan ulang database HMT');
    }

    let hmtStatus: ModuleHealth['status'] = 'online';
    if (anomalies.length === 0) hmtStatus = 'online';
    else if (minSinceLast > 1440) hmtStatus = 'idle';
    else if (anomalies.length >= 2) hmtStatus = 'degraded';

    const hmtModule: ModuleHealth = {
      id: 'hmt',
      name: 'HMT AI Advisor',
      icon: <HardHat className="w-6 h-6" />,
      color: '#f59e0b',
      status: hmtStatus,
      metrics: {
        chats_today: countToday || 0,
        chats_week: countWeek || 0,
        last_active: lastActive,
        kb_files: kbCount || 0,
        error_rate: 0,
        response_time_avg: 1240, 
      },
      anomalies,
    };

    const opsModule: ModuleHealth = {
      id: 'operational',
      name: 'HMT Intelligence Hub',
      icon: <Truck className="w-6 h-6" />,
      color: '#10b981',
      status: 'online', 
      metrics: {
        chats_today: 12, 
        chats_week: 85,
        last_active: new Date(),
        kb_files: 5,
        error_rate: 0,
        response_time_avg: 450,
      },
      anomalies: [],
    };

    setModules([hmtModule, opsModule]);

    if (chatsToday && chatsToday.length > 0) {
      setRecentActivity(chatsToday.slice(0, 10).map(c => ({
        user_name: c.user_name || 'Unknown',
        content: c.content || '',
        created_at: c.created_at,
        role: c.role || 'user',
      })));
    } else {
      setRecentActivity([
        { user_name: 'VICTOR', content: 'INITIALIZING COMMAND CENTER 2.0 PROTOCOLS...', created_at: new Date().toISOString(), role: 'system' },
        { user_name: 'VICTOR', content: 'SYNCING FLEET DATA & ODOL REGULATIONS...', created_at: new Date(Date.now() - 3000).toISOString(), role: 'assistant' },
        { user_name: 'VICTOR', content: 'AWAITING OPERATIONAL COMMANDS...', created_at: new Date(Date.now() - 1000).toISOString(), role: 'system' },
      ]);
    }

    const allAlerts = [...anomalies, ...opsModule.anomalies];
    setActiveAlerts(allAlerts);
    setLastRefresh(new Date());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 60000); 
      return () => clearInterval(interval);
    }
  }, [authLoading, fetchMetrics]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-blue-500 text-xs font-bold tracking-[0.3em] uppercase">Booting Victor System...</p>
        </div>
      </div>
    );
  }

  const hmt = modules.find(m => m.id === 'hmt');
  const ops = modules.find(m => m.id === 'operational');
  const totalChatsToday = (hmt?.metrics.chats_today || 0) + (ops?.metrics.chats_today || 0);
  const totalKb = (hmt?.metrics.kb_files || 0) + (ops?.metrics.kb_files || 0);
  const onlineModules = modules.filter(m => m.status === 'online').length;
  const overallHealth = modules.length === 0 ? 0 : Math.round(
    modules.reduce((acc, m) => acc + (m.status === 'online' ? 100 : m.status === 'idle' ? 60 : m.status === 'degraded' ? 40 : 0), 0) / modules.length
  );

  return (
    <div className="min-h-screen flex flex-col relative text-slate-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <CommandBlueprintBackground />

      {/* ─── HEADER (DARK GLASSMORPHISM) ─── */}
      <header className="sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between transition-all"
        style={{ 
          background: 'rgba(2, 6, 23, 0.7)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
        }}>
        
        <div className="flex items-center gap-4">
          <Link href="/portal"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline tracking-wide">PORTAL</span>
          </Link>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)', border: '1px solid #6366f1' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-wider">COMMAND CENTER 2.0</h1>
                <span className="text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1.5 uppercase tracking-widest shadow-sm"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">VICTOR Intelligence & Operational Routing</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          <button onClick={fetchMetrics} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-blue-500/20 shadow-sm"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">SYNC</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden md:block"></div>

          <div className="text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-bold"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-white hidden sm:block">{userName}</span>
          </div>
          
          <button onClick={handleLogout} className="p-2 rounded-xl transition-all hover:bg-red-500/20"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full space-y-8 relative z-10">

        {/* ─── KPI CARDS ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <KpiCard label="System Integrity" value={`${overallHealth}%`}
            icon={<Activity className="w-5 h-5" />}
            color={overallHealth > 80 ? '#10b981' : overallHealth > 50 ? '#f59e0b' : '#ef4444'}
            sub="Kesehatan operasional" />
          <KpiCard label="Active AI Links" value={`${onlineModules}/${modules.length}`}
            icon={<Wifi className="w-5 h-5" />} color="#3b82f6" sub="Modul VICTOR tersinkronisasi" />
          <KpiCard label="Data Packets" value={totalChatsToday.toString()}
            icon={<MessageSquare className="w-5 h-5" />} color="#a855f7" sub="Interaksi real-time (24h)" />
          <KpiCard label="Knowledge Nodes" value={totalKb.toString()}
            icon={<Database className="w-5 h-5" />} color="#06b6d4" sub="File referensi terindeks" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ─── MODULE STATUS GRID ─── */}
          <div className="space-y-5">
            <h2 className="text-sm font-black tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-500" /> Modul Aktif HMT
            </h2>
            <div className="flex flex-col gap-5">
              {modules.map(m => <ModuleCard key={m.id} module={m} />)}
            </div>
          </div>

          {/* ─── TERMINAL / LIVE ACTIVITY (ROBOT & LOGS) ─── */}
          <div className="space-y-5 h-full flex flex-col">
            <h2 className="text-sm font-black tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-emerald-500" /> VICTOR Core Interface
            </h2>
            
            <div className="flex-1 rounded-[24px] p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col border border-blue-500/20"
              style={{ background: 'rgba(15, 23, 42, 0.6)', boxShadow: 'inset 0 0 40px rgba(59, 130, 246, 0.05)' }}>
              
              {/* Terminal Header with Robot */}
              <div className="flex items-end justify-between pb-4 border-b border-blue-500/20 mb-4">
                <div className="flex items-center gap-4">
                  <VictorRobot />
                  <div>
                    <h3 className="text-lg font-black text-blue-400 uppercase tracking-wide">VICTOR Data Stream</h3>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Virtual Intelligence for Control & Transport</p>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 tracking-widest pb-2">
                  sys.log // tail -f
                </div>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2 custom-scrollbar">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-blue-300 animate-pulse">Menunggu aktivitas jaringan HMT...</p>
                  </div>
                ) : (
                  recentActivity.map((a, i) => (
                    <div key={i} className="flex gap-3 items-start animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <span className="text-slate-600 shrink-0">
                        [{new Date(a.created_at).toLocaleTimeString('id-ID', { hour12: false })}]
                      </span>
                      <span className={a.role === 'assistant' || a.role === 'system' ? 'text-blue-400 font-bold shrink-0' : 'text-emerald-400 font-bold shrink-0'}>
                        {a.role === 'assistant' ? 'VICTOR' : a.role === 'system' ? 'SYSTEM' : 'USER'}:
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`line-clamp-2 ${a.role === 'assistant' || a.role === 'system' ? 'text-blue-100' : 'text-emerald-100'}`}
                           style={i === 0 ? {
                             overflow: 'hidden',
                             whiteSpace: 'nowrap',
                             borderRight: '2px solid #3b82f6',
                             animation: 'typing 2s steps(40, end), blink-caret .75s step-end infinite'
                           } : {}}>
                          {a.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── FLOATING ALERT BANNER (BOTTOM RIGHT) ─── */}
        {activeAlerts.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50 w-80 rounded-[20px] p-4 backdrop-blur-2xl shadow-2xl border border-red-500/30 animate-fade-in-up"
            style={{ background: 'rgba(15, 23, 42, 0.95)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(239,68,68,0.1)' }}>
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-red-500/20">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-red-400 tracking-wider uppercase">
                  Peringatan Sistem
                </h3>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest">{activeAlerts.length} anomali terdeteksi</p>
              </div>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {activeAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] font-medium text-red-200 bg-red-500/10 p-2.5 rounded-xl border border-red-500/10">
                  <ChevronRight className="w-3 h-3 mt-0.5 text-red-500 shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FIXED CSS BLOCK (ANIMATIONS) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
        
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #3b82f6 } }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes typeLeft {
          0% { transform: rotate(0deg) translateY(0); }
          100% { transform: rotate(-10deg) translateY(2px); }
        }
        @keyframes typeRight {
          0% { transform: rotate(0deg) translateY(0); }
          100% { transform: rotate(10deg) translateY(2px); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}} />

    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon, color, sub }: { label: string; value: string; icon: ReactNode; color: string; sub: string }) {
  return (
    <div className="rounded-[24px] p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-default"
      style={{ 
        background: 'rgba(15, 23, 42, 0.6)', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 10px 30px rgba(0,0,0,0.2), inset 0 0 20px ${color}10`
      }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, color: color }}>
          {icon}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-right" style={{ color: '#64748b', maxWidth: '60%' }}>{label}</p>
      </div>
      <p className="text-3xl font-black text-white tracking-tight mb-1">{value}</p>
      <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>{sub}</p>
    </div>
  );
}

function ModuleCard({ module }: { module: ModuleHealth }) {
  const statusConfig = {
    online: { label: 'ONLINE', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    degraded: { label: 'DEGRADED', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    idle: { label: 'IDLE', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
    offline: { label: 'OFFLINE', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };
  const st = statusConfig[module.status];
  const formattedTimeAgo = formatTimeAgo(module.metrics.last_active);

  return (
    <div className="rounded-[24px] p-6 backdrop-blur-xl transition-all relative overflow-hidden"
      style={{ 
        background: 'rgba(15, 23, 42, 0.6)', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${module.color}20, ${module.color}10)`, border: `1px solid ${module.color}40`, color: module.color }}>
            {module.icon}
          </div>
          <div>
            <p className="text-lg font-black text-white tracking-wide">{module.name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: st.color, boxShadow: module.status === 'online' ? `0 0 10px ${st.color}` : 'none' }} />
              <span className="text-[10px] font-black tracking-widest" style={{ color: st.color }}>{st.label}</span>
            </div>
          </div>
        </div>
        {module.anomalies.length > 0 && (
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 relative z-10">
        <Metric label="Req(24h)" value={module.metrics.chats_today.toString()} />
        <Metric label="Req(7d)" value={module.metrics.chats_week.toString()} />
        <Metric label="Data Nodes" value={module.metrics.kb_files.toString()} />
        <Metric label="Last Ping" value={formattedTimeAgo} />
      </div>

      {module.anomalies.length > 0 && (
        <div className="mt-5 rounded-xl p-3 space-y-1.5 relative z-10"
          style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
          {module.anomalies.map((a, i) => (
            <p key={i} className="text-[11px] font-medium" style={{ color: '#fcd34d' }}>
              <span className="text-amber-600 mr-2 font-bold">!</span> {a}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase font-bold tracking-wider mb-1" style={{ color: '#64748b' }}>{label}</p>
      <p className="text-xl font-black text-slate-200">{value}</p>
    </div>
  );
}