/**
 * Module 1 · M1 Diagnostic Opener · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * bootModule + task-banner + welcome/summary cards + 9 steps. The keystone
 * move: one specific question built on a LinkedIn / Companies House signal,
 * then five seconds of silence.
 *
 * Buyers and recorded calls come from the shell's shared data
 * (scorm-shell/data/sample-profiles.json, sample-gong-transcripts.json).
 * The silence is timed by the phone dialler (`phone:silence`), and J.T.'s
 * feedback in step 7 is built from what the learner actually did.
 */

import { bootModule, eventBus } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";
import { loadProfiles, loadCalls, findProfile, pickCalls } from "../scorm-shell/js/apps/profiles.js";
import { EVENT } from "../scorm-shell/js/event-log.js";
import { resolveDates, fill } from "../scorm-shell/js/dates.js";
/** "a", "a and b", "a, b and c" */
const listJoin = arr => arr.length < 3 ? arr.join(" and ") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`;


const SILENCE_MS = 5000;
const DIAL_LOCK = "Calls start in step 6, from the buyer's profile.";

const state = {
  api: null, step: 0, startedAt: 0, finished: false,
  profiles: [], calls: [], quizItems: [], quizIndex: 0, quizScore: 0,
  stepTs: {},
  workedDone: false,
  signal: { tries: 0, ok: false },
  tom: { tries: 0, ok: false },
  diag: null,          // { text, checks, score }
  call: { connected: false, silence: null, awaiting: false, reply: false },
};

const maria = () => findProfile(state.profiles, "L-001");
const tom   = () => findProfile(state.profiles, "L-002");
const emma  = () => findProfile(state.profiles, "L-003");

// --- Data + boot ---------------------------------------------------------------

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return resolveDates(await res.json());
}

async function start() {
  try {
    const [profiles, calls, quiz] = await Promise.all([loadProfiles(), loadCalls(), loadJson("./data/quiz.json")]);
    state.profiles = profiles;
    state.calls = pickCalls(calls, ["GC-01", "GC-19"]);
    state.quizItems = normalizeQuiz(quiz);
    if (!emma() || !maria() || !tom()) throw new Error("buyer profiles missing");
  } catch (err) {
    console.error("[M1] Failed to load module data", err);
    renderFatal(err.message);
    return;
  }
  bootModule({
    moduleId: "M1",
    title: "Module 1: Diagnostic opener",
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
  { title: "How P.B. lost Maria's call in eight seconds",              handler: stepGainAttention },
  { title: "What you will practise in this module",                     handler: stepStateOutcome },
  { title: "The three moves of a call",                                 handler: stepRecallPrior },
  { title: "M.G.'s opening question to Maria",                          handler: stepWorkedExample },
  { title: "Choosing the opening question for Tom",                     handler: stepCompletionProblem },
  { title: "Your own call to Emma",                                     handler: stepSoloProblem },
  { title: "J.T.'s review of your call",                                handler: stepFeedback },
  { title: "Three questions from J.T.",                                 handler: stepQuiz },
  { title: "M.G.'s note and a reminder in seven days",                  handler: stepTakeaway },
];

function runStep(i) {
  state.step = i;
  // Each step mounts its own action bar and highlight; drop the previous step's ones.
  document.querySelectorAll(".mx-bar").forEach(el => el.remove());
  document.querySelectorAll(".is-warm-highlight").forEach(el => el.classList.remove("is-warm-highlight"));
  // Leftovers from a skipped step must not dim or block the next one.
  document.querySelectorAll(".app--outreach .lead-row[data-task-target]").forEach(r => delete r.dataset.taskTarget);
  document.getElementById("gagne-step").textContent      = `Step ${i + 1} of ${STEPS.length}`;
  document.getElementById("narrative-title").textContent = STEPS[i].title;
  updateProgressBar(i + 1);
  const body = document.getElementById("narrative-body");
  body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  next.disabled = false;
  next.setAttribute("aria-disabled", "false");
  STEPS[i].handler(body);
}

/** Record when step `from` was completed in the app, then move on if still there. */
function completeStep(from, delay = 450) {
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
      <h2 class="welcome-card__title" id="welcome-title">Diagnostic opener</h2>
      <p class="welcome-card__lede">
        Over the next ten minutes you will learn to open a cold call with one
        specific question about the buyer's LinkedIn or Companies House profile.
        After the question you stay quiet for five seconds and let the buyer tell
        you what hurts. All nine steps happen in the apps on this desktop.
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
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
  document.getElementById("narrative-back").addEventListener("click", () => {
    if (state.step > 0) runStep(state.step - 1);
  });
  document.getElementById("narrative-redo")?.addEventListener("click", () => runStep(state.step));
  document.getElementById("narrative-skip")?.addEventListener("click", () => {
    if (state.step >= STEPS.length - 1) return finishModule();
    runStep(state.step + 1);
  });
}

function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => {
    const highlight = state.step === 2 ? "pre-training" : "M1";
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
function openOutreach() {
  state.api.os.openApp("outreach", { dialLocked: DIAL_LOCK });
  return appBody("outreach");
}
/** Poll until fn() returns something truthy (apps render asynchronously). */
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

// --- Step 1 -----------------------------------------------------------------

function stepGainAttention(body) {
  body.innerHTML = `
    <blockquote class="peer-quote">
      Whenever P.B. starts pitching in the first few seconds, the buyer hangs up
      before he has asked a single question.
      <cite>J.T., pod lead, after reading P.B.'s call log</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      On Gong call GC-19 P.B. asked Maria whether she had a moment to talk about
      corporate spending, and she hung up eight seconds in. M.G. opened the same buyer
      with a question about her new store and booked a demo.
    </p>
  `;
  const nextBtn = document.getElementById("narrative-next");
  nextBtn.disabled = true;
  nextBtn.setAttribute("aria-disabled", "true");
  nextBtn.textContent = "🔒 Click Maria in Outreach";
  const ob = openOutreach();
  if (!ob) return;
  mountTaskBanner(ob, { id: "m1-s1-pick", label: "Click Maria's row in Outreach.", state: "active" });
  waitFor(() => leadRow(ob, "Maria"), row => {
    if (state.step !== 0) return;
    const rows = [...ob.querySelectorAll(".lead-row")];
    rows.forEach(r => { r.dataset.taskTarget = r === row ? "active" : "inactive"; });
    row.classList.add("is-warm-highlight");
    if (row.dataset.m1Bound) return;
    row.dataset.m1Bound = "true";
    row.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]') || state.step !== 0) return;
      state.api.eventLog?.record?.("step1_picked_warm_lead");
      markTaskBannerDone("m1-s1-pick");
      nextBtn.disabled = false;
      nextBtn.setAttribute("aria-disabled", "false");
      nextBtn.textContent = "Continue";
      rows.forEach(r => { delete r.dataset.taskTarget; });
      completeStep(0);
    });
  });
}

// --- Step 2 · find the signal ---------------------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      In this module you will practise asking one specific question about the
      buyer's LinkedIn or Companies House profile in the first minute of a call.
      After the question you stay silent for five seconds and let the buyer fill the pause.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Start with Maria's profile in the LinkedIn and Companies House window, and find
      the fact you would build that question on.
    </p>
  `;
  state.api.os.openApp("linkedin-ch", { lookupId: "L-001" });
  waitFor(() => appBody("linkedin-ch")?.querySelector(".lch-panel.ch .signal"), () => {
    if (state.step !== 1) return;
    const lch = appBody("linkedin-ch");
    mountTaskBanner(lch, {
      id: "m1-s2-signal",
      label: "Click the line in Maria's profile that you would build your question on.",
      state: "active",
    });
    let fb = lch.querySelector("[data-m1-s2-fb]");
    if (!fb) {
      fb = document.createElement("p");
      fb.className = "mx-fb mx-fb--float"; fb.setAttribute("data-m1-s2-fb", ""); fb.setAttribute("role", "status"); fb.hidden = true;
      lch.appendChild(fb);
    }
    lch.querySelectorAll(".signal").forEach(sig => {
      sig.classList.add("is-pickable");
      sig.setAttribute("role", "button");
      sig.tabIndex = 0;
      if (sig.dataset.m1Bound) return;
      sig.dataset.m1Bound = "true";
      const pick = () => {
        if (state.step !== 1 || state.signal.ok) return;
        state.signal.tries += 1;
        lch.querySelectorAll(".signal").forEach(s => s.classList.remove("is-picked", "is-wrong"));
        const type = sig.dataset.signalType;
        fb.hidden = false;
        if (type === "new_location") {
          state.signal.ok = true;
          sig.classList.add("is-picked");
          fb.dataset.tone = "ok";
          fb.textContent = fill("A second store opened in {{month:maria_store}}, and card spend now runs across two sites. That gives you a dated fact to mention and a question about who approves spending in both stores.");
          markTaskBannerDone("m1-s2-signal");
          state.api.eventLog?.record?.("step2_signal_read", { tries: state.signal.tries });
          completeStep(1, 1600);
        } else {
          sig.classList.add("is-wrong");
          fb.dataset.tone = "warn";
          fb.textContent = type === "hiring"
            ? "The bookkeeper job hints at the pain, but you'd be guessing at the reason. The Companies House filing gives you a dated fact instead."
            : "The shopfront photo tells you something about Maria but gives you no reason to call. Look for the filing that changed how her spending works.";
        }
      };
      sig.addEventListener("click", pick);
      sig.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
  });
}

// --- Step 3 -----------------------------------------------------------------

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Every call in this course follows three moves, and this module covers the first of them.</p>
    <ol style="font-size:13.5px; margin:6px 0 8px 18px;">
      <li><strong>M1, the diagnostic:</strong> you ask one specific question based on the buyer's profile.</li>
      <li><strong>M2, the acknowledgement:</strong> you repeat the buyer's objection in their own words before you answer it.</li>
      <li><strong>M3, the close:</strong> you offer two times and send the invite while the buyer is still on the line.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Open the phone dialler now. You'll call Emma from it in step 6.
    </p>
  `;
  const done = () => {
    if (state.step !== 2) return;
    markTaskBannerDone("m1-s3-open-phone");
    state.api.eventLog?.record?.("step3_phone_opened");
    completeStep(2, 500);
  };
  if (!isOpen("linkedin-ch")) state.api.os.openApp("linkedin-ch", { lookupId: "L-001" });
  waitFor(() => appBody("linkedin-ch"), lch => {
    if (state.step !== 2) return;
    mountTaskBanner(lch, { id: "m1-s3-open-phone", label: "Open the phone dialler with the button below.", state: "active" });
    // Already open (for example from the taskbar): the task is done.
    if (isOpen("phone-dialler")) { done(); return; }
    bar(lch, "data-m1-s3-open-phone", "The dialler stays open until you call Emma in step 6.", "📞 Open Phone-dialler")
      .querySelector("button").addEventListener("click", () => {
        state.api.os.openApp("phone-dialler", { prospect: emma() });
        done();
      });
  });
}

// --- Step 4 -----------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      On Gong call GC-01 <strong>M.G.</strong> opens <strong>Maria</strong>'s call with
      a question about her Companies House filing. Then he waits five seconds for her answer.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      When you have read it, click the <strong>[M1]</strong> chip next to his question.
      GC-19, the call P.B. lost, is in the same list if you want to compare the two.
    </p>
  `;
  state.api.os.openApp("gong", { transcripts: state.calls, activeTranscriptId: "GC-01" });
  waitFor(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    if (state.step !== 3) return;
    const gong = appBody("gong");
    mountTaskBanner(gong, {
      id: "m1-s4-watch",
      label: "Click the [M1] chip next to M.G.'s question, or press Watched it.",
      state: "active",
    });
    const complete = () => {
      if (state.step !== 3) return;
      state.workedDone = true;
      markTaskBannerDone("m1-s4-watch");
      state.api.eventLog?.record?.(EVENT.WORKED_EXAMPLE_COMPLETED);
      completeStep(3);
    };
    bar(gong, "data-m1-s4-done", "M.G. asks a single question about the filing and stays silent for five seconds until Maria starts talking.", "✓ Watched it")
      .querySelector("button").addEventListener("click", complete);
    if (!gong.dataset.m1ChipBound) {
      gong.dataset.m1ChipBound = "true";
      gong.addEventListener("click", e => { if (e.target.closest?.('.m-chip[data-move="M1"]')) complete(); });
    }
  });
}

