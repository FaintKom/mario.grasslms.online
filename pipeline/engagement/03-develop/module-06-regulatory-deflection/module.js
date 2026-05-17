/* =============================================================================
 * Module 6 · Regulatory Deflection · driver
 * -----------------------------------------------------------------------------
 * Gagné nine-events timeline for FinTechCard SDR onboarding, class 6
 * (4cid-blueprint.md §3.1; LO-REG.1 + LO-REG.2; brief §19 + §12.4).
 *
 * Critical design tenet — per Rossett & Schafer (2007):
 *   THE §19 JOB AID IS ALWAYS VISIBLE for the entire 10-minute session,
 *   including the quiz. The outcome is performance WITH the aid in hand,
 *   not memorisation. The rep reads the row out loud; they do not recall it.
 *
 * Inputs read at boot:
 *   - data/reg-job-aid.json       (5 productionised rows from brief §19)
 *   - data/transcripts.json       (1 worked example + 1 contrast)
 *   - data/prospects.json         (Lukas §12.4 + secondary trust-driven prospect)
 *   - data/quiz.json              (3 scenario items, open-job-aid)
 *
 * Emits (per ../scorm-shell/event-log-spec.md):
 *   reg_question_classified · reg_row_picked · reg_question_escalated
 *   worked_example_completed · completion_problem_completed
 *   solo_problem_completed · module_completed
 * ============================================================================= */

import { bootModule } from "../scorm-shell/js/shell.js";

// ---------------------------------------------------------------------------
// Data fetch helpers
// ---------------------------------------------------------------------------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Module state · accumulator across Gagné segments
// ---------------------------------------------------------------------------

const state = {
  startTs: Date.now(),
  drill: { answers: [] },               // [{ row, correct, ms }]
  solo:  { calls: [] },                 // [{ id, picked, correct, expected, escalated }]
  quiz:  { answers: [], score: 0 },     // [{ itemId, picked, correct }]
  jobAid: null,
  transcripts: null,
  prospects: null,
  quizItems: null,
};

// ---------------------------------------------------------------------------
// Job-aid panel — ALWAYS VISIBLE; row-highlight helper
// ---------------------------------------------------------------------------

function renderJobAidPanel(jobAid) {
  const tbody = $("#job-aid-rows");
  tbody.innerHTML = jobAid.rows.map(row => `
    <tr data-row="${row.acronym}" data-active="false">
      <th scope="row" class="job-aid-row-acronym">${row.acronym}</th>
      <td>${row.what_it_means}</td>
      <td class="job-aid-row-verbatim">"${row.rep_response_verbatim}"</td>
    </tr>
  `).join("");

  // Collapse toggle — defaults open (Rossett & Schafer point-of-use principle).
  const collapseBtn = $("#job-aid-collapse");
  const panel = $("#job-aid-panel");
  collapseBtn.addEventListener("click", () => {
    const wasCollapsed = panel.dataset.collapsed === "true";
    panel.dataset.collapsed = wasCollapsed ? "false" : "true";
    collapseBtn.setAttribute("aria-expanded", wasCollapsed ? "true" : "false");
    collapseBtn.textContent = wasCollapsed ? "Collapse panel" : "Expand panel";
  });
}

function highlightJobAidRow(acronym) {
  $$("#job-aid-rows tr").forEach(tr => {
    tr.dataset.active = (tr.dataset.row === acronym) ? "true" : "false";
  });
}
function clearJobAidHighlight() {
  $$("#job-aid-rows tr").forEach(tr => tr.dataset.active = "false");
}

// ---------------------------------------------------------------------------
// Stage renderer — replaces #stage contents per Gagné segment.
// segmenting principle (Mayer 2014 ch. 13): one segment visible at a time.
// ---------------------------------------------------------------------------

