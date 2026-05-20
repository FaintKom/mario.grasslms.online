/**
 * Module 1 · M1 Diagnostic Opener · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * Same architecture as M3 — bootModule + task-banner + welcome/summary cards +
 * 9-step Gagné timeline + window autoarrange. Content swapped for the M1
 * keystone move: one specific question off the LinkedIn / CH profile + 5-sec
 * silence after.
 *
 * Storyboard:  02-design/module-storyboards/M1-diagnostic-opener.md
 * Outcomes:    LO-M1.1 (diagnostic-pulled-from-signal) + LO-M1.3 (silence ≥ 4s)
 * Voice:       peer-to-peer (brief §18.2)
 */

import { bootModule, eventBus } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";

function closeAppsByName(appIds) {
  if (!state.api?.os?.listWindows) return;
  const set = new Set(appIds);
  for (const w of state.api.os.listWindows()) {
    if (set.has(w.appId)) state.api.os.closeApp(w);
  }
}
function keepOnly(appIds) {
  if (!state.api?.os?.listWindows) return;
  const keep = new Set(appIds);
  for (const w of state.api.os.listWindows()) {
    if (!keep.has(w.appId)) state.api.os.closeApp(w);
  }
}

const state = {
  api: null,
  step: 0,
  startedAt: 0,
  signalRead: false,
  diagnosticSent: false,
  silenceObserved: false,
  completionAnswer: null,
  quizIndex: 0,
  quizScore: 0,
  transcripts: [],
  prospects: [],
  quizItems: [],
  timeline: [],
};

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

async function start() {
  try { await loadAllData(); }
  catch (err) {
    console.error("[M1] Failed to load module data", err);
    renderFatal(err.message);
    return;
  }
  bootModule({
    moduleId: "M1",
    title: "Module 1 · Diagnostic Opener",
    appsToLaunch: [],
    onReady(api) {
      state.api = api;
      state.startedAt = Date.now();
      wireProgressTimer();
      wireHelpButton();
      wireNarrativeButtons();
      showWelcomeCard(() => runStep(0));
    },
  });
}
start();

const STEPS = [
  { title: "A bottom-quartile rep just launched a pitch in 6 seconds",  handler: stepGainAttention },
  { title: "By the end · one sharp question, then silence",             handler: stepStateOutcome },
  { title: "M1 opens it. M2 saves it. M3 books it.",                    handler: stepRecallPrior },
  { title: "Watch · M.G. opens Maria off a CH filing",                  handler: stepWorkedExample },
  { title: "Your turn · pick the diagnostic for Tom",                   handler: stepCompletionProblem },
  { title: "Solo · open Emma cold. Signal first, question second.",     handler: stepSoloProblem },
  { title: "Your event log · what just happened",                       handler: stepFeedback },
  { title: "Quick check · 3 questions",                                 handler: stepQuiz },
  { title: "Key takeaway + your next retrieval drop",                   handler: stepTakeaway },
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
      <div class="welcome-card__kicker">Module 1 &middot; keystone opener</div>
      <h2 class="welcome-card__title" id="welcome-title">Diagnostic Opener</h2>
      <div class="welcome-card__meta">10 min &middot; 9 steps &middot; in-app practice</div>
      <p class="welcome-card__lede">
        Open every cold call with one specific question pulled off the buyer's
        LinkedIn or Companies House profile. Then five seconds of silence —
        that's where the signal lives.
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
  const tick = () => {
    const ms = Date.now() - state.startedAt;
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    el.textContent = `${m}:${s} / 10:00`;
  };
  tick(); setInterval(tick, 1000);
}

// --- Step 1 -----------------------------------------------------------------

function stepGainAttention(body) {
  body.innerHTML = `
    <blockquote class="peer-quote">
      First 6 seconds: pitch. Next 4 seconds: dial tone. Every time.
      <cite>— J.T., pod lead · reviewing P.B.'s call log</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      A bottom-quartile rep just launched into a pitch in 6 seconds. Maria
      hung up. Today you'll learn the move top reps share.
    </p>
  `;
  state.api.os.openApp("outreach", { highlightLeadId: "L-MARIA" });
  setTimeout(() => decorateOutreachForStep1(), 140);
}

