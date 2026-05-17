/**
 * Module 1 · M1 Diagnostic Opener — choreography.
 *
 * Drives the Gagné 9-event timeline (0:00 → 10:00) by mounting overlay
 * dialogs in #m1-stage and asking the shell to open the mini-OS apps the
 * storyboard calls for at each step.
 *
 * @see 02-design/module-storyboards/M1-diagnostic-opener.md (this file is its build)
 * @see ../scorm-shell/README.md §3-§5 (boot API + event-log fields)
 *
 * Decisions in force: D-005 (custom SCORM) · D-006 (no audio) · D-007 (mini-OS).
 */

import { bootModule } from "../scorm-shell/js/shell.js";

// ============================================================
// 0 · Static module config + data load
// ============================================================

const STAGE_ID = "m1-stage";
const stage    = () => document.getElementById(STAGE_ID);

/** @type {{transcripts:any[], prospects:any[], quiz:any[]}} */
const data = { transcripts: [], prospects: [], quiz: [] };

async function loadData() {
  const [transcripts, prospects, quiz] = await Promise.all([
    fetch("./data/transcripts.json").then(r => r.json()),
    fetch("./data/prospects.json").then(r => r.json()),
    fetch("./data/quiz.json").then(r => r.json()),
  ]);
  data.transcripts = transcripts;
  data.prospects   = prospects;
  data.quiz        = quiz;
}

// ============================================================
// 1 · Stage helpers · render an overlay with focus trap
// ============================================================

function renderStage(html, opts = {}) {
  const s = stage();
  if (!s) return null;
  s.innerHTML = `
    <div class="m1-modal-backdrop"></div>
    <div class="m1-modal ${opts.wide ? "m1-modal--wide" : ""}"
         role="dialog" aria-modal="true"
         aria-labelledby="m1-modal-title">
      ${html}
    </div>
  `;
  const modal = s.querySelector(".m1-modal");
  const first = modal?.querySelector("button:not([disabled]), [tabindex], a, input, textarea");
  if (first instanceof HTMLElement) queueMicrotask(() => first.focus());
  return modal;
}

function clearStage() {
  const s = stage();
  if (s) s.innerHTML = "";
}

