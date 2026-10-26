/**
 * Module 2 · M2 Objection Acknowledge · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * bootModule + task-banner + welcome/summary cards + 9 steps. The keystone
 * move: restate the buyer's objection with at least two of their own words,
 * no rebuttal, wait, then ask an open follow-up.
 *
 * Buyers and shared calls (GC-06, GC-01) come from scorm-shell/data; this
 * module adds its own lost call (GC-09), the objection bank and the quiz.
 * The solo call runs in the phone dialler with a new buyer (Lukas): the wait
 * after the restate is timed by `phone:silence`, and J.T.'s feedback in step 7
 * is built from what the learner typed and did.
 */

import { bootModule, eventBus, PASS_PCT } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";
import { loadProfiles, loadCalls, findProfile, pickCalls } from "../scorm-shell/js/apps/profiles.js";
import { EVENT } from "../scorm-shell/js/event-log.js";
import { resolveDates } from "../scorm-shell/js/dates.js";

const WAIT_MS = 3000;
const DIAL_LOCK = "No calls until step 6. Then you call Lukas from the panel under his row.";

const state = {
  api: null, step: 0, startedAt: 0, finished: false,
  profiles: [], calls: [], bank: [], quizItems: [], quizIndex: 0, quizScore: 0,
  stepTs: {},
  workedDone: false,
  sven: { tries: 0, ok: false },
  solo: null,   // { restate, overlap, rebuttal, waited, waitMs, followUp, open }
};

const tom   = () => findProfile(state.profiles, "L-002");
const lukas = () => findProfile(state.profiles, "L-004");
const sven  = () => findProfile(state.profiles, "L-005");
const ob    = id => state.bank.find(o => o.id === id);

// --- Data + boot ---------------------------------------------------------------

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return resolveDates(await res.json());
}

async function start() {
  try {
    const [profiles, shared, local, bank, quiz] = await Promise.all([
      loadProfiles(), loadCalls(),
      loadJson("./data/transcripts.json"),
      loadJson("./data/objection-bank.json"),
      loadJson("./data/quiz.json"),
    ]);
    state.profiles = profiles;
    state.calls = [...pickCalls(shared, ["GC-06", "GC-01"]), ...local];
    state.bank = bank;
    state.quizItems = normalizeQuiz(quiz);
    if (!tom() || !lukas() || !sven() || !ob("OB-03") || !ob("OB-04")) throw new Error("buyer data missing");
  } catch (err) {
    console.error("[M2] Failed to load module data", err);
    renderFatal(err.message);
    return;
  }
  bootModule({
    moduleId: "M2",
    title: "Module 2: Acknowledging objections",
    appsToLaunch: [],
    onReady(api) {
      state.api = api;
      state.startedAt = Date.now();
      wireProgressTimer();
      wireHelpButton();
      wireNarrativeButtons();
      wireCallEvents();
      showWelcomeCard(() => runStep(0));
    },
  });
}
start();

