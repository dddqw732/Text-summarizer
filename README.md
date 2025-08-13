## Text Summarizer

Full-stack web app to quickly summarize long text. Built with Next.js, Supabase Auth/Postgres, and OpenAI. Backend-only OpenAI usage for security. Includes basic tests and SQL schema.

### Features
- Email magic link or OAuth login via Supabase
- Paste text to summarize (initial version: text only)
- Options: length (Short/Medium/Long) and format (Paragraph/Bullets/TL;DR)
- Server verifies user via Supabase and calls OpenAI
- Summaries saved per-user to `summaries` table (RLS-protected)
- History page: view, copy, delete, download your summaries
- Basic cost controls: text length limit, per-user daily request limit, low-cost model default

### Stack
- Frontend: Next.js (App Router, React)
- Backend: Next.js Route Handlers (serverless-ready)
- Auth & DB: Supabase Auth and Postgres (RLS)
- AI: OpenAI API (server-only)
- Tests: Jest + TS

### Requirements
- Node 18+
- A Supabase project (URL + anon key)
- OpenAI API key

### Environment Variables
Create `.env.local` from `.env.example` and fill values:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional
OPENAI_DEFAULT_MODEL=gpt-4o-mini
DAILY_SUMMARY_LIMIT=50
MAX_INPUT_CHARACTERS=8000
```

Notes:
- Do NOT expose `OPENAI_API_KEY` on the client. It is used server-side only.
- Service Role key is not required for normal operation because RLS policies allow authenticated users to manage their own rows. If you add admin-only operations later, use the service role on server only.

### Installation
```
npm install
```

### Dev
```
npm run dev
```
Open `http://localhost:3000`.

### Build & Start
```
npm run build
npm start
```

### Tests
```
npm test
```

### Database Schema
Apply the SQL in `sql/schema.sql` to your Supabase project (via SQL Editor). It creates the `summaries` table and RLS policies.

### Quick Deploy (Vercel)
1. Push this repo to GitHub
2. Import to Vercel
3. Set Environment Variables for Production and Preview:
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Optionally: `OPENAI_DEFAULT_MODEL`, `DAILY_SUMMARY_LIMIT`, `MAX_INPUT_CHARACTERS`
4. Deploy

### API
- `POST /api/summarize` — body: `{ text, options: { length: 'short|medium|long', format: 'paragraph|bullets|tldr', model? } }` — header: `Authorization: Bearer <access_token>`
  - Verifies token server-side → calls OpenAI → returns `{ summary, tokens_used, model }` → saves row
- `GET /api/summaries` — header: `Authorization: Bearer <access_token>` — returns user summaries
- `DELETE /api/summaries/:id` — header: `Authorization: Bearer <access_token>` — deletes a summary belonging to the user

### Commit Messages (suggested)
- feat: scaffold Next.js app and Supabase auth
- feat(api): add summarize endpoint with OpenAI integration
- feat(api): add summaries list and delete endpoints
- feat(ui): add summarize form with options
- feat(ui): add history page with copy/delete/download
- test(api): add unit tests for summarize route
- docs: add README and SQL schema