function setStage({ step, time, title, bodyHtml, actions }) {
  const stage = $("#stage");
  const actionsHtml = (actions || []).map((a, i) => `
    <button type="button"
            class="${a.primary ? "btn-primary" : "btn-secondary"}"
            data-action-index="${i}">
      ${a.label}
    </button>
  `).join("");

  stage.innerHTML = `
    <header class="stage-header">
      <h2 class="stage-title">${title}</h2>
      <span class="stage-step">${step} · ${time}</span>
    </header>
    <div class="stage-body">${bodyHtml}</div>
    <div class="stage-actions">${actionsHtml}</div>
  `;

  (actions || []).forEach((a, i) => {
    stage.querySelector(`[data-action-index="${i}"]`)
      ?.addEventListener("click", () => a.onClick?.());
  });

  // Focus the first focusable element for keyboard nav (a11y §9.2).
  const first = stage.querySelector("button, [tabindex]");
  if (first instanceof HTMLElement) first.focus({ preventScroll: false });
}

function updateProgress(currentMs) {
  const mm = Math.floor(currentMs / 60000).toString();
  const ss = Math.floor((currentMs % 60000) / 1000).toString().padStart(2, "0");
  const el = $("#module-progress");
  if (el) el.textContent = `${mm}:${ss} / 10:00`;
}

// ---------------------------------------------------------------------------
// Escalate modal — Slack DM-to-Compliance scaffold
// ---------------------------------------------------------------------------

function buildSlackScaffold({ buyerName, question, contextNote = "" }) {
  return [
    `@compliance — live SDR call, need 5 min.`,
    ``,
    `Buyer: ${buyerName}`,
    `Question (verbatim): "${question}"`,
    contextNote ? `Context: ${contextNote}` : "",
    `Booking compliance into the next slot — please confirm avail.`,
    `Thx.`,
  ].filter(Boolean).join("\n");
}

function openEscalateModal({ buyerName, question, contextNote }) {
  const modal = $("#escalate-modal");
  const text = $("#escalate-modal-text");
  text.textContent = buildSlackScaffold({ buyerName, question, contextNote });
  modal.hidden = false;
  $("#escalate-modal-close").focus();
}

function wireEscalateGlobals(api) {
  $("#escalate-button").addEventListener("click", () => {
    openEscalateModal({
      buyerName: "(active buyer)",
      question: "(paste the buyer's exact question here)",
      contextNote: "Going deeper than §19 — pulling compliance into next call.",
    });
    api.eventLog.record("reg_question_escalated", { invitee: "#compliance" });
  });
  $("#escalate-modal-close").addEventListener("click", () => {
    $("#escalate-modal").hidden = true;
  });
  $("#escalate-copy").addEventListener("click", async () => {
    const text = $("#escalate-modal-text").textContent;
    try {
      await navigator.clipboard.writeText(text);
      $("#escalate-copy").textContent = "Copied!";
      setTimeout(() => $("#escalate-copy").textContent = "Copy to clipboard", 1200);
    } catch {
      $("#escalate-copy").textContent = "Copy unsupported — select + Ctrl+C";
    }
  });
  // Escape closes modal · WCAG 2.1.2.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#escalate-modal").hidden) {
      $("#escalate-modal").hidden = true;
    }
  });
}

// =============================================================================
// GAGNÉ TIMELINE
// =============================================================================

// ---- 0:00–0:30 · 1 · Gain attention --------------------------------------
function step1_gainAttention(api) {
  const lukas = state.prospects.prospects.find(p => p.id === "lukas");
  updateProgress(0);
  setStage({
    step: "Step 1 of 9",
    time: "0:00 – 0:30",
    title: "Trigger · incoming call",
    bodyHtml: `
      <div class="trigger-call" role="region" aria-label="Incoming phone-dialler call">
        <div class="caller">Phone-dialler · incoming</div>
        <div class="buyer-name">${lukas.display_name} · ${lukas.context}</div>
        <p class="buyer-line">"${lukas.trigger_line}"</p>
        <p class="three-seconds">You have three seconds. Pitch your way out — you lose the call. Defer to the regulator page — you keep it.</p>
      </div>
      <div class="callout">
        This module is different. The job aid on your right is your working memory. Read the row out loud. Do not invent.
      </div>
    `,
    actions: [{
      label: "Continue",
      primary: true,
      onClick: () => step2_statedOutcome(api),
    }],
  });
}

