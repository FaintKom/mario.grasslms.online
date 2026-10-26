/**
 * Module 4 · M4 ICP Buyer Fit · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * bootModule + task-banner + welcome/summary cards + 9 steps. Score a lead
 * 1-5 on five ICP criteria before you dial, against a scale with an example
 * for every score. Below 18/25 skip, 18-21 dial this week, 22+ dial today.
 *
 * The five course buyers come from scorm-shell/data/sample-profiles.json;
 * this module's own leads (data/prospects.json) are near-misses that look
 * like a real buyer on one signal. In the solo task the learner scores three
 * leads, two of them traps; each is checked against a reference score
 * (total within 2 points, same verdict).
 */

import { bootModule } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";
import { loadProfiles, loadCalls, findProfile, pickCalls } from "../scorm-shell/js/apps/profiles.js";
import { EVENT } from "../scorm-shell/js/event-log.js";
import { resolveDates, fill } from "../scorm-shell/js/dates.js";
/** "a", "a and b", "a, b and c" */
const listJoin = arr => arr.length < 3 ? arr.join(" and ") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`;


const DIAL_LOCK = "In this module you score leads instead of dialling them.";
const TOLERANCE = 2;

/** The scale. Every score has a description and an example from the course's buyers. */
const RUBRIC = [
  { k: "industry", label: "Industry fit", levels: {
    5: ["Core segment with several sites (retail, manufacturing, restaurant groups), or funded SaaS", "Maria's 2 stores, Emma's 3 sites, Tom's Series B"],
    4: ["A core segment with one site, or a close neighbour such as wholesale or distribution", "Sven's industrial wholesale"],
    3: ["Services with some card spend", "a creative agency with two studios"],
    2: ["A sector we rarely win", "a one-person consultancy"],
    1: ["Outside SMB altogether", "a public-sector body"] } },
  { k: "fte", label: "FTE band", levels: {
    5: ["20-99 FTE", "Maria 35, Emma 78, Sven 64"],
    4: ["15-19 or 100-149 FTE", "a 120-person firm"],
    3: ["10-14 or 150-179 FTE", "a 14-person bakery"],
    2: ["5-9 FTE", "an 8-person café"],
    1: ["Under 5, or 180+ (pass to the mid-market team)", "a 180-person Series-C company"] } },
  { k: "spend", label: "Monthly card spend", levels: {
    5: ["€30K or more a month", "Lukas €31K, Emma £42K"],
    4: ["€18K-29K", "Tom €18K, Sven €27K, Maria £25K"],
    3: ["€10K-17K", "€12K a month"],
    2: ["€5K-9K: below the €10K floor", "€6K a month"],
    1: ["Under €5K", "€3K a month"] } },
  { k: "dm", label: "Decision-maker access", levels: {
    5: ["You're talking to the owner or founder who signs off spend", "Maria, Tom, Lukas"],
    4: ["Head of the function that owns spend, reporting to the owner", "Emma (ops head, reports to the MD), Sven"],
    3: ["A manager who influences but doesn't sign", "a finance manager"],
    2: ["No named contact yet", "an info@ inbox"],
    1: ["A buying committee or procurement team", "a CFO-led committee"] } },
  { k: "intent", label: "Intent signal (recent)", levels: {
    5: ["Replied or asked for a call in the last week", fill("Emma: \"interesting, talk {{today}}?\"")],
    4: ["A dated growth event in the last 6 months: new site, funding round", fill("Maria's second store ({{mon:maria_store}}), Tom's Series B ({{mon:tom_series_b}})")],
    3: ["Growth news without a date, or hiring for roles that touch spend", "Sven hiring a procurement assistant"],
    2: ["Routine filings only", "annual or micro-entity accounts"],
    1: ["No signal, or one that points away", "flat accounts, \"current setup works\""] } },
];
const VERDICTS = { today: "Dial today", week: "Dial this week", skip: "Skip" };
const verdictFor = total => (total >= 22 ? "today" : total >= 18 ? "week" : "skip");

/** Reference score for Emma, the real buyer in the solo set. */
const EMMA_REFERENCE = {
  industry: 5, fte: 5, spend: 5, dm: 4, intent: 5, verdict: "today",
  why: "Manufacturing with 3 sites, 78 people, £42K a month, an ops head who reports to the MD and a reply asking to talk today add up to 24. She gets a call today.",
};

const state = {
  api: null, step: 0, startedAt: 0, finished: false,
  profiles: [], extraLeads: [], calls: [], quizItems: [], quizIndex: 0, quizScore: 0,
  stepTs: {},
  workedDone: false,
  sven: { tries: 0, ok: false },
  solo: [],          // [{ name, company, scores, total, verdict, ref, ok }]
  soloIndex: 0,
};

// --- Data + boot ---------------------------------------------------------------

async function loadJson(p) { const r = await fetch(p); if (!r.ok) throw new Error(`${p}: ${r.status}`); return resolveDates(await r.json()); }

async function start() {
  try {
    const [profiles, shared, notes, extra, quiz] = await Promise.all([
      loadProfiles(), loadCalls(),
      loadJson("./data/transcripts.json"),
      loadJson("./data/prospects.json"),
      loadJson("./data/quiz.json"),
    ]);
    state.profiles = profiles;
    state.extraLeads = extra.leads ?? [];
    state.calls = [...notes, ...pickCalls(shared, ["GC-01"])];
    state.quizItems = normalizeQuiz(quiz);
    if (!findProfile(profiles, "L-003") || !findProfile(profiles, "L-005")) throw new Error("buyer profiles missing");
  } catch (err) { console.error("[M4]", err); renderFatal(err.message); return; }
  bootModule({
    moduleId: "M4",
    title: "Module 4: ICP buyer fit",
    appsToLaunch: [],
    onReady(api) {
      state.api = api; state.startedAt = Date.now();
      wireProgressTimer(); wireHelpButton(); wireNarrativeButtons();
      showWelcomeCard(() => runStep(0));
    },
  });
}
start();

const STEPS = [
  { title: "Eight minutes spent on a lead that was never going to buy", handler: stepGainAttention },
  { title: "What you will practise in this module",                  handler: stepStateOutcome },
  { title: "Why the lead comes before the three moves",              handler: stepRecallPrior },
  { title: "M.G.'s score for Maria before he dials her",             handler: stepWorkedExample },
  { title: "Choosing a score for Sven",                              handler: stepCompletionProblem },
  { title: "Scoring three leads on your own",                        handler: stepSoloProblem },
  { title: "J.T.'s review of your scores",                           handler: stepFeedback },
  { title: "Four questions from J.T.",                               handler: stepQuiz },
  { title: "M.G.'s note and a reminder in seven days",               handler: stepTakeaway },
];

function runStep(i) {
  state.step = i;
  // Each step mounts its own action bar and highlight; drop the previous step's ones.
  document.querySelectorAll(".mx-bar").forEach(el => el.remove());
  document.querySelectorAll(".is-warm-highlight").forEach(el => el.classList.remove("is-warm-highlight"));
  document.getElementById("gagne-step").textContent = `Step ${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body"); body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  next.disabled = false; next.setAttribute("aria-disabled", "false");
  STEPS[i].handler(body);
}