// --- Step 5 -----------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  const t = tom();
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>${t.name}</strong> founded a Series-B SaaS company with ${t.fte} people and
      is your next call. His LinkedIn says <em>"${escapeHtml(t.signals[0].content)} ${escapeHtml(t.signals[1].content)}"</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Choose the question you would open with in the panel under his row in Outreach.
    </p>
  `;
  const options = [
    { label: "A", result: "anti",
      text: `"Hi Tom — do you have a moment to talk about your corporate spending?"`,
      rationale: "P.B. used this opener on GC-19. It says nothing specific about Tom, and the call ends within seconds." },
    { label: "B", result: "partial",
      text: `"Congrats on the raise! How's it going?"`,
      rationale: "It mentions the funding round but asks nothing about how the company works. Tom says it's going well, and the call stalls." },
    { label: "C", result: "anti",
      text: `"FinTechCard helps fast-growing SaaS like yours control spend — interested?"`,
      rationale: "Tom hears a sales pitch before anyone has asked him anything, and he has no reason to keep talking." },
    { label: "D", result: "correct",
      text: `"Tom — saw your Series B close. Who's approving the new hires' card spend before they ramp?"`,
      rationale: "It names the Series B and then asks who approves the new hires' spending. M.G. used the same pattern with Maria." },
  ];
  openOutreach();
  waitFor(() => leadRow(appBody("outreach"), "Tom"), row => {
    if (state.step !== 4) return;
    mountTomDrawer(appBody("outreach"), row, options);
  });
}

function mountTomDrawer(ob, tomRow, options) {
  mountTaskBanner(ob, {
    id: "m1-s5-pick-diag",
    label: "Choose Tom's opening question in the panel under his row.",
    state: "active",
  });
  tomRow.classList.add("is-warm-highlight");
  ob.querySelector("[data-m1-s5-drawer]")?.remove();
  const t = tom();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m1-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Your cold call to Tom, before you have said anything</strong>
    </header>
    <p class="tom-drawer__stem">His LinkedIn says <em>"${escapeHtml(t.signals[0].content)} ${escapeHtml(t.signals[1].content)}"</em></p>
    <div class="tom-drawer__opts" role="radiogroup" aria-label="Pick the diagnostic">
      ${options.map((o, i) => `
        <button type="button" class="tom-drawer__opt" role="radio"
                aria-checked="false" data-result="${o.result}" data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${o.text}</span>
        </button>`).join("")}
    </div>
    <div class="tom-drawer__fb" id="m1-s5-fb" hidden></div>
  `;
  tomRow.insertAdjacentElement("afterend", drawer);
  drawer.scrollIntoView({ block: "nearest" });
  const fb = drawer.querySelector("#m1-s5-fb");
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.step !== 4 || state.tom.ok) return;
      const opt = options[Number(btn.dataset.idx)];
      state.tom.tries += 1;
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => {
        b.classList.remove("is-correct", "is-incorrect");
        b.setAttribute("aria-checked", "false");
      });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.result === "correct" ? "is-correct" : "is-incorrect");
      if (opt.result !== "correct") drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      fb.hidden = false;
      fb.textContent = opt.rationale;
      revealInWindow(fb);
      if (opt.result === "correct") {
        state.tom.ok = true;
        markTaskBannerDone("m1-s5-pick-diag");
        state.api.eventLog?.record?.(EVENT.COMPLETION_PROBLEM_COMPLETED, { tries: state.tom.tries });
        completeStep(4, 900);
      }
    });
  });
}

