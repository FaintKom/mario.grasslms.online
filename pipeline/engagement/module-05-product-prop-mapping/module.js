/**
 * Module 5 · Product-Prop Mapping · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * Same architecture as M2/M4: bootModule + task-banner + welcome/summary cards,
 * nine steps, each finished by an action inside an app (the narrative
 * Continue button stays as a fallback only).
 *
 * Content: hear the buyer's pain, pick the one prop (of four) that answers it,
 * say it back in the buyer's words.
 *
 * Data (all in ./data):
 *   prop-pain-bank.json  props_reference + 6 pain statements (correct_prop)
 *   prospects.json       { profiles: [...] }  Tom, S.K., Emma, A.B.
 *   transcripts.json     { worked, contrast }  founder + finance lead call
 *   quiz.json            3 scenario items (normalised by quiz-normalize.js)
 *
 * Learner-facing copy must not show internal codes (LO-, §, GC-, snake_case,
 * event names). Data strings go through clean() before they are rendered.
 */

import { bootModule } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";

const state = {
  api: null, step: 0, startedAt: 0, finished: false,
  props: {}, pains: [], profiles: [], transcripts: null,
  quizItems: [], quizIndex: 0, quizScore: 0,
  guidedTries: 0, solo: [], timeline: [],
};

// --- Copy the owner reviews (kept together on purpose) ----------------------

/** What each prop sounds like when a buyer describes it. Shown on the prop card. */
const PROP_CUES = {
  1: "The buyer can't see who spent what, or wants to stop a card right away.",
  2: "The buyer hands out cards by hand, or wants a separate limit per person or site.",
  3: "The buyer pays in another currency and loses money on the conversion.",
  4: "Someone on the buyer's team types receipts into the accounting tool by hand.",
};

/** Step 5: Maria's pain (PP-01). One rationale per prop the learner might pick. */
const GUIDED = {
  painId: "PP-01",
  why: {
    1: "Yes. Maria couldn't see who made the charge for two weeks. Real-time spend control shows every charge as it happens, with the cardholder's name on it.",
    2: "Not first. Per-card limits cap future spend, but Maria's problem is that nobody could say who made the charge. That is Prop 1.",
    3: "No. Nothing Maria said is about currency. Leading with FX would tell her you weren't listening. The right prop is Prop 1.",
    4: "Close, but receipts arrive after the fact. Her pain is two weeks of not knowing who spent the money. Prop 1 shows it the moment it happens.",
  },
  sayIt: "\"So a £1,200 charge sat there for two weeks and nobody knew whose it was. With us you'd see it the minute it happened, with the name of the person who made it.\"",
};

/** Step 6: three pains mapped unaided. `signal` picks a line from the profile. */
const SOLO = [
  { painId: "PP-04", profileId: "EW-emma", signal: 1,
    why: "Her bookkeeper types every supplier receipt into Xero, 3 to 4 days a month. Prop 4 captures the receipt at purchase and syncs it, so that work goes away. A.B., the bookkeeper, is the person who has to agree." },
  { painId: "PP-03", profileId: "SK-sarah", signal: 2,
    why: "S.K. named the leak herself: about 2.4% on €60K a month of EUR-USD spend. Prop 3 converts at the interbank rate. Lead with it and quote her numbers back to her." },
  { painId: "PP-06", profileId: null, signal: null,
    why: "Lukas wants a weekly cap for each site manager. Team cards with a limit per card (Prop 2) give him that without calling the bank." },
];

/** Quiz: learner-facing rationale and stem fixes, keyed by item id. */
const QUIZ_COPY = {
  "M5-Q1": { rationale: "Emma's pain is days of re-keying receipts. Receipt capture with Xero sync removes that work, so Prop 4 leads." },
  "M5-Q2": { stem: "Tom (Series-B founder) says: 'We hired 12 engineers; per-employee cards take forever.' Which reply uses his words instead of jargon?",
             rationale: "B answers in Tom's terms (new hires, pinging finance) and gives one number: two minutes per card. The other three are vendor jargon Tom would have to translate." },
  "M5-Q3": { rationale: "S.K. owns the FX numbers, so ask her before you pick a prop. Tom's view of FX may be wrong. In M.G.'s call it was S.K.'s answer that surfaced the €1,800 a month." },
};

// --- Data -------------------------------------------------------------------

async function loadJson(p) { const r = await fetch(p); if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); }
async function loadAllData() {
  const [bank, prospects, transcripts, quiz] = await Promise.all([
    loadJson("./data/prop-pain-bank.json"),
    loadJson("./data/prospects.json"),
    loadJson("./data/transcripts.json"),
    loadJson("./data/quiz.json"),
  ]);
  state.props = bank.props_reference ?? {};
  state.pains = bank.pains ?? [];
  state.profiles = Array.isArray(prospects) ? prospects : (prospects?.profiles ?? []);
  state.transcripts = transcripts;
  state.quizItems = normalizeQuiz(quiz).map(q => {
    const fix = QUIZ_COPY[q.id] ?? {};
    return {
      ...q,
      stem: clean(fix.stem ?? q.stem),
      options: q.options.map(o => ({ ...o, text: clean(o.text), rationale: clean(fix.rationale ?? o.rationale) })),
    };
  });
}