const STEPS = [
  { title: "How H.K. lost a call by arguing with an objection",         handler: stepGainAttention },
  { title: "What you will practise in this module",                     handler: stepStateOutcome },
  { title: "The three moves of a call",                                 handler: stepRecallPrior },
  { title: "L.D.'s answer to Tom's Brex objection",                     handler: stepWorkedExample },
  { title: "Choosing how to acknowledge Sven",                          handler: stepCompletionProblem },
  { title: "Your own call to Lukas",                                    handler: stepSoloProblem },
  { title: "J.T.'s review of your call",                                handler: stepFeedback },
  { title: "Three questions from J.T.",                                 handler: stepQuiz },
  { title: "M.G.'s note and a reminder in seven days",                  handler: stepTakeaway },
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
  // Each step mounts its own action bar and highlight; drop the previous step's ones.
  document.querySelectorAll(".mx-bar").forEach(el => el.remove());
  document.querySelectorAll(".is-warm-highlight").forEach(el => el.classList.remove("is-warm-highlight"));
  document.getElementById("gagne-step").textContent      = `Step ${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body");
  body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  setNextEnabled(doneSteps.has(i));
  STEPS[i].handler(body);
}

function completeStep(from, delay = 450) {
  markDone(from);
  if (!state.stepTs[from]) state.stepTs[from] = timestamp();
  setTimeout(() => { if (state.step === from) runStep(from + 1); }, delay);
}

function showWelcomeCard(onStart) {
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const card = document.createElement("div");
  card.className = "welcome-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "welcome-title");
  card.innerHTML = `
    <div class="welcome-card__panel">
      <span class="welcome-card__logo" aria-hidden="true">FTC</span>
      <h2 class="welcome-card__title" id="welcome-title">Acknowledging objections</h2>
      <p class="welcome-card__lede">
        Over the next ten minutes you will practise what to do when a buyer pushes
        back. You repeat the objection in their own words before you say anything else,
        and you wait for their answer before you ask an open question. All nine steps
        happen in the apps on this desktop.
      </p>
      <button type="button" class="welcome-card__start" data-action="start">
        Start module &rarr;
      </button>
    </div>
  `;
  document.body.appendChild(card);
  const btn = card.querySelector("[data-action='start']");
  btn?.focus({ preventScroll: true });
  btn?.addEventListener("click", () => {
    card.classList.add("welcome-card--out");
    setTimeout(() => {
      card.remove();
      if (overlay) overlay.style.visibility = "";
      onStart?.();
    }, 220);
  });
}

function updateProgressBar(currentStep) {
  const bar = document.getElementById("step-progress");
  if (!bar) return;
  bar.setAttribute("aria-valuenow", String(currentStep));
  bar.querySelectorAll(".step-progress__seg").forEach(seg => {
    const n = Number(seg.dataset.step);
    seg.dataset.state = n < currentStep ? "done" : n === currentStep ? "current" : "pending";
  });
}

function wireNarrativeButtons() {
  document.getElementById("narrative-next").addEventListener("click", () => {
    if (!doneSteps.has(state.step)) return;
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
  document.getElementById("narrative-back").addEventListener("click", () => {
    if (state.step > 0) runStep(state.step - 1);
  });
  document.getElementById("narrative-redo")?.addEventListener("click", () => runStep(state.step));
  // No Skip: every task can be finished (a wrong answer shows the right one), and the summary only counts finished work.
  document.getElementById("narrative-skip")?.remove();
}

function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => {
    const highlight = state.step === 2 ? "pre-training" : "M2";
    state.api.os.openApp("slack", { highlightModule: highlight });
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
function keepOnly(appIds) {
  if (!state.api?.os?.listWindows) return;
  const keep = new Set(appIds);
  for (const w of state.api.os.listWindows()) if (!keep.has(w.appId)) state.api.os.closeApp(w);
}
function openOutreach(lock = DIAL_LOCK) {
  state.api.os.openApp("outreach", { dialLocked: lock });
  return appBody("outreach");
}
function openGong() {
  state.api.os.openApp("gong", { transcripts: state.calls, activeTranscriptId: "GC-06" });
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
const say = (who, speaker, text) => eventBus.dispatchEvent(new CustomEvent("phone:say", { detail: { who, speaker, text } }));

// --- Restate + follow-up checks ----------------------------------------------------

const STOP = new Set("the and with our you your that this one those had have has was were are for from his her him she they them its it's i'm we we're dont don't not but just very what".split(" "));
/** Lower-case word stems, so "tool" and "tools" or "fintech" and "fintechs" match. */
function stems(text) {
  return String(text).toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9£€%]+/)
    .filter(w => w.length >= 3 && !STOP.has(w))
    .map(w => w.replace(/(ings|ing|ed|es|s)$/, "") || w);
}
/** Words that argue back. A bare "our" is not one ("so our call is about…"); "our" plus what we sell is. */
const REBUTTAL = /\b(but|however|actually|although|unlike|we're not|we are not|regulated|insured|safer|guarantee|our (cards?|platform|product|tool|fees|uptime|bank|partner|licen[cs]e)|we have|we've got)\b/i;

function checkRestate(text, objection) {
  const objStems = new Set(stems(objection));
  // Show the learner's own words ("sideways", "fintechs"), one per matching stem.
  const seen = new Set(), used = [];
  for (const w of String(text).toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9£€%]+/)) {
    const st = stems(w)[0];
    if (st && objStems.has(st) && !seen.has(st)) { seen.add(st); used.push(w); }
  }
  const t = text.trim();
  return {
    text: t,
    used,
    checks: { words: used.length >= 2, noRebuttal: !REBUTTAL.test(t), length: t.length >= 20 },
  };
}
function checkFollowUp(text) {
  const t = text.trim();
  return {
    text: t,
    checks: {
      question: /\?\s*$/.test(t),
      open: /^(what|how|why|which|who|when|where|tell me|walk me)\b/i.test(t.replace(/^(so|and|ok|okay|right)[,\s]+/i, "")),
      noPitch: !/\b(fintechcard|our (card|cards|platform|product|tool)|we (help|offer|can|provide)|demo|cheaper|safer)\b/i.test(t),
    },
  };
}
const RESTATE_LABELS = { words: "2+ of his words", noRebuttal: "no rebuttal", length: "a full sentence" };
const FOLLOW_LABELS = { question: "ends with ?", open: "open (what / how / why…)", noPitch: "no pitch" };
const checksHtml = (labels, attr) =>
  `<ul class="mx-checks" ${attr} aria-live="polite">${Object.entries(labels).map(([k, l]) => `<li data-check="${k}" data-ok="false">${l}</li>`).join("")}</ul>`;
function paintChecks(list, checks) {
  list.querySelectorAll("[data-check]").forEach(li => { li.dataset.ok = checks[li.dataset.check] ? "true" : "false"; });
}

// --- Step 1 -----------------------------------------------------------------

function stepGainAttention(body) {
  const lost = state.calls.find(c => c.id === "GC-09");
  const [buyerLine, repLine, endLine] = lost?.lines ?? [];
  body.innerHTML = `
    <blockquote class="peer-quote">
      Buyer: "${escapeHtml(buyerLine?.text)}"<br>
      H.K.: "${escapeHtml(repLine?.text)}"<br>
      Buyer: "${escapeHtml(endLine?.text)}"
      <cite>Gong call GC-09, which ended at 1:42</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      H.K. answered the objection with an argument about fees, and the buyer ended the
      call. A buyer has to hear that you listened before any counter-argument can land.
    </p>
  `;
  const ob1 = openOutreach();
  if (!ob1) return;
  mountTaskBanner(ob1, {
    id: "m2-s1-pick-tom",
    label: "Click Tom's row in Outreach.",
    state: "active",
  });
  waitFor(() => leadRow(appBody("outreach"), "Tom"), row => {
    if (state.step !== 0) return;
    row.classList.add("is-warm-highlight");
    if (row.dataset.m2Bound) return;
    row.dataset.m2Bound = "true";
    row.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]') || state.step !== 0) return;
      markTaskBannerDone("m2-s1-pick-tom");
      state.api.eventLog?.record?.("step1_picked_tom");
      completeStep(0);
    });
  });
}

// --- Step 2 -----------------------------------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      In this module you will practise repeating a buyer's objection with at least two of
      their own words and no counter-argument. Then you wait for the buyer's answer and ask
      the open question it points to.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      First, confirm in Outreach that you know which objection Tom usually raises.
    </p>
  `;
  openOutreach();
  waitFor(() => appBody("outreach")?.querySelector(".lead-row"), () => {
    if (state.step !== 1) return;
    const o = appBody("outreach");
    mountTaskBanner(o, { id: "m2-s2-confirm", label: "Read the objection from Tom's CRM notes below and click Got it.", state: "active" });
    bar(o, "data-m2-s2-done", `According to his CRM notes, Tom usually says <em>"${escapeHtml(tom().top_objection)}"</em>`, "✓ Got it")
      .querySelector("button").addEventListener("click", () => {
        if (state.step !== 1) return;
        markTaskBannerDone("m2-s2-confirm");
        state.api.eventLog?.record?.("step2_objection_confirmed");
        completeStep(1);
      });
  });
}

