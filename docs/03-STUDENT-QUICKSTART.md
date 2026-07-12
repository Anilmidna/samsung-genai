# Getting set up — do this before Day 1

## 1. Fork the repo

Go to `https://github.com/<trainer-username>/samsung-genai` and click **Fork** (top right). This creates your own copy under your GitHub account.

## 2. Clone your fork

```bash
git clone https://github.com/<your-username>/samsung-genai.git
cd samsung-genai
```

## 3. Connect it back to the original repo

This lets you pull new day's content each morning.

```bash
git remote add upstream https://github.com/<trainer-username>/samsung-genai.git
git remote -v
```

You should see both `origin` (your fork) and `upstream` (the trainer's repo).

## 4. Every morning of the program

```bash
git checkout main
git pull upstream main
```

This brings in that day's folder (`dayN/`) — it won't exist until the morning it's released, so don't worry if you don't see it the night before.

## 5. After finishing each day's lab

```bash
git add submissions/dayN.json
git commit -m "Day N submission"
git push origin main
```

Your score appears on the leaderboard dashboard shortly after.

## One thing to get right

Your GitHub username in `roster.json` (maintained by the trainer) has to exactly match your actual GitHub username — that's the only thing linking your fork to your name on the dashboard. Double-check it was entered correctly when you submit your details.
