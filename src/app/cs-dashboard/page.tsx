"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList, Bot, CheckCircle2, ArrowRight, FileText, LayoutGrid, Zap, MapPin, Truck, User, Clock, ShieldAlert } from 'lucide-react';

export default function CSDashboard() {
  const router = useRouter(); 
  const [activeCategory, setActiveCategory] = useState('non-reg');
  const [selectedOrder, setSelectedOrder] = useState<string | null>("HMT-10029");
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([
    "CS AI Core v2.0 (Production Level)",
    "> Live Sync: Tracking Per-Unit Tracking Data..."
  ]);

  // DATA STRUKTUR ENTERPRISE: Memisahkan Level Order dan Level Unit (Truk)
  const nonRegOrders = [
    { 
      id: "HMT-10029", customer: "PT. GUDANG GARAM TBK", po: "PO-GG-260401", origin: "Kediri", dest: "Jakarta", 
      fleet: "Wingbox", qty: 3, cargo: "Rokok/FMCG", status: "Partial Transit", time: "Update 5 mnt lalu",
      pic: "Pak Anton (0812xxx)",
      units: [
        { unitId: "1/3", nopol: "B 9901 TE", driver: "Budi Santoso", phone: "0815-xxxx", status: "In Transit", location: "Tol Cipali KM 102", step: 4 },
        { unitId: "2/3", nopol: "B 9902 TE", driver: "Andi Wijaya", phone: "0812-xxxx", status: "Loading", location: "Pabrik GG Kediri", step: 3 },
        { unitId: "3/3", nopol: "Menunggu Vendor", driver: "-", phone: "-", status: "Queue Pooling", location: "Menunggu Alokasi", step: 1 }
      ]
    },
    { 
      id: "HMT-10031", customer: "PT. MAYORA INDAH TBK", po: "MYR-2026-X8", origin: "Tangerang", dest: "Semarang", 
      fleet: "Trailer", qty: 2, cargo: "Makanan Ringan", status: "Queue", time: "2 jam lalu",
      pic: "Ibu Siska",
      units: [
        { unitId: "1/2", nopol: "Menunggu Vendor", driver: "-", phone: "-", status: "Queue Pooling", location: "-", step: 1 },
        { unitId: "2/2", nopol: "Menunggu Vendor", driver: "-", phone: "-", status: "Queue Pooling", location: "-", step: 1 }
      ]
    },
  ];

  const regOrders = [
    { 
      id: "REG-ULV-01", customer: "PT. UNILEVER INDONESIA", po: "ULV-REG-992", origin: "Marunda", dest: "Bandung", 
      fleet: "CDE", qty: 2, cargo: "Consumer Goods", status: "In Transit", time: "Hari Ini",
      pic: "Bpk. Rahmat",
      units: [
        { unitId: "1/2", nopol: "D 8812 XX", driver: "Jajang", phone: "0877-xxxx", status: "Unloading", location: "DC Gedebage", step: 5 },
        { unitId: "2/2", nopol: "D 8813 XX", driver: "Asep", phone: "0878-xxxx", status: "In Transit", location: "Tol Cipularang KM 90", step: 4 }
      ]
    },
  ];

  const handleAIAssist = () => {
    setIsProcessing(true);
    const targetOrder = activeCategory === 'non-reg' ? nonRegOrders.find(o => o.id === selectedOrder) : regOrders.find(o => o.id === selectedOrder);
    
    setLogs(prev => [
      ...prev,
      `> Mengkompilasi status dari ${targetOrder?.qty} unit armada...`,
      `> [Unit 1]: ${targetOrder?.units[0]?.status} | [Unit 2]: ${targetOrder?.units[1]?.status}`,
      `> Menyusun laporan komprehensif untuk dikirim ke ${targetOrder?.customer}...`,
    ]);
    setTimeout(() => {
      setLogs(prev => [...prev, `> [SUKSES] Draft Laporan Per-Unit siap dikirim via WA.`]);
      setIsProcessing(false);
    }, 2500);
  };

  const handlePushToVM = () => {
    const targetOrder = activeCategory === 'non-reg' ? nonRegOrders.find(o => o.id === selectedOrder) : regOrders.find(o => o.id === selectedOrder);
    if (targetOrder) {
      const params = new URLSearchParams({
        fleet: targetOrder.fleet,
        qty: targetOrder.qty.toString(),
        cargo: targetOrder.cargo,
        route: `${targetOrder.origin} - ${targetOrder.dest}`
      });
      router.push(`/vm-dashboard?${params.toString()}`);
    }
  };

  // Fungsi Pembantu Warna Status Progress
  const getStepColor = (currentStep: number, targetStep: number) => {
    if (currentStep > targetStep) return 'bg-green-500';
    if (currentStep === targetStep) return 'bg-blue-500 animate-pulse';
    return 'bg-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-[#004a99] hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">CS AI Command</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <LayoutGrid className="w-3 h-3"/> Enterprise Unit Tracker
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-green-50 px-5 py-2.5 rounded-full border border-green-200">
          <Zap className="w-4 h-4 text-green-600 animate-pulse" />
          <span className="text-green-700 font-black text-xs uppercase tracking-tighter">System Online</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: LIST ORDER & PER-UNIT DETAIL */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
            
            <div className="flex p-2 bg-slate-100/50 m-4 rounded-2xl gap-2">
              <button onClick={() => setActiveCategory('non-reg')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeCategory === 'non-reg' ? 'bg-[#004a99] text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>
                Order Non-Reguler
              </button>
              <button onClick={() => setActiveCategory('reguler')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeCategory === 'reguler' ? 'bg-[#004a99] text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>
                ILS (Reguler)
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto pt-0">
              <div className="grid grid-cols-1 gap-4">
                {(activeCategory === 'non-reg' ? nonRegOrders : regOrders).map(order => (
                  <div key={order.id} className={`rounded-2xl border-2 transition-all overflow-hidden ${selectedOrder === order.id ? 'border-[#004a99] shadow-md' : 'border-slate-100 hover:border-blue-200'}`}>
                    
                    {/* SUMMARY LEVEL ORDER */}
                    <div onClick={() => setSelectedOrder(order.id)} className={`p-5 cursor-pointer flex items-center justify-between ${selectedOrder === order.id ? 'bg-blue-50/30' : 'bg-white'}`}>
                      <div className="flex gap-4 items-center">
                        <div className={`p-3 rounded-xl ${order.status === 'Queue' ? 'bg-amber-100' : 'bg-[#004a99]'}`}>
                           <ClipboardList className={`w-5 h-5 ${order.status === 'Queue' ? 'text-amber-600' : 'text-white'}`} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm md:text-base">{order.customer}</h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-wider">
                            <span>{order.origin}</span> <ArrowRight className="w-3 h-3 text-[#004a99]"/> <span>{order.dest}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <div className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-1 rounded mb-1 uppercase tracking-wider border border-slate-200">
                           {order.qty}x {order.fleet}
                         </div>
                         <div className="text-[10px] font-bold bg-blue-100 text-[#004a99] px-2 py-0.5 rounded uppercase">
                           {order.status}
                         </div>
                      </div>
                    </div>

                    {/* DETAIL PER-UNIT (TRUK) */}
                    {selectedOrder === order.id && (
                      <div className="bg-slate-50 border-t border-blue-100 p-5 animate-in slide-in-from-top-2">
                        
                        <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                          <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            <Truck className="w-4 h-4"/> Rincian Status Per-Unit ({order.qty} Armada)
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">PO: {order.po}</p>
                        </div>

                        <div className="space-y-3">
                          {order.units.map((unit, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                              
                              {/* Info Truk & Driver */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-slate-800 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Unit {unit.unitId}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${unit.step === 1 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                    {unit.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-bold">
                                    <ClipboardList className="w-3 h-3 text-slate-400"/> {unit.nopol}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-bold">
                                    <User className="w-3 h-3 text-slate-400"/> {unit.driver}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#004a99] font-bold col-span-2 mt-1 bg-blue-50/50 p-1 rounded">
                                    <MapPin className="w-3 h-3"/> {unit.location}
                                  </div>
                                </div>
                              </div>

                              {/* Progress Bar (Visual Tracker) */}
                              <div className="flex-1 flex flex-col justify-center min-w-[200px]">
                                <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">
                                  <span>Queue</span><span>Assign</span><span>Load</span><span>Transit</span><span>Unload</span>
                                </div>
                                <div className="flex items-center justify-between relative">
                                  {/* Garis Latar */}
                                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0"></div>
                                  {/* Titik Progress */}
                                  {[1, 2, 3, 4, 5].map((stepNumber) => (
                                    <div key={stepNumber} className={`relative z-10 w-3 h-3 rounded-full border-2 border-white shadow-sm ${getStepColor(unit.step, stepNumber)}`}></div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: AI COPILOT */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-[#004a99] p-6">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-white" />
                <div><h2 className="text-white font-black text-sm uppercase tracking-widest">CS Copilot</h2><p className="text-blue-200 text-[10px] font-bold">Multi-Unit Analyzer v2</p></div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">AI Analysis</h4>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-medium">
                   Patricia dapat merangkum posisi seluruh unit armada ke dalam satu laporan rapi untuk dikirimkan ke WhatsApp pelanggan.
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleAIAssist} disabled={isProcessing} className="w-full py-4 bg-blue-50 text-[#004a99] rounded-2xl font-black text-[11px] uppercase tracking-wider border-2 border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4"/> {isProcessing ? 'Kompilasi Laporan...' : 'Generate Laporan Per-Unit'}
                </button>
                <button onClick={handlePushToVM} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center gap-2">Alokasi Unit ke Vendor <ArrowRight className="w-4 h-4"/></span>
                  <div className="absolute inset-0 bg-blue-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </div>

              <div className="mt-auto">
                <div className="bg-[#0a0f1c] rounded-2xl p-4 h-44 overflow-y-auto font-mono text-[10px] shadow-inner border-t-4 border-blue-500">
                  {logs.map((log, idx) => (
                    <p key={idx} className={idx === 0 ? "text-slate-500 mb-2 pb-2 border-b border-slate-800" : "text-cyan-400 mb-1"}>{`> ${log}`}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}