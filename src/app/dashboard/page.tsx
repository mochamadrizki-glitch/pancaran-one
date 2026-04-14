'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export default function OverviewPage() {
  const [stats, setStats] = useState({
    totalFleet: 0,
    inTransit: 0,
    openTickets: 0,
    avgMps: 0
  });
  const [regionData, setRegionData] = useState<any>({});

  useEffect(() => {
    // 1. Ambil Data Fleet Real-time
    const unsubFleet = onSnapshot(collection(db, "DATA_STOK_ARMADA"), (snap) => {
      let total = 0;
      let regions: any = {};
      snap.docs.forEach(doc => {
        const data = doc.data();
        const jumlah = Number(data.jumlah) || 0;
        total += jumlah;
        const lok = data.lokasi?.toUpperCase() || 'LAINNYA';
        regions[lok] = (regions[lok] || 0) + jumlah;
      });
      setStats(prev => ({ ...prev, totalFleet: total }));
      setRegionData(regions);
    });

    // 2. Ambil Data Unit On Road (In-Transit)
    const qTrack = query(collection(db, "DATA_TRACKING"), where("status", "==", "Perjalanan"));
    const unsubTrack = onSnapshot(qTrack, (snap) => {
      setStats(prev => ({ ...prev, inTransit: snap.size }));
    });

    // 3. Ambil Data Tiket & Hitung Rating MPS
    const unsubTickets = onSnapshot(collection(db, "CATAT_TIKET_BANTUAN"), (snap) => {
      let open = 0;
      let totalMps = 0;
      let countMps = 0;
      
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.status === 'OPEN') open++;
        if (d.mps_rating && d.mps_rating !== '-' && d.mps_rating !== '') {
          totalMps += Number(d.mps_rating);
          countMps++;
        }
      });

      // SOLUSI ERROR: Paksa hasil menjadi angka dengan Number()
      const hasilMps = countMps > 0 ? Number((totalMps / countMps).toFixed(1)) : 0;

      setStats(prev => ({ 
        ...prev, 
        openTickets: open,
        avgMps: hasilMps
      }));
    });

    return () => {
      if (unsubFleet) unsubFleet();
      if (unsubTrack) unsubTrack();
      if (unsubTickets) unsubTickets();
    };
  }, []);

  const getMaxVal = () => {
    const values = Object.values(regionData) as number[];
    return values.length > 0 ? Math.max(...values) : 10;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-sm relative">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#233762] tracking-tight">🚀 PANCARAN COMMAND CENTER</h1>
        <p className="text-slate-400 font-medium">Data Terupdate Real-Time dari Firebase</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Fleet Ready</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#233762]">{stats.totalFleet}</span>
            <span className="text-slate-400 font-bold text-xs uppercase">Unit</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Units In-Transit</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-600">{stats.inTransit}</span>
            <span className="text-slate-400 font-bold text-xs uppercase">On Road</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Open Tickets</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-red-500">{stats.openTickets}</span>
            <span className="text-slate-400 font-bold text-xs uppercase">Pending</span>
          </div>
        </div>
        <div className="bg-[#233762] p-6 rounded-3xl shadow-lg border border-slate-100">
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3">Avg MPS Rating</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.avgMps}</span>
            <span className="text-blue-200 font-bold text-xs uppercase">/ 10.0</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Batang Per Wilayah */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-[#233762] uppercase tracking-wider mb-10">Fleet Utilization per Region</h3>
          <div className="flex items-end justify-around h-64 border-b border-slate-100 pb-2 gap-4">
            {Object.keys(regionData).length === 0 ? (
                <p className="text-slate-300 italic">Menunggu data armada...</p>
            ) : (
                Object.entries(regionData).map(([name, val]: any) => (
                    <div key={name} className="flex flex-col items-center h-full justify-end w-full group">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                            <span className="absolute -top-6 text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-all">{val}</span>
                            <div 
                                className="w-full max-w-[35px] bg-blue-600 rounded-t-xl transition-all duration-700 group-hover:bg-[#233762]" 
                                style={{ height: `${(val / getMaxVal()) * 100}%`, minHeight: '4px' }}
                            ></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 mt-3 uppercase text-center truncate w-full tracking-tighter">{name}</span>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Service Health */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-[#233762] uppercase tracking-wider mb-8">Service Health</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Response Time</span>
                <span className="text-xs font-black text-green-500">2.4M</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[90%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Rate</span>
                <span className="text-xs font-black text-blue-500">96%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div className="mt-10 p-5 bg-[#233762] rounded-2xl shadow-inner">
              <p className="text-[9px] text-blue-300 font-black uppercase mb-2 tracking-widest tracking-[0.2em]">System Status</p>
              <p className="text-xs text-white italic opacity-80 leading-relaxed font-medium">
                {stats.openTickets > 0 
                    ? `Terdapat ${stats.openTickets} tiket pending yang memerlukan perhatian.` 
                    : "Seluruh sistem operasional berjalan normal."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}