# Development Guide

## Local Setup

```bash
# Clone
git clone https://github.com/YOUR-USERNAME/lundipark-photography.git
cd lundipark-photography

# Install dev tools
npm install
```

## Local Development

### Option 1 — Simple static server
```bash
npm run dev
# Visit http://localhost:3000
```

### Option 2 — Wrangler (simulates Cloudflare Pages exactly)
```bash
npm run preview
# Visit http://localhost:8788
```

Use Wrangler when you want to test:
- `_headers` configuration
- `_redirects` routing
- Functions (if added later)

## Project Files

### Public files (`/public/`)
Everything in `public/` gets served by Cloudflare Pages.

- `index.html` — main site (with embedded photos for v1)
- `admin/index.html` — admin panel UI
- `_headers` — Cloudflare HTTP headers config (security, caching)
- `_redirects` — Cloudflare URL rewrites/redirects

### Source files (`/src/`)
- `js/supabase-client.js` — Supabase connection + API helpers
- `js/testimonial-widget.js` — Public testimonial submission modal

### Database (`/supabase/`)
- `schema.sql` — full DB schema with RLS policies + seed data

## Making Changes

### To modify the public site:
1. Edit `public/index.html`
2. Test locally: `npm run dev`
3. Push: `git push` → Cloudflare auto-deploys in ~30s

### To modify the admin panel:
1. Edit `public/admin/index.html`
2. Edit `src/js/supabase-client.js` if adding new DB queries
3. Push to deploy

### To modify the database schema:
1. Edit `supabase/schema.sql`
2. Run the changes in Supabase SQL Editor (manually)
3. Commit the updated SQL file

## Adding a New Admin

In Supabase Dashboard:

1. **Authentication → Users → Add user** (enter email + password)
2. Copy the new user's UUID
3. **SQL Editor**, run:
   ```sql
   INSERT INTO admin_users (id, email, role, full_name)
   VALUES ('NEW-UUID', 'their@email.com', 'admin', 'Their Name');
   ```

The new admin can now log in at `/admin`.

## Updating Site Content

Two ways:

**Option 1 — Admin panel (preferred for non-technical users)**
- Go to `/admin` → Site Content tab
- Edit and save — instant

**Option 2 — SQL update**
```sql
UPDATE site_content
SET value_en = 'New text', value_fr = 'Nouveau texte'
WHERE key = 'hero_h1';
```

## Cloudflare Pages CLI (Wrangler)

```bash
# Local preview with Cloudflare Pages simulation
npx wrangler pages dev public

# Manual deploy (bypasses GitHub auto-deploy)
npx wrangler pages deploy public --project-name=lundipark-photography

# View deployments
npx wrangler pages deployment list --project-name=lundipark-photography
```

## Environment Variables (Cloudflare Pages)

For sensitive keys, you can use Cloudflare Pages environment variables instead of hardcoding:

1. Cloudflare Dashboard → Pages → your project → **Settings → Environment variables**
2. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as variables
3. Update `supabase-client.js` to read them (would require build step)

For v1, hardcoding the public anon key is fine since RLS protects the data.

## Important Files (DO NOT COMMIT)

These are in `.gitignore`:
- `.env*` — environment variables
- `node_modules/`
- `.wrangler/`
- `.dev.vars`

## Deployment Flow

```
GitHub push (main branch)
       ↓
Cloudflare Pages detects change
       ↓
Builds (~10 seconds)
       ↓
Deploys to global edge (Canada included)
       ↓
Live in ~30 seconds total
```

Preview deployments:
- Push to any non-main branch → Cloudflare creates a preview URL
- Format: `https://BRANCH.lundipark-photography.pages.dev`

## Phase 3 — Photo Management (TODO)

Currently photos are embedded as base64 in `index.html` (4.5 MB file).

In Phase 3:
1. Upload all photos to Supabase Storage `photos` bucket
2. Update admin panel to handle uploads (UI already partially done)
3. Replace hardcoded image data URIs with `photo` table lookups
4. Public site fetches photos via `fetchPhotos()` API

This will:
- Reduce HTML file size from 4.5MB to ~50KB
- Enable photo management without code changes
- Allow Lundipark to add/remove photos via admin

## Testing Checklist

Before pushing to production:

- [ ] Test in mobile + desktop
- [ ] Test EN and FR languages
- [ ] Test hero slideshow rotation
- [ ] Test parallax section scroll
- [ ] Test booking form submission (use a test email)
- [ ] Test testimonial submission
- [ ] Test admin login
- [ ] Test approve/reject testimonial
- [ ] Test content editor
- [ ] Check console for JS errors (F12)
- [ ] Check page load speed (PageSpeed Insights)

## Useful Commands

```bash
# Check what will be pushed
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard uncommitted changes
git checkout -- .

# Sync with remote
git pull
```
