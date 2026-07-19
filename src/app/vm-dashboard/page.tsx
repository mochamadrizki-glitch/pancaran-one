"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Terminal, ShieldCheck, MapPin, Box, Calendar, DollarSign, MessageCircle, Bell, Clock, AlertCircle } from 'lucide-react';

export default function VMDashboard() {
  const [fleetType, setFleetType] = useState("Wingbox");
  const [unitCount, setUnitCount] = useState("");
  const [loadDate, setLoadDate] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [route, setRoute] = useState("");
  const [priceStrategy, setPriceStrategy] = useState("Nego Terbuka");
  const [budgetRange, setBudgetRange] = useState("");
  
  const [logs, setLogs] = useState([
    "Pancaran AI Core OS v2.1 (Connected)",
    "> Menunggu parameter tugas dari operator..."
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // FUNGSI UNTUK MENANGKAP DATA DARI CS DASHBOARD
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const fleetParam = searchParams.get('fleet');
      const qtyParam = searchParams.get('qty');
      const cargoParam = searchParams.get('cargo');
      const routeParam = searchParams.get('route');

      // Jika ada data masuk, otomatis isi form-nya
      if (fleetParam) setFleetType(fleetParam);
      if (qtyParam) setUnitCount(qtyParam);
      if (cargoParam) setCargoType(cargoParam);
      if (routeParam) {
        setRoute(routeParam);
        // Tambahkan pemberitahuan di Terminal Log
        setLogs(prev => [
          ...prev,
          `> [SYSTEM NOTIFICATION] Menerima push order dari CS Dashboard!`,
          `> Rute: ${routeParam} | Armada: ${qtyParam}x ${fleetParam} | Muatan: ${cargoParam}`
        ]);
      }
    }
  }, []);

  const reminders = [
    { id: 1, task: "Konfirmasi Trailer Puninar", time: "10 Menit Lagi", urgent: true },
    { id: 2, task: "Update Order Pooling CS", time: "1 Jam Lagi", urgent: false },
  ];

  const handleAssignAI = () => {
    if (!unitCount || !route || !cargoType) {
      setLogs(prev => [...prev, "> [ERROR] Gagal: Harap isi seluruh kolom form!"]);
      return;
    }

    setIsProcessing(true);
    setLogs(prev => [
      ...prev,
      `> Menerima instruksi operasional...`,
      `> Target: ${unitCount} unit ${fleetType} | Rute: ${route}`,
      `> Strategi Harga: [${priceStrategy}] | Budget: ${budgetRange}`,
      `> [SYSTEM] Menghubungkan ke n8n Patricia Agent...`
    ]);

    setTimeout(() => {
      setLogs(prev => [...prev, "> [AI] Patricia sedang menghubungi 5 vendor via WhatsApp..."]);
    }, 1500);

    setTimeout(() => {
      setLogs(prev => [...prev, "> [LIVE] PT. Dunex merespons: Menawarkan Rp 3.800.000 (Nego)"]);
    }, 3000);

    setTimeout(() => {
      setLogs(prev => [
        ...prev, 
        `> [AI] Melakukan counter-offer otomatis ke vendor...`,
        `> [STANDBY] Update database berhasil dilakukan.`
      ]);
      setIsProcessing(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 font-sans">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-[#004a99] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Pancaran Command Center</h1>
            <p className="text-sm text-slate-500 font-medium">Patricia AI Dispatcher System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="relative cursor-pointer group">
            <Bell className="w-6 h-6 text-slate-400 group-hover:text-[#004a99]" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
            <span className="text-green-700 font-bold text-xs tracking-widest uppercase">Patricia Online</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6">
        
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Reminders
            </h3>
            <div className="space-y-4">
              {reminders.map(item => (
                <div key={item.id} className={`p-3 rounded-xl border-l-4 ${item.urgent ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}`}>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight mb-1">{item.task}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium italic"><AlertCircle className="w-2 h-2" /> {item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex-1">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#004a99]" /> Live Vendor Activity
              </h2>
              <span className="text-[10px] bg-blue-100 text-[#004a99] px-2 py-1 rounded font-bold uppercase">Real-Time via n8n</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-4">Vendor & Unit</th>
                    <th className="px-4 py-4">Nego Status</th>
                    <th className="px-4 py-4">Offered Price</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4"><p className="font-bold text-slate-800 text-sm">PT. Dunex</p><div className="flex gap-2 mt-1"><span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold italic">Wingbox</span></div></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold border border-amber-200"><MessageCircle className="w-3 h-3" /> Negotiating</span></td>
                    <td className="px-4 py-4"><p className="font-bold text-slate-900 tracking-tight text-sm">Rp 3.850.000</p><p className="text-[10px] text-slate-500 font-medium italic">Wants to negotiate</p></td>
                    <td className="px-4 py-4"><button className="text-[10px] font-bold text-[#004a99] hover:underline uppercase">Details</button></td>
                  </tr>
                  
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4"><p className="font-bold text-slate-800 text-sm">Puninar</p><div className="flex gap-2 mt-1"><span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold italic">Trailer</span></div></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold border border-green-200"><ShieldCheck className="w-3 h-3" /> Agreed</span></td>
                    <td className="px-4 py-4"><p className="font-bold text-slate-900 tracking-tight text-sm">Rp 4.200.000</p><p className="text-[10px] text-green-600 font-bold uppercase">Fixed (Nett)</p></td>
                    <td className="px-4 py-4"><button className="text-[10px] font-bold text-[#004a99] hover:underline uppercase">Details</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-[#004a99] px-6 py-4 flex items-center gap-3 shadow-md">
              <Bot className="w-6 h-6 text-white" />
              <h2 className="text-lg font-bold text-white tracking-tight uppercase text-sm">Dispatcher Panel</h2>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Armada</label>
                  <select value={fleetType} onChange={(e) => setFleetType(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-[#004a99] outline-none font-bold text-[#004a99]">
                    <option value="Wingbox">Wingbox</option><option value="Dump Truck">Dump Truck</option><option value="Trailer">Trailer</option><option value="Tronton">Tronton</option><option value="CDE">CDE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Jumlah</label>
                  <input type="number" value={unitCount} onChange={(e) => setUnitCount(e.target.value)} placeholder="Qty" className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-[#004a99] outline-none font-bold text-[#004a99]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1 uppercase tracking-wider"><Calendar className="w-3 h-3"/> Tanggal</label>
                  <input type="date" value={loadDate} onChange={(e) => setLoadDate(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-[#004a99] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1 uppercase tracking-wider"><Box className="w-3 h-3"/> Muatan</label>
                  <input type="text" value={cargoType} onChange={(e) => setCargoType(e.target.value)} placeholder="Jenis Brg" className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-[#004a99] outline-none font-bold text-[#004a99]" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1 uppercase tracking-wider"><MapPin className="w-3 h-3"/> Rute</label>
                <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} placeholder="Contoh: Jakarta - Surabaya" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#004a99] outline-none font-bold text-[#004a99]" />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-[10px] font-bold text-[#004a99] mb-1 uppercase tracking-wider">Strategi</label>
                  <select value={priceStrategy} onChange={(e) => setPriceStrategy(e.target.value)} className="w-full border border-blue-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:ring-2 focus:ring-[#004a99] outline-none bg-white uppercase">
                    <option>Nego Terbuka</option><option>Fix Harga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#004a99] mb-1 flex items-center gap-1 uppercase tracking-wider"><DollarSign className="w-3 h-3"/> Budget</label>
                  <input type="text" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} placeholder="3.5jt - 4jt" className="w-full border border-blue-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:ring-2 focus:ring-[#004a99] outline-none bg-white uppercase" />
                </div>
              </div>

              <button onClick={handleAssignAI} disabled={isProcessing} className={`w-full mt-2 font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 uppercase tracking-widest text-[11px] ${isProcessing ? 'bg-slate-400 text-slate-200 cursor-not-allowed' : 'bg-[#004a99] hover:bg-blue-900 text-white transform hover:-translate-y-1 active:scale-95'}`}>
                <Terminal className="w-4 h-4" />
                {isProcessing ? 'AI Agent Running...' : 'Tugaskan Patricia AI'}
              </button>
            </div>

            <div className="bg-[#0a0f1c] p-4 border-t-4 border-slate-800 h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
              {logs.map((log, index) => (
                <p key={index} className={index === 0 ? "text-slate-500 mb-2 border-b border-slate-800 pb-2" : "text-green-400 mb-1"}>
                  {log}
                </p>
              ))}
              {isProcessing && <p className="text-green-400 animate-pulse">{'>'} Processing...</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}