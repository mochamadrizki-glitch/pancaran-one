'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default function FleetPage() {
  const [armada, setArmada] = useState<any[]>([]);
  const [form, setForm] = useState({ jenis_truk: '', lokasi: '', jumlah: 0 });

  const jenisArmadaPancaran = [
    'CDE Bak', 'CDE Box', 'CDD Bak', 'CDD Box', 'CDD Wingbox',
    'Fuso Bak', 'Fuso Box', 'Tronton Bak', 'Tronton Wingbox',
    'Wingbox', 'Trailer 20FT', 'Trailer 40FT'
  ];

  // 1. Ambil Data Real-time
  useEffect(() => {
    const q = query(collection(db, "DATA_STOK_ARMADA"));
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setArmada(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi Update Stok Cepat (+ / -)
  const adjustAmount = async (item: any, delta: number) => {
    const newAmount = Math.max(0, (item.jumlah || 0) + delta);
    await setDoc(doc(db, "DATA_STOK_ARMADA", item.id), {
      ...item,
      jumlah: newAmount,
      updatedAt: serverTimestamp()
    });
  };

  // 3. Simpan Manual dari Form (Upsert Logic)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jenis_truk || !form.lokasi) return alert("Pilih Jenis Truk dan Lokasi!");
    
    // Normalisasi ID agar tidak ada duplikat Jakarta vs JAKARTA
    const cleanTruk = form.jenis_truk.toLowerCase().replace(/\s+/g, '_');
    const cleanLokasi = form.lokasi.trim().toLowerCase().replace(/\s+/g, '_');
    const customId = `${cleanTruk}_${cleanLokasi}`;

    try {
      await setDoc(doc(db, "DATA_STOK_ARMADA", customId), {
        jenis_truk: form.jenis_truk,
        lokasi: form.lokasi.toUpperCase(), // Kita simpan dengan huruf besar agar rapi di tabel
        jumlah: Math.max(0, Number(form.jumlah)),
        updatedAt: serverTimestamp()
      });
      setForm({ jenis_truk: '', lokasi: '', jumlah: 0 });
      alert("Data Berhasil Diperbarui!");
    } catch (error) { alert("Gagal update data"); }
  };

  // 4. --- TOMBOL SUNTIK DATA DUMMY (TETAP ADA & ANTI DUPLIKAT) ---
  const suntikStokDummy = async () => {
    const dummy = [
      { jenis_truk: 'CDD Box', lokasi: 'JAKARTA', jumlah: 12 },
      { jenis_truk: 'Wingbox', lokasi: 'JAKARTA', jumlah: 5 },
      { jenis_truk: 'Tronton Wingbox', lokasi: 'SURABAYA', jumlah: 8 },
      { jenis_truk: 'CDE Bak', lokasi: 'BANDUNG', jumlah: 15 },
      { jenis_truk: 'Fuso Box', lokasi: 'SEMARANG', jumlah: 10 },
    ];

    try {
      for (const d of dummy) { 
        const cleanTruk = d.jenis_truk.toLowerCase().replace(/\s+/g, '_');
        const cleanLokasi = d.lokasi.toLowerCase().replace(/\s+/g, '_');
        const customId = `${cleanTruk}_${cleanLokasi}`;
        
        await setDoc(doc(db, "DATA_STOK_ARMADA", customId), { 
          ...d, 
          updatedAt: serverTimestamp() 
        }); 
      }
      alert("7 Data Dummy Berhasil Disinkronkan!");
    } catch (e) { alert("Gagal suntik data"); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#233762]">🚚 DATA_STOK_ARMADA</h1>
          <p className="text-gray-500 mt-1">Kelola stok unit Pancaran One dengan sistem anti-duplikat.</p>
        </div>
        
        {/* Tombol Dummy Tetap Dipertahankan */}
        <button 
          onClick={suntikStokDummy} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          ⚡ Suntik Data Dummy
        </button>
      </div>

      {/* FORM INPUT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Input / Update Stok</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
            value={form.jenis_truk}
            onChange={e => setForm({...form, jenis_truk: e.target.value})}
          >
            <option value="">-- Pilih Jenis Truk --</option>
            {jenisArmadaPancaran.map((truk) => <option key={truk} value={truk}>{truk}</option>)}
          </select>

          <input 
            placeholder="Lokasi (Contoh: Jakarta)" 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
            value={form.lokasi} 
            onChange={e => setForm({...form, lokasi: e.target.value})} 
          />
          
          <input 
            type="number" 
            min="0"
            className="p-3 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center" 
            value={form.jumlah} 
            onChange={e => setForm({...form, jumlah: Number(e.target.value)})} 
          />
          
          <button type="submit" className="bg-[#233762] text-white rounded-xl font-bold hover:bg-blue-800 transition shadow-md">
            Update Data Fisik
          </button>
        </form>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
            <tr>
              <th className="p-4">Jenis Armada</th>
              <th className="p-4 text-center">Lokasi Pool</th>
              <th className="p-4 text-center">Jumlah Ready</th>
              <th className="p-4 text-center">Quick Adjust</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {armada.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Belum ada data. Silakan suntik data dummy di atas.</td></tr>
            ) : (
              armada.sort((a,b) => a.lokasi.localeCompare(b.lokasi)).map(a => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{a.jenis_truk.includes('Wingbox') ? '🚛' : '🚚'}</span>
                      <span className="font-bold text-[#233762]">{a.jenis_truk}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-[11px] uppercase border border-slate-200">
                      {a.lokasi}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`text-2xl font-black ${a.jumlah > 0 ? 'text-[#233762]' : 'text-red-400'}`}>
                      {a.jumlah} <span className="text-[10px] text-gray-300 font-bold uppercase">Unit</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      <button 
                        onClick={() => adjustAmount(a, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => adjustAmount(a, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-green-50 text-green-600 font-bold hover:bg-green-500 hover:text-white transition-all shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteDoc(doc(db, "DATA_STOK_ARMADA", a.id))} className="text-slate-300 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}