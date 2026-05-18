/**
 * Module 3 · M3 Calendar Close · runtime
 * ---------------------------------------------------------------------------
 * Boots the mini-OS shell, runs the Gagné nine-event timeline, instruments
 * the habit-gate (Calendar must be open before Dial enables), assembles the
 * worked example, completion problem, solo problem, feedback, quiz, and
 * key-takeaway. Persists telemetry to cmi.suspend_data via the shared
 * EventLog (see 03-develop/scorm-shell/event-log-spec.md).
 *
 * Storyboard:  02-design/module-storyboards/M3-calendar-close.md
 * Outcomes:    LO-M3.1 (habit · event-log only) + LO-M3.2 (quiz + rubric)
 * Voice:       peer-to-peer (brief §18.2)
 */

import { bootModule, eventBus } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";

// ---------------------------------------------------------------------------
// Window-management helpers
// ---------------------------------------------------------------------------

/**
 * Close every open mini-OS window whose appId is in the given list.
 * Used to clean up prior-step apps so the rep isn't drowning in 5 windows
 * by step 7+.
 */
function closeAppsByName(appIds) {
  if (!state.api?.os?.listWindows) return;
  const set = new Set(appIds);
  for (const w of state.api.os.listWindows()) {
    if (set.has(w.appId)) state.api.os.closeApp(w);
  }
}

/** Close everything except the apps the next step needs. */
function keepOnly(appIds) {
  if (!state.api?.os?.listWindows) return;
  const keep = new Set(appIds);
  for (const w of state.api.os.listWindows()) {
    if (!keep.has(w.appId)) state.api.os.closeApp(w);
  }
}

// ===========================================================================
// State
// ===========================================================================

const state = {
  /** @type {import('../scorm-shell/js/shell.js').BootApi|null} */ api: null,
  step: 0,
  startedAt: 0,
  calendarOpened: false,
  dialAttempted: false,
  slotsPicked: /** @type {string[]} */ ([]),
  inviteSent: false,
  salesforceBooked: false,
  completionAnswer: null,
  quizIndex: 0,
  quizScore: 0,
  /** loaded JSON */
  transcripts: /** @type {any[]} */ ([]),
  prospects:   /** @type {any[]} */ ([]),
  quizItems:   /** @type {any[]} */ ([]),
  /** timeline for feedback step */
  timeline: /** @type {Array<{label:string, detail:string, ts:string, state?:string}>} */ ([]),
};

// ===========================================================================
// Data loading
// ===========================================================================

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function loadAllData() {
  const [transcripts, prospects, quizItems] = await Promise.all([
    loadJson("./data/transcripts.json"),
    loadJson("./data/prospects.json"),
    loadJson("./data/quiz.json"),
  ]);
  state.transcripts = transcripts;
  state.prospects   = prospects;
  state.quizItems   = quizItems;
}

// ===========================================================================
// Boot
// ===========================================================================

async function start() {
  try {
    await loadAllData();
  } catch (err) {
    console.error("[M3] Failed to load module data", err);
    renderFatal(err.message);
    return;
  }
  bootModule({
    moduleId: "M3",
    title: "Module 3 · Calendar Close",
    appsToLaunch: [],   // we open apps explicitly inside each step
    onReady(api) {
      // bootModule fires onReady before its return, so assign api here —
      // not from the return value (which would still be null at this point).
      state.api = api;
      state.startedAt = Date.now();
      wireProgressTimer();
      wireHelpButton();
      wireNarrativeButtons();
      // Welcome card defers runStep(0) until the rep clicks Start.
      showWelcomeCard(() => runStep(0));
    },
  });
}

start();

// ===========================================================================
// Gagné event timeline
// ===========================================================================

const STEPS = [
  { title: "Outreach pings · a warm lead just opened your email", handler: stepGainAttention },
  { title: "What you'll do in the next 10 minutes",               handler: stepStateOutcome },
  { title: "M1 opened it. M2 saved it. M3 books it.",             handler: stepRecallPrior },
  { title: "Watch · M.G. closes Maria in real time",              handler: stepWorkedExample },
  { title: "Your turn · pick the right close for Tom",            handler: stepCompletionProblem },
  { title: "Solo · close Emma. Calendar first.",                  handler: stepSoloProblem },
  { title: "Your event log · what just happened",                 handler: stepFeedback },
  { title: "Quick check · 3 questions",                           handler: stepQuiz },
  { title: "Key takeaway + your next retrieval drop",             handler: stepTakeaway },
];

