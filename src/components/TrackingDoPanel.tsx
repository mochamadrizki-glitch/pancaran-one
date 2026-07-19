"use client";

import { useEffect, useRef, useState } from "react";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, Clock, Package, Upload, X } from "lucide-react";

export const TRACKING_STATUS_OPTIONS = [
  "Menuju Lokasi Muat",
  "Tiba di Pelabuhan",
  "Sedang Bongkar Muat",
  "Kendala",
  "Selesai",
] as const;

type TrackRow = {
  id: string;
  no_do?: string;
  nopol?: string;
  driver?: string;
  lokasi?: string;
  status?: string;
  eta?: string;
};

type HistoryEntry = {
  id: string;
  status: string;
  lokasi?: string;
  catatan: string;
  urlFoto?: string;
  evidenUrl?: string; // legacy
  timestamp?: Timestamp | null;
};

function formatWhen(ts: Timestamp | null | undefined): string {
  if (!ts?.toDate) return "—";
  try {
    return ts.toDate().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

export default function TrackingDoPanel() {
  const [tracks, setTracks] = useState<TrackRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoId, setSelectedDoId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [status, setStatus] = useState("");
  const [catatan, setCatatan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const col = collection(db, "DATA_TRACKING");
    const unsub = onSnapshot(col, (snap) => {
      setTracks(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TrackRow)
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selectedDoId) {
      setHistory([]);
      return;
    }
    const q = query(
      collection(db, "DATA_TRACKING", selectedDoId, "tracking_history"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setHistory(
          snap.docs.map((d) => {
            const data = d.data();
            const evidenCandidate = data.evidenUrl
              ? String(data.evidenUrl)
              : undefined;
            const urlFotoCandidate = data.url_foto
              ? String(data.url_foto)
              : undefined;
            const resolvedFoto = urlFotoCandidate ?? evidenCandidate;
            return {
              id: d.id,
              status: String(data.status ?? ""),
              lokasi: data.lokasi ? String(data.lokasi) : undefined,
              catatan: String(data.catatan ?? ""),
              urlFoto: resolvedFoto,
              evidenUrl: evidenCandidate,
              timestamp: data.timestamp ?? data.createdAt ?? null,
            } as HistoryEntry;
          })
        );
      },
      () => {
        setErrorMsg(
          "Gagal memuat riwayat. Pastikan indeks Firestore untuk tracking_history sudah tersedia, atau cek aturan keamanan."
        );
      }
    );
    return () => unsub();
  }, [selectedDoId]);

  const openModal = (doId: string) => {
    setSelectedDoId(doId);
    setStatus("");
    setCatatan("");
    setFile(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDoId(null);
    setStatus("");
    setCatatan("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
  };

  const persistTrackingDo = async ({
    doId,
    nextStatus,
    nextCatatan,
    urlFoto,
  }: {
    doId: string;
    nextStatus: string;
    nextCatatan: string;
    urlFoto?: string | null;
  }) => {
    const doRef = doc(db, "DATA_TRACKING", doId);
    const existingSnap = await getDoc(doRef);
    const existingCatatan = String(existingSnap.data()?.catatan ?? "").trim();
    const existingLokasi = String(existingSnap.data()?.lokasi ?? "").trim();
    const existingUrlFoto = existingSnap.data()?.url_foto
      ? String(existingSnap.data()?.url_foto)
      : null;

    const normalizedCatatan = nextCatatan.trim() || existingCatatan;
    const resolvedLokasi = existingLokasi;
    const resolvedUrlFoto = urlFoto ?? existingUrlFoto ?? null;
    const ts = serverTimestamp();

    // 1) Update dokumen utama DO
    await updateDoc(doRef, {
      status: nextStatus,
      lokasi: resolvedLokasi,
      url_foto: resolvedUrlFoto,
      catatan: normalizedCatatan,
      updatedAt: ts,
    });

    // 2) Tambah riwayat dengan data yang sama
    await addDoc(
      collection(db, "DATA_TRACKING", doId, "tracking_history"),
      {
        status: nextStatus,
        lokasi: resolvedLokasi,
        url_foto: resolvedUrlFoto,
        evidenUrl: resolvedUrlFoto, // legacy field biar UI lama tetap bisa tampil
        catatan: normalizedCatatan,
        timestamp: ts,
        createdAt: ts, // legacy field biar query lama tidak langsung rusak
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoId || !status) {
      setErrorMsg("Pilih status terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      let evidenUrl = "";
      if (file) {
        const safeName = file.name.replace(/[^\w.\-]/g, "_");
        const objectPath = `eviden_tracking/${selectedDoId}/${Date.now()}_${safeName}`;
        const storageRef = ref(storage, objectPath);
        await uploadBytes(storageRef, file);
        evidenUrl = await getDownloadURL(storageRef);
      }

      await persistTrackingDo({
        doId: selectedDoId,
        nextStatus: status,
        nextCatatan: catatan,
        urlFoto: evidenUrl || null,
      });

      setCatatan("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Gagal menyimpan: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLabel =
    tracks.find((t) => t.id === selectedDoId)?.no_do ?? selectedDoId;

  return (
    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Package className="w-4 h-4" /> Tracking DO
        </h2>
        <div className="text-[9px] bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 font-bold uppercase">
          Update Timeline &amp; Eviden
        </div>
      </div>

      <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
        Data diambil dari koleksi <span className="text-slate-400">DATA_TRACKING</span>.
        Riwayat disimpan di sub-koleksi{" "}
        <span className="text-slate-400">tracking_history</span> per nomor DO.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-[11px]">
          <thead className="text-slate-500 uppercase text-[9px] font-bold border-b border-slate-800 bg-slate-950/50">
            <tr>
              <th className="py-3 px-3">No. DO</th>
              <th className="py-3 px-3">Nopol</th>
              <th className="py-3 px-3">Driver</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {tracks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-slate-500 text-[11px]"
                >
                  Belum ada data DO. Tambahkan lewat menu Data Tracking atau suntik
                  data dummy di dashboard.
                </td>
              </tr>
            ) : (
              tracks.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-emerald-500/5 transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-white">
                    {t.no_do ?? t.id}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{t.nopol ?? "—"}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {t.driver ?? "—"}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400/90">
                    {t.status ?? "—"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => openModal(t.id)}
                      className="px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg border border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                    >
                      Timeline &amp; Eviden
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedDoId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracking-modal-title"
          onClick={() => !submitting && closeModal()}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/20 bg-[#0a1028] shadow-[0_0_40px_rgba(16,185,129,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-800 bg-[#0a1028]/95 px-5 py-4 backdrop-blur">
              <div>
                <h3
                  id="tracking-modal-title"
                  className="text-sm font-black text-emerald-400 uppercase tracking-wider"
                >
                  Update Pergerakan
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  DO:{" "}
                  <span className="text-slate-300">{selectedLabel}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => !submitting && closeModal()}
                className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Pilihan Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-[12px] text-slate-200 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                    required
                  >
                    <option value="">— Pilih status —</option>
                    {TRACKING_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Catatan Tambahan
                  </label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    rows={3}
                    placeholder="Penjelasan detail pergerakan atau kendala…"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-[12px] text-slate-200 placeholder:text-slate-600 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 resize-y min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Upload Eviden
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onPickFile}
                      className="hidden"
                      id="eviden-file-input"
                    />
                    <label
                      htmlFor="eviden-file-input"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 bg-slate-950/50 px-4 py-3 text-[11px] font-bold text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors flex-1"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      {file ? file.name : "Pilih foto eviden"}
                    </label>
                    {file && (
                      <span className="text-[10px] text-slate-500 sm:max-w-[120px] truncate">
                        Siap upload saat simpan
                      </span>
                    )}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-wide py-2.5 transition-colors"
                  >
                    {submitting ? "Menyimpan…" : "Simpan Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => !submitting && closeModal()}
                    className="px-4 rounded-xl border border-slate-600 text-[11px] font-bold text-slate-400 hover:bg-slate-800"
                  >
                    Batal
                  </button>
                </div>
              </form>

              <div className="border-t border-slate-800 pt-5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Riwayat Pergerakan
                </h4>

                {history.length === 0 ? (
                  <p className="text-[11px] text-slate-600 text-center py-6 border border-dashed border-slate-800 rounded-xl">
                    Belum ada riwayat. Kirim update pertama di atas.
                  </p>
                ) : (
                  <ul className="relative space-y-0 pl-4 border-l border-slate-700">
                    {history.map((item) => (
                      <li
                        key={item.id}
                        className="pb-6 last:pb-0 relative"
                      >
                        <span
                          className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a1028]"
                          aria-hidden
                        />
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-slate-500">
                              {formatWhen(item.timestamp)}
                            </span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                              {item.status}
                            </span>
                          </div>
                          {item.catatan ? (
                            <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                              {item.catatan}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-600 italic mt-1">
                              Tanpa catatan
                            </p>
                          )}
                          {item.urlFoto || item.evidenUrl ? (
                            <div className="mt-3 flex items-start gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.urlFoto ?? item.evidenUrl}
                                alt="Eviden"
                                className="h-16 w-16 rounded-lg object-cover border border-slate-700"
                              />
                              <a
                                href={item.urlFoto ?? item.evidenUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1"
                              >
                                <Camera className="w-3 h-3" />
                                Buka gambar
                              </a>
                            </div>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
