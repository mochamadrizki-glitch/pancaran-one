'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ChevronDown, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DIVISIONS = [
  { label: 'HMT (Heavy Machinery Transport)', value: 'hmt_manager', icon: '🚜', desc: 'HMT AI Advisor + Operational' },
  { label: 'Operations', value: 'ops', icon: '🚛', desc: 'Fleet & Operational Module' },
  { label: 'Finance', value: 'finance', icon: '💰', desc: 'Finance AI Agent' },
  { label: 'Customer Service', value: 'cs', icon: '🎧', desc: 'CS AI Agent & Order Pooling' },
  { label: 'Commercial', value: 'commercial', icon: '📊', desc: 'Auto-Costing & Quotation' },
  { label: 'Administration', value: 'administration', icon: '📋', desc: 'Document & POD Management' },
  { label: 'Vendor Management', value: 'vendor', icon: '🤝', desc: 'Vendor Coordination' },
];

const STATS = [
  { value: '9', label: 'AI Modules' },
  { value: '4', label: 'Live Agents' },
  { value: '6', label: 'Divisions' },
  { value: '99%', label: 'Uptime' },
];

type Mode = 'login' | 'signup';
type AlertT = { type: 'success' | 'error'; message: string } | null;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertT>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [divOpen, setDivOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signEmail, setSignEmail] = useState('');
  const [signPwd, setSignPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [selDiv, setSelDiv] = useState<(typeof DIVISIONS)[0] | null>(null);

  useEffect(() => { setAlert(null); }, [mode]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setAlert(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAlert({ type: 'error', message: 'Invalid email or password.' });
      setLoading(false);
      return;
    }
    router.push('/portal');
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !signEmail || !signPwd || !confirmPwd || !selDiv) {
      setAlert({ type: 'error', message: 'All fields are required.' });
      return;
    }
    if (signPwd !== confirmPwd) {
      setAlert({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (signPwd.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }
    setLoading(true); setAlert(null);
    const { data, error } = await supabase.auth.signUp({
      email: signEmail,
      password: signPwd,
      options: { data: { full_name: fullName, division: selDiv.label, role: selDiv.value } },
    });
    if (error) {
      setAlert({ type: 'error', message: error.message || 'Registration failed.' });
      setLoading(false);
      return;
    }
    setAlert({
      type: 'success',
      message: data.session ? 'Account created successfully! Redirecting...' : 'Account created! Please check your email for verification.',
    });
    if (data.session) setTimeout(() => router.push('/portal'), 1500);
    else setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[45%] flex-col items-center justify-center relative overflow-hidden p-10"
        style={{ background: 'linear-gradient(135deg, #003d8f 0%, #0052cc 50%, #0066ff 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col items-center text-center gap-8 w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-5">
            <div className="relative h-10 w-40">
              <Image src="/images/logo-pancaran.png" alt="Pancaran" fill className="object-contain" unoptimized />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">PANCARAN AI CORE</h1>
            <p className="text-blue-200 text-sm font-medium">INTERNAL AI ORCHESTRATION & MULTI-AGENT SYSTEM</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-blue-200 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-blue-300 text-xs opacity-60">© 2026 Pancaran Group · AI Core v1.0</p>
          <a href="/" className="text-blue-200 text-xs hover:text-white transition-colors underline">
            ← Back to Home
          </a>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex mb-8 rounded-xl p-1 gap-1" style={{ background: '#f1f5f9' }}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={mode === m
                  ? { background: '#fff', color: '#1e3a8a', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                  : { color: '#94a3b8' }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {alert && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
              style={alert.type === 'success'
                ? { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' }
                : { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
              {alert.type === 'success'
                ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />}
              <span>{alert.message}</span>
            </div>
          )}

          {mode === 'login' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-1">Welcome Back</h2>
                <p className="text-slate-500 text-sm">Sign in to Pancaran AI Core</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="name@pancaran-group.co.id" required disabled={loading}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required disabled={loading}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading || !email || !password}
                  className="w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-white"
                  style={{ background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : 'Sign In →'}
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-bold" style={{ color: '#1d4ed8' }}>
                  Sign up now
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-900 mb-1">Create Account</h2>
                <p className="text-slate-500 text-sm">Join Pancaran AI Core Network</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl mb-5 text-xs"
                style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e' }}>
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <span><strong>Admin</strong> access can only be granted by the primary Admin via User Management.</span>
              </div>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Name as per Employee ID" required disabled={loading}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Email</label>
                  <input type="email" value={signEmail} onChange={e => setSignEmail(e.target.value)}
                    placeholder="name@pancaran-group.co.id" required disabled={loading}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Division / Department</label>
                  <div className="relative">
                    <button type="button" onClick={() => setDivOpen(!divOpen)} disabled={loading}
                      className="w-full border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between"
                      style={{
                        borderColor: selDiv ? '#3b82f6' : '#e2e8f0',
                        background: selDiv ? '#eff6ff' : '#f8fafc',
                        color: selDiv ? '#1e40af' : '#94a3b8',
                      }}>
                      <span className="flex items-center gap-2">
                        {selDiv ? <><span className="text-base">{selDiv.icon}</span><span className="font-semibold text-slate-800">{selDiv.label}</span></>
                          : 'Select your division...'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${divOpen ? 'rotate-180' : ''}`} style={{ color: '#94a3b8' }} />
                    </button>
                    {divOpen && (
                      <div className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden shadow-xl border border-slate-100 bg-white max-h-80 overflow-y-auto">
                        {DIVISIONS.map((d) => (
                          <button key={d.value} type="button" onClick={() => { setSelDiv(d); setDivOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-blue-50">
                            <span className="text-xl flex-shrink-0">{d.icon}</span>
                            <div>
                              <div className="font-semibold text-slate-800 leading-tight">{d.label}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{d.desc}</div>
                            </div>
                            {selDiv?.value === d.value && <CheckCircle2 className="w-4 h-4 ml-auto text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={signPwd} onChange={e => setSignPwd(e.target.value)}
                      placeholder="Minimum 8 characters" required disabled={loading}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                      placeholder="Repeat password" required disabled={loading}
                      className="w-full border rounded-xl px-4 py-3 pr-12 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: confirmPwd && confirmPwd !== signPwd ? '#fca5a5' : '#e2e8f0' }} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading || !fullName || !signEmail || !signPwd || !confirmPwd || !selDiv}
                  className="w-full font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-white mt-2"
                  style={{ background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Create Account →'}
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-3">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-bold" style={{ color: '#1d4ed8' }}>Sign in here</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}