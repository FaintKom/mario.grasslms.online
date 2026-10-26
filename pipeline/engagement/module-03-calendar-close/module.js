/**
 * Module 3 · M3 Calendar Close · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * bootModule + task-banner + welcome/summary cards + 9 steps. The keystone
 * move: Calendar open in a second window before every dial, two slots in one
 * sentence, the invite sent and the next step logged before you hang up.
 *
 * The solo call runs through the apps themselves:
 *   Outreach (Dial stays off until Calendar is open: `dialRequires`)
 *   → Phone (Emma picks up, live captions)
 *   → Calendar (pick two free slots, Send invite)
 *   → Salesforce (Next Step + Save flips Next_Step_Booked__c)
 *   → Phone (hang up).
 * The module listens to the apps' bus events and telemetry, and J.T.'s
 * feedback in step 7 is built from what actually happened, in what order.
 */

import { bootModule, eventBus } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";
import { loadProfiles, loadCalls, findProfile, pickCalls } from "../scorm-shell/js/apps/profiles.js";
import { EVENT } from "../scorm-shell/js/event-log.js";

const state = {
  api: null, step: 0, startedAt: 0, finished: false,
  profiles: [], calls: [], quizItems: [], quizIndex: 0, quizScore: 0,
  stepTs: {},
  workedDone: false,
  tom: { tries: 0, ok: false },
  blockedEarly: 0,       // Dial clicks with Calendar closed, steps 1-5
  solo: null,
  calTarget: null,       // options the "Open Calendar" button passes
};

const maria = () => findProfile(state.profiles, "L-001");
const tom   = () => findProfile(state.profiles, "L-002");
const emma  = () => findProfile(state.profiles, "L-003");

const MARIA_SLOTS = ["Tue 10:00", "Wed 10:30"];   // M.G.'s close on GC-01
const EMMA_SLOTS  = ["Tue 14:00", "Thu 11:30"];   // from Emma's profile

// --- Data + boot ---------------------------------------------------------------

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function start() {
  try {
    const [profiles, shared, local, quiz] = await Promise.all([
      loadProfiles(), loadCalls(), loadJson("./data/transcripts.json"), loadJson("./data/quiz.json"),
    ]);
    state.profiles = profiles;
    state.calls = [...pickCalls(shared, ["GC-01", "GC-06"]), ...local];
    state.quizItems = normalizeQuiz(quiz);
    if (!maria() || !tom() || !emma()) throw new Error("buyer profiles missing");
  } catch (err) {
    console.error("[M3] Failed to load module data", err);
    renderFatal(err.message);
    return;
  }
  bootModule({
    moduleId: "M3",
    title: "Module 3: Calendar close",
    appsToLaunch: [],
    onReady(api) {
      state.api = api;
      state.startedAt = Date.now();
      wireProgressTimer();
      wireHelpButton();
      wireNarrativeButtons();
      wireAppEvents();
      showWelcomeCard(() => runStep(0));
    },
  });
}
start();

