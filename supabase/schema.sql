-- ╔══════════════════════════════════════════════════════════════╗
-- ║   LUNDIPARK PHOTOGRAPHY — SUPABASE DATABASE SCHEMA          ║
-- ║   Run this in Supabase SQL Editor to create all tables      ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ──────────────────────────────────────────────────────────────
-- TABLE 1: testimonials
-- Stores public testimonials submitted by visitors + admin approval
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  session_type  TEXT NOT NULL,                  -- wedding, family, maternity, etc.
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text          TEXT NOT NULL,
  language      TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'fr')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured   BOOLEAN DEFAULT FALSE,           -- show in main "Kind Words" rotator
  email         TEXT,                            -- optional, for follow-up only
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  approved_at   TIMESTAMPTZ,
  approved_by   UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_testimonials_created ON testimonials(created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- TABLE 2: site_content
-- Stores all editable text content with EN/FR translations
-- Initial values are seeded below
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id          BIGSERIAL PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,             -- e.g., 'hero_h1', 'hey_h2'
  value_en    TEXT NOT NULL,
  value_fr    TEXT NOT NULL,
  category    TEXT,                              -- group: hero, services, about, etc.
  display_order INTEGER DEFAULT 0,
  is_html     BOOLEAN DEFAULT FALSE,            -- true if value contains HTML tags
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_site_content_key ON site_content(key);
CREATE INDEX idx_site_content_category ON site_content(category);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_content_updated
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- TABLE 3: photos
-- Stores all site photos with metadata
-- Photos are stored in Supabase Storage; this table holds references
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS photos (
  id            BIGSERIAL PRIMARY KEY,
  storage_path  TEXT NOT NULL,                  -- path in Supabase Storage bucket
  public_url    TEXT NOT NULL,                  -- full CDN URL
  section       TEXT NOT NULL,                  -- 'hero', 'scrapbook', 'instagram', etc.
  position      TEXT,                            -- subkey like 'svc1', 'sc1', 'ig1'
  alt_text_en   TEXT,
  alt_text_fr   TEXT,
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  uploaded_at   TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by   UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_photos_section ON photos(section, display_order);
CREATE INDEX idx_photos_active ON photos(is_active);

-- ──────────────────────────────────────────────────────────────
-- TABLE 4: admin_users
-- Tracks which auth.users are admins (Lundipark + you)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  full_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE 5: site_stats
-- Optional: track custom events (form submissions, testimonial submissions)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL,                    -- 'booking', 'testimonial_submit', etc.
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_events_type ON site_events(event_type, created_at DESC);


-- ╔══════════════════════════════════════════════════════════════╗
-- ║   ROW LEVEL SECURITY (RLS) POLICIES                          ║
-- ║   Critical for security - controls who can read/write what  ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Enable RLS on all tables
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content   ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_events    ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ─── testimonials policies ───
-- Anyone can submit a testimonial (insert)
CREATE POLICY "Anyone can submit testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- Everyone can read approved testimonials
CREATE POLICY "Public can read approved testimonials"
  ON testimonials FOR SELECT
  USING (status = 'approved');

-- Admins can read all testimonials (pending + rejected too)
CREATE POLICY "Admins can read all testimonials"
  ON testimonials FOR SELECT
  USING (is_admin());

-- Only admins can update/delete testimonials
CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  USING (is_admin());

-- ─── site_content policies ───
-- Everyone can read content (public site)
CREATE POLICY "Public can read content"
  ON site_content FOR SELECT
  USING (true);

-- Only admins can modify content
CREATE POLICY "Admins can insert content"
  ON site_content FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update content"
  ON site_content FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete content"
  ON site_content FOR DELETE
  USING (is_admin());

-- ─── photos policies ───
-- Everyone can read photos
CREATE POLICY "Public can read photos"
  ON photos FOR SELECT
  USING (is_active = true);

-- Admins can do everything with photos
CREATE POLICY "Admins manage photos"
  ON photos FOR ALL
  USING (is_admin());

-- ─── admin_users policies ───
-- Admins can read the admin list
CREATE POLICY "Admins read admin list"
  ON admin_users FOR SELECT
  USING (is_admin());

-- Only super_admins can manage other admins
CREATE POLICY "Super admins manage admins"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ─── site_events policies ───
CREATE POLICY "Anyone can log events"
  ON site_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read events"
  ON site_events FOR SELECT
  USING (is_admin());


-- ╔══════════════════════════════════════════════════════════════╗
-- ║   SEED DATA — Initial site content                          ║
-- ║   Copies the current hardcoded translations into the DB     ║
-- ╚══════════════════════════════════════════════════════════════╝

INSERT INTO site_content (key, value_en, value_fr, category, display_order, is_html) VALUES
  -- Hero
  ('hero_h1', 'Limited Edition Photographer', 'Photographe Édition Limitée', 'hero', 1, false),
  ('hero_h2', 'Capturing moments', 'Capturer les moments', 'hero', 2, false),
  ('hero_cta', 'Contact', 'Contact', 'hero', 3, false),

  -- Service 01 — Micro Weddings
  ('svc1_eyebrow_html', '<em>Micro</em>-Weddings', '<em>Micro</em>-Mariages', 'services', 10, true),
  ('svc1_subtitle_html', '<em>Just the people you love</em>', '<em>Juste les gens que vous aimez</em>', 'services', 11, true),
  ('svc1_p1', 'All the best moments of a grand traditional wedding, but reimagined for a smaller, more intentional celebration. Private vows, longer hugs and a flexible, pressure-free timeline.', 'Tous les meilleurs moments d''un grand mariage traditionnel, mais réinventés pour une célébration plus petite, plus intentionnelle. Des vœux privés, des étreintes plus longues et un planning souple, sans pression.', 'services', 12, false),
  ('svc1_p2', 'Nature can be your church, your dog the ring-bearer, and even your childhood best friend the one saying "I now pronounce you…"', 'La nature peut être votre cathédrale, votre chien le porteur d''alliances, et même votre meilleure amie d''enfance celle qui dit "Je vous déclare unis…"', 'services', 13, false),
  ('svc1_p3', 'Your wedding shouldn''t feel like a performance for others. It should be whatever brings you and your partner the most joy while celebrating your love — no matter what that looks like.', 'Votre mariage ne devrait pas ressembler à une performance pour les autres. Il devrait être ce qui vous apporte, à vous et votre partenaire, le plus de joie en célébrant votre amour — quel que soit son visage.', 'services', 14, false),

  -- Hey I'm Lundipark
  ('hey_h2', 'Hey, I''m Lundipark', 'Bonjour, c''est Lundipark', 'about', 20, false),
  ('hey_left_p1', 'and I loveeeee', 'et j''aimeeeee', 'about', 21, false),
  ('hey_button', 'Wedding Pricing', 'Tarifs Mariages', 'about', 22, false),

  -- For The Couples
  ('fc_eyebrow', 'For the Couples', 'Pour les couples', 'couples', 30, false),
  ('fc_tag_html', '<em>01.</em>WEDDINGS', '<em>01.</em>MARIAGES', 'couples', 31, true),

  -- Kind Words
  ('kw_word1', 'Kind', 'Mots', 'testimonials', 40, false),
  ('kw_word2', 'Words', 'Doux', 'testimonials', 41, false),
  ('kw_tag', 'with love', 'avec amour', 'testimonials', 42, false),

  -- Portfolio
  ('pf_h2', 'Portfolio', 'Portfolio', 'portfolio', 50, false),
  ('pf_t1', 'Weddings', 'Mariages', 'portfolio', 51, false),
  ('pf_t2', 'Couples', 'Couples', 'portfolio', 52, false),
  ('pf_t3', 'Lifestyle', 'Lifestyle', 'portfolio', 53, false),

  -- Album
  ('album_eyebrow', 'The Album', 'L''album', 'album', 60, false),
  ('album_h2', 'Scrapbook', 'Scrapbook', 'album', 61, false),
  ('album_p', 'Precious moments captured with love. From posed shots to candid moments — a glimpse of what we love to create together.', 'Des instants précieux capturés avec amour. Des clichés posés aux moments candides — un aperçu de ce que nous aimons créer ensemble.', 'album', 62, false),

  -- Blog
  ('blog_h2', 'Journal Posts', 'Articles du Journal', 'blog', 70, false),

  -- Next step / Contact
  ('ns_h2', 'Next step — send me the details!', 'Prochaine étape — envoyez-moi les détails !', 'contact', 80, false),
  ('ns_p', 'Curious about pricing first? You can find it here.', 'Curieux des tarifs en premier ? Vous pouvez les trouver ici.', 'contact', 81, false),
  ('ns_btn1', 'Wedding Pricing', 'Tarifs Mariages', 'contact', 82, false),
  ('ns_btn2', 'Couples Pricing', 'Tarifs Couple', 'contact', 83, false),
  ('ns_btn3', 'Lifestyle Pricing', 'Tarifs Lifestyle', 'contact', 84, false),

  -- Footer
  ('footer_copy', '© 2026 Lundipark Photography — All rights reserved', '© 2026 Lundipark Photography — Tous droits réservés', 'footer', 90, false)
ON CONFLICT (key) DO NOTHING;


-- ╔══════════════════════════════════════════════════════════════╗
-- ║   SEED ADMIN USERS                                          ║
-- ║   After running this SQL, manually add admins via Supabase  ║
-- ║   Authentication → Users, then run this:                    ║
-- ║                                                              ║
-- ║   INSERT INTO admin_users (id, email, role, full_name)      ║
-- ║   VALUES (                                                   ║
-- ║     'USER-UUID-FROM-AUTH-USERS',                            ║
-- ║     'lundiparkphotography@gmail.com',                       ║
-- ║     'admin',                                                 ║
-- ║     'Lundipark'                                              ║
-- ║   );                                                         ║
-- ╚══════════════════════════════════════════════════════════════╝


-- ╔══════════════════════════════════════════════════════════════╗
-- ║   STORAGE BUCKET                                            ║
-- ║   After running this SQL, create a bucket in Storage tab:   ║
-- ║   - Name: 'photos'                                          ║
-- ║   - Public: YES (read), authenticated only for writes       ║
-- ╚══════════════════════════════════════════════════════════════╝