function completeStep(from, delay = 450) {
  if (!state.stepTs[from]) state.stepTs[from] = timestamp();
  setTimeout(() => { if (state.step === from) runStep(from + 1); }, delay);
}

function showWelcomeCard(onStart) {
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const card = document.createElement("div");
  card.className = "welcome-card";
  card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true");
  card.innerHTML = `
    <div class="welcome-card__panel">
      <span class="welcome-card__logo" aria-hidden="true">FTC</span>
      <h2 class="welcome-card__title">ICP buyer fit</h2>
      <p class="welcome-card__lede">
        Over the next ten minutes you will learn to score a cold lead from 1 to 5 on
        the five criteria of our ideal customer profile before you dial. A lead under
        18 out of 25 is one you skip, and the time goes to a buyer who can say yes.
      </p>
      <button type="button" class="welcome-card__start" data-action="start">
        Start module &rarr;
      </button>
    </div>`;
  document.body.appendChild(card);
  const btn = card.querySelector("[data-action='start']");
  btn?.focus({ preventScroll: true });
  btn?.addEventListener("click", () => {
    card.classList.add("welcome-card--out");
    setTimeout(() => { card.remove(); if (overlay) overlay.style.visibility = ""; onStart?.(); }, 220);
  });
}

function updateProgressBar(c) {
  const bar = document.getElementById("step-progress");
  if (!bar) return;
  bar.setAttribute("aria-valuenow", String(c));
  bar.querySelectorAll(".step-progress__seg").forEach(s => {
    const n = Number(s.dataset.step);
    s.dataset.state = n < c ? "done" : n === c ? "current" : "pending";
  });
}

