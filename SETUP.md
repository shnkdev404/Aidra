# Running Aidra locally

A step-by-step guide to get every feature — AI chat bot, BMI tracker,
doctor verification, animations — running on your machine.

---

## 1. Prerequisites

Install these first:

| Tool     | Version | Install                                            |
| -------- | ------- | -------------------------------------------------- |
| Node.js  | ≥ 20    | https://nodejs.org (LTS)                           |
| Bun      | ≥ 1.1   | `curl -fsSL https://bun.sh/install \| bash`        |
| Git      | any     | https://git-scm.com                                |

> You can substitute `npm` for `bun` if you prefer — swap `bun install`
> for `npm install` and `bun dev` for `npm run dev`.

---

## 2. Clone & install

```bash
git clone https://github.com/<you>/aidra.git
cd aidra
bun install
```

---

## 3. Configure environment variables

1. Copy the template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste real values.

Where to get each value:

- **SUPABASE_URL / VITE_SUPABASE_URL / SUPABASE_PROJECT_ID**
  Lovable → your project → **View Backend** → *Project Settings → API*.
- **SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_PUBLISHABLE_KEY**
  Same page — the "publishable" or "anon" key. Safe to expose to the browser.
- **SUPABASE_SERVICE_ROLE_KEY**
  Same page under "Service role". **Server-only** — never expose it.
- **LOVABLE_API_KEY**
  Powers the AI chat bot. Lovable → **View Backend** → *Edge Functions → Secrets*.

---

## 4. Start the dev server

```bash
bun dev
```

Open http://localhost:8080. Vite hot-reloads on file changes.

---

## 5. Feature checklist — how to use each part

### 5.1 Sign in / sign up
- **Patients** → `/auth`  (email + password, or Google)
- **Doctors** → `/doctor-auth`
Passwords are validated client-side, checked against known-breach lists
server-side, and never stored in plain text.

### 5.2 AI health chat bot  🩺
- Sign in as a patient, go to **/chat**.
- Click **New consultation** → type a question.
- Threads persist to the database. Titles auto-generate from your first
  message. Markdown responses stream in.
- The AI runs through the Lovable AI Gateway using `LOVABLE_API_KEY` on
  the server — no keys touch the browser.

### 5.3 BMI + health records  📊
- Go to **/health**.
- Enter height (cm) + weight (kg) → **Save entry**.
- Your BMI history is graphed with Recharts, newest on the right.

### 5.4 Doctor verification  ✅
1. Sign up at `/doctor-auth?mode=signup`.
2. You'll land on `/doctor/verify`.
3. Fill in **name, license number, specialty, country, short bio**.
   - Name/specialty/country accept letters, spaces, hyphens, apostrophes
     only (so `====` is rejected).
4. Click **Save draft** to save, or **Submit & pay $49** to move to the
   `pending_payment` state.
5. Once Stripe is enabled (see §6), that button opens Stripe Checkout.
   After a successful payment your app flips to `submitted` and an admin
   manually approves it.

### 5.5 Landing pages & animations
- `/` — patient landing (Editorial Calm palette, aurora orbs, magnetic
  buttons, staggered fade-ins).
- `/for-doctors` — dark editorial landing with gold accents.
- Animation primitives live in `src/components/animated/`:
  `FadeIn`, `StaggerChildren`, `AuroraBackdrop`, `ShinyText`, `Magnetic`.

---

## 6. Enable Stripe (optional — required for real doctor payments)

The doctor flow currently marks applications `pending_payment` without
charging. To turn on real payments:

1. In Lovable chat, ask: *"Enable Stripe payments"*.
   Lovable's built-in Stripe integration handles the account setup for
   you — no manual keys needed.
2. Lovable will:
   - Create a Stripe Checkout session server function.
   - Add a webhook route at `/api/public/webhooks/stripe`.
   - Store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for you.
3. Redeploy locally: `bun dev`. The **Submit & pay $49** button now opens
   Stripe Checkout.

---

## 7. Useful scripts

```bash
bun dev           # start local dev server (http://localhost:8080)
bun run build     # production build
bun run preview   # preview the production build
bun run lint      # eslint
```

---

## 8. Troubleshooting

| Symptom                                              | Fix                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Blank page + "Missing SUPABASE_URL"                  | You forgot the `VITE_` copies in `.env`. Both are required.                                |
| Chat replies with "Missing LOVABLE_API_KEY"          | Add `LOVABLE_API_KEY` to `.env`, restart `bun dev`.                                        |
| "Unauthorized" on protected routes                   | Sign in again — your local session cookie expired.                                         |
| Doctor form rejects a legit name                     | The name regex allows letters/spaces/`-`/`'`/`.` only. Remove digits or symbols like `=`.  |
| Google sign-in returns "Unsupported provider"        | The Google OAuth provider isn't configured in Lovable Cloud. Ask Lovable to configure it.  |
| Port 8080 already in use                             | `PORT=5173 bun dev` or kill the other process.                                             |

---

## 9. Deploying

Push to GitHub → connect the repo in Lovable → **Publish**. Or run
`bun run build` and deploy the `.output/` directory to any Node/Edge host
(Cloudflare Workers is the default target).

Happy shipping. 🌿
