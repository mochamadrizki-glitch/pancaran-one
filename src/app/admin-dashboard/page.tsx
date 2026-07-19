"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Circle, ScanSearch, Database, FileCheck, FileSignature, UploadCloud, CheckCircle2, ShieldCheck, Server, User, Truck, Calendar, Package, FileText, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDoc, setSelectedDoc] = useState<string | null>("DOC-GG-01");
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  
  const [logs, setLogs] = useState([
    "Patricia OCR Vision v1.4 (Ready)",
    "> Menunggu dokumen POD untuk dipindai..."
  ]);

  // DATA DOKUMEN DENGAN DETAIL LENGKAP
  const pendingDocs = [
    { 
      id: "DOC-GG-01", po: "PO-GG-260401", customer: "PT. GUDANG GARAM TBK", nopol: "B 9901 TE", 
      type: "Surat Jalan (SJP)", status: "Uploaded", time: "10 menit lalu", anomaly: false,
      driver: "Budi Santoso", phone: "0815-xxxx", date: "24 April 2026", cargo: "10 Pallet (FMCG)",
      notes: "Foto dokumen jernih. Siap untuk proses OCR dan validasi ERP."
    },
    { 
      id: "DOC-MYR-08", po: "MYR-2026-X8", customer: "PT. MAYORA INDAH TBK", nopol: "B 8821 XX", 
      type: "BAST & Surat Jalan", status: "Needs Review", time: "1 jam lalu", anomaly: true,
      driver: "Andi Wijaya", phone: "0812-xxxx", date: "23 April 2026", cargo: "4 Pallet (Biskuit)",
      notes: "Anomali terdeteksi: Tanda tangan penerima buram atau terpotong."
    },
  ];

  const syncedDocs = [
    { 
      id: "DOC-ULV-99", po: "ULV-REG-992", customer: "PT. UNILEVER INDONESIA", nopol: "D 8812 XX", 
      type: "e-POD Digital", status: "ERP Synced", time: "Kemarin", anomaly: false,
      driver: "Jajang", phone: "0877-xxxx", date: "22 April 2026", cargo: "15 CBM (Consumer Goods)",
      notes: "Data telah disinkronkan ke sistem pusat. Invoicing dapat diterbitkan."
    },
  ];

  const handleAIScan = () => {
    setIsScanning(true);
    setCurrentStep(1); 
    setLogs([`> [1/4] Menerima berkas digital dari Driver App...`]);

    setTimeout(() => {
      setCurrentStep(2);
      setLogs(prev => [...prev, `> [2/4] Menjalankan OCR Vision... Mengekstrak Teks & Stempel...`]);
    }, 1500);

    setTimeout(() => {
      setCurrentStep(3);
      setLogs(prev => [...prev, `> [3/4] Validasi: Cocok dengan Data PO (MATCH).`]);
    }, 3000);

    setTimeout(() => {
      setCurrentStep(4);
      setLogs(prev => [...prev, `> [4/4] Mengirim data ke ERP Pancaran... Sinkronisasi Berhasil.`]);
    }, 4500);

    setTimeout(() => {
      setIsScanning(false);
      setLogs(prev => [...prev, `> [SUKSES] Dokumen ${selectedDoc} kini berstatus ERP SYNCED.`]);
    }, 5500);
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
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">Admin AI Command</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <Database className="w-3 h-3"/> ERP Document Visibility
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-200">
          <ScanSearch className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span className="text-indigo-700 font-black text-xs uppercase tracking-tighter">OCR Visibility ON</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: LIST DOKUMEN DENGAN DETAIL EXPANDABLE */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
            <div className="flex p-2 bg-slate-100/50 m-4 rounded-2xl gap-2">
              <button onClick={() => {setActiveTab('pending'); setCurrentStep(0);}} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'pending' ? 'bg-[#004a99] text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>
                Pending OCR
              </button>
              <button onClick={() => setActiveTab('synced')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'synced' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>
                ERP Synced
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto pt-0">
              <div className="grid grid-cols-1 gap-4">
                {(activeTab === 'pending' ? pendingDocs : syncedDocs).map(doc => (
                  <div key={doc.id} className={`rounded-2xl border-2 transition-all overflow-hidden ${selectedDoc === doc.id ? 'border-[#004a99] shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}>
                    
                    {/* BAGIAN ATAS (SELALU MUNCUL) */}
                    <div onClick={() => {setSelectedDoc(doc.id); setCurrentStep(0);}} className={`p-5 cursor-pointer flex items-center justify-between ${selectedDoc === doc.id ? 'bg-indigo-50/30' : 'bg-white'}`}>
                      <div className="flex gap-4 items-center">
                        <div className={`p-3 rounded-xl ${doc.status === 'ERP Synced' ? 'bg-green-100' : doc.anomaly ? 'bg-red-100' : 'bg-amber-100'}`}>
                           <FileSignature className={`w-5 h-5 ${doc.status === 'ERP Synced' ? 'text-green-600' : doc.anomaly ? 'text-red-600' : 'text-amber-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm md:text-base">{doc.customer}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PO: {doc.po}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <div className={`text-[10px] font-black px-2 py-1 rounded mb-1 border uppercase tracking-wider ${doc.status === 'ERP Synced' ? 'bg-green-50 text-green-700 border-green-200' : doc.anomaly ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                           {doc.status}
                         </div>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{doc.time}</p>
                      </div>
                    </div>

                    {/* BAGIAN EXPANDED (MUNCUL JIKA DIKLIK) - DETAIL DOKUMEN */}
                    {selectedDoc === doc.id && (
                      <div className="bg-slate-50 border-t border-indigo-100 p-5 animate-in slide-in-from-top-2 flex flex-col md:flex-row gap-5">
                        
                        {/* Thumbnail Dokumen Kiri */}
                        <div className="w-full md:w-32 h-40 bg-slate-200 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group">
                           <FileText className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center px-2">Lihat<br/>Foto SJP</span>
                           {doc.anomaly && <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1"><AlertTriangle className="w-3 h-3 text-white"/></div>}
                        </div>

                        {/* Rincian Kanan */}
                        <div className="flex-1 space-y-3">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Rincian Pengiriman</h4>
                           
                           <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                             <div>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Pengemudi</p>
                               <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><User className="w-3 h-3 text-[#004a99]"/> {doc.driver}</p>
                             </div>
                             <div>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Nomor Polisi</p>
                               <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Truck className="w-3 h-3 text-[#004a99]"/> {doc.nopol}</p>
                             </div>
                             <div>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Tanggal Bongkar</p>
                               <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#004a99]"/> {doc.date}</p>
                             </div>
                             <div>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Muatan Fisik</p>
                               <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Package className="w-3 h-3 text-[#004a99]"/> {doc.cargo}</p>
                             </div>
                           </div>

                           <div className={`mt-2 p-3 rounded-xl border text-[10px] font-medium leading-relaxed ${doc.anomaly ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-[#004a99]'}`}>
                             <strong className="uppercase tracking-widest text-[9px] block mb-1">Catatan Sistem:</strong>
                             {doc.notes}
                           </div>
                        </div>

                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: AI PROCESS VISIBILITY (TETAP SAMA) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-[#004a99] p-6">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-white" />
                <div><h2 className="text-white font-black text-sm uppercase tracking-widest">Admin Copilot</h2><p className="text-blue-200 text-[10px] font-bold">Patricia OCR Vision v2</p></div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">AI Processing Pipeline</h4>
                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>
                  {[
                    { step: 1, label: "Driver Upload", icon: <UploadCloud className="w-3 h-3"/>, desc: "Menerima berkas dari Driver App" },
                    { step: 2, label: "AI OCR Scan", icon: <ScanSearch className="w-3 h-3"/>, desc: "Membaca teks & validasi stempel" },
                    { step: 3, label: "Validation", icon: <ShieldCheck className="w-3 h-3"/>, desc: "Mencocokkan data vs Database" },
                    { step: 4, label: "ERP Sync", icon: <Server className="w-3 h-3"/>, desc: "Sinkronisasi ke sistem pusat" }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start relative z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= item.step ? 'bg-green-500 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-white border-slate-200 text-slate-300'}`}>
                        {currentStep > item.step ? <CheckCircle2 className="w-4 h-4"/> : item.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wider ${currentStep >= item.step ? 'text-slate-800' : 'text-slate-300'}`}>{item.label}</p>
                        {currentStep === item.step && <p className="text-[10px] text-blue-600 font-bold animate-pulse">{item.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleAIScan} disabled={isScanning || activeTab === 'synced'} className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${isScanning || activeTab === 'synced' ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 active:scale-95'}`}>
                  <ScanSearch className="w-4 h-4"/> {isScanning ? 'Processing Step ' + currentStep + '...' : 'Jalankan AI OCR Verifier'}
                </button>
              </div>

              <div className="mt-auto">
                <div className="bg-[#0a0f1c] rounded-2xl p-4 h-32 overflow-y-auto font-mono text-[10px] shadow-inner border-t-4 border-indigo-500">
                  {logs.map((log, idx) => (
                    <p key={idx} className={log.includes('SUKSES') ? "text-green-400 mb-1" : "text-indigo-400 mb-1"}>{`> ${log}`}</p>
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