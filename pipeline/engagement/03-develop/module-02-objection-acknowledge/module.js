/**
 * Module 2 · Objection Acknowledge — Gagné timeline implementation.
 *
 * Storyboard: 02-design/module-storyboards/M2-objection-acknowledge.md
 * LOs: LO-M2.1 (classify ≤3s) · LO-M2.2 (restate, ≥2 buyer-word overlap) · LO-M2.3 (open follow-up).
 * Worked examples: GC-06 L.D.+Tom (Brex) · GC-06b M.G.+Maria (Visa).
 * Anti-pattern contrasts: GC-09 (mid argued) · GC-19 (bottom argued, P.B. §10.4).
 * Solo: random objection from objection-bank.json → restate_word_overlap event.
 *
 * Imports bootModule from ../scorm-shell/js/shell.js (per scorm-shell/README §3).
 */

import { bootModule } from "../scorm-shell/js/shell.js";

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

async function loadData() {
  const [transcripts, prospects, bank, quiz] = await Promise.all([
    fetch("./data/transcripts.json").then(r => r.json()),
    fetch("./data/prospects.json").then(r => r.json()),
    fetch("./data/objection-bank.json").then(r => r.json()),
    fetch("./data/quiz.json").then(r => r.json()),
  ]);
  return { transcripts, prospects, bank, quiz };
}

// ---------------------------------------------------------------------------
// Tokenisation — used by restate_word_overlap scoring (LO-M2.2).
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  "the","a","an","of","to","in","on","for","and","or","but","we","you","i",
  "is","are","was","were","be","been","am","do","does","did","it","this",
  "that","those","these","my","our","your","their","his","her","its","with",
  "at","by","from","as","not","no","so","if","then","than","up","down","out",
  "have","has","had","get","got","just","very","already","use","using","used",
  "like","about","really"
]);

