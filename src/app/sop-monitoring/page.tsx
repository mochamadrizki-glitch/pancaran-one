"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BellRing, Mail, MessageCircleWarning, ShieldAlert } from "lucide-react";

type SopAlert = {
  eventId: string;
  severity: "HIGH" | "MEDIUM";
  issue: string;
  recommendation: string;
  channels: ("in-app" | "email" | "whatsapp")[];
};

type SopResponse = {
  scannedAt: string;
  violations: SopAlert[];
  delivered: {
    inApp: number;
    email: number;
    whatsapp: number;
  };
  notes: string[];
};

export default function SopMonitoringPage() {
  const [data, setData] = useState<SopResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sop-monitoring", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to scan SOP events.");
      const json = (await res.json()) as SopResponse;
      setData(json);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const timer = setInterval(fetchAlerts, 30000);
    return () => clearInterval(timer);
  }, [fetchAlerts]);

  const highCount = useMemo(
    () => data?.violations.filter((v) => v.severity === "HIGH").length ?? 0,
    [data],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/portal" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-red-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> SOP Monitoring AI Agent
              </h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest">
                Deteksi aktivitas di luar SOP + notifikasi otomatis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchAlerts}
            className="px-4 py-2 text-[11px] font-bold uppercase rounded-lg border border-blue-500/40 text-blue-300 bg-blue-500/10 hover:bg-blue-500/20"
          >
            {loading ? "Scanning..." : "Scan Ulang"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-slate-400">High Violations</p>
            <p className="text-2xl font-black text-red-400">{highCount}</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-slate-400">In-App Alerts</p>
            <p className="text-2xl font-black text-blue-300">{data?.delivered.inApp ?? 0}</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-slate-400">Email Sent</p>
            <p className="text-2xl font-black text-emerald-300">{data?.delivered.email ?? 0}</p>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] uppercase text-slate-400">WA Sent</p>
            <p className="text-2xl font-black text-amber-300">{data?.delivered.whatsapp ?? 0}</p>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-red-300" /> Pelanggaran SOP Terdeteksi
          </h2>
          {error ? <p className="text-red-300 text-sm">{error}</p> : null}
          {!error && !data?.violations.length ? (
            <p className="text-emerald-300 text-sm">Tidak ada pelanggaran pada scan terakhir.</p>
          ) : null}
          <div className="space-y-3">
            {data?.violations.map((item) => (
              <div key={`${item.eventId}-${item.issue}`} className="border border-slate-700 rounded-xl p-4 bg-slate-950/60">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.severity === "HIGH" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.eventId}</p>
                </div>
                <p className="text-sm font-semibold text-white">{item.issue}</p>
                <p className="text-xs text-slate-400 mt-1">Rekomendasi: {item.recommendation}</p>
                <div className="flex gap-2 mt-3">
                  {item.channels.includes("in-app") ? (
                    <span className="text-[10px] px-2 py-1 rounded bg-blue-500/15 text-blue-300">System</span>
                  ) : null}
                  {item.channels.includes("email") ? (
                    <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </span>
                  ) : null}
                  {item.channels.includes("whatsapp") ? (
                    <span className="text-[10px] px-2 py-1 rounded bg-amber-500/15 text-amber-300 flex items-center gap-1">
                      <MessageCircleWarning className="w-3 h-3" /> WhatsApp
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 text-[11px] text-slate-500 space-y-1">
          <p>Scan terakhir: {data?.scannedAt ? new Date(data.scannedAt).toLocaleString() : "-"}</p>
          {data?.notes.map((note) => (
            <p key={note}>- {note}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
