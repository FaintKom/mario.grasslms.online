/**
 * Module 2 · M2 Objection Acknowledge · runtime (in-app driven)
 * ---------------------------------------------------------------------------
 * Same architecture as M1/M3 — bootModule + task-banner + welcome/summary
 * cards + 9-step Gagné timeline + window autoarrange. Content swapped for M2:
 * restate the buyer's objection in their own words (≥2 token overlap) before
 * any rebuttal.
 *
 * Storyboard:  02-design/module-storyboards/M2-objection-acknowledge.md
 * Outcomes:    LO-M2.1 (classify ≤3s) · LO-M2.2 (restate ≥2 token overlap) · LO-M2.3 (open follow-up)
 * Voice:       peer-to-peer (brief §18.2)
 */

import { bootModule, eventBus } from "../scorm-shell/js/shell.js";
import { mountTaskBanner, markTaskBannerDone } from "../scorm-shell/js/task-banner.js";
import { normalizeQuiz } from "../scorm-shell/js/quiz-normalize.js";

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
  objectionRead: false,
  restateOk: false,
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
  state.quizItems   = normalizeQuiz(quizItems);
}

async function start() {
  try { await loadAllData(); }
  catch (err) {
    console.error("[M2] Failed to load module data", err);
    renderFatal(err.message);
    return;
  }
  bootModule({
    moduleId: "M2",
    title: "Module 2 · Objection Acknowledge",
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
  { title: "A rep argued with an objection, and the buyer hung up",     handler: stepGainAttention },
  { title: "What you'll do: restate before you respond, then wait",     handler: stepStateOutcome },
  { title: "The three moves on every call",                             handler: stepRecallPrior },
  { title: "Watch L.D. acknowledge Tom's Brex objection",               handler: stepWorkedExample },
  { title: "Your turn: pick how to acknowledge Sven",                   handler: stepCompletionProblem },
  { title: "On your own: acknowledge Tom's 'We use Brex' before you pitch", handler: stepSoloProblem },
  { title: "J.T.'s review of your restate",                             handler: stepFeedback },
  { title: "Quick check: 3 questions",                                  handler: stepQuiz },
  { title: "Takeaway and a 7-day refresher",                            handler: stepTakeaway },
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
      <div class="welcome-card__kicker">Module 2 &middot; save the call</div>
      <h2 class="welcome-card__title" id="welcome-title">Objection Acknowledge</h2>
      <div class="welcome-card__meta">10 min &middot; 9 steps &middot; in-app practice</div>
      <p class="welcome-card__lede">
        When the buyer pushes back, restate the objection in their own words
        before you respond, reusing at least two of the words they used. Then
        wait. Their answer points you to the open follow-up question.
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
    const highlight = state.step === 2 ? "pre-training" : "M2";
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
      Buyer: "Too expensive." Rep: "Let me explain the value." Buyer: "Bye."
      <cite>Gong sample, a 14-second call</cite>
    </blockquote>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:10px">
      Bottom-quartile reps argue with objections, while top reps restate them.
      The buyer has to hear that you listened before any rebuttal can land.
    </p>
  `;
  state.api.os.openApp("outreach", { highlightLeadId: "L-002" });
  setTimeout(() => decorateOutreachForStep1(), 140);
}

function decorateOutreachForStep1() {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  mountTaskBanner(outreachBody, {
    id: "m2-s1-pick-tom",
    label: "Click Tom (Series-B SaaS). You'll hear his objection in step 4.",
    hint: "The Gong example follows",
    state: "active",
  });
  let tries = 0;
  const tick = () => {
    const tomRow = [...outreachBody.querySelectorAll(".lead-row")].find(r => /Tom/i.test(r.textContent || ""));
    if (!tomRow) {
      if (++tries < 20) return setTimeout(tick, 100);
      return;
    }
    if (tomRow.dataset.m2Done === "true") return;
    tomRow.classList.add("is-warm-highlight");
    tomRow.dataset.m2Done = "true";
    tomRow.addEventListener("click", e => {
      if (e.target.closest('[data-action="dial"]')) return;
      if (state.step !== 0) return;
      markTaskBannerDone("m2-s1-pick-tom");
      state.api.eventLog?.record?.("step1_picked_tom");
      setTimeout(() => runStep(1), 450);
    });
  };
  tick();
}

// --- Step 2 -----------------------------------------------------------------

function stepStateOutcome(body) {
  body.innerHTML = `
    <p style="font-size:14px;">In the next 10 minutes you'll practise two things:</p>
    <ul style="font-size:13.5px;margin:6px 0 10px 18px;">
      <li><strong>Restate</strong> the buyer's objection in their own words,
          reusing at least two of them, before any rebuttal.</li>
      <li><strong>Then wait</strong> and ask the open follow-up their answer points to.</li>
    </ul>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Next: confirm you know Tom's top objection.
    </p>
  `;
  setTimeout(() => {
    const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
    if (!outreachBody) return;
    mountTaskBanner(outreachBody, {
      id: "m2-s2-confirm",
      label: "Confirm: Tom's top objection is 'We already use Brex.'",
      hint: "Click Got it below to confirm",
      state: "active",
    });
    if (!outreachBody.querySelector("[data-m2-s2-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">
          Top objection: <em>"We already use Brex."</em> (from Tom's CRM notes)
        </span>
        <button type="button" data-m2-s2-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Got it
        </button>
      `;
      outreachBody.appendChild(bar);
      bar.querySelector("[data-m2-s2-done]").addEventListener("click", () => {
        if (state.step !== 1) return;
        state.objectionRead = true;
        markTaskBannerDone("m2-s2-confirm");
        state.api.eventLog?.record?.("step2_objection_confirmed");
        setTimeout(() => runStep(2), 450);
      });
    }
  }, 200);
}