const STEPS = [
  { title: "Maria has opened your email twice",                   handler: stepGainAttention },
  { title: "What you will practise in this module",               handler: stepStateOutcome },
  { title: "The three moves of a call",                           handler: stepRecallPrior },
  { title: "How M.G. booked Maria during the call",               handler: stepWorkedExample },
  { title: "Choosing the close for Tom",                          handler: stepCompletionProblem },
  { title: "Your own call to Emma",                               handler: stepSoloProblem },
  { title: "J.T.'s review of your call",                          handler: stepFeedback },
  { title: "Three questions from J.T.",                           handler: stepQuiz },
  { title: "M.G.'s note and a reminder in seven days",            handler: stepTakeaway },
];

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
  next.disabled = false;
  next.setAttribute("aria-disabled", "false");
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
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "welcome-title");
  card.innerHTML = `
    <div class="welcome-card__panel">
      <span class="welcome-card__logo" aria-hidden="true">FTC</span>
      <h2 class="welcome-card__title" id="welcome-title">Calendar close</h2>
      <p class="welcome-card__lede">
        Over the next ten minutes you will practise closing a call in the apps your
        team uses every day. You keep Calendar open in a second window before you dial,
        offer the buyer two times in one sentence and send the invite while they are
        still on the line.
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
    const highlight = state.step === 2 ? "pre-training" : "M3";
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
/** Outreach in this module: Dial is off until Calendar has an open window. */
function openOutreach() {
  state.api.os.openApp("outreach", { dialRequires: "calendar" });
  return appBody("outreach");
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

/** The single "Open Calendar" button in Outreach; it opens Calendar for whoever is the current target. */
function mountOpenCalendarBar(o) {
  const t = state.calTarget;
  const el = bar(o, "data-m3-open-cal", "Dial stays off until Calendar is open.", `📅 Open Calendar${t?.suggestFor ? ` for ${escapeHtml(t.suggestFor)}` : ""}`);
  el.querySelector("button").addEventListener("click", () => state.api.os.openApp("calendar", { ...state.calTarget }));
  return el;
}

// --- Step 1 ---------------------------------------------------------------------

function stepGainAttention(body) {
  body.innerHTML = `
    <blockquote class="peer-quote">
      I have lost too many deals to follow-up.
      <cite>M.G., a rep in the Manchester pod</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      Start in the Outreach window. One of your leads has opened your email twice in the
      last 15 minutes.
    </p>
  `;
  state.calTarget = { suggestFor: maria().name, suggestedSlots: MARIA_SLOTS, invitee_email: maria().email };
  const o = openOutreach();
  if (!o) return;
  mountTaskBanner(o, {
    id: "m3-s1-pick-warm",
    label: "Click Maria's row in Outreach.",
    state: "active",
  });
  waitFor(() => leadRow(appBody("outreach"), "Maria"), row => {
    if (state.step !== 0) return;
    row.classList.add("is-warm-highlight");
    if (!row.querySelector(".open-signal-chip")) {
      const chip = document.createElement("span");
      chip.className = "open-signal-chip";
      chip.setAttribute("role", "button");
      chip.tabIndex = 0;
      chip.setAttribute("aria-label", "Opened email twice in 15 minutes");
      chip.innerHTML = `📨 <strong>2 opens</strong> · 15 min`;
      (row.querySelector(".meta") ?? row.firstElementChild)?.appendChild(chip);
    }
    if (row.dataset.m3Bound) return;
    row.dataset.m3Bound = "true";
    row.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]') || state.step !== 0) return;
      markTaskBannerDone("m3-s1-pick-warm");
      state.api.eventLog?.record?.("step1_picked_warm_lead");
      completeStep(0);
    });
  });
}

// --- Step 2 ---------------------------------------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      In this module you will practise opening Calendar in a second window before every
      dial, until you do it without thinking. You will also send the invite while the buyer
      is still on the call.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Before that, click the green chip on Maria's row to confirm that she opened your email.
    </p>
  `;
  openOutreach();
  waitFor(() => appBody("outreach")?.querySelector(".open-signal-chip"), chip => {
    if (state.step !== 1) return;
    mountTaskBanner(appBody("outreach"), {
      id: "m3-s2-read-signal",
      label: "Click the green chip on Maria's row.",
      state: "active",
    });
    chip.classList.add("is-pulsing");
    const confirm = e => {
      e.stopPropagation();
      if (state.step !== 1) return;
      chip.classList.remove("is-pulsing");
      markTaskBannerDone("m3-s2-read-signal");
      state.api.eventLog?.record?.("step2_read_signal");
      completeStep(1);
    };
    chip.onclick = confirm;
    chip.onkeydown = e => { if (e.key === "Enter" || e.key === " ") confirm(e); };
  });
}