/** Scroll only the app window's own body so `el` is visible; the desktop never moves. */
function revealInWindow(el) {
  const sc = el.closest(".os-window-body");
  if (!sc) return;
  const d = el.getBoundingClientRect().bottom - sc.getBoundingClientRect().bottom;
  if (d > 0) sc.scrollTop += d + 12;
}

// --- Step 6 · solo: write the question, dial, hold the silence -------------------

/** Four checks on the learner's question. Signal words come from Emma's profile. */
function checkDiagnostic(text) {
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean);
  const checks = {
    signal:  /\b(18|22|headcount|turnover|accounts|filing|filed|hiring|hire|supervisor|procurement|sites?|shifts?|grown|growth|growing)\b/i.test(t),
    question: /\?\s*$/.test(t) && /\b(who|how|what|which|where|when)\b/i.test(t),
    short:   words.length > 0 && words.length <= 25,
    noPitch: !/\b(fintechcard|our (card|cards|platform|product|tool|solution)|we (help|offer|can|provide)|interested|demo|cheaper|save (you|money|time)|cut (your )?costs|do you want|would you like)\b/i.test(t),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { text: t, words: words.length, checks, score };
}
const CHECK_LABELS = {
  signal: "names her signal",
  question: "asks who / how / what",
  short: "25 words or fewer",
  noPitch: "no pitch",
};