// --- Step 3 -----------------------------------------------------------------

function stepRecallPrior(body) {
  body.innerHTML = `
    <p style="font-size:14px;">Quick recall: the three moves on every call.</p>
    <ol style="font-size:13.5px; margin:6px 0 8px 18px;">
      <li><strong>M1 · Diagnostic.</strong> One sharp question off the profile.</li>
      <li><strong>M2 · Acknowledge.</strong> Restate the objection in the buyer's words. <em>This module.</em></li>
      <li><strong>M3 · Close.</strong> Two slots, one invite, during the call.</li>
    </ol>
    <p style="font-size:13px;color:var(--ftc-ink-2);margin-top:8px">
      Next: watch L.D.'s worked example in Gong.
    </p>
  `;
  setTimeout(() => {
    const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
    if (outreachBody) {
      mountTaskBanner(outreachBody, {
        id: "m2-s3-open-gong",
        label: "Open Gong to watch L.D. acknowledge Tom's objection",
        hint: "Use the button below",
        state: "active",
      });
      if (!outreachBody.querySelector("[data-m2-s3-open-gong]")) {
        const bar = document.createElement("div");
        bar.style.cssText = "margin-top:10px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
        bar.innerHTML = `
          <span style="font-size:12.5px;color:var(--ftc-ink-2);">
            Look for the M2 chip on the line where L.D. restates.
          </span>
          <button type="button" data-m2-s3-open-gong
                  style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
            🎙 Open Gong
          </button>
        `;
        outreachBody.appendChild(bar);
        bar.querySelector("[data-m2-s3-open-gong]").addEventListener("click", () => {
          state.api.os.openApp("gong", {
            transcripts: state.transcripts,
            activeTranscriptId: state.transcripts[0]?.id,
          });
        });
      }
    }
    const onAppOpened = (ev) => {
      if (ev.detail?.appId !== "gong") return;
      if (state.step !== 2) return;
      state.api.eventBus.removeEventListener("app:opened", onAppOpened);
      markTaskBannerDone("m2-s3-open-gong");
      state.api.eventLog?.record?.("step3_gong_opened");
      setTimeout(() => runStep(3), 500);
    };
    state.api.eventBus.addEventListener("app:opened", onAppOpened);
  }, 140);
}

// --- Step 4 -----------------------------------------------------------------

