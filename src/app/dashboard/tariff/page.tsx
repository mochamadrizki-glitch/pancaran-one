'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
// PERUBAHAN: Mengganti addDoc menjadi setDoc di import
import { collection, onSnapshot, query, setDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default function TariffPage() {
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [form, setForm] = useState({ origin: '', destination: '', price: '', type: '' });

  // 1. AMBIL DATA REAL-TIME (Hanya untuk Membaca Data)
  useEffect(() => {
    const q = query(collection(db, "DATA_TARIF"));
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setTariffs(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. FUNGSI SIMPAN MANUAL DARI FORM (ANTI-DUPLIKAT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.price || !form.type) return alert("Mohon isi semua kolom!");
    
    // Mencegah duplikat dengan membuat ID dari Asal + Tujuan + Tipe
    const cleanOrigin = form.origin.toLowerCase().trim().replace(/\s+/g, '_');
    const cleanDestination = form.destination.toLowerCase().trim().replace(/\s+/g, '_');
    const cleanType = form.type.toLowerCase().trim().replace(/\s+/g, '_');
    const customId = `${cleanOrigin}_${cleanDestination}_${cleanType}`;

    try {
      // Menggunakan setDoc agar data tertimpa jika ID nya sama
      await setDoc(doc(db, "DATA_TARIF", customId), {
        ...form,
        updatedAt: serverTimestamp()
      });
      setForm({ origin: '', destination: '', price: '', type: '' });
      alert("Tarif Berhasil Disimpan / Diupdate!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    }
  };

  // 3. FUNGSI HAPUS DATA
  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus tarif rute ini?")) {
      await deleteDoc(doc(db, "DATA_TARIF", id));
    }
  };

  // 4. FUNGSI SUNTIK DATA DUMMY (ANTI-DUPLIKAT)
  const suntikDataDummy = async () => {
    const dummyData = [
      { origin: 'Jakarta', destination: 'Surabaya', type: 'Wingbox', price: '7500000' },
      { origin: 'Jakarta', destination: 'Bandung', type: 'CDD Box', price: '1800000' },
      { origin: 'Semarang', destination: 'Surabaya', type: 'Tronton', price: '4200000' },
      { origin: 'Medan', destination: 'Pekanbaru', type: 'Fuso Bak', price: '5500000' },
      { origin: 'Bekasi', destination: 'Cilegon', type: 'CDE Bak', price: '1200000' },
      { origin: 'Jakarta', destination: 'Semarang', type: 'Wingbox', price: '4500000' },
      { origin: 'Surabaya', destination: 'Malang', type: 'CDD Box', price: '1500000' },
    ];

    try {
      for (const data of dummyData) {
        // Buat ID unik juga saat nyuntik dummy
        const cleanOrigin = data.origin.toLowerCase().trim().replace(/\s+/g, '_');
        const cleanDestination = data.destination.toLowerCase().trim().replace(/\s+/g, '_');
        const cleanType = data.type.toLowerCase().trim().replace(/\s+/g, '_');
        const customId = `${cleanOrigin}_${cleanDestination}_${cleanType}`;

        await setDoc(doc(db, "DATA_TARIF", customId), {
          ...data,
          updatedAt: serverTimestamp()
        });
      }
      alert("7 Data Dummy Berhasil Disinkronkan (Anti-Duplikat)!");
    } catch (e) {
      alert("Gagal suntik data");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* HEADER & TOMBOL SUNTIK */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#233762]">💰 Manajemen DATA_TARIF</h1>
          <p className="text-gray-500 text-sm mt-1">Atur tarif rute logistik untuk respon otomatis Patricia AI.</p>
        </div>
        
        {/* Tombol Oranye diletakkan di sini agar mudah terlihat */}
        <button 
          onClick={suntikDataDummy}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          ⚡ Suntik Data Dummy
        </button>
      </div>

      {/* FORM INPUT TARIF */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Input Tarif Baru</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input 
            type="text" placeholder="Asal (Contoh: Jakarta)" 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={form.origin} onChange={e => setForm({...form, origin: e.target.value})}
          />
          <input 
            type="text" placeholder="Tujuan (Contoh: Bandung)" 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={form.destination} onChange={e => setForm({...form, destination: e.target.value})}
          />
          <input 
            type="text" placeholder="Tipe Truk (CDD/Wingbox)" 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={form.type} onChange={e => setForm({...form, type: e.target.value})}
          />
          <input 
            type="number" placeholder="Harga" 
            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
            value={form.price} onChange={e => setForm({...form, price: e.target.value})}
          />
          <button type="submit" className="bg-[#233762] text-white rounded-xl font-bold hover:bg-blue-800 transition shadow-md text-sm">
            Simpan Tarif
          </button>
        </form>
      </div>

      {/* TABEL DATA TARIF */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <th className="p-4">Rute Pengiriman</th>
              <th className="p-4">Jenis Armada</th>
              <th className="p-4 text-center">Estimasi Tarif</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tariffs.length === 0 ? (
              <tr><td colSpan={4} className="p-10 text-center text-gray-400">Belum ada data tarif. Silakan input atau gunakan tombol suntik.</td></tr>
            ) : (
              tariffs.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-[#233762]">
                    <span className="text-blue-400 text-xs">📍</span> {t.origin} <span className="text-gray-300 mx-2">→</span> {t.destination}
                  </td>
                  <td className="p-4 text-slate-600 font-medium text-sm">{t.type}</td>
                  <td className="p-4 text-center">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs">
                      Rp {Number(t.price).toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-600 font-bold text-xs underline">
                      Hapus
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