const pain = id => state.pains.find(p => p.id === id);
const profile = id => state.profiles.find(p => p.id === id);
const propName = n => state.props[n] ?? state.props[String(n)] ?? `Prop ${n}`;

/** Strip source references like "(§12.1)" or "brief §12.3" from data strings. */
function clean(s) {
  return String(s ?? "")
    .replace(/\s*\([^)]*(§|LO-|GC-)[^)]*\)/g, "")
    .replace(/\s*(brief\s*)?§\s*[\d.]+/gi, "")
    .replace(/\s+·\s*$/, "")
    .trim();
}

// --- Boot -------------------------------------------------------------------

async function start() {
  try { await loadAllData(); }
  catch (err) { console.error("[M5]", err); renderFatal(err.message); return; }
  bootModule({
    moduleId: "M5",
    title: "Module 5 · Product-Prop Mapping",
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
  { title: "A call lost to the wrong pitch",           handler: stepGainAttention },
  { title: "What you'll be able to do",                handler: stepStateOutcome },
  { title: "The four props on one card",               handler: stepRecallPrior },
  { title: "Watch M.G. match S.K.'s pain to a prop",   handler: stepWorkedExample },
  { title: "Your turn: match Maria's pain",            handler: stepGuided },
  { title: "On your own: three buyers, three pains",   handler: stepSolo },
  { title: "J.T.'s review of your matches",            handler: stepFeedback },
  { title: "Quick check: 3 questions",                 handler: stepQuiz },
  { title: "Takeaway and a 7-day refresher",           handler: stepTakeaway },
];

function runStep(i) {
  state.step = i;
  document.getElementById("gagne-step").textContent = `${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body"); body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  next.disabled = false; next.setAttribute("aria-disabled", "false");
  STEPS[i].handler(body);
}
/** Advance only if the learner is still on step `from` (guards double clicks). */
function advanceFrom(from, delay = 450) {
  setTimeout(() => { if (state.step === from) runStep(from + 1); }, delay);
}

function showWelcomeCard(onStart) {
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const card = document.createElement("div");
  card.className = "welcome-card";
  card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "welcome-title");
  card.innerHTML = `
    <div class="welcome-card__panel">
      <span class="welcome-card__logo" aria-hidden="true">FTC</span>
      <div class="welcome-card__kicker">Module 5 &middot; match the pain</div>
      <h2 class="welcome-card__title" id="welcome-title">Product-Prop Mapping</h2>
      <div class="welcome-card__meta">10 min &middot; 9 steps &middot; in-app practice</div>
      <p class="welcome-card__lede">
        Buyers tell you what hurts. Your job is to hear it, pick the one prop
        that fixes it and say it back in their words. You'll practise on Tom,
        Maria, Emma and two more buyers.
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
/** Help opens the 4-prop card in Slack (read-only), unless Slack is already up. */
function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => {
    if (findWin("slack")) { findWin("slack").dispatchEvent(new MouseEvent("mousedown")); return; }
    openPropCardInSlack({ interactive: false });
  });
}
function wireProgressTimer() {
  const el = document.getElementById("module-progress");
  const tick = () => { el.textContent = `${timestamp()} / 10:00`; };
  tick(); setInterval(tick, 1000);
}

// --- Window helpers ---------------------------------------------------------

function findWin(appId) { return document.querySelector(`.os-window[data-app-id="${appId}"]`); }
function appBody(appId) { return document.querySelector(`.os-window.app--${appId} .os-window-body`); }
function keepOnly(appIds) {
  if (!state.api?.os?.listWindows) return;
  const k = new Set(appIds);
  for (const w of state.api.os.listWindows()) if (!k.has(w.appId)) state.api.os.closeApp(w);
}
function closeApp(appId) {
  for (const w of state.api.os.listWindows()) if (w.appId === appId) state.api.os.closeApp(w);
}
/** Poll until fn() returns something truthy, then call cb with it. */
function waitFor(fn, cb, tries = 40) {
  const v = fn();
  if (v) return cb(v);
  if (tries <= 0) return;
  setTimeout(() => waitFor(fn, cb, tries - 1), 80);
}
/**
 * Put a window in the free area left of the narrative panel, so task controls
 * never sit under the panel. Desktop-only; small screens keep shell layout.
 */
function fitWindow(appId, maxW) {
  const win = findWin(appId);
  const desk = document.getElementById("desktop");
  const panel = document.getElementById("narrative-overlay");
  if (!win || !desk || !panel || innerWidth <= 900) return;
  const d = desk.getBoundingClientRect();
  const free = panel.getBoundingClientRect().left - d.left - 16 - 16;
  const area = state.api.os._workArea?.() ?? { h: d.height - 80 };
  const w = Math.max(360, Math.min(maxW ?? free, free));
  Object.assign(win.style, { left: "16px", top: "16px", width: `${w}px`, height: `${Math.max(300, area.h - 16)}px` });
  win.dataset.maximized = "false";
}
function openOutreach() {
  if (!findWin("outreach")) state.api.os.openApp("outreach");
  fitWindow("outreach", 820);
  return appBody("outreach");
}
function leadRow(ob, name) {
  return [...ob.querySelectorAll(".lead-row")].find(r => new RegExp(`\\b${name}\\b`).test(r.querySelector(".name")?.textContent || ""));
}
function scrollInto(el) { el?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }

// --- Step 1 · target behaviour on a real lead --------------------------------

function stepGainAttention(body) {
  const lost = state.transcripts?.contrast?.turns ?? [];
  const repLine = lost.find(t => t.ts === "0:34")?.line ?? "Let me show you the spend-control platform.";
  const skLine = lost.find(t => t.ts === "0:46")?.line ?? "We don't have a spend-control problem.";
  body.innerHTML = `
    <blockquote class="peer-quote">
      Rep: "${escapeHtml(repLine)}"<br>S.K.: "${escapeHtml(skLine)}"
      <cite>Gong · Tom and S.K. · call ended at 1:02, no meeting</cite>
    </blockquote>
    <p style="font-size:13.5px;margin-top:10px">
      The rep pitched before asking what hurt. S.K. had a real problem, but nobody asked about it.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Top reps listen for the pain, pick the one prop that answers it and say it in the buyer's words.
      Click <strong>Tom</strong> in Outreach to see that on a real lead.
    </p>`;
  keepOnly(["outreach"]);
  const ob = openOutreach();
  if (!ob) return;
  mountTaskBanner(ob, { id: "m5-s1-tom", label: "Click Tom to open his call notes", hint: "Northwind Telemetry · Series-B SaaS", state: "active" });
  waitFor(() => leadRow(ob, "Tom"), row => {
    row.classList.add("is-warm-highlight");
    if (row.dataset.m5Bound) return;
    row.dataset.m5Bound = "true";
    row.style.cursor = "pointer";
    row.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]') || state.step !== 0) return;
      showTomCard(ob, row);
      markTaskBannerDone("m5-s1-tom");
      state.api.eventLog?.record?.("prop_mapped", { lead: "Tom", prop: 2, source: "demo" });
      advanceFrom(0, 900);
    });
  });
}