function decorateOutreachForStep1() {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  // UX 2026-05-20: Continue disabled until task complete
  const nextBtn = document.getElementById("narrative-next");
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.setAttribute("aria-disabled", "true");
    nextBtn.textContent = "🔒 Click Maria to continue";
  }
  let tries = 0;
  const tick = () => {
    const allLeads = [...outreachBody.querySelectorAll(".lead-row")];
    const mariaRow = allLeads.find(r => /Maria/i.test(r.textContent || ""));
    if (!mariaRow) {
      if (++tries < 20) return setTimeout(tick, 100);
      return;
    }
    // UX 2026-05-20: mark active/inactive for CSS dim
    allLeads.forEach(row => {
      row.dataset.taskTarget = row === mariaRow ? "active" : "inactive";
    });
    if (mariaRow.dataset.m1Done === "true") return;
    mariaRow.classList.add("is-warm-highlight");
    mariaRow.dataset.m1Done = "true";
    mariaRow.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]')) return;
      if (state.step !== 0) return;
      state.api.eventLog?.record?.("step1_picked_warm_lead");
      // Unlock Continue + auto-advance + clear task-target dim
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.setAttribute("aria-disabled", "false");
        nextBtn.textContent = "Continue →";
      }
      allLeads.forEach(row => { delete row.dataset.taskTarget; });
      setTimeout(() => runStep(1), 450);
    });
  };
  tick();
}

// --- Step 2 -----------------------------------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">By the end of these 10 min:</p>
    <ul style="font-size:13.5px;margin:6px 0 10px 18px;">
      <li><strong>One specific question</strong> off the buyer's LinkedIn / CH
          profile in the first 60 seconds.</li>
      <li><strong>Five seconds of silence</strong> after — that's where the
          deal happens.</li>
    </ul>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Next action: open the LinkedIn / Companies House app to find Maria's
      signal.
    </p>
  `;
  state.api.os.openApp("linkedin-ch", { lookupId: "maria" });
  setTimeout(() => {
    const lchBody = document.querySelector(".os-window.app--linkedin-ch .os-window-body");
    if (!lchBody) return;
    mountTaskBanner(lchBody, {
      id: "m1-s2-read-signal",
      label: "Read the Companies House filing card — find Maria's signal",
      hint: "Click the green chip below to confirm",
      state: "active",
    });
    if (!lchBody.querySelector("[data-m1-s2-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">
          Signal: Maria opened a 2nd location in the last 6 months (CH filing).
        </span>
        <button type="button" data-m1-s2-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Got the signal
        </button>
      `;
      lchBody.appendChild(bar);
      bar.querySelector("[data-m1-s2-done]").addEventListener("click", () => {
        if (state.step !== 1) return;
        state.signalRead = true;
        markTaskBannerDone("m1-s2-read-signal");
        state.api.eventLog?.record?.("step2_signal_read");
        setTimeout(() => runStep(2), 450);
      });
    }
  }, 200);
}

