import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', username: '', real_name: '',
    date_of_birth: '', blood_group: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="auth-page">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-10 py-16 bg-white max-w-xl">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400">DropBlood</span>
          <h1 className="text-5xl font-black tracking-tighter text-[#0A0A0A] mt-2 leading-none">
            {mode === 'login' ? 'Welcome back.' : 'Join the cause.'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 border border-[#E50000] text-[#E50000] text-sm" data-testid="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <>
              <input data-testid="input-username" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" placeholder="Username" value={form.username} onChange={e => set('username', e.target.value)} required />
              <input data-testid="input-realname" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" placeholder="Full Name" value={form.real_name} onChange={e => set('real_name', e.target.value)} required />
              <input data-testid="input-dob" type="date" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} required />
              <select data-testid="input-bloodgroup" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000] bg-white" value={form.blood_group} onChange={e => set('blood_group', e.target.value)} required>
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </>
          )}
          <input data-testid="input-email" type="email" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} required />
          <input data-testid="input-password" type="password" className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" placeholder="Password" value={form.password} onChange={e => set('password', e.target.value)} required />

          <button data-testid="btn-submit" type="submit" disabled={loading} className="w-full bg-[#E50000] text-white py-3 text-sm font-semibold tracking-wide uppercase hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button data-testid="btn-toggle-mode" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')} className="text-[#E50000] font-semibold underline">
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>

      {/* Right: Visual */}
      <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: `url('https://static.prod-images.emergentagent.com/jobs/9b713ec9-e8e3-44fb-a0e4-376b640ced36/images/c8a713dc90d0dc228cb8c05dfab34845439215579972f53c3e101fd76f81db94.png')` }} />
    </div>
  );
}