// --- Step 3 -----------------------------------------------------------------

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Every call in this course follows three moves, and this module covers the second.</p>
    <ol style="font-size:13.5px; margin:6px 0 8px 18px;">
      <li><strong>M1, the diagnostic:</strong> you ask one specific question based on the buyer's profile.</li>
      <li><strong>M2, the acknowledgement:</strong> you repeat the buyer's objection in their own words before you answer it.</li>
      <li><strong>M3, the close:</strong> you offer two times and send the invite while the buyer is still on the line.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Open Gong now, where L.D.'s call with Tom is waiting.
    </p>
  `;
  const done = () => {
    if (state.step !== 2) return;
    markTaskBannerDone("m2-s3-open-gong");
    state.api.eventLog?.record?.("step3_gong_opened");
    completeStep(2, 500);
  };
  openOutreach();
  waitFor(() => appBody("outreach"), o => {
    if (state.step !== 2) return;
    mountTaskBanner(o, { id: "m2-s3-open-gong", label: "Open Gong with the button below.", state: "active" });
    if (isOpen("gong")) { done(); return; }
    bar(o, "data-m2-s3-open-gong", "In Gong, the line where L.D. repeats the objection has an M2 chip next to it.", "🎙 Open Gong")
      .querySelector("button").addEventListener("click", () => { openGong(); done(); });
  });
}

// --- Step 4 -----------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      On GC-06 Tom tells <strong>L.D.</strong> that they already use Brex. L.D. repeats it back,
      waits three seconds and asks about FX only after Tom has answered.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Click the <strong>[M2]</strong> chip on the line where he repeats the objection.
      On GC-01 M.G. does the same with Maria's bank Visa, and GC-09 is the call H.K. lost by arguing.
    </p>
  `;
  openGong();
  waitFor(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    if (state.step !== 3) return;
    const gong = appBody("gong");
    mountTaskBanner(gong, { id: "m2-s4-watch", label: "Click the [M2] chip on L.D.'s line, or press Watched it.", state: "active" });
    const complete = () => {
      if (state.step !== 3) return;
      state.workedDone = true;
      markTaskBannerDone("m2-s4-watch");
      state.api.eventLog?.record?.(EVENT.WORKED_EXAMPLE_COMPLETED);
      completeStep(3);
    };
    bar(gong, "data-m2-s4-done", "L.D. reuses three of Tom's words (already, use, Brex) and waits three seconds before he asks about FX.", "✓ Watched it")
      .querySelector("button").addEventListener("click", complete);
    if (!gong.dataset.m2ChipBound) {
      gong.dataset.m2ChipBound = "true";
      gong.addEventListener("click", e => { if (e.target.closest?.('.m-chip[data-move="M2"]')) complete(); });
    }
  });
}

