// Reads roster.json from the trainer's repo, then reads submissions/dayN.json
// straight off each student's own fork (public raw file, no auth needed).
// No GitHub API calls are made at all, so there's no rate-limit concern
// even with 40 students refreshing the dashboard at once.

const GITHUB_OWNER = process.env.GITHUB_OWNER || "REPLACE_ME";
const GITHUB_REPO = process.env.GITHUB_REPO || "samsung-genai";
const BRANCH = process.env.SUBMISSIONS_BRANCH || "main";
const TOTAL_DAYS = parseInt(process.env.TOTAL_DAYS || "5", 10);

const CACHE_MS = 25000;
let cache = {}; // keyed by day number -> { data, ts }

async function fetchJSON(url) {
  try {
    const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function rosterUrl() {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/roster.json`;
}

function submissionUrl(username, day) {
  return `https://raw.githubusercontent.com/${username}/${GITHUB_REPO}/${BRANCH}/submissions/day${day}.json`;
}

function tierFor(rankIndex, totalSubmitted) {
  const pct = (rankIndex + 1) / totalSubmitted;
  if (pct <= 0.10) return "gold";
  if (pct <= 0.35) return "silver";
  if (pct <= 0.70) return "bronze";
  return "entry";
}

async function buildForDay(roster, day) {
  const results = await Promise.all(
    roster.map(async (s) => {
      const sub = await fetchJSON(submissionUrl(s.github, day));
      return { github: s.github, name: s.name || s.github, submission: sub };
    })
  );

  const submitted = results.filter(
    (r) => r.submission && typeof r.submission.score === "number"
  );
  submitted.sort((a, b) => b.submission.score - a.submission.score);

  const ranked = submitted.map((r, i) => ({
    github: r.github,
    name: r.name,
    score: r.submission.score,
    tasks_completed: r.submission.tasks_completed ?? null,
    tasks_total: r.submission.tasks_total ?? null,
    rank: i + 1,
    tier: tierFor(i, submitted.length),
  }));

  const pending = results
    .filter((r) => !(r.submission && typeof r.submission.score === "number"))
    .map((r) => ({ github: r.github, name: r.name }));

  return { day, ranked, pending, submitted_count: submitted.length };
}

exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

  const roster = await fetchJSON(rosterUrl());
  if (!Array.isArray(roster) || roster.length === 0) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        error: "roster_empty",
        message: "roster.json not found (or empty) at the repo root.",
      }),
    };
  }

  const requestedDay = parseInt(event.queryStringParameters?.day, 10);
  let day = requestedDay >= 1 && requestedDay <= TOTAL_DAYS ? requestedDay : null;

  // Explicit day requested: use short cache, otherwise compute fresh.
  if (day) {
    const c = cache[day];
    if (c && Date.now() - c.ts < CACHE_MS) {
      return { statusCode: 200, headers, body: JSON.stringify(c.data) };
    }
    const result = await buildForDay(roster, day);
    const payload = {
      ...result,
      total_days: TOTAL_DAYS,
      total_students: roster.length,
      generated_at: new Date().toISOString(),
    };
    cache[day] = { data: payload, ts: Date.now() };
    return { statusCode: 200, headers, body: JSON.stringify(payload) };
  }

  // No day specified: find the most recent day with at least one submission.
  for (let d = TOTAL_DAYS; d >= 1; d--) {
    const c = cache[d];
    const result = c && Date.now() - c.ts < CACHE_MS ? c.data : await buildForDay(roster, d);
    if (result.submitted_count > 0 || d === 1) {
      const payload = {
        ...result,
        total_days: TOTAL_DAYS,
        total_students: roster.length,
        generated_at: new Date().toISOString(),
      };
      cache[d] = { data: payload, ts: Date.now() };
      return { statusCode: 200, headers, body: JSON.stringify(payload) };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ error: "no_data" }) };
};
