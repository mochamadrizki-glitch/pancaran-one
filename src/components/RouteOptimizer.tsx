"use client"; // Wajib ada untuk fitur klik tombol
import React, { useState } from 'react';

export default function RouteOptimizer() {
  // State untuk status tombol (apakah AI sedang aktif atau tidak)
  const [isAiActive, setIsAiActive] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
      
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Pancaran AI Route</h2>
          <p className="text-sm text-slate-400">Optimasi rute pengiriman real-time</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isAiActive ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-800 text-slate-500'}`}>
          {isAiActive ? "AI ACTIVE" : "STANDBY"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KIRI: VISUALISASI PETA (MOCKUP) */}
        <div className="md:col-span-2 relative h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
          {/* Garis Rute Standar (Merah) */}
          <svg className="absolute inset-0 w-full h-full p-4">
            <path 
              d="M 50 200 Q 150 150 200 220 T 350 50" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="4"
            />
          </svg>

          {/* Garis Rute AI (Hijau - Hanya Muncul Jika Tombol Diklik) */}
          {isAiActive && (
            <svg className="absolute inset-0 w-full h-full p-4 animate-in fade-in duration-700">
              <path 
                d="M 50 200 L 200 100 L 350 50" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="4" 
                className="drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
              />
            </svg>
          )}

          <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 space-y-1 bg-slate-950/80 p-2 rounded">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" /> Jalur Manual (Macet)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" /> Jalur AI (Efisien)
            </div>
          </div>
        </div>

        {/* KANAN: STATISTIK & TOMBOL */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Estimasi Penghematan</p>
            <p className={`text-2xl font-bold ${isAiActive ? 'text-green-400' : 'text-slate-600'}`}>
              {isAiActive ? "Rp 450.000" : "Rp 0"}
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Waktu Tempuh</p>
            <p className={`text-2xl font-bold ${isAiActive ? 'text-blue-400' : 'text-white'}`}>
              {isAiActive ? "45 Menit" : "72 Menit"}
            </p>
          </div>

          <button 
            onClick={() => setIsAiActive(!isAiActive)}
            className={`w-full py-3 rounded-lg font-bold transition-all transform active:scale-95 ${
              isAiActive 
              ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
              : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20'
            }`}
          >
            {isAiActive ? "Reset Route" : "Optimasi dengan AI"}
          </button>
        </div>

      </div>
    </div>
  );
}