function wireNarrativeButtons() {
  document.getElementById("narrative-next").addEventListener("click", () => {
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
  document.getElementById("narrative-back").addEventListener("click", () => { if (state.step > 0) runStep(state.step - 1); });
  document.getElementById("narrative-redo")?.addEventListener("click", () => runStep(state.step));
  document.getElementById("narrative-skip")?.addEventListener("click", () => {
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
}
/** Help opens Slack with the ICP scoring card pinned for this step. */
function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => {
    const h = state.step === 2 ? "pre-training" : "M4";
    state.api.os.openApp("slack", { highlightModule: h });
  });
}
function wireProgressTimer() {
  const el = document.getElementById("module-progress");
  const tick = () => { el.textContent = `${timestamp()} / 10:00`; };
  tick(); setInterval(tick, 1000);
}

// --- Window helpers -------------------------------------------------------------

function appBody(appId) { return document.querySelector(`.os-window.app--${appId} .os-window-body`); }
function isOpen(appId) { return Boolean(document.querySelector(`.os-window.app--${appId}`)); }
function keepOnly(appIds) { if (!state.api?.os?.listWindows) return; const k = new Set(appIds); for (const w of state.api.os.listWindows()) if (!k.has(w.appId)) state.api.os.closeApp(w); }
function openOutreach() {
  state.api.os.openApp("outreach", { dialLocked: DIAL_LOCK, leads: [...state.profiles, ...state.extraLeads] });
  return appBody("outreach");
}
function openGong() {
  state.api.os.openApp("gong", { transcripts: state.calls, activeTranscriptId: state.calls[0]?.id });
}
function waitFor(fn, cb, tries = 40) {
  const v = fn();
  if (v) return cb(v);
  if (tries > 0) setTimeout(() => waitFor(fn, cb, tries - 1), 80);
}
function leadRow(body, name) {
  return [...(body?.querySelectorAll(".lead-row") ?? [])].find(r => r.querySelector(".name")?.textContent.trim() === name);
}
function bar(host, attr, text, button) {
  host.querySelector(`[${attr}]`)?.closest(".mx-bar")?.remove();
  const el = document.createElement("div");
  el.className = "mx-bar";
  el.innerHTML = `<span>${text}</span><button type="button" class="mx-btn" ${attr}>${button}</button>`;
  host.appendChild(el);
  return el;
}
const money = (lead) => `${lead.currency === "GBP" ? "£" : "€"}${Math.round((lead.monthly_spend ?? 0) / 1000)}K`;

// --- Steps 1-3 -------------------------------------------------------------

function stepGainAttention(body) {
  body.innerHTML = `
    <blockquote class="peer-quote">
      I once spent eight minutes on a four-person craft shop that had no budget and
      no one who could sign.
      <cite>From the exit interview of a rep who left in month five</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      M.G. scores each lead before he dials and spends his calls on the ones that fit.
    </p>`;
  const ob = openOutreach();
  if (!ob) return;
  mountTaskBanner(ob, { id: "m4-s1-pick", label: "Click Maria's row in Outreach.", state: "active" });
  waitFor(() => leadRow(appBody("outreach"), "Maria"), row => {
    if (state.step !== 0) return;
    row.classList.add("is-warm-highlight");
    if (row.dataset.m4Bound) return;
    row.dataset.m4Bound = "true";
    row.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]') || state.step !== 0) return;
      markTaskBannerDone("m4-s1-pick");
      state.api.eventLog?.record?.("step1_picked_lead");
      completeStep(0);
    });
  });
}

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">In this module you will score leads from 1 to 5 on each of these five criteria:</p>
    <ol style="font-size:13.5px;margin:6px 0 10px 18px;">
      ${RUBRIC.map(c => `<li>${c.label} · 1-5</li>`).join("")}
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Under 18 out of 25 you skip the lead. With 18 to 21 it goes on this week's list, and with
      22 or more it gets a call today. The scale, with an example for every score, sits next to
      each slider and under Help.
    </p>`;
  openOutreach();
  waitFor(() => appBody("outreach")?.querySelector(".lead-row"), () => {
    if (state.step !== 1) return;
    const ob = appBody("outreach");
    mountTaskBanner(ob, { id: "m4-s2-confirm", label: "Read the scoring rule in the side panel and click Got it below.", state: "active" });
    bar(ob, "data-m4-s2-done", "You score five criteria from 1 to 5, and anything under 18 out of 25 is skipped.", "✓ Got it")
      .querySelector("button").addEventListener("click", () => {
        if (state.step !== 1) return;
        markTaskBannerDone("m4-s2-confirm");
        completeStep(1);
      });
  });
}

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      The three moves from the first modules only pay off when the lead could buy in the
      first place. That is why scoring comes before any of them.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Open Gong to see how M.G. scored Maria before he called her.</p>`;
  const done = () => {
    if (state.step !== 2) return;
    markTaskBannerDone("m4-s3-open-gong");
    completeStep(2, 500);
  };
  openOutreach();
  waitFor(() => appBody("outreach"), ob => {
    if (state.step !== 2) return;
    mountTaskBanner(ob, { id: "m4-s3-open-gong", label: "Open Gong with the button below.", state: "active" });
    if (isOpen("gong")) { done(); return; }
    bar(ob, "data-m4-s3-open", "M.G. scored Maria before he dialled her, and his notes are in Gong.", "🎙 Open Gong")
      .querySelector("button").addEventListener("click", () => { openGong(); done(); });
  });
}

