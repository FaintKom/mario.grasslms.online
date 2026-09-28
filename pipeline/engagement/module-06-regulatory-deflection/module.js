/**
 * Module 6 · Regulatory Deflection · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * Same architecture as M2/M4: bootModule + task-banner + welcome/summary
 * cards, nine steps, each one completed through a task inside an app.
 *
 * Behaviour taught: when a buyer asks a regulatory question, find the row in
 * the job aid (data/reg-job-aid.json), read its answer word for word, and book
 * compliance when the question goes past the row's escalation criteria.
 *
 * Data: reg-job-aid.json (rows), prospects.json ({prospects:[Lukas, Priya]}),
 * transcripts.json ({transcripts:[good KYC call, PSD2 guess]}), quiz.json.
 * Learner-facing copy for the quiz is overridden below (QUIZ_COPY) so no
 * internal references from the data files reach the screen.
 */

import { bootModule, PASS_PCT } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone, updateTaskBanner } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";

const state = {
  api: null, step: 0, startedAt: 0,
  quizIndex: 0, quizScore: 0,
  soloIndex: 0, soloCorrect: 0,
  transcripts: [], prospects: [], quizItems: [], aid: [], leads: [],
  timeline: new Map(),
};

// --- Data -------------------------------------------------------------------

async function loadJson(p) { const r = await fetch(p); if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); }
async function loadAllData() {
  const [t, p, q, a, leads] = await Promise.all([
    loadJson("./data/transcripts.json"),
    loadJson("./data/prospects.json"),
    loadJson("./data/quiz.json"),
    loadJson("./data/reg-job-aid.json"),
    loadJson("../scorm-shell/data/sample-profiles.json").catch(() => []),
  ]);
  state.transcripts = Array.isArray(t) ? t : (t?.transcripts ?? []);
  state.prospects = Array.isArray(p) ? p : (p?.prospects ?? []);
  state.quizItems = normalizeQuiz(q).map(applyQuizCopy);
  state.aid = a?.rows ?? [];
  const priya = state.prospects.find(x => x.id === "priya");
  state.leads = (Array.isArray(leads) ? leads : []).slice();
  if (priya) state.leads.push({
    lead_id: "M6-PRIYA", name: priya.display_name, company: "Software for regulated clients (UK)",
    archetype: "rocket", fte: priya.fte, last_touch_at: "2026-05-06T09:00:00Z", sequence_step: 3,
  });
}
const row = acr => state.aid.find(r => r.acronym === acr) ?? { acronym: acr, what_it_means: "", rep_response_verbatim: "", escalation_criteria: "" };
const say = acr => row(acr).rep_response_verbatim;
const prospect = id => state.prospects.find(p => p.id === id) ?? { display_name: id };

const ESCALATE_LINE = "That needs an exact answer. I'll book you 15 minutes with our compliance lead on Thursday, and they'll confirm it in writing.";