// --- Step 3 ---------------------------------------------------------------------

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Every call in this course follows three moves, and this module covers the third.</p>
    <ol style="font-size:13.5px; margin:6px 0 8px 18px;">
      <li><strong>M1, the diagnostic:</strong> you ask one specific question based on the buyer's profile and then stay quiet.</li>
      <li><strong>M2, the acknowledgement:</strong> you repeat the buyer's objection in their own words before you answer it.</li>
      <li><strong>M3, the close:</strong> you offer two times and send the invite while the buyer is still on the line.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Now open Calendar. The Dial buttons in Outreach stay off until it is open in a second
      window, and you can try one first to see.
    </p>
  `;
  const done = () => {
    if (state.step !== 2) return;
    markTaskBannerDone("m3-s3-open-calendar");
    state.api.eventLog?.record?.("step3_calendar_opened");
    completeStep(2, 500);
  };
  openOutreach();
  waitFor(() => appBody("outreach"), o => {
    if (state.step !== 2) return;
    mountTaskBanner(o, { id: "m3-s3-open-calendar", label: "Open Calendar with the button below before you dial anyone.", state: "active" });
    if (isOpen("calendar")) { done(); return; }
    mountOpenCalendarBar(o);
  });
}

// --- Step 4 ---------------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      On GC-01 <strong>M.G.</strong> has Calendar open in a second window from the start of
      his call with <strong>Maria</strong>. When she agrees to a demo, he offers two times and
      sends the invite before either of them hangs up.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Click the <strong>[M3]</strong> chip on the line where he offers the times. GC-10 and
      GC-11 in the same list are the calls that ended with "I'll follow up" and were lost.
    </p>
  `;
  state.api.os.openApp("gong", { transcripts: state.calls, activeTranscriptId: "GC-01" });
  waitFor(() => appBody("gong")?.querySelector(".transcript .turn"), () => {
    if (state.step !== 3) return;
    const gong = appBody("gong");
    mountTaskBanner(gong, { id: "m3-s4-watch", label: "Click the [M3] chip on M.G.'s close, or press Watched it.", state: "active" });
    const complete = () => {
      if (state.step !== 3) return;
      state.workedDone = true;
      markTaskBannerDone("m3-s4-watch");
      state.api.eventLog?.record?.(EVENT.WORKED_EXAMPLE_COMPLETED);
      completeStep(3);
    };
    bar(gong, "data-m3-s4-done", `M.G. offers "Tuesday 10:00 or Wednesday 10:30", and the invite goes out on the next line while Maria is still on the call.`, "✓ Watched it")
      .querySelector("button").addEventListener("click", complete);
    if (!gong.dataset.m3ChipBound) {
      gong.dataset.m3ChipBound = "true";
      gong.addEventListener("click", e => { if (e.target.closest?.('.m-chip[data-move="M3"]')) complete(); });
    }
  });
}

// --- Step 5 ---------------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Tom</strong>, the Series-B founder who is comparing you with Brex, is on the line.
      He says <em>"Yeah, FX is a real headache. What would a demo even look like?"</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Choose how you would close in the panel under his row in Outreach.
    </p>
  `;
  const options = [
    { label: "A", result: "correct",
      text: `"Can I show you the FX cost against Brex on last month's spend, 20 minutes on Tuesday at 11:00 or Thursday at 14:00?"`,
      rationale: "Two specific times, and the demo is framed around Tom's own problem. L.D. closed him the same way on GC-06." },
    { label: "B", result: "partial",
      text: `"I'll send a calendar invite with some times by email."`,
      rationale: "The invite would go out after the call has ended." },
    { label: "C", result: "anti",
      text: `"I'll follow up by email next week."`,
      rationale: "This is the line that lost GC-10 and GC-11, where the buyers never replied again." },
    { label: "D", result: "anti",
      text: `"Let me check my calendar and get back to you."`,
      rationale: "Your calendar should already be open when you dial." },
  ];
  openOutreach();
  waitFor(() => leadRow(appBody("outreach"), "Tom"), row => {
    if (state.step !== 4) return;
    mountTomDrawer(appBody("outreach"), row, options);
  });
}

function mountTomDrawer(o, row, options) {
  mountTaskBanner(o, { id: "m3-s5-pick-close", label: "Choose your close for Tom in the panel under his row.", state: "active" });
  row.classList.add("is-warm-highlight");
  o.querySelector("[data-m3-s5-drawer]")?.remove();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m3-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Your call with Tom, 38 seconds in</strong>
    </header>
    <p class="tom-drawer__stem">Tom says <em>"Yeah, FX is a real headache. What would a demo even look like?"</em></p>
    <div class="tom-drawer__opts" role="radiogroup" aria-label="Pick the close">
      ${options.map((op, i) => `
        <button type="button" class="tom-drawer__opt" role="radio" aria-checked="false" data-result="${op.result}" data-idx="${i}">
          <span class="tom-drawer__label">${op.label}</span>
          <span class="tom-drawer__text">${op.text}</span>
        </button>`).join("")}
    </div>
    <div class="tom-drawer__fb" hidden></div>
  `;
  row.insertAdjacentElement("afterend", drawer);
  drawer.scrollIntoView({ block: "nearest" });
  const fb = drawer.querySelector(".tom-drawer__fb");
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.step !== 4 || state.tom.ok) return;
      const opt = options[Number(btn.dataset.idx)];
      state.tom.tries += 1;
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => { b.classList.remove("is-correct", "is-incorrect"); b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.result === "correct" ? "is-correct" : "is-incorrect");
      if (opt.result !== "correct") drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      fb.hidden = false;
      fb.textContent = opt.rationale;
      fb.scrollIntoView({ block: "nearest" });
      if (opt.result === "correct") {
        state.tom.ok = true;
        markTaskBannerDone("m3-s5-pick-close");
        state.api.eventLog?.record?.(EVENT.COMPLETION_PROBLEM_COMPLETED, { tries: state.tom.tries });
        completeStep(4, 900);
      }
    });
  });
}