/** The target behaviour, shown on Tom: pain heard → one prop → his words. */
function showTomCard(ob, row) {
  if (ob.querySelector("[data-m5-tom-card]")) return;
  const p = pain("PP-02");
  const tom = profile("TM-tom");
  const card = document.createElement("div");
  card.className = "tom-drawer m5-card";
  card.setAttribute("data-m5-tom-card", "");
  card.innerHTML = `
    <header class="tom-drawer__head"><strong>${escapeHtml(tom?.short_name ?? "Tom")} · last call notes</strong><span class="tom-drawer__cue">Pain to prop</span></header>
    <dl class="m5-map">
      <dt>He said</dt><dd><em>"${escapeHtml(p?.statement ?? "")}"</em></dd>
      <dt>The pain</dt><dd>Every new hire waits on him for a card.</dd>
      <dt>One prop</dt><dd><span class="m5-prop-tag">Prop ${p?.correct_prop ?? 2}</span> ${escapeHtml(propName(p?.correct_prop ?? 2))}</dd>
      <dt>In his words</dt><dd>"So each new engineer waits on you for a card. With us you issue it yourself in two minutes, and each card gets its own limit."</dd>
    </dl>`;
  row.insertAdjacentElement("afterend", card);
  scrollInto(card);
}

// --- Step 2 · what you'll be able to do --------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">By the end of these 10 minutes you can:</p>
    <ul style="font-size:13.5px;margin:6px 0 10px 18px;">
      <li>hear a buyer's pain and name the one prop that answers it;</li>
      <li>say that prop in the buyer's own words, using their numbers;</li>
      <li>ask a fresh question when a second person joins the call.</li>
    </ul>
    <p style="font-size:13px;color:var(--ftc-ink-2)">You just saw the first two on Tom. Confirm in Outreach to go on.</p>`;
  const ob = openOutreach();
  if (!ob) return;
  waitFor(() => leadRow(ob, "Tom"), row => {
    showTomCard(ob, row);
    mountTaskBanner(ob, { id: "m5-s2-ok", label: "Confirm under Tom's notes that you've read them", state: "active" });
    const card = ob.querySelector("[data-m5-tom-card]");
    if (!card.querySelector("[data-m5-s2-done]")) {
      const bar = actionBar("Tom's pain maps to Prop 2. Next you'll do this for five more buyers.", "✓ Got it", "data-m5-s2-done");
      card.appendChild(bar);
      bar.querySelector("button").addEventListener("click", () => {
        if (state.step !== 1) return;
        markTaskBannerDone("m5-s2-ok");
        advanceFrom(1);
      });
    }
    scrollInto(card);
  });
}

// --- Step 3 · recall the four props ------------------------------------------

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">FinTechCard sells four props. Every pain you'll hear points at one of them.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Open the 4-prop card in Slack, then tap the prop that answers Tom's pain.
      The card stays under the <strong>Help</strong> button for the rest of the module.
    </p>`;
  const ob = openOutreach();
  if (!ob) return;
  mountTaskBanner(ob, { id: "m5-s3-open", label: "Open the 4-prop card in Slack", state: "active" });
  const card = ob.querySelector("[data-m5-tom-card]");
  const host = card ?? ob.querySelector(".oa-queue") ?? ob;
  host.querySelector("[data-m5-s3-open]")?.closest(".m5-bar")?.remove();
  const bar = actionBar("J.T. pinned the 4-prop card in the pod channel.", "Open Slack", "data-m5-s3-open");
  host.appendChild(bar);
  scrollInto(bar);
  bar.querySelector("button").addEventListener("click", () => {
    if (state.step !== 2) return;
    markTaskBannerDone("m5-s3-open");
    openPropCardInSlack({ interactive: true });
  });
}