async function start() {
  try { await loadAllData(); }
  catch (err) { console.error("[M6]", err); renderFatal(err.message); return; }
  bootModule({
    moduleId: "M6",
    title: "Module 6 · Regulatory Deflection",
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
  { title: "Lukas asks what happens to his money", handler: stepGainAttention },
  { title: "What you will be able to do",          handler: stepStateOutcome },
  { title: "Open the job aid",                     handler: stepOpenJobAid },
  { title: "Two calls: one read, one guessed",     handler: stepWorkedExample },
  { title: "Your turn: Priya asks who regulates you", handler: stepGuided },
  { title: "On your own: Lukas's three questions", handler: stepSolo },
  { title: "Your feedback from J.T.",              handler: stepFeedback },
  { title: "Quick check: 3 questions",             handler: stepQuiz },
  { title: "Takeaway",                             handler: stepTakeaway },
];

// --- Shell plumbing ----------------------------------------------------------

function runStep(i) {
  state.step = i;
  document.querySelectorAll("[data-m6-injected]").forEach(el => el.remove());
  document.querySelectorAll(".is-warm-highlight").forEach(el => el.classList.remove("is-warm-highlight"));
  document.getElementById("gagne-step").textContent = `${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body"); body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.hidden = false;
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  next.disabled = false; next.setAttribute("aria-disabled", "false");
  STEPS[i].handler(body);
}
function advanceFrom(stepIdx, delay = 600) {
  setTimeout(() => { if (state.step === stepIdx) runStep(stepIdx + 1); }, delay);
}
function logDone(key, label, detail, ok = true) {
  state.timeline.set(key, { label, detail, ok, ts: timestamp() });
  state.api.eventLog?.record?.(`m6_${key}`, { ok });
}

function keepOnly(appIds) {
  if (!state.api?.os?.listWindows) return;
  const k = new Set(appIds);
  for (const w of state.api.os.listWindows()) if (!k.has(w.appId)) state.api.os.closeApp(w);
}
function win(appId) { return state.api.os.listWindows().find(w => w.appId === appId) ?? null; }
function appBody(appId) { return document.querySelector(`.os-window.app--${appId} .os-window-body`); }

/** Size and place a window so it stays clear of the narrative panel on the right. */
function placeWin(appId, { w = 960, h = 780, left = 16, top = 16 } = {}) {
  const handle = win(appId);
  const d = document.getElementById("desktop")?.getBoundingClientRect();
  if (!handle || !d) return;
  const bar = document.getElementById("taskbar")?.getBoundingClientRect();
  const reserve = window.innerWidth >= 1100 ? 470 : 0;
  const maxW = d.width - reserve - left - 8;
  const bottom = bar && bar.height && bar.top < d.bottom ? bar.top - d.top : d.height;
  const maxH = bottom - top - 16;
  Object.assign(handle.el.style, {
    left: `${left}px`, top: `${top}px`,
    width: `${Math.max(320, Math.min(w, maxW))}px`,
    height: `${Math.max(260, Math.min(h, maxH))}px`,
  });
}

function openOutreach() {
  if (!win("outreach")) state.api.os.openApp("outreach", { leads: state.leads });
  placeWin("outreach", { w: 900, h: 780 });
}

/** Retry until an element exists (apps render asynchronously). */
function whenReady(find, cb, tries = 30) {
  const el = find();
  if (el) return cb(el);
  if (tries > 0) setTimeout(() => whenReady(find, cb, tries - 1), 100);
}
function leadRow(name) {
  const ob = appBody("outreach");
  return ob ? [...ob.querySelectorAll(".lead-row")].find(r => r.querySelector(".name")?.textContent.trim() === name) : null;
}

function showWelcomeCard(onStart) {
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const card = document.createElement("div");
  card.className = "welcome-card";
  card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "m6-welcome-title");
  card.innerHTML = `
    <div class="welcome-card__panel">
      <span class="welcome-card__logo" aria-hidden="true">FTC</span>
      <div class="welcome-card__kicker">Module 6</div>
      <h2 class="welcome-card__title" id="m6-welcome-title">Regulatory Deflection</h2>
      <div class="welcome-card__meta">10 min &middot; 9 steps &middot; in-app practice</div>
      <p class="welcome-card__lede">
        Buyers ask how you are regulated and what happens to their money.
        You will answer from the job aid, word for word, and book compliance
        when a question goes further than the job aid.
      </p>
      <button type="button" class="welcome-card__start" data-action="start">Start module &rarr;</button>
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
function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => openJobAid());
}
function wireProgressTimer() {
  const el = document.getElementById("module-progress");
  const tick = () => { el.textContent = `${timestamp()} / 10:00`; };
  tick(); setInterval(tick, 1000);
}

// --- Job aid ------------------------------------------------------------------

const JOB_AID_PIN = {
  title: "Regulatory questions job aid",
  content_md: "KYC · AML · SCA · PSD2 · GDPR · Safeguarding. Read the line as written. Book compliance for anything past it.",
  related_module: "M6",
};

function escalateText(r) {
  const t = String(r.escalation_criteria ?? "")
    .replace(/^Escalate if /i, "")
    .replace(/^Escalate on ANY (\w+) follow-up question/i, "any $1 follow-up question");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Full job aid, as pinned in Slack. `pickable` turns each row head into a button. */
function renderAidCard({ pickable = false } = {}) {
  return `
    <section class="reg-aid" data-m6-aid-card aria-label="Regulatory questions job aid">
      <header class="reg-aid__top">
        <strong>Regulatory questions job aid</strong>
        <span>Read the answer word for word. If the buyer asks for more than the row covers, book compliance.</span>
      </header>
      ${state.aid.map(r => `
        <article class="reg-aid__row" data-acr="${escapeHtml(r.acronym)}">
          ${pickable
            ? `<button type="button" class="reg-aid__head reg-aid__head--pick" data-pick="${escapeHtml(r.acronym)}"><b>${escapeHtml(r.acronym)}</b><span>${escapeHtml(r.what_it_means)}</span></button>`
            : `<div class="reg-aid__head"><b>${escapeHtml(r.acronym)}</b><span>${escapeHtml(r.what_it_means)}</span></div>`}
          <p class="reg-aid__say"><span class="reg-aid__k">Say</span>“${escapeHtml(r.rep_response_verbatim)}”</p>
          <p class="reg-aid__esc"><span class="reg-aid__k">Escalate if</span>${escapeHtml(escalateText(r))}</p>
        </article>`).join("")}
      <article class="reg-aid__row reg-aid__row--out">
        <div class="reg-aid__head"><b>Not in the table</b><span>or deeper than the row</span></div>
        <p class="reg-aid__say"><span class="reg-aid__k">Say</span>“${escapeHtml(ESCALATE_LINE)}”</p>
      </article>
    </section>`;
}

/** Compact job aid for drawers and the quiz: one collapsible line per row. */
function renderAidCompact({ open = false } = {}) {
  return `
    <details class="reg-mini" ${open ? "open" : ""}>
      <summary>Job aid · regulatory questions</summary>
      ${state.aid.map(r => `
        <details class="reg-mini__row">
          <summary><b>${escapeHtml(r.acronym)}</b> ${escapeHtml(r.what_it_means)}</summary>
          <p><span class="reg-aid__k">Say</span>“${escapeHtml(r.rep_response_verbatim)}”</p>
          <p><span class="reg-aid__k">Escalate if</span>${escapeHtml(escalateText(r))}</p>
        </details>`).join("")}
    </details>`;
}

function jobAidChannel() {
  return {
    channel_id: "sdr-pod-uk-manchester",
    pinned_messages: [JOB_AID_PIN],
    messages: [
      { author: "J.T. (pod lead)", initials: "JT", ts: "09:15", body: "The job aid for regulatory questions is pinned above. Read the line as written. If the buyer wants more, book compliance." },
      { author: "Sam (peer)", initials: "SM", ts: "10:15", body: "Anyone got a clean SCA answer? My last one got flagged." },
      { author: "M.G. (peer)", initials: "MG", ts: "10:17", body: "Read the SCA row as written and stop there. Worked on my call with Emma this morning." },
    ],
  };
}

/** Put the full job aid card at the top of whichever Slack channel is open. */
function ensureAidCard({ pickable = false } = {}) {
  const sb = appBody("slack");
  const feed = sb?.querySelector(".slack-feed");
  if (!feed) return null;
  feed.querySelector("[data-m6-aid-card]")?.remove();
  const holder = document.createElement("div");
  holder.innerHTML = renderAidCard({ pickable });
  const card = holder.firstElementChild;
  const pin = feed.querySelector(".pinned-card");
  if (pin) pin.insertAdjacentElement("afterend", card); else feed.prepend(card);
  return card;
}

/** Help button + step 3: open Slack with the job aid on top. */
function openJobAid() {
  const existing = win("slack");
  if (!existing) {
    state.api.os.openApp("slack", { channel: jobAidChannel() });
    placeWin("slack", { w: 820, h: 780, left: 40, top: 24 });
  } else existing.focus();
  if (state.step !== 2) setTimeout(() => {
    const card = ensureAidCard();
    card?.scrollIntoView({ block: "start" });
  }, 120);
}

// --- Step 1 · Lukas's question -----------------------------------------------

function stepGainAttention(body) {
  const lukas = prospect("lukas");
  body.innerHTML = `
    <blockquote class="peer-quote">
      “I don't trust new fintechs with my money. What happens to my money if you go under?”
      <cite>${escapeHtml(lukas.display_name)}, owner of a four-restaurant group in Munich</cite>
    </blockquote>
    <p class="m6-muted">Buyers ask questions like this on most calls. Click Lukas in the dial queue to compare two answers.</p>`;
  keepOnly(["outreach"]);
  openOutreach();
  whenReady(() => leadRow("Lukas"), rowEl => {
    if (state.step !== 0) return;
    const ob = appBody("outreach");
    mountTaskBanner(ob, { id: "m6-s1-pick", label: "Click Lukas to see his question", hint: "Tafelrunde Gruppe · 4 restaurants", state: "active" });
    rowEl.classList.add("is-warm-highlight");
    rowEl.scrollIntoView({ block: "nearest" });
    rowEl.onclick = e => {
      if (e.target.closest('[data-action="dial"]') || state.step !== 0) return;
      if (ob.querySelector("[data-m6-s1-drawer]")) return;
      updateTaskBanner("m6-s1-pick", { label: "Pick the answer you would trust if you were Lukas", hint: "One is a guess. One comes from the job aid." });
      mountChoiceDrawer(rowEl, {
        key: "s1", head: "Lukas · on the call", cue: "Pick one",
        stem: "“What happens to my money if you go under?”",
        options: [
          { text: "“Don't worry. Your money is insured like a bank deposit, up to €100,000 I think.”", correct: false,
            why: "This is a guess. If Lukas checks and the number is wrong, he stops believing the rest of your pitch." },
          { text: `“${say("Safeguarding")}”`, correct: true,
            why: "This is what you will practise: the answer is read word for word from the job aid's safeguarding row. If Lukas asks which bank or how long a return takes, that goes past the row, so you book compliance." },
        ],
        onCorrect: () => {
          markTaskBannerDone("m6-s1-pick");
          logDone("s1", "Chose the job-aid answer for Lukas", "Read the safeguarding line word for word");
          advanceFrom(0, 1400);
        },
      });
    };
  });
}

/**
 * Drawer of options under a lead row. A wrong pick explains itself and shows
 * the right option; only the right option completes the task.
 */
function mountChoiceDrawer(rowEl, { key, head, cue, stem, options, onCorrect, extra = "", onFirstPick }) {
  const drawer = document.createElement("div");
  drawer.className = "tom-drawer m6-drawer";
  drawer.setAttribute(`data-m6-${key}-drawer`, "");
  drawer.setAttribute("data-m6-injected", "");
  drawer.innerHTML = `
    <header class="tom-drawer__head"><strong>${escapeHtml(head)}</strong><span class="tom-drawer__cue">${escapeHtml(cue)}</span></header>
    <p class="tom-drawer__stem">${escapeHtml(stem)}</p>
    ${extra}
    <div class="tom-drawer__opts" role="radiogroup" aria-label="${escapeHtml(head)}">
      ${options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-result="${o.correct ? "correct" : "anti"}" data-idx="${i}"><span class="tom-drawer__label">${"ABCDEFGH"[i]}</span><span class="tom-drawer__text">${escapeHtml(o.text)}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" role="status" hidden></div>`;
  rowEl.insertAdjacentElement("afterend", drawer);
  const fb = drawer.querySelector(".tom-drawer__fb");
  let picked = false, done = false;
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      if (done) return;
      const opt = options[Number(btn.dataset.idx)];
      if (!picked) { picked = true; onFirstPick?.(opt.correct); }
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.classList.remove("is-correct", "is-incorrect"); b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
      if (!opt.correct) drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      fb.hidden = false; fb.textContent = opt.why;
      fb.scrollIntoView({ block: "nearest" });
      if (opt.correct) { done = true; onCorrect?.(); }
    });
  });
  drawer.scrollIntoView({ block: "nearest" });
  return drawer;
}