// --- Step 4 -----------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">In about a minute <strong>M.G.</strong> scores Maria on the five criteria and reaches 23 out of 25. GC-01, the call he made afterwards, is next to his notes in the list.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">When you have read his five scores, click Watched it under the notes.</p>`;
  openGong();
  waitFor(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    if (state.step !== 3) return;
    const gb = appBody("gong");
    mountTaskBanner(gb, { id: "m4-s4-watch", label: "Read M.G.'s five scores, then click Watched it.", state: "active" });
    const complete = () => {
      if (state.step !== 3) return;
      state.workedDone = true;
      markTaskBannerDone("m4-s4-watch");
      state.api.eventLog?.record?.(EVENT.WORKED_EXAMPLE_COMPLETED);
      completeStep(3);
    };
    bar(gb, "data-m4-s4-done", "M.G. gives Maria 5, 5, 4, 5 and 4, which makes 23 out of 25. He calls her the same day.", "✓ Watched it")
      .querySelector("button").addEventListener("click", complete);
    if (!gb.dataset.m4ChipBound) {
      gb.dataset.m4ChipBound = "true";
      gb.addEventListener("click", e => { if (e.target.closest?.(".m-chip")) complete(); });
    }
  });
}

// --- Step 5 -----------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  const sven = findProfile(state.profiles, "L-005");
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>${sven.name}</strong> runs a family-owned industrial wholesale business in Hamburg with
      ${sven.fte} people. It spends about ${money(sven)} a month on cards, and the operations head makes
      the decisions. The company has filed accounts showing 18% growth and is hiring a procurement assistant.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Choose his score and what you would do with him in the panel under his row.</p>`;
  const options = [
    { label: "A", result: "anti", text: "Skip him, the company is too small.", rationale: "With 64 people and €27K a month on cards he is well inside the profile: size scores 5 and spend scores 4." },
    { label: "B", result: "anti", text: "Pass him to an account executive as an enterprise lead.", rationale: "A company of 64 people is a mid-sized SMB, and only companies with 180 or more go to the mid-market team." },
    { label: "C", result: "correct", text: "Dial him this week, with 20 out of 25.", rationale: "Industrial wholesale scores 4, 64 people 5, €27K a month 4, the operations head 4 and the procurement hire 3. That adds up to 20 and puts him on this week's list." },
    { label: "D", result: "partial", text: "Skip him for now, with 16 out of 25.", rationale: "That total scores him too low on size and spend. The scale gives him 20." },
  ];
  openOutreach();
  waitFor(() => leadRow(appBody("outreach"), "Sven"), row => {
    if (state.step !== 4) return;
    mountSvenDrawer(appBody("outreach"), row, sven, options);
  });
}

function mountSvenDrawer(ob, row, sven, options) {
  mountTaskBanner(ob, { id: "m4-s5-pick", label: "Score Sven in the panel under his row. The scale is under Help.", state: "active" });
  row.classList.add("is-warm-highlight");
  ob.querySelector("[data-m4-s5-drawer]")?.remove();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m4-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Scoring Sven before you call him</strong>
    </header>
    <p class="tom-drawer__stem">${sven.fte} people, about ${money(sven)} a month on cards, the operations head decides, and the latest signals are: ${escapeHtml(sven.signals.map(s => s.content.replace(/[.·]+\s*$/, "")).join("; "))}.</p>
    <div class="tom-drawer__opts" role="radiogroup">
      ${options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-result="${o.result}" data-idx="${i}"><span class="tom-drawer__label">${o.label}</span><span class="tom-drawer__text">${o.text}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" hidden></div>`;
  row.insertAdjacentElement("afterend", drawer);
  drawer.scrollIntoView({ block: "nearest" });
  const fb = drawer.querySelector(".tom-drawer__fb");
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.step !== 4 || state.sven.ok) return;
      const opt = options[Number(btn.dataset.idx)];
      state.sven.tries += 1;
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.classList.remove("is-correct", "is-incorrect"); b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.result === "correct" ? "is-correct" : "is-incorrect");
      if (opt.result !== "correct") drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      fb.hidden = false; fb.textContent = opt.rationale;
      fb.scrollIntoView({ block: "nearest" });
      if (opt.result === "correct") {
        state.sven.ok = true;
        markTaskBannerDone("m4-s5-pick");
        state.api.eventLog?.record?.(EVENT.COMPLETION_PROBLEM_COMPLETED, { tries: state.sven.tries });
        completeStep(4, 900);
      }
    });
  });
}

// --- Step 6 · solo: score three leads, two of them traps ---------------------------

function soloLeads() {
  const emma = findProfile(state.profiles, "L-003");
  const helio = state.extraLeads.find(l => l.lead_id === "M4-D-002");
  const oak = state.extraLeads.find(l => l.lead_id === "M4-D-003");
  return [
    { lead: helio, ref: helio.reference },
    { lead: emma, ref: EMMA_REFERENCE },
    { lead: oak, ref: oak.reference },
  ];
}

