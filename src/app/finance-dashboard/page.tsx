"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, BadgeDollarSign, FileText, CheckCircle2, Calculator, FileCheck, Landmark, Receipt, Send, ShieldCheck, Database } from 'lucide-react';

type LedgerDetail = {
  desc: string;
  qty: number;
  leftValue: string;
  rightValue: string;
};

type LedgerItem = {
  id: string;
  partyName: string;
  ref: string;
  amount: string;
  status: string;
  type: string;
  dueDate: string;
  details: LedgerDetail[];
  notes: string;
};

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('ar'); 
  const [selectedItem, setSelectedItem] = useState<string | null>("INV-GG-01");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  
  const [logs, setLogs] = useState([
    "> Patricia Finance Core v3.0 (Connected to ERP)",
    "> Memantau data Ledger & Reconcile..."
  ]);

  const arData: LedgerItem[] = [
    { 
      id: "INV-GG-01", 
      partyName: "PT. GUDANG GARAM TBK", 
      ref: "PO-GG-260401", 
      amount: "Rp 45.000.000", 
      status: "Ready to Bill", 
      type: "Tagihan Project HMT", 
      dueDate: "Term: 30 Hari",
      details: [
        { desc: "Sewa 10 Unit Wingbox (Kediri - Jakarta)", qty: 10, leftValue: "Rp 4.500.000", rightValue: "Rp 45.000.000" }
      ],
      notes: "Dokumen POD telah divalidasi oleh AI Admin. Siap terbitkan e-Invoice & Faktur Pajak."
    },
    { 
      id: "INV-ULV-99", 
      partyName: "PT. UNILEVER INDONESIA", 
      ref: "ULV-REG-992", 
      amount: "Rp 12.500.000", 
      status: "Invoice Sent", 
      type: "Tagihan Reguler", 
      dueDate: "Term: 14 Hari",
      details: [
        { desc: "Pengiriman 15 CBM (Marunda - Bandung)", qty: 1, leftValue: "Rp 12.500.000", rightValue: "Rp 12.500.000" }
      ],
      notes: "Invoice telah dikirim ke portal ARIBA Unilever. Menunggu pembayaran."
    },
  ];

  const apData: LedgerItem[] = [
    { 
      id: "VEN-DNX-01", 
      partyName: "PT. DUNEX", 
      ref: "DO-VM-1029", 
      amount: "Rp 3.850.000", 
      status: "Match (Approved)", 
      type: "Tagihan Vendor", 
      dueDate: "Jatuh Tempo: Besok",
      details: [
        { desc: "Jasa Wingbox B 9901 TE", qty: 1, leftValue: "Rp 3.850.000", rightValue: "Rp 3.850.000" }
      ],
      notes: "Nilai tagihan Vendor COCOK dengan kesepakatan harga di sistem Dispatcher. Siap dibayar."
    },
    { 
      id: "VEN-PUN-05", 
      partyName: "PUNINAR LOGISTICS", 
      ref: "DO-VM-1031", 
      amount: "Rp 4.500.000", 
      status: "Discrepancy", 
      type: "Tagihan Vendor", 
      dueDate: "Jatuh Tempo: Lusa",
      details: [
        { desc: "Jasa Trailer B 8821 XX", qty: 1, leftValue: "Rp 4.500.000", rightValue: "Rp 4.200.000" }
      ],
      notes: "ANOMALI: Vendor menagih Rp 4.5Jt, sedangkan kesepakatan harga di sistem adalah Rp 4.2Jt. Tahan pembayaran."
    },
  ];

  const handleAIAction = () => {
    setIsProcessing(true);
    setCurrentStep(1); 
    setLogs([`> [1/4] Mengumpulkan data komponen biaya & pajak...`]);

    setTimeout(() => {
      setCurrentStep(2);
      setLogs(prev => [...prev, `> [2/4] Kalkulasi Subtotal, PPN 11%, dan PPh 23...`]);
    }, 1500);

    setTimeout(() => {
      setCurrentStep(3);
      setLogs(prev => [...prev, `> [3/4] Generasi Dokumen: PDF e-Invoice & Faktur Pajak terbentuk.`]);
    }, 3000);

    setTimeout(() => {
      setCurrentStep(4);
      setLogs(prev => [...prev, `> [4/4] Mengirim otomatis via Email & WhatsApp API ke Klien...`]);
    }, 4500);

    setTimeout(() => {
      setIsProcessing(false);
      setLogs(prev => [...prev, `> [SUKSES] Siklus penagihan selesai. Update Ledger ERP.`]);
    }, 5500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-[#004a99] hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">Finance AI Command</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <Landmark className="w-3 h-3"/> Auto-Invoicing & Reconciliation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-200">
          <BadgeDollarSign className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-emerald-700 font-black text-xs uppercase tracking-tighter">Finance Core ON</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
            <div className="flex p-2 bg-slate-100/50 m-4 rounded-2xl gap-2">
              <button 
                onClick={() => {setActiveTab('ar'); setSelectedItem("INV-GG-01"); setCurrentStep(0);}} 
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'ar' ? 'bg-[#004a99] text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
              >
                <Receipt className="w-4 h-4"/> Tagihan Klien (A/R)
              </button>
              <button 
                onClick={() => {setActiveTab('ap'); setSelectedItem("VEN-DNX-01"); setCurrentStep(0);}} 
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'ap' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
              >
                <Landmark className="w-4 h-4"/> Tagihan Vendor (A/P)
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto pt-0">
              <div className="grid grid-cols-1 gap-4">
                {(activeTab === 'ar' ? arData : apData).map(item => (
                  <div key={item.id} className={`rounded-2xl border-2 transition-all overflow-hidden ${selectedItem === item.id ? 'border-[#004a99] shadow-md' : 'border-slate-100 hover:border-blue-200'}`}>
                    
                    <div 
                      onClick={() => {setSelectedItem(item.id); setCurrentStep(0);}} 
                      className={`p-5 cursor-pointer flex items-center justify-between ${selectedItem === item.id ? 'bg-blue-50/30' : 'bg-white'}`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className={`p-3 rounded-xl ${item.status.includes('Discrepancy') ? 'bg-red-100 text-red-600' : item.status.includes('Sent') || item.status.includes('Approved') ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                           <BadgeDollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">{item.partyName}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ref: {item.ref}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <div className="text-sm font-black text-slate-800 mb-1 tracking-tight">
                           {item.amount}
                         </div>
                         <div className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-wider ${item.status.includes('Discrepancy') ? 'bg-red-50 text-red-700 border-red-200' : item.status.includes('Sent') || item.status.includes('Approved') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                           {item.status}
                         </div>
                      </div>
                    </div>

                    {selectedItem === item.id && (
                      <div className="bg-slate-50 border-t border-blue-100 p-5 animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-end mb-3">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rincian Ledger</h4>
                           <span className="text-[10px] font-bold text-[#004a99] bg-blue-100 px-2 py-0.5 rounded uppercase">{item.dueDate}</span>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-3">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-bold">
                              <tr>
                                <th className="px-3 py-2">Deskripsi Layanan</th>
                                <th className="px-3 py-2 text-center">Qty</th>
                                <th className="px-3 py-2 text-right">{activeTab === 'ar' ? 'Harga Satuan' : 'Tagihan Vendor'}</th>
                                <th className="px-3 py-2 text-right">{activeTab === 'ar' ? 'Subtotal' : 'Sistem Kita'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.details.map((det, idx) => (
                                <tr key={idx}>
                                  <td className="px-3 py-3 font-medium text-slate-700">{det.desc}</td>
                                  <td className="px-3 py-3 text-center font-bold">{det.qty}</td>
                                  <td className="px-3 py-3 text-right font-bold">{det.leftValue}</td>
                                  <td className={`px-3 py-3 text-right font-black ${item.status.includes('Discrepancy') ? 'text-red-600' : 'text-[#004a99]'}`}>
                                    {det.rightValue}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className={`p-3 rounded-xl border text-[10px] font-medium leading-relaxed ${item.status.includes('Discrepancy') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-[#004a99]'}`}>
                           <strong className="uppercase tracking-widest text-[9px] block mb-1">AI Audit Notes:</strong>
                           {item.notes}
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
                  <h2 className="text-white font-black text-sm uppercase tracking-widest">Finance Copilot</h2>
                  <p className="text-blue-200 text-[10px] font-bold">Smart Invoicing & Recon</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">AI Execution Pipeline</h4>
                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>
                  {[
                    { step: 1, label: "Data Aggregation", icon: <Database className="w-3 h-3"/>, desc: "Tarik data POD & Komponen Biaya" },
                    { step: 2, label: "Tax & Margin Calc", icon: <Calculator className="w-3 h-3"/>, desc: "Kalkulasi Pajak & PPN otomatis" },
                    { step: 3, label: "Document Gen", icon: <FileCheck className="w-3 h-3"/>, desc: "Pembuatan e-Invoice & e-Faktur" },
                    { step: 4, label: "Auto-Dispatch", icon: <Send className="w-3 h-3"/>, desc: "Kirim PDF ke WhatsApp Klien" }
                  ].map((stepItem) => (
                    <div key={stepItem.step} className="flex gap-4 items-start relative z-10">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= stepItem.step ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white border-slate-200 text-slate-300'}`}
                      >
                        {currentStep > stepItem.step ? <CheckCircle2 className="w-4 h-4"/> : stepItem.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wider ${currentStep >= stepItem.step ? 'text-slate-800' : 'text-slate-300'}`}>
                          {stepItem.label}
                        </p>
                        {currentStep === stepItem.step && (
                          <p className="text-[10px] text-blue-600 font-bold animate-pulse">{stepItem.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleAIAction} 
                  disabled={isProcessing} 
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 active:scale-95'}`}
                >
                  {activeTab === 'ar' ? <FileText className="w-4 h-4"/> : <ShieldCheck className="w-4 h-4"/>}
                  {isProcessing ? 'Memproses Ledger...' : activeTab === 'ar' ? 'Generate & Kirim Invoice' : 'Approve Pembayaran Vendor'}
                </button>
              </div>

              <div className="mt-auto">
                <div className="bg-[#0a0f1c] rounded-2xl p-4 h-32 overflow-y-auto font-mono text-[10px] shadow-inner border-t-4 border-emerald-500">
                  {logs.map((log, idx) => (
                    <div key={idx}>
                      <p className={log.includes('SUKSES') ? "text-green-400 mb-1" : "text-emerald-400 mb-1"}>
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