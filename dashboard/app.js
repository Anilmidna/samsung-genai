const TIERS = {
  gold:   { label: "Core Architect",   icon: "🏆", range: "Top 10%" },
  silver: { label: "Signal Engineer",  icon: "🥈", range: "Next 25%" },
  bronze: { label: "Circuit Builder",  icon: "🥉", range: "Next 35%" },
  entry:  { label: "Boot Sequence",    icon: "🌱", range: "Rest" },
};
const TIER_ORDER = ["gold", "silver", "bronze", "entry"];

let selectedDay = null; // null = auto (latest day with submissions)
let knownTotalDays = 5;
let pollTimer = null;

async function fetchLeaderboard(day) {
  const qs = day ? `?day=${day}` : "";
  const res = await fetch(`/api/leaderboard${qs}`, { cache: "no-store" });
  return res.json();
}

function renderTabs(activeDay) {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = "";
  for (let d = 1; d <= knownTotalDays; d++) {
    const btn = document.createElement("button");
    btn.className = "tab" + (d === activeDay ? " active" : "");
    btn.textContent = `Day ${d}`;
    btn.onclick = () => {
      selectedDay = d;
      load();
    };
    tabs.appendChild(btn);
  }
}

function chipHTML(entry, tier) {
  return `
    <div class="chip ${tier}">
      <div class="chip-rank">#${entry.rank}</div>
      <div class="chip-name">${escapeHTML(entry.name)}</div>
      <div class="chip-score">${entry.score}</div>
      ${entry.tasks_total != null ? `<div class="chip-tasks">${entry.tasks_completed}/${entry.tasks_total} tasks</div>` : ""}
      <div class="pins">${"<span></span>".repeat(6)}</div>
    </div>`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function render(data) {
  document.getElementById("updated").textContent = data.generated_at
    ? `Updated ${new Date(data.generated_at).toLocaleTimeString()}`
    : "";

  if (data.error === "roster_empty") {
    document.getElementById("content").innerHTML =
      `<div class="error">roster.json not found or empty at the repo root — add students there first.</div>`;
    return;
  }
  if (data.error === "no_data") {
    document.getElementById("content").innerHTML = `<div class="empty">No submissions yet for any day.</div>`;
    return;
  }

  knownTotalDays = data.total_days || knownTotalDays;
  renderTabs(data.day);

  document.getElementById("stat-submitted").textContent = data.submitted_count ?? 0;
  document.getElementById("stat-total").textContent = data.total_students ?? "–";
  document.getElementById("stat-day").textContent = data.day ?? "–";

  const ranked = data.ranked || [];
  const byTier = { gold: [], silver: [], bronze: [], entry: [] };
  ranked.forEach((r) => byTier[r.tier]?.push(r));

  let html = "";
  if (ranked.length === 0) {
    html += `<div class="empty">No submissions for Day ${data.day} yet.</div>`;
  } else {
    TIER_ORDER.forEach((t) => {
      if (byTier[t].length === 0) return;
      const meta = TIERS[t];
      html += `
        <div class="tier">
          <div class="tier-head">
            <span class="tier-icon">${meta.icon}</span>
            <span class="tier-name">${meta.label}</span>
            <span class="tier-range">${meta.range}</span>
          </div>
          <div class="chip-grid">
            ${byTier[t].map((e) => chipHTML(e, t)).join("")}
          </div>
        </div>`;
    });
  }

  if ((data.pending || []).length > 0) {
    html += `
      <div class="pending-head">Awaiting submission (${data.pending.length})</div>
      <div class="pending-grid">
        ${data.pending.map((p) => `<span class="pending-chip">${escapeHTML(p.name)}</span>`).join("")}
      </div>`;
  }

  document.getElementById("content").innerHTML = html;
}

async function load() {
  try {
    const data = await fetchLeaderboard(selectedDay);
    render(data);
  } catch (e) {
    document.getElementById("content").innerHTML = `<div class="error">Couldn't reach the leaderboard function.</div>`;
  }
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(load, 20000);
}

load();
startPolling();