// ---- 0:30–1:00 · 2 · State outcome ---------------------------------------
function step2_statedOutcome(api) {
  updateProgress(30_000);
  setStage({
    step: "Step 2 of 9",
    time: "0:30 – 1:00",
    title: "What 'done' looks like",
    bodyHtml: `
      <p>By the end of these 10 minutes you will:</p>
      <ul>
        <li><strong>LO-REG.1</strong> · Read the §19 row out loud, live, in real time — no recall required.</li>
        <li><strong>LO-REG.2</strong> · Escalate to compliance the second the question goes deeper than the sheet.</li>
        <li><strong>LO-REG.3</strong> · Sustain the trust tone — calm, specific, regulator-aware (brief §18.1).</li>
      </ul>
      <p class="evidence-note">
        Evidence note · Reg scenarios derived from brief §19; Phase 5 validates against the first
        cohort's Gong reg-question corpus (A.S. + M.B. weeks 5–8). If the §19 table covers &lt; 80% of
        actual buyer reg-questions, the v2 backlog widens the table.
      </p>
    `,
    actions: [{ label: "Continue", primary: true, onClick: () => step3_recall(api) }],
  });
}

// ---- 1:00–1:30 · 3 · Recall prior ----------------------------------------
function step3_recall(api) {
  updateProgress(60_000);
  setStage({
    step: "Step 3 of 9",
    time: "1:00 – 1:30",
    title: "Recall · how reg questions sit next to M2",
    bodyHtml: `
      <p>You learned in Module 2 to <em>acknowledge before responding</em> — restate the objection in the buyer's own words.</p>
      <div class="callout">
        Reg questions are objection-shaped, but they are <strong>not objections</strong>. They are proof requests.
        Don't argue. Don't acknowledge-and-restate. <strong>Point at the row.</strong>
      </div>
      <p>If you find yourself improvising a regulatory answer — stop. Escalating is the trust move (brief §19 honest carve-out).</p>
    `,
    actions: [{ label: "Show me", primary: true, onClick: () => step4_workedExample(api) }],
  });
}

// ---- 1:30–3:00 · 4-5 · Worked example -------------------------------------
function step4_workedExample(api) {
  updateProgress(90_000);
  const ex = state.transcripts.transcripts.find(t => t.id === "worked-kyc-verbatim");
  const contrast = state.transcripts.transcripts.find(t => t.id === "contrast-psd2-guess");

  // Highlight the row the rep is reading from (spatial contiguity).
  highlightJobAidRow(ex.row_used);

  const turnsHtml = (turns) => turns.map(turn => {
    const cls = turn.speaker === "rep"
      ? (turn.verdict === "good" ? "rep-good" : turn.verdict === "bad" ? "rep-bad" : "")
      : "";
    return `<div class="turn ${cls}"><b>[${turn.speaker.toUpperCase()}]</b> ${turn.text}</div>`;
  }).join("");

  setStage({
    step: "Step 4-5 of 9",
    time: "1:30 – 3:00",
    title: "Worked example · point at the row",
    bodyHtml: `
      <div class="worked-pair">
        <div class="worked-card" role="region" aria-label="Worked example — rep reads §19 verbatim">
          <h3>Worked · row used: ${ex.row_used}</h3>
          ${turnsHtml(ex.turns)}
        </div>
        <div class="worked-card" role="region" aria-label="Contrast — rep invents a PSD2 answer">
          <h3>Contrast · rep guesses (don't do this)</h3>
          ${turnsHtml(contrast.turns)}
        </div>
      </div>
      <p class="coach-mark-inline">
        Notice — the rep doesn't memorise. The rep reads the row on the right-hand panel out loud.
        The §19 panel highlighted the <strong>${ex.row_used}</strong> row when this call started.
      </p>
    `,
    actions: [{
      label: "Start drill D6",
      primary: true,
      onClick: () => {
        clearJobAidHighlight();
        api.eventLog.record("worked_example_completed");
        step6_drill(api, 0);
      },
    }],
  });
}