// --- Step 6 · solo: the whole close in the apps -------------------------------------

function stepSoloProblem(body) {
  const e = emma();
  keepOnly(["outreach", "salesforce"]);   // Calendar closed: the gate starts locked
  state.calTarget = { suggestFor: e.name, suggestedSlots: EMMA_SLOTS, invitee_email: e.email };
  state.solo = {
    blocked: 0, calendarBeforeDial: null, dialled: false, connected: false, live: false,
    invite: null, sf: null, calls: 0,
  };
  body.innerHTML = `
    <p style="font-size:14px;">
      ${e.name} runs operations at ${escapeHtml(e.company)} and replied to your sequence with
      <em>"interesting, talk Friday?"</em> This time you make the call and book the meeting yourself.
    </p>
    <ol style="font-size:13px;margin:6px 0 8px 18px;color:var(--ftc-ink-2)">
      <li>Open Calendar first, and then dial Emma from her row in Outreach.</li>
      <li>While she is on the line, pick two free times in Calendar and click Send invite.</li>
      <li>Check the Next Step field in Salesforce and click Save, still during the call.</li>
      <li>Hang up in the phone dialler once everything is booked.</li>
    </ol>
    <p id="solo-status" class="retention-note" aria-live="polite">Calendar is closed. Dial is off.</p>
  `;
  state.api.os.openApp("salesforce", { accountId: e.lead_id });
  const o = openOutreach();
  if (!o) return;
  o.querySelector("[data-m3-s5-drawer]")?.remove();
  o.querySelectorAll(".is-warm-highlight").forEach(n => n.classList.remove("is-warm-highlight"));
  waitFor(() => leadRow(appBody("outreach"), "Emma"), row => {
    if (state.step !== 5) return;
    row.classList.add("is-warm-highlight");
    const out = appBody("outreach");
    mountOpenCalendarBar(out);
    soloBanner();
  });
}

function setSoloStatus(text) {
  const el = document.getElementById("solo-status");
  if (el) el.textContent = text;
}

