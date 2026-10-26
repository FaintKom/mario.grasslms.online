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
  calls30d: "3 incl. this one",
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
        stage: "Uses his call history",
        text:
          "I can see your two calls about the duplicate £84.20 charge, and I'm sorry you've had to call back, that's frustrating. I want to make sure this is the last time.",
        delta: -10,
        feedback: "You named what went wrong for him before asking for anything operational. You also showed that his two earlier calls are on your screen, so he does not have to tell the story a third time.",
      },
      {
        grade: "passable",
        confidence: 71,
        stage: "Asks for details first",
        text:
          "Okay, let me see what's been going on with your account. Can I get your account number?",
        delta: -2,
        feedback: "You went straight to account details without mentioning that this is his third call. The account number you asked for is already on your screen, and he will answer while still resenting it.",
      },
      {
        grade: "wrong",
        confidence: 31,
        stage: "Treats him as a new caller",
        text:
          "Okay, so what's the issue today?",
        delta: 12,
        feedback: "Treating the call as new tells him his two earlier calls are invisible to you. That confirms his fear that nobody owns the problem.",
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
        stage: "Names the failure",
        text:
          "That shouldn't have happened. You were told it was resolved, and it wasn't. I'm going to fix it now, and you'll have a refund reference before we hang up.",
        delta: -12,
        feedback: "You named the specific failure, that he was told it was resolved when it wasn't. You also promised something he can check before the call ends, and that is what starts to turn the call around.",
      },
      {
        grade: "passable",
        confidence: 68,
        stage: "Generic empathy",
        text:
          "I understand. Let me pull up the account and see what was logged last time.",
        delta: -3,
        feedback: "Pulling up the account is the right next step. \"I understand\" only sounds like an acknowledgement, because it does not say what went wrong for him.",
      },
      {
        grade: "wrong",
        confidence: 28,
        stage: "Explains it away",
        text:
          "Sometimes these things take a billing cycle to clear. It might not actually be a new charge.",
        delta: 18,
        feedback: "You explained away a failure that had already been confirmed. After two earlier calls, Marcus hears that you doubt his account of what happened, and his next line will probably be angrier.",
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
        stage: "Asks a diagnostic question",
        text:
          "I hear you, and I won't make you go through the whole story again. I only need one thing from you so I fix the right fault this time. Did you pay the £84.20 yourself, or did both payments go out on auto-pay?",
        delta: -8,
        feedback: "You acknowledged the time he has lost in a few words and then asked the one thing your screen cannot tell you. A payment he made by hand on top of auto-pay is a different fault from auto-pay charging him twice, and his answer tells you which one to fix.",
      },
      {
        grade: "passable",
        confidence: 64,
        stage: "Marks it as priority",
        text:
          "I'll mark this as a priority case so it doesn't get lost again.",
        delta: -1,
        feedback: "Marking the case as a priority feels helpful, but it tells you nothing new about the fault. One question about how he paid would have pointed you to it.",
      },
      {
        grade: "wrong",
        confidence: 22,
        stage: "Quotes policy",
        text:
          "Unfortunately we're not able to compensate for personal time.",
        delta: 15,
        feedback: "He was describing what this is costing him and had not asked for compensation. A line of policy tells him nobody is listening, and it is the kind of reply that gives contact-centre training a bad name.",
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
    // Used when the agent asked the Explore question: he answers it first.
    callerAnswering: "Auto-pay, both times. I never paid it myself. Just refund me and let me get on with my day.",
    callerAnsweringEscalated:
      "Auto-pay, both of them! Just give me my money back and stop wasting my time.",
    options: [
      {
        grade: "ideal",
        confidence: 98,
        stage: "Specific close",
        text:
          "Done. I've issued the £84.20 refund, and I'm emailing you the reference now. It'll be back on your Visa in 3 to 5 working days. I've also locked the duplicate so it can't auto-repeat. Anything else before I let you go?",
        delta: -15,
        feedback: "He hears the amount, gets a reference he can quote and a timeline you can keep, and learns the duplicate cannot repeat. The last question lets him end the call when he is ready.",
      },
      {
        grade: "passable",
        confidence: 56,
        stage: "Vague close",
        text:
          "I'm processing the refund now. You should see it back in a few days.",
        delta: -4,
        feedback: "\"A few days\" is vague, and he has already been told once that the problem was solved. A specific timeline gives him a reason to trust you, and a vague one brings his doubts back.",
      },
      {
        grade: "wrong",
        confidence: 18,
        stage: "Transfers him",
        text:
          "I'll need to transfer you over to billing to process the refund. Please hold.",
        delta: 22,
        feedback: "This would be his third transfer on a call about not being helped. It undoes everything you did well before it.",
      },
    ],
  },
];