function runStep(i) {
  state.step = i;
  document.getElementById("gagne-step").textContent      = `${i + 1} of ${STEPS.length}`;
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

/**
 * Welcome intro card · mounts a centered modal on module load.
 * Dismiss button calls onStart() so the timeline begins on rep's signal.
 */
function showWelcomeCard(onStart) {
  // Hide the narrative panel while the welcome is showing so the rep's
  // first visual is the card, not the side overlay peeking.
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
      <div class="welcome-card__kicker">Module 3 · keystone close</div>
      <h2 class="welcome-card__title" id="welcome-title">Calendar Close</h2>
      <div class="welcome-card__meta">10 min &middot; 9 steps &middot; in-app practice</div>
      <p class="welcome-card__lede">
        Learn the M3 keystone close in the apps your team actually uses.
        Calendar in second tab. Two slots. Invite during the call.
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
    seg.dataset.state = n < currentStep ? "done"
                      : n === currentStep ? "current"
                      : "pending";
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
}

function wireHelpButton() {
  document.getElementById("help-button").addEventListener("click", () => {
    state.api.os.openApp("slack", { pinnedFocus: "3-move-card" });
  });
}

function wireProgressTimer() {
  const el = document.getElementById("module-progress");
  const tick = () => {
    const ms = Date.now() - state.startedAt;
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    el.textContent = `${m}:${s} / 10:00`;
  };
  tick();
  setInterval(tick, 1000);
}

// ===========================================================================
// Step 1 · Gain attention (0:00–0:30)
// ===========================================================================

function stepGainAttention(body) {
  // Narrative pane shrinks to peer-quote only — apps drive the rest.
  body.innerHTML = `
    <blockquote class="peer-quote">
      I have lost too many deals to follow-up.
      <cite>— M.G., Manchester · top-decile rep</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      Do the task in the Outreach window. The narrative panel just
      describes what you're seeing — the work happens in the apps.
    </p>
  `;
  state.api.os.openApp("outreach", { highlightLeadId: "L-MARIA" });
  setTimeout(() => decorateOutreachForStep1(), 140);
}

function decorateOutreachForStep1() {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  mountTaskBanner(outreachBody, {
    id: "m3-s1-pick-warm",
    label: "Click warm lead (Maria) — she opened your email twice in 15 min",
    hint: "Look at the green open-signal chip on her row",
    state: "active",
  });
  // Inject an open-signal chip on Maria's row + click-to-complete.
  // The Outreach app renders rows asynchronously; poll briefly until present.
  let tries = 0;
  const tick = () => {
    const mariaBtn = outreachBody.querySelector('[data-lead-id="L-MARIA"], [data-lead-id="lead-001"]');
    const mariaRow = mariaBtn?.closest(".lead-row")
                  ?? [...outreachBody.querySelectorAll(".lead-row")].find(r => /Maria/i.test(r.textContent || ""));
    if (!mariaRow) {
      if (++tries < 20) return setTimeout(tick, 100);
      return;
    }
    if (mariaRow.querySelector(".open-signal-chip")) return; // already decorated
    mariaRow.classList.add("is-warm-highlight");
    const chip = document.createElement("span");
    chip.className = "open-signal-chip";
    chip.setAttribute("aria-label", "Opened email twice in 15 minutes");
    chip.innerHTML = `📨 <strong>2 opens</strong> · 15 min`;
    // Put the chip alongside the meta line (second .meta div) when present.
    const meta = mariaRow.querySelector(".meta") ?? mariaRow.firstElementChild;
    meta?.appendChild(chip);
    // Click anywhere on the row OR on the chip completes step 1.
    const complete = () => {
      if (state.step !== 0) return;
      markTaskBannerDone("m3-s1-pick-warm");
      state.api.eventLog?.record?.("step1_picked_warm_lead");
      setTimeout(() => runStep(1), 450);
    };
    mariaRow.addEventListener("click", e => {
      // Don't fire on the Dial button (let outreach handle that natively).
      if (e.target.closest('[data-action="dial"]')) return;
      complete();
    });
  };
  tick();
}

// ===========================================================================
// Step 2 · State outcome (0:30–1:00)
// ===========================================================================

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">By the end of these 10 minutes:</p>
    <ul style="font-size:14px; margin:6px 0 10px 18px;">
      <li><strong>Calendar invite during the call</strong> — not after.</li>
      <li><strong>Calendar open in a second tab before every dial</strong>
          — habit, not afterthought.</li>
    </ul>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Next action: confirm the open-signal in Outreach (clicking the chip
      counts).
    </p>
  `;
  // Replace step-1 banner with step-2 banner inside the same app.
  setTimeout(() => {
    const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
    if (!outreachBody) return;
    mountTaskBanner(outreachBody, {
      id: "m3-s2-read-signal",
      label: "Read the open-signal chip · Maria opened your email 2× in 15 min",
      hint: "Click the green chip on her row to confirm",
      state: "active",
    });
    const chip = outreachBody.querySelector(".open-signal-chip");
    if (!chip) return;
    chip.classList.add("is-pulsing");
    chip.addEventListener("click", e => {
      e.stopPropagation();
      if (state.step !== 1) return;
      markTaskBannerDone("m3-s2-read-signal");
      state.api.eventLog?.record?.("step2_read_signal");
      setTimeout(() => runStep(2), 450);
    }, { once: true });
  }, 140);
}

// ===========================================================================
// Step 3 · Recall prior (1:00–1:30)
// ===========================================================================

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Quick recall — three keystone moves:</p>
    <ol style="font-size:13.5px; margin:6px 0 8px 18px;">
      <li><strong>M1 · Diagnostic.</strong> One sharp question off the
        LinkedIn / CH profile. Then silence.</li>
      <li><strong>M2 · Acknowledge.</strong> Restate the buyer's objection
        in their words before you respond.</li>
      <li><strong>M3 · Close.</strong> ← <em>this module.</em> Two slots,
        one invite, during the call.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Next action: open the Calendar app — that's the habit gate. Dial
      stays disabled until Calendar is open in a second window.
    </p>
  `;
  // Open the Calendar launcher hint in the taskbar + watch for open event.
  setTimeout(() => {
    const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
    if (outreachBody) {
      mountTaskBanner(outreachBody, {
        id: "m3-s3-open-calendar",
        label: "Open the Calendar app — habit gate",
        hint: "Use the 'Open Calendar' button or the taskbar",
        state: "active",
      });

      // Inject a clearly-labelled Open Calendar button into Outreach body
      // (it stays in the rep's eyeline while they're already looking here).
      if (!outreachBody.querySelector("[data-m3-s3-open-cal]")) {
        const wrap = document.createElement("div");
        wrap.style.cssText = "margin:8px 0 0; padding:10px 12px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
        wrap.innerHTML = `
          <span style="font-size:12.5px; color:var(--ftc-ink-2);">
            Calendar must be open before you dial. That's the habit.
          </span>
          <button type="button"
                  class="btn btn--primary"
                  data-m3-s3-open-cal
                  style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
            📅 Open Calendar
          </button>
        `;
        outreachBody.appendChild(wrap);
        wrap.querySelector("[data-m3-s3-open-cal]").addEventListener("click", () => {
          state.api.os.openApp("calendar", { suggestedSlots: ["Tue 11:00", "Thu 14:00"] });
        });
      }
    }

    // Auto-advance on the actual calendar-opened event from the shell bus.
    const onAppOpened = (ev) => {
      if (ev.detail?.appId !== "calendar") return;
      if (state.step !== 2) return;
      state.api.eventBus.removeEventListener("app:opened", onAppOpened);
      markTaskBannerDone("m3-s3-open-calendar");
      state.calendarOpened = true;
      state.api.eventLog?.record?.("step3_calendar_opened");
      setTimeout(() => runStep(3), 500);
    };
    state.api.eventBus.addEventListener("app:opened", onAppOpened);
  }, 140);
}

