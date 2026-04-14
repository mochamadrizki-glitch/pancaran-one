import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Sisi Kiri - Branding Visual (Warna Biru Khas Pancaran) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004a99] relative items-center justify-center overflow-hidden">
        {/* Latar Belakang Gradasi */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004a99] to-blue-900 z-0"></div>
        
        <div className="relative z-10 text-white text-center px-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-wide drop-shadow-md">
            Pancaran One
          </h1>
          <p className="text-lg font-light text-blue-100 drop-shadow">
            Integrated Fleet Management Portal
          </p>
        </div>
      </div>

      {/* Sisi Kanan - Kotak Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Logo Pancaran di atas form */}
          <div className="flex justify-center mb-8">
            <div className="relative h-[40px] w-[160px]">
              <Image
                src="/images/logo-pancaran.png"
                alt="Pancaran Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Please enter your details to sign in to the portal.</p>

          <form className="space-y-5">
            {/* Input Email/Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004a99] focus:border-[#004a99] outline-none transition"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-[#004a99] hover:underline font-medium">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004a99] focus:border-[#004a99] outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-[#004a99] focus:ring-[#004a99] border-gray-300 rounded" />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>

            {/* Tombol Sign In */}
            <Link href="/dashboard" className="block w-full mt-6">
              <button 
                type="button" 
                className="w-full bg-[#004a99] text-white py-3 rounded-md font-bold hover:bg-blue-900 transition duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </Link>
          </form>
          
          {/* Tombol Kembali ke Landing Page */}
          <div className="mt-8 text-center">
             <Link href="/" className="text-sm text-gray-500 hover:text-[#004a99] transition font-medium">
                &larr; Back to Home
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}