const CALL_END_AT = 30;

/* Trigger phrases light up only once the caller has actually said them. */
const TRIGGERS = [
  { kind: "neg", text: "third time",         match: /third time/i },
  { kind: "neg", text: "nobody's helped me", match: /nobody's helped/i },
  { kind: "neg", text: "two calls already",  match: /two calls/i },
  { kind: "neg", text: "nobody's listening", match: /nobody's listening/i },
  { kind: "neg", text: "billed again",       match: /billed again/i },
  { kind: "neg", text: "time off work",      match: /time off/i },
  { kind: "neg", text: "losing money",       match: /losing money/i },
  { kind: "neg", text: "wasting my time",    match: /wasting my time/i },
];

/* At or above this tension the caller's next line is the escalated version. */
const ESCALATE_AT = 65;

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

  /* The caller's line for a branch. After an ideal Explore reply he answers the question first. */
  const callerLine = (b, escalated) => {
    const prev = decisions[decisions.length - 1];
    const answered = !!b.callerAnswering && prev && prev.grade === "ideal" && BRANCHES[prev.branchIdx].code === "E";
    if (answered) return escalated ? b.callerAnsweringEscalated : b.callerAnswering;
    return escalated ? b.callerEscalated : b.caller;
  };

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
      const t = setTimeout(() => setShowResults(true), 600);
      return () => clearTimeout(t);
    }
    const branch = BRANCHES[branchIdx];

    if (stage === "caller-typing") {
      const t = setTimeout(() => setStage("caller-speaking"), PRE_CALLER_DELAY);
      return () => clearTimeout(t);
    }

    if (stage === "caller-speaking") {
      setCallTime(branch.callerAt);
      const escalated = tension >= ESCALATE_AT && !!branch.callerEscalated;
      const mood = sentimentLabel(tension);
      const fullText = callerLine(branch, escalated);
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
              { who: "caller", text: fullText, branchIdx, time: fmtTime(branch.callerAt), escalated, sentiment: mood.cls, mood: mood.word },
            ]);
            setCallerChars(0);
            setStage("options");
          }, 240);
        }
      };
      let timer = setTimeout(tick, TYPE_SPEED);
      return () => clearTimeout(timer);
    }

    /* "reply-sending" waits for the learner: the coach note stays until Continue or Enter. */
  }, [stage, branchIdx, tension]);

  /* Bring the coach note into view and put focus on its Continue button. */
  const toastRef = useRef(null);
  const continueRef = useRef(null);
  useEffect(() => {
    if (!coachToast) return;
    const t = setTimeout(() => {
      if (toastRef.current) toastRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
      if (continueRef.current) continueRef.current.focus({ preventScroll: true });
    }, POST_REPLY_DELAY / 3);
    return () => clearTimeout(t);
  }, [coachToast]);

  const advance = () => {
    if (stage !== "reply-sending") return;
    setCoachToast(null);
    setPicked(null);
    setBranchIdx((b) => b + 1);
    setStage("caller-typing");
  };

  /* Scroll transcript to bottom on new content */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns.length, stage, callerChars]);

  /* Keyboard 1/2/3 to pick, Enter to continue after the coach note */
  useEffect(() => {
    const onKey = (e) => {
      if (showResults) return;
      if (stage === "reply-sending") {
        if (e.key === "Enter") { e.preventDefault(); advance(); }
        return;
      }
      if (stage !== "options") return;
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
  const callerSaid = turns.filter((t) => t.who === "caller").map((t) => t.text).join(" ");
  const detectedTriggers = TRIGGERS.filter((t) => t.match.test(callerSaid));
  // Pass = at least 3 ideal AND no slip at Respond: a transfer-out at the close undoes the call.
  const rDecision = decisions.find((d) => BRANCHES[d.branchIdx].code === "R");
  const rSlip = !!rDecision && rDecision.grade === "wrong";
  const passed = idealCount >= 3 && !rSlip;
  const endCalm = tension <= 30;

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
                <div className="cust-pill">Identity verified · IVR</div>
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
                <div className="cust-stat-label">Calls · 30 days</div>
                <div className="cust-stat-val">{CUSTOMER.calls30d}</div>
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
                        {t.mood}
                      </span>
                    )}
                  </div>
                  <div className="turn-bubble">{t.text}</div>
                  {t.who === "you" && (
                    <div className={`turn-grade-pill ${t.grade}`}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                      {t.grade === "ideal" ? "Ideal" : t.grade === "passable" ? "Passable" : "Off-script"}
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
              <div className={`turn caller ${tension >= ESCALATE_AT && branch.callerEscalated ? "escalated" : ""}`}>
                <div className="turn-avatar">{CUSTOMER.initials}</div>
                <div>
                  <div className="turn-meta">
                    <span className="turn-name">{CUSTOMER.name}</span>
                    <span className="turn-time">{fmtTime(branch.callerAt)} · live</span>
                  </div>
                  <div className="turn-bubble">
                    {callerLine(branch, tension >= ESCALATE_AT && !!branch.callerEscalated).slice(0, callerChars)}
                    <span style={{ opacity: 0.35 }}>▍</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="composer">
            <div className="composer-row">
              <div className="composer-input placeholder">
                {stage === "options" ? "Pick one of the coach's suggested replies on the right" : stage === "reply-sending" ? "Read the coach's note on the right, then press Continue" : "…"}
              </div>
              <button className="sp-btn" title="Voice" style={{ height: 36, width: 36 }}>🎤</button>
              <button className="sp-btn" title="Send" disabled style={{ height: 36, width: 36, opacity: 0.4 }}>↵</button>
            </div>
            <div className="composer-hint">
              <span className="pill"><span className="dot" />VoiceCoach AI</span>
              {stage === "options" ? <>The coach has three replies for you on the right</>
                : stage === "reply-sending" ? <>Press Enter or Continue once you have read the note</>
                : <>The coach is listening to the call</>}
            </div>
          </div>
        </section>

        {/* ─── Right: AI Coaching ─── */}
        <aside className="right">
          <div className="right-head">
            <div className="right-head-title">{branch ? `${branch.stage}, the ${branch.code} in LAER` : "The call has ended"}</div>
            <div className="right-head-sub">VoiceCoach listens to the call, tracks how tense the customer is and suggests three replies at each step of LAER (listen, acknowledge, explore, respond).</div>
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
                        : <>Press <span className="suggest-kbd">{i + 1}</span> or click to send</>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Coach toast (between turns) */}
          {coachToast && (
            <div className={`coach-toast show ${coachToast.grade}`} ref={toastRef} role="status">
              <div className="coach-toast-head">
                {coachToast.grade === "ideal" ? "Ideal. This is LAER done properly."
                  : coachToast.grade === "passable" ? "Passable. It works, but he still feels unheard."
                  : "Off-script. This makes him angrier."}
              </div>
              <div className="coach-toast-body">{coachToast.feedback}</div>
              <button className="coach-toast-cta" ref={continueRef} onClick={advance}>
                {branchIdx + 1 < BRANCHES.length ? "Continue →" : "End call and review →"}
              </button>
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
                      {d ? (d.grade === "ideal" ? "✓ ideal" : d.grade === "passable" ? "○ passable" : "✕ off-script") : isActive ? "active" : "queued"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.45 }}>
              To pass, at least <b style={{ color: "var(--ink)" }}>three of the four replies</b> have to be ideal. The close at R cannot be off-script, because a bad close undoes the rest of the call.
            </div>
          </div>

          {/* Trigger phrases */}
          <div className="triggers">
            <div className="left-section-label" style={{ marginBottom: 8 }}>Triggers detected</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {detectedTriggers.length === 0
                ? <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>The caller has not said any trigger phrases yet.</span>
                : detectedTriggers.map((t) => (
                  <span key={t.text} className={`trigger-tag ${t.kind}`}>
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
            <div className="results-title">
              {idealCount === 4 ? "All four of your replies were ideal"
                : passed ? "You passed with 3 of 4 ideal replies"
                : idealCount >= 3 ? "You did not pass, because your close transferred him a third time"
                : `${idealCount} of 4 replies were ideal, below the pass mark of 3`}
            </div>
            <div className="results-sub">
              {passed && endCalm
                ? "You kept to LAER while he was angry, and by the end he was calm enough to finish the call. The replay below shows which replies kept it on track."
                : passed
                ? "You kept to LAER for most of the call, but he still sounds upset when it ends. The replay below shows which reply cost you."
                : idealCount >= 3
                ? "Three of your replies were ideal, but the close sent him to a third transfer. The replay below shows why that one reply decides how the call ends."
                : "His tension rose each time a reply went off-script. Go through the replay below and look most closely at the replies marked Off-script."}
            </div>
          </div>

          <div className="results-score">
            <div className="res-score-num"><b>{idealCount}</b>/4</div>
            <div className="res-meta">
              <div className="res-meta-row"><span style={{ minWidth: 110, color: "var(--ink-3)" }}>Pass mark</span><b>3 of 4 ideal, close not off-script</b></div>
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
                      {d.grade === "ideal" ? "Ideal" : d.grade === "passable" ? "Passable" : "Off-script"}
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
            <button className="res-btn" onClick={restart}>Take the call again</button>
            <a className="res-btn secondary" href="index.html">← Back to index</a>
          </div>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
