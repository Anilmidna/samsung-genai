# samsung-genai

Repo + workflow + dashboard for the Samsung GenAI cohort. One repo drives three things:

1. **Daily content drop** — you push `dayN/` each morning; students pull it.
2. **Lab submissions** — students push a small JSON score file to their own fork.
3. **Leaderboard dashboard** — a Netlify site reads every student's fork and ranks them into 4 gamified tiers, no manual grading spreadsheet.

## Repo layout

```
samsung-genai/
├── roster.json              ← you maintain: list of student GitHub usernames
├── day1/
│   ├── readme.md             ← student-facing, zero trainer notes
│   ├── index.html            ← lab landing page (mission brief, tasks)
│   └── lab/
│       └── submission-template.json
├── day2/  day3/  ...          ← same shape, added morning-of only
├── docs/
│   ├── 01-ONE-TIME-SETUP.md   ← do this once, before Day 1
│   ├── 02-DAILY-WORKFLOW.md   ← what you do every morning, what students do every morning
│   └── 03-STUDENT-QUICKSTART.md ← send this to students before Day 1
└── dashboard/                 ← deployed to Netlify separately, reads from this same repo
    ├── index.html / styles.css / app.js
    └── netlify/functions/leaderboard.js
```

## How the three pieces connect

- **Content flow (you → students):** students fork `samsung-genai` once. Each morning you push that day's folder to *your* repo's `main`. Students `git pull upstream main` into their fork. They never see `day5` until you've pushed it — nothing later than today's folder ever exists in the repo.
- **Submission flow (students → dashboard):** a student never pushes to *your* repo — they push a `submissions/dayN.json` file to their *own* fork. No merge conflicts, no PR queue for 35–40 people.
- **Dashboard:** a Netlify Function reads `roster.json` from your repo, then reads `submissions/dayN.json` straight off each student's fork on GitHub (public raw file, no auth needed), scores and ranks them, and serves it to the dashboard page, which polls every ~20s.

## Assumptions I made (flag if wrong)

- Repo is **public**. This is what makes "read every student's fork" work with zero auth tokens and no rate-limit headaches. If this needs to be private, tell me — it's doable but needs a GitHub App/PAT with fork read access and changes the dashboard function.
- Cohort size ~35–40, same order of magnitude as the Sigmoid bootcamp.
- 4 gamified tiers are **percentile-based among students who've submitted that day** (top 10% / next 25% / next 35% / rest), not fixed score cutoffs — so it stays fair regardless of how hard a given day's lab is.
- Program length defaulted to 13 days (matches the Sigmoid GenAI-for-DE curriculum length) — change `TOTAL_DAYS` in one place if different.

Read `docs/01-ONE-TIME-SETUP.md` next.