/** One banner, in the app where the next action is. */
function soloBanner() {
  const s = state.solo;
  if (!s || state.step !== 5) return;
  const e = emma();
  if (!isOpen("calendar") && !s.connected) {
    const o = appBody("outreach");
    if (o) mountTaskBanner(o, { id: "m3-s6", label: `Open Calendar with the button below before you call ${e.name}.`, state: "active" });
    setSoloStatus("Calendar is closed. Dial is off.");
    return;
  }
  if (!s.connected) {
    const o = appBody("outreach");
    if (o) mountTaskBanner(o, { id: "m3-s6", label: `Dial ${e.name} from her highlighted row.`, state: "active" });
    setSoloStatus("Dial is on.");
    return;
  }
  if (s.live && !s.invite?.during) {
    if (!isOpen("calendar")) state.api.os.openApp("calendar", { ...state.calTarget });
    const c = appBody("calendar");
    if (c) mountTaskBanner(c, { id: "m3-s6", label: `Pick two free times and click Send invite. ${e.name}'s email is already filled in.`, state: "active" });
    setSoloStatus("On the call: offer two times.");
    return;
  }
  if (s.live && !s.sf?.during) {
    if (!isOpen("salesforce")) state.api.os.openApp("salesforce", { accountId: e.lead_id });
    const sf = appBody("salesforce");
    if (sf) mountTaskBanner(sf, { id: "m3-s6", label: "Check Next Step and click Save while she's still on the line.", state: "active" });
    setSoloStatus("Invite sent. Log the next step in Salesforce.");
    return;
  }
  if (s.live) {
    const p = appBody("phone-dialler");
    if (p) mountTaskBanner(p, { id: "m3-s6", label: "Invite sent and next step saved. Check it reached her, then hang up.", state: "active" });
    setSoloStatus("Meeting booked. You can hang up.");
  }
}

/** Bus events and telemetry from the apps, registered once and gated by step. */
function wireAppEvents() {
  eventBus.addEventListener("outreach:dial-blocked", () => {
    if (state.step === 5 && state.solo) state.solo.blocked += 1;
    else state.blockedEarly += 1;
  });
  eventBus.addEventListener("app:opened", ev => {
    if (ev.detail?.appId !== "calendar") return;
    if (state.step === 2) {
      markTaskBannerDone("m3-s3-open-calendar");
      state.api.eventLog?.record?.("step3_calendar_opened");
      completeStep(2, 500);
    }
    if (state.step === 5) soloBanner();
  });
  eventBus.addEventListener("app:closed", ev => {
    if (state.step === 5 && ev.detail?.appId === "calendar") soloBanner();
  });
  eventBus.addEventListener("telemetry", ev => {
    const d = ev.detail ?? {};
    const s = state.solo;
    if (state.step !== 5 || !s) return;
    if (d.event_name === EVENT.PHONE_DIAL_ATTEMPT && d.lead_id === "L-003") {
      s.dialled = true;
      if (s.calendarBeforeDial === null) s.calendarBeforeDial = Boolean(d.calendar_open_before_dial);
    }
    if (d.event_name === EVENT.INVITE_SENT) {
      const slots = (d.slot_ids ?? []).map(id => String(id).replace("-", " "));
      if (!s.invite?.during) s.invite = { slots, during: s.live, before: !s.connected };
      if (s.live) {
        eventBus.dispatchEvent(new CustomEvent("phone:move", { detail: { move: "M3" } }));
        say("rep", "You", `I can do ${slots.map(spokenSlot).join(" or ")} for 20 minutes. Which works with your Xero admin? The invite is on its way.`);
        say("buyer", "Emma", `${spokenSlot(slots[0])} works. I'll bring our Xero admin.`);
        // Pre-fill Next Step with the booked slot. An open record only takes
        // `record` (re-sending accountId would reload the profile over it).
        const record = { NextStep: `Demo · ${slots[0] ?? ""} · receipt capture + Xero sync` };
        state.api.os.openApp("salesforce", isOpen("salesforce") ? { record } : { accountId: "L-003", record });
      }
      soloBanner();
    }
    if (d.event_name === EVENT.NEXT_STEP_BOOKED_SET) {
      if (!s.sf?.during) s.sf = { during: s.live };
      soloBanner();
    }
  });
  eventBus.addEventListener("phone:connected", ev => {
    const s = state.solo;
    if (state.step !== 5 || !s || ev.detail?.prospect?.lead_id !== "L-003") return;
    s.connected = true;
    s.live = true;
    s.calls += 1;
    say("buyer", "Emma", "Honestly… if your tool pulls supplier receipts into Xero with the job numbers on them, that would save my finance team days every month.");
    soloBanner();
  });
  eventBus.addEventListener("phone:ended", ev => {
    const s = state.solo;
    if (state.step !== 5 || !s || ev.detail?.prospect?.lead_id !== "L-003" || !s.live) return;
    s.live = false;
    if (s.invite?.during && s.sf?.during) {
      markTaskBannerDone("m3-s6");
      setSoloStatus("You booked the meeting during the call.");
      state.api.eventLog?.record?.(EVENT.SOLO_PROBLEM_COMPLETED, { calls: s.calls });
      completeStep(5, 900);
      return;
    }
    const missing = [!s.invite?.during && "send the invite", !s.sf?.during && "save the next step"].filter(Boolean).join(" and ");
    s.connected = false;
    const o = appBody("outreach");
    if (o) mountTaskBanner(o, { id: "m3-s6", label: `The call ended before you could ${missing}. Dial Emma again, or press Continue to move on.`, state: "active" });
    setSoloStatus(`Call ended. Still to do on a call: ${missing}.`);
  });
}