// --- Step 5 -----------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  const s = sven();
  const bank = ob("OB-03");
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>${s.name}</strong> runs an industrial wholesale business in Hamburg with ${s.fte} people.
      On the call he tells you <em>"${escapeHtml(bank.buyer_verbatim)}"</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Choose how you would acknowledge it in the panel under his row in Outreach.
    </p>
  `;
  const options = [
    { label: "A", result: "anti",
      text: `"${bank.anti_patterns[0]}"`,
      rationale: "This argues back without repeating anything Sven said. He never hears that you listened." },
    { label: "B", result: "partial",
      text: `"That's fair, accountants are busy. What can I do to help?"`,
      rationale: "It reuses only one of his words, and the question after it is so general that Sven has nothing specific to answer." },
    { label: "C", result: "correct",
      text: `"${bank.ideal_phrases[0].replace(/\.$/, "")} — what does the friction usually look like for her?"`,
      rationale: "It reuses three of his words (accountant, another, tool) without arguing, then asks an open question about the friction." },
    { label: "D", result: "anti",
      text: `"${bank.anti_patterns[1]}"`,
      rationale: "It argues with the accountant before you have heard her side, and arguing with someone who isn't on the call only makes Sven defend her." },
  ];
  openOutreach();
  waitFor(() => leadRow(appBody("outreach"), "Sven"), row => {
    if (state.step !== 4) return;
    mountSvenDrawer(appBody("outreach"), row, options, bank);
  });
}

function mountSvenDrawer(o, row, options, bank) {
  mountTaskBanner(o, { id: "m2-s5-pick-ack", label: "Choose your reply to Sven in the panel under his row.", state: "active" });
  row.classList.add("is-warm-highlight");
  o.querySelector("[data-m2-s5-drawer]")?.remove();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m2-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Your call with Sven, a minute in</strong>
    </header>
    <p class="tom-drawer__stem">Sven says <em>"${escapeHtml(bank.buyer_verbatim)}"</em></p>
    <div class="tom-drawer__opts" role="radiogroup" aria-label="Choose your reply">
      ${options.map((op, i) => `
        <button type="button" class="tom-drawer__opt" role="radio"
                aria-checked="false" data-result="${op.result}" data-idx="${i}">
          <span class="tom-drawer__label">${op.label}</span>
          <span class="tom-drawer__text">${escapeHtml(op.text)}</span>
        </button>`).join("")}
    </div>
    <div class="tom-drawer__fb" hidden></div>
  `;
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
      fb.hidden = false;
      fb.textContent = opt.rationale;
      fb.scrollIntoView({ block: "nearest" });
      if (opt.result === "correct") {
        state.sven.ok = true;
        markTaskBannerDone("m2-s5-pick-ack");
        state.api.eventLog?.record?.(EVENT.COMPLETION_PROBLEM_COMPLETED, { tries: state.sven.tries });
        completeStep(4, 900);
      }
    });
  });
}

// --- Step 6 · solo call with Lukas ------------------------------------------------

function stepSoloProblem(body) {
  keepOnly(["outreach", "phone-dialler"]);
  const l = lukas();
  state.solo = { phase: "dial", restate: null, waited: null, waitMs: 0, followUp: null };
  body.innerHTML = `
    <p style="font-size:14px;">
      ${l.name} owns ${escapeHtml(l.company)}, a restaurant group with four locations in Munich,
      and hasn't spoken to us before. This time you make the call and handle his objection yourself.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      When he raises it, repeat it with at least two of his words. Wait while the dialler times
      the pause, and ask your open question after he answers.
    </p>
  `;
  openOutreach("Use the Dial Lukas button in the panel under his row.");
  waitFor(() => leadRow(appBody("outreach"), "Lukas"), row => {
    if (state.step !== 5) return;
    mountSoloStage(appBody("outreach"), row, l);
  });
}

