/**
 * module.js · Module 4 · ICP Buyer Fit (variability of practice)
 *
 * Architecture (Gagné event timeline per M4-icp-buyer-fit.md):
 *   0:00-0:30  Gain attention — 4-card archetype lineup (Maria/Tom/Emma/Lukas)
 *   0:30-1:00  State outcome   — LO-ICP.1 + LO-ICP.2
 *   1:00-1:30  Recall          — 3-move model + 4-prop model
 *   1:30-3:00  Worked example  — M1 pattern adapted to 2 archetypes side-by-side
 *                                (Maria retail vs Lukas restaurant DE)
 *   3:00-5:30  Drill D4        — 4 rapid LinkedIn-CH classification cards
 *                                (replaces canonical completion problem per
 *                                 4C/ID variability — Van Merriënboer Ch.10)
 *                                KPI: m4_archetype_classification_accuracy
 *   5:30-8:30  Solo problem    — 3 interleaved mini-calls (random permutation)
 *                                Per call: open LinkedIn-CH → pick M1 + prop →
 *                                buyer 2-line reply → M2 restate → calendar-close
 *                                KPI: m4_archetype_match_score (fires per call)
 *   8:30-9:00  Feedback        — 3-row archetype-fit self-score matrix
 *   9:00-9:30  Quiz            — 3 scenario items (LO-ICP.x)
 *   9:30-10:00 Take-away       — key line + +7d spaced retrieval
 *
 * Randomisation: seeded RNG (mulberry32) so manager calibration can replay runs.
 *
 * Per Phase 2 critic finding: if dry-run overruns ≤10 min budget, the module
 * falls back to 2 interleaved calls (not 3). Toggle via INTERLEAVED_CALLS const.
 *
 * @see 02-design/module-storyboards/M4-icp-buyer-fit.md
 * @see 02-design/4cid-blueprint.md §3.3 (variability) + §6 (part-task drills)
 * @see 02-design/learning-outcomes-abcd-bloom.md §4.4 (LO-ICP.1–4)
 */

// ============================================================================
// CONFIG
// ============================================================================

/** Number of interleaved calls in Solo block. 3 = full variability per
 *  storyboard; 2 = fallback per Phase 2 critic if dry-run overruns 10 min. */
const INTERLEAVED_CALLS = 3;

/** RNG seed — manager calibration can replay learner runs by passing
 *  ?seed=<int> on the URL. Default seed below for repeatable demos. */
const DEFAULT_SEED = 20260517;

/** Drill D4 card count. */
const DRILL_CARDS = 4;

/** Drill per-card flash window (seconds) — keystone rule: ≤5s per card. */
const DRILL_FLASH_S = 5;

/** Bloom-tagged learning outcomes hit by this module. */
const LOS = ["LO-ICP.1", "LO-ICP.2", "LO-ICP.3", "LO-ICP.4"];

// ============================================================================
// UTILITIES
// ============================================================================

/** Mulberry32 — fast, tiny seedable PRNG. Deterministic per seed. */
function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using a provided rng. */
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Get seed from URL or default. */
function getSeed() {
  const url = new URLSearchParams(globalThis.location?.search ?? "");
  const s = parseInt(url.get("seed") ?? "", 10);
  return Number.isFinite(s) ? s : DEFAULT_SEED;
}

/** Format mm:ss from seconds. */
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

const ARCHETYPE_GLYPH = {
  storefront: "🏬",
  rocket:     "🚀",
  factory:    "🏭",
  forkKnife:  "🍴",
};
const ARCHETYPE_NAME = {
  storefront: "Maria",
  rocket:     "Tom",
  factory:    "Emma",
  forkKnife:  "Lukas",
};
const ARCHETYPE_TAGLINE = {
  storefront: "Retail SMB owner · UK · behavioural",
  rocket:     "Series-B SaaS founder · quant",
  factory:    "Manufacturing ops · accountant-sensitive",
  forkKnife:  "DE restaurant group · trust-first",
};

// ============================================================================
// DATA LOADERS
// ============================================================================

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`load failed: ${path}`);
  return res.json();
}

// ============================================================================
// MAIN ENTRY
// ============================================================================

/**
 * Module 4 runner. Called by index.html once bootModule has returned.
 * @param {import("../scorm-shell/js/shell.js").BootApi} ctx
 */