// ---- 3:00–5:30 · 6 · D6 drill --------------------------------------------
// 5 cards: KYC, AML, SCA, PSD2 + 1 out-of-scope (escalate) interleaved.
const DRILL_CARDS = [
  { id: "d1", buyer: "Maria",  question: "How long does signup take? My bookkeeper hates paperwork.", correct_row: "KYC",  is_reg: true,  escalate: false },
  { id: "d2", buyer: "Tom",    question: "Do you flag suspicious transactions, or is that on us?",   correct_row: "AML",  is_reg: true,  escalate: false },
  { id: "d3", buyer: "Emma",   question: "Will my employees have to do 2FA on every coffee?",         correct_row: "SCA",  is_reg: true,  escalate: false },
  { id: "d4", buyer: "Tom",    question: "Are you PSD2 compliant?",                                    correct_row: "PSD2", is_reg: true,  escalate: false },
  { id: "d5", buyer: "Lukas",  question: "I need a cross-border DPA covering EU + Switzerland transfer — can you produce it on a call?", correct_row: "ESCALATE", is_reg: true, escalate: true },
];

function step6_drill(api, idx) {
  updateProgress(180_000 + idx * 30_000);
  if (idx >= DRILL_CARDS.length) {
    api.eventLog.record("completion_problem_completed");
    return step7_solo(api, 0);
  }
  const card = DRILL_CARDS[idx];
  const rows = state.jobAid.rows.map(r => r.acronym);
  const options = [...rows, "ESCALATE"];

  setStage({
    step: `Step 6 of 9 · drill card ${idx + 1} of ${DRILL_CARDS.length}`,
    time: "3:00 – 5:30",
    title: "D6 drill · tap the row",
    bodyHtml: `
      <div class="drill">
        <div class="drill-progress" aria-hidden="true">
          ${DRILL_CARDS.map((_, i) => `
            <span class="dot" data-state="${i < idx ? "done" : i === idx ? "current" : ""}"></span>
          `).join("")}
        </div>
        <div class="drill-card">
          <p class="buyer-q"><b>[${card.buyer}]</b> "${card.question}"</p>
          <div class="drill-options" role="group" aria-label="Pick the §19 row to use">
            ${options.map(opt => `
              <button type="button" data-pick="${opt}">${opt === "ESCALATE" ? "Escalate to Compliance" : opt}</button>
            `).join("")}
          </div>
          <div id="drill-feedback" class="drill-feedback" hidden></div>
        </div>
      </div>
    `,
    actions: [{
      label: "Next card",
      primary: true,
      onClick: () => step6_drill(api, idx + 1),
    }],
  });

  const nextBtn = $$("#stage .btn-primary")[0];
  nextBtn.disabled = true;

  $$("[data-pick]").forEach(btn => {
    btn.addEventListener("click", () => {
      const picked = btn.getAttribute("data-pick");
      const correct = (picked === card.correct_row);
      btn.dataset.picked = "true";
      btn.dataset.correct = String(correct);
      if (picked !== "ESCALATE") highlightJobAidRow(picked);

      $$("[data-pick]").forEach(b => { b.disabled = true; });

      const fb = $("#drill-feedback");
      fb.hidden = false;
      fb.dataset.correct = String(correct);
      fb.textContent = correct
        ? (card.escalate
            ? "Correct — this goes deeper than the table. Escalating is the trust move."
            : `Correct — ${card.correct_row} row. Read it out loud.`)
        : (card.escalate
            ? `Almost — this is beyond §19. The right move is ESCALATE.`
            : `Not quite — the correct row is ${card.correct_row}. Re-read it on the right.`);

      state.drill.answers.push({ row: picked, correct, ms: Date.now() - state.startTs });

      api.eventLog.record("reg_question_classified", { is_reg_actual: card.is_reg, picked });
      api.eventLog.record("reg_row_picked", { row_id: picked, correct });
      if (card.escalate && picked === "ESCALATE") {
        api.eventLog.record("reg_question_escalated", { invitee: "#compliance" });
      }

      nextBtn.disabled = false;
      nextBtn.focus();
    });
  });
}