function appendBar(host, { key, text, button, onClick }) {
  host.querySelector(`[data-m6-${key}]`)?.closest(".m6-bar")?.remove();
  const bar = document.createElement("div");
  bar.className = "m6-bar";
  bar.setAttribute("data-m6-injected", "");
  bar.innerHTML = `<span class="m6-bar__text">${text}</span><button type="button" class="m6-bar__btn" data-m6-${key}>${button}</button>`;
  host.appendChild(bar);
  bar.querySelector("button").addEventListener("click", onClick);
  return bar;
}

// --- Step 2 · outcome ---------------------------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p>After this module you can:</p>
    <ol class="m6-list">
      <li>Find the job-aid row that matches a buyer's question.</li>
      <li>Read that row's answer out loud, word for word.</li>
      <li>Tell when a question goes past the row, and book compliance instead of guessing.</li>
    </ol>
    <p class="m6-muted">You will practise with Lukas and Priya, two buyers who check what you tell them.</p>`;
  openOutreach();
  whenReady(() => appBody("outreach")?.querySelector(".lead-row"), () => {
    if (state.step !== 1) return;
    const ob = appBody("outreach");
    mountTaskBanner(ob, { id: "m6-s2-confirm", label: "Confirm what you will practise", state: "active" });
    appendBar(ob, {
      key: "s2-done", text: "Answer from the job aid. Book compliance for anything past it.", button: "✓ Got it",
      onClick: () => { if (state.step !== 1) return; markTaskBannerDone("m6-s2-confirm"); advanceFrom(1, 450); },
    });
  });
}

// --- Step 3 · open the job aid -------------------------------------------------

function stepOpenJobAid(body) {
  body.innerHTML = `
    <p>The job aid has one row for each regulation buyers ask about: KYC, AML, SCA, PSD2, GDPR and safeguarding (what happens to customer money if the company fails). Each row tells you what the term means, the exact words to say, and when to escalate.</p>
    <p class="m6-muted">Open it with <strong>Help</strong> at the top right, or with the button in Outreach.</p>`;
  const onSlack = () => setTimeout(() => { if (state.step === 2) mountRowFinder(); }, 150);
  if (win("slack")) { onSlack(); return; }
  openOutreach();
  whenReady(() => appBody("outreach")?.querySelector(".lead-row"), () => {
    if (state.step !== 2) return;
    const ob = appBody("outreach");
    mountTaskBanner(ob, { id: "m6-s3-open", label: "Open the job aid", hint: "Help button, top right, or the button below", state: "active" });
    appendBar(ob, { key: "s3-open", text: "The job aid is pinned in Slack.", button: "Open job aid", onClick: () => openJobAid() });
  });
  const onAppOpened = ev => {
    if (ev.detail?.appId !== "slack") return;
    state.api.eventBus.removeEventListener("app:opened", onAppOpened);
    if (state.step === 2) onSlack();
  };
  state.api.eventBus.addEventListener("app:opened", onAppOpened);
}

function mountRowFinder() {
  keepOnly(["slack"]);
  placeWin("slack", { w: 960, h: 780 });
  const sb = appBody("slack");
  if (!sb) return;
  const card = ensureAidCard({ pickable: true });
  mountTaskBanner(sb, { id: "m6-s3-find", label: "Find the row for this question", hint: "Buyer: “Where do you keep our card data?”", state: "active" });
  const ask = document.createElement("p");
  ask.className = "reg-aid__ask";
  ask.innerHTML = `Buyer: “Where do you keep our card data?” <span>Click the row you would read.</span>`;
  card?.querySelector(".reg-aid__top")?.appendChild(ask);
  const note = document.createElement("p");
  note.className = "reg-aid__note"; note.setAttribute("role", "status"); note.hidden = true;
  card?.querySelector(".reg-aid__top")?.appendChild(note);
  card?.querySelectorAll("[data-pick]").forEach(btn => btn.addEventListener("click", () => {
    if (state.step !== 2) return;
    const acr = btn.dataset.pick;
    card.querySelectorAll(".reg-aid__row").forEach(r => r.classList.remove("is-picked", "is-wrong"));
    const r = btn.closest(".reg-aid__row");
    note.hidden = false;
    if (acr === "GDPR") {
      r.classList.add("is-picked");
      note.textContent = "Yes, GDPR. It covers where customer data lives and what you do with it. That is the line you would read.";
      markTaskBannerDone("m6-s3-find");
      logDone("s3", "Found the GDPR row", "Card data question → GDPR line");
      advanceFrom(2, 1600);
    } else {
      r.classList.add("is-wrong");
      note.textContent = `Not this one. The ${acr} row is about ${row(acr).what_it_means.split("·").pop().trim()}. Look for the row about data.`;
    }
  }));
}

// --- Step 4 · two calls in Gong -------------------------------------------------

function gongTranscripts() {
  const good = state.transcripts.find(t => t.id === "worked-kyc-verbatim") ?? state.transcripts[0];
  const bad = state.transcripts.find(t => t.id === "contrast-psd2-guess") ?? state.transcripts[1];
  const conv = (t, meta) => t && ({
    id: meta.id, rep: meta.rep, prospect_archetype: t.buyer_archetype, outcome: meta.outcome,
    lines: t.turns.map((u, i) => ({
      timestamp_ms: 4000 + i * 11000,
      speaker: u.speaker === "rep" ? meta.rep : t.buyer_archetype,
      text: u.text, m_move_tag: null,
    })),
    _turns: t.turns,
  });
  return [
    conv(good, { id: "Maria · signup question", rep: "M.G.", outcome: "Meeting booked for Tuesday" }),
    conv(bad, { id: "Tom · PSD2 question", rep: "New rep", outcome: "Buyer called in procurement" }),
  ].filter(Boolean);
}

function stepWorkedExample(body) {
  body.innerHTML = `
    <p>Two recorded calls. In the first, M.G. reads the KYC line and Maria books a time. In the second, a rep guesses about PSD2 and SCA, and the buyer hands the deal to procurement.</p>
    <p class="m6-muted">Read the first call. Then open the second and find where the rep starts guessing.</p>`;
  keepOnly([]);
  const calls = gongTranscripts();
  state.api.os.openApp("gong", { transcripts: calls, activeTranscriptId: calls[0]?.id });
  placeWin("gong", { w: 960, h: 780 });
  whenReady(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    if (state.step !== 3) return;
    const gb = appBody("gong");
    mountTaskBanner(gb, { id: "m6-s4-watch", label: "Read M.G.'s call, then open the second call in the list", hint: "Green lines come straight from the job aid", state: "active" });
    const region = gb.querySelector("[data-region='transcript']");
    const activeId = () => gb.querySelector(".call-list [aria-current='true']")?.dataset.callId;
    let found = false;
    const decorate = () => {
      const call = calls.find(c => c.id === activeId());
      if (!call) return;
      region.querySelectorAll(".turn").forEach((el, i) => {
        const v = call._turns[i]?.verdict;
        if (v === "good" && state.aid.some(r => call._turns[i].text.includes(r.rep_response_verbatim))) addChip(el, "From the job aid", "good");
        if (v === "bad" && found) addChip(el, "Guess", "bad");
      });
      if (call === calls[1] && !found) updateTaskBanner("m6-s4-watch", { label: "Click the first line where the rep guesses", hint: "Listen for words that show the rep isn't sure" });
    };
    decorate();
    const mo = new MutationObserver(decorate);
    mo.observe(region, { childList: true });
    const note = document.createElement("div");
    note.className = "m6-note"; note.setAttribute("data-m6-injected", ""); note.setAttribute("role", "status"); note.hidden = true;
    region.insertAdjacentElement("afterend", note);
    region.addEventListener("click", e => {
      if (state.step !== 3 || found) return;
      const turn = e.target.closest?.(".turn");
      const call = calls.find(c => c.id === activeId());
      if (!turn || call !== calls[1]) return;
      const i = [...region.querySelectorAll(".turn")].indexOf(turn);
      const t = call._turns[i];
      note.hidden = false;
      if (t?.verdict !== "bad") {
        note.innerHTML = `<p>${t?.speaker === "buyer" ? "That line is the buyer. Click a line the rep said." : "Look for the rep's words that show doubt."}</p>`;
        return;
      }
      found = true; decorate(); mo.disconnect();
      markTaskBannerDone("m6-s4-watch");
      logDone("s4", "Spotted the PSD2 guess", "“I think” and “pretty sure” lost the buyer");
      note.innerHTML = `
        <p><strong>“I think” and “pretty sure”</strong> told the buyer the rep didn't know. Any follow-up question on PSD2 goes to compliance, and SCA delegation is on the SCA row's escalation list. A better reply:</p>
        <blockquote>“${escapeHtml(say("PSD2"))} Delegation for your Italian supplier is a question for our compliance team. I'll book you 15 minutes with them on Thursday.”</blockquote>
        <div class="m6-note__foot"><button type="button" class="m6-bar__btn" data-m6-s4-next>Next: your turn &rarr;</button></div>`;
      note.querySelector("[data-m6-s4-next]").addEventListener("click", () => advanceFrom(3, 150));
      note.scrollIntoView({ block: "nearest" });
    });
  });
}
function addChip(turnEl, label, kind) {
  if (turnEl.querySelector(`.m6-chip--${kind}`)) return;
  const chip = document.createElement("span");
  chip.className = `m6-chip m6-chip--${kind}`; chip.textContent = label;
  turnEl.classList.add(`m6-turn--${kind}`);
  (turnEl.querySelector(".text") ?? turnEl).prepend(chip);
}

// --- Step 5 · guided practice (Priya) --------------------------------------------

function stepGuided(body) {
  const priya = prospect("priya");
  body.innerHTML = `
    <p><strong>${escapeHtml(priya.display_name)}</strong> is CTO of a UK software company with regulated clients. Her last payments vendor failed an audit. She opens with:</p>
    <blockquote class="peer-quote">“Before we talk product, who actually holds the licence, and which national regulator audits you?”</blockquote>
    <p class="m6-muted">Pick your reply in Outreach. The job aid is open under her question.</p>`;
  keepOnly(["outreach"]);
  openOutreach();
  whenReady(() => leadRow(priya.display_name), rowEl => {
    if (state.step !== 4) return;
    const ob = appBody("outreach");
    mountTaskBanner(ob, { id: "m6-s5-pick", label: `Pick your reply to ${priya.display_name}`, hint: "Check each row. Does one answer her question?", state: "active" });
    rowEl.classList.add("is-warm-highlight");
    let firstOk = null;
    mountChoiceDrawer(rowEl, {
      key: "s5", head: `${priya.display_name} · your reply`, cue: "Pick one",
      stem: "“Who actually holds the licence, and which national regulator audits you?”",
      extra: renderAidCompact({ open: true }),
      onFirstPick: ok => { firstOk = ok; },
      options: [
        { text: `Read the KYC row: “${say("KYC")}”`, correct: false,
          why: "The KYC row is about how you check your customers. Priya asked who checks you. The row doesn't answer that, so this is escalation." },
        { text: `Read the PSD2 row: “${say("PSD2")}”`, correct: false,
          why: "The PSD2 line says you comply. It doesn't name the licence holder or the regulator, and the PSD2 row sends any follow-up to compliance." },
        { text: `Escalate: “${ESCALATE_LINE}”`, correct: true,
          why: "Right. No row names the licence holder or the regulator. You tell Priya she will get an exact answer and give her a date, so she has a reason to stay on the call." },
        { text: "“We're regulated by the FCA, I'm fairly sure, through our banking partner.”", correct: false,
          why: "This is a guess about a regulator. Priya's last vendor failed an audit. One wrong fact and she ends the call." },
      ],
      onCorrect: () => {
        markTaskBannerDone("m6-s5-pick");
        logDone("s5", "Escalated Priya's licence question", firstOk ? "Right on the first pick" : "Right after one wrong pick", firstOk !== false);
        advanceFrom(4, 1800);
      },
    });
  });
}

// --- Step 6 · solo (Lukas, three questions) ----------------------------------------

const SOLO = [
  { q: "My managers pay suppliers with their cards. Will they have to approve every payment on their phone?",
    answer: "SCA", why: "Approving a payment on the phone is Strong Customer Authentication, the SCA row. The row answers it, so read it." },
  { q: "We send the Italian supplier large sums every month. Who checks those payments for anything dodgy, me or you?",
    answer: "AML", why: "Checking payments for money laundering is the AML row. The row answers it, so read it." },
  { q: "The Italian supplier bills the same amount every month. Are those payments exempt from approval, and how does your system decide?",
    answer: "ESC", why: "Exemptions for repeat payments are on the SCA row's escalation list. The row doesn't cover them, so book compliance." },
];
const SOLO_CHOICES = ["KYC", "AML", "SCA", "PSD2", "GDPR", "Safeguarding", "ESC"];

function stepSolo(body) {
  const lukas = prospect("lukas");
  state.soloIndex = 0; state.soloCorrect = 0;
  body.innerHTML = `
    <p>${escapeHtml(lukas.display_name)} has three more questions. For each one, pick the job-aid row you would read. If the question goes past the row, pick escalate.</p>
    <p id="m6-solo-status" class="retention-note" aria-live="polite">0 of 3 answered</p>`;
  keepOnly(["outreach"]);
  openOutreach();
  whenReady(() => leadRow("Lukas"), rowEl => {
    if (state.step !== 5) return;
    rowEl.classList.add("is-warm-highlight");
    const drawer = document.createElement("div");
    drawer.className = "tom-drawer m6-drawer";
    drawer.setAttribute("data-m6-s6-drawer", ""); drawer.setAttribute("data-m6-injected", "");
    rowEl.insertAdjacentElement("afterend", drawer);
    renderSoloQuestion(drawer);
  });
}

function renderSoloQuestion(drawer) {
  const ob = appBody("outreach");
  const i = state.soloIndex, item = SOLO[i];
  mountTaskBanner(ob, { id: "m6-s6-solo", label: `Lukas, question ${i + 1} of 3: pick a row or escalate`, state: "active" });
  const label = c => c === "ESC" ? "Escalate to compliance" : `${c} row`;
  drawer.innerHTML = `
    <header class="tom-drawer__head"><strong>Lukas · question ${i + 1} of 3</strong><span class="tom-drawer__cue">Row or escalate?</span></header>
    <p class="tom-drawer__stem">“${escapeHtml(item.q)}”</p>
    ${renderAidCompact({ open: false })}
    <div class="tom-drawer__opts m6-solo-grid" role="radiogroup" aria-label="Pick a row or escalate">
      ${SOLO_CHOICES.map((c, j) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-choice="${c}"><span class="tom-drawer__label">${"ABCDEFGH"[j]}</span><span class="tom-drawer__text">${label(c)}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" role="status" hidden></div>
    <div class="m6-note__foot" hidden><button type="button" class="m6-bar__btn" data-m6-s6-next>${i < SOLO.length - 1 ? "Next question →" : "See your feedback →"}</button></div>`;
  const fb = drawer.querySelector(".tom-drawer__fb");
  const foot = drawer.querySelector(".m6-note__foot");
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => btn.addEventListener("click", () => {
    if (!foot.hidden) return;
    const choice = btn.dataset.choice, ok = choice === item.answer;
    if (ok) state.soloCorrect += 1;
    drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.disabled = true; });
    btn.setAttribute("aria-checked", "true");
    btn.classList.add(ok ? "is-correct" : "is-incorrect");
    if (!ok) drawer.querySelector(`.tom-drawer__opt[data-choice="${item.answer}"]`)?.classList.add("is-reveal");
    const line = item.answer === "ESC" ? ESCALATE_LINE : say(item.answer);
    fb.hidden = false;
    fb.innerHTML = `<p>${ok ? "Right." : "Not this one."} ${escapeHtml(item.why)}</p><p class="m6-say"><span class="reg-aid__k">Say</span>“${escapeHtml(line)}”</p>`;
    foot.hidden = false;
    logDone(`s6-${i}`, `Lukas question ${i + 1}: ${item.answer === "ESC" ? "escalate" : item.answer + " row"}`, ok ? "Right" : `You picked ${label(choice)}`, ok);
    const status = document.getElementById("m6-solo-status");
    if (status) status.textContent = `${i + 1} of 3 answered · ${state.soloCorrect} right`;
    foot.scrollIntoView({ block: "nearest" });
  }));
  drawer.querySelector("[data-m6-s6-next]").addEventListener("click", () => {
    if (state.step !== 5) return;
    if (state.soloIndex < SOLO.length - 1) { state.soloIndex += 1; renderSoloQuestion(drawer); drawer.scrollIntoView({ block: "nearest" }); }
    else { markTaskBannerDone("m6-s6-solo"); advanceFrom(5, 300); }
  });
}

// --- Step 7 · feedback -----------------------------------------------------------

function stepFeedback(body) {
  const entries = [...state.timeline.values()];
  body.innerHTML = `
    <p>J.T. reviewed your practice. This is what you did.</p>
    <ol class="event-timeline">
      ${entries.map(e => `<li class="event-timeline__item" data-state="${e.ok ? "ok" : "anti"}"><span class="event-timeline__dot" aria-hidden="true"></span><span><span class="event-timeline__label">${escapeHtml(e.label)}</span><span class="event-timeline__detail">${escapeHtml(e.detail)}</span></span><span class="event-timeline__ts">${e.ts}</span></li>`).join("") || `<li class="event-timeline__item"><span></span><span class="event-timeline__detail">No practice recorded yet.</span></li>`}
    </ol>`;
  const summary = state.soloCorrect === 3
    ? "All three of Lukas's questions right. Keep the job aid open on every call, even when you think you know the line."
    : `${state.soloCorrect} of 3 on Lukas's questions. Before you answer, read the row's escalation column too.`;
  const dm = [
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:48", body: "Here's how your practice went." },
    ...entries.map(e => ({ author: "J.T. (pod lead)", initials: "JT", ts: "12:49", body: `${e.ok ? "✅" : "⚠️"} ${e.label}. ${e.detail}.` })),
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:52", body: summary },
    { author: "M.G. (peer)", initials: "MG", ts: "12:54", body: "I keep the job aid open on my second screen. Buyers can't tell I'm reading it." },
  ];
  keepOnly([]);
  state.api.os.openApp("slack", { channel: { channel_id: "dm-jt-podlead", pinned_messages: [JOB_AID_PIN], messages: dm } });
  placeWin("slack", { w: 960, h: 780 });
  whenReady(() => appBody("slack")?.querySelector(".slack-feed"), () => {
    if (state.step !== 6) return;
    const sb = appBody("slack");
    mountTaskBanner(sb, { id: "m6-s7-read", label: "Read J.T.'s DM", state: "active" });
    appendBar(sb.querySelector(".slack-feed"), {
      key: "s7-done", text: "J.T. is waiting for your read receipt.", button: "✓ Mark thread read",
      onClick: () => { if (state.step !== 6) return; markTaskBannerDone("m6-s7-read"); advanceFrom(6, 450); },
    });
  });
}

// --- Step 8 · quiz ---------------------------------------------------------------

/** Plain-language copy for each quiz item, matched by id and option order. */
const QUIZ_COPY = {
  q1: {
    stem: "Lukas opens the call with: “I don't trust new fintechs. What happens to my money if you go under?” Which row do you start from?",
    options: [
      ["Safeguarding row (customer money if we fail)", "Right. The safeguarding line says his money sits in a separate account at a tier-1 bank and goes back to him if the company fails. Read it word for word."],
      ["AML row (transaction monitoring)", "The AML row covers checks on transactions. Lukas is asking what happens to his money, and the safeguarding row answers that."],
      ["PSD2 row (open banking)", "The PSD2 line explains how you sit next to his bank. It says nothing about his money if you fail. The safeguarding row does."],
      ["No row. This is a product question.", "Lukas is asking whether his money is safe with a regulated company. That is a regulatory question, and the safeguarding row answers it."],
    ],
  },
  q2: {
    stem: "Tom, a SaaS founder, asks: “Does it tag software subscriptions and travel as separate expense categories?” Which row do you use?",
    options: [
      ["GDPR row, because it touches data", "GDPR covers personal data. Tom is asking about expense categories."],
      ["AML row, because it sounds like monitoring", "AML is about suspicious transactions. Tom is asking about bookkeeping."],
      ["No row. This is a product question.", "Right. Answer it as a product question. Reading a regulatory line here would sound like you are dodging him."],
      ["PSD2 row, because it's EU payments", "PSD2 is about payments and banks. It says nothing about expense categories."],
    ],
  },
  q3: {
    stem: "A buyer follows up on GDPR: “How fast do you answer a data request from a Swiss ex-employee who wants their full card history, and which transfer mechanism covers Switzerland?” What do you do?",
    options: [
      ["Read the GDPR row. It covers cross-border questions.", "The GDPR line says data lives in the EU and offers the data processing agreement. It gives no timeline for a Swiss request."],
      ["Say Switzerland has an adequacy decision, so it's fine.", "That is a guess on a legal point. If it's wrong, the buyer's lawyer will find it."],
      ["Escalate: message compliance and book a follow-up with the buyer.", "Right. Request timelines and transfer rules for Switzerland are on the GDPR row's escalation list. Book the follow-up while you are still on the call."],
      ["Say you'll send something later.", "A promise with no date drifts, and the buyer stops waiting. Book the follow-up on the call."],
    ],
  },
};
function applyQuizCopy(item) {
  const c = QUIZ_COPY[item.id];
  if (!c) return item;
  return {
    ...item,
    stem: c.stem,
    options: item.options.map((o, i) => c.options[i] ? { ...o, text: c.options[i][0], rationale: c.options[i][1] } : o),
  };
}

function stepQuiz(body) {
  state.quizIndex = 0; state.quizScore = 0;
  body.innerHTML = `<p><strong>Quick check.</strong> Three questions from J.T. The job aid stays open while you answer, the same as on a real call.</p>`;
  ensureDmSlack();
  whenReady(() => appBody("slack")?.querySelector(".slack-feed"), () => {
    if (state.step === 7) mountQuizInSlack();
  });
}

/** Steps 8-9 run in J.T.'s DM; reopen it if the learner closed Slack or skipped ahead. */
function ensureDmSlack() {
  if (win("slack")) return;
  state.api.os.openApp("slack", { channel: { channel_id: "dm-jt-podlead", pinned_messages: [JOB_AID_PIN], messages: [] } });
  placeWin("slack", { w: 960, h: 780 });
}

function mountQuizInSlack() {
  const sb = appBody("slack");
  mountTaskBanner(sb, { id: "m6-s8-quiz", label: "Answer J.T.'s 3 questions", state: "active" });
  const thread = document.createElement("div");
  thread.className = "m6-quiz"; thread.setAttribute("data-m6-injected", "");
  thread.innerHTML = `<div class="m6-quiz__kicker">J.T. · quick check</div><div data-quiz-host></div>`;
  sb.querySelector(".slack-feed").appendChild(thread);
  renderQuizItem(thread.querySelector("[data-quiz-host]"));
  thread.scrollIntoView({ block: "start" });
}

function renderQuizItem(host) {
  const item = state.quizItems[state.quizIndex];
  const last = state.quizIndex === state.quizItems.length - 1;
  host.innerHTML = `
    <div class="m6-quiz__n">Question ${state.quizIndex + 1} of ${state.quizItems.length}</div>
    <p class="m6-quiz__stem">${escapeHtml(item.stem)}</p>
    ${item.open_job_aid ? renderAidCompact({ open: false }) : ""}
    <div class="tom-drawer__opts" role="radiogroup" aria-label="Answer options">
      ${item.options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-idx="${i}"><span class="tom-drawer__label">${escapeHtml(o.label)}</span><span class="tom-drawer__text">${escapeHtml(o.text)}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" role="status" hidden></div>
    <div class="m6-note__foot"><button type="button" class="m6-bar__btn" data-m6-quiz-next disabled>${last ? "Finish" : "Next"}</button></div>`;
  const fb = host.querySelector(".tom-drawer__fb");
  const next = host.querySelector("[data-m6-quiz-next]");
  host.querySelectorAll(".tom-drawer__opt").forEach(btn => btn.addEventListener("click", () => {
    const opt = item.options[Number(btn.dataset.idx)];
    host.querySelectorAll(".tom-drawer__opt").forEach(b => { b.disabled = true; });
    btn.setAttribute("aria-checked", "true");
    btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
    if (!opt.correct) host.querySelectorAll(".tom-drawer__opt").forEach((b, j) => { if (item.options[j]?.correct) b.classList.add("is-reveal"); });
    fb.hidden = false; fb.textContent = opt.rationale;
    if (opt.correct) state.quizScore += 1;
    next.disabled = false;
    next.scrollIntoView({ block: "nearest" });
  }));
  next.addEventListener("click", () => {
    if (state.step !== 7) return;
    if (!last) { state.quizIndex += 1; renderQuizItem(host); host.scrollIntoView({ block: "start" }); }
    else { markTaskBannerDone("m6-s8-quiz"); advanceFrom(7, 450); }
  });
}

// --- Step 9 · takeaway -------------------------------------------------------------

function quizPct() { return state.quizItems.length ? Math.round((state.quizScore / state.quizItems.length) * 100) : 0; }

function stepTakeaway(body) {
  body.innerHTML = `
    <p><strong>Module complete.</strong> Quiz: ${state.quizScore}/${state.quizItems.length} (${quizPct()}%).</p>
    <p class="m6-muted">Read M.G.'s pinned note, then click Finish module.</p>`;
  ensureDmSlack();
  whenReady(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 8) return;
    const sb = appBody("slack");
    mountTaskBanner(sb, { id: "m6-s9-pin", label: "Read M.G.'s pinned note and finish", state: "active" });
    const pin = document.createElement("div");
    pin.className = "m6-pinned"; pin.setAttribute("data-m6-injected", "");
    pin.innerHTML = `
      <div class="m6-pinned__kicker">📌 Pinned by M.G.</div>
      <p class="m6-pinned__quote">When a buyer asks about a regulation, open the job aid and read the row word for word. If the question goes further than the row, tell them you want them to get an exact answer, and book compliance before you hang up.</p>
      <div class="m6-pinned__foot">
        <span>J.T. will send you three practice questions in 7 days.</span>
        <button type="button" class="m6-bar__btn" data-m6-fin>Finish module &rarr;</button>
      </div>`;
    feed.appendChild(pin);
    pin.scrollIntoView({ block: "nearest" });
    pin.querySelector("[data-m6-fin]").addEventListener("click", () => { markTaskBannerDone("m6-s9-pin"); finishModule(); });
  });
}

