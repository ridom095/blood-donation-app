import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function calcAge(dob) {
  if (!dob) return null;
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

export default function HomePage() {
  const { profile, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, real_name, blood_group)')
      .order('created_at', { ascending: false })
      .limit(50);
    setPosts(data || []);
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await supabase.from('posts').insert({ content, user_id: profile.id });
    setContent('');
    await fetchPosts();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <span className="font-black text-xl tracking-tighter text-[#0A0A0A]">Drop<span className="text-[#E50000]">Blood</span></span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">{profile?.real_name}</span>
          <span className="text-xs font-bold text-white bg-[#E50000] px-2 py-1">{profile?.blood_group}</span>
          <button data-testid="btn-logout" onClick={logout} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-[#E50000]">Logout</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile summary */}
        {profile && (
          <div className="border border-zinc-200 p-6 mb-8" data-testid="profile-summary">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-1">Your Profile</p>
            <h2 className="text-2xl font-bold tracking-tight">{profile.real_name}</h2>
            <p className="text-sm text-zinc-500 mt-1">@{profile.username} · Age {calcAge(profile.date_of_birth)} · <span className="text-[#E50000] font-bold">{profile.blood_group}</span></p>
          </div>
        )}

        {/* Post composer */}
        <form onSubmit={submitPost} className="border border-zinc-200 p-6 mb-8">
          <textarea
            data-testid="input-post-content"
            className="w-full text-sm resize-none focus:outline-none text-[#0A0A0A] placeholder-zinc-400"
            rows={3}
            placeholder="Share a donation update or request..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button data-testid="btn-post-submit" type="submit" disabled={loading} className="bg-[#E50000] text-white px-6 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50">
              Post
            </button>
          </div>
        </form>

        {/* Feed */}
        <div className="space-y-0" data-testid="feed">
          {posts.map(post => (
            <div key={post.id} className="border-b border-zinc-100 py-5" data-testid="feed-post">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">{post.profiles?.real_name}</span>
                <span className="text-xs text-[#E50000] font-bold">{post.profiles?.blood_group}</span>
                <span className="text-xs text-zinc-400 ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed">{post.content}</p>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-12">No posts yet. Be the first.</p>
          )}
        </div>
      </main>
    </div>
  );
}