function mountSoloStage(o, row, l) {
  const bank = ob("OB-04");
  mountTaskBanner(o, { id: "m2-s6-solo", label: `Call ${l.name} with the button under his row.`, state: "active" });
  row.classList.add("is-warm-highlight");
  o.querySelector("[data-m2-s6-stage]")?.remove();
  const stage = document.createElement("div");
  stage.className = "mx-stage";
  stage.setAttribute("data-m2-s6-stage", "");
  stage.innerHTML = `
    <div class="mx-row" data-part="dial" style="margin-top:0">
      <button type="button" class="mx-btn" data-m2-dial>📞 Dial ${escapeHtml(l.name)}</button>
      <span class="mx-status">${escapeHtml(l.company)} has ${escapeHtml(String(l.stage).split("·")[0].trim().toLowerCase())}.</span>
    </div>
    <div data-part="restate" hidden>
      <p class="mx-signal mx-signal--objection">Lukas says "${escapeHtml(bank.buyer_verbatim)}"</p>
      <label for="m2-restate">Repeat his objection in his own words, without arguing with it</label>
      <textarea id="m2-restate" rows="2" placeholder="So …"></textarea>
      ${checksHtml(RESTATE_LABELS, "data-restate-checks")}
      <div class="mx-row"><button type="button" class="mx-btn" data-m2-say disabled>Say it</button><span class="mx-status" data-restate-status>Say it turns on once you use at least two of his words.</span></div>
    </div>
    <div data-part="follow" hidden>
      <label for="m2-follow">Your open question, now that he has answered</label>
      <textarea id="m2-follow" rows="2" placeholder="What …?"></textarea>
      ${checksHtml(FOLLOW_LABELS, "data-follow-checks")}
      <div class="mx-row"><button type="button" class="mx-btn" data-m2-ask disabled>Ask</button></div>
    </div>
    <p class="mx-fb" data-m2-solo-fb role="status" hidden></p>
  `;
  row.insertAdjacentElement("afterend", stage);
  stage.scrollIntoView({ block: "nearest" });

  stage.querySelector("[data-m2-dial]").addEventListener("click", () => {
    if (state.step !== 5) return;
    state.solo = { phase: "ringing", restate: null, waited: null, waitMs: 0, followUp: null };
    stage.querySelector("[data-part='restate']").hidden = true;
    stage.querySelector("[data-part='follow']").hidden = true;
    stage.querySelector("[data-m2-solo-fb]").hidden = true;
    const prospect = { ...l };
    state.api.os.openApp("phone-dialler", { prospect });
    eventBus.dispatchEvent(new CustomEvent("phone:dial", { detail: { prospect } }));
  });

  const ta = stage.querySelector("#m2-restate");
  const sayBtn = stage.querySelector("[data-m2-say]");
  ta.addEventListener("input", () => {
    const r = checkRestate(ta.value, bank.buyer_verbatim);
    paintChecks(stage.querySelector("[data-restate-checks]"), r.checks);
    sayBtn.disabled = !(r.checks.words && r.checks.length);
    stage.querySelector("[data-restate-status]").textContent = r.used.length
      ? `So far you have used his words ${r.used.join(", ")}.`
      : "Say it turns on once you use at least two of his words.";
  });
  sayBtn.addEventListener("click", () => {
    if (state.step !== 5 || state.solo.phase !== "objection") return;
    const r = checkRestate(ta.value, bank.buyer_verbatim);
    state.solo.restate = r;
    state.solo.phase = "waiting";
    sayBtn.disabled = true;
    ta.readOnly = true;
    say("rep", "You", r.text);
    eventBus.dispatchEvent(new CustomEvent("phone:move", { detail: { move: "M2" } }));
    eventBus.dispatchEvent(new CustomEvent("telemetry", { detail: { event_name: EVENT.OBJECTION_RESTATED, word_overlap: r.used.length } }));
    if (!r.checks.noRebuttal) eventBus.dispatchEvent(new CustomEvent("telemetry", { detail: { event_name: EVENT.OBJECTION_ARGUED } }));
    eventBus.dispatchEvent(new CustomEvent("phone:silence", { detail: { start: true, thresholdMs: WAIT_MS } }));
    mountWaitBar();
  });

  const fta = stage.querySelector("#m2-follow");
  const askBtn = stage.querySelector("[data-m2-ask]");
  fta.addEventListener("input", () => {
    const f = checkFollowUp(fta.value);
    paintChecks(stage.querySelector("[data-follow-checks]"), f.checks);
    askBtn.disabled = fta.value.trim().length < 10;
  });
  askBtn.addEventListener("click", () => {
    if (state.step !== 5 || state.solo.phase !== "follow") return;
    const f = checkFollowUp(fta.value);
    state.solo.followUp = f;
    state.solo.phase = "asked";
    askBtn.disabled = true;
    fta.readOnly = true;
    say("rep", "You", f.text);
    const open = f.checks.question && f.checks.open && f.checks.noPitch;
    say("buyer", l.name, open
      ? "Honestly? Someone who answers the phone. And knowing where my money sits if something goes wrong."
      : "No. Look, I've told you how I feel about it.");
    const fb = stage.querySelector("[data-m2-solo-fb]");
    fb.hidden = false;
    fb.dataset.tone = open ? "ok" : "warn";
    fb.textContent = open
      ? `Lukas told you what would earn his trust. For the restate, M.G. would have said "${bank.ideal_phrases[0]}" Hang up when you're ready.`
      : `A closed question or a pitch makes Lukas shut down. Next time ask what went wrong or what would help him, and hang up when you're ready.`;
    const phone = appBody("phone-dialler");
    if (phone) mountTaskBanner(phone, { id: "m2-s6-hangup", label: "Hang up in the dialler whenever you are ready.", state: "active" });
  });
}

function mountWaitBar() {
  const phone = appBody("phone-dialler");
  if (!phone) return;
  mountTaskBanner(phone, { id: "m2-s6-wait", label: "Wait for Lukas to answer. The timer under his name counts the pause.", state: "active" });
  phone.querySelector("[data-m2-wait-bar]")?.remove();
  const el = document.createElement("div");
  el.className = "mx-callbar";
  el.setAttribute("data-m2-wait-bar", "");
  el.innerHTML = `<span>If you feel the urge to explain, wait a little longer.</span><button type="button" class="mx-btn mx-btn--small mx-btn--ghost">Jump in</button>`;
  const dialler = phone.querySelector(".dialler");
  dialler?.insertBefore(el, dialler.querySelector(".dialler-controls"));
  if (dialler) dialler.scrollTop = dialler.scrollHeight;
  el.querySelector("button").addEventListener("click", () => {
    if (state.step !== 5 || state.solo?.phase !== "waiting") return;
    state.solo.phase = "jumped";
    say("rep", "You", "…and honestly, we're really not like those startups.");
    eventBus.dispatchEvent(new CustomEvent("phone:silence", { detail: { start: false } }));
  });
}