export async function runModule4(ctx) {
  const seed = getSeed();
  const rng = makeRng(seed);

  const [prospects, transcripts, quiz] = await Promise.all([
    loadJson("./data/prospects.json"),
    loadJson("./data/transcripts.json"),
    loadJson("./data/quiz.json"),
  ]);

  const state = {
    seed, rng, prospects, transcripts, quiz,
    drillResults: [],
    soloResults: [],
    quizPicks: [],
    startTs: performance.now(),
  };

  startProgressTicker();

  await gainAttention(ctx, state);
  await stateOutcome(ctx, state);
  await recallPrior(ctx, state);
  await workedExample(ctx, state);
  await drillD4(ctx, state);
  await soloProblem(ctx, state);
  await feedbackMatrix(ctx, state);
  const score = await quizBlock(ctx, state);
  await takeawayCard(ctx, state, score);

  ctx.complete(score);
}

// ============================================================================
// PROGRESS TICKER
// ============================================================================

function startProgressTicker() {
  const el = document.getElementById("module-progress");
  if (!el) return;
  const t0 = performance.now();
  const id = setInterval(() => {
    const elapsed = (performance.now() - t0) / 1000;
    el.textContent = `${fmtTime(elapsed)} / 10:00`;
    if (elapsed >= 600) clearInterval(id);
  }, 1000);
}

// ============================================================================
// 0:00-0:30 · GAIN ATTENTION — 4-card archetype lineup
// ============================================================================

function gainAttention(ctx, state) {
  const stage = document.getElementById("m4-stage");
  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-gain-h">
      <h1 id="m4-gain-h">Three dials. Three buyers. Three minutes.</h1>
      <p class="lead">
        Real day: the pattern-match has to be fast. M1, M2, M3 are locked —
        but which buyer you're talking to changes the opener, the objection,
        and the prop.
      </p>
      <div class="archetype-lineup" role="list" aria-label="The four ICP archetypes">
        ${["storefront","rocket","factory","forkKnife"].map(a => `
          <div class="archetype-card" data-archetype="${a}" role="listitem">
            <span class="icon-circle" aria-hidden="true">${ARCHETYPE_GLYPH[a]}</span>
            <div class="name">${ARCHETYPE_NAME[a]}</div>
            <div class="tagline">${ARCHETYPE_TAGLINE[a]}</div>
          </div>
        `).join("")}
      </div>
      <button type="button" class="m4-cta" data-action="next">Got it · next</button>
    </section>
  `;
  return waitForClick(stage, "[data-action='next']");
}

// ============================================================================
// 0:30-1:00 · STATE OUTCOME
// ============================================================================

function stateOutcome(ctx, state) {
  const stage = document.getElementById("m4-stage");
  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-outcome-h">
      <h1 id="m4-outcome-h">What you'll do in the next 10 minutes</h1>
      <div class="m4-outcome">
        Pick the buyer in under 5 seconds and run M1 + M2 + M3 against three of
        them back-to-back — without warming up between calls.
        <small>Outcomes: LO-ICP.1 (classify archetype) · LO-ICP.2 (best opener + prop).</small>
      </div>
      <p class="muted">
        4C/ID variability of practice — the three calls are interleaved, not
        blocked. You can't pattern-match on a single archetype's cues.
      </p>
      <button type="button" class="m4-cta" data-action="next">Ready</button>
    </section>
  `;
  return waitForClick(stage, "[data-action='next']");
}

// ============================================================================
// 1:00-1:30 · RECALL PRIOR — 3-move + 4-prop models
// ============================================================================