// ---- 5:30–8:30 · 6 · Solo problem · Lukas continued ----------------------
// Lukas asks 3 reg questions sequentially: KYC, AML, then a PSD2 follow-up
// that goes deeper than §19 → must escalate.
const SOLO_CALLS = [
  { id: "s1", row: "KYC",  question: "Before I sign anything — how do I know my company even passes your onboarding?", expected: "KYC",  expects_escalate: false },
  { id: "s2", row: "AML",  question: "If a manager's card shows weird charges at 3am, do I find out or do you?",       expected: "AML",  expects_escalate: false },
  { id: "s3", row: "PSD2", question: "OK PSD2 — but how does PSD2 handle a German legal entity making payments to an Italian supplier under SCA delegation? I need a written answer.", expected: "ESCALATE", expects_escalate: true },
];

function step7_solo(api, idx) {
  updateProgress(330_000 + idx * 60_000);
  if (idx >= SOLO_CALLS.length) {
    api.eventLog.record("solo_problem_completed");
    return step8_feedback(api);
  }
  const call = SOLO_CALLS[idx];
  highlightJobAidRow(call.row);

  setStage({
    step: `Step 6 of 9 · solo question ${idx + 1} of ${SOLO_CALLS.length}`,
    time: "5:30 – 8:30",
    title: "Solo · Lukas · keep the trust",
    bodyHtml: `
      <div class="solo-call">
        <span class="stage-step">Buyer · Lukas · DE hospitality · low-trust profile</span>
        <h3>Live phone-dialler · Q${idx + 1}</h3>
        <p class="buyer-q">"${call.question}"</p>
        <p>Pick a response. Read the highlighted row out loud — or escalate.</p>
        <div class="solo-actions" role="group" aria-label="Choose your response">
          <button type="button" data-solo="KYC">Read KYC row</button>
          <button type="button" data-solo="AML">Read AML row</button>
          <button type="button" data-solo="SCA">Read SCA row</button>
          <button type="button" data-solo="PSD2">Read PSD2 row</button>
          <button type="button" data-solo="GDPR">Read GDPR row</button>
          <button type="button" class="escalate-action" data-solo="ESCALATE">Escalate to Compliance</button>
        </div>
        <div id="solo-feedback" class="drill-feedback" hidden></div>
      </div>
    `,
    actions: [{
      label: "Next",
      primary: true,
      onClick: () => step7_solo(api, idx + 1),
    }],
  });

  const nextBtn = $$("#stage .btn-primary")[0];
  nextBtn.disabled = true;

  $$("[data-solo]").forEach(btn => {
    btn.addEventListener("click", () => {
      const picked = btn.getAttribute("data-solo");
      const correct = (picked === call.expected);
      $$("[data-solo]").forEach(b => { b.disabled = true; });
      const fb = $("#solo-feedback");
      fb.hidden = false;
      fb.dataset.correct = String(correct);
      fb.textContent = correct
        ? (call.expects_escalate
            ? "Correct — this is beyond §19. Open the Slack scaffold and book a follow-up."
            : `Correct — read the ${call.expected} row verbatim. That is the move.`)
        : (call.expects_escalate
            ? `Not quite — this exceeds the §19 PSD2 row. Escalate is the trust move.`
            : `Not quite — the correct row is ${call.expected}.`);

      state.solo.calls.push({ id: call.id, picked, correct, expected: call.expected, escalated: picked === "ESCALATE" });

      api.eventLog.record("reg_question_classified", { is_reg_actual: true, picked });
      api.eventLog.record("reg_row_picked", { row_id: picked, correct });

      if (call.expects_escalate && picked === "ESCALATE") {
        api.eventLog.record("reg_question_escalated", { invitee: "#compliance" });
        openEscalateModal({
          buyerName: "Lukas · DE hospitality",
          question: call.question,
          contextNote: "PSD2 + SCA delegation cross-border — beyond §19 row.",
        });
      }

      nextBtn.disabled = false;
      nextBtn.focus();
    });
  });
}

