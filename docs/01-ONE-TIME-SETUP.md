# One-time setup

Do this once, before Day 1 morning. About 30–40 minutes.

## 1. Create the repo

1. On GitHub, create a new **public** repo named `samsung-genai` under your account (or your org).
2. Push this scaffold to it as the initial commit:

```bash
cd samsung-genai
git init
git add README.md .gitignore roster.json docs
git commit -m "Initial setup: docs, roster, workflow"
git branch -M main
git remote add origin https://github.com/<your-username>/samsung-genai.git
git push -u origin main
```

Note what's **not** in that first commit: no `day1/` folder yet. Keep every day's folder out of `git add` until the morning you're actually running it — that's what stops students from browsing ahead.

## 2. Build the roster

Open `roster.json` and list every student's GitHub username (get this by email/form before Day 1 — you can't discover it any other way, and it's the single thing the whole dashboard depends on):

```json
[
  { "github": "priya-devs", "name": "Priya S." },
  { "github": "arjun2026", "name": "Arjun K." }
]
```

Commit and push it:
```bash
git add roster.json && git commit -m "Add cohort roster" && git push
```

You can add/remove students here any time during the program — the dashboard reads it fresh, no redeploy needed.

## 3. Tell students to fork (before Day 1)

Send `docs/03-STUDENT-QUICKSTART.md` (as text, email, or a pinned message) a day or two before Day 1. They need to fork and set up their local clone *before* the first morning, so Day 1 isn't lost to git troubleshooting.

## 4. Deploy the dashboard to Netlify

1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → connect your GitHub → pick `samsung-genai`.
2. Build settings:
   - **Base directory:** `dashboard`
   - **Publish directory:** `.` (this resolves to `dashboard/` because of the base directory above)
   - **Functions directory:** `netlify/functions` (resolves to `dashboard/netlify/functions`)
   - **Build command:** leave blank — it's a static site, nothing to build.
   
   (These are already encoded in `dashboard/netlify.toml`, so Netlify should pick them up automatically — just confirm they match after import.)
3. **Environment variables** (Site settings → Environment variables):
   | Key | Value |
   |---|---|
   | `GITHUB_OWNER` | your GitHub username/org, e.g. `anilsandrapuri` |
   | `GITHUB_REPO` | `samsung-genai` |
   | `TOTAL_DAYS` | `13` (or however many days the program runs) |
4. Deploy. Netlify gives you a URL like `samsung-genai.netlify.app` — rename it under **Site settings → Change site name** to something you'll project on the classroom screen, e.g. `samsung-genai-console.netlify.app`.
5. Open the URL. On Day 0 it'll correctly show "no submissions yet" for every roster entry — that's expected until Day 1 labs are submitted.

## 5. Sanity check before Day 1

- [ ] `roster.json` pushed with every student's correct GitHub username (typos here = a student invisible on the dashboard — worth a manual double-check against their GitHub profile).
- [ ] Every student has forked and can confirm it via `git remote -v` showing both `origin` (their fork) and `upstream` (yours).
- [ ] Dashboard URL loads and shows the roster count correctly.
- [ ] You have `day1/` staged locally, ready to push tomorrow morning (see `02-DAILY-WORKFLOW.md`).

That's it — one-time setup done. Everything after this is the daily loop.