function stepSoloProblem(body) {
  keepOnly(["outreach", "linkedin-ch", "phone-dialler"]);
  const e = emma();
  state.call = { connected: false, silence: null, awaiting: false, reply: false };
  body.innerHTML = `
    <p style="font-size:14px;">
      ${e.name} runs operations at ${escapeHtml(e.company)} and has never spoken to us.
      Read her profile, write one question based on it, then call her and stay quiet after you ask it.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      The dialler times the pause, and Emma only answers once you have been silent for five seconds.
    </p>
  `;
  state.api.os.openApp("linkedin-ch", { lookupId: "L-003" });
  waitFor(() => appBody("linkedin-ch")?.querySelector(".lch-panel .signal"), () => {
    if (state.step !== 5) return;
    mountSoloStage(appBody("linkedin-ch"), e);
  });
}

function mountSoloStage(lch, e) {
  lch.querySelectorAll(".signal").forEach(s => s.classList.remove("is-pickable", "is-picked", "is-wrong"));
  mountTaskBanner(lch, {
    id: "m1-s6-solo",
    label: `Write your question under ${e.name}'s profile, then press Dial.`,
    state: "active",
  });
  lch.querySelector("[data-m1-s6-stage]")?.remove();
  const stage = document.createElement("div");
  stage.className = "mx-stage";
  stage.setAttribute("data-m1-s6-stage", "");
  stage.innerHTML = `
    <p class="mx-signal">According to Companies House, ${escapeHtml(e.company.split(" ")[0])} ${escapeHtml(e.signals[0].content.charAt(0).toLowerCase() + e.signals[0].content.slice(1))}</p>
    <label for="m1-diag">Your opening question, in one sentence</label>
    <textarea id="m1-diag" data-m1-diag rows="2" placeholder="Who's approving … now that …?"></textarea>
    <ul class="mx-checks" data-m1-checks aria-live="polite">
      ${Object.entries(CHECK_LABELS).map(([k, l]) => `<li data-check="${k}" data-ok="false">${l}</li>`).join("")}
    </ul>
    <div class="mx-row">
      <button type="button" class="mx-btn" data-m1-dial disabled>📞 Dial ${escapeHtml(e.name)}</button>
      <span class="mx-status" data-m1-status>Dial turns on after 30 characters.</span>
    </div>
  `;
  lch.appendChild(stage);
  stage.scrollIntoView({ block: "nearest" });
  const ta = stage.querySelector("[data-m1-diag]");
  const dial = stage.querySelector("[data-m1-dial]");
  const status = stage.querySelector("[data-m1-status]");
  ta.addEventListener("input", () => {
    const d = checkDiagnostic(ta.value);
    stage.querySelectorAll("[data-check]").forEach(li => { li.dataset.ok = String(d.checks[li.dataset.check]); });
    const ok = d.text.length >= 30;
    dial.disabled = !ok;
    status.textContent = ok ? `Ready to dial. Your question meets ${d.score} of the 4 checks.` : `Dial turns on at 30 characters (you have ${d.text.length}).`;
  });
  dial.addEventListener("click", () => {
    if (dial.disabled || state.step !== 5) return;
    state.diag = checkDiagnostic(ta.value);
    state.call = { connected: false, silence: null, awaiting: false, reply: false };
    const prospect = { ...e };
    state.api.os.openApp("phone-dialler", { prospect });
    eventBus.dispatchEvent(new CustomEvent("phone:dial", { detail: { prospect } }));
    status.textContent = "The phone is ringing in the dialler window.";
    const phone = appBody("phone-dialler");
    if (phone) mountTaskBanner(phone, { id: "m1-s6-call", label: "Wait for Emma to pick up. Your question goes out when she answers.", state: "active" });
  });
}