function showFollowUp(answer) {
  const l = lukas();
  say("buyer", l.name, answer);
  state.solo.phase = "follow";
  const stage = appBody("outreach")?.querySelector("[data-m2-s6-stage]");
  if (!stage) return;
  stage.querySelector("[data-part='follow']").hidden = false;
  stage.querySelector("#m2-follow").focus({ preventScroll: true });
  stage.querySelector("[data-part='follow']").scrollIntoView({ block: "nearest" });
  const o = appBody("outreach");
  if (o) mountTaskBanner(o, { id: "m2-s6-follow", label: "Lukas has answered. Type your open question under his row and press Ask.", state: "active" });
}

function wireCallEvents() {
  eventBus.addEventListener("phone:connected", ev => {
    if (state.step !== 5 || ev.detail?.prospect?.lead_id !== "L-004" || state.solo?.phase !== "ringing") return;
    state.solo.phase = "objection";
    say("buyer", "Lukas", ob("OB-04").buyer_verbatim);
    const stage = appBody("outreach")?.querySelector("[data-m2-s6-stage]");
    if (stage) {
      stage.querySelector("[data-part='restate']").hidden = false;
      stage.querySelector("#m2-restate").focus({ preventScroll: true });
      stage.querySelector("[data-part='restate']").scrollIntoView({ block: "nearest" });
    }
    const o = appBody("outreach");
    if (o) mountTaskBanner(o, { id: "m2-s6-restate", label: "Repeat Lukas's objection under his row, with at least two of his words.", state: "active" });
  });
  eventBus.addEventListener("phone:silence-held", () => {
    if (state.step !== 5 || state.solo?.phase !== "waiting") return;
    eventBus.dispatchEvent(new CustomEvent("phone:silence", { detail: { start: false } }));
  });
  eventBus.addEventListener("phone:silence-ended", ev => {
    if (state.step !== 5 || !state.solo || state.solo.waited !== null) return;
    if (!["waiting", "jumped"].includes(state.solo.phase)) return;
    state.solo.waited = Boolean(ev.detail?.held);
    state.solo.waitMs = ev.detail?.duration_ms ?? 0;
    appBody("phone-dialler")?.querySelector("[data-m2-wait-bar]")?.remove();
    showFollowUp(state.solo.waited
      ? "Exactly. The payroll startup we used missed two pay runs, and nobody picked up the phone."
      : "Everyone says that.");
  });
  eventBus.addEventListener("phone:ended", ev => {
    if (state.step !== 5 || ev.detail?.prospect?.lead_id !== "L-004" || !state.solo) return;
    if (state.solo.phase === "ringing") return;
    if (!state.solo.restate) {
      const o = appBody("outreach");
      if (o) mountTaskBanner(o, { id: "m2-s6-solo", label: "The call ended before you repeated his objection. Dial Lukas again.", state: "active" });
      state.solo.phase = "dial";
      return;
    }
    markTaskBannerDone("m2-s6-solo");
    state.api.eventLog?.record?.(EVENT.SOLO_PROBLEM_COMPLETED, { overlap: state.solo.restate.used.length, waited: Boolean(state.solo.waited) });
    completeStep(5, 900);
  });
}

// --- Step 7 · feedback built from the run ------------------------------------------