function recallPrior(ctx, state) {
  const stage = document.getElementById("m4-stage");
  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-recall-h">
      <h1 id="m4-recall-h">Two models already in your head</h1>
      <h2>The 3-move model (M1 / M2 / M3)</h2>
      <ul>
        <li><strong>M1 Diagnostic.</strong> One specific question off LinkedIn or Companies House. Wait 4 seconds.</li>
        <li><strong>M2 Acknowledge.</strong> Restate the objection in the buyer's own words. Then ask the one follow-up.</li>
        <li><strong>M3 Calendar close.</strong> Two slots, named aloud, invite sent during the call.</li>
      </ul>
      <h2>The 4 product props</h2>
      <ol>
        <li>Real-time spend control — owners who got burned by expense fraud.</li>
        <li>Multi-user cards + per-card limits — growing teams, scale-ups.</li>
        <li>Auto-FX at interbank — cross-border SMBs.</li>
        <li>Receipt capture + accounting sync — bookkeeping-painful operations.</li>
      </ol>
      <button type="button" class="m4-cta" data-action="next">Onto the worked example</button>
    </section>
  `;
  return waitForClick(stage, "[data-action='next']");
}

// ============================================================================
// 1:30-3:00 · WORKED EXAMPLE — same M1 pattern × 2 archetypes (Mayer signalling)
// ============================================================================

function workedExample(ctx, state) {
  const stage = document.getElementById("m4-stage");
  const left  = state.transcripts.find(t => t.archetype === "storefront");
  const right = state.transcripts.find(t => t.archetype === "forkKnife");

  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-worked-h">
      <h1 id="m4-worked-h">Same move, two domains</h1>
      <p class="lead">
        The <strong>M1 diagnostic</strong> structure is identical — signal +
        who-controls-what question. Watch how the framing flexes to the buyer.
      </p>
      <div class="worked-pair">
        ${[left, right].map(t => `
          <article class="worked-card" data-archetype="${t.archetype}"
                   style="--a-cue: ${t.archetype === 'storefront' ? '#d97706' : '#00875f'}">
            <header>
              <span class="icon-circle" aria-hidden="true">${ARCHETYPE_GLYPH[t.archetype]}</span>
              <span class="who">${escapeHtml(t.who)}</span>
              <span class="domain">${escapeHtml(t.domain)}</span>
            </header>
            <div class="worked-line" data-move="signal">
              <span class="label">Signal</span>
              <span class="text">${escapeHtml(t.signal)}</span>
            </div>
            <div class="worked-line" data-move="M1">
              <span class="label">M1</span>
              <span class="text">"${escapeHtml(t.m1_line)}"</span>
            </div>
            <div class="worked-line" data-move="prop">
              <span class="label">Prop</span>
              <span class="text">${escapeHtml(t.prop_pitch)}</span>
            </div>
          </article>
        `).join("")}
      </div>
      <p class="muted">
        Mayer signalling: the <strong>M1</strong> label is the same colour on
        both cards — a redundant cue that the underlying move hasn't changed,
        only the buyer's domain has.
      </p>
      <button type="button" class="m4-cta" data-action="next">Got the pattern · drill me</button>
    </section>
  `;
  ctx.eventLog.record("worked_example_completed");
  return waitForClick(stage, "[data-action='next']");
}

// ============================================================================
// 3:00-5:30 · DRILL D4 — 4 LinkedIn-CH cards, classify archetype in ≤ 5 s
// ============================================================================