/** Call events from the dialler, registered once and gated by step. */
function wireCallEvents() {
  eventBus.addEventListener("phone:connected", ev => {
    if (state.step !== 5 || ev.detail?.prospect?.lead_id !== "L-003" || !state.diag) return;
    state.call.connected = true;
    eventBus.dispatchEvent(new CustomEvent("phone:say", { detail: { who: "rep", speaker: "You", text: state.diag.text } }));
    eventBus.dispatchEvent(new CustomEvent("phone:move", { detail: { move: "M1" } }));
    eventBus.dispatchEvent(new CustomEvent("telemetry", { detail: { event_name: EVENT.DIAGNOSTIC_DELIVERED, specificity_score: state.diag.score } }));
    state.call.awaiting = true;
    eventBus.dispatchEvent(new CustomEvent("phone:silence", { detail: { start: true, thresholdMs: SILENCE_MS } }));
    mountSilenceBar();
  });
  eventBus.addEventListener("phone:silence-held", () => {
    if (state.step !== 5 || !state.call.awaiting) return;
    state.call.awaiting = false;
    state.call.reply = true;
    eventBus.dispatchEvent(new CustomEvent("phone:say", { detail: { who: "buyer", speaker: "Emma", text: "Honestly? Finance tags four hundred supplier transactions a month by hand. Xero can't read the job numbers." } }));
    eventBus.dispatchEvent(new CustomEvent("phone:silence", { detail: { start: false } }));
  });
  eventBus.addEventListener("phone:silence-ended", ev => {
    if (state.step !== 5 || !state.call.connected || state.call.silence) return;
    state.call.silence = { held: Boolean(ev.detail?.held), ms: ev.detail?.duration_ms ?? 0 };
    state.api.eventLog?.record?.("m1_silence", { held: state.call.silence.held, ms: state.call.silence.ms });
    const phone = appBody("phone-dialler");
    phone?.querySelector("[data-m1-silence-bar]")?.remove();
    if (!phone) return;
    if (state.call.silence.held) {
      mountTaskBanner(phone, { id: "m1-s6-hangup", label: "Emma told you the problem herself. Hang up when you're ready.", state: "active" });
    } else {
      mountTaskBanner(phone, { id: "m1-s6-hangup", label: "You spoke before Emma did. Hang up, then press ↻ to try again or Continue to move on.", state: "active" });
    }
  });
  eventBus.addEventListener("phone:ended", ev => {
    if (state.step !== 5 || ev.detail?.prospect?.lead_id !== "L-003") return;
    if (!state.call.connected) {
      const phone = appBody("phone-dialler");
      if (phone) mountTaskBanner(phone, { id: "m1-s6-call", label: "The call ended before Emma picked up. Dial her again from her profile.", state: "active" });
      return;
    }
    markTaskBannerDone("m1-s6-solo");
    state.api.eventLog?.record?.(EVENT.SOLO_PROBLEM_COMPLETED, { held: Boolean(state.call.silence?.held) });
    completeStep(5, 900);
  });
}

