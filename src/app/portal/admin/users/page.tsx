'use client';
// CREATE: src/app/portal/admin/users/page.tsx
// CASE 1: Admin pertama (mochamad.rizki@pancaran-logistic.id) bisa promote user lain

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Users, LogOut, User, Shield, Search,
  CheckCircle2, AlertCircle, RefreshCw, Loader2, X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type PUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  division: string | null;
  status: string;
  created_at: string;
};

const ROLES = [
  { value: 'admin', label: 'Admin', color: '#dc2626', bg: '#fee2e2' },
  { value: 'hmt_manager', label: 'HMT Manager', color: '#d97706', bg: '#fef3c7' },
  { value: 'ops', label: 'Ops', color: '#059669', bg: '#d1fae5' },
  { value: 'finance', label: 'Finance', color: '#2563eb', bg: '#dbeafe' },
  { value: 'cs', label: 'CS', color: '#7c3aed', bg: '#ede9fe' },
  { value: 'commercial', label: 'Commercial', color: '#db2777', bg: '#fce7f3' },
  { value: 'administration', label: 'Administration', color: '#9333ea', bg: '#f3e8ff' },
  { value: 'vendor', label: 'Vendor', color: '#0891b2', bg: '#cffafe' },
  { value: 'user', label: 'User (Default)', color: '#64748b', bg: '#f1f5f9' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [users, setUsers] = useState<PUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data: profile } = await supabase
        .from('portal_users').select('full_name, role, email').eq('id', session.user.id).single();
      if (!profile || profile.role !== 'admin') {
        router.push('/portal'); return;
      }
      setAdminName(profile.full_name || session.user.email || 'Admin');
      setAdminEmail(profile.email || session.user.email || '');
      setAuthLoading(false);
    }
    checkAuth();
  }, [router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portal_users')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data as PUser[]);
    if (error) setAlert({ type: 'error', msg: 'Gagal memuat daftar user: ' + error.message });
    setLoading(false);
  }, []);

  useEffect(() => { if (!authLoading) fetchUsers(); }, [authLoading, fetchUsers]);

  async function updateRole(userId: string, userEmail: string, newRole: string) {
    if (!confirm(`Ubah role user ${userEmail} menjadi "${newRole}"?`)) return;
    const { error } = await supabase
      .from('portal_users')
      .update({ role: newRole })
      .eq('id', userId);
    if (error) {
      setAlert({ type: 'error', msg: 'Gagal: ' + error.message });
    } else {
      setAlert({ type: 'success', msg: `Role ${userEmail} berhasil diubah ke ${newRole}.` });
      await fetchUsers();
    }
  }

  async function toggleStatus(user: PUser) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    if (!confirm(`${newStatus === 'inactive' ? 'Nonaktifkan' : 'Aktifkan'} user ${user.email}?`)) return;
    const { error } = await supabase
      .from('portal_users')
      .update({ status: newStatus })
      .eq('id', user.id);
    if (error) {
      setAlert({ type: 'error', msg: 'Gagal: ' + error.message });
    } else {
      setAlert({ type: 'success', msg: `Status diubah ke ${newStatus}.` });
      await fetchUsers();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const filtered = users.filter(u =>
    !search || u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200">
              <ArrowLeft className="w-3.5 h-3.5" /> Portal
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-200">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-800">User Management</h1>
                <p className="text-[10px] text-slate-400">Kelola akses user dan promosikan admin</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 border border-slate-200">
              <Shield className="w-3 h-3 text-red-600" />
              <span className="text-slate-700 font-semibold hidden sm:inline">{adminName}</span>
              <span className="text-[9px] px-1 py-0.5 rounded font-bold bg-red-100 text-red-700">ADMIN</span>
            </div>
            <button onClick={handleLogout}
              className="p-1.5 rounded-lg text-red-600 bg-red-50 border border-red-100 hover:bg-red-100">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800">Daftar User Sistem</h2>
            <p className="text-xs text-slate-500 mt-1">
              Total <strong>{users.length}</strong> user terdaftar · Klik role untuk mengubah
            </p>
          </div>
          <button onClick={fetchUsers} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Alert */}
        {alert && (
          <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
            style={alert.type === 'success'
              ? { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' }
              : { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
            {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="flex-1">{alert.msg}</span>
            <button onClick={() => setAlert(null)}><X className="w-4 h-4 opacity-60" /></button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari berdasarkan email atau nama..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-400" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-bold text-slate-600 uppercase">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 hidden md:table-cell">Divisi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-slate-400">Tidak ada user ditemukan.</td></tr>
              ) : filtered.map(u => {
                const roleConfig = ROLES.find(r => r.value === u.role) || ROLES[ROLES.length - 1];
                const isCurrentAdmin = u.email === adminEmail;
                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                          {(u.full_name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{u.full_name || '—'}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                        {isCurrentAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-bold">ANDA</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isCurrentAdmin ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded uppercase"
                          style={{ background: roleConfig.bg, color: roleConfig.color }}>
                          {roleConfig.label}
                        </span>
                      ) : (
                        <select value={u.role} onChange={e => updateRole(u.id, u.email, e.target.value)}
                          className="text-[11px] font-bold px-2 py-1 rounded uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                          style={{ background: roleConfig.bg, color: roleConfig.color, border: 'none' }}>
                          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-slate-600">{u.division || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded"
                        style={u.status === 'active'
                          ? { background: '#d1fae5', color: '#059669' }
                          : { background: '#fee2e2', color: '#dc2626' }}>
                        {u.status === 'active' ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isCurrentAdmin && (
                        <button onClick={() => toggleStatus(u)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          style={u.status === 'active'
                            ? { background: '#fee2e2', color: '#dc2626' }
                            : { background: '#d1fae5', color: '#059669' }}>
                          {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
          <p className="font-bold mb-1 flex items-center gap-2"><Shield className="w-4 h-4" /> Petunjuk:</p>
          <ul className="space-y-1 ml-6 list-disc">
            <li>Klik dropdown <strong>Role</strong> untuk mengubah hak akses user.</li>
            <li>Anda tidak dapat mengubah role akun sendiri (untuk mencegah lockout).</li>
            <li>User yang sign up baru otomatis dapat role sesuai divisi yang dipilih (bukan admin).</li>
            <li>Hanya Anda yang bisa promote user lain menjadi <strong>admin</strong>.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}