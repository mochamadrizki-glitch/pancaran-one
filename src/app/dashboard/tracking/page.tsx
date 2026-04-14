'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
// PERUBAHAN: Mengganti addDoc menjadi setDoc di import
import { collection, onSnapshot, query, setDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default function TrackingPage() {
  const [tracks, setTracks] = useState<any[]>([]);
  // Form lengkap dengan no_do (kunci pelacakan pelanggan)
  const [form, setForm] = useState({ no_do: '', nopol: '', driver: '', lokasi: '', status: '', eta: '' });

  // 1. Ambil Data Real-time dari Firebase
  useEffect(() => {
    const q = query(collection(db, "DATA_TRACKING"));
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setTracks(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. Simpan Data Baru (ANTI-DUPLIKAT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_do || !form.nopol) return alert("Nomor DO dan Nopol Wajib Diisi!");
    
    // Jadikan Nomor DO sebagai ID unik (Huruf Besar & Tanpa Spasi Ekstra)
    const customId = form.no_do.toUpperCase().trim();

    try {
      // Gunakan setDoc agar jika DO sama, datanya hanya di-update (bukan nambah baris)
      await setDoc(doc(db, "DATA_TRACKING", customId), { 
        ...form,
        no_do: customId, // Pastikan tersimpan dengan format rapi
        updatedAt: serverTimestamp() 
      });
      setForm({ no_do: '', nopol: '', driver: '', lokasi: '', status: '', eta: '' });
      alert("Data Tracking Berhasil Diinput / Diupdate!");
    } catch (error) { alert("Gagal simpan data"); }
  };

  // 3. Fungsi Suntik Data Dummy (ANTI-DUPLIKAT)
  const suntikTracking = async () => {
    const dummy = [
      { no_do: 'DO-8801', nopol: 'B 9012 PQR', driver: 'Andi Pratama', lokasi: 'Cikampek KM 57', status: 'Perjalanan', eta: '14:00 WIB' },
      { no_do: 'DO-8802', nopol: 'B 9123 STU', driver: 'Budi Santoso', lokasi: 'Pool Jakarta', status: 'Loading', eta: '-' },
      { no_do: 'DO-8803', nopol: 'L 4452 UX', driver: 'Slamet', lokasi: 'Gudang Surabaya', status: 'Tiba di Lokasi', eta: 'Selesai' },
      { no_do: 'DO-8804', nopol: 'B 2210 VWA', driver: 'Deni Prakoso', lokasi: 'Nagreg', status: 'Menuju Lokasi Bongkar', eta: '17:45 WIB' },
    ];
    
    try {
      for (const d of dummy) { 
        const customId = d.no_do.toUpperCase().trim();
        await setDoc(doc(db, "DATA_TRACKING", customId), {
          ...d,
          no_do: customId,
          updatedAt: serverTimestamp()
        }); 
      }
      alert("4 Data Dummy Tracking Berhasil Disinkronkan (Anti-Duplikat)!");
    } catch (e) {
      alert("Gagal suntik data tracking");
    }
  };

  // 4. Helper Warna Status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Perjalanan': return 'bg-blue-100 text-blue-600';
      case 'Loading': return 'bg-yellow-100 text-yellow-700';
      case 'Bongkar': return 'bg-orange-100 text-orange-600';
      case 'Tiba di Lokasi': return 'bg-green-100 text-green-600';
      case 'Standby': return 'bg-purple-100 text-purple-600';
      case 'Menuju Lokasi Muat': return 'bg-cyan-100 text-cyan-600';
      case 'Menuju Lokasi Bongkar': return 'bg-pink-100 text-pink-600';
      case 'Selesai': return 'bg-slate-200 text-slate-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#233762]">📍 DATA_TRACKING</h1>
          <p className="text-gray-500 mt-1 text-xs">Kelola posisi unit agar pelanggan bisa melacak via Patricia AI.</p>
        </div>
        <button onClick={suntikTracking} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all">
          ⚡ Suntik Data Unit
        </button>
      </div>

      {/* FORM INPUT TRACKING */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Update Lokasi & Status</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input placeholder="NO. DO / RESI" className="p-3 border rounded-xl font-bold text-blue-600 uppercase" value={form.no_do} onChange={e => setForm({...form, no_do: e.target.value})} />
          <input placeholder="No. Polisi" className="p-3 border rounded-xl uppercase" value={form.nopol} onChange={e => setForm({...form, nopol: e.target.value})} />
          <input placeholder="Driver" className="p-3 border rounded-xl" value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} />
          <input placeholder="Lokasi Terakhir" className="p-3 border rounded-xl" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} />
          
          <select className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="">-- Status --</option>
            <option value="Standby">Standby (Siap)</option>
            <option value="Menuju Lokasi Muat">Otw Muat</option>
            <option value="Loading">Loading</option>
            <option value="Perjalanan">Perjalanan</option>
            <option value="Transit Area">Transit Area</option>
            <option value="Menuju Lokasi Bongkar">Otw Bongkar</option>
            <option value="Bongkar">Bongkar</option>
            <option value="Tiba di Lokasi">Tiba (Sampai)</option>
            <option value="Selesai">Selesai (DO Kembali)</option>
          </select>

          <button type="submit" className="bg-[#233762] text-white rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">Update</button>
        </form>
      </div>

      {/* TABEL TRACKING */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
            <tr>
              <th className="p-4 text-center">No. DO / Resi</th>
              <th className="p-4">Unit & Driver</th>
              <th className="p-4">Posisi Terakhir</th>
              <th className="p-4 text-center">Status Operasional</th>
              <th className="p-4 text-center">ETA</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tracks.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-gray-400 font-medium">Belum ada data tracking. Gunakan tombol suntik atau input manual.</td></tr>
            ) : (
              tracks.sort((a,b) => a.no_do.localeCompare(b.no_do)).map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-black text-blue-600 text-center tracking-tight text-sm">{t.no_do}</td>
                  <td className="p-4 border-l border-slate-50">
                    <div className="font-bold text-[#233762] leading-tight">{t.nopol}</div>
                    <div className="text-[10px] text-gray-400">{t.driver}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">
                    <span className="text-blue-500 mr-1 opacity-70">📍</span> {t.lokasi}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-400 text-[11px]">{t.eta || '-'}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteDoc(doc(db, "DATA_TRACKING", t.id))} className="text-red-400 hover:text-red-600 text-[10px] font-bold underline decoration-dotted">HAPUS</button>
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