# Dry Run — End-to-End Pipeline Test Before Day 1

Test the full student submission flow using a second GitHub account before class starts.

---

## What You Need

| Item | Notes |
|---|---|
| Trainer GitHub username | The account that owns the `samsung-genai` repo |
| Second GitHub account | Plays the student role during the test — create one at github.com with a different email if you don't have one |

---

## Phase 1 — Push the Repo to GitHub (one-time, ~15 min)

### Step 1 — Create the trainer GitHub repo

Go to github.com (logged in as **trainer account**) → click **+** → **New repository**

- Name: `samsung-genai`
- Visibility: **Public** (students must be able to fork it)
- Leave everything else blank → click **Create repository**

---

### Step 2 — Update lab1.html with the real URL

Open:
```
C:\Users\anilh\DPA\Samsung_SRM\samsung-genai\day1\lab\lab1.html
```

Find this text:
```
https://github.com/YOUR-TRAINER-REPO
```

Replace with:
```
https://github.com/YOUR-TRAINER-USERNAME/samsung-genai
```

Save the file.

---

### Step 3 — Update roster.json with your second account

Open:
```
C:\Users\anilh\DPA\Samsung_SRM\samsung-genai\roster.json
```

Replace `YOUR-SECOND-GITHUB-USERNAME` with the actual username of your second account. Save the file.

---

### Step 4 — Push everything to GitHub

Open **Git Bash** and run:

```bash
cd "C:/Users/anilh/DPA/Samsung_SRM/samsung-genai"
git init
git add .
git commit -m "Samsung GenAI Day 1 - initial push"
git branch -M main
git remote add origin https://github.com/YOUR-TRAINER-USERNAME/samsung-genai.git
git push -u origin main
```

> **If the push asks for a password:** GitHub no longer accepts your account password for push — you need a Personal Access Token.
> Go to github.com → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token** → tick the `repo` scope → copy the token → paste it as the password when Git prompts you.

---

### Step 5 — Enable GitHub Pages

Go to:
```
github.com/YOUR-TRAINER-USERNAME/samsung-genai → Settings → Pages
```

- Source: **Deploy from a branch**
- Branch: **main** / Folder: **/ (root)**
- Click **Save**

Your dashboard URL will be:
```
https://YOUR-TRAINER-USERNAME.github.io/samsung-genai/checkin-test.html
```

Wait **3–5 minutes** for GitHub Pages to activate. Then open the URL.

You should see **1 grey card** with your second account username showing "Waiting for push…"

---

## Phase 2 — Dry Run as a Student (~10 min)

Open an **incognito window** (or a different browser). Sign in as your **second GitHub account**.

---

### Step 1 — Fork the trainer repo

Go to:
```
https://github.com/YOUR-TRAINER-USERNAME/samsung-genai
```

Click **Fork** → click **Create fork** (keep all defaults).

---

### Step 2 — Clone your fork

Open **Git Bash** (Windows Start menu → type **Git Bash** → Enter):

```bash
git clone https://github.com/YOUR-SECOND-ACCOUNT/samsung-genai.git
cd samsung-genai
```

---

### Step 3 — Open File Explorer

Press **Windows key + E**

Navigate to where you cloned (Desktop or Documents) → open `samsung-genai` → open `submissions`

You will see **checkin.json** already there.

---

### Step 4 — Edit checkin.json

Right-click **checkin.json** → **Open with** → **Notepad**

Change **only** these two values:

```json
"student_name": "Your Real Name Here",
"github":       "YOUR-SECOND-ACCOUNT"
```

Press **Ctrl+S** → close Notepad.

---

### Step 5 — Open Git Bash inside the samsung-genai folder

In File Explorer, go back up one level so you are inside `samsung-genai` (not submissions).

Right-click on **empty space** inside the folder → **Git Bash Here**

---

### Step 6 — Push

```bash
git add submissions/checkin.json
git commit -m "Day 1 check-in"
git push origin main
```

Authenticate with your **second account** credentials (or PAT if prompted).

---

### Step 7 — Watch the dashboard

Open:
```
https://YOUR-TRAINER-USERNAME.github.io/samsung-genai/checkin-test.html
```

Wait up to **30 seconds** (auto-refreshes automatically) or press **F5**.

The card for your second account should turn **green** with the name you typed.

---

## After a Successful Test

- Leave the second account in `roster.json` — it becomes a permanent test row visible on Day 1
- Add all 40 student GitHub usernames to `roster.json` before class and push
- Show the dashboard URL on the projector — students watch it during Step 6 of Lab 1

---

## If Something Goes Wrong

| Problem | Fix |
|---|---|
| `git push` fails with authentication error | Create a PAT on that account (5 min) — Settings → Developer settings → Personal access tokens → Generate → tick `repo` → paste as password |
| Dashboard URL shows 404 | GitHub Pages is still activating — wait 5 min and try again |
| Card stays grey after push | Wait 30s for auto-refresh, or press F5. GitHub CDN can take up to 1 minute after a push. |
| `checkin.json` not found in submissions folder | The trainer hasn't pushed the file yet — make sure Step 4 (initial push) completed successfully |
| Git Bash Here not visible on right-click | Right-click → Show more options → Git Bash Here |
