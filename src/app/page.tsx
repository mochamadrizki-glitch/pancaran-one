'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

// ==========================================
// COMPONENT: HELPDESK WIDGET (Modern & Artistic)
// ==========================================
const HelpdeskWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketType, setTicketType] = useState<'feedback' | 'issue'>('feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setMessage('');
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      {/* PANEL POP-UP HELPDESK */}
      <div 
        className={`fixed bottom-28 right-6 md:right-10 z-[999] w-[340px] md:w-[380px] bg-[#001529]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-90 translate-y-10 invisible pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#001529] animate-pulse"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-cyan-300">
                <path d="M12 8V4H8"></path>
                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                <path d="M2 14h2"></path>
                <path d="M20 14h2"></path>
                <path d="M15 13v2"></path>
                <path d="M9 13v2"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-cyan-50 text-sm font-bold tracking-wide uppercase">AI Core Support</h3>
              <p className="text-cyan-300/60 text-[9px] uppercase tracking-widest">System Diagnostics</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-cyan-400/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h4 className="text-white font-bold text-lg mb-1">Laporan Terkirim</h4>
              <p className="text-cyan-100/60 text-xs">Pesan Anda telah dienkripsi dan diteruskan ke tim administrator.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in duration-500">
              <div className="flex bg-[#020813] p-1 rounded-lg border border-cyan-900/50">
                <button
                  type="button"
                  onClick={() => setTicketType('feedback')}
                  className={`flex-1 text-xs py-2 rounded-md transition-all font-bold tracking-wider uppercase ${
                    ticketType === 'feedback' ? 'bg-cyan-900/60 text-cyan-100 shadow-sm border border-cyan-500/30' : 'text-cyan-500/50 hover:text-cyan-300'
                  }`}
                >
                  Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setTicketType('issue')}
                  className={`flex-1 text-xs py-2 rounded-md transition-all font-bold tracking-wider uppercase ${
                    ticketType === 'issue' ? 'bg-red-900/40 text-red-100 shadow-sm border border-red-500/30' : 'text-cyan-500/50 hover:text-cyan-300'
                  }`}
                >
                  Issue
                </button>
              </div>
              <div className="relative">
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={ticketType === 'feedback' ? "Transmit your feedback here..." : "Report system anomaly or error here..."}
                  className="w-full h-32 bg-[#020813]/50 border border-cyan-800/50 rounded-lg p-3 text-sm text-cyan-50 placeholder:text-cyan-700/70 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full py-3 bg-gradient-to-r from-cyan-700 to-[#004a99] hover:from-cyan-600 hover:to-blue-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'SEND REPORT'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[999] w-14 h-14 bg-[#004a99] border border-cyan-400/50 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,74,153,0.6)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:bg-cyan-600 hover:-translate-y-1 transition-all duration-300 group"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-in spin-in-90 duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative animate-in spin-in-90 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 border-2 border-[#004a99] rounded-full animate-pulse"></span>
          </div>
        )}
      </button>
    </>
  );
};

// ==========================================
// COMPONENT: 2D BLUEPRINT BACKGROUND
// Contains illustrations of Cars, Trucks, Heavy Machinery, Ships, Barges & AI Agents
// ==========================================
const SystemBlueprintBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
    <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover animate-[pulse_4s_ease-in-out_infinite]">
      {/* Grid Pattern */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" />
        </pattern>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <g stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
        
        {/* 1. CARGO SHIP - Top Right */}
        <g transform="translate(850, 150) scale(1.2)">
          <path d="M10 60 L40 80 L280 80 L310 40 L280 40 L280 20 L240 20 L240 40 L40 40 Z" fill="rgba(34, 211, 238, 0.05)"/>
          <rect x="50" y="25" width="30" height="15" />
          <rect x="90" y="15" width="30" height="25" />
          <rect x="130" y="5" width="30" height="35" />
          <rect x="170" y="20" width="30" height="20" />
          <path d="M260 20 L260 0 M250 10 L270 10" strokeWidth="1"/>
          <text x="15" y="70" fontSize="8" fill="#22d3ee" stroke="none" letterSpacing="2">VESSEL-01</text>
        </g>

        {/* 2. BARGE & TUGBOAT - Bottom Right */}
        <g transform="translate(900, 650)">
          {/* Tugboat */}
          <path d="M10 40 L30 50 L80 50 L80 30 L60 20 L40 20 L30 30 Z" fill="rgba(34, 211, 238, 0.05)"/>
          <rect x="45" y="10" width="10" height="10" />
          {/* Tow Line */}
          <line x1="80" y1="45" x2="130" y2="45" strokeDasharray="4 4"/>
          {/* Barge */}
          <path d="M130 40 L140 50 L320 50 L330 40 Z" fill="rgba(34, 211, 238, 0.05)"/>
          <path d="M150 40 Q230 10 310 40" fill="rgba(34, 211, 238, 0.1)"/> {/* Coal/Material */}
          <text x="140" y="65" fontSize="10" fill="#22d3ee" stroke="none" letterSpacing="2">BARGE-C2</text>
        </g>

        {/* 3. HEAVY MACHINERY (EXCAVATOR) - Center Left */}
        <g transform="translate(150, 400) scale(1.3)">
          <rect x="40" y="60" width="80" height="20" rx="10" fill="rgba(34, 211, 238, 0.05)"/> {/* Tracks */}
          <circle cx="50" cy="70" r="6" />
          <circle cx="110" cy="70" r="6" />
          <path d="M55 60 L60 30 L100 30 L105 60 Z" fill="rgba(34, 211, 238, 0.1)"/> {/* Cab */}
          <path d="M80 40 L130 10 L160 40" strokeWidth="2" fill="none"/> {/* Arm */}
          <path d="M160 40 L150 60 L170 65 L175 45 Z" fill="rgba(34, 211, 238, 0.1)"/> {/* Bucket */}
          <text x="45" y="95" fontSize="8" fill="#22d3ee" stroke="none">HVY-MACH-88</text>
        </g>

        {/* 4. HEAVY TRUCK - Bottom Left */}
        <g transform="translate(200, 700) scale(1.1)">
          {/* Cab */}
          <path d="M20 50 L20 20 Q20 10 30 10 L60 10 L75 30 L85 50 Z" fill="rgba(34, 211, 238, 0.05)"/>
          {/* Trailer */}
          <rect x="95" y="10" width="180" height="40" rx="2" fill="rgba(34, 211, 238, 0.05)"/>
          <line x1="85" y1="45" x2="95" y2="45" strokeWidth="2"/>
          {/* Wheels */}
          <circle cx="40" cy="60" r="10" />
          <circle cx="70" cy="60" r="10" />
          <circle cx="130" cy="60" r="10" />
          <circle cx="160" cy="60" r="10" />
          <circle cx="240" cy="60" r="10" />
          <text x="105" y="35" fontSize="12" fill="#22d3ee" stroke="none" letterSpacing="4">LOGISTICS</text>
        </g>

        {/* 5. OPERATIONAL VEHICLE (FLEET CAR) - Center Right */}
        <g transform="translate(650, 500)">
          <path d="M10 30 L30 15 L70 15 L90 30 L100 30 L100 45 L5 45 L5 30 Z" fill="rgba(34, 211, 238, 0.05)"/>
          <circle cx="25" cy="45" r="8" />
          <circle cx="75" cy="45" r="8" />
          <line x1="35" y1="15" x2="35" y2="30" />
          <text x="30" y="65" fontSize="9" fill="#22d3ee" stroke="none">OPS-VEHICLE</text>
        </g>

        {/* 6. AI AGENTS & NETWORK LINES (Orchestrator Nodes) */}
        {/* Lines connecting everything to the center */}
        <g strokeDasharray="5 5" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1">
          <line x1="720" y1="450" x2="990" y2="230" /> {/* Center to Ship */}
          <line x1="720" y1="450" x2="1060" y2="680" /> {/* Center to Barge */}
          <line x1="720" y1="450" x2="280" y2="440" /> {/* Center to Excavator */}
          <line x1="720" y1="450" x2="380" y2="720" /> {/* Center to Truck */}
          <line x1="720" y1="450" x2="700" y2="520" /> {/* Center to Car */}
        </g>

        {/* AI Agent Nodes (Glowing Circles) */}
        <g>
          {/* Main Core Node */}
          <circle cx="720" cy="450" r="40" fill="url(#glow)" stroke="none" />
          <circle cx="720" cy="450" r="15" fill="#fff" stroke="none" />
          <circle cx="720" cy="450" r="50" strokeDasharray="10 10" strokeWidth="2" className="animate-[spin_10s_linear_infinite]" />
          
          {/* Sub Nodes */}
          <circle cx="990" cy="230" r="8" fill="#fff" />
          <circle cx="1060" cy="680" r="8" fill="#fff" />
          <circle cx="280" cy="440" r="8" fill="#fff" />
          <circle cx="380" cy="720" r="8" fill="#fff" />
          <circle cx="700" cy="520" r="6" fill="#fff" />
        </g>
      </g>
    </svg>
  </div>
);

export default function LandingPage() {
  const router = useRouter(); // Fungsi router ditambahkan
  const [showOrchestrator, setShowOrchestrator] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // State baru untuk efek Warp

  // Prevent scrolling when in the Orchestrator realm or during Warp navigation
  useEffect(() => {
    if (showOrchestrator || isNavigating) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showOrchestrator, isNavigating]);

  // Fungsi untuk mengeksekusi animasi Warp sebelum pindah ke halaman Login
  const handleLoginNavigation = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/login');
    }, 1200); // Jeda 1.2 detik agar animasi selesai
  };

  return (
    <div className="relative min-h-screen w-full bg-[#001a33] overflow-hidden font-sans">
      
      {/* WADAH FEEDBACK YANG SUDAH TERINTEGRASI */}
      <HelpdeskWidget />

      {/* ================================================== */}
      {/* LAYER 1: MAIN LANDING PAGE (Physical/Real World View) */}
      {/* ================================================== */}
      {/* Class di bawah ini merespon saat tombol login ditekan (isNavigating) */}
      <div className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isNavigating ? 'scale-[2.5] blur-3xl opacity-0 pointer-events-none' : 
        showOrchestrator ? 'scale-110 blur-2xl opacity-0 pointer-events-none' : 'scale-100 blur-0 opacity-100'
      }`}>
        
        {/* MODERN HEADER */}
        <div className="fixed top-6 left-0 w-full z-40 flex justify-center px-6 md:px-10 pointer-events-none">
          <header className="w-full max-w-[1500px] bg-white/90 backdrop-blur-xl border border-white/60 rounded-full flex items-center justify-between px-8 md:px-10 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-500 pointer-events-auto">
            <div className="flex items-center gap-8">
              <div className="relative h-[30px] w-[140px] flex-shrink-0 cursor-pointer">
                <Image src="/images/logo-pancaran.png" alt="Pancaran Logo" fill className="object-contain object-left" unoptimized />
              </div>
              <div className="hidden lg:flex items-center gap-6 border-l border-slate-200 pl-8">
                {[
                  { name: 'VICTOR', status: 'ONLINE', color: 'bg-green-500' },
                  { name: 'FINANCE', status: 'IDLE', color: 'bg-blue-400' },
                  { name: 'VENDOR', status: 'ONLINE', color: 'bg-green-500' }
                ].map((node) => (
                  <div key={node.name} className="flex items-center gap-2">
                    <span className="text-slate-400 text-[8px] font-bold tracking-widest uppercase">{node.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${node.color} shadow-sm animate-pulse`}></div>
                  </div>
                ))}
              </div>
            </div>

            <nav className="hidden xl:flex items-center gap-8">
              {['CORE SYSTEM', 'AGENT NODES', 'SECURITY', 'SYSTEM LOGS'].map((menu) => (
                <a key={menu} href="#" className="relative text-[11px] font-extrabold text-slate-900 hover:text-[#004a99] transition-colors tracking-[0.15em] group">
                  {menu}
                  <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-[#004a99] transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ))}
              
              <div className="flex items-center gap-4 ml-4 border-l-2 border-slate-200/80 pl-6">
                {/* Tombol SIGN IN ini memicu fungsi handleLoginNavigation */}
                <button 
                  onClick={handleLoginNavigation}
                  className="flex items-center gap-2.5 bg-[#004a99] text-white text-[11px] font-bold px-8 py-2.5 rounded-full shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300 tracking-widest group uppercase">
                  SIGN IN
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </nav>
          </header>
        </div>

        {/* HERO SECTION */}
        <main className="relative h-screen w-full flex items-center justify-center pt-[60px]">
          <div className="absolute inset-0 z-0">
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/company-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#001a33]/80 via-[#001a33]/40 to-[#000000]/90" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-10">
            <div className="inline-block px-4 py-1 mb-6 rounded-full border border-green-400/30 bg-green-500/10 backdrop-blur-md shadow-lg shadow-green-500/10">
              <p className="text-[9px] font-bold tracking-[0.25em] text-green-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Secured Internal AI Network
              </p>
            </div>

            <h1 className="text-4xl md:text-[75px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-50 to-blue-200 drop-shadow-2xl mb-4 tracking-tight leading-tight uppercase">
              PANCARAN AI CORE
            </h1>
            
            <p className="text-[10px] md:text-[12px] text-blue-50/60 font-medium tracking-[0.3em] mb-10 max-w-xl uppercase leading-relaxed border-t border-white/10 pt-4">
              Internal AI Orchestration & Multi-Agent System
            </p>
            
            {/* LAUNCH ORCHESTRATOR BUTTON */}
            <button 
              onClick={() => setShowOrchestrator(true)}
              className="group relative px-10 py-3.5 bg-white/5 backdrop-blur-sm border border-white/30 text-[10px] font-bold text-white tracking-[0.2em] overflow-hidden transition-all duration-500 hover:bg-white hover:text-[#004a99] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:border-white rounded-sm">
              <span className="relative z-10">LAUNCH ORCHESTRATOR</span>
            </button>
          </div>
        </main>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30 text-[9px] font-bold uppercase tracking-[0.5em] pointer-events-none">
          System Established 1992
        </div>
      </div>

      {/* ================================================== */}
      {/* LAYER 2: ORCHESTRATOR REALM (Digital AI Dimension) */}
      {/* ================================================== */}
      {/* Class di bawah ini juga merespon saat tombol login ditekan (isNavigating) dari dalam Orchestrator */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isNavigating ? 'scale-[2.5] blur-3xl opacity-0 pointer-events-none' : 
          showOrchestrator ? 'opacity-100 scale-100 visible pointer-events-auto backdrop-blur-0' : 'opacity-0 scale-150 invisible pointer-events-none backdrop-blur-3xl'
        }`}
      >
        {/* Otherworldly Digital Background */}
        <div className="absolute inset-0 bg-[#020813]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020813] to-[#020813]"></div>
        </div>
        
        {/* 2D Line Art Blueprint Component */}
        <SystemBlueprintBackground />

        {/* Close Button (Return to real world) */}
        <button 
          onClick={() => setShowOrchestrator(false)}
          className="absolute top-10 right-10 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-cyan-950/30 backdrop-blur-md border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-[#020813] transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Artistic Typography Content in the Center of Digital Realm */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center">
          
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="w-16 h-[1px] bg-cyan-500/60"></span>
            <span className="text-[10px] md:text-xs text-cyan-300 uppercase tracking-[0.6em] font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">System Initiated</span>
            <span className="w-16 h-[1px] bg-cyan-500/60"></span>
          </div>

          <h2 className="text-5xl md:text-[100px] font-light text-white mb-8 tracking-[0.1em] drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] leading-none">
            AI <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300">ORCHESTRATOR</span>
          </h2>
          
          <p className="text-lg md:text-2xl font-light text-cyan-50/80 leading-relaxed md:leading-snug max-w-4xl mx-auto mb-16 tracking-wide drop-shadow-md">
            The central intelligence system synchronizing every operational agent, physical fleet, and maritime route in <span className="italic font-normal text-cyan-300">real-time</span>. Processing billions of data points to drive limitless logistical decisions.
          </p>

          {/* Tombol ACCESS CONTROL TOWER ini memicu fungsi handleLoginNavigation */}
          <button 
            onClick={handleLoginNavigation}
            className="group relative px-12 py-5 bg-cyan-950/40 backdrop-blur-md border border-cyan-400/50 text-xs md:text-sm font-bold text-cyan-50 tracking-[0.3em] overflow-hidden transition-all duration-700 hover:bg-cyan-400 hover:text-[#020813] hover:shadow-[0_0_60px_rgba(34,211,238,0.8)] rounded-full uppercase flex items-center gap-4">
            <span className="relative z-10">ACCESS CONTROL TOWER</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>

        </div>
      </div>

    </div>
  );
}