let finished = false;
function finishModule() {
  if (finished) return;
  finished = true;
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
  const passed = pct >= PASS_PCT;
  const card = document.createElement("div");
  card.className = "summary-card";
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check">✓</div>
      <div class="summary-card__kicker">Module complete</div>
      <h2 class="summary-card__title">Regulatory Deflection · ${passed ? "passed" : "completed"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat"><span class="summary-card__stat-k">Quiz</span><span class="summary-card__stat-v">${state.quizScore}/${state.quizItems.length}</span><span class="summary-card__stat-sub">${pct}% · ${passed ? "pass" : `pass mark ${PASS_PCT}%`}</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Lukas's questions</span><span class="summary-card__stat-v">${state.soloCorrect}/3</span><span class="summary-card__stat-sub">row or escalate</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Time</span><span class="summary-card__stat-v">${timestamp()}</span><span class="summary-card__stat-sub">target 10:00</span></div>
      </div>
      <details class="summary-card__recap"><summary>The 9 steps</summary><ol class="summary-card__list">${STEPS.map((s, i) => `<li><span class="summary-card__list-n">${i + 1}</span><span class="summary-card__list-label">${escapeHtml(s.title)}</span></li>`).join("")}</ol></details>
      <div class="summary-card__actions">
        <a class="summary-card__btn summary-card__btn--ghost" href="../">← Back to modules</a>
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
function escapeHtml(s) { return String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c])); }