function stepSoloProblem(body) {
  keepOnly(["outreach"]);
  state.solo = [];
  state.soloIndex = 0;
  body.innerHTML = `
    <p style="font-size:14px;">Three leads from this morning's queue are waiting in Outreach. Score each one on the five criteria, then decide whether to call today, call this week or skip it.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Two of them look better than they are. An answer counts when your decision matches J.T.'s and your total is within ${TOLERANCE} points of his.</p>
    <p class="retention-note" data-m4-solo-status aria-live="polite">You haven't scored any of the three leads yet.</p>`;
  openOutreach();
  waitFor(() => appBody("outreach")?.querySelector(".lead-row"), () => {
    if (state.step !== 5) return;
    renderSoloLead();
  });
}

function renderSoloLead() {
  const ob = appBody("outreach");
  if (!ob) return;
  const items = soloLeads();
  const { lead } = items[state.soloIndex];
  mountTaskBanner(ob, { id: "m4-s6-solo", label: `Score ${lead.company} (lead ${state.soloIndex + 1} of 3) and choose what to do with it.`, state: "active" });
  ob.querySelectorAll(".is-warm-highlight").forEach(n => n.classList.remove("is-warm-highlight"));
  ob.querySelector("[data-m4-s5-drawer]")?.remove();
  const row = leadRow(ob, lead.name);
  row?.classList.add("is-warm-highlight");
  ob.querySelector("[data-m4-s6-stage]")?.remove();
  const stage = document.createElement("div");
  stage.className = "mx-stage";
  stage.setAttribute("data-m4-s6-stage", "");
  stage.innerHTML = `
    <div style="font-size:14px;font-weight:700;color:var(--ftc-ink)">Lead ${state.soloIndex + 1} of 3: ${escapeHtml(lead.name)} at ${escapeHtml(lead.company)}</div>
    <div style="font-size:12.5px;color:var(--ftc-ink-2);margin:2px 0 8px">${escapeHtml(lead.industry)}, ${lead.fte} people and about ${money(lead)} a month on cards (${escapeHtml(String(lead.stage).replace(/ · /g, ", "))}).</div>
    <ul style="margin:0 0 8px 18px;padding:0;font-size:12.5px;color:var(--ftc-ink)">
      ${(lead.signals ?? []).map(s => `<li>${escapeHtml(s.content)}</li>`).join("")}
      ${lead.lead_id === "L-003" ? `<li>${fill('Replied to sequence email 3 ({{dm:-1}}): "interesting, talk {{today}}?"')}</li>` : ""}
    </ul>
    ${RUBRIC.map(c => `
      <div style="display:grid;grid-template-columns:150px 1fr 26px;gap:10px;align-items:center;margin:8px 0 0">
        <label for="m4-${c.k}" style="margin:0;font-size:13px;color:var(--ftc-ink)">${c.label}</label>
        <input type="range" id="m4-${c.k}" data-k="${c.k}" min="1" max="5" value="3" step="1" style="width:100%" aria-describedby="m4-${c.k}-d">
        <output for="m4-${c.k}" id="m4-${c.k}-v" style="font-family:var(--ftc-font-mono);font-size:13px;font-weight:700;text-align:right;color:var(--brand-green-deep)">3</output>
      </div>
      <div id="m4-${c.k}-d" style="font-size:11.5px;color:var(--ftc-ink-2);margin:2px 0 0 160px"></div>`).join("")}
    <div class="mx-row" style="justify-content:space-between;border-top:1px solid var(--ftc-border);padding-top:10px;margin-top:12px">
      <span data-m4-total style="font-family:var(--ftc-font-mono);font-size:13px;color:var(--ftc-ink)"></span>
      <span role="radiogroup" aria-label="Verdict" style="display:flex;gap:6px;flex-wrap:wrap">
        ${Object.entries(VERDICTS).map(([v, l]) => `<button type="button" class="mx-btn mx-btn--small mx-btn--ghost" role="radio" aria-checked="false" data-verdict="${v}">${l}</button>`).join("")}
      </span>
    </div>
    <div class="mx-row" style="justify-content:flex-end"><button type="button" class="mx-btn" data-m4-commit disabled>Commit verdict</button></div>
    <p class="mx-fb" data-m4-fb role="status" hidden></p>
    <div class="mx-row" style="justify-content:flex-end" data-m4-next-row hidden>
      <button type="button" class="mx-btn" data-m4-next>${state.soloIndex < 2 ? "Next lead →" : "Send to J.T. →"}</button>
    </div>`;
  const queue = ob.querySelector(".oa-queue") ?? ob;
  queue.prepend(stage);
  queue.scrollTop = 0;

  let verdict = null;
  const total = () => RUBRIC.reduce((sum, c) => sum + Number(stage.querySelector(`#m4-${c.k}`).value), 0);
  const update = () => {
    RUBRIC.forEach(c => {
      const v = Number(stage.querySelector(`#m4-${c.k}`).value);
      stage.querySelector(`#m4-${c.k}-v`).textContent = String(v);
      const [desc, ex] = c.levels[v];
      stage.querySelector(`#m4-${c.k}-d`).textContent = `${v} means: ${desc}, for example ${ex}.`;
    });
    const t = total();
    stage.querySelector("[data-m4-total]").textContent = `Total ${t} out of 25 (the scale says ${VERDICTS[verdictFor(t)].toLowerCase()}).`;
  };
  stage.querySelectorAll("input[type='range']").forEach(i => i.addEventListener("input", update));
  update();
  stage.querySelectorAll("[data-verdict]").forEach(b => b.addEventListener("click", () => {
    if (stage.dataset.committed) return;
    verdict = b.dataset.verdict;
    stage.querySelectorAll("[data-verdict]").forEach(x => x.setAttribute("aria-checked", String(x === b)));
    stage.querySelectorAll("[data-verdict]").forEach(x => x.classList.toggle("mx-btn--ghost", x !== b));
    stage.querySelector("[data-m4-commit]").disabled = false;
  }));
  stage.querySelector("[data-m4-commit]").addEventListener("click", () => {
    if (state.step !== 5 || !verdict || stage.dataset.committed) return;
    stage.dataset.committed = "true";
    stage.querySelectorAll("input, [data-verdict]").forEach(x => { x.disabled = true; });
    stage.querySelector("[data-m4-commit]").disabled = true;
    const { lead: l, ref } = soloLeads()[state.soloIndex];
    const scores = Object.fromEntries(RUBRIC.map(c => [c.k, Number(stage.querySelector(`#m4-${c.k}`).value)]));
    const t = total();
    const refTotal = RUBRIC.reduce((s, c) => s + ref[c.k], 0);
    const ok = verdict === ref.verdict && Math.abs(t - refTotal) <= TOLERANCE;
    const off = RUBRIC.filter(c => Math.abs(scores[c.k] - ref[c.k]) >= 2).map(c => `${c.label.replace(/^[A-Z](?=[a-z])/, ch => ch.toLowerCase())} (you ${scores[c.k]}, scale ${ref[c.k]})`);
    state.solo[state.soloIndex] = { name: l.name, company: l.company, scores, total: t, verdict, ref, refTotal, ok, off };
    state.api.eventLog?.record?.(EVENT.ARCHETYPE_PICKED, { lead: l.lead_id, total: t, verdict, ok });
    const fb = stage.querySelector("[data-m4-fb]");
    fb.hidden = false;
    fb.dataset.tone = ok ? "ok" : "warn";
    fb.textContent = `You gave ${t} out of 25 and chose "${VERDICTS[verdict]}". J.T. gave ${refTotal} and chose "${VERDICTS[ref.verdict]}". ${ref.why}${off.length ? ` The biggest gaps: ${listJoin(off)}.` : ""}`;
    stage.querySelector("[data-m4-next-row]").hidden = false;
    const status = document.querySelector("[data-m4-solo-status]");
    const done = state.solo.filter(Boolean);
    if (status) status.textContent = `${done.length} of 3 leads scored, ${done.filter(r => r.ok).length} matching J.T.`;
    stage.querySelector("[data-m4-next-row]").scrollIntoView({ block: "nearest" });
  });
  stage.querySelector("[data-m4-next]").addEventListener("click", () => {
    if (state.step !== 5) return;
    if (state.soloIndex < 2) { state.soloIndex += 1; renderSoloLead(); return; }
    markTaskBannerDone("m4-s6-solo");
    state.api.eventLog?.record?.(EVENT.SOLO_PROBLEM_COMPLETED, { right: state.solo.filter(r => r?.ok).length });
    completeStep(5, 300);
  });
}

