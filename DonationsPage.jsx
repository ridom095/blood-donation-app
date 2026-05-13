import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DonationsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [community, setCommunity] = useState([]);
  const [form, setForm] = useState({ date: '', location: '', units: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    fetchMy();
    fetchCommunity();
  }, [profile]);

  const fetchMy = async () => {
    const { data } = await supabase.from('donations').select('*').eq('user_id', profile.id).order('date', { ascending: false });
    setDonations(data || []);
  };

  const fetchCommunity = async () => {
    const { data } = await supabase.from('donations').select('*, profiles(real_name, blood_group)').order('date', { ascending: false }).limit(20);
    setCommunity(data || []);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('donations').insert({ ...form, user_id: profile.id });
    setForm({ date: '', location: '', units: 1 });
    await fetchMy();
    await fetchCommunity();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="donations-page">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="font-black text-xl tracking-tighter text-[#0A0A0A]">Drop<span className="text-[#E50000]">Blood</span></button>
        <span className="text-xs uppercase tracking-widest text-zinc-400">Donation Records</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* My History */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">My History</p>

          {/* Add donation */}
          <form onSubmit={submit} className="border border-zinc-200 p-5 mb-6 space-y-3">
            <input data-testid="input-donation-date" type="date" required className="w-full border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <input data-testid="input-donation-location" placeholder="Location" required className="w-full border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <input data-testid="input-donation-units" type="number" min={1} max={5} placeholder="Units" required className="w-full border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]" value={form.units} onChange={e => setForm(f => ({ ...f, units: e.target.value }))} />
            <button data-testid="btn-add-donation" type="submit" disabled={loading} className="w-full bg-[#E50000] text-white py-2 text-xs font-semibold uppercase tracking-widest hover:bg-red-700 disabled:opacity-50">
              Add Record
            </button>
          </form>

          <table className="w-full text-sm" data-testid="my-donations-table">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left py-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Date</th>
                <th className="text-left py-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Location</th>
                <th className="text-right py-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">Units</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} className="border-b border-zinc-100" data-testid="donation-row">
                  <td className="py-3">{d.date}</td>
                  <td className="py-3 text-zinc-600">{d.location}</td>
                  <td className="py-3 text-right font-bold text-[#E50000]">{d.units}</td>
                </tr>
              ))}
              {donations.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-zinc-400">No records yet.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Community Feed */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">Community Feed</p>
          <div className="space-y-0">
            {community.map(d => (
              <div key={d.id} className="border-b border-zinc-100 py-4" data-testid="community-donation">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{d.profiles?.real_name}</span>
                  <span className="text-xs font-bold text-[#E50000]">{d.profiles?.blood_group}</span>
                </div>
                <p className="text-xs text-zinc-500">{d.date} · {d.location} · <span className="font-bold">{d.units} unit{d.units > 1 ? 's' : ''}</span></p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
