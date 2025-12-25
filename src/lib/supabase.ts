import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// URL validation helper
function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️  Supabase environment variables are not set. Image upload will not work.');
} else if (!isValidUrl(supabaseUrl)) {
  console.error('❌ Invalid SUPABASE_URL format. Must be a valid HTTP or HTTPS URL (e.g., https://xxxxx.supabase.co)');
}

export const supabase = supabaseUrl && supabaseServiceRoleKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

