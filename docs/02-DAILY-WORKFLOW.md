# Daily workflow

## Trainer — every morning, before class

1. Prep `dayN/` locally the night before: `index.html` (lab landing page), `readme.md` (student-facing, no trainer notes), and everything under `dayN/lab/`.
2. Morning of, sync and push:

```bash
git checkout main
git pull origin main            # in case roster.json etc. changed
git add dayN/
git commit -m "Day N: <topic>"
git push origin main
```

3. That's the whole release step. The folder existing in `main` is what makes it pullable — there's no separate "publish" action.
4. Optional but recommended: post a one-line "Day N is live, pull now" message in whatever channel you use with students (Slack/WhatsApp/email) — `git pull` doesn't notify anyone.

**Never** push `dayN+1` early, even into a branch students might stumble onto — keep unreleased days entirely off `main` and off any branch you've shared with students.

## Students — every morning

```bash
git checkout main
git pull upstream main          # pulls the new dayN/ folder from the trainer's repo
git push origin main            # optional: keeps their own fork's main in sync on GitHub.com
```

If `upstream` isn't set up yet (first time only):
```bash
git remote add upstream https://github.com/<trainer-username>/samsung-genai.git
```

## Students — after finishing the lab

1. Copy `dayN/lab/submission-template.json` to `submissions/dayN.json` at the **root** of their own repo (create the `submissions/` folder if it doesn't exist yet).
2. Fill in `score` and `tasks_completed` honestly per the grading note in that day's `readme.md`.
3. Push to their **own fork** (not upstream — they don't have write access there, and shouldn't need it):

```bash
git add submissions/dayN.json
git commit -m "Day N submission"
git push origin main
```

4. Check the dashboard — it picks up the new submission within ~25 seconds (it's cached briefly server-side to stay polite to GitHub, not because of any manual step on their end).

## What the trainer does *not* need to do daily

- No manual grading spreadsheet — the dashboard reads scores directly off each fork.
- No merging student work into your repo — submissions live entirely in their forks.
- No dashboard redeploy — `roster.json` and every `dayN` folder are read live; only code changes to the dashboard itself need a redeploy (Netlify does that automatically on push to `dashboard/`).
