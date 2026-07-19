"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Briefcase, FileText, CheckCircle2, Calculator, TrendingUp, Mail, Map, Truck, BarChart3, Target } from 'lucide-react';

export default function CommercialDashboard() {
  const [selectedLead, setSelectedLead] = useState<string | null>("LEAD-WIKA-01");
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  
  const [logs, setLogs] = useState([
    "> Patricia Commercial Core v2.0",
    "> Memantau kotak masuk (Email/WA) untuk Inquiry baru..."
  ]);

  const leadsData = [
    { 
      id: "LEAD-WIKA-01", 
      company: "PT. WIJAYA KARYA (Persero)", 
      project: "Proyek Infrastruktur IKN", 
      route: "Jakarta - Balikpapan (Via RoRo)", 
      fleet: "20x Tronton Losbak", 
      status: "New Inquiry", 
      date: "Hari ini, 08:30 WIB",
      details: {
        distance: "1.540 KM (Est. Darat + Laut)",
        cargo: "Tiang Pancang & Besi Beton",
        targetPrice: "Belum ditentukan",
        notes: "Klien meminta penawaran harga secepatnya untuk pengiriman bulan depan. Butuh kalkulasi rute multimoda."
      }
    },
    { 
      id: "LEAD-IDM-09", 
      company: "PT. INDOMARCO PRISMATAMA", 
      project: "Distribusi Reguler Jabar", 
      route: "DC Purwakarta - All Gerai Bandung", 
      fleet: "5x CDD Box", 
      status: "Quoted", 
      date: "Kemarin",
      details: {
        distance: "Radius 80 KM",
        cargo: "FMCG / Retail Goods",
        targetPrice: "Rp 1.200.000 / Ritase",
        notes: "Quotation #Q-2604-099 telah dikirimkan ke tim Procurement Indomaret. Menunggu persetujuan (SLA 3 hari)."
      }
    },
  ];

  const handleAICosting = () => {
    setIsCalculating(true);
    setCurrentStep(1); 
    setLogs([`> [1/4] Mengekstrak rute & membaca tarif dasar (BBM, Tol, Kapal)...`]);

    setTimeout(() => {
      setCurrentStep(2);
      setLogs(prev => [...prev, `> [2/4] Kalkulasi HPP: Base Cost Rp 18.5 Jt / Unit.`]);
    }, 2000);

    setTimeout(() => {
      setCurrentStep(3);
      setLogs(prev => [...prev, `> [3/4] Menerapkan Margin Komersial (Profit 20%) -> Rp 22.2 Jt.`]);
    }, 3500);

    setTimeout(() => {
      setCurrentStep(4);
      setLogs(prev => [...prev, `> [4/4] Generate PDF Quotation & Draft Email ke WIKA...`]);
    }, 5000);

    setTimeout(() => {
      setIsCalculating(false);
      setLogs(prev => [...prev, `> [SUKSES] Penawaran Harga siap dikirim oleh Sales Manager.`]);
    }, 6500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-[#004a99] hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">Commercial AI Command</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-3 h-3"/> AI Costing & Pricing Strategy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-purple-50 px-5 py-2.5 rounded-full border border-purple-200">
          <Briefcase className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-purple-700 font-black text-xs uppercase tracking-tighter">Sales Agent ON</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                <Target className="w-4 h-4 text-[#004a99]"/> Sales Pipeline (Inquiries)
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                {leadsData.map(lead => (
                  <div key={lead.id} className={`rounded-2xl border-2 transition-all overflow-hidden ${selectedLead === lead.id ? 'border-[#004a99] shadow-md' : 'border-slate-100 hover:border-purple-200'}`}>
                    
                    <div 
                      onClick={() => {setSelectedLead(lead.id); setCurrentStep(0);}} 
                      className={`p-5 cursor-pointer flex items-center justify-between ${selectedLead === lead.id ? 'bg-purple-50/30' : 'bg-white'}`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className={`p-3 rounded-xl ${lead.status === 'New Inquiry' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                           <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">{lead.company}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{lead.project}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <div className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-wider mb-1 ${lead.status === 'New Inquiry' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                           {lead.status}
                         </div>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{lead.date}</p>
                      </div>
                    </div>

                    {selectedLead === lead.id && (
                      <div className="bg-slate-50 border-t border-purple-100 p-5 animate-in slide-in-from-top-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Detail Permintaan (RFP)</h4>
                        
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Rute Pengiriman</p>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Map className="w-3 h-3 text-[#004a99]"/> {lead.route}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Kebutuhan Armada</p>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Truck className="w-3 h-3 text-[#004a99]"/> {lead.fleet}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Jarak Estimasi</p>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-[#004a99]"/> {lead.details.distance}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Jenis Kargo</p>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-[#004a99]"/> {lead.details.cargo}</p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl border bg-white border-slate-200 text-[10px] font-medium leading-relaxed text-slate-600 shadow-sm">
                           <strong className="uppercase tracking-widest text-[9px] block mb-1 text-slate-400">Catatan Sales:</strong>
                           {lead.details.notes}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-[#004a99] p-6">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-white font-black text-sm uppercase tracking-widest">Pricing Copilot</h2>
                  <p className="text-purple-200 text-[10px] font-bold">Auto-Costing & Margin Analysis</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">AI Calculation Pipeline</h4>
                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>
                  {[
                    { step: 1, label: "Route & Distance Analysis", icon: <Map className="w-3 h-3"/>, desc: "Pemetaan rute & tarif tol/kapal" },
                    { step: 2, label: "Base Cost (HPP) Engine", icon: <Calculator className="w-3 h-3"/>, desc: "Kalkulasi modal dasar operasional" },
                    { step: 3, label: "Margin & Pricing Strategy", icon: <BarChart3 className="w-3 h-3"/>, desc: "Penambahan rasio profit perusahaan" },
                    { step: 4, label: "Quotation Generation", icon: <FileText className="w-3 h-3"/>, desc: "Mencetak draf penawaran resmi" }
                  ].map((stepItem) => (
                    <div key={stepItem.step} className="flex gap-4 items-start relative z-10">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= stepItem.step ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'bg-white border-slate-200 text-slate-300'}`}
                      >
                        {currentStep > stepItem.step ? <CheckCircle2 className="w-4 h-4"/> : stepItem.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wider ${currentStep >= stepItem.step ? 'text-slate-800' : 'text-slate-300'}`}>
                          {stepItem.label}
                        </p>
                        {currentStep === stepItem.step && (
                          <p className="text-[10px] text-purple-600 font-bold animate-pulse">{stepItem.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleAICosting} 
                  disabled={isCalculating || selectedLead === "LEAD-IDM-09"} 
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${isCalculating || selectedLead === "LEAD-IDM-09" ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 active:scale-95'}`}
                >
                  <Calculator className="w-4 h-4"/> 
                  {isCalculating ? 'Menganalisis Harga...' : selectedLead === "LEAD-IDM-09" ? 'Quotation Sudah Terkirim' : 'Jalankan AI Costing Engine'}
                </button>
              </div>

              <div className="mt-auto">
                <div className="bg-[#0a0f1c] rounded-2xl p-4 h-32 overflow-y-auto font-mono text-[10px] shadow-inner border-t-4 border-purple-500">
                  {logs.map((log, idx) => (
                    <div key={idx}>
                      <p className={log.includes('SUKSES') ? "text-green-400 mb-1" : "text-purple-400 mb-1"}>
                        {log}
                      </p>
                    </div>
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