function feedbackMessages() {
  const jt = (body, ts = "13:03") => ({ author: "J.T. (pod lead)", initials: "JT", ts, body });
  const msgs = [jt("Here are my notes on your call with Lukas.", "13:02")];
  msgs.push(jt(state.workedDone ? "✅ You found the line on GC-06 where L.D. repeats Tom's objection." : "⚠️ You skipped L.D.'s call. GC-06 shows the whole move in about a minute."));
  msgs.push(jt(state.sven.ok
    ? (state.sven.tries === 1 ? "✅ You chose the right reply to Sven on the first try." : `⚠️ Sven took you ${state.sven.tries} tries. Look for his own words first, then check that nothing in the reply argues back.`)
    : "⚠️ You didn't choose a reply to Sven."));
  const s = state.solo;
  if (s?.restate) {
    const r = s.restate;
    msgs.push(jt(`${r.checks.words && r.checks.noRebuttal ? "✅" : "⚠️"} You told Lukas: "${r.text}"`));
    msgs.push(jt(r.checks.words
      ? `You reused ${r.used.length} of his words (${r.used.join(", ")}), and he heard his own objection.`
      : `You reused only ${r.used.length} of his words, and he needs to hear at least two of them to know you listened.`));
    if (!r.checks.noRebuttal) msgs.push(jt(`⚠️ There's a counter-argument in it. A line like "${ob("OB-04").anti_patterns[1]}" is what loses Lukas.`));
    msgs.push(jt(s.waited
      ? `✅ You waited ${Math.round(s.waitMs / 1000)} seconds, and Lukas used that time to tell you that a payroll startup had missed two pay runs.`
      : `⚠️ You jumped in after ${Math.round(s.waitMs / 1000)} seconds. Lukas never told you what had gone wrong.`));
    if (s.followUp) {
      const f = s.followUp.checks;
      const good = f.question && f.open && f.noPitch;
      msgs.push(jt(good
        ? `✅ Your next question was "${s.followUp.text}", which left him room to explain.`
        : `⚠️ Your next question was "${s.followUp.text}". Start it with what, how or why, and leave the pitch out.`));
    } else {
      msgs.push(jt("⚠️ The call ended before you asked a follow-up question."));
    }
  } else {
    msgs.push(jt("⚠️ You haven't repeated Lukas's objection on a call yet. Redo step 6 when you have two minutes."));
  }
  msgs.push(jt("Repeat the objection first. If you still need to argue the point, do it after the buyer has answered a question.", "13:05"));
  msgs.push({ author: "M.G. (peer)", initials: "MG", ts: "13:06",
    body: "Practise repeating the objection until you do it without thinking. On my calls the buyer often corrects himself once he hears it back." });
  return msgs;
}

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `
    <p style="font-size:14px;"><strong>J.T.</strong>, your pod lead, has sent you a direct message in Slack about your call with Lukas. Read it, then click Mark thread read.</p>
  `;
  state.api.os.openApp("slack", {
    channel: {
      channel_id: "dm-jt-podlead",
      pinned_messages: [
        { title: "The three moves of a call", content_md: "Open with one question built on the buyer's profile. Repeat any objection in the buyer's words before you answer it, and send the invite before you hang up.", related_module: "M2" },
      ],
      messages: feedbackMessages(),
    },
  });
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 6) return;
    mountTaskBanner(appBody("slack"), { id: "m2-s7-read-dm", label: "Read J.T.'s message, then click Mark thread read.", state: "active" });
    bar(feed, "data-m2-s7-done", "J.T. will see that you have read his message.", "✓ Mark thread read")
      .querySelector("button").addEventListener("click", () => {
        if (state.step !== 6) return;
        markTaskBannerDone("m2-s7-read-dm");
        state.api.eventLog?.record?.("step7_feedback_read");
        completeStep(6, 500);
      });
  });
}

// --- Step 8 · quiz ------------------------------------------------------------------

function stepQuiz(body) {
  state.quizIndex = 0;
  state.quizScore = 0;
  body.innerHTML = `
    <p style="font-size:14px;">J.T. has posted three questions in Slack, and you pass this check if you answer two of them correctly.</p>
  `;
  if (!isOpen("slack")) state.api.os.openApp("slack");
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 7) return;
    mountTaskBanner(appBody("slack"), { id: "m2-s8-quiz", label: "Answer J.T.'s three questions. A wrong answer shows you the right one and why.", state: "active" });
    feed.querySelector("[data-m2-s7-done]")?.closest(".mx-bar")?.remove();
    feed.querySelector("[data-m2-quiz-thread]")?.remove();
    const thread = document.createElement("div");
    thread.className = "mx-thread";
    thread.setAttribute("data-m2-quiz-thread", "");
    thread.innerHTML = `<div class="mx-thread__k">J.T. posted these questions at 13:08</div><div data-quiz-host></div>`;
    feed.appendChild(thread);
    renderQuizItem(thread.querySelector("[data-quiz-host]"));
    thread.scrollIntoView({ block: "start" });
  });
}

function renderQuizItem(host) {
  const item = state.quizItems[state.quizIndex];
  const last = state.quizIndex === state.quizItems.length - 1;
  host.innerHTML = `
    <div style="font-size:12px; color:var(--ftc-ink-2); margin-bottom:6px;">Question ${state.quizIndex + 1} of ${state.quizItems.length}</div>
    <p style="font-size:14px; margin:0 0 10px; color:var(--ftc-ink);">${escapeHtml(item.stem)}</p>
    <div role="radiogroup" aria-label="Answer choices" style="display:grid; gap:6px;">
      ${item.options.map((o, i) => `
        <button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${escapeHtml(o.text)}</span>
        </button>`).join("")}
    </div>
    <div class="tom-drawer__fb" hidden></div>
    <div class="mx-quiz-next"><button type="button" class="mx-btn mx-btn--small" data-quiz-next disabled>${last ? "Finish quiz" : "Next question"}</button></div>
  `;
  const fb = host.querySelector(".tom-drawer__fb");
  const nextBtn = host.querySelector("[data-quiz-next]");
  host.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const opt = item.options[Number(btn.dataset.idx)];
      host.querySelectorAll(".tom-drawer__opt").forEach(b => { b.disabled = true; b.style.cursor = "default"; });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
      if (!opt.correct) host.querySelectorAll(".tom-drawer__opt").forEach((b, j) => { if (item.options[j]?.correct) b.classList.add("is-reveal"); });
      fb.hidden = false;
      fb.textContent = opt.rationale;
      if (opt.correct) state.quizScore += 1;
      nextBtn.disabled = false;
      nextBtn.scrollIntoView({ block: "nearest" });
    });
  });
  nextBtn.addEventListener("click", () => {
    if (state.step !== 7) return;
    if (!last) { state.quizIndex += 1; renderQuizItem(host); return; }
    markTaskBannerDone("m2-s8-quiz");
    state.api.eventLog?.record?.("step8_quiz_completed", { score: state.quizScore });
    completeStep(7, 500);
  });
}