/** Opens Slack with J.T.'s 4-prop card. Interactive mode asks for Tom's prop. */
function openPropCardInSlack({ interactive }) {
  closeApp("slack");
  state.api.os.openApp("slack", {
    channel: {
      channel_id: "sdr-pod-uk-manchester",
      pinned_messages: [],
      messages: [
        { author: "J.T. (pod lead)", initials: "JT", ts: "09:12", body: "Pinned the 4-prop card again. One pain, one prop. Keep the other three for later questions." },
      ],
    },
  });
  fitWindow("slack", 760);
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    const tomPain = pain("PP-02");
    const card = document.createElement("div");
    card.className = "m5-propcard";
    card.setAttribute("data-m5-propcard", "");
    card.innerHTML = `
      <div class="m5-propcard__label">Pinned by J.T. · 4-prop card</div>
      ${interactive ? `<p class="m5-propcard__q">Which prop answers Tom's pain? <em>"${escapeHtml(tomPain?.statement ?? "")}"</em></p>` : ""}
      <div class="m5-propcard__rows" ${interactive ? 'role="radiogroup" aria-label="Pick the prop"' : ""}>
        ${[1, 2, 3, 4].map(n => `
          <${interactive ? 'button type="button" role="radio" aria-checked="false"' : "div"} class="m5-propcard__row" data-prop="${n}">
            <span class="m5-propcard__n">${n}</span>
            <span><strong>${escapeHtml(propName(n))}</strong><span class="m5-propcard__cue">${escapeHtml(PROP_CUES[n])}</span></span>
          </${interactive ? "button" : "div"}>`).join("")}
      </div>
      <div class="tom-drawer__fb" data-m5-propcard-fb hidden></div>`;
    feed.prepend(card);
    if (!interactive) return;
    mountTaskBanner(sb, { id: "m5-s3-pick", label: "Tap the prop that answers Tom's pain", hint: "Read the four lines first", state: "active" });
    const fb = card.querySelector("[data-m5-propcard-fb]");
    const right = tomPain?.correct_prop ?? 2;
    card.querySelectorAll(".m5-propcard__row").forEach(btn => btn.addEventListener("click", () => {
      if (state.step !== 2) return;
      const n = Number(btn.dataset.prop);
      card.querySelectorAll(".m5-propcard__row").forEach(b => { b.classList.remove("is-correct", "is-incorrect"); b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(n === right ? "is-correct" : "is-incorrect");
      fb.hidden = false;
      if (n === right) {
        fb.textContent = "Right. Tom hands out every card himself, so team cards with their own limits answer him.";
        markTaskBannerDone("m5-s3-pick");
        advanceFrom(2, 1400);
      } else {
        fb.textContent = "Not this one. Tom isn't worried about this. Re-read his words: every new hire needs a card from him.";
      }
    }));
  });
}

// --- Step 4 · worked example in Gong -----------------------------------------

const WORKED_ID = "Tom + S.K. · booked";
const LOST_ID = "Tom + S.K. · lost";

function toGong(t, id, rep, outcome) {
  const ms = ts => { const [m, s] = String(ts).split(":").map(Number); return (m * 60 + s) * 1000; };
  return {
    id, rep, outcome, prospect_archetype: "Series-B SaaS",
    lines: (t?.turns ?? []).map(x => ({
      timestamp_ms: ms(x.ts),
      speaker: x.kind === "join" ? "·" : (x.who === "rep" ? rep : x.speaker),
      text: clean(x.kind === "join" ? x.label : x.line).replace(/\s*·\s*Salesforce[^\]]*/, ""),
      m_move_tag: null,
    })),
  };
}

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      M.G. calls Tom. At 1:38 Tom brings in <strong>S.K.</strong>, his finance lead.
      The pains they name are marked in yellow.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Click the line where M.G. answers S.K.'s pain with one prop.
      The lost call with the same buyers is also in the list, if you want to compare.
    </p>`;
  keepOnly(["gong"]);
  closeApp("gong");
  const worked = toGong(state.transcripts?.worked, WORKED_ID, "M.G.", "Meeting booked");
  const lost = toGong(state.transcripts?.contrast, LOST_ID, "Rep", "No meeting");
  state.api.os.openApp("gong", { transcripts: [worked, lost], activeTranscriptId: WORKED_ID });
  fitWindow("gong");
  waitFor(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    const gb = appBody("gong");
    mountTaskBanner(gb, { id: "m5-s4-find", label: "Click the line where M.G. matches S.K.'s pain to a prop", hint: "Yellow lines are the pains", state: "active" });
    const tr = gb.querySelector("[data-region='transcript']");
    const pane = tr.parentElement;
    let fb = pane.querySelector("[data-m5-gong-fb]");
    if (!fb) {
      fb = document.createElement("div");
      fb.className = "m5-gong-fb";
      fb.setAttribute("data-m5-gong-fb", "");
      fb.innerHTML = `<span data-m5-gong-msg>Find the moment M.G. picks a prop for S.K.</span>`;
      pane.appendChild(fb);
    }
    const msg = fb.querySelector("[data-m5-gong-msg]");
    let solved = false;
    const activeId = () => gb.querySelector(".call-list [aria-current='true']")?.getAttribute("data-call-id");
    const decorate = () => {
      const turns = [...tr.querySelectorAll(".turn")];
      if (activeId() === WORKED_ID) {
        const at = ts => turns.find(el => el.querySelector(".ts")?.textContent === ts);
        ["0:14", "1:42", "2:10"].forEach(ts => markTurn(at(ts), "m5-pain", "Pain"));
        markTurn(at("2:24"), "m5-heard", solved ? "Pain in her words" : null);
        if (solved) markTurn(at("2:36"), "m5-prop", "Prop 3, then Prop 2");
        turns.forEach(el => el.classList.add("m5-pickable"));
      } else {
        const at = ts => turns.find(el => el.querySelector(".ts")?.textContent === ts);
        markTurn(at("0:00"), "m5-miss", "Pitched before asking");
        markTurn(at("0:34"), "m5-miss", "Wrong prop for S.K.");
      }
    };
    decorate();
    new MutationObserver(() => { if (!tr.querySelector(".m5-tag") && tr.querySelector(".turn")) decorate(); }).observe(tr, { childList: true });
    tr.addEventListener("click", e => {
      const turn = e.target.closest(".turn");
      if (!turn || solved || state.step !== 3 || activeId() !== WORKED_ID) return;
      const ts = turn.querySelector(".ts")?.textContent;
      if (ts === "2:36") {
        solved = true;
        tr.querySelectorAll(".m5-tag").forEach(t => t.remove());
        decorate();
        tr.querySelector(".turn.m5-prop")?.scrollIntoView({ block: "nearest" });
        msg.innerHTML = `<strong>That's the one.</strong> S.K. lost 2.4% on FX, about €1,900 a month. M.G. picked Prop 3 and used her numbers: "On €80K/month you'd recover roughly €1,800." Tom's card problem gets Prop 2 after that.`;
        fb.classList.add("is-done");
        if (!fb.querySelector("button")) {
          const b = document.createElement("button");
          b.type = "button"; b.className = "m5-btn"; b.setAttribute("data-m5-s4-done", "");
          b.textContent = "Try one yourself →";
          fb.appendChild(b);
          b.addEventListener("click", () => { markTaskBannerDone("m5-s4-find"); advanceFrom(3, 200); });
        }
        state.timeline.push({ label: "Found M.G.'s match", detail: "S.K.'s FX leak → Prop 3, with her numbers", ts: clock() });
        state.api.eventLog?.record?.("worked_example_completed");
      } else if (ts === "2:24") {
        msg.textContent = "Close. Here M.G. repeats S.K.'s pain back to her. The prop comes in the next line.";
      } else if (ts === "0:46") {
        msg.textContent = "Not yet. M.G. asks about FX here, but nobody has named that pain. Keep reading.";
      } else if (["0:14", "1:42", "2:10"].includes(ts)) {
        msg.textContent = "That's a pain, not the answer. Look for the line where M.G. puts a number on the fix.";
      } else {
        msg.textContent = "Not this line. Look after S.K. names her monthly leak.";
      }
      scrollInto(fb);
    });
  });
}
function markTurn(el, cls, label) {
  if (!el) return;
  el.classList.add(cls);
  if (label && !el.querySelector(".m5-tag")) {
    const tag = document.createElement("span");
    tag.className = `m5-tag m5-tag--${cls}`;
    tag.textContent = label;
    el.querySelector(".text")?.prepend(tag);
  }
}