// --- Steps 7-9 -------------------------------------------------------------

function feedbackMessages() {
  const jt = (body, ts = "12:49") => ({ author: "J.T. (pod lead)", initials: "JT", ts, body });
  const runs = state.solo.filter(Boolean);
  const msgs = [jt("Here are my notes on this morning's scores.", "12:48")];
  msgs.push(jt(state.workedDone ? "✅ You read M.G.'s scoring notes for Maria." : "⚠️ You skipped M.G.'s scoring notes. They're the first item in Gong."));
  msgs.push(jt(state.sven.ok
    ? (state.sven.tries === 1 ? "✅ You gave Sven 20 out of 25 and put him on this week's list on the first try." : `⚠️ Sven took you ${state.sven.tries} tries. Score each criterion against the scale before you add them up.`)
    : "⚠️ You didn't score Sven."));
  if (!runs.length) msgs.push(jt("⚠️ You haven't scored any leads on your own yet. Redo step 6 when you have a few minutes."));
  runs.forEach(r => {
    msgs.push(jt(`${r.ok ? "✅" : "⚠️"} ${r.company}: you gave ${r.total} and chose "${VERDICTS[r.verdict]}". I gave ${r.refTotal} and chose "${VERDICTS[r.ref.verdict]}".${r.off.length ? ` Look again at ${listJoin(r.off)}.` : ""}`));
  });
  const trapsMissed = runs.filter(r => r.ref.verdict === "skip" && r.verdict !== "skip").length;
  if (trapsMissed) msgs.push(jt(`You would have dialled ${trapsMissed} lead${trapsMissed > 1 ? "s" : ""} that the scale skips. That's how the eight-minute call from the exit interview happens.`, "12:51"));
  msgs.push(jt("When your gut says to call a lead that scores under 18, take the next lead on this week's list instead.", "12:52"));
  msgs.push({ author: "M.G. (peer)", initials: "MG", ts: "12:54", body: "I score every lead before I open Gong. After a couple of weeks the ones outside the profile stopped tempting me." });
  return msgs;
}

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `<p style="font-size:14px;"><strong>J.T.</strong>, your pod lead, has sent you a direct message in Slack about your scores. Read it, then click Mark thread read.</p>`;
  state.api.os.openApp("slack", { channel: { channel_id: "dm-jt-podlead", pinned_messages: [{ title: "The three moves of a call", content_md: "Open with one question built on the buyer's profile. Repeat any objection in the buyer's words before you answer it, and send the invite before you hang up.", related_module: "M4" }], messages: feedbackMessages() } });
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 6) return;
    mountTaskBanner(appBody("slack"), { id: "m4-s7-read", label: "Read J.T.'s message, then click Mark thread read.", state: "active" });
    bar(feed, "data-m4-s7-done", "J.T. will see that you have read his message.", "✓ Mark thread read")
      .querySelector("button").addEventListener("click", () => {
        if (state.step !== 6) return;
        markTaskBannerDone("m4-s7-read");
        completeStep(6, 500);
      });
  });
}