function stepWorkedExample(body) {
  body.innerHTML = `
    <p style="font-size:14px;">
      Watch <strong>L.D.</strong> handle <strong>Tom's "We already use Brex"</strong>
      objection. Notice that he restates it before any rebuttal.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Find the <strong>[M2]</strong> chip in the transcript and click it when
      you've read the call.
    </p>
  `;
  setTimeout(() => {
    const gongBody = document.querySelector(".os-window.app--gong .os-window-body");
    if (!gongBody) return;
    mountTaskBanner(gongBody, {
      id: "m2-s4-watch",
      label: "Read L.D.'s restate and find the [M2] Acknowledge chip",
      hint: "Click the chip or Watched it below",
      state: "active",
    });
    if (!gongBody.querySelector("[data-m2-s4-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin-top:14px; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">
          L.D. reuses Tom's own word, 'Brex', then asks a question.
        </span>
        <button type="button" data-m2-s4-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Watched it
        </button>
      `;
      gongBody.appendChild(bar);
      const complete = () => {
        if (state.step !== 3) return;
        markTaskBannerDone("m2-s4-watch");
        state.api.eventLog?.record?.("step4_worked_example_completed");
        state.timeline.push({
          label: "Watched L.D.'s restate",
          detail: "Brex objection · Tom's words reused before any rebuttal",
          ts: timestamp(),
        });
        setTimeout(() => runStep(4), 450);
      };
      bar.querySelector("[data-m2-s4-done]").addEventListener("click", complete);
      gongBody.addEventListener("click", e => {
        if (e.target.closest?.('.m-chip[data-move="M2"]')) complete();
      });
    }
  }, 200);
}

// --- Step 5 -----------------------------------------------------------------

function stepCompletionProblem(body) {
  keepOnly(["outreach"]);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>Sven</strong> (DE industrial wholesale · 64 FTE) just said:
      <em>"Our accountant won't deal with another tool."</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Pick how you acknowledge it in the panel under the highlighted row in Outreach.
    </p>
  `;
  const options = [
    { label: "A", result: "anti",
      text: `"FinTechCard integrates with most accounting platforms — it's actually less work for them."`,
      rationale: "A rebuttal with no restate. You skipped the listening step." },
    { label: "B", result: "correct",
      text: `"So your accountant pushes back on new tools — what does the friction usually look like for her?"`,
      rationale: "Yes. It reuses his words ('accountant', 'tool') and asks an open follow-up." },
    { label: "C", result: "partial",
      text: `"That's fair, accountants are busy. What can I do to help?"`,
      rationale: "A soft restate with nothing specific, and the open question is too generic." },
    { label: "D", result: "anti",
      text: `"Most accountants change their mind once they see the demo."`,
      rationale: "It argues with the accountant before you've heard her side. Top reps never argue against someone who isn't on the call." },
  ];
  setTimeout(() => mountSvenDrawer(options), 160);
}

function mountSvenDrawer(options) {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  mountTaskBanner(outreachBody, {
    id: "m2-s5-pick-ack",
    label: "Pick how you acknowledge Sven in the panel that just opened",
    hint: "A wrong pick shows why it fails and which option is right",
    state: "active",
  });
  const svenRow = [...outreachBody.querySelectorAll(".lead-row")].find(r => /\bSven\b/.test(r.textContent || "")) || outreachBody.querySelector(".lead-row");
  if (!svenRow) return;
  svenRow.classList.add("is-warm-highlight");
  outreachBody.querySelector("[data-m2-s5-drawer]")?.remove();
  const drawer = document.createElement("div");
  drawer.setAttribute("data-m2-s5-drawer", "");
  drawer.className = "tom-drawer";
  drawer.innerHTML = `
    <header class="tom-drawer__head">
      <strong>Sven · live call · 01:14</strong>
      <span class="tom-drawer__cue">Pick how you acknowledge</span>
    </header>
    <p class="tom-drawer__stem">
      <em>"Our accountant won't deal with another tool."</em>
    </p>
    <div class="tom-drawer__opts" role="radiogroup" aria-label="Pick the acknowledge">
      ${options.map((o, i) => `
        <button type="button" class="tom-drawer__opt" role="radio"
                aria-checked="false" data-result="${o.result}" data-idx="${i}">
          <span class="tom-drawer__label">${o.label}</span>
          <span class="tom-drawer__text">${o.text}</span>
        </button>`).join("")}
    </div>
    <div class="tom-drawer__fb" id="m2-s5-fb" hidden></div>
  `;
  svenRow.insertAdjacentElement("afterend", drawer);
  const fb = drawer.querySelector("#m2-s5-fb");
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
        markTaskBannerDone("m2-s5-pick-ack");
        state.api.eventLog?.record?.("completion_problem_completed");
        state.timeline.push({
          label: "Picked the correct acknowledge for Sven",
          detail: "Option B · his words reused, then an open follow-up",
          ts: timestamp(),
        });
        setTimeout(() => runStep(5), 700);
      }
    });
  });
}