// --- Step 5 · guided practice (drawer under Maria) ----------------------------

function stepGuided(body) {
  const p = pain(GUIDED.painId);
  body.innerHTML = `
    <p style="font-size:14px;"><strong>${escapeHtml(clean(p?.archetype_label))}</strong> told you:
      <em>"${escapeHtml(p?.statement)}"</em></p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Pick the one prop to lead with in the drawer under her row. A wrong pick shows you why.</p>`;
  keepOnly(["outreach"]);
  const ob = openOutreach();
  if (!ob) return;
  ob.querySelectorAll("[data-m5-tom-card]").forEach(n => n.remove());
  ob.querySelectorAll(".is-warm-highlight").forEach(n => n.classList.remove("is-warm-highlight"));
  mountTaskBanner(ob, { id: "m5-s5-pick", label: "Pick the prop for Maria's pain", hint: "The drawer is open under her row", state: "active" });
  waitFor(() => leadRow(ob, "Maria"), row => {
    row.classList.add("is-warm-highlight");
    ob.querySelector("[data-m5-s5-drawer]")?.remove();
    const drawer = document.createElement("div");
    drawer.className = "tom-drawer";
    drawer.setAttribute("data-m5-s5-drawer", "");
    drawer.innerHTML = `
      <header class="tom-drawer__head"><strong>Maria · discovery call · 02:10</strong><span class="tom-drawer__cue">Pick one prop</span></header>
      <p class="tom-drawer__stem"><em>"${escapeHtml(p?.statement)}"</em></p>
      <div class="tom-drawer__opts" role="radiogroup" aria-label="Pick the prop">
        ${[1, 2, 3, 4].map(n => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-result="${n === p?.correct_prop ? "correct" : "anti"}" data-prop="${n}"><span class="tom-drawer__label">${n}</span><span class="tom-drawer__text">${escapeHtml(propName(n))}</span></button>`).join("")}
      </div>
      <div class="tom-drawer__fb" data-m5-s5-fb hidden></div>`;
    row.insertAdjacentElement("afterend", drawer);
    scrollInto(drawer);
    const fb = drawer.querySelector("[data-m5-s5-fb]");
    drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => btn.addEventListener("click", () => {
      if (state.step !== 4) return;
      const n = Number(btn.dataset.prop);
      const ok = n === p?.correct_prop;
      state.guidedTries += 1;
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.classList.remove("is-correct", "is-incorrect", "is-reveal"); b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(ok ? "is-correct" : "is-incorrect");
      if (!ok) drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      fb.hidden = false;
      fb.innerHTML = escapeHtml(GUIDED.why[n]) + (ok ? `<br><span class="m5-say">Say it her way: ${escapeHtml(GUIDED.sayIt)}</span>` : "");
      scrollInto(fb);
      if (ok) {
        markTaskBannerDone("m5-s5-pick");
        state.timeline.push({ label: "Matched Maria's pain", detail: `Prop 1 · ${state.guidedTries === 1 ? "first try" : `${state.guidedTries} tries`}`, ts: clock() });
        state.api.eventLog?.record?.("completion_problem_completed", { tries: state.guidedTries });
        advanceFrom(4, 2600);
      }
    }));
  });
}

// --- Step 6 · solo: three pains ------------------------------------------------

function stepSolo(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Three pains from this week's calls. Pick one prop for each. No hints this time.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">You'll see if you were right after each pick. When all three are done, send them to J.T.</p>
    <p class="retention-note" data-m5-solo-status aria-live="polite">0 of 3 matched</p>`;
  keepOnly(["outreach"]);
  const ob = openOutreach();
  if (!ob) return;
  ob.querySelectorAll("[data-m5-tom-card], [data-m5-s5-drawer]").forEach(n => n.remove());
  ob.querySelectorAll(".is-warm-highlight").forEach(n => n.classList.remove("is-warm-highlight"));
  mountTaskBanner(ob, { id: "m5-s6-solo", label: "Match each pain to one prop", hint: "Three buyers · one pick each", state: "active" });
  const queue = ob.querySelector(".oa-queue") ?? ob;
  queue.querySelector("[data-m5-s6-stage]")?.remove();
  state.solo = [];
  const stage = document.createElement("div");
  stage.className = "m5-solo";
  stage.setAttribute("data-m5-s6-stage", "");
  const items = SOLO.map(s => ({ ...s, p: pain(s.painId), prof: s.profileId ? profile(s.profileId) : null })).filter(s => s.p);
  stage.innerHTML = `
    <div class="m5-solo__head">Pain to prop · on your own</div>
    ${items.map((s, i) => `
      <section class="m5-solo__item" data-i="${i}">
        <div class="m5-solo__who">${escapeHtml(clean(s.p.archetype_label))}${s.prof?.signals?.[s.signal] ? ` <span>· ${escapeHtml(clean(s.prof.signals[s.signal]).replace(/\s*\([^)]*\)$/, ""))}</span>` : ""}</div>
        <p class="m5-solo__pain">"${escapeHtml(s.p.statement)}"</p>
        <div class="m5-solo__opts" role="radiogroup" aria-label="Prop for this pain">
          ${[1, 2, 3, 4].map(n => `<button type="button" class="m5-solo__opt" role="radio" aria-checked="false" data-prop="${n}"><b>${n}</b> ${escapeHtml(propName(n))}</button>`).join("")}
        </div>
        <div class="tom-drawer__fb" hidden></div>
      </section>`).join("")}
    <div class="m5-solo__foot">
      <span data-m5-solo-score>Pick a prop for each pain.</span>
      <button type="button" class="m5-btn" data-m5-s6-send disabled>Send to J.T. →</button>
    </div>`;
  queue.prepend(stage);
  queue.scrollTop = 0;
  const send = stage.querySelector("[data-m5-s6-send]");
  const status = () => {
    const done = state.solo.length, right = state.solo.filter(r => r.ok).length;
    const txt = `${right} of ${items.length} matched${done < items.length ? ` · ${items.length - done} to go` : ""}`;
    const s = document.querySelector("[data-m5-solo-status]"); if (s) s.textContent = txt;
    stage.querySelector("[data-m5-solo-score]").textContent = done < items.length ? txt : `${right} of ${items.length} right. Send them to J.T. for review.`;
    send.disabled = done < items.length;
  };
  stage.querySelectorAll(".m5-solo__item").forEach(sec => {
    const s = items[Number(sec.dataset.i)];
    const fb = sec.querySelector(".tom-drawer__fb");
    sec.querySelectorAll(".m5-solo__opt").forEach(btn => btn.addEventListener("click", () => {
      if (state.step !== 5 || sec.dataset.done) return;
      const n = Number(btn.dataset.prop);
      const ok = n === s.p.correct_prop;
      sec.dataset.done = "true";
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(ok ? "is-correct" : "is-incorrect");
      sec.querySelectorAll(".m5-solo__opt").forEach(b => { b.disabled = true; if (!ok && Number(b.dataset.prop) === s.p.correct_prop) b.classList.add("is-reveal"); });
      fb.hidden = false;
      fb.textContent = ok ? `Right. ${s.why}` : `Not this one. The answer is Prop ${s.p.correct_prop}, ${propName(s.p.correct_prop)}. ${s.why}`;
      const who = clean(s.p.archetype_label).split("·")[0].trim();
      state.solo.push({ ok, who, picked: n, right: s.p.correct_prop });
      state.timeline.push({ label: `${ok ? "Matched" : "Missed"} ${who}'s pain`, detail: ok ? `Prop ${n} · ${propName(n)}` : `picked Prop ${n}, answer Prop ${s.p.correct_prop}`, ts: clock(), ok });
      state.api.eventLog?.record?.("prop_mapped", { pain: s.p.id, picked: n, correct: ok });
      status();
      scrollInto(state.solo.length === items.length ? stage.querySelector(".m5-solo__foot") : fb);
    }));
  });
  send.addEventListener("click", () => {
    if (send.disabled || state.step !== 5) return;
    markTaskBannerDone("m5-s6-solo");
    state.api.eventLog?.record?.("solo_problem_completed", { right: state.solo.filter(r => r.ok).length });
    advanceFrom(5, 300);
  });
  status();
}