// --- Step 3 -----------------------------------------------------------------

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Quick recall — three keystone moves:</p>
    <ol style="font-size:13.5px; margin:6px 0 8px 18px;">
      <li><strong>M1 · Diagnostic.</strong> ← <em>this module.</em></li>
      <li><strong>M2 · Acknowledge.</strong> Restate the objection in their words.</li>
      <li><strong>M3 · Close.</strong> Two slots, one invite, during the call.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Next action: open the Phone-dialler — you'll dial after the worked example.
    </p>
  `;
  setTimeout(() => {
    const lchBody = document.querySelector(".os-window.app--linkedin-ch .os-window-body");
    if (lchBody) {
      mountTaskBanner(lchBody, {
        id: "m1-s3-open-phone",
        label: "Open the Phone-dialler — prep for the worked-example call",
        hint: "Use the button below or the taskbar",
        state: "active",
      });
      if (!lchBody.querySelector("[data-m1-s3-open-phone]")) {
        const bar = document.createElement("div");
        bar.style.cssText = "margin-top:10px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
        bar.innerHTML = `
          <span style="font-size:12.5px;color:var(--ftc-ink-2);">
            You'll need the dialler open with the silence-counter visible.
          </span>
          <button type="button" data-m1-s3-open-phone
                  style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
            📞 Open Phone-dialler
          </button>
        `;
        lchBody.appendChild(bar);
        bar.querySelector("[data-m1-s3-open-phone]").addEventListener("click", () => {
          state.api.os.openApp("phone-dialler");
        });
      }
    }
    const onAppOpened = (ev) => {
      if (ev.detail?.appId !== "phone-dialler") return;
      if (state.step !== 2) return;
      state.api.eventBus.removeEventListener("app:opened", onAppOpened);
      markTaskBannerDone("m1-s3-open-phone");
      state.api.eventLog?.record?.("step3_phone_opened");
      setTimeout(() => runStep(3), 500);
    };
    state.api.eventBus.addEventListener("app:opened", onAppOpened);
  }, 140);
}

// --- Step 4 -----------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      Watch <strong>M.G.</strong> open <strong>Maria</strong> with the
      Companies House filing question. Then wait for the silence.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Find the <strong>[M1]</strong> chip in the transcript. Click it to mark
      this watched.
    </p>
  `;
  state.api.os.openApp("gong", {
    transcripts: state.transcripts,
    activeTranscriptId: state.transcripts[0]?.id ?? "GC-01",
  });
  setTimeout(() => {
    const gongBody = document.querySelector(".os-window.app--gong .os-window-body");
    if (!gongBody) return;
    mountTaskBanner(gongBody, {
      id: "m1-s4-watch",
      label: "Watch M.G.'s opener — find the M1 [Diagnostic] chip",
      hint: "Click any M1 chip OR the 'Watched it' button below",
      state: "active",
    });
    if (!gongBody.querySelector("[data-m1-s4-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">
          M.G. asks one specific question off the CH filing. Then waits.
        </span>
        <button type="button" data-m1-s4-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Watched it
        </button>
      `;
      gongBody.appendChild(bar);
      const complete = () => {
        if (state.step !== 3) return;
        markTaskBannerDone("m1-s4-watch");
        state.api.eventLog?.record?.("step4_worked_example_completed");
        state.timeline.push({
          label: "Watched M.G.'s opener",
          detail: "GC-01 · CH-filing diagnostic + silence",
          ts: timestamp(),
        });
        setTimeout(() => runStep(4), 450);
      };
      bar.querySelector("[data-m1-s4-done]").addEventListener("click", complete);
      gongBody.addEventListener("click", e => {
        if (e.target.closest?.('.m-chip[data-move="M1"]')) complete();
      });
    }
  }, 200);
}

// --- Step 5 -----------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Tom</strong> (Series-B SaaS · 22 FTE) is your next dial. His
      LinkedIn shows: <em>"We just raised €4M Series-A — hiring head of ops +
      6 engineers next quarter."</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Pick the diagnostic in the Outreach drawer that just opened under his row.
    </p>
  `;
  const options = [
    { label: "A", result: "anti",
      text: `"Hi Tom — do you have a moment to talk about your corporate spending?"`,
      rationale: "P.B. anti-pattern. No signal, generic, dies in 6 seconds." },
    { label: "B", result: "correct",
      text: `"Tom — saw your Series-A close. Who's approving the new hires' card spend before they ramp?"`,
      rationale: "Yes. Specific signal (Series-A) + specific operational pain (new hires' spend). M.G.'s GC-01 pattern." },
    { label: "C", result: "partial",
      text: `"Congrats on the raise! How's it going?"`,
      rationale: "Acknowledges the signal but doesn't open an operational question. Buyer answers 'good' and the call dies." },
    { label: "D", result: "anti",
      text: `"FinTechCard helps fast-growing SaaS like yours control spend — interested?"`,
      rationale: "Pitch-launch. Same failure as opening with a feature list." },
  ];
  setTimeout(() => mountTomDrawer(options), 160);
}

function mountTomDrawer(options) {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  mountTaskBanner(outreachBody, {
    id: "m1-s5-pick-diag",
    label: "Pick Tom's diagnostic — drawer just opened under his row",
    hint: "Wrong picks explain why + reveal the correct option",
    state: "active",
  });
  const tomRow = [...outreachBody.querySelectorAll(".lead-row")].find(r => /Tom/i.test(r.textContent || ""));
  if (!tomRow) return;
  tomRow.classList.add("is-warm-highlight");
  outreachBody.querySelector("[data-m1-s5-drawer]")?.remove();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m1-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Tom · cold call · 00:00</strong>
      <span class="tom-drawer__cue">Pick your diagnostic</span>
    </header>
    <p class="tom-drawer__stem">
      Signal: <em>"Series-A €4M · hiring 6 engineers + ops head next quarter."</em>
    </p>
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
  const fb = drawer.querySelector("#m1-s5-fb");
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
      if (opt.result !== "correct") {
        drawer.querySelector('.tom-drawer__opt[data-result="correct"]')?.classList.add("is-reveal");
      }
      fb.hidden = false;
      fb.textContent = opt.rationale;
      state.completionAnswer = opt.result;
      if (opt.result === "correct") {
        markTaskBannerDone("m1-s5-pick-diag");
        state.api.eventLog?.record?.("completion_problem_completed");
        state.timeline.push({
          label: "Picked the correct diagnostic for Tom",
          detail: "Option B · signal-anchored operational question",
          ts: timestamp(),
        });
        setTimeout(() => runStep(5), 700);
      }
    });
  });
}