// --- Step 9 -----------------------------------------------------------------

function stepTakeaway(body) {
  const pct = quizPct();
  body.innerHTML = `
    <p style="font-size:14px;">
      You answered <strong>${state.quizScore} of ${state.quizItems.length}</strong> questions correctly (${pct}%).
      M.G. has pinned a short note in Slack, and the module ends when you schedule the refresher under it.
    </p>
  `;
  if (!isOpen("slack")) state.api.os.openApp("slack");
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 8) return;
    feed.querySelector("[data-m2-quiz-thread]")?.remove();
    feed.querySelector("[data-m2-s7-done]")?.closest(".mx-bar")?.remove();
    mountTaskBanner(appBody("slack"), { id: "m2-s9-takeaway", label: "Read M.G.'s note, then schedule the refresher to finish the module.", state: "active" });
    if (feed.querySelector("[data-m2-pinned]")) return;
    const pinned = document.createElement("div");
    pinned.className = "mx-pinned";
    pinned.setAttribute("data-m2-pinned", "");
    pinned.innerHTML = `
      <div class="mx-pinned__k">📌 M.G., a rep in the Manchester pod, pinned this note</div>
      <p class="mx-pinned__quote">"Before you argue with an objection, repeat it with at least two of the
        buyer's words. Then wait for the answer and ask one open question."</p>
      <div class="mx-pinned__foot">
        <span>📅 In seven days you'll get three short questions about handling objections.</span>
        <button type="button" class="mx-btn" data-m2-s9-finish>Schedule refresher &rarr;</button>
      </div>
    `;
    feed.appendChild(pinned);
    pinned.scrollIntoView({ block: "nearest" });
    pinned.querySelector("[data-m2-s9-finish]").addEventListener("click", () => {
      markTaskBannerDone("m2-s9-takeaway");
      state.stepTs[8] = state.stepTs[8] ?? timestamp();
      state.api.eventLog?.record?.("step9_retrieval_drop_set");
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
  const passed = pct >= PASS_PCT;
  const doneCount = Object.keys(state.stepTs).length;
  const card = document.createElement("div");
  card.className = "summary-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "summary-title");
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check${passed ? "" : " is-retry"}" aria-hidden="true">${passed ? "✓" : "↻"}</div>
      <h2 class="summary-card__title" id="summary-title">Acknowledging objections, ${passed ? "passed" : "not passed yet"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Quiz</span>
          <span class="summary-card__stat-v">${state.quizScore} / ${state.quizItems.length}</span>
          <span class="summary-card__stat-sub">${pct}%, ${passed ? `above the ${PASS_PCT}% pass mark` : `below the ${PASS_PCT}% pass mark`}</span>
        </div>
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Time</span>
          <span class="summary-card__stat-v">${timestamp()}</span>
          <span class="summary-card__stat-sub">the module is planned for ten minutes</span>
        </div>
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Tasks done</span>
          <span class="summary-card__stat-v">${doneCount} / ${STEPS.length}</span>
          <span class="summary-card__stat-sub">${doneCount === STEPS.length ? "you did every step in the apps" : "you skipped the other steps"}</span>
        </div>
      </div>
      <details class="summary-card__recap">
        <summary>What you did in each step</summary>
        <ol class="summary-card__list">
          ${STEPS.map((s, i) => `
            <li><span class="summary-card__list-n">${i + 1}</span>
                <span class="summary-card__list-label">${s.title}</span>
                <span class="summary-card__list-ts">${state.stepTs[i] ?? "skipped"}</span></li>
          `).join("")}
        </ol>
      </details>
      <div class="summary-card__actions">
        <a class="summary-card__btn summary-card__btn--ghost" href="../">&larr; Back to engagement</a>
        <button type="button" class="summary-card__btn summary-card__btn--primary" data-action="restart">Restart module</button>
      </div>
    </div>
  `;
  document.body.appendChild(card);
  card.querySelector("[data-action='restart']")?.addEventListener("click", () => location.reload());
}

function timestamp() {
  const ms = Date.now() - state.startedAt;
  return `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")}`;
}

function renderFatal(msg) {
  const body = document.getElementById("narrative-body");
  if (body) body.innerHTML = `<p style="color:var(--coral-700);">Could not load module data: ${escapeHtml(msg)}</p>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}

