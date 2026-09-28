const { useState, useEffect, useRef, useMemo } = React;

/* ─────────────────────────────────────────────────────
   First-30-Seconds · agent-desktop simulation
   Live transcript + AI-suggested replies (LAER discipline)
   ───────────────────────────────────────────────────── */

const CUSTOMER = {
  name: "Marcus Webb",
  initials: "MW",
  acct: "44831",
  tenure: "4y 3m",
  tier: "Standard",
  aht: "5m 12s",
  phone: "+44 7700 900482",
  npsTrend: "↓ 6 → 3 (3 mo)",
};

const RECENT = [
  { type: "call",  subject: "Duplicate charge — agent: J. Park", meta: "Closed · marked resolved", time: "3 days ago" },
  { type: "call",  subject: "Duplicate charge — agent: T. Owen",  meta: "Closed · escalated",        time: "9 days ago" },
  { type: "email", subject: "Statement query · auto-resolved",   meta: "Self-service",              time: "5 weeks ago" },
];

const OPEN_CASE = {
  id: "CS-44831-002",
  title: "Recurring duplicate charge · investigation",
  meta: "Opened 9 days ago · 2 calls · No resolution",
};

const BRANCHES = [
  {
    stage: "Listen",
    code: "L",
    callerAt: 4,   // scripted call clock, seconds
    replyAt: 7,
    caller: "This is the third time I've called about this. Nobody's helped me yet.",
    options: [
      {
        grade: "ideal",
        confidence: 96,
        stage: "Listen + open question",
        text:
          "I'm sorry you've had to call back — that's genuinely frustrating. I want to make sure this is the last time. Can I get the last four of the card we're discussing?",
        delta: -10,
        feedback: "Listen done right. You named the friction (\"had to call back\") before asking for anything operational. Low-effort ask (\"last four\") shows you're moving on the problem, not asking him to repeat the whole story.",
      },
      {
        grade: "passable",
        confidence: 71,
        stage: "Verification first",
        text:
          "Okay. Let me see what's been going on with your account — can I get your account number?",
        delta: -2,
        feedback: "Passable. You moved to data without acknowledging that this is his third call. He'll comply, but the resentment is still there.",
      },
      {
        grade: "wrong",
        confidence: 31,
        stage: "Treats as new contact",
        text:
          "Okay, so what's the issue today?",
        delta: 12,
        feedback: "Worst Listen failure: you treated the call as new. He hears that his previous two calls are invisible to your system, which confirms his fear that no one owns the problem.",
      },
    ],
  },
  {
    stage: "Acknowledge",
    code: "A",
    callerAt: 10,
    replyAt: 14,
    caller:
      "Yeah well last time I called, that woman told me she'd fix it and then I just got billed AGAIN.",
    callerEscalated:
      "I JUST told you — TWO calls about this already! That's exactly the problem, nobody's listening!",
    options: [
      {
        grade: "ideal",
        confidence: 94,
        stage: "Specific acknowledgement + commitment",
        text:
          "That shouldn't have happened — you were told it was resolved, and it wasn't. I'm going to fix it now and make sure you see the credit before we hang up.",
        delta: -12,
        feedback: "Textbook Acknowledge. You named the specific failure (\"told it was resolved, and it wasn't\") instead of a generic \"I understand\". You also committed to an outcome he can check before the call ends, and that commitment is what turns the call around.",
      },
      {
        grade: "passable",
        confidence: 68,
        stage: "Generic empathy",
        text:
          "I understand. Let me pull up the account and see what was logged last time.",
        delta: -3,
        feedback: "\"I understand\" sounds like an acknowledgement, but it doesn't name what went wrong. Pulling up the account is the right move.",
      },
      {
        grade: "wrong",
        confidence: 28,
        stage: "Explains away",
        text:
          "Sometimes these things take a billing cycle to clear — it might not actually be a new charge.",
        delta: 18,
        feedback: "You explained away a confirmed failure. To Marcus this reads as gaslighting after two prior calls. Escalation is now near-certain on the next turn.",
      },
    ],
  },
  {
    stage: "Explore",
    code: "E",
    callerAt: 17,
    replyAt: 21,
    caller:
      "And I had to take time off work to call about this. I'm losing money sitting on hold.",
    callerEscalated:
      "Are you serious right now? I had to take TIME OFF to call you people, and you're STILL not getting it!",
    options: [
      {
        grade: "ideal",
        confidence: 92,
        stage: "Acknowledge cost + diagnostic question",
        text:
          "I hear you — your time matters. While I'm pulling this up, can you tell me whether the duplicate charge hit on the same day or different days? That tells me which system the error came from.",
        delta: -8,
        feedback: "Best Explore move. You acknowledged the time cost in one beat, then pivoted to a specific diagnostic question. \"Same day vs different days\" is exactly the signal that distinguishes a system-of-record bug from a payment-rail retry.",
      },
      {
        grade: "passable",
        confidence: 64,
        stage: "Process gesture",
        text:
          "I'll mark this as a priority case so it doesn't get lost again.",
        delta: -1,
        feedback: "Marking it priority feels good, but it tells you nothing new about the fault, so you're still working blind. One targeted question would close the case faster.",
      },
      {
        grade: "wrong",
        confidence: 22,
        stage: "Policy bot",
        text:
          "Unfortunately we're not able to compensate for personal time.",
        delta: 15,
        feedback: "A policy-bot answer to a customer who is venting. He wasn't asking for compensation; he was telling you what this is costing him. This is the kind of reply that gives contact-centre training a bad name.",
      },
    ],
  },
  {
    stage: "Respond",
    code: "R",
    callerAt: 24,
    replyAt: 28,
    caller: "Just refund me and let me get on with my day.",
    callerEscalated:
      "Forget it — just give me my money back and stop wasting my time.",
    options: [
      {
        grade: "ideal",
        confidence: 98,
        stage: "Concrete close + prevention",
        text:
          "Done. I've issued the refund for £84.20 — back on your card within 24 hours. I've also locked the duplicate so it can't auto-repeat. Anything else I can take off your plate before I let you go?",
        delta: -15,
        feedback: "Strong close: concrete amount, concrete timing, a prevention step, and an open door without dragging the call out. The last question lets him leave clean if he's done.",
      },
      {
        grade: "passable",
        confidence: 56,
        stage: "Vague close",
        text:
          "I'm processing the refund now — you should see it back in a few days.",
        delta: -4,
        feedback: "\"A few days\" is vague, and he has already been told once that this was resolved. A specific time gives him a reason to trust you; a vague one brings the doubt back.",
      },
      {
        grade: "wrong",
        confidence: 18,
        stage: "Transfer-out",
        text:
          "I'll need to transfer you over to billing to process the refund — please hold.",
        delta: 22,
        feedback: "Worst possible close: a third transfer on a call about not being helped. This is the action that erases everything else you did right.",
      },
    ],
  },
];