// --- Step 6 -----------------------------------------------------------------

function stepSoloProblem(body) {
  const emma = state.prospects.find(p => /emma/i.test(p.name)) ?? state.prospects[0];
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Solo.</strong> ${emma.name} (${emma.industry}) — cold lead.
      Read the signal, write your diagnostic, dial, hold the silence.
    </p>
    <p id="solo-status" class="retention-note" aria-live="polite">
      Status: signal not read · dial disabled
    </p>
  `;
  state.api.os.openApp("linkedin-ch", { lookupId: "emma" });
  setTimeout(() => decorateSoloFlow(emma), 200);
}

function decorateSoloFlow(emma) {
  const lchBody = document.querySelector(".os-window.app--linkedin-ch .os-window-body");
  if (!lchBody) return;
  mountTaskBanner(lchBody, {
    id: "m1-s6-solo",
    label: `Open ${emma.name}'s profile, write your diagnostic, dial + hold silence`,
    hint: "All three gates fire on the rep's actions",
    state: "active",
  });
  if (lchBody.querySelector("[data-m1-s6-stage]")) return;
  const stageWrap = document.createElement("div");
  stageWrap.setAttribute("data-m1-s6-stage", "");
  stageWrap.style.cssText = "margin-top:14px; padding:14px; background:#fff; border:1px solid var(--ftc-border); border-radius:8px;";
  stageWrap.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px; padding:10px 12px; background:var(--ftc-green-tint); border-left:3px solid var(--brand-green); border-radius:6px;">
      <span style="font-family:var(--ftc-font-mono); font-size:11px; color:var(--brand-green-deep); text-transform:uppercase; letter-spacing:0.06em;">Signal</span>
      <span style="font-size:13px; color:var(--ftc-ink);">${escapeHtml(emma.signals?.[0]?.content ?? "Headcount up 18% YoY")}</span>
    </div>
    <label style="display:block; font-size:12.5px; color:var(--ftc-ink-2); margin-bottom:4px;">
      Your diagnostic question (1 sentence):
    </label>
    <textarea data-m1-diag rows="2"
      placeholder="e.g. Who's approving supplier card spend across all 3 shifts now?"
      style="width:100%; padding:8px; border:1px solid var(--ftc-border); border-radius:4px; font-family:var(--ftc-font-sans); font-size:13px; resize:vertical;"></textarea>
    <div style="display:flex; gap:8px; margin-top:10px; align-items:center;">
      <button type="button" data-m1-dial
              style="background:#ccc; color:#666; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:not-allowed;" disabled>
        📞 Dial ${emma.name}
      </button>
      <span data-m1-status style="font-size:12px; color:var(--ftc-ink-2);">
        Type at least 30 characters to enable Dial.
      </span>
    </div>
  `;
  lchBody.appendChild(stageWrap);

  const ta = stageWrap.querySelector("[data-m1-diag]");
  const dial = stageWrap.querySelector("[data-m1-dial]");
  const status = stageWrap.querySelector("[data-m1-status]");
  ta.addEventListener("input", () => {
    const ok = ta.value.trim().length >= 30;
    dial.disabled = !ok;
    dial.style.background = ok ? "var(--brand-green)" : "#ccc";
    dial.style.color = ok ? "#fff" : "#666";
    dial.style.cursor = ok ? "pointer" : "not-allowed";
    status.textContent = ok ? "Ready to dial." : `Type at least 30 characters (${ta.value.trim().length}).`;
  });
  dial.addEventListener("click", () => {
    if (dial.disabled) return;
    state.diagnosticSent = true;
    state.api.os.openApp("phone-dialler", { prospect: { name: emma.name, company: emma.company, archetype: emma.archetype } });
    state.timeline.push({
      label: `Dialled ${emma.name} with diagnostic written`,
      detail: ta.value.trim().slice(0, 80),
      ts: timestamp(),
    });
    setTimeout(() => triggerSilenceGate(emma), 600);
  });
}

function triggerSilenceGate(emma) {
  const phoneBody = document.querySelector(".os-window.app--phone-dialler .os-window-body");
  if (!phoneBody) return;
  mountTaskBanner(phoneBody, {
    id: "m1-s6-silence",
    label: "After the dial connects, hold 5 seconds of silence",
    hint: "Click 'Silence held' once you've waited",
    state: "active",
  });
  const watch = setInterval(() => {
    const dialler = document.querySelector(".os-window.app--phone-dialler .dialler");
    if (dialler?.dataset.phase === "on-call" && !phoneBody.querySelector("[data-m1-silence]")) {
      clearInterval(watch);
      mountSilenceButton(phoneBody, emma);
    }
  }, 200);
  setTimeout(() => clearInterval(watch), 8000);
}

function mountSilenceButton(phoneBody, emma) {
  const bar = document.createElement("div");
  bar.style.cssText = "margin:10px; padding:10px 14px; background:rgba(245,184,0,0.95); color:#1a1a1a; border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
  bar.innerHTML = `
    <span style="font-size:12px; font-family:var(--ftc-font-mono);">
      Hold the silence · 5s after the buyer's answer.
    </span>
    <button type="button" data-m1-silence
            style="background:#0a8754; color:#fff; padding:6px 12px; border:0; border-radius:4px; font-size:12px; font-weight:600; cursor:pointer;">
      ✓ Silence held
    </button>
  `;
  phoneBody.querySelector(".dialler")?.appendChild(bar);
  bar.querySelector("[data-m1-silence]").addEventListener("click", () => {
    if (state.step !== 5) return;
    state.silenceObserved = true;
    markTaskBannerDone("m1-s6-silence");
    state.api.eventLog?.record?.("solo_problem_completed");
    state.timeline.push({
      label: `Silence held with ${emma.name}`,
      detail: "5s after diagnostic · LO-M1.3 evidenced",
      ts: timestamp(),
    });
    setTimeout(() => runStep(6), 600);
  });
}

// --- Step 7 -----------------------------------------------------------------

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>J.T.</strong> just DM'd you with the review of your solo opener.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Read it, then mark as read to continue.
    </p>
  `;
  const dmMessages = [
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:48",
      body: "Watched your opener. Solid notes 👇" },
    ...state.timeline.map(e => ({
      author: "J.T. (pod lead)", initials: "JT", ts: e.ts,
      body: `✅ ${e.label} — ${e.detail}`,
    })),
    { author: "J.T. (pod lead)", initials: "JT", ts: "12:52",
      body: "The 5s silence is the part bottom-quartile reps blow. You held it. Keep it." },
    { author: "M.G. (peer)", initials: "MG", ts: "12:54",
      body: "First-call mute is hard. One diagnostic in muscle memory — repeat it for 10 cold calls. Then swap." },
  ];
  state.api.os.openApp("slack", {
    channel: {
      channel_id: "dm-jt-podlead",
      pinned_messages: [
        { title: "3-move card", content_md: "M1 diagnostic · M2 acknowledge · M3 calendar close", related_module: "M1" },
      ],
      messages: dmMessages,
    },
  });
  setTimeout(() => {
    const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
    if (!slackBody) return;
    mountTaskBanner(slackBody, {
      id: "m1-s7-read-dm",
      label: "Read J.T.'s feedback DM",
      hint: "'Mark thread read' below to continue",
      state: "active",
    });
    if (!slackBody.querySelector("[data-m1-s7-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin:14px 0 0; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">J.T. waits for the read receipt.</span>
        <button type="button" data-m1-s7-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Mark thread read
        </button>
      `;
      slackBody.appendChild(bar);
      bar.querySelector("[data-m1-s7-done]").addEventListener("click", () => {
        markTaskBannerDone("m1-s7-read-dm");
        state.api.eventLog?.record?.("step7_feedback_read");
        setTimeout(() => runStep(state.step + 1), 500);
      });
    }
  }, 200);
}

// --- Step 8 -----------------------------------------------------------------

function stepQuiz(body) {
  state.quizIndex = 0;
  state.quizScore = 0;
  body.innerHTML = `
    <p style="font-size:14px;"><strong>Quick check</strong> · 3 questions from J.T.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Two of three correct advances the module.</p>
  `;
  setTimeout(() => mountQuizInSlack(), 200);
}

function mountQuizInSlack() {
  const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
  if (!slackBody) {
    state.api.os.openApp("slack");
    return setTimeout(mountQuizInSlack, 250);
  }
  mountTaskBanner(slackBody, {
    id: "m1-s8-quiz",
    label: "Answer the 3 quiz questions J.T. just posted",
    hint: "Wrong picks reveal the correct answer",
    state: "active",
  });
  let thread = slackBody.querySelector("[data-m1-quiz-thread]");
  thread?.remove();
  thread = document.createElement("div");
  thread.setAttribute("data-m1-quiz-thread", "");
  thread.style.cssText = "margin:14px 0 0; padding:14px 16px; background:#fff8e0; border-left:3px solid var(--sun-500, #f5b800); border-radius:6px; font-family:var(--ftc-font-sans);";
  thread.innerHTML = `
    <div style="font-family:var(--ftc-font-mono); font-size:11px; color:var(--ftc-ink-2); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">
      J.T. · 12:55 · quick check thread
    </div>
    <div data-quiz-host></div>
  `;
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
        <button type="button" class="tom-drawer__opt" role="radio"
                aria-checked="false" data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${o.text}</span>
        </button>`).join("")}
    </div>
    <div class="tom-drawer__fb" id="m1-s8-fb" hidden></div>
    <div style="margin-top:10px; text-align:right;">
      <button type="button" id="m1-s8-next" disabled
              style="background:var(--brand-green); color:#fff; padding:6px 14px; border:0; border-radius:4px; font-size:12px; font-weight:600; cursor:pointer; opacity:0.5;">
        ${state.quizIndex === state.quizItems.length - 1 ? "Finish quiz" : "Next question"}
      </button>
    </div>
  `;
  const fb = host.querySelector("#m1-s8-fb");
  const nextBtn = host.querySelector("#m1-s8-next");
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
      if (!opt.correct) {
        host.querySelectorAll(".tom-drawer__opt").forEach((b, j) => {
          if (item.options[j]?.correct) b.classList.add("is-reveal");
        });
      }
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
      markTaskBannerDone("m1-s8-quiz");
      state.api.eventLog?.record?.("step8_quiz_completed", { score: state.quizScore });
      setTimeout(() => runStep(state.step + 1), 500);
    }
  });
}

// --- Step 9 -----------------------------------------------------------------

function stepTakeaway(body) {
  const scorePct = Math.round((state.quizScore / state.quizItems.length) * 100);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Module complete.</strong> M.G. pinned the takeaway in your Slack channel.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Quiz: <strong>${state.quizScore} / ${state.quizItems.length}</strong> (${scorePct}%).
      Click 'Set +7d retrieval drop' in Slack to finish.
    </p>
  `;
  setTimeout(() => {
    const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
    if (!slackBody) {
      state.api.os.openApp("slack");
      return setTimeout(() => stepTakeaway(body), 250);
    }
    slackBody.querySelector("[data-m1-quiz-thread]")?.remove();
    mountTaskBanner(slackBody, {
      id: "m1-s9-takeaway",
      label: "Read M.G.'s pinned takeaway, then set the +7d retrieval drop",
      hint: "One click. Module commits when the drop is scheduled.",
      state: "active",
    });
    if (!slackBody.querySelector("[data-m1-pinned]")) {
      const pinned = document.createElement("div");
      pinned.setAttribute("data-m1-pinned", "");
      pinned.style.cssText = "margin:14px 0 0; padding:16px 18px; background:linear-gradient(180deg, var(--ftc-green-tint, #ecf9e7) 0%, #ffffff 100%); border:1px solid var(--brand-green); border-left:4px solid var(--brand-green); border-radius:8px; font-family:var(--ftc-font-sans); box-shadow:0 6px 16px -8px rgba(10,26,16,0.12);";
      pinned.innerHTML = `
        <div style="font-family:var(--ftc-font-mono); font-size:10px; color:var(--brand-green); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">
          📌 Pinned by M.G. (peer · Manchester pod)
        </div>
        <p style="font-size:15px; font-style:italic; line-height:1.55; color:var(--ftc-ink); margin:0 0 10px;">
          "One specific question pulled off their LinkedIn or Companies House
          profile. Then five seconds of silence. The pitch can come later —
          the silence is where the deal happens."
        </p>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px; padding-top:12px; border-top:1px solid var(--ftc-border);">
          <span style="font-size:12.5px; color:var(--ftc-ink-2);">
            📅 3-item retrieval drop · +7 days in your Sana inbox
          </span>
          <button type="button" data-m1-s9-finish
                  style="background:var(--brand-green); color:#fff; padding:9px 16px; border:0; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
            Set +7d retrieval drop &rarr;
          </button>
        </div>
      `;
      const messages = slackBody.querySelector(".slack-msgs, .slack-messages, .slack-main") || slackBody;
      messages.appendChild(pinned);
      pinned.querySelector("[data-m1-s9-finish]").addEventListener("click", () => {
        markTaskBannerDone("m1-s9-takeaway");
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
    <p>See you in Module 2 — Objection Acknowledge.</p>
  `;
  document.getElementById("narrative-next").hidden = true;
  document.getElementById("narrative-back").hidden = true;
  showSummaryCard(scorePct);
}

function showSummaryCard(scorePct) {
  keepOnly([]);
  const overlay = document.getElementById("narrative-overlay");
  if (overlay) overlay.style.visibility = "hidden";
  const totalMs = Date.now() - state.startedAt;
  const totalMin = Math.floor(totalMs / 60000);
  const totalSec = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, "0");
  const stepLabels = STEPS.map(s => s.title);
  const recapEntries = stepLabels.map((label, i) => {
    const fromLog = state.timeline.find(e => e.label?.toLowerCase().includes(label.toLowerCase().slice(0, 14)));
    return { n: i + 1, label, ts: fromLog?.ts || "—" };
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
      <h2 class="summary-card__title" id="summary-title">Diagnostic Opener · cleared</h2>
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
        <a class="summary-card__btn summary-card__btn--ghost" href="../../">&larr; Back to engagement</a>
        <button type="button" class="summary-card__btn summary-card__btn--primary" data-action="restart">
          Restart module
        </button>
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
  if (body) {
    body.innerHTML = `<p style="color:var(--coral-700);">Could not load module data: ${escapeHtml(msg)}</p>`;
  }
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[<>&]/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c]));
}