// --- Step 7 · feedback built from the run ----------------------------------------

function feedbackMessages() {
  const jt = (body, ts = "12:49") => ({ author: "J.T. (pod lead)", initials: "JT", ts, body });
  const s = state.solo;
  const msgs = [jt(`Here are my notes on your call with ${emma().name}.`, "12:48")];
  msgs.push(jt(state.workedDone ? "✅ You found the line on GC-01 where M.G. closes Maria." : "⚠️ You skipped M.G.'s call. GC-01 shows the invite going out in the middle of the call."));
  msgs.push(jt(state.tom.ok
    ? (state.tom.tries === 1 ? "✅ You chose L.D.'s close for Tom on the first try." : `⚠️ Tom took you ${state.tom.tries} tries. A good close offers two times in one sentence and frames the meeting around his problem.`)
    : "⚠️ You didn't choose a close for Tom."));
  if (!s?.dialled) {
    msgs.push(jt("⚠️ You didn't call Emma. Redo step 6 when you have three minutes."));
  } else {
    const blocked = s.blocked + state.blockedEarly;
    msgs.push(jt(s.calendarBeforeDial
      ? `✅ Calendar was open before you dialled Emma.${blocked ? ` You pressed the locked Dial ${blocked} time${blocked > 1 ? "s" : ""} first, so the habit isn't automatic yet.` : ""}`
      : "⚠️ Calendar wasn't open when you dialled."));
    if (s.invite?.during) msgs.push(jt(`✅ You sent the invite while Emma was on the line, for ${s.invite.slots.join(" or ")}.`));
    else if (s.invite?.before) msgs.push(jt("⚠️ You sent the invite before Emma picked up. Offer the times on the call first, then send it."));
    else if (s.invite) msgs.push(jt("⚠️ The invite went out after the call had ended. That is how GC-11 was lost."));
    else msgs.push(jt("⚠️ You didn't send an invite."));
    msgs.push(jt(s.sf?.during
      ? "✅ Next_Step_Booked__c turned TRUE while Emma was still on the line."
      : s.sf ? "⚠️ You saved the next step after hanging up. The record shows a follow-up rather than a booking."
      : "⚠️ The next step wasn't logged in Salesforce."));
    if (s.calls > 1) msgs.push(jt(`It took you ${s.calls} calls to book the meeting. Next time have Calendar and Salesforce in view before you dial.`));
  }
  const clean = s?.calendarBeforeDial && s?.invite?.during && s?.sf?.during;
  msgs.push(jt(clean
    ? "Calendar was open before you dialled, and the invite went out during the call. Keep that habit."
    : "Keep the same order every time: Calendar open before you dial, and the invite and the Salesforce entry done before you hang up.", "12:52"));
  msgs.push({ author: "M.G. (peer)", initials: "MG", ts: "12:54",
    body: "I keep my calendar open in a second tab all day. Do it on cold calls too and the habit carries over to the warm ones." });
  return msgs;
}

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `
    <p style="font-size:14px;"><strong>J.T.</strong>, your pod lead, has sent you a direct message in Slack about your call with Emma. Read it, then click Mark thread read.</p>
  `;
  state.api.os.openApp("slack", {
    channel: {
      channel_id: "dm-jt-podlead",
      pinned_messages: [
        { title: "The three moves of a call", content_md: "Open with one question built on the buyer's profile. Repeat any objection in the buyer's words before you answer it, and send the invite before you hang up.", related_module: "M3" },
      ],
      messages: feedbackMessages(),
    },
  });
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 6) return;
    mountTaskBanner(appBody("slack"), { id: "m3-s7-read-dm", label: "Read J.T.'s message, then click Mark thread read.", state: "active" });
    bar(feed, "data-m3-s7-done", "J.T. will post three questions once you have read his message.", "✓ Mark thread read")
      .querySelector("button").addEventListener("click", () => {
        if (state.step !== 6) return;
        markTaskBannerDone("m3-s7-read-dm");
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
    <p style="font-size:14px;">J.T. has posted three questions in the same Slack conversation, and you pass this check if you answer two of them correctly.</p>
  `;
  if (!isOpen("slack")) state.api.os.openApp("slack");
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 7) return;
    mountTaskBanner(appBody("slack"), { id: "m3-s8-quiz", label: "Answer J.T.'s three questions. A wrong answer shows you the right one and why.", state: "active" });
    feed.querySelector("[data-m3-s7-done]")?.closest(".mx-bar")?.remove();
    feed.querySelector("[data-m3-quiz-thread]")?.remove();
    const thread = document.createElement("div");
    thread.className = "mx-thread";
    thread.setAttribute("data-m3-quiz-thread", "");
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
    markTaskBannerDone("m3-s8-quiz");
    state.api.eventLog?.record?.("step8_quiz_completed", { score: state.quizScore });
    completeStep(7, 500);
  });
}

// --- Step 9 ---------------------------------------------------------------------

function stepTakeaway(body) {
  const pct = quizPct();
  body.innerHTML = `
    <p style="font-size:14px;">
      You answered <strong>${state.quizScore} of ${state.quizItems.length}</strong> questions correctly (${pct}%).
      M.G. has pinned a short note in Slack. The module ends when you schedule the refresher under it.
    </p>
  `;
  if (!isOpen("slack")) state.api.os.openApp("slack");
  waitFor(() => appBody("slack")?.querySelector(".slack-feed"), feed => {
    if (state.step !== 8) return;
    feed.querySelector("[data-m3-quiz-thread]")?.remove();
    feed.querySelector("[data-m3-s7-done]")?.closest(".mx-bar")?.remove();
    mountTaskBanner(appBody("slack"), { id: "m3-s9-takeaway", label: "Read M.G.'s note, then schedule the refresher to finish the module.", state: "active" });
    if (feed.querySelector("[data-m3-pinned]")) return;
    const pinned = document.createElement("div");
    pinned.className = "mx-pinned";
    pinned.setAttribute("data-m3-pinned", "");
    pinned.innerHTML = `
      <div class="mx-pinned__k">📌 M.G., a rep in the Manchester pod, pinned this note</div>
      <p class="mx-pinned__quote">"Keep Calendar open in a second tab, offer two times and send the
        invite before you hang up. Almost every call I've lost ended with me promising to follow up."</p>
      <div class="mx-pinned__foot">
        <span>📅 In seven days you'll get three short questions about closing during the call.</span>
        <button type="button" class="mx-btn" data-m3-s9-finish>Schedule refresher &rarr;</button>
      </div>
    `;
    feed.appendChild(pinned);
    pinned.scrollIntoView({ block: "nearest" });
    pinned.querySelector("[data-m3-s9-finish]").addEventListener("click", () => {
      markTaskBannerDone("m3-s9-takeaway");
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
      <h2 class="summary-card__title" id="summary-title">Calendar close, ${passed ? "passed" : "not passed yet"}</h2>
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

// --- Utilities ----------------------------------------------------------------------

/** "Tue 14:00" → "Tuesday at 14:00", as a buyer would say it back. */
function spokenSlot(slot) {
  const DAYS = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
  const [d, t] = String(slot ?? "").split(" ");
  return DAYS[d] ? `${DAYS[d]} at ${t}` : String(slot ?? "That time");
}

function timestamp() {
  const ms = Date.now() - state.startedAt;
  return `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")}`;
}

function renderFatal(msg) {
  const body = document.getElementById("narrative-body");
  if (body) body.innerHTML = `<p style="color:var(--ftc-danger-muted)">Module failed to start: ${escapeHtml(msg)}</p>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
}