// --- Step 7 · feedback in Slack ------------------------------------------------

function stepFeedback(body) {
  const right = state.solo.filter(r => r.ok).length, total = state.solo.length || SOLO.length;
  body.innerHTML = `<p style="font-size:14px;"><strong>J.T.</strong> reviewed your matches in Slack.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Read the thread, then mark it read to go on.</p>`;
  keepOnly([]);
  const dm = [
    { author: "J.T. (pod lead)", initials: "JT", ts: clock(0), body: state.solo.length ? `Your mapping run: ${right} of ${total} on your own.` : "Here's your mapping run so far." },
    ...state.timeline.map(e => ({ author: "J.T. (pod lead)", initials: "JT", ts: e.ts, body: `${e.ok === false ? "✗" : "✓"} ${e.label}: ${e.detail}` })),
    { author: "J.T. (pod lead)", initials: "JT", ts: clock(1), body: "When two props fit, lead with the one the buyer put a number on. Bring the second one up later in the call." },
    { author: "M.G. (peer)", initials: "MG", ts: clock(2), body: "I write the buyer's exact words in my notes and read them back before I name the prop. They hear their own problem first." },
  ];
  state.api.os.openApp("slack", { channel: { channel_id: "coaching-jt", pinned_messages: [], messages: dm } });
  fitWindow("slack", 760);
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    mountTaskBanner(sb, { id: "m5-s7-read", label: "Read J.T.'s review", state: "active" });
    if (feed.querySelector("[data-m5-s7-done]")) return;
    const bar = actionBar("J.T. is waiting for your read receipt.", "✓ Mark thread read", "data-m5-s7-done");
    feed.appendChild(bar);
    bar.querySelector("button").addEventListener("click", () => {
      if (state.step !== 6) return;
      markTaskBannerDone("m5-s7-read");
      advanceFrom(6);
    });
  });
}