function stepQuiz(body) {
  state.quizIndex = 0; state.quizScore = 0;
  body.innerHTML = `<p style="font-size:14px;">J.T. has posted four questions in Slack, and three correct answers are a pass. The scale is under Help while you answer.</p>`;
  if (!isOpen("slack")) state.api.os.openApp("slack");
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 7) return;
    mountTaskBanner(appBody("slack"), { id: "m4-quiz", label: "Answer J.T.'s four questions. A wrong answer shows you the right one and why.", state: "active" });
    feed.querySelector("[data-m4-s7-done]")?.closest(".mx-bar")?.remove();
    feed.querySelector("[data-m4-quiz-thread]")?.remove();
    const thread = document.createElement("div");
    thread.className = "mx-thread";
    thread.setAttribute("data-m4-quiz-thread", "");
    thread.innerHTML = `<div class="mx-thread__k">J.T. posted these questions</div><div data-quiz-host></div>`;
    feed.appendChild(thread);
    renderQuizItem(thread.querySelector("[data-quiz-host]"));
    thread.scrollIntoView({ block: "start" });
  });
}

function renderQuizItem(host) {
  const item = state.quizItems[state.quizIndex];
  const last = state.quizIndex === state.quizItems.length - 1;
  host.innerHTML = `
    <div style="font-size:12px;color:var(--ftc-ink-2);margin-bottom:6px;">Question ${state.quizIndex + 1} of ${state.quizItems.length}</div>
    <p style="font-size:14px;margin:0 0 10px;color:var(--ftc-ink);">${escapeHtml(item.stem)}</p>
    <div role="radiogroup" style="display:grid;gap:6px;">
      ${item.options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-idx="${i}"><span class="tom-drawer__label">${o.label}</span><span class="tom-drawer__text">${escapeHtml(o.text)}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" hidden></div>
    <div class="mx-quiz-next"><button type="button" class="mx-btn mx-btn--small" data-quiz-next disabled>${last ? "Finish quiz" : "Next question"}</button></div>`;
  const fb = host.querySelector(".tom-drawer__fb");
  const next = host.querySelector("[data-quiz-next]");
  host.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const opt = item.options[Number(btn.dataset.idx)];
      host.querySelectorAll(".tom-drawer__opt").forEach(b => { b.disabled = true; b.style.cursor = "default"; });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
      if (!opt.correct) host.querySelectorAll(".tom-drawer__opt").forEach((b, j) => { if (item.options[j]?.correct) b.classList.add("is-reveal"); });
      fb.hidden = false; fb.textContent = opt.rationale;
      if (opt.correct) state.quizScore += 1;
      next.disabled = false;
      next.scrollIntoView({ block: "nearest" });
    });
  });
  next.addEventListener("click", () => {
    if (state.step !== 7) return;
    if (!last) { state.quizIndex += 1; renderQuizItem(host); return; }
    markTaskBannerDone("m4-quiz");
    state.api.eventLog?.record?.("quiz_completed", { score: state.quizScore });
    completeStep(7, 500);
  });
}