// --- Step 6 -----------------------------------------------------------------

function stepSoloProblem(body) {
  const tom = state.prospects.find(p => /tom/i.test(p.name)) ?? state.prospects[0];
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>On your own.</strong> ${tom.name} just said:
      <em>"${tom.top_objection ?? "We already use Brex."}"</em>
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Type your restate. Use at least two words from his objection.
    </p>
  `;
  setTimeout(() => decorateSoloFlow(tom), 200);
}

function decorateSoloFlow(tom) {
  const outreachBody = document.querySelector(".os-window.app--outreach .os-window-body");
  if (!outreachBody) return;
  mountTaskBanner(outreachBody, {
    id: "m2-s6-solo",
    label: `Restate ${tom.name}'s objection with at least two of his words, before any rebuttal`,
    hint: "Then wait for his answer before you ask the follow-up",
    state: "active",
  });
  if (outreachBody.querySelector("[data-m2-s6-stage]")) return;
  const stageWrap = document.createElement("div");
  stageWrap.setAttribute("data-m2-s6-stage", "");
  stageWrap.style.cssText = "margin-top:14px; padding:14px; background:#fff; border:1px solid var(--ftc-border); border-radius:8px;";
  const objection = tom.top_objection ?? "We already use Brex.";
  stageWrap.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px; padding:10px 12px; background:#fde7e3; border-left:3px solid var(--coral-700, #c33d22); border-radius:6px;">
      <span style="font-family:var(--ftc-font-mono); font-size:11px; color:var(--coral-700, #c33d22); text-transform:uppercase; letter-spacing:0.06em;">Objection</span>
      <span style="font-size:13px; color:var(--ftc-ink);">"${escapeHtml(objection)}"</span>
    </div>
    <label style="display:block; font-size:12.5px; color:var(--ftc-ink-2); margin-bottom:4px;">
      Your restate (use the buyer's words):
    </label>
    <textarea data-m2-restate rows="2"
      placeholder="e.g. So you're already on Brex and switching feels like risk — what tipped you toward them?"
      style="width:100%; padding:8px; border:1px solid var(--ftc-border); border-radius:4px; font-family:var(--ftc-font-sans); font-size:13px; resize:vertical;"></textarea>
    <div style="display:flex; gap:8px; margin-top:10px; align-items:center;">
      <button type="button" data-m2-send
              style="background:#ccc; color:#666; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:not-allowed;" disabled>
        Send restate &amp; wait
      </button>
      <span data-m2-status style="font-size:12px; color:var(--ftc-ink-2);">
        Use at least two words from the objection.
      </span>
    </div>
  `;
  outreachBody.appendChild(stageWrap);

  const ta = stageWrap.querySelector("[data-m2-restate]");
  const send = stageWrap.querySelector("[data-m2-send]");
  const status = stageWrap.querySelector("[data-m2-status]");
  const objTokens = objection.toLowerCase().split(/\W+/).filter(t => t.length >= 3);

  ta.addEventListener("input", () => {
    const repTokens = new Set(ta.value.toLowerCase().split(/\W+/).filter(t => t.length >= 3));
    const overlap = objTokens.filter(t => repTokens.has(t)).length;
    const ok = overlap >= 2 && ta.value.trim().length >= 20;
    send.disabled = !ok;
    send.style.background = ok ? "var(--brand-green)" : "#ccc";
    send.style.color = ok ? "#fff" : "#666";
    send.style.cursor = ok ? "pointer" : "not-allowed";
    status.textContent = ok
      ? `Good: ${overlap} of his words reused. Send when ready.`
      : `Words from the objection so far: ${overlap}. You need at least 2.`;
  });
  send.addEventListener("click", () => {
    if (send.disabled) return;
    state.restateOk = true;
    state.timeline.push({
      label: `Restated ${tom.name}'s objection in his words`,
      detail: ta.value.trim().slice(0, 80),
      ts: timestamp(),
    });
    markTaskBannerDone("m2-s6-solo");
    state.api.eventLog?.record?.("solo_problem_completed");
    setTimeout(() => runStep(6), 600);
  });
}

