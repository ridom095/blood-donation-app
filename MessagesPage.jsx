import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function MessagesPage() {
  const { userId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [other, setOther] = useState(null);
  const [text, setText] = useState('');
  const bottom = useRef(null);

  useEffect(() => {
    if (!profile || !userId) return;
    supabase.from('profiles').select('*').eq('id', userId).single().then(({ data }) => setOther(data));
    fetchMessages();

    const channel = supabase.channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchMessages())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile, userId]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${profile.id})`)
      .order('created_at');
    setMessages(data || []);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await supabase.from('messages').insert({ sender_id: profile.id, receiver_id: userId, content: text });
    setText('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="messages-page">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-black/5 px-6 py-4 flex items-center gap-4">
        <button data-testid="btn-back" onClick={() => navigate('/members')} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-[#E50000]">← Back</button>
        <span className="font-semibold text-sm">{other?.real_name}</span>
        <span className="text-xs font-bold text-[#E50000]">{other?.blood_group}</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-2xl w-full mx-auto" data-testid="messages-list">
        {messages.map(m => {
          const isMine = m.sender_id === profile?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`} data-testid="message-bubble">
              <div className={`max-w-xs px-4 py-2 text-sm ${isMine ? 'bg-[#E50000] text-white' : 'bg-zinc-100 text-[#0A0A0A]'}`}>
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>

      <form onSubmit={send} className="border-t border-zinc-200 px-4 py-4 flex gap-3 max-w-2xl w-full mx-auto">
        <input
          data-testid="input-message"
          className="flex-1 border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50000]"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button data-testid="btn-send" type="submit" className="bg-[#E50000] text-white px-6 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-red-700">
          Send
        </button>
      </form>
    </div>
  );
}
