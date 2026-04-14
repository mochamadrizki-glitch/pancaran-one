'use client';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  // 1. Ambil Data Real-time (Urutkan dari yang terbaru)
  useEffect(() => {
    const q = query(collection(db, "CATAT_TIKET_BANTUAN"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setTickets(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi Update Status Tiket
  const updateStatus = async (id: string, newStatus: string) => {
    const ticketRef = doc(db, "CATAT_TIKET_BANTUAN", id);
    await setDoc(ticketRef, { status: newStatus, updatedAt: serverTimestamp() }, { merge: true });
  };

  // 3. Suntik Data Dummy (Contoh Kasus CS Nyata)
  const suntikTickets = async () => {
    const dummy = [
      { nama: 'Bapak Samsul', kategori: 'KOMPLAIN', pesan: 'Barang di DO-8801 belum sampai, driver tidak angkat telpon.', status: 'OPEN', mps_rating: '-' },
      { nama: 'Ibu Ratna', kategori: 'BANTUAN', pesan: 'Mohon info cara cetak invoice dari sistem.', status: 'PROSES', mps_rating: '-' },
      { nama: 'PT. Maju Jaya', kategori: 'APRESIASI', pesan: 'Layanan Patricia sangat cepat, tarif sangat kompetitif.', status: 'SELESAI', mps_rating: '10' },
      { nama: 'Bapak Budi', kategori: 'KOMPLAIN', pesan: 'Truk bocor saat loading di gudang.', status: 'OPEN', mps_rating: '-' },
    ];
    for (const d of dummy) { 
      const id = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(db, "CATAT_TIKET_BANTUAN", id), { ...d, updatedAt: serverTimestamp() }); 
    }
    alert("4 Tiket Dummy Berhasil Masuk!");
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#233762]">🎫 TIKET_BANTUAN (Customer Service)</h1>
          <p className="text-gray-500 mt-1">Pantau dan selesaikan kendala pelanggan dari WhatsApp Patricia.</p>
        </div>
        <button onClick={suntikTickets} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all">
          ⚡ Suntik Tiket Baru
        </button>
      </div>

      {/* DAFTAR TIKET DALAM BENTUK CARD / LIST */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl border border-dashed border-slate-300 text-gray-400">
            Belum ada tiket masuk hari ini.
          </div>
        ) : (
          tickets.map(t => (
            <div key={t.id} className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 transition-all ${
              t.kategori === 'KOMPLAIN' ? 'border-l-red-500' : 
              t.kategori === 'APRESIASI' ? 'border-l-green-500' : 'border-l-blue-500'
            }`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#233762] text-lg uppercase">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      t.status === 'OPEN' ? 'bg-red-100 text-red-600' : 
                      t.status === 'PROSES' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-700 text-sm">{t.nama} <span className="font-normal text-slate-400 mx-2">|</span> <span className="text-blue-500">{t.kategori}</span></div>
                  <p className="text-slate-600 text-sm mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                    "{t.pesan}"
                  </p>
                </div>

                {/* AKSI CS */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <button onClick={() => updateStatus(t.id, 'PROSES')} className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg font-bold text-[10px] hover:bg-yellow-100">PROSES</button>
                  <button onClick={() => updateStatus(t.id, 'SELESAI')} className="bg-green-50 text-green-700 px-3 py-2 rounded-lg font-bold text-[10px] hover:bg-green-100">SELESAI</button>
                  <button onClick={() => deleteDoc(doc(db, "CATAT_TIKET_BANTUAN", t.id))} className="text-slate-300 hover:text-red-500 text-[10px] mt-2 underline">Hapus Permanen</button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                <span>Rating MPS: {t.mps_rating || '-'} / 10</span>
                <span>Terakhir diupdate: {t.updatedAt?.toDate() ? new Date(t.updatedAt.toDate()).toLocaleString('id-ID') : 'Baru saja'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}