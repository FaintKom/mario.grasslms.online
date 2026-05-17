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
  state.api = bootModule({
    moduleId: "M3",
    title: "Module 3 · Calendar Close",
    appsToLaunch: [],   // we open apps explicitly inside each step
    onReady() {
      state.startedAt = Date.now();
      wireProgressTimer();
      wireHelpButton();
      wireNarrativeButtons();
      runStep(0);
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
  const body = document.getElementById("narrative-body");
  body.innerHTML = "";
  document.getElementById("narrative-back").hidden = i === 0;
  const next = document.getElementById("narrative-next");
  next.textContent = i === STEPS.length - 1 ? "Finish module" : "Continue";
  next.disabled = false;
  next.setAttribute("aria-disabled", "false");
  STEPS[i].handler(body);
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
  body.innerHTML = `
    <p><strong>Outreach</strong> just lit up — your sequenced lead <em>Maria
    R.</em> opened your fourth email twice in 15 minutes. She is a warm
    lead. You have a window of maybe an hour before that signal cools.</p>
    <p>Last cohort, the rep on this exact play said <em>"I'll follow up"</em>
    and never re-engaged. Today, you're going to do it differently.</p>
    <blockquote class="peer-quote">
      I have lost too many deals to follow-up.
      <cite>— M.G., Manchester · top-decile rep</cite>
    </blockquote>
  `;
  state.api.os.openApp("outreach", { highlightLeadId: "L-MARIA" });
}

// ===========================================================================
// Step 2 · State outcome (0:30–1:00)
// ===========================================================================

function stepStateOutcome(body) {
  body.innerHTML = `
    <p>By the end of these 10 minutes:</p>
    <ul>
      <li>The <strong>calendar invite goes out during the call</strong> —
        not after.</li>
      <li>You'll be opening <strong>Calendar in a second tab before every
        dial</strong> — habit, not afterthought.</li>
    </ul>
    <p><strong>"Follow up"</strong> is where deals go to die. Two slots. One
    invite. Sent before you hang up.</p>
  `;
}

// ===========================================================================
// Step 3 · Recall prior (1:00–1:30)
// ===========================================================================

function stepRecallPrior(body) {
  body.innerHTML = `
    <p>Quick recall — the three keystone moves:</p>
    <ol>
      <li><strong>M1 · Diagnostic.</strong> One specific question off
        their LinkedIn / Companies House profile. Then silence.</li>
      <li><strong>M2 · Acknowledge.</strong> Restate the buyer's objection
        in their own words before you respond.</li>
      <li><strong>M3 · Close.</strong> ← <em>this module.</em> Two slots,
        one invite, during the call.</li>
    </ol>
    <p>Top reps land all three. Bottom-quartile reps invert all three. The
    Gong data is unambiguous.</p>
  `;
}

// ===========================================================================
// Step 4 · Worked example (1:30–3:00) · M.G. + Maria · GC-01 + GC-03
// ===========================================================================

function stepWorkedExample(body) {
  const gc01 = state.transcripts.find(t => t.id === "GC-01") ?? state.transcripts[0];
  const gc03 = state.transcripts.find(t => t.id === "GC-03") ?? state.transcripts[1];

  body.innerHTML = `
    <p>Watch <strong>M.G.</strong> close <strong>Maria R.</strong> Calendar
    sits in a second tab from the moment the call starts.</p>
    <div class="worked-example" role="group" aria-label="Worked example side-by-side">
      <section class="worked-example__pane" aria-labelledby="we-gong-h">
        <h3 id="we-gong-h">Gong · ${gc01.id} · ${gc01.outcome}</h3>
        ${gc01.turns.map(renderTranscriptLine).join("")}
      </section>
      <section class="worked-example__pane" aria-labelledby="we-cal-h">
        <h3 id="we-cal-h">Calendar · second tab</h3>
        <p style="font-size:13px;color:var(--ftc-ink-2);margin:0 0 8px">
          M.G. has two free 20-min slots visible at all times. The invite
          fires <em>during</em> the call — note the timestamp on the M3
          line: invite sent at 12:32, before Maria's reply at 12:42.
        </p>
        <p style="font-size:13px;margin:8px 0 0">
          <code>calendar_open_before_dial = true</code> · event-log entry
          captured at dial-time.
        </p>
      </section>
    </div>
    <p style="margin-top:12px"><strong>L.D.'s variant</strong> on the same
    move (${gc03.id}): <em>"${gc03.close_line}"</em> — same two-slot
    pattern, faster pitch frame ("10-min product-fit").</p>
  `;

  state.api.eventLog.record("worked_example_completed");
  state.timeline.push({
    label: "Watched M.G. + L.D. worked example",
    detail: "GC-01 + GC-03 · two-slot close pattern observed",
    ts: timestamp(),
  });
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
  const stem = `Tom (Series-B founder · Brex-comparison buyer) just said:
    <em>"Yeah, FX is a real headache. What would a demo even look like?"</em>
    Pick your close.`;

  const options = [
    {
      label: "A",
      text: `"I'll send a calendar invite with some times by email."`,
      result: "partial",
      rationale: "Partial credit at best — GC-05 pattern. Invite delayed past the call window.",
    },
    {
      label: "B",
      text: `"What's the best 20 minutes next week to walk you through the FX-cost-vs-Brex on your last month's spend — Tuesday 11 or Thursday 2?"`,
      result: "correct",
      rationale: "Yes. Two specific slots, framed around Tom's actual pain. L.D.'s GC-03 + GC-06 pattern.",
    },
    {
      label: "C",
      text: `"I'll follow up by email next week."`,
      result: "anti",
      rationale: "GC-10 / GC-11 anti-pattern. This is where deals die — no re-engage.",
    },
    {
      label: "D",
      text: `"Let me check my calendar and get back to you."`,
      result: "anti",
      rationale: "GC-19 / GC-22 anti-pattern. Calendar should already be open. Bottom-quartile inverts the habit.",
    },
  ];

  body.innerHTML = `
    <div class="completion-problem">
      <p class="completion-problem__stem">${stem}</p>
      <div role="radiogroup" aria-label="Pick the close">
        ${options.map((o, i) => `
          <button type="button"
                  class="completion-option"
                  role="radio"
                  aria-checked="false"
                  data-result="${o.result}"
                  data-idx="${i}">
            <span class="opt-label">${o.label}</span>${o.text}
          </button>
        `).join("")}
      </div>
      <div class="completion-feedback" id="completion-fb" hidden></div>
    </div>
  `;

  const fb = body.querySelector("#completion-fb");
  body.querySelectorAll(".completion-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const opt = options[idx];
      body.querySelectorAll(".completion-option").forEach(b => {
        b.classList.remove("is-correct", "is-incorrect");
        b.setAttribute("aria-checked", "false");
      });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.result === "correct" ? "is-correct" : "is-incorrect");
      fb.hidden = false;
      fb.textContent = opt.rationale;
      state.completionAnswer = opt.result;
      if (opt.result === "correct") {
        state.api.eventLog.record("completion_problem_completed");
        state.timeline.push({
          label: "Picked the correct two-slot close",
          detail: "Option B · L.D. pattern · GC-03",
          ts: timestamp(),
        });
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
    <p><strong>Live mini-OS.</strong> Lead: <strong>${emma.name}</strong>
    (${emma.archetype_label}). She's warmed by your previous touch.</p>
    <p>The <em>Dial</em> button in Outreach is <strong>disabled</strong>
    until you open the <strong>Calendar app</strong>. That's the habit. It
    enables the moment Calendar opens.</p>
    <p>Then: dial → pick two slots → speak them → send the invite. Watch
    the Salesforce <code>Next_Step_Booked__c</code> flag flip while the
    call is still live.</p>
    <p id="solo-status" class="retention-note" aria-live="polite">
      Status: Calendar closed · Dial disabled
    </p>
  `;

  const { api } = state;
  api.os.openApp("outreach",      { highlightLeadId: emma.id, dialDisabled: true });
  api.os.openApp("phone-dialler");
  api.os.openApp("salesforce",    { accountId: emma.id });

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
  body.innerHTML = `
    <p>Here's what your event log captured during the solo. This is what
    your manager will see in Gong + Salesforce on Friday's call review.</p>
    <ol class="event-timeline" aria-label="Event log timeline">
      ${state.timeline.map(e => `
        <li class="event-timeline__item" data-state="${e.state || 'ok'}">
          <span class="event-timeline__dot" aria-hidden="true"></span>
          <span>
            <span class="event-timeline__label">${e.label}</span>
            <span class="event-timeline__detail">${e.detail}</span>
          </span>
          <span class="event-timeline__ts">${e.ts}</span>
        </li>
      `).join("")}
    </ol>
    <blockquote class="peer-quote" style="margin-top:14px">
      I have my calendar open in a second tab the entire time.
      <cite>— M.G., Manchester</cite>
    </blockquote>
  `;
}

// ===========================================================================
// Step 8 · Quiz (9:00–9:30) · 3 items
// ===========================================================================

function stepQuiz(body) {
  state.quizIndex = 0;
  state.quizScore = 0;
  renderQuizItem(body);
}

function renderQuizItem(body) {
  const item = state.quizItems[state.quizIndex];
  body.innerHTML = `
    <div class="quiz">
      <div class="quiz__progress">Question ${state.quizIndex + 1} of ${state.quizItems.length} · ${item.lo}</div>
      <p class="quiz__stem">${item.stem}</p>
      <div role="radiogroup" aria-label="Answer choices">
        ${item.options.map((o, i) => `
          <button type="button"
                  class="completion-option"
                  role="radio"
                  aria-checked="false"
                  data-idx="${i}">
            <span class="opt-label">${o.label}</span>${o.text}
          </button>
        `).join("")}
      </div>
      <div class="completion-feedback" id="quiz-fb" hidden></div>
      <div style="margin-top:12px;text-align:right">
        <button type="button" class="btn btn--primary" id="quiz-next" disabled>
          ${state.quizIndex === state.quizItems.length - 1 ? "Finish quiz" : "Next question"}
        </button>
      </div>
    </div>
  `;

  const fb      = body.querySelector("#quiz-fb");
  const nextBtn = body.querySelector("#quiz-next");

  body.querySelectorAll(".completion-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const opt = item.options[idx];
      body.querySelectorAll(".completion-option").forEach(b => {
        b.classList.remove("is-correct", "is-incorrect");
        b.setAttribute("aria-checked", "false");
        b.disabled = true;
      });
      btn.setAttribute("aria-checked", "true");
      btn.classList.add(opt.correct ? "is-correct" : "is-incorrect");
      fb.hidden = false;
      fb.textContent = opt.rationale;
      if (opt.correct) state.quizScore += 1;
      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener("click", () => {
    if (state.quizIndex < state.quizItems.length - 1) {
      state.quizIndex += 1;
      renderQuizItem(body);
    } else {
      runStep(state.step + 1);
    }
  });
}

// ===========================================================================
// Step 9 · Key takeaway + +7d retrieval (9:30–10:00)
// ===========================================================================

function stepTakeaway(body) {
  const scorePct = Math.round((state.quizScore / state.quizItems.length) * 100);
  body.innerHTML = `
    <blockquote class="takeaway">
      Calendar in second tab. Two slots. One invite. Sent before you hang
      up. "Follow up" is the failure mode — make it impossible by sending
      live.
      <cite>— M.G., Manchester pod</cite>
    </blockquote>
    <p class="retention-note">
      📅 A 3-item retrieval drop is scheduled for <strong>+7 days</strong>
      in your Sana inbox.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      Quiz score: <strong>${state.quizScore} / ${state.quizItems.length}</strong>
      (${scorePct}%) · L1 pulse fires when you click Finish.
    </p>
  `;
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