function stepTakeaway(body) {
  const pct = quizPct();
  body.innerHTML = `<p style="font-size:14px;">You answered <strong>${state.quizScore} of ${state.quizItems.length}</strong> questions correctly (${pct}%). M.G. has pinned a short note in Slack, and the module ends when you schedule the refresher under it.</p>`;
  if (!isOpen("slack")) state.api.os.openApp("slack");
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 8) return;
    feed.querySelector("[data-m4-quiz-thread]")?.remove();
    feed.querySelector("[data-m4-s7-done]")?.closest(".mx-bar")?.remove();
    mountTaskBanner(appBody("slack"), { id: "m4-s9-pin", label: "Read M.G.'s note, then schedule the refresher to finish the module.", state: "active" });
    if (feed.querySelector("[data-m4-pinned]")) return;
    const pin = document.createElement("div");
    pin.className = "mx-pinned";
    pin.setAttribute("data-m4-pinned", "");
    pin.innerHTML = `
      <div class="mx-pinned__k">📌 M.G., a rep in the Manchester pod, pinned this note</div>
      <p class="mx-pinned__quote">"Before you dial, score the lead from 1 to 5 on industry, size, card spend, access to the decision-maker and recent intent. If the total is under 18, call someone else."</p>
      <div class="mx-pinned__foot">
        <span>📅 In seven days you'll get three short questions about scoring leads.</span>
        <button type="button" class="mx-btn" data-m4-fin>Schedule refresher →</button>
      </div>`;
    feed.appendChild(pin);
    pin.scrollIntoView({ block: "nearest" });
    pin.querySelector("[data-m4-fin]").addEventListener("click", () => {
      markTaskBannerDone("m4-s9-pin");
      state.stepTs[8] = state.stepTs[8] ?? timestamp();
      finishModule();
    });
  });
}

function quizPct() { return state.quizItems.length ? Math.round((state.quizScore / state.quizItems.length) * 100) : 0; }

function finishModule() {
  if (state.finished) return;
  state.finished = true;
  const pct = quizPct();
  state.api.complete(pct);
  document.getElementById("narrative-next").hidden = true;
  document.getElementById("narrative-back").hidden = true;
  showSummaryCard(pct);
}

function showSummaryCard(pct) {
  keepOnly([]);
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const passed = pct >= 67;
  const right = state.solo.filter(r => r?.ok).length;
  const card = document.createElement("div");
  card.className = "summary-card";
  card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true");
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check${passed ? "" : " is-retry"}" aria-hidden="true">${passed ? "✓" : "↻"}</div>
      <h2 class="summary-card__title">ICP buyer fit, ${passed ? "passed" : "not passed yet"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat"><span class="summary-card__stat-k">Quiz</span><span class="summary-card__stat-v">${state.quizScore}/${state.quizItems.length}</span><span class="summary-card__stat-sub">${pct}%, ${passed ? "above the 67% pass mark" : "below the 67% pass mark"}</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Leads scored</span><span class="summary-card__stat-v">${right}/3</span><span class="summary-card__stat-sub">matched J.T.'s scores</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Time</span><span class="summary-card__stat-v">${timestamp()}</span><span class="summary-card__stat-sub">the module is planned for ten minutes</span></div>
      </div>
      <details class="summary-card__recap"><summary>What you did in each step</summary><ol class="summary-card__list">${STEPS.map((s, i) => `<li><span class="summary-card__list-n">${i + 1}</span><span class="summary-card__list-label">${s.title}</span><span class="summary-card__list-ts">${state.stepTs[i] ?? "skipped"}</span></li>`).join("")}</ol></details>
      <div class="summary-card__actions">
        <a class="summary-card__btn summary-card__btn--ghost" href="../">← Back to engagement</a>
        <button type="button" class="summary-card__btn summary-card__btn--primary" data-action="restart">Restart module</button>
      </div>
    </div>`;
  document.body.appendChild(card);
  card.querySelector("[data-action='restart']")?.addEventListener("click", () => location.reload());
}

function timestamp() {
  const ms = Date.now() - state.startedAt;
  return `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")}`;
}
function renderFatal(msg) {
  const b = document.getElementById("narrative-body");
  if (b) b.innerHTML = `<p style="color:var(--coral-700);">Could not load module data: ${escapeHtml(msg)}</p>`;
}
function escapeHtml(s) { return String(s ?? "").replace(/[<>&"]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;" }[c])); }