async function drillD4(ctx, state) {
  const stage = document.getElementById("m4-stage");
  const real = ["storefront","rocket","factory","forkKnife"]
    .map(a => state.prospects.find(p => p.archetype === a))
    .filter(Boolean);
  const cards = shuffle(real, state.rng).slice(0, DRILL_CARDS);

  for (let i = 0; i < cards.length; i++) {
    await runDrillCard(ctx, state, stage, cards[i], i + 1, cards.length);
  }

  const correct = state.drillResults.filter(r => r.correct).length;
  const accuracy = correct / state.drillResults.length;
  ctx.eventLog.record("completion_problem_completed");
  ctx.eventLog.record("drill_d4_summary", {
    correct, total: state.drillResults.length,
    m4_archetype_classification_accuracy: accuracy,
  });

  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-drill-end-h">
      <h1 id="m4-drill-end-h">Drill complete · ${correct}/${cards.length} archetype calls correct</h1>
      <p class="lead">
        ${accuracy >= 0.75
          ? "Pattern locked. Now run the moves against three of them — interleaved."
          : "Below the 75% bar — the Solo block reinforces. Watch the side-rail steps."}
      </p>
      <button type="button" class="m4-cta" data-action="next">Open the workspace</button>
    </section>
  `;
  return waitForClick(stage, "[data-action='next']");
}

function runDrillCard(ctx, state, stage, card, idx, total) {
  return new Promise(resolve => {
    let timeLeft = DRILL_FLASH_S;
    const start = performance.now();
    stage.innerHTML = `
      <section class="m4-panel" aria-labelledby="m4-drill-h">
        <h1 id="m4-drill-h">Drill D4 · card ${idx} of ${total}</h1>
        <p class="lead">≤ 5 seconds. Use number keys <kbd>1</kbd>–<kbd>4</kbd> or click.</p>
        <div class="drill-shell">
          <div class="drill-card" tabindex="0" aria-label="Drill card ${idx}">
            <div class="drill-meta">
              <span>LinkedIn / Companies House preview</span>
              <span class="drill-timer" aria-live="polite" id="drill-timer">${timeLeft}s</span>
            </div>
            <dl class="drill-rows">
              <dt>Industry</dt><dd>${escapeHtml(card.industry)}</dd>
              <dt>FTE</dt><dd>${card.fte}</dd>
              <dt>Spend</dt><dd>≈ €${card.monthly_spend.toLocaleString()}/mo</dd>
              <dt>Stage</dt><dd>${escapeHtml(card.stage)}</dd>
            </dl>
            <div class="drill-keys" role="group" aria-label="Pick the archetype">
              ${["storefront","rocket","factory","forkKnife"].map((a, i) => `
                <button type="button" data-pick="${a}" aria-label="${ARCHETYPE_NAME[a]}">
                  <span aria-hidden="true">${ARCHETYPE_GLYPH[a]}</span>
                  <span>${ARCHETYPE_NAME[a]}</span>
                  <kbd>${i + 1}</kbd>
                </button>
              `).join("")}
            </div>
          </div>
          <aside class="drill-sidebar" aria-label="Drill progress">
            <h3>Progress</h3>
            <div class="drill-stats">
              <div>Card</div><div class="v">${idx}/${total}</div>
              <div>Correct so far</div><div class="v">${state.drillResults.filter(r => r.correct).length}</div>
            </div>
          </aside>
        </div>
      </section>
    `;

    const cardEl = stage.querySelector(".drill-card");
    const timerEl = stage.querySelector("#drill-timer");
    const buttons = stage.querySelectorAll("[data-pick]");
    let done = false;

    const tick = setInterval(() => {
      timeLeft -= 1;
      if (timerEl) {
        timerEl.textContent = `${timeLeft}s`;
        timerEl.classList.toggle("urgent", timeLeft <= 2);
      }
      if (timeLeft <= 0) {
        clearInterval(tick);
        if (!done) finish("__timeout__");
      }
    }, 1000);

    function finish(pick) {
      if (done) return;
      done = true;
      clearInterval(tick);
      const ms = performance.now() - start;
      const correct = pick === card.archetype;
      state.drillResults.push({ archetype: card.archetype, picked: pick, correct, ms });
      ctx.eventLog.record("archetype_picked", { archetype: pick, correct, ms });
      cardEl.classList.add(correct ? "flash-correct" : "flash-wrong");
      buttons.forEach(b => (b.disabled = true));
      setTimeout(resolve, 420);
    }

    buttons.forEach(b => b.addEventListener("click", () => finish(b.dataset.pick)));
    const keyHandler = (e) => {
      const i = "1234".indexOf(e.key);
      if (i >= 0) {
        const map = ["storefront","rocket","factory","forkKnife"];
        finish(map[i]);
      }
    };
    document.addEventListener("keydown", keyHandler);
    setTimeout(() => document.removeEventListener("keydown", keyHandler), DRILL_FLASH_S * 1000 + 500);
    cardEl.focus();
  });
}

// ============================================================================
// 5:30-8:30 · SOLO PROBLEM — INTERLEAVED CALLS (3 default, 2 fallback)
// ============================================================================

async function soloProblem(ctx, state) {
  const stage = document.getElementById("m4-stage");
  stage.dataset.mode = "solo";

  const allArche = ["storefront","rocket","factory","forkKnife"];
  const order = shuffle(allArche, state.rng).slice(0, INTERLEAVED_CALLS);

  for (let i = 0; i < order.length; i++) {
    await runSoloCall(ctx, state, stage, order[i], i + 1, order.length, order);
  }

  ctx.eventLog.record("solo_problem_completed");
  stage.dataset.mode = "";
  stage.style.cssText = "";
}

function runSoloCall(ctx, state, stage, archetype, idx, total, order) {
  return new Promise(resolve => {
    const prospect = state.prospects.find(p => p.archetype === archetype);
    const transcript = state.transcripts.find(t => t.archetype === archetype);
    const stepStatus = { archetypePicked: null, propPicked: null, m2Ok: null, closed: false };

    // Open the LinkedIn-CH mini-OS window for this call (lazy-launched).
    try { ctx.os.openApp("linkedin-ch", { activeProfileId: prospect.lead_id }); } catch (_) { /* shell may not have profile, that's fine */ }

    function render() {
      stage.innerHTML = `
        <div class="solo-panel" role="region" aria-label="Call ${idx} of ${total}">
          <h3>Call ${idx} of ${total} · interleaved</h3>
          <div class="call-strip" aria-label="Call queue">
            ${order.map((a, i) => `
              <span class="call-pill" data-state="${
                i + 1 < idx ? (state.soloResults[i]?.archetypeCorrect ? 'done-ok' : 'done-miss')
                : i + 1 === idx ? 'active' : 'pending'
              }">
                <span aria-hidden="true">${ARCHETYPE_GLYPH[a]}</span>
                <span>${i + 1 === idx ? "now" : i + 1 < idx ? "done" : "next"}</span>
              </span>
            `).join("")}
          </div>

          <div class="solo-step" data-done="${stepStatus.archetypePicked !== null}">
            <span class="step-num">1</span>
            <strong>Pick the archetype</strong> from the LinkedIn-CH window.
            <div style="margin-top:8px">
              ${["storefront","rocket","factory","forkKnife"].map(a => `
                <button type="button" class="m4-cta secondary" data-arch="${a}" style="margin:2px 4px 2px 0;font-size:12px;padding:4px 8px"
                  ${stepStatus.archetypePicked !== null ? "disabled" : ""}>
                  ${ARCHETYPE_GLYPH[a]} ${ARCHETYPE_NAME[a]}
                </button>
              `).join("")}
            </div>
          </div>

          ${stepStatus.archetypePicked !== null ? `
          <div class="solo-step" data-done="${stepStatus.propPicked !== null}">
            <span class="step-num">2</span>
            <strong>Pick the best-fit prop</strong> to lead with after M1.
            <div style="margin-top:8px">
              ${[1,2,3,4].map(p => `
                <button type="button" class="m4-cta secondary" data-prop="${p}" style="margin:2px 4px 2px 0;font-size:12px;padding:4px 8px"
                  ${stepStatus.propPicked !== null ? "disabled" : ""}>
                  Prop ${p}
                </button>
              `).join("")}
            </div>
          </div>` : ""}

          ${stepStatus.propPicked !== null ? `
          <div class="solo-step" data-done="${stepStatus.m2Ok !== null}">
            <span class="step-num">3</span>
            <strong>Buyer says:</strong>
            <div class="buyer-reply">"${escapeHtml(transcript.buyer_reply)}"</div>
            <div style="margin-top:6px">Which restate is the M2 move?</div>
            <div style="margin-top:6px">
              <button type="button" class="m4-cta secondary" data-m2="ok" style="margin:2px 4px 2px 0;font-size:12px;padding:4px 8px"
                ${stepStatus.m2Ok !== null ? "disabled" : ""}>
                "${escapeHtml(transcript.m2_line)}"
              </button>
              <button type="button" class="m4-cta secondary" data-m2="bad" style="margin:2px 4px 2px 0;font-size:12px;padding:4px 8px"
                ${stepStatus.m2Ok !== null ? "disabled" : ""}>
                "Actually our fees are lower than that."
              </button>
            </div>
          </div>` : ""}

          ${stepStatus.m2Ok !== null ? `
          <div class="solo-step" data-done="${stepStatus.closed}">
            <span class="step-num">4</span>
            <strong>Calendar close.</strong>
            <div style="margin-top:6px">"${escapeHtml(transcript.m3_line)}"</div>
            <button type="button" class="m4-cta" data-close="1" style="margin-top:8px"
              ${stepStatus.closed ? "disabled" : ""}>
              Send invite · finish call
            </button>
          </div>` : ""}
        </div>
      `;

      stage.querySelectorAll("[data-arch]").forEach(b => b.addEventListener("click", () => {
        const pick = b.dataset.arch;
        const correct = pick === archetype;
        stepStatus.archetypePicked = pick;
        ctx.eventLog.record("archetype_picked", { archetype: pick, correct, source: "solo" });
        ctx.eventLog.record("m4_archetype_match_score", { call: idx, archetype, correct });
        render();
      }));
      stage.querySelectorAll("[data-prop]").forEach(b => b.addEventListener("click", () => {
        const pick = parseInt(b.dataset.prop, 10);
        const correct = pick === transcript.best_prop;
        stepStatus.propPicked = pick;
        ctx.eventLog.record("prop_mapped", { prop_id: pick, correct, source: "m4-solo" });
        render();
      }));
      stage.querySelectorAll("[data-m2]").forEach(b => b.addEventListener("click", () => {
        const ok = b.dataset.m2 === "ok";
        stepStatus.m2Ok = ok;
        if (ok) ctx.eventLog.record("objection_restated", { family: archetype });
        else    ctx.eventLog.record("objection_argued",   { family: archetype });
        render();
      }));
      stage.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => {
        stepStatus.closed = true;
        ctx.eventLog.record("invite_sent", { archetype, slot_ids: [`slot-${idx}`] });
        ctx.eventLog.record("next_step_booked_set", { account: prospect.company });
        state.soloResults.push({
          archetype,
          archetypeCorrect: stepStatus.archetypePicked === archetype,
          propCorrect: stepStatus.propPicked === transcript.best_prop,
          m2Ok: stepStatus.m2Ok === true,
          closed: true,
        });
        const win = ctx.os.listWindows().find(w => w.appId === "linkedin-ch");
        if (win) win.close();
        setTimeout(resolve, 200);
      }));
    }
    render();
  });
}

// ============================================================================
// 8:30-9:00 · FEEDBACK · 3-row archetype-fit matrix self-score
// ============================================================================

function feedbackMatrix(ctx, state) {
  const stage = document.getElementById("m4-stage");
  const calls = state.soloResults;
  const scores = {};
  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-fb-h">
      <h1 id="m4-fb-h">Self-score · M1 / M2 / M3 across the ${calls.length} calls</h1>
      <p class="lead">
        Rate each row 1 (rough) to 5 (clean). Variance > 1 between calls is the
        signal — that row needs another pass tomorrow.
      </p>
      <table class="fit-matrix">
        <thead>
          <tr>
            <th scope="col">Move</th>
            ${calls.map(c => `
              <th scope="col">${ARCHETYPE_GLYPH[c.archetype]} ${ARCHETYPE_NAME[c.archetype]}</th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${["M1","M2","M3"].map(m => `
            <tr>
              <th scope="row">${m}</th>
              ${calls.map((c, i) => `
                <td>
                  <div class="score-cells" role="radiogroup" aria-label="${m} score for ${ARCHETYPE_NAME[c.archetype]}">
                    ${[1,2,3,4,5].map(n => `
                      <button type="button" data-row="${m}" data-call="${i}" data-score="${n}"
                              aria-pressed="false">${n}</button>
                    `).join("")}
                  </div>
                </td>
              `).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
      <button type="button" class="m4-cta" data-action="next">Save · next</button>
    </section>
  `;

  stage.querySelectorAll(".score-cells button").forEach(b => {
    b.addEventListener("click", () => {
      const row = b.dataset.row, call = b.dataset.call, score = b.dataset.score;
      stage.querySelectorAll(`[data-row="${row}"][data-call="${call}"]`)
        .forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      scores[`call${parseInt(call, 10) + 1}_${row}`] = parseInt(score, 10);
    });
  });

  return waitForClick(stage, "[data-action='next']").then(() => {
    ctx.eventLog.record("m4_fit_matrix_saved", scores);
  });
}

// ============================================================================
// 9:00-9:30 · QUIZ · 3 scenario items (LO-ICP.x)
// ============================================================================

function quizBlock(ctx, state) {
  return new Promise(resolve => {
    const stage = document.getElementById("m4-stage");
    const items = state.quiz;
    const picks = new Array(items.length).fill(null);

    function render(scored = false) {
      stage.innerHTML = `
        <section class="m4-panel" aria-labelledby="m4-quiz-h">
          <h1 id="m4-quiz-h">3 scenario items</h1>
          ${items.map((q, qi) => `
            <article class="quiz-item ${scored ? "scored" : ""}" aria-labelledby="q-${q.id}">
              <div class="stem" id="q-${q.id}">
                <span class="tag">${q.lo}</span> ${escapeHtml(q.stem)}
              </div>
              ${q.options.map((o, oi) => `
                <button type="button" class="opt"
                  data-q="${qi}" data-o="${oi}"
                  data-picked="${picks[qi] === oi}"
                  data-correct="${o.correct === true}"
                  aria-pressed="${picks[qi] === oi}"
                  ${scored ? "disabled" : ""}>
                  ${escapeHtml(o.text)}
                </button>
              `).join("")}
              ${scored ? `
                <div class="quiz-feedback">
                  ${picks[qi] !== null && q.options[picks[qi]]?.correct
                    ? `<strong>Correct.</strong> ${escapeHtml(q.feedback_correct)}`
                    : `<strong>Not quite.</strong> ${escapeHtml(q.feedback_incorrect)}`}
                </div>
              ` : ""}
            </article>
          `).join("")}
          ${!scored
            ? `<button type="button" class="m4-cta" data-action="grade"
                       ${picks.some(p => p === null) ? "disabled" : ""}>Submit</button>`
            : `<button type="button" class="m4-cta" data-action="next">Continue</button>`}
        </section>
      `;

      if (!scored) {
        stage.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
          const qi = parseInt(b.dataset.q, 10);
          const oi = parseInt(b.dataset.o, 10);
          picks[qi] = oi;
          render(false);
        }));
        stage.querySelector("[data-action='grade']")?.addEventListener("click", () => {
          render(true);
        });
      } else {
        stage.querySelector("[data-action='next']")?.addEventListener("click", () => {
          const correct = items.reduce(
            (n, q, qi) => n + (q.options[picks[qi]]?.correct ? 1 : 0), 0);
          const score = Math.round((correct / items.length) * 100);
          items.forEach((q, qi) => {
            state.quizPicks.push({
              id: q.id, picked_index: picks[qi],
              correct: q.options[picks[qi]]?.correct === true,
            });
          });
          ctx.eventLog.record("quiz_completed", { correct, total: items.length, score });
          resolve(score);
        });
      }
    }
    render(false);
  });
}