// ---- 8:30–9:00 · 7 · Feedback timeline -----------------------------------
function step8_feedback(api) {
  updateProgress(510_000);
  clearJobAidHighlight();

  const drillRows = state.drill.answers.map((a, i) => {
    const card = DRILL_CARDS[i];
    return `
      <tr>
        <td>Drill ${i + 1} · ${card.buyer}</td>
        <td>${a.row}</td>
        <td data-ok="${a.correct}">${a.correct ? "match" : "miss"}</td>
      </tr>
    `;
  }).join("");

  const soloRows = state.solo.calls.map((s, i) => `
    <tr>
      <td>Solo ${i + 1} · Lukas</td>
      <td>${s.picked}</td>
      <td data-ok="${s.correct}">${s.correct ? (s.escalated ? "escalated correctly" : "verbatim correct") : "missed"}</td>
    </tr>
  `).join("");

  const totalCorrect = state.drill.answers.filter(a => a.correct).length
                     + state.solo.calls.filter(s => s.correct).length;
  const totalItems = state.drill.answers.length + state.solo.calls.length;

  setStage({
    step: "Step 7 of 9",
    time: "8:30 – 9:00",
    title: "Feedback · job-aid usage timeline",
    bodyHtml: `
      <p>Per question · which row you pointed at · whether you escalated when §19 ran out.</p>
      <table class="timeline">
        <thead>
          <tr><th>Question</th><th>Row used</th><th>Verdict</th></tr>
        </thead>
        <tbody>
          ${drillRows}
          ${soloRows}
        </tbody>
      </table>
      <p class="callout">
        ${totalCorrect} of ${totalItems} correct. The pattern: the panel does the work.
        When you stop reading from it and start improvising — that's where trust leaks.
      </p>
    `,
    actions: [{
      label: "Continue to quiz",
      primary: true,
      onClick: () => step9_quiz(api, 0),
    }],
  });
}

// ---- 9:00–9:30 · 8 · Quiz · OPEN JOB AID ---------------------------------
function step9_quiz(api, idx) {
  updateProgress(540_000);
  if (idx >= state.quizItems.items.length) return step10_takeaway(api);
  const item = state.quizItems.items[idx];

  setStage({
    step: `Step 8 of 9 · quiz ${idx + 1} of ${state.quizItems.items.length}`,
    time: "9:00 – 9:30",
    title: `Quiz · ${item.lo}`,
    bodyHtml: `
      <div class="quiz-card">
        <span class="open-aid-banner">OPEN-JOB-AID · the panel on your right stays visible</span>
        <p class="stem">${item.stem}</p>
        <div class="drill-options" role="group" aria-label="Pick the best answer">
          ${item.options.map((opt, i) => `
            <button type="button" data-quiz-pick="${i}">${opt.label}</button>
          `).join("")}
        </div>
        <div id="quiz-feedback" class="drill-feedback" hidden></div>
      </div>
    `,
    actions: [{
      label: "Next",
      primary: true,
      onClick: () => step9_quiz(api, idx + 1),
    }],
  });

  const nextBtn = $$("#stage .btn-primary")[0];
  nextBtn.disabled = true;

  $$("[data-quiz-pick]").forEach(btn => {
    btn.addEventListener("click", () => {
      const picked = Number(btn.getAttribute("data-quiz-pick"));
      const correct = item.options[picked].correct === true;
      $$("[data-quiz-pick]").forEach(b => { b.disabled = true; b.dataset.picked = "false"; });
      btn.dataset.picked = "true";
      btn.dataset.correct = String(correct);
      const fb = $("#quiz-feedback");
      fb.hidden = false;
      fb.dataset.correct = String(correct);
      fb.textContent = correct ? `Correct — ${item.feedback_correct}` : `Not quite — ${item.feedback_incorrect}`;

      state.quiz.answers.push({ itemId: item.id, picked, correct });
      nextBtn.disabled = false;
      nextBtn.focus();
    });
  });
}