function mountSilenceBar() {
  const phone = appBody("phone-dialler");
  if (!phone) return;
  mountTaskBanner(phone, {
    id: "m1-s6-silence",
    label: "Say nothing until Emma answers. The timer under her name counts the pause.",
    state: "active",
  });
  phone.querySelector("[data-m1-silence-bar]")?.remove();
  const el = document.createElement("div");
  el.className = "mx-callbar";
  el.setAttribute("data-m1-silence-bar", "");
  el.innerHTML = `<span>If the pause feels long, that is normal on a first call.</span><button type="button" class="mx-btn mx-btn--small mx-btn--ghost">Say something</button>`;
  const dialler = phone.querySelector(".dialler");
  dialler?.insertBefore(el, dialler.querySelector(".dialler-controls"));
  if (dialler) dialler.scrollTop = dialler.scrollHeight;
  el.querySelector("button").addEventListener("click", () => {
    if (state.step !== 5 || !state.call.awaiting) return;
    state.call.awaiting = false;
    eventBus.dispatchEvent(new CustomEvent("phone:say", { detail: { who: "rep", speaker: "You", text: "…So, does that make sense?" } }));
    eventBus.dispatchEvent(new CustomEvent("phone:silence", { detail: { start: false } }));
    eventBus.dispatchEvent(new CustomEvent("phone:say", { detail: { who: "buyer", speaker: "Emma", text: "Sure. Look, I've got a meeting in five minutes." } }));
  });
}