// --- Step 8 · quiz ---------------------------------------------------------------

function stepQuiz(body) {
  state.quizIndex = 0; state.quizScore = 0;
  body.innerHTML = `<p style="font-size:14px;"><strong>Quick check</strong> · 3 questions from J.T. in Slack.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Two of three right is a pass.</p>`;
  if (!findWin("slack")) { state.api.os.openApp("slack", { channel: { channel_id: "coaching-jt", pinned_messages: [], messages: [] } }); fitWindow("slack", 760); }
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    mountTaskBanner(sb, { id: "m5-s8-quiz", label: "Answer the 3 questions J.T. posted", hint: "A wrong pick shows the right answer", state: "active" });
    feed.querySelector("[data-m5-s7-done]")?.closest(".m5-bar")?.remove();
    feed.querySelector("[data-m5-quiz-thread]")?.remove();
    const thread = document.createElement("div");
    thread.setAttribute("data-m5-quiz-thread", "");
    thread.className = "m5-quiz";
    thread.innerHTML = `<div class="m5-quiz__label">J.T. · quick check</div><div data-quiz-host></div>`;
    feed.appendChild(thread);
    renderQuizItem(thread.querySelector("[data-quiz-host]"));
    scrollInto(thread);
  });
}

function renderQuizItem(host) {
  const item = state.quizItems[state.quizIndex];
  const last = state.quizIndex === state.quizItems.length - 1;
  host.innerHTML = `
    <div style="font-size:12px;color:var(--ftc-ink-2);margin-bottom:6px;">Question ${state.quizIndex + 1} of ${state.quizItems.length}</div>
    <p style="font-size:14px;margin:0 0 10px;color:var(--ftc-ink);">${escapeHtml(item.stem)}</p>
    <div role="radiogroup" aria-label="Answer choices" style="display:grid;gap:6px;">
      ${item.options.map((o, i) => `<button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-idx="${i}"><span class="tom-drawer__label">${escapeHtml(o.label)}</span><span class="tom-drawer__text">${escapeHtml(o.text)}</span></button>`).join("")}
    </div>
    <div class="tom-drawer__fb" id="m5-quiz-fb" hidden></div>
    <div style="margin-top:10px;text-align:right;"><button type="button" id="m5-quiz-next" class="m5-btn" disabled>${last ? "Finish quiz" : "Next question"}</button></div>`;
  const fb = host.querySelector("#m5-quiz-fb");
  const next = host.querySelector("#m5-quiz-next");
  host.querySelectorAll(".tom-drawer__opt").forEach(btn => btn.addEventListener("click", () => {
    const opt = item.options[Number(btn.dataset.idx)];
    host.querySelectorAll(".tom-drawer__opt").forEach(b => { b.disabled = true; b.style.cursor = "default"; });
    btn.setAttribute("aria-checked", "true");
    btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
    if (!opt.correct) host.querySelectorAll(".tom-drawer__opt").forEach((b, j) => { if (item.options[j]?.correct) b.classList.add("is-reveal"); });
    fb.hidden = false; fb.textContent = `${opt.correct ? "Correct." : "Not quite."} ${opt.rationale}`;
    if (opt.correct) state.quizScore += 1;
    next.disabled = false;
    scrollInto(next);
  }));
  next.addEventListener("click", () => {
    if (state.step !== 7) return;
    if (!last) { state.quizIndex += 1; renderQuizItem(host); scrollInto(host); }
    else { markTaskBannerDone("m5-s8-quiz"); state.api.eventLog?.record?.("quiz_completed", { score: state.quizScore }); advanceFrom(7, 400); }
  });
}

