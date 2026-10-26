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
 * Data:
 *   ../scorm-shell/data/sample-profiles.json  the course buyers (Tom, Emma, Maria, Lukas)
 *   prop-pain-bank.json  props_reference + 6 pain statements (correct_prop)
 *   prospects.json       { stakeholders: [...] }  S.K. (Tom's finance lead), A.B.
 *   transcripts.json     { worked, contrast }  L.D.'s call with Tom and S.K.
 *   quiz.json            3 scenario items (normalised by quiz-normalize.js)
 *
 * Learner-facing copy must not show internal codes (LO-, §, GC-, snake_case,
 * event names). Data strings go through clean() before they are rendered.
 */

import { bootModule } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";
import { loadProfiles, findProfile } from "../scorm-shell/js/apps/profiles.js";
import { resolveDates } from "../scorm-shell/js/dates.js";
/** "a", "a and b", "a, b and c" */
const listJoin = arr => arr.length < 3 ? arr.join(" and ") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`;


const state = {
  api: null, step: 0, startedAt: 0, finished: false,
  props: {}, pains: [], buyers: [], stakeholders: [], transcripts: null,
  quizItems: [], quizIndex: 0, quizScore: 0,
  guidedTries: 0, guidedSay: null, solo: [], fresh: null, timeline: [],
};

// --- Copy the owner reviews (kept together on purpose) ----------------------

/** What each prop sounds like when a buyer describes it. Shown on the prop card. */
const PROP_CUES = {
  1: "fits a buyer who can't see who spent what, or who wants to stop a card at once.",
  2: "fits a buyer who hands out cards by hand, or who wants a separate limit for each person or site.",
  3: "fits a buyer who pays in another currency and loses money every time it is converted.",
  4: "fits a team where someone types receipts into the accounting tool by hand.",
};

/** Step 5: Maria's pain (PP-01). One rationale per prop the learner might pick. */
const GUIDED = {
  painId: "PP-01",
  why: {
    1: "Maria couldn't see who made the charge for two weeks. Real-time spend control shows every charge as it happens, with the cardholder's name on it.",
    2: "Limits on each card would cap future spending. Maria's problem is that nobody could say who made the charge, and Prop 1 answers that.",
    3: "Nothing Maria said was about currency. Leading with FX would tell her you weren't listening.",
    4: "Receipts arrive after the money has gone. Maria's problem was two weeks of not knowing who spent it, and Prop 1 shows that the moment it happens.",
  },
  sayIt: "\"So a £1,200 charge sat there for two weeks and nobody knew whose it was. With us you'd see it the minute it happened, with the name of whoever made it.\"",
};

/** Step 5: words from Maria's pain the learner should say back to her. */
const MARIA_WORDS = ["charge", "1,200", "£1,200", "weeks", "nobody", "explain", "whose", "who"];

/** Step 6: three pains mapped unaided. `signal` picks a line from the buyer's (or stakeholder's) profile. */
const SOLO = [
  { painId: "PP-04", leadId: "L-003", signal: 1,
    why: "Finance tags more than 400 supplier transactions a month by hand because Xero can't read the job numbers. Prop 4 captures the receipt at purchase and sends it to Xero with the job number. A.B., the bookkeeper, is the person who has to agree." },
  { painId: "PP-03", stakeholderId: "SK-sarah", signal: 2,
    why: "S.K. named the loss herself: about 2.4% on €80K a month of USD payments, roughly €1,900. Prop 3 converts at the interbank rate, so lead with it and quote her numbers back to her." },
  { painId: "PP-06", leadId: "L-004", signal: null,
    why: "Lukas wants a weekly cap for each site manager. Team cards with per-card limits (Prop 2) give him that without a call to the bank." },
];

/** Quiz: learner-facing rationale and stem fixes, keyed by item id. */
const QUIZ_COPY = {
  "M5-Q1": { stem: "Emma, who runs operations at a manufacturer with 78 people, says: 'Finance tags 400-plus supplier card transactions a month by hand, because Xero can't read our job numbers.' Which prop do you lead with?",
             rationale: "Emma's finance team tags receipts by hand for hours every month. Receipt capture with Xero sync removes that work, which makes Prop 4 the one to lead with." },
  "M5-Q2": { stem: "Tom, the founder of a Series-B SaaS company, says: 'We're hiring six engineers this quarter, and per-employee cards take forever.' Which reply uses his words instead of jargon?",
             rationale: "The API reply talks about Tom's new hires and gives him one number, two minutes per card. The other three are vendor jargon he would have to translate." },
  "M5-Q3": { stem: "You are 90 seconds into a call with Tom when S.K., his finance lead, joins. Tom hasn't mentioned FX, and you were about to pitch Prop 2. What do you do?",
             rationale: "S.K. owns the FX numbers, so ask her before you choose a prop. On L.D.'s call it was her answer that brought out the €1,900 a month." },
};

// --- Data -------------------------------------------------------------------

async function loadJson(p) { const r = await fetch(p); if (!r.ok) throw new Error(`${p}: ${r.status}`); return resolveDates(await r.json()); }
async function loadAllData() {
  const [buyers, bank, prospects, transcripts, quiz] = await Promise.all([
    loadProfiles(),
    loadJson("./data/prop-pain-bank.json"),
    loadJson("./data/prospects.json"),
    loadJson("./data/transcripts.json"),
    loadJson("./data/quiz.json"),
  ]);
  state.props = bank.props_reference ?? {};
  state.pains = bank.pains ?? [];
  state.buyers = buyers;
  state.stakeholders = prospects?.stakeholders ?? [];
  if (!findProfile(buyers, "L-002") || !findProfile(buyers, "L-001")) throw new Error("buyer profiles missing");
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
const stakeholder = id => state.stakeholders.find(p => p.id === id);
const buyer = id => findProfile(state.buyers, id);
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
    title: "Module 5: Matching pains to products",
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
  { title: "A call that was lost to the wrong pitch",  handler: stepGainAttention },
  { title: "What you will practise in this module",    handler: stepStateOutcome },
  { title: "The four props on J.T.'s card",            handler: stepRecallPrior },
  { title: "How L.D. matched S.K.'s pain to a prop",   handler: stepWorkedExample },
  { title: "Choosing a prop for Maria",                handler: stepGuided },
  { title: "Three pains and a new stakeholder",        handler: stepSolo },
  { title: "J.T.'s review of your matches",            handler: stepFeedback },
  { title: "Three questions from J.T.",                handler: stepQuiz },
  { title: "M.G.'s note and a reminder in seven days", handler: stepTakeaway },
];

/** Continue stays off until the step's task is done in the apps. A step done once stays open after Back. */
const doneSteps = new Set();
function setNextEnabled(on) {
  const next = document.getElementById("narrative-next");
  next.disabled = !on;
  next.setAttribute("aria-disabled", String(!on));
  next.title = on ? "" : "Finish the task in the apps to continue";
}
function markDone(i) { doneSteps.add(i); if (state.step === i) setNextEnabled(true); }

function runStep(i) {
  state.step = i;
  // Each step mounts its own action bar; drop the previous step's one.
  document.querySelectorAll(".m5-bar").forEach(el => el.remove());
  document.getElementById("gagne-step").textContent = `Step ${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body"); body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  setNextEnabled(doneSteps.has(i));
  STEPS[i].handler(body);
}
/** Advance only if the learner is still on step `from` (guards double clicks). */
function advanceFrom(from, delay = 450) {
  markDone(from);
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
      <h2 class="welcome-card__title" id="welcome-title">Matching pains to products</h2>
      <p class="welcome-card__lede">
        Over the next ten minutes you will practise hearing what hurts when a buyer
        talks and choosing the one product that answers it. Then you say it back in the
        buyer's own words. You start with Tom and Maria and go on to Emma, Lukas and S.K.,
        Tom's finance lead.
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
    if (!doneSteps.has(state.step)) return;
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
  document.getElementById("narrative-back").addEventListener("click", () => { if (state.step > 0) runStep(state.step - 1); });
  document.getElementById("narrative-redo")?.addEventListener("click", () => runStep(state.step));
  // No Skip: every task can be finished (a wrong answer shows the right one), and the summary only counts finished work.
  document.getElementById("narrative-skip")?.remove();
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
const DIAL_LOCK = "No calls in this module: you're matching pains to props from call notes.";
function openOutreach() {
  state.api.os.openApp("outreach", { dialLocked: DIAL_LOCK });
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
      <cite>A call with Tom and S.K. that ended at 1:02 without a meeting</cite>
    </blockquote>
    <p style="font-size:13.5px;margin-top:10px">
      The rep pitched before asking what hurt. S.K. had a real problem with the cost of
      currency conversion, and nobody on the call found out about it.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Click <strong>Tom</strong> in Outreach to see one pain turned into one prop and put back in
      the buyer's words.
    </p>`;
  keepOnly(["outreach"]);
  const ob = openOutreach();
  if (!ob) return;
  mountTaskBanner(ob, { id: "m5-s1-tom", label: "Click Tom's row to open the notes from your last call with him.", state: "active" });
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
  const tom = buyer("L-002");
  const card = document.createElement("div");
  card.className = "tom-drawer m5-card";
  card.setAttribute("data-m5-tom-card", "");
  card.innerHTML = `
    <header class="tom-drawer__head"><strong>Notes from your last call with ${escapeHtml(tom?.name ?? "Tom")}</strong></header>
    <p class="tom-drawer__stem">Tom said <em>"${escapeHtml(p?.statement ?? "")}"</em> Every new hire waits on him for a card.</p>
    <p class="tom-drawer__stem">The prop that answers this is <span class="m5-prop-tag">Prop ${p?.correct_prop ?? 2}</span> ${escapeHtml(propName(p?.correct_prop ?? 2)).toLowerCase()}. In his words it sounds like this: "So each new engineer waits on you for a card. With us you issue it yourself in two minutes, and each card gets its own limit."</p>`;
  row.insertAdjacentElement("afterend", card);
  scrollInto(card);
}

// --- Step 2 · what you'll be able to do --------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      In this module you will practise naming the one prop that answers a buyer's pain and
      saying it back in the buyer's own words and numbers. You will also ask a fresh question
      when a second person joins the call.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">You have already seen the first two in Tom's notes. Confirm in Outreach that you have read them.</p>`;
  const ob = openOutreach();
  if (!ob) return;
  waitFor(() => leadRow(ob, "Tom"), row => {
    showTomCard(ob, row);
    mountTaskBanner(ob, { id: "m5-s2-ok", label: "Click Got it under Tom's notes once you have read them.", state: "active" });
    const card = ob.querySelector("[data-m5-tom-card]");
    if (!card.querySelector("[data-m5-s2-done]")) {
      const bar = actionBar("Tom's pain points to Prop 2. Next you'll do the same for four more pains and then ask a second stakeholder a fresh question.", "✓ Got it", "data-m5-s2-done");
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
    <p style="font-size:14px;">FinTechCard sells four props, and every pain you will hear in this module points at one of them.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Open J.T.'s card with the four props in Slack and choose the one that answers Tom's pain.
      The card stays under the <strong>Help</strong> button for the rest of the module.
    </p>`;
  const ob = openOutreach();
  if (!ob) return;
  mountTaskBanner(ob, { id: "m5-s3-open", label: "Open J.T.'s card with the four props in Slack.", state: "active" });
  const card = ob.querySelector("[data-m5-tom-card]");
  const host = card ?? ob.querySelector(".oa-queue") ?? ob;
  host.querySelector("[data-m5-s3-open]")?.closest(".m5-bar")?.remove();
  const bar = actionBar("J.T. has pinned the card with the four props in the pod channel.", "Open Slack", "data-m5-s3-open");
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
        { author: "J.T. (pod lead)", initials: "JT", ts: "09:12", body: "Pinned the four props again. Pick one per pain and keep the others for later questions." },
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
      <div class="m5-propcard__label">J.T. pinned this card with the four props</div>
      ${interactive ? `<p class="m5-propcard__q">Tom said <em>"${escapeHtml(tomPain?.statement ?? "")}"</em> Which prop answers him?</p>` : ""}
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
    mountTaskBanner(sb, { id: "m5-s3-pick", label: "Read the four lines on the card and click the prop that answers Tom's pain.", state: "active" });
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
        fb.textContent = "Tom hands out every card himself. Team cards with their own limits take that job off him.";
        markTaskBannerDone("m5-s3-pick");
        advanceFrom(2, 1400);
      } else {
        fb.textContent = "Tom didn't mention this. His words say that every new hire needs a card from him.";
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
      In this call L.D. is talking to Tom when, at 1:38, Tom brings in <strong>S.K.</strong>,
      his finance lead. The lines where either of them names a pain are marked in yellow.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Click the line where L.D. answers S.K.'s pain with one prop. The lost call with the same
      two buyers is also in the list.
    </p>`;
  keepOnly(["gong"]);
  closeApp("gong");
  const worked = toGong(state.transcripts?.worked, WORKED_ID, "L.D.", "Meeting booked");
  const lost = toGong(state.transcripts?.contrast, LOST_ID, "Rep", "No meeting");
  state.api.os.openApp("gong", { transcripts: [worked, lost], activeTranscriptId: WORKED_ID });
  fitWindow("gong");
  waitFor(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    const gb = appBody("gong");
    mountTaskBanner(gb, { id: "m5-s4-find", label: "Click the line where L.D. answers S.K.'s pain with a prop.", state: "active" });
    const tr = gb.querySelector("[data-region='transcript']");
    const pane = tr.parentElement;
    let fb = pane.querySelector("[data-m5-gong-fb]");
    if (!fb) {
      fb = document.createElement("div");
      fb.className = "m5-gong-fb";
      fb.setAttribute("data-m5-gong-fb", "");
      fb.innerHTML = `<span data-m5-gong-msg>Look for the moment when L.D. chooses a prop for S.K.</span>`;
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
        msg.innerHTML = `S.K. was losing 2.4% on FX, about €1,900 a month. L.D. chose Prop 3 and used her own numbers ("On €80K/month you'd recover roughly €1,900"). Tom's card problem gets Prop 2 after that.`;
        fb.classList.add("is-done");
        if (!fb.querySelector("button")) {
          const b = document.createElement("button");
          b.type = "button"; b.className = "m5-btn"; b.setAttribute("data-m5-s4-done", "");
          b.textContent = "Try one yourself →";
          fb.appendChild(b);
          b.addEventListener("click", () => { markTaskBannerDone("m5-s4-find"); advanceFrom(3, 200); });
        }
        state.timeline.push({ label: "Found L.D.'s match", detail: "S.K.'s FX leak → Prop 3, with her numbers", ts: clock() });
        state.api.eventLog?.record?.("worked_example_completed");
      } else if (ts === "2:24") {
        msg.textContent = "Here L.D. repeats S.K.'s pain back to her, and the prop comes in the line after it.";
      } else if (ts === "0:46") {
        msg.textContent = "L.D. asks about FX here before anyone has named it as a problem. Keep reading.";
      } else if (["0:14", "1:42", "2:10"].includes(ts)) {
        msg.textContent = "This line names a pain. L.D. puts a number on the fix a little further on.";
      } else {
        msg.textContent = "The answer comes after S.K. says how much she loses each month.";
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
    <p style="font-size:14px;"><strong>Maria</strong>, who owns two retail stores, told you <em>"${escapeHtml(p?.statement)}"</em></p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Choose the one prop you would lead with in the panel under her row.</p>`;
  keepOnly(["outreach"]);
  const ob = openOutreach();
  if (!ob) return;
  ob.querySelectorAll("[data-m5-tom-card]").forEach(n => n.remove());
  ob.querySelectorAll(".is-warm-highlight").forEach(n => n.classList.remove("is-warm-highlight"));
  mountTaskBanner(ob, { id: "m5-s5-pick", label: "Choose the prop for Maria's pain in the panel under her row.", state: "active" });
  waitFor(() => leadRow(ob, "Maria"), row => {
    row.classList.add("is-warm-highlight");
    ob.querySelector("[data-m5-s5-drawer]")?.remove();
    const drawer = document.createElement("div");
    drawer.className = "tom-drawer";
    drawer.setAttribute("data-m5-s5-drawer", "");
    drawer.innerHTML = `
      <header class="tom-drawer__head"><strong>Your discovery call with Maria, two minutes in</strong></header>
      <p class="tom-drawer__stem">Maria says <em>"${escapeHtml(p?.statement)}"</em></p>
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
      fb.textContent = GUIDED.why[n];
      scrollInto(fb);
      if (ok && !drawer.querySelector("[data-m5-say]")) {
        drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.disabled = true; });
        state.timeline.push({ label: "Maria's pain", detail: `you chose Prop 1 ${state.guidedTries === 1 ? "on the first try" : `after ${state.guidedTries} tries`}`, ts: clock(), ok: state.guidedTries === 1 });
        mountSayIt(drawer);
      }
    }));
  });
}

