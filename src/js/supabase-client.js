// ════════════════════════════════════════════════════════════════
//  SUPABASE CLIENT — Lundipark Photography
//  Used by both public site and admin panel
// ════════════════════════════════════════════════════════════════

// These values are PUBLIC (anon key) — safe to expose in browser
// The Row Level Security (RLS) policies in Supabase protect the data
// Replace these with YOUR values from: Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://xqrskvbhvxwrsdzufgtn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnNrdmJodnh3cnNkenVmZ3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzQ4ODUsImV4cCI6MjA5NDQ1MDg4NX0.XdOh6j974LwIGpEaBNPoBrgQO77em56G8udHbRNXW4o';

// Initialize Supabase client (loaded via CDN in HTML)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ────────────────────────────────────────────────────────────────
//  PUBLIC API — Used by the visitor-facing site
// ────────────────────────────────────────────────────────────────

/**
 * Fetch all approved testimonials, ordered by most recent
 * Filtered by language if specified
 */
async function fetchApprovedTestimonials(language = null) {
  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (language) query = query.eq('language', language);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data || [];
}

/**
 * Submit a new testimonial from a visitor
 * Returns { success: bool, error?: string }
 */
async function submitTestimonial(testimonial) {
  const { name, session_type, rating, text, language, email } = testimonial;

  // Basic validation
  if (!name || !session_type || !rating || !text) {
    return { success: false, error: 'Missing required fields' };
  }
  if (rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be 1-5' };
  }
  if (text.length < 20) {
    return { success: false, error: 'Testimonial too short (min 20 chars)' };
  }
  if (text.length > 1000) {
    return { success: false, error: 'Testimonial too long (max 1000 chars)' };
  }

  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      name: name.trim(),
      session_type,
      rating,
      text: text.trim(),
      language: language || 'en',
      email: email?.trim() || null,
      status: 'pending'
    }])
    .select();

  if (error) {
    console.error('Error submitting testimonial:', error);
    return { success: false, error: error.message };
  }

  // Log event for stats
  await supabase.from('site_events').insert([{
    event_type: 'testimonial_submit',
    metadata: { session_type, rating, language }
  }]);

  return { success: true, data };
}

/**
 * Fetch all site content (text values) at once
 * Returns map: { key: { en, fr, is_html } }
 */
async function fetchSiteContent() {
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value_en, value_fr, is_html');

  if (error) {
    console.error('Error fetching content:', error);
    return {};
  }

  const contentMap = {};
  for (const row of data) {
    contentMap[row.key] = {
      en: row.value_en,
      fr: row.value_fr,
      is_html: row.is_html
    };
  }
  return contentMap;
}

/**
 * Fetch all active photos, grouped by section
 */
async function fetchPhotos() {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('is_active', true)
    .order('section')
    .order('display_order');

  if (error) {
    console.error('Error fetching photos:', error);
    return {};
  }

  // Group by section
  const grouped = {};
  for (const photo of data) {
    if (!grouped[photo.section]) grouped[photo.section] = [];
    grouped[photo.section].push(photo);
  }
  return grouped;
}

// ────────────────────────────────────────────────────────────────
//  ADMIN API — Used by /admin panel (auth required)
// ────────────────────────────────────────────────────────────────

/**
 * Sign in with email + password
 */
async function adminSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };

  // Verify user is in admin_users table
  const { data: adminRow, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (adminError || !adminRow) {
    await supabase.auth.signOut();
    return { success: false, error: 'You are not an admin' };
  }

  return { success: true, user: data.user, admin: adminRow };
}

async function adminSignOut() {
  return await supabase.auth.signOut();
}

async function getCurrentAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  return admin || null;
}

/**
 * Admin: fetch ALL testimonials (any status)
 */
async function fetchAllTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

/**
 * Admin: approve / reject / feature a testimonial
 */
async function updateTestimonialStatus(id, updates) {
  const { data: { user } } = await supabase.auth.getUser();
  const payload = { ...updates };
  if (updates.status === 'approved') {
    payload.approved_at = new Date().toISOString();
    payload.approved_by = user?.id;
  }

  const { data, error } = await supabase
    .from('testimonials')
    .update(payload)
    .eq('id', id)
    .select();

  return { success: !error, data, error: error?.message };
}

async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  return { success: !error, error: error?.message };
}

/**
 * Admin: update a site content row
 */
async function updateContent(key, value_en, value_fr) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('site_content')
    .update({ value_en, value_fr, updated_by: user?.id })
    .eq('key', key)
    .select();

  return { success: !error, data, error: error?.message };
}

/**
 * Admin: upload a photo to Supabase Storage and register it
 */
async function uploadPhoto(file, section, position, altEn = '', altFr = '') {
  const { data: { user } } = await supabase.auth.getUser();
  const fileName = `${section}-${position}-${Date.now()}.${file.name.split('.').pop()}`;
  const filePath = `${section}/${fileName}`;

  // Upload to Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage.from('photos')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) return { success: false, error: uploadError.message };

  // Get public URL
  const { data: urlData } = supabase.storage.from('photos').getPublicUrl(filePath);

  // Insert into photos table
  const { data: photoData, error: dbError } = await supabase
    .from('photos')
    .insert([{
      storage_path: filePath,
      public_url: urlData.publicUrl,
      section,
      position,
      alt_text_en: altEn,
      alt_text_fr: altFr,
      uploaded_by: user?.id,
      is_active: true
    }])
    .select();

  if (dbError) return { success: false, error: dbError.message };
  return { success: true, photo: photoData[0] };
}

async function deletePhoto(id, storagePath) {
  await supabase.storage.from('photos').remove([storagePath]);
  const { error } = await supabase.from('photos').delete().eq('id', id);
  return { success: !error, error: error?.message };
}

/**
 * Admin: get stats summary
 */
async function getAdminStats() {
  const [
    { count: pendingTestimonials },
    { count: approvedTestimonials },
    { count: totalPhotos },
    { count: totalBookings }
  ] = await Promise.all([
    supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('photos').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('site_events').select('*', { count: 'exact', head: true }).eq('event_type', 'booking')
  ]);

  return {
    pendingTestimonials: pendingTestimonials || 0,
    approvedTestimonials: approvedTestimonials || 0,
    totalPhotos: totalPhotos || 0,
    totalBookings: totalBookings || 0
  };
}