// --- Step 7 · feedback built from the run ----------------------------------------

function feedbackMessages() {
  const jt = (body, ts = "12:49") => ({ author: "J.T. (pod lead)", initials: "JT", ts, body });
  const msgs = [jt("Here are my notes on your practice calls.", "12:48")];
  msgs.push(jt(state.workedDone
    ? "✅ You read M.G.'s opening on GC-01 and found the moment he asks his question."
    : "⚠️ You skipped M.G.'s call. GC-01 is worth two minutes before your next dial."));
  msgs.push(jt(state.signal.ok
    ? `✅ You picked the Companies House filing as Maria's signal${state.signal.tries === 1 ? " on the first try" : ` after ${state.signal.tries} tries`}.`
    : "⚠️ You didn't pick a signal for Maria. Next time look for the dated fact in her filing and build the question on it."));
  msgs.push(jt(state.tom.ok
    ? (state.tom.tries === 1 ? "✅ You chose the Series B question for Tom on the first try." : `⚠️ Tom took you ${state.tom.tries} tries. Name the signal first, then ask who controls the spending.`)
    : "⚠️ You didn't choose an opening question for Tom."));
  if (state.diag) {
    const NEEDS = { signal: "name her signal", question: "ask a who, how or what question", short: "stay under 25 words", noPitch: "leave the pitch out" };
    const misses = Object.entries(state.diag.checks).filter(([, ok]) => !ok).map(([k]) => NEEDS[k]);
    msgs.push(jt(`${misses.length ? "⚠️" : "✅"} Your question for Emma: "${state.diag.text}"`));
    msgs.push(jt(misses.length
      ? `It meets ${state.diag.score} of the four checks. Next time also ${listJoin(misses)}.`
      : "It names her signal and asks a who or how question in under 25 words, with no pitch in it."));
  } else {
    msgs.push(jt("⚠️ You didn't write a question for Emma yet."));
  }
  const s = state.call.silence;
  if (s?.held) msgs.push(jt(`✅ You stayed quiet for ${Math.round(s.ms / 1000)} seconds, and Emma told you herself that finance tags 400 transactions a month by hand.`));
  else if (s) msgs.push(jt(`⚠️ You spoke after ${Math.round(s.ms / 1000)} seconds, before Emma got to her problem. Next time let the timer run past five.`));
  else msgs.push(jt("⚠️ You didn't call Emma, so there was no silence for me to review."));
  msgs.push(jt(s?.held && state.diag?.score === 4
    ? "You held the silence. Keep doing that on your next calls."
    : "Redo step 6 when you have two minutes. Ask one question and let Emma fill the pause.", "12:52"));
  msgs.push({ author: "M.G. (peer)", initials: "MG", ts: "12:54",
    body: "Staying quiet on a first call is hard. I'd learn one opening question by heart and use it on your next ten cold calls before switching." });
  return msgs;
}

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `
    <p style="font-size:14px;"><strong>J.T.</strong>, your pod lead, has sent you a direct message in Slack about your calls. Read it, then click Mark thread read.</p>
  `;
  state.api.os.openApp("slack", {
    channel: {
      channel_id: "dm-jt-podlead",
      pinned_messages: [
        { title: "The three moves of a call", content_md: "Open with one question built on the buyer's profile. Repeat any objection in the buyer's words before you answer it, and send the invite before you hang up.", related_module: "M1" },
      ],
      messages: feedbackMessages(),
    },
  });
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 6) return;
    mountTaskBanner(appBody("slack"), { id: "m1-s7-read-dm", label: "Read J.T.'s message, then click Mark thread read.", state: "active" });
    bar(feed, "data-m1-s7-done", "J.T. will see that you have read his message.", "✓ Mark thread read")
      .querySelector("button").addEventListener("click", () => {
        if (state.step !== 6) return;
        markTaskBannerDone("m1-s7-read-dm");
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
    mountTaskBanner(appBody("slack"), { id: "m1-s8-quiz", label: "Answer J.T.'s three questions. A wrong answer shows you the right one and why.", state: "active" });
    feed.querySelector("[data-m1-s7-done]")?.closest(".mx-bar")?.remove();
    feed.querySelector("[data-m1-quiz-thread]")?.remove();
    const thread = document.createElement("div");
    thread.className = "mx-thread";
    thread.setAttribute("data-m1-quiz-thread", "");
    thread.innerHTML = `<div class="mx-thread__k">J.T. posted these questions at 12:55</div><div data-quiz-host></div>`;
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
    <p style="font-size:14px; margin:0 0 10px; color:var(--ftc-ink);">${item.stem}</p>
    <div role="radiogroup" aria-label="Answer choices" style="display:grid; gap:6px;">
      ${item.options.map((o, i) => `
        <button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${o.text}</span>
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
    markTaskBannerDone("m1-s8-quiz");
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
    feed.querySelector("[data-m1-quiz-thread]")?.remove();
    feed.querySelector("[data-m1-s7-done]")?.closest(".mx-bar")?.remove();
    mountTaskBanner(appBody("slack"), { id: "m1-s9-takeaway", label: "Read M.G.'s note, then schedule the refresher to finish the module.", state: "active" });
    if (feed.querySelector("[data-m1-pinned]")) return;
    const pinned = document.createElement("div");
    pinned.className = "mx-pinned";
    pinned.setAttribute("data-m1-pinned", "");
    pinned.innerHTML = `
      <div class="mx-pinned__k">📌 M.G., a rep in the Manchester pod, pinned this note</div>
      <p class="mx-pinned__quote">"Open with one specific question about the buyer's LinkedIn or
        Companies House profile, then stay quiet for five seconds and wait for the answer."</p>
      <div class="mx-pinned__foot">
        <span>📅 In seven days you'll get three short questions about this opening.</span>
        <button type="button" class="mx-btn" data-m1-s9-finish>Schedule refresher &rarr;</button>
      </div>
    `;
    feed.appendChild(pinned);
    pinned.scrollIntoView({ block: "nearest" });
    pinned.querySelector("[data-m1-s9-finish]").addEventListener("click", () => {
      markTaskBannerDone("m1-s9-takeaway");
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
  const passed = pct >= 67;
  const doneCount = Object.keys(state.stepTs).length;
  const card = document.createElement("div");
  card.className = "summary-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "summary-title");
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check${passed ? "" : " is-retry"}" aria-hidden="true">${passed ? "✓" : "↻"}</div>
      <h2 class="summary-card__title" id="summary-title">Diagnostic opener, ${passed ? "passed" : "not passed yet"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Quiz</span>
          <span class="summary-card__stat-v">${state.quizScore} / ${state.quizItems.length}</span>
          <span class="summary-card__stat-sub">${pct}%, ${passed ? "above the 67% pass mark" : "below the 67% pass mark"}</span>
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
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderFatal(msg) {
  const body = document.getElementById("narrative-body");
  if (body) body.innerHTML = `<p style="color:var(--coral-700);">Could not load module data: ${escapeHtml(msg)}</p>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}