function tokenise(s) {
  return new Set(
    (s ?? "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .split(/\s+/)
      .filter(w => w && !STOPWORDS.has(w) && w.length > 2)
  );
}

function wordOverlap(repText, buyerText) {
  const r = tokenise(repText);
  const b = tokenise(buyerText);
  let overlap = 0;
  for (const w of r) if (b.has(w)) overlap++;
  return overlap;
}

const REBUTTAL_TOKENS = ["but","however","actually","cheaper","lower","better","wrong","superior"];
function rebuttalTokens(s) {
  const lc = (s ?? "").toLowerCase();
  return REBUTTAL_TOKENS.filter(t => new RegExp(`\\b${t}\\b`).test(lc));
}

// ---------------------------------------------------------------------------
// Stage controller — renders into #m2-stage.
// ---------------------------------------------------------------------------

class Stage {
  constructor(root, api, data) {
    this.root = root;
    this.api = api;
    this.data = data;
    this.score = { completion: 0, solo: 0, quiz: 0 };
    this.stages = ["trigger","outcome","recall","workedA","workedB","completion","solo","debrief","quiz","retention"];
    this.cursor = 0;
    this.t0 = performance.now();
  }

  render() {
    const step = this.stages[this.cursor];
    this.root.innerHTML = "";
    this.root.appendChild(this._progressBar());
    const body = document.createElement("div");
    body.className = `m2-step m2-step--${step}`;
    this.root.appendChild(body);
    this[`stage_${step}`](body);
    body.querySelector("h2, h3, button, [tabindex]")?.focus?.({ preventScroll: true });
  }

  next() {
    this.cursor = Math.min(this.cursor + 1, this.stages.length - 1);
    this.render();
  }

  _progressBar() {
    const wrap = document.createElement("div");
    wrap.className = "m2-progress";
    wrap.setAttribute("aria-label", `Progress · step ${this.cursor + 1} of ${this.stages.length}`);
    this.stages.forEach((_, i) => {
      const cell = document.createElement("span");
      cell.dataset.state = i < this.cursor ? "done" : i === this.cursor ? "active" : "pending";
      wrap.appendChild(cell);
    });
    const pct = Math.round(((this.cursor) / (this.stages.length - 1)) * 100);
    const progEl = document.getElementById("module-progress");
    if (progEl) progEl.textContent = `${pct}%`;
    return wrap;
  }

  // 0:00–0:30 · Gain attention · GC-09 failure trigger
  stage_trigger(host) {
    const gc09 = this.data.transcripts.find(t => t.id === "GC-09");
    host.innerHTML = `
      <span class="meta">Stage 1 of 10 · 0:00–0:30</span>
      <h2 tabindex="-1">Listen first.</h2>
      <div class="m2-trigger">
        <span class="fail-tag">failure · ${gc09.id} · ended at ${gc09.ended_at}</span>
        <div class="m2-transcript" aria-label="Failed call transcript">
          ${gc09.lines.map(l => `
            <div class="line">
              <span class="ts">${l.ts}</span>
              <div><span class="speaker">${l.speaker}:</span>${l.text}</div>
            </div>`).join("")}
        </div>
        <p class="meta">Mid-band rep · call 3 of a tough day. Argued. Lost it at ${gc09.ended_at}.</p>
      </div>
      <div class="m2-actions">
        <button type="button" class="btn" data-next>Show me the move</button>
      </div>`;
    host.querySelector("[data-next]").addEventListener("click", () => this.next());
  }

  // 0:30–1:00 · State outcome
  stage_outcome(host) {
    host.innerHTML = `
      <span class="meta">Stage 2 of 10 · 0:30–1:00</span>
      <h2 tabindex="-1">By the end of 10 minutes…</h2>
      <p><strong>You restate every objection in the buyer's own words before you respond.</strong>
         You'll be surprised what the buyer says next.</p>
      <p class="meta">Brand-voice peer line, §18.2 — <em>"The argument feels natural. It's still wrong. Here's the move."</em></p>
      <div class="m2-actions">
        <button type="button" class="btn" data-next>Got it</button>
      </div>`;
    host.querySelector("[data-next]").addEventListener("click", () => this.next());
  }

  // 1:00–1:30 · Recall prior
  stage_recall(host) {
    host.innerHTML = `
      <span class="meta">Stage 3 of 10 · 1:00–1:30</span>
      <h2 tabindex="-1">Recall · Module 1.</h2>
      <p>Last module you <strong>opened with a diagnostic</strong> and tolerated 5 seconds of silence.</p>
      <p>This module assumes the buyer pushed back. <strong>One job: re-state, don't argue.</strong></p>
      <div class="m2-actions">
        <button type="button" class="btn" data-next>Next</button>
      </div>`;
    host.querySelector("[data-next]").addEventListener("click", () => this.next());
  }

  // 1:30–2:15 · Worked example A · GC-06 L.D. + Tom (Brex)
  stage_workedA(host) {
    const gc = this.data.transcripts.find(t => t.id === "GC-06");
    this._renderWorked(host, gc, "Stage 4 of 10 · 1:30–2:15", "Worked example · L.D. handles Brex");
    try { this.api.os?.openApp?.("gong"); } catch (_) {}
  }

  // 2:15–3:00 · Worked example B · M.G. + Maria (Visa)
  stage_workedB(host) {
    const gc = this.data.transcripts.find(t => t.id === "GC-06b");
    this._renderWorked(host, gc, "Stage 5 of 10 · 2:15–3:00", "Worked example · M.G. handles Visa");
  }

  _renderWorked(host, gc, meta, title) {
    host.innerHTML = `
      <span class="meta">${meta}</span>
      <h2 tabindex="-1">${title}</h2>
      <p class="meta">${gc.id} · ${gc.rep} · prospect: ${gc.prospect_name} (${gc.prospect_archetype})</p>
      <div class="m2-transcript" aria-label="Worked example transcript">
        ${gc.lines.map(l => {
          if (l.silence) return `<div class="silence" aria-label="silence ${l.silence} seconds">[silence ${l.silence}s]</div>`;
          const m2 = l.m_move_tag === "M2";
          return `
            <div class="line ${m2 ? "line--m2" : ""}">
              <span class="ts">${l.ts}</span>
              <div>
                <span class="speaker">${l.speaker}:</span>${l.text}
                ${m2 ? `<span class="chip" aria-label="M2 acknowledge move">[M2 ${l.move_label || "acknowledge"}]</span>` : ""}
              </div>
            </div>`;
        }).join("")}
      </div>
      <p>Notice: <strong>${gc.coach_phrase}</strong> — buyer's own words, no rebuttal.</p>
      <div class="m2-actions">
        <button type="button" class="btn" data-next>Your turn</button>
      </div>`;
    host.querySelector("[data-next]").addEventListener("click", () => this.next());
  }

  // 3:00–5:00 · Completion problem · Tom raises "We already use Brex"
  stage_completion(host) {
    const tom = this.data.prospects.find(p => p.lead_id === "L-002");
    const options = [
      { id: "A", text: "But our FX rates are lower than Brex — you'd save 0.5% per quarter.",
        correct: false, reason: "Argues on fees · GC-19 P.B. anti-pattern (§10.4). Bottom-quartile failure mode." },
      { id: "B", text: "Brex is great if you're US-based with USD spend. How does FX show up on your quarter?",
        correct: true,  reason: "Restate in buyer's frame, then surface FX wedge (L.D. verbatim, GC-06)." },
      { id: "C", text: "Have you compared the engineering APIs?",
        correct: false, reason: "Deflects — doesn't acknowledge the objection (GC-12 pattern)." },
      { id: "D", text: "Most Series-B teams switch off Brex within a year.",
        correct: false, reason: "Dismisses the buyer's prior choice — bridge burned." },
    ];

    host.innerHTML = `
      <span class="meta">Stage 6 of 10 · 3:00–5:00</span>
      <h2 tabindex="-1">${tom.name} (${tom.industry}) · completion problem</h2>
      <div class="m2-buyer-quote" role="figure" aria-label="Buyer objection">
        <span class="speaker">${tom.name} · buyer</span>
        "${tom.top_objection}"
      </div>
      <h3>Pick the response.</h3>
      <div class="m2-options" role="radiogroup" aria-label="Response options">
        ${options.map(o => `
          <button type="button" class="m2-option" role="radio" aria-checked="false"
                  data-opt="${o.id}" data-correct="${o.correct}">
            <strong>${o.id}.</strong> ${o.text}
          </button>`).join("")}
      </div>
      <div class="m2-feedback" hidden id="completion-fb"></div>
      <div class="m2-actions">
        <button type="button" class="btn" data-next disabled>Continue</button>
      </div>`;

    const fb = host.querySelector("#completion-fb");
    const cont = host.querySelector("[data-next]");
    host.querySelectorAll(".m2-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.opt;
        const opt = options.find(o => o.id === id);
        host.querySelectorAll(".m2-option").forEach(b => {
          b.setAttribute("aria-checked", "false");
          b.removeAttribute("data-state");
          b.disabled = true;
        });
        btn.setAttribute("aria-checked", "true");
        btn.dataset.state = opt.correct ? "correct" : "incorrect";
        fb.hidden = false;
        fb.textContent = (opt.correct ? "Correct. " : "Not quite. ") + opt.reason;
        if (opt.correct) this.score.completion = 1;
        if (opt.correct) {
          this.api.eventLog.record("objection_restated",
            { word_overlap: 4, family: "competitor_brex" });
        } else {
          this.api.eventLog.record("objection_argued",
            { rebuttal_tokens: rebuttalTokens(opt.text), family: "competitor_brex" });
        }
        this.api.eventLog.record("completion_problem_completed");
        cont.disabled = false;
      });
    });
    cont.addEventListener("click", () => this.next());
  }

  // 5:00–8:00 · Solo problem · random objection-bank pick
  stage_solo(host) {
    const bank = this.data.bank.slice();
    const pick = bank[Math.floor(Math.random() * bank.length)];
    let chosenFamily = null;
    const familyStart = performance.now();
    const families = ["bank_visa","competitor_brex","accountant_friction","trust_fintech","comp_distraction"];

    host.innerHTML = `
      <span class="meta">Stage 7 of 10 · 5:00–8:00</span>
      <h2 tabindex="-1">Solo · ${pick.prospect_name} (${pick.prospect_archetype})</h2>
      <div class="m2-objection-bank">
        <div class="m2-buyer-quote" role="figure" aria-label="Buyer objection">
          <span class="speaker">${pick.prospect_name} · buyer</span>
          "${pick.buyer_verbatim}"
        </div>

        <h3>1 · Classify (LO-M2.1 · ≤ 3 s)</h3>
        <div class="m2-family-chooser" role="group" aria-label="Objection family">
          ${families.map(f => `
            <button type="button" data-family="${f}" aria-pressed="false">
              ${f.replace(/_/g," ").toUpperCase()}
            </button>`).join("")}
        </div>

        <h3>2 · Restate in the buyer's own words (LO-M2.2)</h3>
        <label for="restate-in" class="meta">One sentence · re-use buyer nouns · no rebuttal</label>
        <textarea id="restate-in" class="m2-restate-input"
                  aria-describedby="overlap-meter"
                  placeholder="So you've got the … sorted — what's actually broken about it?"></textarea>
        <div id="overlap-meter" class="m2-overlap" aria-live="polite" data-band="weak">
          Word overlap: 0 · target ≥ 2 buyer words · rebuttal tokens: 0
        </div>

        <h3>3 · Anti-pattern · what NOT to do</h3>
        <button type="button" class="btn btn--ghost" data-antitoggle
                aria-expanded="false" aria-controls="ap-clip">
          Show the GC-19 P.B. contrast clip
        </button>
        <div id="ap-clip" class="m2-antipattern" hidden></div>
      </div>
      <div class="m2-actions">
        <button type="button" class="btn" data-submit disabled>Submit restate</button>
      </div>`;

    host.querySelectorAll("[data-family]").forEach(btn => {
      btn.addEventListener("click", () => {
        host.querySelectorAll("[data-family]").forEach(b => b.setAttribute("aria-pressed","false"));
        btn.setAttribute("aria-pressed","true");
        chosenFamily = btn.dataset.family;
        const elapsed_ms = performance.now() - familyStart;
        this.api.eventLog.record("objection_family_picked",
          { family: chosenFamily, correct: chosenFamily === pick.family, elapsed_ms });
        recompute();
      });
    });

    const input = host.querySelector("#restate-in");
    const meter = host.querySelector("#overlap-meter");
    const submit = host.querySelector("[data-submit]");
    const recompute = () => {
      const overlap = wordOverlap(input.value, pick.buyer_verbatim);
      const rebut = rebuttalTokens(input.value);
      meter.dataset.band = overlap >= 2 && rebut.length === 0 ? "strong"
                        : rebut.length > 0 ? "weak" : "neutral";
      meter.textContent = `Word overlap: ${overlap} · target ≥ 2 · rebuttal tokens: ${rebut.length}` +
                          (rebut.length ? ` (${rebut.join(", ")})` : "");
      submit.disabled = !(input.value.trim().length >= 8 && chosenFamily);
    };
    input.addEventListener("input", recompute);

    const apBtn = host.querySelector("[data-antitoggle]");
    const apClip = host.querySelector("#ap-clip");
    const gc19 = this.data.transcripts.find(t => t.id === "GC-19");
    apBtn.addEventListener("click", () => {
      const open = apBtn.getAttribute("aria-expanded") === "true";
      apBtn.setAttribute("aria-expanded", String(!open));
      apClip.hidden = open;
      if (!open) {
        apClip.innerHTML = `
          <p class="meta">${gc19.id} · ${gc19.rep} · ended ${gc19.ended_at} · argued on fees.</p>
          ${gc19.lines.map(l => `<div class="line"><span class="speaker">${l.speaker}:</span> ${l.text}</div>`).join("")}
          <p class="meta">P.B., §10.4 — <em>"I argue. I know I'm not supposed to."</em></p>`;
      }
    });

    submit.addEventListener("click", () => {
      const overlap = wordOverlap(input.value, pick.buyer_verbatim);
      const rebut = rebuttalTokens(input.value);
      this.api.eventLog.record("restate_word_overlap",
        { overlap, rebuttal_tokens: rebut, family: pick.family, prospect: pick.prospect_name });
      if (overlap >= 2 && rebut.length === 0) {
        this.api.eventLog.record("objection_restated", { word_overlap: overlap, family: pick.family });
        this.score.solo = 1;
      } else {
        this.api.eventLog.record("objection_argued", { rebuttal_tokens: rebut, family: pick.family });
      }
      this.api.eventLog.record("solo_problem_completed");
      this._renderSoloFeedback(host, pick, overlap, rebut);
    });
  }

  _renderSoloFeedback(host, pick, overlap, rebut) {
    const fb = document.createElement("div");
    fb.className = "m2-feedback";
    const pass = overlap >= 2 && rebut.length === 0;
    fb.innerHTML = `
      <strong>${pass ? "Anchor ≥ 4 on M2 rubric." : "Anchor ≤ 3 — try the move again next call."}</strong>
      Buyer-word overlap: <code>${overlap}</code>. Rebuttal tokens: <code>${rebut.length}</code>.<br>
      Ideal phrases that would have echoed: <em>${pick.ideal_phrases.join(" / ")}</em>.`;
    host.appendChild(fb);
    const actions = host.querySelector(".m2-actions");
    actions.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "btn"; btn.textContent = "Continue";
    btn.addEventListener("click", () => this.next());
    actions.appendChild(btn);
  }

  // 8:00–9:00 · Feedback · self-score against M2 rubric
  stage_debrief(host) {
    host.innerHTML = `
      <span class="meta">Stage 8 of 10 · 8:00–9:00</span>
      <h2 tabindex="-1">Self-score · M2 rubric row</h2>
      <p class="meta">L3 rubric row M2. Score yourself 1–5.</p>
      <fieldset class="m2-quiz-item">
        <legend>How did your restate land?</legend>
        ${[1,2,3,4,5].map(n => `
          <label style="display:block;margin:6px 0;">
            <input type="radio" name="self" value="${n}"> ${n} —
            ${n === 5 ? "Buyer revealed the actual broken thing."
            : n === 4 ? "Restate used buyer words; follow-up open."
            : n === 3 ? "Restate OK but follow-up closed."
            : n === 2 ? "Half-restate, half-rebut."
            : "Argued."}
          </label>`).join("")}
      </fieldset>
      <p class="m2-feedback">
        From P.B., §10.4 — the rep you just <strong>avoided becoming</strong>:
        <em>"I argue. I know I'm not supposed to. I just don't have anything better loaded."</em>
        You now have the move loaded.
      </p>
      <div class="m2-actions">
        <button type="button" class="btn" data-next>To the quiz</button>
      </div>`;
    host.querySelector("[data-next]").addEventListener("click", () => this.next());
  }

  // 9:00–9:30 · 3-item L2 quiz
  stage_quiz(host) {
    const items = this.data.quiz;
    const picks = {};
    host.innerHTML = `
      <span class="meta">Stage 9 of 10 · 9:00–9:30</span>
      <h2 tabindex="-1">Quiz · 3 items</h2>
      <div id="quiz-items"></div>
      <div class="m2-actions">
        <button type="button" class="btn" data-submitq disabled>Submit</button>
      </div>
      <div class="m2-feedback" id="quiz-fb" hidden></div>`;

    const qHost = host.querySelector("#quiz-items");
    items.forEach((it, idx) => {
      const fs = document.createElement("fieldset");
      fs.className = "m2-quiz-item";
      fs.innerHTML = `
        <legend>${idx + 1}. ${it.stem}</legend>
        <p class="meta">Evidence: ${it.lo}</p>
        ${it.options.map(o => `
          <label style="display:block;margin:6px 0;">
            <input type="radio" name="q-${it.id}" value="${o.id}"> ${o.id}. ${o.text}
          </label>`).join("")}`;
      qHost.appendChild(fs);
    });

    const submitBtn = host.querySelector("[data-submitq]");
    host.addEventListener("change", () => {
      const ok = items.every(it => host.querySelector(`input[name="q-${it.id}"]:checked`));
      submitBtn.disabled = !ok;
    });

    submitBtn.addEventListener("click", () => {
      let correct = 0;
      const lines = [];
      items.forEach(it => {
        const chosen = host.querySelector(`input[name="q-${it.id}"]:checked`)?.value;
        picks[it.id] = chosen;
        const right = chosen === it.correct;
        if (right) correct++;
        lines.push(`Q${it.id}: ${right ? "correct" : `picked ${chosen}, was ${it.correct} — ${it.feedback}`}`);
      });
      const pct = Math.round((correct / items.length) * 100);
      this.score.quiz = pct;
      const fb = host.querySelector("#quiz-fb");
      fb.hidden = false;
      fb.innerHTML = `<strong>${correct}/${items.length} · ${pct}%</strong><br>${lines.join("<br>")}`;
      this.api.eventLog.record("quiz_completed", { score: pct, picks });
      submitBtn.disabled = true;
      const cont = document.createElement("button");
      cont.className = "btn"; cont.textContent = "Continue"; cont.style.marginTop = "10px";
      cont.addEventListener("click", () => this.next());
      host.querySelector(".m2-actions").appendChild(cont);
    });
  }

  // 9:30–10:00 · Enhance retention/transfer
  stage_retention(host) {
    const elapsed = Math.round((performance.now() - this.t0) / 1000);
    const score = Math.round(
      (this.score.completion * 30) + (this.score.solo * 30) + (this.score.quiz * 0.40)
    );
    host.innerHTML = `
      <span class="meta">Stage 10 of 10 · 9:30–10:00</span>
      <h2 tabindex="-1">Key takeaway</h2>
      <blockquote style="border-left:3px solid var(--ftc-green-primary,#00b67a);padding:10px 14px;background:var(--ftc-green-tint,#e6f7f0);border-radius:6px;margin:0;">
        "Restate, then wait. The buyer tells you what's actually broken — that's where the pitch begins."
        <footer style="margin-top:6px;font-size:12px;color:var(--ftc-ink-2,#475467);">— M.G., Manchester pod (§10.1)</footer>
      </blockquote>
      <p class="meta">+7-day spaced mini-quiz auto-scheduled · L1 pulse fired · time on module: ${Math.floor(elapsed/60)}m ${elapsed%60}s.</p>
      <p>Score: <strong>${score}/100</strong> (completion ${this.score.completion*30} · solo ${this.score.solo*30} · quiz ${Math.round(this.score.quiz*0.40)}).</p>
      <div class="m2-actions">
        <button type="button" class="btn" data-finish>Mark module complete</button>
      </div>`;
    host.querySelector("[data-finish]").addEventListener("click", () => {
      this.api.complete(score);
      host.innerHTML = `<h2>Module complete.</h2><p>SCORM status: completed. Score: ${score}.</p>`;
    });
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

(async function main() {
  const data = await loadData();
  const api = bootModule({
    moduleId: "M2",
    title: "Module 2 · Objection Acknowledge",
    appsToLaunch: [
      { id: "gong",          options: {} },
      { id: "phone-dialler", options: {} },
      { id: "slack",         options: {} },
    ],
    onReady({ coachMarks }) {
      coachMarks?.show?.({
        id: "m2-restate-hint",
        anchor: "#m2-stage",
        text: "Restate, then wait. The buyer tells you what's broken.",
      });
    },
    onComplete() { /* shell handles persistence */ },
  });

  const root = document.getElementById("m2-stage");
  const stage = new Stage(root, api, data);
  stage.render();

  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key === "ArrowRight") {
      const nx = root.querySelector("[data-next]");
      if (nx && !nx.disabled) nx.click();
    }
  });
})().catch(err => {
  console.error("[M2] boot failed", err);
  document.getElementById("m2-stage").innerHTML =
    `<h2>Module failed to load</h2><pre>${String(err)}</pre>`;
});