// ===========================================================================
// Step 4 · Worked example (1:30–3:00) · M.G. + Maria · GC-01 + GC-03
// ===========================================================================

function stepWorkedExample(body) {
  // Narrative pane shrinks to a one-paragraph framing + cue. Work is in Gong.
  body.innerHTML = `
    <p style="font-size:14px;">
      Watch <strong>M.G.</strong> close <strong>Maria R.</strong> in real
      time. Calendar sits in a second tab from the moment the call starts.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Listen for the <strong>M3 [Close]</strong> tag — invite goes out
      <em>during</em> the call, not after. The Gong window highlights it.
    </p>
  `;

  // Open the Gong app on call GC-01 (M.G. + Maria). Default data file
  // already covers GC-01 / GC-03 — no transcript pass-through needed here.
  state.api.os.openApp("gong", { activeTranscriptId: "GC-01" });

  // Then mount the task-banner inside Gong + a 'Watched it' button that
  // advances. Auto-advance on M3 chip click too.
  setTimeout(() => {
    const gongBody = document.querySelector(".os-window.app--gong .os-window-body");
    if (!gongBody) return;
    mountTaskBanner(gongBody, {
      id: "m3-s4-watch",
      label: "Watch M.G.'s close — find the M3 [Close] tag in the transcript",
      hint: "Click any M3 chip OR the 'Watched it' button below",
      state: "active",
    });

    // Inject a small explicit-completion bar at the very bottom so the rep
    // has a deliberate 'I got it' action when they're ready.
    if (!gongBody.querySelector("[data-m3-s4-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">
          See the [M3] chip on M.G.'s "Tuesday 11 or Thursday 2" line?
        </span>
        <button type="button"
                data-m3-s4-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Watched it
        </button>
      `;
      gongBody.appendChild(bar);
      const complete = () => {
        if (state.step !== 3) return;
        markTaskBannerDone("m3-s4-watch");
        state.api.eventLog?.record?.("step4_worked_example_completed");
        state.timeline.push({
          label: "Watched M.G. worked example",
          detail: "GC-01 · two-slot close pattern observed",
          ts: timestamp(),
        });
        setTimeout(() => runStep(4), 450);
      };
      bar.querySelector("[data-m3-s4-done]").addEventListener("click", complete);

      // Also: clicking any M3 chip in the transcript counts as completion.
      const onChip = (e) => {
        const chip = e.target.closest?.('.m-chip[data-move="M3"]');
        if (!chip) return;
        complete();
      };
      gongBody.addEventListener("click", onChip);
    }
  }, 200);
}

function renderTranscriptLine(turn) {
  const cls  = turn.m_move === "M3" ? "is-m3" : "";
  const chip = turn.m_move === "M3"
    ? `<span class="transcript-line__chip" aria-label="M3 calendar close move">📅 M3</span>`
    : "";
  return `
    <div class="transcript-line ${cls}">
      <span class="ts">[${turn.ts}]</span>
      <span><span class="speaker">${turn.speaker}:</span> ${turn.text}${chip}</span>
    </div>
  `;
}

// ===========================================================================
// Step 5 · Completion problem (3:00–5:00) · Tom · 4 options
// ===========================================================================

function stepCompletionProblem(body) {
  // Tom drawer lives in Outreach — close Gong (and any other heavy windows)
  // so the rep's eye lands on Outreach without hunt-and-peck.
  keepOnly(["outreach"]);
  // Narrative pane shrinks to single-line framing — drawer lives in Outreach.
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Tom</strong> (Series-B founder · Brex-comparison buyer) is on
      the line. He just said: <em>"Yeah, FX is a real headache. What would a
      demo even look like?"</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Pick your close in the Outreach drawer that just appeared under Tom's
      row.
    </p>
  `;

  const options = [
    { label: "A", result: "partial",
      text: `"I'll send a calendar invite with some times by email."`,
      rationale: "Partial credit at best — GC-05 pattern. Invite delayed past the call window." },
    { label: "B", result: "correct",
      text: `"What's the best 20 minutes next week to walk you through the FX-cost-vs-Brex on your last month's spend — Tuesday 11 or Thursday 2?"`,
      rationale: "Yes. Two specific slots, framed around Tom's actual pain. L.D.'s GC-03 + GC-06 pattern." },
    { label: "C", result: "anti",
      text: `"I'll follow up by email next week."`,
      rationale: "GC-10 / GC-11 anti-pattern. This is where deals die — no re-engage." },
    { label: "D", result: "anti",
      text: `"Let me check my calendar and get back to you."`,
      rationale: "GC-19 / GC-22 anti-pattern. Calendar should already be open." },
  ];

  setTimeout(() => mountTomDrawer(options), 160);
}

function mountTomDrawer(options) {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  state.api.os.focusApp?.("outreach");

  mountTaskBanner(outreachBody, {
    id: "m3-s5-pick-close",
    label: "Pick the right close for Tom — drawer just opened under his row",
    hint: "Click one of options A / B / C / D. Wrong picks explain why.",
    state: "active",
  });

  // Find Tom's row.
  const tomRow = [...outreachBody.querySelectorAll(".lead-row")].find(r => /Tom/i.test(r.textContent || ""));
  if (!tomRow) return;
  tomRow.classList.add("is-warm-highlight");

  // Remove a previous drawer if any (idempotent on step replay).
  outreachBody.querySelector("[data-m3-s5-drawer]")?.remove();

  const drawer = document.createElement("div");
  drawer.setAttribute("data-m3-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Tom · live call · 00:38</strong>
      <span class="tom-drawer__cue">Pick your close</span>
    </header>
    <p class="tom-drawer__stem">
      <em>"Yeah, FX is a real headache. What would a demo even look like?"</em>
    </p>
    <div class="tom-drawer__opts" role="radiogroup" aria-label="Pick the close">
      ${options.map((o, i) => `
        <button type="button"
                class="tom-drawer__opt"
                role="radio"
                aria-checked="false"
                data-result="${o.result}"
                data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${o.text}</span>
        </button>
      `).join("")}
    </div>
    <div class="tom-drawer__fb" id="m3-s5-fb" hidden></div>
  `;
  tomRow.insertAdjacentElement("afterend", drawer);

  const fb = drawer.querySelector("#m3-s5-fb");
  drawer.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const opt = options[idx];
      drawer.querySelectorAll(".tom-drawer__opt").forEach(b => {
        b.classList.remove("is-correct", "is-incorrect");
        b.setAttribute("aria-checked", "false");
      });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.result === "correct" ? "is-correct" : "is-incorrect");
      fb.hidden = false;
      fb.textContent = opt.rationale;
      state.completionAnswer = opt.result;
      if (opt.result === "correct") {
        markTaskBannerDone("m3-s5-pick-close");
        state.api.eventLog?.record?.("completion_problem_completed");
        state.timeline.push({
          label: "Picked correct two-slot close for Tom",
          detail: "Option B · L.D. pattern · GC-03",
          ts: timestamp(),
        });
        setTimeout(() => runStep(5), 700);
      }
    });
  });
}

// ===========================================================================
// Step 6 · Solo problem (5:00–8:00) · Emma · habit-gated
// ===========================================================================

function stepSoloProblem(body) {
  const emma = state.prospects.find(p => p.archetype === "emma") ?? state.prospects[0];

  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Solo run.</strong> Lead: <strong>${emma.name}</strong>
      (${emma.archetype_label}). Warmed by your previous touch.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Dial stays disabled until Calendar opens. Then: dial → speak two
      slots → send invite. Watch Salesforce
      <code>Next_Step_Booked__c</code> flip live.
    </p>
    <p id="solo-status" class="retention-note" aria-live="polite">
      Status: Calendar closed · Dial disabled
    </p>
  `;

  const { api } = state;
  api.os.openApp("outreach",      { highlightLeadId: emma.id, dialDisabled: true });
  api.os.openApp("phone-dialler");
  api.os.openApp("salesforce",    { accountId: emma.id });

  // Task banner inside Outreach so the rep knows what to do without
  // reading the side panel.
  setTimeout(() => {
    const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
    if (outreachBody) {
      mountTaskBanner(outreachBody, {
        id: "m3-s6-solo",
        label: `Run the solo close on ${emma.name} — Calendar first, then dial`,
        hint: "Habit gate enforces this. Try it cold.",
        state: "active",
      });
    }
  }, 200);

  installHabitGate(emma);
}

function installHabitGate(emma) {
  const status = document.getElementById("solo-status");
  const { api } = state;

  // Inject the gated dial-button into the Outreach window body. Stays
  // focusable (no `disabled` attribute) so the screen reader can announce
  // the reason via aria-describedby pointing to #dial-gate-hint.
  setTimeout(() => {
    const outreachBody = document.querySelector(".app--outreach");
    if (!outreachBody || outreachBody.querySelector("[data-m3-dial]")) return;

    const wrap = document.createElement("div");
    wrap.style.position = "relative";
    wrap.style.padding  = "16px";
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <button type="button"
                class="dial-button"
                data-m3-dial
                aria-disabled="true"
                aria-describedby="dial-gate-hint">
          📞 Dial ${emma.name}
        </button>
        <button type="button"
                class="btn btn--ghost"
                data-m3-open-calendar>
          📅 Open Calendar
        </button>
      </div>
      <p style="font-size:12px;color:var(--ftc-ink-2);margin:10px 0 0">
        Habit gate · Calendar must be open before dial.
      </p>
    `;
    outreachBody.appendChild(wrap);

    const dialBtn   = wrap.querySelector("[data-m3-dial]");
    const openCal   = wrap.querySelector("[data-m3-open-calendar]");

    // First-time coach-mark surfaces the rule.
    const coach = document.createElement("div");
    coach.className = "gate-coach-mark";
    coach.setAttribute("role", "note");
    coach.textContent = "Open Calendar before dialling — second tab. That's the habit.";
    coach.style.top  = "-56px";
    coach.style.left = "0";
    wrap.appendChild(coach);

    openCal.addEventListener("click", () => {
      api.os.openApp("calendar", {
        suggestedSlots: ["Tue 11:00", "Thu 14:00"],
      });
      onCalendarOpened(dialBtn, coach);
    });

    dialBtn.addEventListener("click", () => {
      if (dialBtn.getAttribute("aria-disabled") === "true") {
        // Re-announce the rule on attempted gated dial.
        const announcer = document.getElementById("focus-announcer");
        if (announcer) announcer.textContent = "Dial disabled until Calendar opens. Open Calendar first.";
        return;
      }
      onDial(emma);
    });

    // Also catch the case where Calendar opens via taskbar / app-bus.
    api.eventBus.addEventListener("app:opened", (ev) => {
      if (ev.detail?.appId === "calendar") onCalendarOpened(dialBtn, coach);
    });
  }, 250);

  function onCalendarOpened(dialBtn, coach) {
    if (state.calendarOpened) return;
    state.calendarOpened = true;
    // Telemetry event · spec name `calendar_opened` (LO-M3.1 evidence).
    api.eventBus.dispatchEvent(new CustomEvent("telemetry", {
      detail: { event_name: "calendar_opened" },
    }));
    state.timeline.push({
      label: "Calendar opened",
      detail: "Second tab · habit established · LO-M3.1 evidenced",
      ts: timestamp(),
    });
    dialBtn.setAttribute("aria-disabled", "false");
    coach?.remove();
    if (status) status.textContent = "Status: Calendar open · Dial enabled";
  }
}

function onDial(emma) {
  state.dialAttempted = true;
  state.api.eventBus.dispatchEvent(new CustomEvent("telemetry", {
    detail: {
      event_name: "phone_dial_attempt",
      lead_id: emma.id,
      archetype: emma.archetype,
      calendar_open_before_dial: state.calendarOpened,
    },
  }));
  state.timeline.push({
    label: "Dialled " + emma.name,
    detail: `calendar_open_before_dial = ${state.calendarOpened}`,
    ts: timestamp(),
  });
  showInterestLine(emma);
}

function showInterestLine(emma) {
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Live call");
  overlay.style.cssText = `
    position:fixed;top:120px;left:24px;width:380px;
    background:#0f1419;color:#fff;border-radius:12px;padding:18px;
    box-shadow:0 12px 32px rgba(0,0,0,0.32);z-index:9200;
    font-family:var(--ftc-font-sans);font-size:14px;line-height:1.5;
  `;
  overlay.innerHTML = `
    <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <strong>📞 Live call · ${emma.name}</strong>
      <span style="font-family:var(--ftc-font-mono);font-size:12px;color:#9aa4af">00:42</span>
    </header>
    <p style="margin:0 0 10px">
      <em>${emma.name}:</em> "Honestly... if your tool actually pulls
      supplier receipts off-platform, that would save my bookkeeper a week
      per month."
    </p>
    <p style="margin:0 0 8px;color:#9aa4af;font-size:12px">
      ↓ Pick exactly two 20-minute slots, then send the invite:
    </p>
    <div class="slot-picker" id="m3-slot-picker">
      ${["Tue 11:00", "Tue 15:30", "Wed 10:00", "Thu 14:00", "Fri 09:30"]
        .map(s => `<button type="button" class="slot-picker__btn" aria-pressed="false" data-slot="${s}">${s}</button>`)
        .join("")}
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button type="button" class="btn btn--primary" id="m3-send-invite" aria-disabled="true">
        Send invite
      </button>
      <button type="button" class="btn btn--ghost" id="m3-end-call" disabled>
        End call
      </button>
    </div>
    <p id="m3-call-status" style="margin:10px 0 0;font-size:12px;color:#9aa4af" aria-live="polite">
      Pick exactly two slots, then send.
    </p>
  `;
  document.body.appendChild(overlay);

  const picker  = overlay.querySelector("#m3-slot-picker");
  const sendBtn = overlay.querySelector("#m3-send-invite");
  const endBtn  = overlay.querySelector("#m3-end-call");
  const status  = overlay.querySelector("#m3-call-status");

  picker.addEventListener("click", (e) => {
    const btn = e.target.closest(".slot-picker__btn");
    if (!btn) return;
    const slot = btn.dataset.slot;
    const idx  = state.slotsPicked.indexOf(slot);
    if (idx >= 0) {
      state.slotsPicked.splice(idx, 1);
      btn.setAttribute("aria-pressed", "false");
    } else if (state.slotsPicked.length < 2) {
      state.slotsPicked.push(slot);
      btn.setAttribute("aria-pressed", "true");
      state.api.eventBus.dispatchEvent(new CustomEvent("telemetry", {
        detail: { event_name: "slots_stated", slot_id: slot },
      }));
    } else {
      status.textContent = "Two slots max — deselect one first.";
      return;
    }
    sendBtn.setAttribute("aria-disabled", state.slotsPicked.length === 2 ? "false" : "true");
    status.textContent = state.slotsPicked.length === 2
      ? `Ready to send: ${state.slotsPicked.join(" or ")}`
      : `Picked ${state.slotsPicked.length} of 2`;
  });

  sendBtn.addEventListener("click", () => {
    if (sendBtn.getAttribute("aria-disabled") === "true") return;
    state.inviteSent = true;
    state.api.eventBus.dispatchEvent(new CustomEvent("telemetry", {
      detail: {
        event_name: "invite_sent",
        invitee_email: emma.email,
        slot_ids: [...state.slotsPicked],
      },
    }));
    state.timeline.push({
      label: "Calendar invite sent · during call",
      detail: `${state.slotsPicked.join(" / ")} · ${emma.name}`,
      ts: timestamp(),
    });
    status.textContent = `Invite sent. ${emma.name}: "Tuesday 11 works. I'll bring my accountant."`;
    sendBtn.disabled = true;
    setTimeout(() => openSalesforceModal(emma, endBtn, overlay), 600);
  });

  endBtn.addEventListener("click", () => {
    overlay.remove();
    markTaskBannerDone("m3-s6-solo");
    state.api.eventLog.record("solo_problem_completed");
    runStep(state.step + 1);
  });
}

function openSalesforceModal(emma, endBtn, overlay) {
  const modal = document.createElement("div");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Salesforce · Log next step");
  modal.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);
    width:420px;background:#fff;color:var(--ftc-ink);
    border-radius:12px;padding:20px;
    box-shadow:0 20px 56px rgba(0,0,0,0.32);z-index:9400;
    font-family:var(--ftc-font-sans);
  `;
  modal.innerHTML = `
    <h3 style="margin:0 0 12px;color:#1B5297">Salesforce · Log next step</h3>
    <p style="margin:0 0 12px;font-size:14px">
      Account: <strong>${emma.name}</strong> · ${emma.company}
    </p>
    <label style="display:block;font-size:13px;margin-bottom:4px" for="sf-next-step">
      Next step
    </label>
    <input id="sf-next-step" type="text"
           value="Demo · receipt-capture + Xero sync"
           style="width:100%;padding:8px;border:1px solid var(--ftc-border);border-radius:6px;margin-bottom:10px">
    <label style="display:block;font-size:13px;margin-bottom:4px" for="sf-booked-at">
      Booked at
    </label>
    <input id="sf-booked-at" type="text"
           value="${state.slotsPicked[0] || 'Tue 11:00'}"
           style="width:100%;padding:8px;border:1px solid var(--ftc-border);border-radius:6px;margin-bottom:14px">
    <p style="font-size:12px;color:var(--ftc-ink-2);margin-bottom:14px">
      <code>Next_Step_Booked__c</code> will flip to <strong>TRUE</strong>
      the moment you save.
    </p>
    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button type="button" class="btn btn--primary" id="sf-save">Save next step</button>
    </div>
  `;
  document.body.appendChild(modal);
  const save = modal.querySelector("#sf-save");
  save.focus();
  save.addEventListener("click", () => {
    state.salesforceBooked = true;
    state.api.eventBus.dispatchEvent(new CustomEvent("telemetry", {
      detail: { event_name: "next_step_booked_set", account: emma.id },
    }));
    state.timeline.push({
      label: "Salesforce · Next_Step_Booked__c = TRUE",
      detail: "Set during live call · L4 proxy fired",
      ts: timestamp(),
    });
    modal.remove();
    endBtn.disabled = false;
    overlay.querySelector("#m3-call-status").textContent =
      "Salesforce updated. End the call to continue.";
  });
}

// ===========================================================================
// Step 7 · Feedback (8:00–9:00) · event-log timeline visual
// ===========================================================================

function stepFeedback(body) {
  // Clean up: feedback lives in Slack only — close everything else so the
  // rep doesn't have a 5-window pile-up to navigate.
  keepOnly(["slack"]);
  // Narrative pane shrinks; manager DM thread renders in Slack.
  body.innerHTML = `
    <p style="font-size:14px;">
      Your manager <strong>J.T.</strong> just pinged you in Slack with the
      review of what your event log captured during the solo.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Read the thread, then mark as read to continue.
    </p>
  `;

  // Build a DM channel populated from the event log + manager voice.
  const dmMessages = [
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:48",
      body: "Watched your solo on " + (state.prospects.find(p => p.archetype === "emma")?.name || "Emma") + ". Couple of marks for you 👇" },
    ...state.timeline.map(e => ({
      author: "J.T. (pod lead)", initials: "JT", ts: e.ts,
      body: `✅ ${e.label} — ${e.detail}`,
    })),
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:52",
      body: "Calendar was open before dial. Invite during the call. That's the habit — keep it." },
    { author: "M.G. (peer)", initials: "MG", ts: "12:54",
      body: "Nice. I have my calendar open in a second tab the entire time. Try it on the cold leads too — habit transfers." },
  ];

  state.api.os.openApp("slack", {
    channel: {
      channel_id: "dm-jt-podlead",
      pinned_messages: [
        { title: "3-move card", content_md: "M1 diagnostic · M2 acknowledge · M3 calendar close", related_module: "M3" },
      ],
      messages: dmMessages,
    },
  });

  setTimeout(() => {
    const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
    if (!slackBody) return;
    mountTaskBanner(slackBody, {
      id: "m3-s7-read-dm",
      label: "Read your manager's feedback in this DM",
      hint: "Click 'Mark thread read' below when done",
      state: "active",
    });
    // Inject a 'Mark thread read' CTA at the bottom of the messages area.
    if (!slackBody.querySelector("[data-m3-s7-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin:14px 0 0; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">
          J.T. waits for you to acknowledge before pinging the next move.
        </span>
        <button type="button"
                data-m3-s7-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Mark thread read
        </button>
      `;
      slackBody.appendChild(bar);
      bar.querySelector("[data-m3-s7-done]").addEventListener("click", () => {
        markTaskBannerDone("m3-s7-read-dm");
        state.api.eventLog?.record?.("step7_feedback_read");
        setTimeout(() => runStep(state.step + 1), 500);
      });
    }
  }, 200);
}

// ===========================================================================
// Step 8 · Quiz (9:00–9:30) · 3 items
// ===========================================================================

function stepQuiz(body) {
  state.quizIndex = 0;
  state.quizScore = 0;
  // Narrative pane: short framing only.
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Quick check</strong> · 3 questions from J.T. in the same
      Slack DM. Answer in the thread.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Two correct out of three advances the module.
    </p>
  `;
  setTimeout(() => mountQuizInSlack(), 200);
}

function mountQuizInSlack() {
  const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
  if (!slackBody) {
    // Re-open Slack if user closed it.
    state.api.os.openApp("slack");
    return setTimeout(mountQuizInSlack, 250);
  }
  mountTaskBanner(slackBody, {
    id: "m3-s8-quiz",
    label: "Answer the 3 quiz questions J.T. just posted",
    hint: "Each click logs in cmi.interactions",
    state: "active",
  });

  // Find or create a container for the quiz thread (appended to messages).
  let thread = slackBody.querySelector("[data-m3-quiz-thread]");
  if (thread) thread.remove();
  thread = document.createElement("div");
  thread.setAttribute("data-m3-quiz-thread", "");
  thread.style.cssText = "margin:14px 0 0; padding:14px 16px; background:#fff8e0; border-left:3px solid var(--sun-500, #f5b800); border-radius:6px; font-family:var(--ftc-font-sans);";
  thread.innerHTML = `
    <div style="font-family:var(--ftc-font-mono); font-size:11px; color:var(--ftc-ink-2); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">
      J.T. · 12:55 · quick check thread
    </div>
    <div data-quiz-host></div>
  `;
  // Find the slack messages region and append the thread.
  const messages = slackBody.querySelector(".slack-msgs, .slack-messages, .slack-main") || slackBody;
  messages.appendChild(thread);

  renderQuizItemInSlack(thread.querySelector("[data-quiz-host]"));
}

function renderQuizItemInSlack(host) {
  const item = state.quizItems[state.quizIndex];
  host.innerHTML = `
    <div style="font-size:12px; color:var(--ftc-ink-2); margin-bottom:6px;">
      Question ${state.quizIndex + 1} of ${state.quizItems.length} · ${item.lo}
    </div>
    <p style="font-size:14px; margin:0 0 10px; color:var(--ftc-ink);">${item.stem}</p>
    <div role="radiogroup" aria-label="Answer choices" style="display:grid; gap:6px;">
      ${item.options.map((o, i) => `
        <button type="button"
                class="tom-drawer__opt"
                role="radio"
                aria-checked="false"
                data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${o.text}</span>
        </button>
      `).join("")}
    </div>
    <div class="tom-drawer__fb" id="m3-s8-fb" hidden></div>
    <div style="margin-top:10px; text-align:right;">
      <button type="button" id="m3-s8-next" disabled
              style="background:var(--brand-green); color:#fff; padding:6px 14px; border:0; border-radius:4px; font-size:12px; font-weight:600; cursor:pointer; opacity:0.5;">
        ${state.quizIndex === state.quizItems.length - 1 ? "Finish quiz" : "Next question"}
      </button>
    </div>
  `;

  const fb      = host.querySelector("#m3-s8-fb");
  const nextBtn = host.querySelector("#m3-s8-next");

  host.querySelectorAll(".tom-drawer__opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const opt = item.options[idx];
      host.querySelectorAll(".tom-drawer__opt").forEach(b => {
        b.classList.remove("is-correct", "is-incorrect");
        b.setAttribute("aria-checked", "false");
        b.disabled = true;
        b.style.cursor = "default";
      });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
      fb.hidden = false;
      fb.textContent = opt.rationale;
      if (opt.correct) state.quizScore += 1;
      nextBtn.disabled = false;
      nextBtn.style.opacity = "1";
    });
  });

  nextBtn.addEventListener("click", () => {
    if (state.quizIndex < state.quizItems.length - 1) {
      state.quizIndex += 1;
      renderQuizItemInSlack(host);
    } else {
      markTaskBannerDone("m3-s8-quiz");
      state.api.eventLog?.record?.("step8_quiz_completed", { score: state.quizScore });
      setTimeout(() => runStep(state.step + 1), 500);
    }
  });
}

// ===========================================================================
// Step 9 · Key takeaway + +7d retrieval (9:30–10:00)
// ===========================================================================

function stepTakeaway(body) {
  const scorePct = Math.round((state.quizScore / state.quizItems.length) * 100);
  // Narrative pane: short context only — pinned message lives in Slack.
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Module complete.</strong> M.G. just pinned the takeaway in
      your Slack channel so you'll see it every time you open the workspace.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Quiz: <strong>${state.quizScore} / ${state.quizItems.length}</strong>
      (${scorePct}%). Click "Set +7d retrieval drop" in Slack to finish.
    </p>
  `;

  setTimeout(() => {
    const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
    if (!slackBody) {
      state.api.os.openApp("slack");
      return setTimeout(() => stepTakeaway(body), 250);
    }
    // Remove the quiz thread.
    slackBody.querySelector("[data-m3-quiz-thread]")?.remove();
    mountTaskBanner(slackBody, {
      id: "m3-s9-takeaway",
      label: "Read M.G.'s pinned takeaway, then set the +7d retrieval drop",
      hint: "One click. Module commits when the drop is scheduled.",
      state: "active",
    });

    // Inject a pinned-message style card at the top of messages region.
    if (!slackBody.querySelector("[data-m3-pinned]")) {
      const pinned = document.createElement("div");
      pinned.setAttribute("data-m3-pinned", "");
      pinned.style.cssText = "margin:14px 0 0; padding:16px 18px; background:linear-gradient(180deg, var(--ftc-green-tint, #ecf9e7) 0%, #ffffff 100%); border:1px solid var(--brand-green); border-left:4px solid var(--brand-green); border-radius:8px; font-family:var(--ftc-font-sans); box-shadow:0 6px 16px -8px rgba(10,26,16,0.12);";
      pinned.innerHTML = `
        <div style="font-family:var(--ftc-font-mono); font-size:10px; color:var(--brand-green); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">
          📌 Pinned by M.G. (peer · Manchester pod)
        </div>
        <p style="font-size:15px; font-style:italic; line-height:1.55; color:var(--ftc-ink); margin:0 0 10px;">
          "Calendar in second tab. Two slots. One invite. Sent before you
          hang up. 'Follow up' is the failure mode — make it impossible by
          sending live."
        </p>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px; padding-top:12px; border-top:1px solid var(--ftc-border);">
          <span style="font-size:12.5px; color:var(--ftc-ink-2);">
            📅 3-item retrieval drop · +7 days in your Sana inbox
          </span>
          <button type="button"
                  data-m3-s9-finish
                  style="background:var(--brand-green); color:#fff; padding:9px 16px; border:0; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
            Set +7d retrieval drop &rarr;
          </button>
        </div>
      `;
      const messages = slackBody.querySelector(".slack-msgs, .slack-messages, .slack-main") || slackBody;
      messages.appendChild(pinned);

      pinned.querySelector("[data-m3-s9-finish]").addEventListener("click", () => {
        markTaskBannerDone("m3-s9-takeaway");
        state.api.eventLog?.record?.("step9_retrieval_drop_set");
        finishModule();
      });
    }
  }, 200);
}

function finishModule() {
  const scorePct = Math.round((state.quizScore / state.quizItems.length) * 100);
  state.api.complete(scorePct);
  document.getElementById("narrative-body").innerHTML = `
    <p><strong>Module complete.</strong> Score posted to the LMS.</p>
    <p>See you in Module 4 — ICP buyer fit.</p>
  `;
  document.getElementById("narrative-next").hidden = true;
  document.getElementById("narrative-back").hidden = true;
  showSummaryCard(scorePct);
}

/**
 * End-of-module summary card · centered modal with score + time + 9-step
 * recap + back/restart actions. Shown when finishModule() runs.
 */
function showSummaryCard(scorePct) {
  // Close all windows so the summary is the only thing on screen.
  keepOnly([]);
  // Hide the narrative panel.
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";

  const totalMs = Date.now() - state.startedAt;
  const totalMin = Math.floor(totalMs / 60000);
  const totalSec = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, "0");
  const stepLabels = STEPS.map(s => s.title);

  // Reuse state.timeline if non-empty — otherwise synth a generic per-step entry.
  const recapEntries = stepLabels.map((label, i) => {
    const fromLog = state.timeline.find(e => e.label?.toLowerCase().includes(label.toLowerCase().slice(0, 14)));
    return {
      n: i + 1,
      label,
      ts: fromLog?.ts || "—",
    };
  });

  const card = document.createElement("div");
  card.className = "summary-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "summary-title");
  card.innerHTML = `
    <div class="summary-card__panel">
      <div class="summary-card__check" aria-hidden="true">✓</div>
      <div class="summary-card__kicker">Module complete</div>
      <h2 class="summary-card__title" id="summary-title">Calendar Close · cleared</h2>

      <div class="summary-card__stats">
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Quiz</span>
          <span class="summary-card__stat-v">${state.quizScore} / ${state.quizItems.length}</span>
          <span class="summary-card__stat-sub">${scorePct}% · ${scorePct >= 67 ? "pass" : "below pass"}</span>
        </div>
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Time</span>
          <span class="summary-card__stat-v">${totalMin}:${totalSec}</span>
          <span class="summary-card__stat-sub">target 10:00</span>
        </div>
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Steps</span>
          <span class="summary-card__stat-v">${STEPS.length} / ${STEPS.length}</span>
          <span class="summary-card__stat-sub">100% complete</span>
        </div>
      </div>

      <details class="summary-card__recap">
        <summary>9-step recap</summary>
        <ol class="summary-card__list">
          ${recapEntries.map(e => `
            <li><span class="summary-card__list-n">${e.n}</span>
                <span class="summary-card__list-label">${e.label}</span>
                <span class="summary-card__list-ts">${e.ts}</span></li>
          `).join("")}
        </ol>
      </details>

      <div class="summary-card__actions">
        <a class="summary-card__btn summary-card__btn--ghost" href="../../">
          &larr; Back to engagement
        </a>
        <button type="button" class="summary-card__btn summary-card__btn--primary"
                data-action="restart">
          Restart module
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(card);
  card.querySelector("[data-action='restart']")?.addEventListener("click", () => {
    location.reload();
  });
}

// ===========================================================================
// Utilities
// ===========================================================================

function timestamp() {
  const ms = Date.now() - state.startedAt;
  const m  = Math.floor(ms / 60000);
  const s  = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderFatal(msg) {
  const body = document.getElementById("narrative-body");
  if (!body) return;
  body.innerHTML = `<p style="color:var(--ftc-danger-muted)">Module failed to start: ${msg}</p>`;
}
