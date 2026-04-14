'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// ==========================================================
// KONFIGURASI FIREBASE PANCARAN
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyBWMMwg6nD5Dg1aIab9F5rDNy4csLl7rGw",
  authDomain: "patricia-pancaran.firebaseapp.com",
  projectId: "patricia-pancaran",
  storageBucket: "patricia-pancaran.firebasestorage.app",
  messagingSenderId: "499330425922",
  appId: "1:499330425922:web:e608c535834ecc0ba6b9db",
  measurementId: "G-EKGBB485JY"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

interface ChatMessage {
  sender: 'patricia' | 'user';
  text: string;
  isMenu?: boolean;
}

export default function Patricia() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [message, setMessage] = useState('');
  const [isWaitingForTracking, setIsWaitingForTracking] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: 'patricia', 
      text: 'Halo Bapak/Ibu! 👋 Saya Patricia, asisten virtual dari Pancaran Group.\n\nJika Bapak/Ibu ingin mengetahui posisi barang kiriman, silakan ketik nomor Resi/DO di bawah ini, atau pilih menu bantuan lainnya.',
      isMenu: true 
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const whatsappNumber = "6285714405201"; 
  const whatsappMessage = encodeURIComponent("Halo Patricia, saya ingin bertanya tentang layanan operasional Pancaran Group.");

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  // ==========================================================
  // FUNGSI PINTAR CEK DATA TRACKING (ANTI-ERROR)
  // ==========================================================
  const fetchTrackingFromFirebase = async (noResi: string) => {
    try {
      // 1. PINTAR EKSTRAK ANGKA: Misal user ngetik "cek resi ini 8801"
      const words = noResi.trim().split(/\s+/);
      let cleanResi = noResi.trim();
      
      // Cari kata yang mengandung angka
      const possibleCode = words.find(w => /\d/.test(w)); 
      if (possibleCode) {
        cleanResi = possibleCode; // Ambil "8801"-nya saja
      }
      
      // Bersihkan tanda baca (hanya menyisakan huruf, angka, dan strip)
      cleanResi = cleanResi.replace(/[^a-zA-Z0-9-]/g, '');

      // 2. CARI KE FIREBASE MENGGUNAKAN NOMOR YANG SUDAH BERSIH
      const q = query(collection(db, "DATA_TRACKING"), where("no_resi", "==", cleanResi));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return `Waduh, maaf ya Pak/Bu. 😔 Patricia tidak bisa menemukan nomor resi *${cleanResi}* tersebut.\n\nBoleh minta tolong pastikan kembali nomor yang diketik sudah benar? Atau Bapak/Ibu bisa langsung chat CS kami di WhatsApp untuk pengecekan lebih detail.`;
      }

      const data = querySnapshot.docs[0].data();
      
      return `Siap! Berikut adalah update posisi armada untuk pengiriman Bapak/Ibu saat ini:\n\n📦 *Status:* ${data.status || 'Sedang Diproses'}\n📍 *Posisi Terkini:* ${data.lokasi || 'Pool Terdekat'}\n🕒 *Estimasi Tiba:* ${data.eta || '-'}\n\nSemoga perjalanannya lancar ya! Ada nomor resi lain yang ingin Patricia bantu cek?`;
      
    } catch (error) {
      console.error("Firebase Sync Error:", error);
      return "Maaf Pak/Bu, saat ini koneksi ke database kami sedang sedikit sibuk. 🙏 Boleh dicoba beberapa saat lagi, atau silakan hubungi WhatsApp kami ya.";
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setChatHistory(prev => [...prev, { sender: 'user', text: textToSend }]);
    setMessage('');
    setChatHistory(prev => [...prev, { sender: 'patricia', text: '...' }]);

    // LOGIKA PINTAR: Mengenali berbagai kata kunci "Tracking" dari User
    const userText = textToSend.toLowerCase();
    const trackingKeywords = ["lacak", "track", "trak", "resi", "do", "pengiriman", "posisi", "barang", "cek"];
    const isWantsToTrack = trackingKeywords.some(keyword => userText.includes(keyword));

    if (isWantsToTrack && !isWaitingForTracking) {
      setIsWaitingForTracking(true);
      setTimeout(() => {
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { 
            sender: 'patricia', 
            text: "Baik, dengan senang hati! 😊 Silakan ketikkan Nomor DO atau Nomor Resi pengiriman Bapak/Ibu di bawah ini ya:" 
          };
          return newHistory;
        });
      }, 800);
      return;
    }

    if (isWaitingForTracking) {
      const result = await fetchTrackingFromFirebase(textToSend);
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { sender: 'patricia', text: result };
        return newHistory;
      });
      setIsWaitingForTracking(false);
      return;
    }

    // LOGIKA FALLBACK (Pertanyaan Umum)
    setTimeout(() => {
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { 
          sender: 'patricia', 
          text: "Mohon maaf Pak/Bu, di layanan chat website ini Patricia baru bisa melayani pelacakan resi secara otomatis. 🙏\n\nUntuk informasi Cek Armada, Estimasi Tarif, atau ngobrol lebih lanjut, yuk langsung pindah ke WhatsApp (Official) kami lewat tombol di atas! Patricia tunggu di sana ya. 🚀" 
        };
        return newHistory;
      });
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-2 font-sans text-slate-900">
      
      {/* JENDELA CHAT */}
      <div className={`bg-white w-[350px] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right mb-3 ${isChatOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none absolute bottom-0 right-0'}`}>
        <div className="bg-[#004a99] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white flex items-center justify-center p-0.5">
              <Image src="/images/patricia-bot.png" alt="Patricia" width={40} height={40} className="object-cover" unoptimized/>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">Patricia</h3>
              <p className="text-blue-200 text-[10px] flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online Support
              </p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-red-300 transition text-3xl font-light">&times;</button>
        </div>

        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${chat.sender === 'user' ? 'bg-[#004a99] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                {chat.text === '...' ? (
                  <div className="flex gap-1 py-1 px-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                ) : <span className="whitespace-pre-line">{chat.text}</span>}
              </div>

              {chat.isMenu && (
                <div className="flex flex-col gap-2 mt-3 w-full max-w-[280px]">
                  <button onClick={() => handleSendMessage('Lacak Pengiriman (Tracking)')} className="text-[11px] bg-white border border-[#004a99] text-[#004a99] px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-left font-extrabold shadow-sm">
                    1️⃣ Lacak Pengiriman (Tracking)
                  </button>
                  <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="text-[11px] bg-[#25D366] text-white px-4 py-2.5 rounded-xl hover:bg-green-600 transition-all text-left font-extrabold shadow-md flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" /></svg>
                    Hubungi via WhatsApp (Official)
                  </a>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-slate-100">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(message); }} className="flex items-center gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pesan Anda..." 
              className="flex-1 bg-slate-100 text-sm px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#004a99]/20 transition text-slate-700"
            />
            <button type="submit" disabled={!message.trim()} className="bg-[#004a99] text-white p-3 rounded-full hover:bg-blue-800 disabled:opacity-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            </button>
          </form>
        </div>
      </div>

      {/* AVATAR LAUNCHER */}
      <div 
        className={`flex flex-col items-end transition-all duration-300 ${isChatOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
        onMouseEnter={() => setShowBubble(true)}
        onMouseLeave={() => setShowBubble(false)}
      >
        <div className={`bg-white p-3 rounded-3xl rounded-br-none shadow-2xl border border-slate-100 max-w-[190px] transition-all duration-500 origin-bottom-right z-30 mb-5 mr-24 ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
          <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
            "Hi, aku <span className="font-bold text-[#004a99]">Patricia</span> siap membantu kebutuhan Anda."
          </p>
        </div>

        <div onClick={() => { setIsChatOpen(true); setShowBubble(false); }} className="relative w-[100px] h-[100px] cursor-pointer hover:scale-105 transition-transform duration-500 group">
          <div className="absolute inset-0 rounded-full border border-white/40 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[126px] h-[152px] z-20">
            <Image src="/images/patricia-bot.png" alt="Patricia Avatar" fill className="object-contain drop-shadow-2xl" unoptimized />
          </div>
          <div className="absolute top-[10px] right-[0px] z-30 w-3.5 h-3.5 bg-[#22c55e] rounded-full border-[2px] border-white shadow-lg animate-pulse"></div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold tracking-widest shadow-lg z-30 uppercase">
            Patricia
          </div>
        </div>
      </div>
    </div>
  );
}