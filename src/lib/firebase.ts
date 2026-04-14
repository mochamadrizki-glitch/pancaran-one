import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi asli dari Firebase Patricia Bapak
const firebaseConfig = {
  apiKey: "AIzaSyBWMwg6nD5Dg1aIab9F5rDNy4csLL7rGw",
  authDomain: "patricia-pancaran.firebaseapp.com",
  projectId: "patricia-pancaran",
  storageBucket: "patricia-pancaran.firebasestorage.app",
  messagingSenderId: "499330425922",
  appId: "1:499330425922:web:e608c535834ecc0ba6b9db",
  measurementId: "G-EKGBB485JY"
};

// Inisialisasi Firebase agar tidak double-run
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Ini adalah variabel 'db' yang akan kita pakai di semua modul (Fleet, Tarif, Tracking)
export const db = getFirestore(app);