const CALL_END_AT = 30;

const TRIGGERS = [
  { kind: "neg", text: "third time" },
  { kind: "neg", text: "nobody's helped me" },
  { kind: "neg", text: "billed again" },
  { kind: "neg", text: "losing money" },
  { kind: "neg", text: "time off work" },
];

const TYPE_SPEED = 22;
const PRE_CALLER_DELAY = 700;
const POST_REPLY_DELAY = 900;

/* ───── helpers ───── */
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
function sentimentLabel(tension) {
  if (tension <= 30) return { word: "Recovering", cls: "pos", color: "#16A34A" };
  if (tension <= 55) return { word: "Frustrated",  cls: "neu", color: "#D97706" };
  if (tension <= 75) return { word: "Angry",       cls: "neg", color: "#DC2626" };
  return { word: "Disengaging", cls: "neg", color: "#B91C1C" };
}
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function confColor(grade) {
  return grade === "ideal" ? "var(--confidence-hi)" :
         grade === "passable" ? "var(--confidence-mid)" :
         "var(--confidence-low)";
}

/* ─────────────────────────────────────────────────────
   App
   ───────────────────────────────────────────────────── */
function App() {
  const [turns, setTurns] = useState([]);
  const [branchIdx, setBranchIdx] = useState(0);
  const [stage, setStage] = useState("caller-typing");
  const [callerChars, setCallerChars] = useState(0);
  const [tension, setTension] = useState(55);
  const [tensionHistory, setTensionHistory] = useState([42, 48, 55]); // last 3 ticks for sparkline
  const [decisions, setDecisions] = useState([]);
  const [coachToast, setCoachToast] = useState(null);
  const [callTime, setCallTime] = useState(2);
  const [picked, setPicked] = useState(null); // original option index chosen in the current branch
  // Display order of the three options per branch, shuffled once per session.
  const [optionOrder] = useState(() => BRANCHES.map((b) => shuffled(b.options.map((_, i) => i))));
  const [showResults, setShowResults] = useState(false);

  const scrollRef = useRef(null);

  /* Call clock follows the scripted timeline: it ticks in real time but never
     passes the next scripted event, and jumps to each event when it happens. */
  const clockCapRef = useRef(0);
  {
    const b = BRANCHES[branchIdx];
    clockCapRef.current = !b ? CALL_END_AT
      : stage === "caller-typing" ? b.callerAt - 1
      : stage === "reply-sending" ? (BRANCHES[branchIdx + 1] ? BRANCHES[branchIdx + 1].callerAt - 1 : CALL_END_AT)
      : b.replyAt - 1;
  }
  useEffect(() => {
    if (showResults) return;
    const id = setInterval(() => setCallTime((t) => Math.min(t + 1, Math.max(t, clockCapRef.current))), 1000);
    return () => clearInterval(id);
  }, [showResults]);

  /* Drive the script */
  useEffect(() => {
    if (branchIdx >= BRANCHES.length) {
      setTimeout(() => setShowResults(true), 1300);
      return;
    }
    const branch = BRANCHES[branchIdx];

    if (stage === "caller-typing") {
      const t = setTimeout(() => setStage("caller-speaking"), PRE_CALLER_DELAY);
      return () => clearTimeout(t);
    }

    if (stage === "caller-speaking") {
      setCallTime(branch.callerAt);
      const escalated = tension >= 72 && branch.callerEscalated;
      const fullText = escalated ? branch.callerEscalated : branch.caller;
      setCallerChars(0);
      let i = 0;
      const tick = () => {
        i++;
        setCallerChars(i);
        if (i < fullText.length) timer = setTimeout(tick, TYPE_SPEED);
        else {
          setTimeout(() => {
            setTurns((prev) => [
              ...prev,
              { who: "caller", text: fullText, branchIdx, time: fmtTime(branch.callerAt), escalated, sentiment: tension >= 65 ? "neg" : "neu" },
            ]);
            setCallerChars(0);
            setStage("options");
          }, 240);
        }
      };
      let timer = setTimeout(tick, TYPE_SPEED);
      return () => clearTimeout(timer);
    }

    if (stage === "reply-sending") {
      const t = setTimeout(() => {
        setCoachToast(null);
        setPicked(null);
        setBranchIdx((b) => b + 1);
        setStage("caller-typing");
      }, POST_REPLY_DELAY + 1800);  /* extra time to read coach toast */
      return () => clearTimeout(t);
    }
  }, [stage, branchIdx, tension]);

  /* Scroll transcript to bottom on new content */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns.length, stage, callerChars]);

  /* Keyboard 1/2/3 */
  useEffect(() => {
    const onKey = (e) => {
      if (stage !== "options" || showResults) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 3) {
        choose(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // displayIdx is the position on screen (keys 1 to 3); map it to the scripted option.
  const choose = (displayIdx) => {
    if (stage !== "options") return;
    const branch = BRANCHES[branchIdx];
    const optionIdx = optionOrder[branchIdx][displayIdx];
    const opt = branch.options[optionIdx];
    setPicked(optionIdx);
    setCallTime(branch.replyAt);

    setTurns((prev) => [
      ...prev,
      {
        who: "you",
        text: opt.text,
        branchIdx,
        grade: opt.grade,
        time: fmtTime(branch.replyAt),
      },
    ]);
    setDecisions((d) => [...d, {
      branchIdx, optionIdx, grade: opt.grade, feedback: opt.feedback, text: opt.text,
      stage: branch.stage, confidence: opt.confidence
    }]);
    setTension((t) => {
      const next = clamp(t + opt.delta, 0, 100);
      setTensionHistory((h) => [...h, next].slice(-16));
      return next;
    });
    setCoachToast({
      grade: opt.grade,
      feedback: opt.feedback,
      stage: branch.stage,
    });
    setStage("reply-sending");
  };

  const restart = () => {
    setTurns([]);
    setBranchIdx(0);
    setStage("caller-typing");
    setCallerChars(0);
    setTension(55);
    setTensionHistory([42, 48, 55]);
    setDecisions([]);
    setCoachToast(null);
    setCallTime(2);
    setPicked(null);
    setShowResults(false);
  };

  const branch = BRANCHES[branchIdx];
  const sentiment = sentimentLabel(tension);
  const idealCount = decisions.filter((d) => d.grade === "ideal").length;
  const passableCount = decisions.filter((d) => d.grade === "passable").length;
  const wrongCount = decisions.filter((d) => d.grade === "wrong").length;
  const progressPct = (decisions.length / BRANCHES.length) * 100;

  return (
    <>
      {/* ───── Topbar ───── */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">VC</div>
          <div className="brand-name">VoiceCoach <span>· Agent</span></div>
        </div>

        <div className="call-strip">
          <span className="call-rec">
            <span className="rec-dot" />
            REC
          </span>
          <div className="call-customer">
            <span className="call-cust-divider" />
            <span className="call-cust-name">{CUSTOMER.name}</span>
            <span className="call-cust-meta">· #{CUSTOMER.acct}</span>
            <span className="call-cust-meta">· Inbound, transferred 2×</span>
          </div>
          <span className="call-time">{fmtTime(callTime)}</span>
        </div>

        <div className="agent">
          <a href="index.html" style={{ textDecoration: "none", fontSize: 12, color: "var(--ink-3)", padding: "0 8px" }}>← Index</a>
          <div className="agent-status">
            <span className="agent-status-dot" />
            On call
          </div>
          <div className="softphone">
            <button className="sp-btn muted" title="Muted">🎤</button>
            <button className="sp-btn" title="Hold">⏸</button>
            <button className="sp-btn" title="Transfer">↪</button>
            <button className="sp-btn danger" title="End call">⏷</button>
          </div>
          <div className="agent-avatar">YN</div>
        </div>
      </header>

      {/* ───── Main grid ───── */}
      <div className="main">

        {/* ─── Left: Customer 360 ─── */}
        <aside className="left">
          <div className="left-section">
            <div className="left-section-label">Customer</div>
            <div className="cust-hero">
              <div className="cust-avatar">{CUSTOMER.initials}</div>
              <div>
                <div className="cust-name">{CUSTOMER.name}</div>
                <div className="cust-id">Account · {CUSTOMER.acct}</div>
                <div className="cust-pill">Identity verified · CRM</div>
              </div>
            </div>
            <div className="cust-row">
              <div>
                <div className="cust-stat-label">Tenure</div>
                <div className="cust-stat-val">{CUSTOMER.tenure}</div>
              </div>
              <div>
                <div className="cust-stat-label">Tier</div>
                <div className="cust-stat-val">{CUSTOMER.tier}</div>
              </div>
              <div>
                <div className="cust-stat-label">Avg AHT (you)</div>
                <div className="cust-stat-val">{CUSTOMER.aht}</div>
              </div>
              <div>
                <div className="cust-stat-label">NPS trend</div>
                <div className="cust-stat-val" style={{ color: "var(--neg)" }}>{CUSTOMER.npsTrend}</div>
              </div>
            </div>
          </div>

          <div className="left-section">
            <div className="left-section-label">Recent interactions</div>
            {RECENT.map((r, i) => (
              <div key={i} className="interaction">
                <span className={`int-icon ${r.type}`}>
                  {r.type === "call" ? "☏" : r.type === "chat" ? "💬" : "✉"}
                </span>
                <div>
                  <div className="int-subject">{r.subject}</div>
                  <div className="int-meta">{r.meta}</div>
                </div>
                <div className="int-time">{r.time}</div>
              </div>
            ))}
          </div>

          <div className="left-section case">
            <div className="left-section-label" style={{ color: "var(--neu)" }}>Open case · this issue</div>
            <div className="case-id">{OPEN_CASE.id}</div>
            <div className="case-title">{OPEN_CASE.title}</div>
            <div className="case-meta">{OPEN_CASE.meta}</div>
          </div>

          <div className="left-section">
            <div className="left-section-label">Account snapshot</div>
            <div className="cust-row">
              <div>
                <div className="cust-stat-label">Balance</div>
                <div className="cust-stat-val">£2,847.50</div>
              </div>
              <div>
                <div className="cust-stat-label">Last charge</div>
                <div className="cust-stat-val">£84.20 × 2</div>
              </div>
              <div>
                <div className="cust-stat-label">Payment method</div>
                <div className="cust-stat-val">Visa · 4421</div>
              </div>
              <div>
                <div className="cust-stat-label">Auto-pay</div>
                <div className="cust-stat-val">Enabled</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Centre: conversation ─── */}
        <section className="centre">
          <div className="centre-tabs">
            <span className="centre-tab active">
              Live transcript
              <span className="badge">LIVE</span>
            </span>
            <span className="centre-tab muted">Account</span>
            <span className="centre-tab muted">Notes</span>
            <span className="centre-tab muted">Knowledge base</span>
          </div>

          <div className="transcript" ref={scrollRef}>
            <div className="transcript-day">Call started · {fmtTime(0)}</div>
            <div className="turn caller" style={{ animationDelay: "0s" }}>
              <div className="turn-avatar">{CUSTOMER.initials}</div>
              <div>
                <div className="turn-meta">
                  <span className="turn-name">{CUSTOMER.name}</span>
                  <span className="turn-time">00:02 · auto-greeting acknowledged</span>
                </div>
                <div className="turn-bubble" style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                  …phone picked up, deep sigh on the line.
                </div>
              </div>
            </div>

            {turns.map((t, i) => (
              <div key={i} className={`turn ${t.who} ${t.escalated ? "escalated" : ""}`}>
                <div className="turn-avatar">
                  {t.who === "caller" ? CUSTOMER.initials : "YN"}
                </div>
                <div>
                  <div className="turn-meta">
                    <span className="turn-name">{t.who === "caller" ? CUSTOMER.name : "You"}</span>
                    <span className="turn-time">{t.time}</span>
                    {t.who === "caller" && (
                      <span className={`turn-sentiment-tag ${t.sentiment || "neu"}`}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                        {t.sentiment === "neg" ? "Negative" : t.sentiment === "pos" ? "Positive" : "Neutral"}
                      </span>
                    )}
                  </div>
                  <div className="turn-bubble">{t.text}</div>
                  {t.who === "you" && (
                    <div className={`turn-grade-pill ${t.grade}`}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                      {t.grade === "ideal" ? "LAER-aligned" : t.grade === "passable" ? "Passable" : "Off-script"}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Caller typing */}
            {stage === "caller-typing" && branch && (
              <div className="turn caller">
                <div className="turn-avatar">{CUSTOMER.initials}</div>
                <div>
                  <div className="turn-meta">
                    <span className="turn-name">{CUSTOMER.name}</span>
                    <span className="turn-time">{fmtTime(branch.callerAt)}</span>
                  </div>
                  <div className="typing">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {stage === "caller-speaking" && branch && (
              <div className={`turn caller ${tension >= 72 && branch.callerEscalated ? "escalated" : ""}`}>
                <div className="turn-avatar">{CUSTOMER.initials}</div>
                <div>
                  <div className="turn-meta">
                    <span className="turn-name">{CUSTOMER.name}</span>
                    <span className="turn-time">{fmtTime(branch.callerAt)} · live</span>
                  </div>
                  <div className="turn-bubble">
                    {(tension >= 72 && branch.callerEscalated ? branch.callerEscalated : branch.caller).slice(0, callerChars)}
                    <span style={{ opacity: 0.35 }}>▍</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="composer">
            <div className="composer-row">
              <div className="composer-input placeholder">
                {stage === "options" ? "← Pick a suggested reply from the coach…" : "…"}
              </div>
              <button className="sp-btn" title="Voice" style={{ height: 36, width: 36 }}>🎤</button>
              <button className="sp-btn" title="Send" disabled style={{ height: 36, width: 36, opacity: 0.4 }}>↵</button>
            </div>
            <div className="composer-hint">
              <span className="pill"><span className="dot" />VoiceCoach AI</span>
              {stage === "options" ? <>The coach suggests three replies →</> : <>Listening to live transcript…</>}
            </div>
          </div>
        </section>

        {/* ─── Right: AI Coaching ─── */}
        <aside className="right">
          <div className="right-head">
            <div className="right-head-eyebrow">
              <span className="live-pulse" />
              VoiceCoach · Live coaching
            </div>
            <div className="right-head-title">{branch ? `${branch.stage} stage · LAER ${branch.code}` : "Call ended"}</div>
            <div className="right-head-sub">The AI listens to the call, tracks how tense the customer is and suggests replies based on LAER.</div>
          </div>

          {/* Sentiment */}
          <div className="sentiment">
            <div className="sentiment-row">
              <span className="sentiment-label">Customer tension</span>
              <span className={`sentiment-val ${sentiment.cls}`}>{sentiment.word} · {Math.round(tension)}</span>
            </div>
            <div className="sentiment-bar">
              <div
                className="sentiment-bar-fill"
                style={{ "--sent-w": `${tension}%`, "--sent-color": sentiment.color }}
              />
            </div>
            <div className="sentiment-graph">
              {tensionHistory.map((v, i) => {
                const s = sentimentLabel(v);
                return (
                  <span
                    key={i}
                    className="sent-tick"
                    style={{ height: `${Math.max(8, v)}%`, background: s.color, opacity: 0.5 + (i / tensionHistory.length) * 0.5 }}
                  />
                );
              })}
            </div>
            <div className="sentiment-meta">
              <span>Calmer</span>
              <span style={{ marginLeft: "auto" }}>Hotter</span>
            </div>
          </div>

          {/* Suggested replies */}
          {branch && (stage === "options" || (stage === "reply-sending" && picked !== null)) && (
            <div className="ai-suggest">
              <div className="ai-suggest-head">
                <span className="ai-suggest-title">Suggested reply ({branch.stage})</span>
                <span className="ai-suggest-meta">Coach suggestions</span>
              </div>
              {optionOrder[branchIdx].map((optIdx, i) => {
                const o = branch.options[optIdx];
                // Grade cues (dot, confidence, move label) stay hidden until the learner picks.
                const revealed = picked !== null;
                const isPicked = picked === optIdx;
                return (
                  <button
                    key={optIdx}
                    className={`suggest-card ${revealed ? "revealed" : ""} ${isPicked ? "picked" : ""}`}
                    onClick={() => choose(i)}
                    disabled={revealed}
                    aria-pressed={revealed ? isPicked : undefined}
                    style={{ animationDelay: `${0.06 + i * 0.08}s` }}
                  >
                    <div className="suggest-head-row">
                      <span className="suggest-stage">
                        {revealed && <span className="suggest-stage-dot" style={{ background: confColor(o.grade) }} />}
                        {revealed ? o.stage : `Suggestion ${i + 1}`}
                      </span>
                      {revealed && (
                        <span className="suggest-confidence">
                          <span className="conf-bar">
                            <span
                              className="conf-bar-fill"
                              style={{ "--conf-w": `${o.confidence}%`, "--conf-color": confColor(o.grade) }}
                            />
                          </span>
                          {o.confidence}%
                        </span>
                      )}
                    </div>
                    <div className="suggest-text">"{o.text}"</div>
                    <div className="suggest-foot">
                      {revealed
                        ? (isPicked ? "Your reply" : "Not sent")
                        : <>Press <span className="suggest-kbd">{i + 1}</span> to send · or click</>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Coach toast (between turns) */}
          {coachToast && (
            <div className={`coach-toast show ${coachToast.grade}`}>
              <div className="coach-toast-head">
                {coachToast.grade === "ideal" ? "Coach: LAER-aligned reply"
                  : coachToast.grade === "passable" ? "Coach: passable, room to lift"
                  : "Coach: re-think the call"}
              </div>
              <div className="coach-toast-body">{coachToast.feedback}</div>
            </div>
          )}

          {/* LAER discipline tracker */}
          <div className="laer-block">
            <div className="laer-block-head">LAER discipline</div>
            <div className="laer-steps">
              {BRANCHES.map((b, i) => {
                const d = decisions[i];
                const isActive = i === branchIdx && !showResults && stage !== "reply-sending";
                const cls = ["laer-step", d && `done ${d.grade}`, isActive && "active"].filter(Boolean).join(" ");
                return (
                  <div key={b.code} className={cls}>
                    <span className="laer-step-icon">{b.code}</span>
                    <span className="laer-step-name">{b.stage}</span>
                    <span className="laer-step-status">
                      {d ? (d.grade === "ideal" ? "✓ ideal" : d.grade === "passable" ? "○ ok" : "✕ slip") : isActive ? "active" : "queued"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.45 }}>
              Pass bar: <b style={{ color: "var(--ink)" }}>≥ 3 ideal</b> across L · A · E · R.
            </div>
          </div>

          {/* Trigger phrases */}
          <div className="triggers">
            <div className="left-section-label" style={{ marginBottom: 8 }}>Triggers detected</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {TRIGGERS.map((t, i) => (
                <span key={i} className={`trigger-tag ${t.kind}`}>
                  <span className="dot" />{t.text}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ───── Results ───── */}
      <div className={`results ${showResults ? "show" : ""}`}>
        <div className="results-card">
          <div className="results-head">
            <div className="results-eyebrow">VoiceCoach · Post-call review</div>
            <div className="results-title">
              {idealCount === 4 ? "Clean save."
                : idealCount === 3 ? "On the pass bar."
                : idealCount === 2 ? "Worth a re-take."
                : "Re-take recommended."}
            </div>
            <div className="results-sub">
              {idealCount >= 3
                ? "You kept to LAER while the caller was angry, and by the end he is calm enough to end the call. The replay below shows what kept the call on track."
                : "Tension climbed when your replies stepped outside LAER. The replay below shows each moment. Study the ones tagged Off-script."}
            </div>
          </div>

          <div className="results-score">
            <div className="res-score-num"><b>{idealCount}</b>/4</div>
            <div className="res-meta">
              <div className="res-meta-row"><span style={{ minWidth: 110, color: "var(--ink-3)" }}>Pass bar</span><b>3 / 4 ideal</b></div>
              <div className="res-meta-row"><span style={{ minWidth: 110, color: "var(--ink-3)" }}>Passable</span><b>{passableCount}</b></div>
              <div className="res-meta-row"><span style={{ minWidth: 110, color: "var(--ink-3)" }}>Off-script</span><b>{wrongCount}</b></div>
            </div>
            <div className="res-end-tension">
              <div className="res-end-tension-label">End tension</div>
              <div className="res-end-tension-num" style={{ color: sentiment.color }}>{Math.round(tension)}</div>
            </div>
          </div>

          <div className="res-list">
            {decisions.map((d, i) => {
              const b = BRANCHES[d.branchIdx];
              return (
                <div key={i} className="res-row">
                  <div className="res-stage">
                    <b>{b.code}</b>
                    {b.stage}
                  </div>
                  <div>
                    <span className={`res-tag ${d.grade}`}>
                      {d.grade === "ideal" ? "LAER-aligned" : d.grade === "passable" ? "Passable" : "Off-script"}
                      <span style={{ marginLeft: 6, opacity: 0.7 }}>· {d.confidence}% confidence</span>
                    </span>
                    <div className="res-q">{(turns.find((t) => t.who === "caller" && t.branchIdx === d.branchIdx) || {}).text || b.caller}</div>
                    <div className="res-you">{d.text}</div>
                    <div className="res-fb">{d.feedback}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="results-cta">
            <button className="res-btn" onClick={restart}>Run another call</button>
            <a className="res-btn secondary" href="index.html">← Back to index</a>
          </div>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