// ---- 9:30–10:00 · 9 · Key-takeaway + +7d ---------------------------------
function step10_takeaway(api) {
  updateProgress(570_000);
  const total = state.quiz.answers.length || 1;
  const correct = state.quiz.answers.filter(a => a.correct).length;
  const score = Math.round((correct / total) * 100);
  state.quiz.score = score;

  setStage({
    step: "Step 9 of 9",
    time: "9:30 – 10:00",
    title: "Key takeaway",
    bodyHtml: `
      <div class="takeaway">
        <p><strong>Don't sell against regulation — defer to it.</strong></p>
        <p>The sheet is your working memory. Reading it on a live call is not cheating — it's the move.
           When the buyer's question goes deeper than the sheet, escalating <em>is</em> the trust move.</p>
        <p class="signature">— composite of brief §19 honest carve-out + brand voice §18.1</p>
      </div>
      <div class="callout">
        Quiz score · <strong>${score}%</strong> · ${correct} of ${total}.<br>
        Your §19 job aid is now pinned in your real Slack <code>#sdr-onboarding</code> channel.
        +7-day mini-quiz scheduled · L1 pulse fires after you close this module.
      </div>
    `,
    actions: [{
      label: "Finish module",
      primary: true,
      onClick: () => { api.complete(score); },
    }],
  });
}

// =============================================================================
// BOOT
// =============================================================================

async function main() {
  // Load module data BEFORE booting the shell so the job-aid panel can render
  // before the first Gagné segment fires (Mayer pre-training principle).
  const [jobAid, transcripts, prospects, quizItems] = await Promise.all([
    loadJson("./data/reg-job-aid.json"),
    loadJson("./data/transcripts.json"),
    loadJson("./data/prospects.json"),
    loadJson("./data/quiz.json"),
  ]);
  state.jobAid = jobAid;
  state.transcripts = transcripts;
  state.prospects = prospects;
  state.quizItems = quizItems;

  renderJobAidPanel(jobAid);

  const api = bootModule({
    moduleId: "M6",
    title: "Module 6 · Regulatory Deflection",
    // No mini-OS windows auto-launched: the job-aid panel + stage carry the
    // full simulation. Phone-dialler + slack scaffolds appear inline within
    // stage cards to keep the 10-minute pacing tight.
    appsToLaunch: [],
    onReady(_api) {
      wireEscalateGlobals(_api);
      step1_gainAttention(_api);
    },
    onComplete() {
      setStage({
        step: "Done",
        time: "10:00",
        title: "Module complete",
        bodyHtml: `
          <p>You've finished Module 6. The §19 job aid stays in your Slack
             pinned channel. Use it live. Don't memorise it.</p>
        `,
        actions: [],
      });
    },
  });

  return api;
}

main().catch(err => {
  console.error("[M6] boot failed", err);
  const stage = document.getElementById("stage");
  if (stage) {
    stage.innerHTML = `<div class="danger-muted">Module failed to load: ${err.message}</div>`;
  }
});