// --- Step 9 · takeaway + finish ----------------------------------------------------

function stepTakeaway(body) {
  const pct = quizPct();
  body.innerHTML = `<p style="font-size:14px;"><strong>Last step.</strong> M.G. pinned the takeaway in Slack.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Quiz: <strong>${state.quizScore} of ${state.quizItems.length}</strong> (${pct}%).
    Schedule the 7-day refresher in Slack to finish the module.</p>`;
  if (!findWin("slack")) { state.api.os.openApp("slack", { channel: { channel_id: "coaching-jt", pinned_messages: [], messages: [] } }); fitWindow("slack", 760); }
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    feed.querySelector("[data-m5-quiz-thread]")?.remove();
    mountTaskBanner(sb, { id: "m5-s9-pin", label: "Read M.G.'s takeaway, then schedule the refresher", state: "active" });
    if (feed.querySelector("[data-m5-pinned]")) return;
    const pin = document.createElement("div");
    pin.className = "m5-pinned";
    pin.setAttribute("data-m5-pinned", "");
    pin.innerHTML = `
      <div class="m5-pinned__label">Pinned by M.G.</div>
      <p class="m5-pinned__quote">"Before you pitch, repeat the pain in the buyer's words. Then name one prop and give one number from their own answer. The other props can wait for the next question."</p>
      <div class="m5-pinned__foot">
        <span>In 7 days you'll get three new pains to match, about 2 minutes.</span>
        <button type="button" class="m5-btn" data-m5-fin>Schedule refresher →</button>
      </div>`;
    feed.appendChild(pin);
    scrollInto(pin);
    pin.querySelector("[data-m5-fin]").addEventListener("click", () => { markTaskBannerDone("m5-s9-pin"); finishModule(); });
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
  const right = state.solo.filter(r => r.ok).length;
  const card = document.createElement("div");
  card.className = "summary-card";
  card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true"); card.setAttribute("aria-labelledby", "summary-title");
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check" aria-hidden="true">✓</div>
      <div class="summary-card__kicker">Module complete</div>
      <h2 class="summary-card__title" id="summary-title">Product-Prop Mapping · ${pct >= 67 ? "passed" : "completed"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat"><span class="summary-card__stat-k">Quiz</span><span class="summary-card__stat-v">${state.quizScore}/${state.quizItems.length}</span><span class="summary-card__stat-sub">${pct}% · ${pct >= 67 ? "pass" : "below the 67% pass mark"}</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">On your own</span><span class="summary-card__stat-v">${right}/${state.solo.length || SOLO.length}</span><span class="summary-card__stat-sub">pains matched</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Time</span><span class="summary-card__stat-v">${timestamp()}</span><span class="summary-card__stat-sub">target 10:00</span></div>
      </div>
      <details class="summary-card__recap"><summary>The 9 steps</summary><ol class="summary-card__list">${STEPS.map((s, i) => `<li><span class="summary-card__list-n">${i + 1}</span><span class="summary-card__list-label">${escapeHtml(s.title)}</span></li>`).join("")}</ol></details>
      <div class="summary-card__actions">
        <a class="summary-card__btn summary-card__btn--ghost" href="../">&larr; Back to engagement</a>
        <button type="button" class="summary-card__btn summary-card__btn--primary" data-action="restart">Restart module</button>
      </div>
    </div>`;
  document.body.appendChild(card);
  card.querySelector("[data-action='restart']")?.addEventListener("click", () => location.reload());
}

// --- Small helpers -------------------------------------------------------------

function actionBar(text, btnLabel, attr) {
  const bar = document.createElement("div");
  bar.className = "m5-bar";
  bar.innerHTML = `<span>${escapeHtml(text)}</span><button type="button" class="m5-btn" ${attr}>${escapeHtml(btnLabel)}</button>`;
  return bar;
}
/** Wall-clock time for Slack messages: the session "starts" at 12:30. */
function clock(plusMin = 0) {
  const min = 12 * 60 + 30 + Math.floor((Date.now() - state.startedAt) / 60000) + plusMin;
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
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
