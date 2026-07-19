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
import { Clock, Eye, Upload, X } from "lucide-react";

/** Opsi status form modal = opsi dashboard + tambahan dari Command Center (tanpa duplikat). */
export const TRACKING_MODAL_STATUS_OPTIONS = [
  "Standby",
  "Menuju Lokasi Muat",
  "Loading",
  "Perjalanan",
  "Transit Area",
  "Menuju Lokasi Bongkar",
  "Bongkar",
  "Tiba di Lokasi",
  "Tiba di Pelabuhan",
  "Sedang Bongkar Muat",
  "Kendala",
  "Selesai",
] as const;

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

export type TrackingEvidenceModalProps = {
  open: boolean;
  onClose: () => void;
  /** ID dokumen Firestore (= no DO yang dinormalisasi). */
  doId: string;
  no_do: string;
  nopol?: string;
  driver?: string;
};

export default function TrackingEvidenceModal({
  open,
  onClose,
  doId,
  no_do,
  nopol,
  driver,
}: TrackingEvidenceModalProps) {
  const [historyAsc, setHistoryAsc] = useState<HistoryEntry[]>([]);
  const [status, setStatus] = useState("");
  const [catatan, setCatatan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !doId) {
      setHistoryAsc([]);
      return;
    }
    const q = query(
      collection(db, "DATA_TRACKING", doId, "tracking_history"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setHistoryAsc(
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
        setErrorMsg(null);
      },
      () => {
        setErrorMsg(
          "Gagal memuat riwayat. Periksa aturan Firestore atau indeks untuk tracking_history."
        );
      }
    );
    return () => unsub();
  }, [open, doId]);

  useEffect(() => {
    if (!open) {
      setStatus("");
      setCatatan("");
      setFile(null);
      setErrorMsg(null);
      setLightboxUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
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

    // 2) Tambah riwayat pergerakan (double update)
    await addDoc(collection(db, "DATA_TRACKING", doId, "tracking_history"), {
      status: nextStatus,
      lokasi: resolvedLokasi,
      catatan: normalizedCatatan,
      url_foto: resolvedUrlFoto,
      evidenUrl: resolvedUrlFoto, // legacy
      timestamp: ts,
      createdAt: ts, // legacy
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) {
      setErrorMsg("Pilih status terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      let evidenUrl = "";
      if (file) {
        const safeName = file.name.replace(/[^\w.\-]/g, "_");
        const objectPath = `eviden_tracking/${doId}/${Date.now()}_${safeName}`;
        const storageRef = ref(storage, objectPath);
        await uploadBytes(storageRef, file);
        evidenUrl = await getDownloadURL(storageRef);
      }

      await persistTrackingDo({
        doId,
        nextStatus: status,
        nextCatatan: catatan,
        urlFoto: evidenUrl || null,
      });

      setCatatan("");
      setFile(null);
      setStatus("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Gagal menyimpan: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-ev-modal-title"
        onClick={() => !submitting && onClose()}
      >
        <div
          className="relative w-full max-w-5xl max-h-[94vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div>
              <h2
                id="tracking-ev-modal-title"
                className="text-lg font-bold text-[#233762] tracking-tight"
              >
                Detail DO &amp; Eviden Supir
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                <span className="font-black text-blue-600">{no_do}</span>
                {nopol ? (
                  <span className="text-slate-400">
                    {" "}
                    · <span className="font-semibold text-slate-700">{nopol}</span>
                  </span>
                ) : null}
                {driver ? (
                  <span className="text-slate-400">
                    {" "}
                    · {driver}
                  </span>
                ) : null}
              </p>
            </div>
            <button
              type="button"
              onClick={() => !submitting && onClose()}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(94vh-5rem)] p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Kiri — timeline */}
              <div className="order-2 lg:order-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Clock className="w-4 h-4 text-[#233762]" />
                  Riwayat pergerakan
                </h3>
                {errorMsg && (
                  <p className="mb-4 text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}
                {historyAsc.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center text-[12px] text-slate-500">
                    Belum ada riwayat. Kirim pembaruan melalui form di kanan.
                  </div>
                ) : (
                  <ul className="relative space-y-0 pl-1 border-l-2 border-slate-200">
                    {historyAsc.map((item) => (
                      <li key={item.id} className="relative pb-8 last:pb-1 pl-6">
                        <span
                          className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-[3px] border-[#233762]"
                          aria-hidden
                        />
                        <div className="rounded-xl border border-slate-100 bg-slate-50/90 p-3 shadow-sm">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <time className="text-[11px] font-mono font-semibold text-slate-500">
                              {formatWhen(item.timestamp)}
                            </time>
                            <span className="rounded-full bg-blue-600/90 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[12px] leading-relaxed text-slate-700">
                            {item.catatan.trim() ? item.catatan : (
                              <span className="text-slate-400 italic">Tanpa catatan</span>
                            )}
                          </p>
                          {item.urlFoto || item.evidenUrl ? (
                            <button
                              type="button"
                              onClick={() => setLightboxUrl(item.urlFoto ?? item.evidenUrl!)}
                              className="mt-3 block text-left group"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.urlFoto ?? item.evidenUrl}
                                alt="Eviden"
                                className="h-20 w-20 rounded-lg object-cover ring-2 ring-slate-200 group-hover:ring-[#233762]/40 transition-all cursor-zoom-in"
                              />
                              <span className="mt-1 block text-[10px] font-bold text-[#233762] underline-offset-2 group-hover:underline">
                                Perbesar
                              </span>
                            </button>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Kanan — form */}
              <div className="order-1 lg:order-2 lg:sticky lg:top-0 lg:self-start">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Upload className="w-4 h-4 text-[#233762]" />
                  Update baru
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none focus:ring-2 focus:ring-[#233762]/30 focus:border-[#233762]"
                    >
                      <option value="">— Pilih status —</option>
                      {TRACKING_MODAL_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                      Catatan
                    </label>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      rows={5}
                      placeholder="Detail lokasi, kendala, atau arahan..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none resize-y min-h-[120px] focus:ring-2 focus:ring-[#233762]/30 focus:border-[#233762]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                      Upload foto eviden
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onPickFile}
                      className="hidden"
                      id="modal-eviden-upload"
                    />
                    <label
                      htmlFor="modal-eviden-upload"
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 hover:border-[#233762]/50 hover:bg-slate-100/80 transition-colors"
                    >
                      <Upload className="h-5 w-5 shrink-0 text-[#233762]" />
                      <span className="text-[12px] text-slate-600 truncate">
                        {file ? file.name : "Tap untuk memilih foto…"}
                      </span>
                    </label>
                  </div>
                  {errorMsg ? (
                    <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {errorMsg}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#233762] py-3 text-[13px] font-bold text-white shadow hover:bg-[#1a2a4f] disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  >
                    {submitting ? "Menyimpan…" : "Simpan & kirim update"}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Foto akan di-upload ke Firebase Storage (<code className="text-slate-500">eviden_tracking/</code>),
                    kemudian tercatat di Firestore. Timeline memperbarui secara real-time.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxUrl ? (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4"
          role="presentation"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Tutup pratinjau"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="h-7 w-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Eviden diperbesar"
            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
