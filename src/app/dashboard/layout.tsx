"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/fleet", label: "🚚 DATA_STOK_ARMADA" },
  { href: "/dashboard/tariff", label: "💰 DATA_TARIF" },
  { href: "/dashboard/tracking", label: "📍 DATA_TRACKING" },
  { href: "/dashboard/tickets", label: "🎫 TIKET_BANTUAN" },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 flex-shrink-0 border-r border-slate-200 bg-white/95 px-4 py-6 shadow-sm md:flex md:flex-col">
        <Link href="/" className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-pancaran.png"
              alt="Pancaran Group Logo"
              width={160}
              height={50}
              className="rounded-lg object-contain"
              priority
            />
          </div>
        </Link>

        <nav className="space-y-1 text-sm">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#1e3a8a] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-medium text-slate-700">Status Operasional</p>
          <p className="text-[11px] text-slate-500">
            128 armada aktif · 4 armada maintenance · 2 armada standby.
          </p>
        </div>
      </aside>

      <main className="flex-1 px-4 py-4 md:px-6 md:py-6 relative">
        <div className="mx-auto max-w-5xl">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-pancaran.png"
                alt="Pancaran Group Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-contain"
                priority
              />
              <div>
                <div className="leading-tight">
                  <p className="text-xs font-extrabold tracking-tight text-[#1e3a8a]">PANCARAN</p>
                  <p className="text-[11px] font-extrabold tracking-tight text-[#00aaff]">GROUP</p>
                  <div className="mt-1 h-px w-12 bg-[#00aaff]" />
                </div>
                <h1 className="text-lg font-semibold text-slate-900">Fleet Management Dashboard</h1>
              </div>
            </div>
          </header>

          {/* Patricia sudah dihapus dari sini agar dashboard normal kembali */}
          {children}
        </div>
      </main>
    </div>
  );
}