// --- Step 7 -----------------------------------------------------------------

function stepFeedback(body) {
  keepOnly(["slack"]);
  body.innerHTML = `
    <p style="font-size:14px;">
      <strong>J.T.</strong> sent you a DM reviewing your restate.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Read it, then click Mark thread read.
    </p>
  `;
  const dmMessages = [
    { author: "J.T. (pod lead)", initials: "JT", ts: "13:02",
      body: "Watched your restate. You used his words 👇" },
    ...state.timeline.map(e => ({
      author: "J.T. (pod lead)", initials: "JT", ts: e.ts,
      body: `✅ ${e.label}: ${e.detail}`,
    })),
    { author: "J.T. (pod lead)", initials: "JT", ts: "13:05",
      body: "Restate first. If you still need to rebut, do it after the buyer has answered a question." },
    { author: "M.G. (peer)", initials: "MG", ts: "13:06",
      body: "Practise the restate until it's a reflex. Most of the time you won't need the rebuttal, because buyers correct themselves." },
  ];
  state.api.os.openApp("slack", {
    channel: {
      channel_id: "dm-jt-podlead",
      pinned_messages: [
        { title: "3-move card", content_md: "M1 diagnostic · M2 acknowledge · M3 calendar close", related_module: "M2" },
      ],
      messages: dmMessages,
    },
  });
  setTimeout(() => {
    const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
    if (!slackBody) return;
    mountTaskBanner(slackBody, {
      id: "m2-s7-read-dm",
      label: "Read J.T.'s feedback DM",
      hint: "'Mark thread read' below to continue",
      state: "active",
    });
    if (!slackBody.querySelector("[data-m2-s7-done]")) {
      const bar = document.createElement("div");
      bar.style.cssText = "margin:14px 0 0; padding:10px 14px; background:var(--ftc-green-tint); border:1px dashed var(--brand-green); border-radius:6px; display:flex; align-items:center; justify-content:space-between; gap:12px;";
      bar.innerHTML = `
        <span style="font-size:12.5px;color:var(--ftc-ink-2);">J.T. will see when you've read it.</span>
        <button type="button" data-m2-s7-done
                style="background:var(--brand-green); color:#fff; padding:8px 14px; border:0; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ✓ Mark thread read
        </button>
      `;
      slackBody.appendChild(bar);
      bar.querySelector("[data-m2-s7-done]").addEventListener("click", () => {
        markTaskBannerDone("m2-s7-read-dm");
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
    <p style="font-size:14px;"><strong>Quick check</strong>: 3 questions from J.T. in Slack.</p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">Two of three right is a pass.</p>
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
    id: "m2-s8-quiz",
    label: "Answer the 3 quiz questions J.T. just posted",
    hint: "A wrong pick shows the right answer",
    state: "active",
  });
  let thread = slackBody.querySelector("[data-m2-quiz-thread]");
  thread?.remove();
  thread = document.createElement("div");
  thread.setAttribute("data-m2-quiz-thread", "");
  thread.style.cssText = "margin:14px 0 0; padding:14px 16px; background:#fff8e0; border-left:3px solid var(--sun-500, #f5b800); border-radius:6px; font-family:var(--ftc-font-sans);";
  thread.innerHTML = `
    <div style="font-family:var(--ftc-font-mono); font-size:11px; color:var(--ftc-ink-2); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">
      J.T. · 13:08 · quick check thread
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
      Question ${state.quizIndex + 1} of ${state.quizItems.length}
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
    <div class="tom-drawer__fb" id="m2-s8-fb" hidden></div>
    <div style="margin-top:10px; text-align:right;">
      <button type="button" id="m2-s8-next" disabled
              style="background:var(--brand-green); color:#fff; padding:6px 14px; border:0; border-radius:4px; font-size:12px; font-weight:600; cursor:pointer; opacity:0.5;">
        ${state.quizIndex === state.quizItems.length - 1 ? "Finish quiz" : "Next question"}
      </button>
    </div>
  `;
  const fb = host.querySelector("#m2-s8-fb");
  const nextBtn = host.querySelector("#m2-s8-next");
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
      markTaskBannerDone("m2-s8-quiz");
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
      <strong>Last step.</strong> M.G. pinned the takeaway in your Slack channel.
    </p>
    <p style="font-size:13px;color:var(--ftc-ink-2)">
      Quiz: <strong>${state.quizScore} / ${state.quizItems.length}</strong> (${scorePct}%).
      Schedule the 7-day refresher in Slack to finish the module.
    </p>
  `;
  setTimeout(() => {
    const slackBody = document.querySelector(".os-window.app--slack .os-window-body");
    if (!slackBody) {
      state.api.os.openApp("slack");
      return setTimeout(() => stepTakeaway(body), 250);
    }
    slackBody.querySelector("[data-m2-quiz-thread]")?.remove();
    mountTaskBanner(slackBody, {
      id: "m2-s9-takeaway",
      label: "Read M.G.'s takeaway, then schedule the refresher",
      hint: "The module finishes when you schedule it.",
      state: "active",
    });
    if (!slackBody.querySelector("[data-m2-pinned]")) {
      const pinned = document.createElement("div");
      pinned.setAttribute("data-m2-pinned", "");
      pinned.style.cssText = "margin:14px 0 0; padding:16px 18px; background:linear-gradient(180deg, var(--ftc-green-tint, #ecf9e7) 0%, #ffffff 100%); border:1px solid var(--brand-green); border-left:4px solid var(--brand-green); border-radius:8px; font-family:var(--ftc-font-sans); box-shadow:0 6px 16px -8px rgba(10,26,16,0.12);";
      pinned.innerHTML = `
        <div style="font-family:var(--ftc-font-mono); font-size:10px; color:var(--brand-green); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">
          📌 Pinned by M.G. (peer · Manchester pod)
        </div>
        <p style="font-size:15px; font-style:italic; line-height:1.55; color:var(--ftc-ink); margin:0 0 10px;">
          "Restate before you rebut, using at least two of the buyer's exact
          words. Then ask one open question. After that you'll rarely need
          the rebuttal."
        </p>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px; padding-top:12px; border-top:1px solid var(--ftc-border);">
          <span style="font-size:12.5px; color:var(--ftc-ink-2);">
            📅 In 7 days you'll get three short questions on restating objections.
          </span>
          <button type="button" data-m2-s9-finish
                  style="background:var(--brand-green); color:#fff; padding:9px 16px; border:0; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
            Schedule refresher &rarr;
          </button>
        </div>
      `;
      const messages = slackBody.querySelector(".slack-msgs, .slack-messages, .slack-main") || slackBody;
      messages.appendChild(pinned);
      pinned.querySelector("[data-m2-s9-finish]").addEventListener("click", () => {
        markTaskBannerDone("m2-s9-takeaway");
        state.api.eventLog?.record?.("step9_retrieval_drop_set");
        finishModule();
      });
    }
  }, 200);
}

function finishModule() {
  const scorePct = Math.round((state.quizScore / state.quizItems.length) * 100);
  state.api.complete(scorePct);
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
      <h2 class="summary-card__title" id="summary-title">Objection Acknowledge · ${scorePct >= 67 ? "passed" : "completed"}</h2>
      <div class="summary-card__stats">
        <div class="summary-card__stat">
          <span class="summary-card__stat-k">Quiz</span>
          <span class="summary-card__stat-v">${state.quizScore} / ${state.quizItems.length}</span>
          <span class="summary-card__stat-sub">${scorePct}% · ${scorePct >= 67 ? "pass" : "below the 67% pass mark"}</span>
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
        <a class="summary-card__btn summary-card__btn--ghost" href="../">&larr; Back to engagement</a>
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