function btn(label, kind = "primary", attrs = "") {
  return `<button type="button" class="m1-btn m1-btn--${kind}" ${attrs}>${label}</button>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]
  ));
}

function awaitNext(modal) {
  return new Promise(resolve => {
    modal?.querySelector("[data-next]")?.addEventListener("click", () => resolve(), { once: true });
  });
}

// ============================================================
// 2 · Gagné timeline · each function awaits a button press
// ============================================================

let api; // BootApi (set in onReady)

// --- 0:00–0:30 · Gain attention -----------------------------------------
async function eventGainAttention() {
  api.os.openApp("phone-dialler", { archetype: "storefront" });
  const modal = renderStage(`
    <p class="m1-modal__eyebrow">Trigger · 0:00</p>
    <h2 id="m1-modal-title" class="m1-modal__title">Third hang-up this morning.</h2>
    <p class="m1-modal__lede">A rep just lost a call inside 8 seconds. Watch the opener — and notice what's missing.</p>
    <div class="m1-transcript" aria-label="Failed-call transcript">
      <div class="m1-transcript__turn">
        <span class="m1-transcript__ts">[0:00]</span>
        <span class="m1-transcript__speaker">Rep</span>
        <span class="m1-transcript__text">Hi, this is P. calling from FinTechCard. Do you have a moment to talk about your corporate spending?</span>
      </div>
      <div class="m1-transcript__turn">
        <span class="m1-transcript__ts">[0:07]</span>
        <span class="m1-transcript__speaker">Buyer</span>
        <span class="m1-transcript__text">No.</span>
      </div>
      <div class="m1-transcript__turn">
        <span class="m1-transcript__ts">[0:08]</span>
        <span class="m1-transcript__speaker">—</span>
        <span class="m1-transcript__text" style="color: var(--ftc-danger-muted, #b42318);">Call ended · pattern GC-19</span>
      </div>
    </div>
    <p class="m1-modal__lede">The next call doesn't have to go this way. By the end of the next 10 minutes, it won't.</p>
    <div class="m1-modal__actions">${btn("Show me the move →", "primary", "data-next")}</div>
  `);
  await awaitNext(modal);
}

// --- 0:30–1:00 · State outcome -----------------------------------------
async function eventStateOutcome() {
  const modal = renderStage(`
    <p class="m1-modal__eyebrow">Outcome · 0:30</p>
    <h2 id="m1-modal-title" class="m1-modal__title">By the end of 10 minutes…</h2>
    <p class="m1-modal__lede">You open every cold call with one buyer-specific diagnostic — and you tolerate 5 seconds of silence before you fill it.</p>
    <blockquote class="m1-modal__quote">
      &ldquo;5 seconds feels like an hour. That&rsquo;s where the deal happens.&rdquo;
      <cite>— M.G., Manchester pod · 14 months</cite>
    </blockquote>
    <div class="m1-modal__actions">${btn("Got it →", "primary", "data-next")}</div>
  `);
  await awaitNext(modal);
}

// --- 1:00–1:30 · Recall prior -----------------------------------------
async function eventRecallPrior() {
  const modal = renderStage(`
    <p class="m1-modal__eyebrow">Pre-training · 1:00</p>
    <h2 id="m1-modal-title" class="m1-modal__title">Two things you already know.</h2>
    <ul style="line-height: 1.6; padding-left: 20px; margin: 0 0 12px;">
      <li><strong>The 3-move sequence.</strong> M1 diagnostic → M2 acknowledge → M3 calendar close. Pinned in Slack.</li>
      <li><strong>The four buyers.</strong> Maria · Tom · Emma · Lukas. Each has one ideal opener.</li>
    </ul>
    <p class="m1-modal__lede">Today is M1 only. The other two arrive in Modules 2 and 3.</p>
    <div class="m1-modal__actions">${btn("Open the worked example →", "primary", "data-next")}</div>
  `);
  await awaitNext(modal);
}

// --- 1:30–3:00 · Worked example (GC-01 · M.G. → Maria) -----------------
async function eventWorkedExample() {
  const gc01 = data.transcripts.find(t => t.id === "GC-01");
  api.os.openApp("gong", { callId: "GC-01" });

  const turnsHtml = gc01.lines.map(l => {
    const ts = `[${formatTs(l.timestamp_ms)}]`;
    const isM1 = l.m_move_tag === "M1";
    const tag = isM1 ? ` <span class="m1-transcript__tag" aria-label="M1 diagnostic move">👁 [M1]</span>` : "";
    const silenceLine = isM1 ? `
      <div class="m1-transcript__turn m1-transcript__turn--silence">
        <span class="m1-transcript__ts">[silence]</span>
        <span class="m1-transcript__speaker">—</span>
        <span class="m1-transcript__text">[silence 0:04] — buyer is thinking</span>
      </div>` : "";
    return `
      <div class="m1-transcript__turn ${isM1 ? "m1-transcript__turn--m1" : ""}">
        <span class="m1-transcript__ts">${ts}</span>
        <span class="m1-transcript__speaker">${escapeHtml(l.speaker)}</span>
        <span class="m1-transcript__text">${escapeHtml(l.text)}${tag}</span>
      </div>
      ${silenceLine}
    `;
  }).join("\n");

  const modal = renderStage(`
    <p class="m1-modal__eyebrow">Worked example · GC-01 · Manchester · Tue 14:02</p>
    <h2 id="m1-modal-title" class="m1-modal__title">M.G. opens Maria.</h2>
    <p class="m1-modal__lede">Watch the M1 line. Three things make it land — and one of them isn&rsquo;t a word.</p>
    <div class="m1-transcript" aria-label="GC-01 worked example transcript">
      ${turnsHtml}
    </div>
    <aside class="m1-callout">
      <strong>Why this works.</strong> The opener pairs <em>one specific signal</em>
      (&ldquo;second location&rdquo;, from Companies House) with a <em>who-controls-what</em>
      question (&ldquo;who&rsquo;s splitting card spend&rdquo;). Then — and this is the move —
      M.G. <em>stops talking</em>. Four seconds of silence. Maria fills it. The call
      is now a conversation, not a pitch.
    </aside>
    <div class="m1-modal__actions">${btn("Your turn →", "primary", "data-next")}</div>
  `, { wide: true });

  api.eventLog.record("worked_example_completed");
  await awaitNext(modal);
}

// --- 3:00–5:00 · Completion problem ------------------------------------
async function eventCompletionProblem() {
  return new Promise(resolve => {
    const choices = [
      { id: "A", text: "Do you have a moment to talk about your corporate spending?",
        keyed: false, note: "This is the P.B. pattern in GC-19 — Maria hung up at 0:08." },
      { id: "B", text: "I noticed on Companies House you've opened a second location in the last 6 months — who's approving expense reports across both stores now?",
        keyed: true,  note: "Correct. This is the GC-01 pattern. Specific signal + who-controls-what question. Now wait 5 seconds." },
      { id: "C", text: "Our card is cheaper than your bank's — worth 10 minutes?",
        keyed: false, note: "P.B. fees-argument pattern (GC-20). Call ended at 0:24." },
      { id: "D", text: "We help SMB owners get real-time visibility into their team spend. Can I tell you more?",
        keyed: false, note: "Pitch-launch pattern (GC-17). Buyer hung up at 0:22 — no diagnostic asked." },
    ];

    const modal = renderStage(`
      <p class="m1-modal__eyebrow">Completion problem · 3:00</p>
      <h2 id="m1-modal-title" class="m1-modal__title">Same buyer. You open. Which line?</h2>
      <p class="m1-modal__lede">Maria · retail SMB · 2 stores · 35 FTE. Companies House shows a second location filed January. Pick the line you&rsquo;d open with.</p>
      <div class="m1-choices" role="radiogroup" aria-label="Pick the best M1 opener">
        ${choices.map(c => `
          <button type="button" class="m1-choice" data-id="${c.id}" role="radio" aria-checked="false">
            <span class="m1-choice__letter">${c.id}.</span> ${escapeHtml(c.text)}
          </button>
        `).join("")}
      </div>
      <div class="m1-feedback" id="m1-comp-feedback" hidden></div>
      <div class="m1-modal__actions" id="m1-comp-actions" hidden>
        ${btn("Continue →", "primary", "data-next")}
      </div>
    `);

    const buttons = modal?.querySelectorAll(".m1-choice");
    const feedback = modal?.querySelector("#m1-comp-feedback");
    const actions = modal?.querySelector("#m1-comp-actions");

    buttons?.forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-id");
        const choice = choices.find(c => c.id === id);
        if (!choice) return;
        buttons.forEach(x => x.setAttribute("disabled", "true"));
        b.setAttribute("data-state", choice.keyed ? "correct" : "wrong");
        b.setAttribute("aria-checked", "true");
        if (feedback) {
          feedback.hidden = false;
          feedback.className = `m1-feedback ${choice.keyed ? "m1-feedback--ok" : "m1-feedback--wrong"}`;
          feedback.textContent = choice.note;
        }
        if (actions) actions.hidden = false;
        api.eventLog.record("diagnostic_delivered", {
          specificity_score: choice.keyed ? 3 : 0,
          signal_id: choice.keyed ? "second-location" : null,
          word_count: choice.text.split(/\s+/).length,
        });
        modal?.querySelector("[data-next]")?.addEventListener("click", () => {
          api.eventLog.record("completion_problem_completed");
          resolve();
        }, { once: true });
      });
    });
  });
}

// --- 5:00–8:00 · Solo problem (Emma · manufacturing) -------------------
async function eventSoloProblem() {
  const emma = data.prospects.find(p => p.id === "EMMA") ?? data.prospects[0];
  api.os.openApp("linkedin-ch", { activeProfileId: emma?.id });
  api.os.openApp("outreach");

  // -- 5.1 · pick a signal --------------------------------------------
  let selectedSignal = null;
  await new Promise(resolve => {
    const modal = renderStage(`
      <p class="m1-modal__eyebrow">Solo · 5:00 · Step 1 of 3</p>
      <h2 id="m1-modal-title" class="m1-modal__title">${escapeHtml(emma.name)} · ${escapeHtml(emma.company)}</h2>
      <p class="m1-modal__lede">
        ${escapeHtml(emma.industry)} · ${emma.fte} FTE · &euro;${(emma.monthly_spend/1000).toFixed(0)}K/mo card spend.
        Pick <strong>one</strong> signal you&rsquo;d anchor your diagnostic on.
      </p>
      <div class="m1-signals" role="radiogroup" aria-label="Pick one signal">
        ${emma.signals.map((s, i) => `
          <button type="button" class="m1-signal" data-i="${i}" aria-pressed="false">
            <span class="m1-signal__type">${escapeHtml(s.source)}</span>
            <span class="m1-signal__text">${escapeHtml(s.content)}</span>
          </button>
        `).join("")}
      </div>
      <div class="m1-modal__actions">
        <button type="button" class="m1-btn m1-btn--primary" data-next disabled aria-disabled="true">Next → draft the question</button>
      </div>
    `);
    const next = modal?.querySelector("[data-next]");
    modal?.querySelectorAll(".m1-signal").forEach(b => {
      b.addEventListener("click", () => {
        modal.querySelectorAll(".m1-signal").forEach(x => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        selectedSignal = parseInt(b.getAttribute("data-i") || "0", 10);
        next?.removeAttribute("disabled");
        next?.removeAttribute("aria-disabled");
      });
    });
    next?.addEventListener("click", () => { if (selectedSignal !== null) resolve(); }, { once: true });
  });

  // -- 5.2 · draft the diagnostic --------------------------------------
  let draftText = "";
  let specificityScore = 0;
  await new Promise(resolve => {
    const modal = renderStage(`
      <p class="m1-modal__eyebrow">Solo · 6:00 · Step 2 of 3</p>
      <h2 id="m1-modal-title" class="m1-modal__title">Phrase your diagnostic.</h2>
      <p class="m1-modal__lede">&le; 15 words. Pair the signal with a who-controls-what question. Don&rsquo;t pitch.</p>
      <label class="sr-only" for="m1-draft-input">Diagnostic question</label>
      <textarea id="m1-draft-input" class="m1-draft" maxlength="200"
        placeholder="e.g. I saw you've grown headcount 18% — who's currently approving supplier card spend?"></textarea>
      <div class="m1-meter">
        <span><span id="m1-word-count">0</span> / 15 words</span>
        <span id="m1-meter-hint">Specific signal + who-controls-what works best.</span>
      </div>
      <div class="m1-modal__actions">
        ${btn("Show me the move (hint)", "ghost", "data-hint")}
        ${btn("Dial Emma →", "primary", "data-next")}
      </div>
    `);
    const input = modal?.querySelector("#m1-draft-input");
    const counter = modal?.querySelector("#m1-word-count");
    const meter = modal?.querySelector(".m1-meter");
    input?.addEventListener("input", () => {
      const words = input.value.trim().split(/\s+/).filter(Boolean);
      if (counter) counter.textContent = String(words.length);
      meter?.setAttribute("data-over", String(words.length > 15));
    });
    modal?.querySelector("[data-hint]")?.addEventListener("click", () => {
      if (input) {
        input.value = "I saw Brightline's headcount up 18% — who's approving supplier card spend across the 3 shifts now?";
        input.dispatchEvent(new Event("input"));
      }
      api.eventLog.record("hint_used", { where: "solo_draft", hint_id: "mg-pattern" });
    });
    modal?.querySelector("[data-next]")?.addEventListener("click", () => {
      draftText = (input?.value || "").trim();
      const words = draftText.split(/\s+/).filter(Boolean);
      const hasSignal = /(headcount|growth|18%|location|shift|filing|hiring|supervisor|sage|procurement)/i.test(draftText);
      const hasWhoQ  = /\bwho\b|\bhow\b/i.test(draftText);
      const lenOk    = words.length > 0 && words.length <= 15;
      specificityScore = (hasSignal ? 1 : 0) + (hasWhoQ ? 1 : 0) + (lenOk ? 1 : 0);
      api.eventLog.record("diagnostic_delivered", {
        specificity_score: specificityScore,
        signal_id: selectedSignal !== null ? `signal_${selectedSignal}` : null,
        word_count: words.length,
      });
      resolve();
    }, { once: true });
  });

  // -- 5.3 · silence countdown + buyer response ------------------------
  api.os.openApp("phone-dialler", { archetype: "factory", calling: "Emma" });
  await new Promise(resolve => {
    renderStage(`
      <p class="m1-modal__eyebrow">Solo · 7:00 · Step 3 of 3</p>
      <h2 id="m1-modal-title" class="m1-modal__title">You delivered the question. Now — wait.</h2>
      <p class="m1-modal__lede" id="m1-silence-lede">The buyer is thinking. 5 seconds will feel like an hour. <strong>Do not fill the silence.</strong></p>
      <div class="m1-silence" aria-live="polite" id="m1-silence-block">
        <div class="m1-silence__ring"><span id="m1-silence-count">5</span></div>
        <p class="m1-silence__hint">buyer is thinking…</p>
      </div>
      <div class="m1-modal__actions" id="m1-silence-actions" hidden>
        ${btn("Continue →", "primary", "data-next")}
      </div>
    `);
    let t = 5;
    const counter = document.getElementById("m1-silence-count");
    const tick = setInterval(() => {
      t -= 1;
      if (counter) counter.textContent = String(Math.max(0, t));
      if (t <= 0) {
        clearInterval(tick);
        api.eventLog.record("silence_observed", { duration_ms: 5000 });
        const silence = document.getElementById("m1-silence-block");
        const lede    = document.getElementById("m1-silence-lede");
        if (silence) silence.outerHTML = `
          <div class="m1-transcript">
            <div class="m1-transcript__turn">
              <span class="m1-transcript__ts">[0:05]</span>
              <span class="m1-transcript__speaker">Emma</span>
              <span class="m1-transcript__text">
                Honestly? Finance tags four hundred transactions a month by hand. Sage doesn&rsquo;t see the job-numbers.
              </span>
            </div>
          </div>
        `;
        if (lede) lede.textContent =
          "She filled the silence. You now have the actual broken thing — and the rest of the call writes itself.";
        const actions = document.getElementById("m1-silence-actions");
        if (actions) actions.hidden = false;
        actions?.querySelector("[data-next]")?.addEventListener("click", () => {
          api.eventLog.record("solo_problem_completed");
          resolve();
        }, { once: true });
      }
    }, 1000);
  });

  return { specificityScore };
}

// --- 8:00–9:00 · Feedback · rubric self-score --------------------------
async function eventFeedback(soloResult) {
  return new Promise(resolve => {
    const inferred = Math.max(1, Math.min(5, 2 + (soloResult?.specificityScore ?? 0)));
    const modal = renderStage(`
      <p class="m1-modal__eyebrow">Feedback · 8:00</p>
      <h2 id="m1-modal-title" class="m1-modal__title">Score yourself the way your manager will.</h2>
      <p class="m1-modal__lede">Three rows. This is the L3 rubric your pod manager uses on real Gong calls from week 4 onwards. Self-coaching, not surveillance.</p>
      <div class="m1-rubric" role="group" aria-label="L3 rubric · self-score">
        <div class="m1-rubric__row m1-rubric__row--target">
          <span class="m1-rubric__move">M1</span>
          <span class="m1-rubric__anchor">Buyer-specific diagnostic anchored to one signal, &le; 15 words.</span>
          <span class="m1-rubric__score" data-row="m1">${[1,2,3,4,5].map(n=>`<button type="button" aria-pressed="false" aria-label="M1 score ${n}">${n}</button>`).join("")}</span>
        </div>
        <div class="m1-rubric__row">
          <span class="m1-rubric__move">M2</span>
          <span class="m1-rubric__anchor">Objection restated in buyer&rsquo;s own words before responding. <em>(Module 2)</em></span>
          <span class="m1-rubric__score" data-row="m2">${[1,2,3,4,5].map(n=>`<button type="button" aria-pressed="false" aria-label="M2 score ${n}" disabled>${n}</button>`).join("")}</span>
        </div>
        <div class="m1-rubric__row">
          <span class="m1-rubric__move">M3</span>
          <span class="m1-rubric__anchor">Two specific slots stated, invite sent during the call. <em>(Module 3)</em></span>
          <span class="m1-rubric__score" data-row="m3">${[1,2,3,4,5].map(n=>`<button type="button" aria-pressed="false" aria-label="M3 score ${n}" disabled>${n}</button>`).join("")}</span>
        </div>
      </div>
      <div class="m1-modal__actions">
        <button type="button" class="m1-btn m1-btn--primary" data-next disabled aria-disabled="true">Take the quiz →</button>
      </div>
    `);
    const next = modal?.querySelector("[data-next]");
    const m1Row = modal?.querySelector("[data-row='m1']");
    const inferredBtn = m1Row?.querySelectorAll("button")[inferred - 1];
    if (inferredBtn instanceof HTMLElement) {
      inferredBtn.style.boxShadow = "0 0 0 3px var(--ftc-green-tint, #e6f7f0)";
      inferredBtn.title = "Suggested anchor based on your solo call";
    }
    m1Row?.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => {
        m1Row.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        next?.removeAttribute("disabled");
        next?.removeAttribute("aria-disabled");
      });
    });
    next?.addEventListener("click", () => resolve(), { once: true });
  });
}

// --- 9:00–9:30 · End-of-module quiz (3 items) --------------------------
async function eventQuiz() {
  let correct = 0;
  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];
    const result = await renderQuizItem(q, i + 1, data.quiz.length);
    if (result) correct += 1;
  }
  const scorePct = Math.round((correct / data.quiz.length) * 100);
  return { correct, total: data.quiz.length, scorePct };
}

function renderQuizItem(q, n, total) {
  return new Promise(resolve => {
    const modal = renderStage(`
      <p class="m1-modal__eyebrow">Quiz · ${n} of ${total} · ${escapeHtml(q.lo_id)}</p>
      <h2 id="m1-modal-title" class="m1-modal__title">${escapeHtml(q.stem)}</h2>
      <div class="m1-choices" role="radiogroup" aria-label="Quiz item ${n}">
        ${q.choices.map(c => `
          <button type="button" class="m1-choice" data-id="${c.id}" role="radio" aria-checked="false">
            <span class="m1-choice__letter">${c.id}.</span> ${escapeHtml(c.text)}
          </button>
        `).join("")}
      </div>
      <div class="m1-feedback" id="m1-qz-fb" hidden></div>
      <div class="m1-modal__actions" id="m1-qz-actions" hidden>
        ${btn(n === total ? "See your score →" : "Next item →", "primary", "data-next")}
      </div>
    `);
    const fb = modal?.querySelector("#m1-qz-fb");
    const actions = modal?.querySelector("#m1-qz-actions");
    modal?.querySelectorAll(".m1-choice").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-id");
        const choice = q.choices.find(c => c.id === id);
        if (!choice) return;
        modal.querySelectorAll(".m1-choice").forEach(x => x.setAttribute("disabled", "true"));
        b.setAttribute("data-state", choice.keyed ? "correct" : "wrong");
        b.setAttribute("aria-checked", "true");
        if (fb) {
          fb.hidden = false;
          fb.className = `m1-feedback ${choice.keyed ? "m1-feedback--ok" : "m1-feedback--wrong"}`;
          fb.textContent = choice.feedback;
        }
        if (actions) actions.hidden = false;
        modal.querySelector("[data-next]")?.addEventListener("click", () => resolve(!!choice.keyed), { once: true });
      });
    });
  });
}

// --- 9:30–10:00 · Key-takeaway + spaced-retrieval ---------------------
async function eventRetention(quizResult) {
  return new Promise(resolve => {
    const modal = renderStage(`
      <p class="m1-modal__eyebrow">Key takeaway · 9:30</p>
      <h2 id="m1-modal-title" class="m1-modal__title">Module 1 complete.</h2>
      <div class="m1-takeaway">
        <p>&ldquo;Pick one signal. Phrase one question. Wait five seconds. The buyer fills the silence — that&rsquo;s where the call begins.&rdquo;</p>
        <cite>— M.G., Manchester pod</cite>
      </div>
      <p class="m1-modal__lede">
        You scored <strong>${quizResult.correct} / ${quizResult.total}</strong> (${quizResult.scorePct}%).
        ${quizResult.scorePct >= 80 ? "Mastery threshold met." : "Below 80% — you&rsquo;ll see this content again in 24 hours."}
      </p>
      <div class="m1-schedule-note" role="note">
        <span aria-hidden="true">📆</span>
        <span>Spaced-retrieval mini-quiz auto-scheduled for <strong>+7 days</strong> · 3 novel items on LO-M1.1 / LO-M1.2 / LO-M1.3.</span>
      </div>
      <div class="m1-modal__actions">${btn("Finish module", "primary", "data-next")}</div>
    `);
    modal?.querySelector("[data-next]")?.addEventListener("click", () => resolve(), { once: true });
  });
}

// ============================================================
// 3 · Utilities
// ============================================================

function formatTs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function startProgressClock() {
  const el = document.getElementById("module-progress");
  if (!el) return;
  const start = performance.now();
  const tick = () => {
    const elapsed = Math.floor((performance.now() - start) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    el.textContent = `${m}:${String(s).padStart(2,"0")} / 10:00`;
    if (elapsed < 600) setTimeout(tick, 1000);
  };
  tick();
}

// ============================================================
// 4 · Boot
// ============================================================

await loadData();

bootModule({
  moduleId: "M1",
  title: "Module 1 · The Diagnostic Opener",
  appsToLaunch: [],
  onReady(_api) {
    api = _api;
    startProgressClock();

    api.coachMarks?.show?.({
      id: "m1-help",
      anchor: "#help-button",
      text: "Stuck? The 3-move card + ICP card live in Slack — pinned.",
    });

    (async () => {
      try {
        await eventGainAttention();
        await eventStateOutcome();
        await eventRecallPrior();
        await eventWorkedExample();
        await eventCompletionProblem();
        const solo = await eventSoloProblem();
        await eventFeedback(solo);
        const quiz = await eventQuiz();
        await eventRetention(quiz);

        api.scorm?.setScore?.(quiz.scorePct);
        api.scorm?.setStatus?.(quiz.scorePct >= 80 ? "completed" : "incomplete");
        api.complete(quiz.scorePct);

        clearStage();
        const desktop = document.getElementById("desktop");
        if (desktop) desktop.innerHTML = `
          <div class="desktop-empty-state" style="text-align:center; padding:48px;">
            <h1 style="font-size:28px; margin:0 0 8px;">Module 1 complete</h1>
            <p style="color: var(--ftc-ink-2, #475467);">See you in Module 2 — when the buyer pushes back.</p>
          </div>
        `;
      } catch (err) {
        console.error("[M1] timeline aborted:", err);
      }
    })();
  },
  onComplete() { /* shell logs completion automatically via eventLog */ },
});
