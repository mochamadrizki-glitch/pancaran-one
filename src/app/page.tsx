'use client';
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import Patricia from "@/components/Patricia";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#001a33] overflow-hidden font-sans">
      
      {/* 1. HEADER MODERN (Font Extrabold & Tinggi Dipipihkan) */}
      <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-6 md:px-10 pointer-events-none">
        {/* py-4 diubah menjadi py-2.5 agar bar tidak terlalu tebal ke bawah */}
        <header className="w-full max-w-[1500px] bg-white/90 backdrop-blur-xl border border-white/60 rounded-full flex items-center justify-between px-10 md:px-12 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-500 pointer-events-auto">
          
          {/* Logo (Disesuaikan ukurannya agar pas dengan bar yang lebih ramping) */}
          <div className="relative h-[35px] w-[160px] flex-shrink-0 cursor-pointer">
            <Image src="/images/logo-pancaran.png" alt="Pancaran Logo" fill className="object-contain object-left" unoptimized />
          </div>

          {/* Navigasi Modern (Font diubah jadi font-extrabold dan warna text-slate-900 agar sangat tajam) */}
          <nav className="hidden xl:flex items-center gap-10">
            {['HOME', 'COMPANY', 'BUSINESS OVERVIEW', 'GALLERY', 'NEWS', 'CAREER', 'CONTACT'].map((menu) => (
              <a key={menu} href="#" className="relative text-[12px] font-extrabold text-slate-900 hover:text-[#004a99] transition-colors tracking-[0.15em] group">
                {menu}
                {/* Animasi Garis Bawah */}
                <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-[#004a99] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
            
            {/* Area Tombol Modern */}
            <div className="flex items-center gap-4 ml-4 border-l-2 border-slate-200/80 pl-8">
              {/* Padding vertikal tombol disesuaikan menjadi py-2.5 */}
              <button className="text-slate-900 text-[12px] font-extrabold px-6 py-2.5 rounded-full hover:bg-slate-100 transition-colors tracking-widest">
                DAFTAR
              </button>
              <Link href="/login">
                <button className="flex items-center gap-2.5 bg-[#004a99] text-white text-[12px] font-bold px-8 py-2.5 rounded-full shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300 tracking-widest group">
                  MASUK
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </nav>
        </header>
      </div>

      {/* 2. HERO SECTION MODERN (TIDAK DIRUBAH) */}
      <main className="relative h-screen w-full flex items-center justify-center pt-[60px]">
        
        {/* BAGIAN VIDEO & OVERLAY MODERN */}
        <div className="absolute inset-0 z-0">
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src="/company-video.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay Modern: Gradien Navy ke Hitam */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#001a33]/80 via-[#001a33]/40 to-[#000000]/90" />
        </div>

        {/* KONTEN TEKS MODERN */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-10">
          
          {/* Badge Label (Efek Kaca) */}
          <div className="inline-block px-5 py-1.5 mb-6 rounded-full border border-blue-300/20 bg-blue-500/10 backdrop-blur-md shadow-lg">
            <p className="text-[10px] font-bold tracking-[0.25em] text-blue-100 uppercase">
              Logistik & Transportasi Terpercaya
            </p>
          </div>

          {/* Judul Utama dengan Text Gradient */}
          <h1 className="text-5xl md:text-[85px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-50 to-blue-200 drop-shadow-2xl mb-4 tracking-tight leading-tight">
            Pancaran Group
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-50/80 font-light drop-shadow-md tracking-widest mb-10 max-w-2xl">
            Your Trust And Sustainable Future, We Care
          </p>
          
          {/* Tombol Modern (Glassmorphism) */}
          <button className="group relative px-10 py-3.5 bg-white/5 backdrop-blur-sm border border-white/30 text-xs font-bold text-white tracking-[0.2em] overflow-hidden transition-all duration-500 hover:bg-white hover:text-[#004a99] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:border-white rounded-sm">
            <span className="relative z-10">EXPLORE MORE</span>
          </button>

        </div>
      </main>

      {/* 3. MEMANGGIL PATRICIA (TIDAK DIRUBAH) */}
      <Patricia />

      {/* Footer Text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30 text-[10px] font-bold uppercase tracking-[0.5em] pointer-events-none">
        Berdiri pada 1992
      </div>
      
    </div>
  );
}