// ============================================================================
// 9:30-10:00 · TAKE-AWAY CARD + +7d SPACED RETRIEVAL HOOK
// ============================================================================

function takeawayCard(ctx, state, score) {
  const stage = document.getElementById("m4-stage");
  const archetypeAcc = state.soloResults.filter(r => r.archetypeCorrect).length /
                       Math.max(1, state.soloResults.length);

  stage.innerHTML = `
    <section class="m4-panel" aria-labelledby="m4-take-h">
      <h1 id="m4-take-h">Take-away</h1>
      <div class="m4-outcome">
        "M1 + M2 + M3 don't change. The buyer does. Pick the buyer first —
        in five seconds — then run the moves. The moves are the same; the
        framing is the buyer's."
        <small>Composite · M.G. (UK) + L.D. (DE) · §10.1 + §10.2.</small>
      </div>
      <h2>Your run</h2>
      <ul>
        <li>Quiz score: <strong>${score}%</strong></li>
        <li>Solo archetype match: <strong>${Math.round(archetypeAcc * 100)}%</strong>
            (${state.soloResults.filter(r => r.archetypeCorrect).length}/${state.soloResults.length} calls)</li>
        <li>Drill D4 accuracy: <strong>${state.drillResults.filter(r => r.correct).length}/${state.drillResults.length}</strong></li>
        <li>Seed: <code>${state.seed}</code> · ${INTERLEAVED_CALLS}-call run · replayable with <code>?seed=${state.seed}</code></li>
      </ul>
      <p class="muted">
        +7-day spaced retrieval queued. You'll see 3 quick scenario cards
        Monday morning before your first dial.
      </p>
      <button type="button" class="m4-cta" data-action="done">Close module</button>
    </section>
  `;
  ctx.eventLog.record("spaced_retrieval_scheduled", { delay_days: 7, los: LOS });
  return waitForClick(stage, "[data-action='done']");
}

// ============================================================================
// HELPERS
// ============================================================================

function waitForClick(root, selector) {
  return new Promise(resolve => {
    const el = root.querySelector(selector);
    if (!el) return resolve();
    el.addEventListener("click", () => resolve(), { once: true });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