/** After the right prop: the learner says it back in Maria's words, then sees the model line. */
function mountSayIt(drawer) {
  mountTaskBanner(appBody("outreach"), { id: "m5-s5-say", label: "Say it back to Maria with at least two of her words.", state: "active" });
  const box = document.createElement("div");
  box.className = "m5-sayit";
  box.setAttribute("data-m5-say", "");
  box.innerHTML = `
    <label for="m5-say" class="m5-sayit__label">What you would say to Maria</label>
    <textarea id="m5-say" rows="2" placeholder="So …"></textarea>
    <div class="m5-sayit__row"><span data-m5-say-status>Use at least two of her words.</span><button type="button" class="m5-btn" data-m5-say-btn disabled>Say it</button></div>
    <p class="m5-say" data-m5-say-model hidden></p>`;
  drawer.appendChild(box);
  scrollInto(box);
  const ta = box.querySelector("#m5-say");
  const btn = box.querySelector("[data-m5-say-btn]");
  const status = box.querySelector("[data-m5-say-status]");
  const used = () => {
    const t = ta.value.toLowerCase();
    const hits = new Set(MARIA_WORDS.filter(w => t.includes(w)).map(w => (w.includes("1,200") ? "1,200" : w === "whose" ? "who" : w)));
    return [...hits];
  };
  ta.addEventListener("input", () => {
    const u = used();
    btn.disabled = ta.value.trim().length < 20;
    status.textContent = u.length ? `So far you have used her words ${u.join(", ")}.` : "Use at least two of her words.";
  });
  btn.addEventListener("click", () => {
    if (state.step !== 4 || btn.disabled) return;
    const u = used();
    const ok = u.length >= 2;
    state.guidedSay = { text: ta.value.trim(), used: u, ok };
    btn.disabled = true; ta.readOnly = true;
    const model = box.querySelector("[data-m5-say-model]");
    model.hidden = false;
    model.textContent = `${ok ? "Maria hears her own problem first." : "Maria won't recognise her own problem in that yet. Reuse more of her words."} M.G. would say something like ${GUIDED.sayIt}`;
    state.timeline.push({ label: "Saying it back to Maria", detail: ok ? `you used her words ${u.join(", ")}` : "the line wasn't in her words yet", ts: clock(), ok });
    markTaskBannerDone("m5-s5-say");
    state.api.eventLog?.record?.("completion_problem_completed", { tries: state.guidedTries, said_in_her_words: ok });
    const next = document.createElement("button");
    next.type = "button"; next.className = "m5-btn"; next.textContent = "Next: on your own →";
    box.appendChild(next);
    next.addEventListener("click", () => advanceFrom(4, 100));
    scrollInto(next);
  });
}

