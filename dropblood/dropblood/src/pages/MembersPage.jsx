import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('profiles').select('*').order('real_name').then(({ data }) => setMembers(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-white" data-testid="members-page">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="font-black text-xl tracking-tighter text-[#0A0A0A]">Drop<span className="text-[#E50000]">Blood</span></button>
        <span className="text-xs uppercase tracking-widest text-zinc-400">Members</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-zinc-200" data-testid="members-grid">
          {members.map(m => (
            <div key={m.id} className="p-6 border-b border-r border-zinc-100 flex flex-col gap-2" data-testid="member-card">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-600">
                {m.real_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-sm">{m.real_name}</p>
                <p className="text-xs text-zinc-400">@{m.username}</p>
              </div>
              <span className="text-xs font-bold text-[#E50000] border border-[#E50000] px-2 py-0.5 self-start">{m.blood_group}</span>
              <button
                data-testid={`btn-message-${m.id}`}
                onClick={() => navigate(`/messages/${m.id}`)}
                className="mt-auto text-xs uppercase tracking-widest border border-zinc-200 px-4 py-2 hover:border-[#E50000] hover:text-[#E50000] transition-colors"
              >
                Message
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
