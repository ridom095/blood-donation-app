import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mnxozxsbswvrdivumkpp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aa8-GC-pzfAvEoxtF6IbyA_xYJ7OZHy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