// --- Step 6 · solo: three pains ------------------------------------------------

function stepSolo(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Here are three pains from this week's calls. Choose one prop for each, this time without hints.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Then S.K. joins Tom's call, and you ask her a fresh question before you name any prop. When all four are done, send them to J.T.</p>
    <p class="retention-note" data-m5-solo-status aria-live="polite">You haven't matched any of the three pains yet.</p>`;
  keepOnly(["outreach"]);
  const ob = openOutreach();
  if (!ob) return;
  ob.querySelectorAll("[data-m5-tom-card], [data-m5-s5-drawer]").forEach(n => n.remove());
  ob.querySelectorAll(".is-warm-highlight").forEach(n => n.classList.remove("is-warm-highlight"));
  mountTaskBanner(ob, { id: "m5-s6-solo", label: "Choose a prop for each pain, then write your question for S.K.", state: "active" });
  const queue = ob.querySelector(".oa-queue") ?? ob;
  queue.querySelector("[data-m5-s6-stage]")?.remove();
  state.solo = [];
  state.fresh = null;
  const stage = document.createElement("div");
  stage.className = "m5-solo";
  stage.setAttribute("data-m5-s6-stage", "");
  const signalOf = s => {
    if (s.signal === null) return "";
    const src = s.leadId ? buyer(s.leadId)?.signals?.[s.signal]?.content : stakeholder(s.stakeholderId)?.signals?.[s.signal];
    return src ?? "";
  };
  const items = SOLO.map(s => ({ ...s, p: pain(s.painId), sig: signalOf(s) })).filter(s => s.p);
  stage.innerHTML = `
    <div class="m5-solo__head">Three pains from this week's calls</div>
    ${items.map((s, i) => `
      <section class="m5-solo__item" data-i="${i}">
        <div class="m5-solo__who">${escapeHtml(clean(s.p.archetype_label))}${s.sig ? ` <span>· ${escapeHtml(clean(s.sig).replace(/\s*\([^)]*\)$/, ""))}</span>` : ""}</div>
        <p class="m5-solo__pain">"${escapeHtml(s.p.statement)}"</p>
        <div class="m5-solo__opts" role="radiogroup" aria-label="Prop for this pain">
          ${[1, 2, 3, 4].map(n => `<button type="button" class="m5-solo__opt" role="radio" aria-checked="false" data-prop="${n}"><b>${n}</b> ${escapeHtml(propName(n))}</button>`).join("")}
        </div>
        <div class="tom-drawer__fb" hidden></div>
      </section>`).join("")}
    <section class="m5-solo__item" data-m5-fresh>
      <div class="m5-solo__who">S.K., Tom's finance lead, <span>joins your call with Tom at 1:38</span></div>
      <p class="m5-solo__pain">"Hi, Tom asked me to listen in."</p>
      <label for="m5-fresh" class="m5-sayit__label">The question you ask her before you name any prop</label>
      <textarea id="m5-fresh" rows="2" placeholder="S.K., …?"></textarea>
      <div class="m5-sayit__row"><span data-m5-fresh-status>Ask about her own numbers and leave the product out for now.</span><button type="button" class="m5-btn" data-m5-fresh-btn disabled>Ask</button></div>
      <div class="tom-drawer__fb" hidden></div>
    </section>
    <div class="m5-solo__foot">
      <span data-m5-solo-score>Choose a prop for each pain.</span>
      <button type="button" class="m5-btn" data-m5-s6-send disabled>Send to J.T. →</button>
    </div>`;
  queue.prepend(stage);
  queue.scrollTop = 0;
  const send = stage.querySelector("[data-m5-s6-send]");
  const status = () => {
    const done = state.solo.length, right = state.solo.filter(r => r.ok).length;
    const txt = `${right} of ${items.length} pains matched${done < items.length ? `, ${items.length - done} to go` : ""}. ${state.fresh ? "Question for S.K. asked." : "S.K. is waiting for your question."}`;
    const s = document.querySelector("[data-m5-solo-status]"); if (s) s.textContent = txt;
    const all = done === items.length && state.fresh;
    stage.querySelector("[data-m5-solo-score]").textContent = all ? `${right} of ${items.length} pains matched and S.K. asked. Send it all to J.T.` : txt;
    send.disabled = !all;
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
      fb.textContent = ok ? s.why : `The prop that fits is Prop ${s.p.correct_prop}, ${propName(s.p.correct_prop).replace(/^[A-Z](?=[a-z])/, ch => ch.toLowerCase())}. ${s.why}`;
      const who = clean(s.p.archetype_label).split("·")[0].trim();
      state.solo.push({ ok, who, picked: n, right: s.p.correct_prop });
      state.timeline.push({ label: `${who}'s pain`, detail: ok ? `you chose Prop ${n}, ${propName(n).replace(/^[A-Z](?=[a-z])/, ch => ch.toLowerCase())}` : `you chose Prop ${n} when the answer was Prop ${s.p.correct_prop}`, ts: clock(), ok });
      state.api.eventLog?.record?.("prop_mapped", { pain: s.p.id, picked: n, correct: ok });
      status();
      scrollInto(state.solo.length === items.length ? stage.querySelector(".m5-solo__foot") : fb);
    }));
  });
  const fresh = stage.querySelector("[data-m5-fresh]");
  const fta = fresh.querySelector("#m5-fresh");
  const fbtn = fresh.querySelector("[data-m5-fresh-btn]");
  fta.addEventListener("input", () => { fbtn.disabled = fta.value.trim().length < 15 || Boolean(state.fresh); });
  fbtn.addEventListener("click", () => {
    if (state.step !== 5 || state.fresh) return;
    const t = fta.value.trim();
    const checks = {
      question: /\?\s*$/.test(t),
      hers: /\b(fx|currency|currencies|usd|eur|dollar|volume|spend|payments?|suppliers?|bills?|statements?|month|monthly|spread|exposure)\b/i.test(t),
      noPitch: !/\b(interbank|prop|we run|our|cheaper|save|fintechcard|demo)\b/i.test(t),
    };
    const ok = checks.question && checks.hers && checks.noPitch;
    state.fresh = { text: t, checks, ok };
    fta.readOnly = true; fbtn.disabled = true;
    const fb = fresh.querySelector(".tom-drawer__fb");
    fb.hidden = false;
    const miss = [!checks.question && "make it a question", !checks.hers && "ask about her numbers, such as FX, monthly volume or payments", !checks.noPitch && "leave the prop out until she has answered"].filter(Boolean);
    fb.textContent = `${ok ? "Your question asks about her numbers before you name anything." : `Next time ${listJoin(miss)}.`} L.D. asked her "S.K., before I go anywhere, what's the monthly EUR-USD volume you're moving on supplier payments?" Her answer, about €1,900 a month lost to the spread, decided the prop.`;
    state.timeline.push({ label: "Your question for S.K.", detail: ok ? `"${t.slice(0, 70)}"` : `next time ${listJoin(miss)}`, ts: clock(), ok });
    state.api.eventLog?.record?.("prop_mapped", { pain: "fresh_question_sk", correct: ok });
    status();
    scrollInto(fb);
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
  body.innerHTML = `<p style="font-size:14px;"><strong>J.T.</strong>, your pod lead, has reviewed your matches in Slack. Read his messages, then click Mark thread read.</p>`;
  keepOnly([]);
  const dm = [
    { author: "J.T. (pod lead)", initials: "JT", ts: clock(0), body: state.solo.length ? `Here are my notes on your matches. On your own you got ${right} of ${total} right.` : "Here are my notes on what you've done so far." },
    ...state.timeline.map(e => ({ author: "J.T. (pod lead)", initials: "JT", ts: e.ts, body: `${e.ok === false ? "⚠️" : "✅"} ${e.label}: ${e.detail}${/[.?!]"?$/.test(e.detail) ? "" : "."}` })),
    { author: "J.T. (pod lead)", initials: "JT", ts: clock(1), body: "When two props fit, lead with the one the buyer put a number on and bring up the second one later in the call." },
    { author: "M.G. (peer)", initials: "MG", ts: clock(2), body: "I write down the buyer's exact words during the call and read them back before I name the prop." },
  ];
  state.api.os.openApp("slack", { channel: { channel_id: "coaching-jt", pinned_messages: [], messages: dm } });
  fitWindow("slack", 760);
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    mountTaskBanner(sb, { id: "m5-s7-read", label: "Read J.T.'s review, then click Mark thread read.", state: "active" });
    if (feed.querySelector("[data-m5-s7-done]")) return;
    const bar = actionBar("J.T. will see that you have read his review.", "✓ Mark thread read", "data-m5-s7-done");
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
  body.innerHTML = `<p style="font-size:14px;">J.T. has posted three questions in Slack, and you pass this check if you answer two of them correctly.</p>`;
  if (!findWin("slack")) { state.api.os.openApp("slack", { channel: { channel_id: "coaching-jt", pinned_messages: [], messages: [] } }); fitWindow("slack", 760); }
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    mountTaskBanner(sb, { id: "m5-s8-quiz", label: "Answer J.T.'s three questions. A wrong answer shows you the right one and why.", state: "active" });
    feed.querySelector("[data-m5-s7-done]")?.closest(".m5-bar")?.remove();
    feed.querySelector("[data-m5-quiz-thread]")?.remove();
    const thread = document.createElement("div");
    thread.setAttribute("data-m5-quiz-thread", "");
    thread.className = "m5-quiz";
    thread.innerHTML = `<div class="m5-quiz__label">J.T. posted these questions</div><div data-quiz-host></div>`;
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
    fb.hidden = false; fb.textContent = opt.rationale;
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
  body.innerHTML = `<p style="font-size:14px;">You answered <strong>${state.quizScore} of ${state.quizItems.length}</strong> questions correctly (${pct}%). M.G. has pinned a short note in Slack, and the module ends when you schedule the refresher under it.</p>`;
  if (!findWin("slack")) { state.api.os.openApp("slack", { channel: { channel_id: "coaching-jt", pinned_messages: [], messages: [] } }); fitWindow("slack", 760); }
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    const sb = appBody("slack");
    feed.querySelector("[data-m5-quiz-thread]")?.remove();
    mountTaskBanner(sb, { id: "m5-s9-pin", label: "Read M.G.'s note and schedule the refresher, which finishes the module.", state: "active" });
    if (feed.querySelector("[data-m5-pinned]")) return;
    const pin = document.createElement("div");
    pin.className = "m5-pinned";
    pin.setAttribute("data-m5-pinned", "");
    pin.innerHTML = `
      <div class="m5-pinned__label">📌 M.G., a rep in the Manchester pod, pinned this note</div>
      <p class="m5-pinned__quote">"Before you pitch, repeat the pain in the buyer's own words. Then name one prop with one number from their answer."</p>
      <div class="m5-pinned__foot">
        <span>In seven days you'll get three new pains to match.</span>
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
      <div class="summary-card__check${pct >= 67 ? "" : " is-retry"}" aria-hidden="true">${pct >= 67 ? "✓" : "↻"}</div>
      <h2 class="summary-card__title" id="summary-title">Matching pains to products, ${pct >= 67 ? "passed" : "not passed yet"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat"><span class="summary-card__stat-k">Quiz</span><span class="summary-card__stat-v">${state.quizScore}/${state.quizItems.length}</span><span class="summary-card__stat-sub">${pct}%, ${pct >= 67 ? "above the 67% pass mark" : "below the 67% pass mark"}</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">On your own</span><span class="summary-card__stat-v">${right}/${state.solo.length || SOLO.length}</span><span class="summary-card__stat-sub">pains matched without hints</span></div>
        <div class="summary-card__stat"><span class="summary-card__stat-k">Time</span><span class="summary-card__stat-v">${timestamp()}</span><span class="summary-card__stat-sub">the module is planned for ten minutes</span></div>
      </div>
      <details class="summary-card__recap"><summary>The nine steps of this module</summary><ol class="summary-card__list">${STEPS.map((s, i) => `<li><span class="summary-card__list-n">${i + 1}</span><span class="summary-card__list-label">${escapeHtml(s.title)}</span></li>`).join("")}</ol></details>
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
