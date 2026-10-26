const { useState, useEffect, useRef, useMemo, Fragment } = React;

/* ─────────────────────────────────────────────────────
   Phish-or-Pass — Outlook inbox simulation
   Day-1 inbox triage with one trick-positive.
   ───────────────────────────────────────────────────── */

const EMAILS = [
  {
    id: "m-helpdesk",
    avatarColor: "#605E5C",
    avatarText: "IT",
    senderShort: "IT Helpdesk",
    sender: { display: "IT Helpdesk", real: "helpdesk@compan-y-it.com", external: true, verification: "External sender" },
    subject: "Action required: your password expires today",
    preview: "Our records show your corporate password expires today at 17:00…",
    time: "7:58 AM",
    day: "Today",
    banner: null,
    body: ({ urlHover }) => (
      <>
        <p className="salute">Dear user,</p>
        <p>
          Our records show your corporate password <b>expires today at 17:00</b>. To keep your
          account active and avoid being locked out of email, please verify your identity
          within the next hour.
        </p>
        <p>
          <a
            className="email-link"
            href="#nope"
            data-display="company.com/password-reset"
            data-real="compan-y-it.com/reset?uid=4f2"
            data-bad="1"
            onClick={(e) => e.preventDefault()}
            onMouseEnter={(e) => urlHover.set({
              display: "company.com/password-reset",
              real: "compan-y-it.com/reset?uid=4f2",
              bad: true,
            })}
            onMouseLeave={() => urlHover.clear()}
          >
            company.com/password-reset
          </a>
        </p>
        <p>
          Failure to act will result in account suspension. If you require assistance,
          contact your local IT support representative.
        </p>
        <p className="signoff">— IT Service Desk</p>
      </>
    ),
    correct: "phishing",
    teach: {
      title: "A phishing email that is after your password",
      summary:
        "The display name says IT Helpdesk, but the message came from compan-y-it.com. That domain is made to look like the company's own, and the reset link leads to it too. In four lines the email pushes you to hurry three times.",
      indicators: [
        { kind: "bad", text: "The display name says internal IT Helpdesk. The address behind it is on the outside domain compan-y-it.com." },
        { kind: "bad", text: "Outlook labels the sender as external. An email from your own IT team would not carry that label." },
        { kind: "bad", text: "The link text reads company.com. When you hover over it, the address is compan-y-it.com." },
        { kind: "bad", text: "\"Expires today\", \"keep your account active\" and \"failure to act\" all appear within four lines." },
      ],
      verdictIfRight: "Every tell in this message points the same way. A Junk report would also have cleared your inbox, but the message would then have waited in the slower IT review queue instead of reaching the security team.",
      verdictIfWrong: {
        safe: "Keeping it leaves a link that collects passwords in a live inbox. This was the easiest of the four, so look at the sender address and the link again before you open the next one.",
        junk: "This message has an outside sender posing as internal IT, an imitation domain and repeated pressure to hurry. That many tells belong in a phishing report, which the security team handles first.",
      },
    },
  },
  {
    id: "m-people-ops",
    avatarColor: "#C239B3",
    avatarText: "SC",
    senderShort: "Sarah Chen",
    sender: { display: "Sarah Chen", real: "sarah.chen@company.com", external: false, verification: "Verified internal sender" },
    subject: "Welcome to the team — your week-1 checklist",
    preview: "So glad you're with us. I've shared your week-1 checklist below — calendar invites…",
    time: "8:22 AM",
    day: "Today",
    banner: null,
    body: () => (
      <>
        <p className="salute">Hi, and welcome to the team!</p>
        <p>
          So glad you're with us. I've shared your <b>week-1 checklist</b> below — your 1:1
          with your manager and the Friday team lunch are already on your calendar.
        </p>
        <p>
          <b>Heads up:</b> in the next hour you'll get a <b>DocuSign envelope</b> for your
          employment paperwork (employment agreement, IP assignment, tax forms). Sign that
          today if you can — it unblocks your benefits enrolment on Monday.
        </p>
        <p>
          Any questions, ping me directly. My door is open.
        </p>
        <p className="signoff">Sarah<br/>
          <span style={{ color: "var(--ink-3)", fontSize: 12.5 }}>People Operations · ext. 4203</span>
        </p>
      </>
    ),
    correct: "safe",
    teach: {
      title: "An ordinary welcome email from People Operations",
      summary:
        "The display name matches the address, and Outlook shows Sarah as a verified internal sender. Nothing in the email is urgent. She also mentions a DocuSign envelope due within the hour, and you will need that when you reach the fourth message.",
      indicators: [
        { kind: "ok", text: "The display name matches the address the email came from, sarah.chen@company.com." },
        { kind: "ok", text: "Outlook shows her as a verified internal sender." },
        { kind: "neutral", text: "Nothing in the email asks for money, rushes you or tries to move the conversation off email." },
        { kind: "neutral", text: "Sarah says a DocuSign envelope will arrive within the next hour." },
      ],
      verdictIfRight: "Every tell in this message is clean, and there is nothing to report. A report would only have added work for the security team.",
      verdictIfWrong: {
        junk: "A Junk report on a verified colleague adds to the pile the security team sorts through. When reports like this accumulate, real threats are harder to spot.",
        phishing: "New hires often report their People Operations contact as phishing after general awareness training. Here the address, the verified sender and the content are all ordinary.",
      },
    },
  },
  {
    id: "m-ceo-bec",
    avatarColor: "#0078D4",
    avatarText: "SA",
    senderShort: "Sundar Aravind",
    sender: { display: "Sundar Aravind", real: "ceo.aravind@gmail.com", external: true, verification: "External sender · personal mailbox" },
    subject: "Quick favour — are you at your desk?",
    preview: "Are you at your desk? I need a quick favour and I'm stuck in back-to-back meetings…",
    time: "8:46 AM",
    day: "Today",
    banner: { kind: "warn", title: "First-time sender. This email looks similar to a previous sender's display name.", detail: "Display name \"Sundar Aravind\" resembles an internal contact. Real sender is a personal gmail.com address.", action: "Show original" },
    body: ({ urlHover }) => (
      <>
        <p className="salute">Hello,</p>
        <p>
          Are you at your desk? I need a <b>quick favour</b> and I'm stuck in back-to-back
          meetings — can't take calls.
        </p>
        <p>
          Send me your <b>mobile number</b> so we can move this to text, not email. I'll send
          instructions once I know you're available. <b>Don't loop anyone else in</b> — keep
          this between us for now.
        </p>
        <p className="signoff">— S<br/>
          <span style={{ color: "var(--ink-3)", fontSize: 12.5 }}>Sent from my iPhone</span>
        </p>
      </>
    ),
    correct: "phishing",
    teach: {
      title: "A message pretending to come from the CEO",
      summary:
        "The display name belongs to the CEO, but the email came from a personal Gmail address. In a few lines it asks for a quick favour, asks you to keep it to yourself and asks for your mobile number. In this kind of attack, called business email compromise, the next message usually asks for gift cards or a bank transfer.",
      indicators: [
        { kind: "bad", text: "The name Sundar Aravind looks like an internal executive. The address behind it is ceo.aravind@gmail.com." },
        { kind: "bad", text: "Defender warns that this address has never written to you and that its display name resembles someone you know." },
        { kind: "bad", text: "The sender is in a hurry and wants to move to text messages, where the company's mail filters cannot see the conversation." },
        { kind: "bad", text: "\"Don't loop anyone else in\" stops you from checking the request with a colleague." },
      ],
      verdictIfRight: "First messages like this rarely contain anything harmful yet. Stopping one means the request for money never arrives.",
      verdictIfWrong: {
        safe: "Keeping this message is the mistake this course is built to prevent, because the next step is usually a reply with your mobile number.",
        junk: "Junk sends the message to the slower IT review queue. A phishing report fits these tells better, and it also alerts the executive team.",
      },
    },
  },
  {
    id: "m-docusign",
    avatarColor: "#FFCC00",
    avatarText: "DS",
    avatarClass: "docusign",
    senderShort: "DocuSign",
    trickPositive: true,
    sender: { display: "DocuSign via Sarah Chen", real: "dse_NA8@docusign.net", external: true, verification: "External sender" },
    subject: "Sarah Chen sent you a document to sign: Employment Agreement",
    preview: "Sarah Chen has sent you a document to sign. Employment Agreement · 7 pages…",
    time: "9:14 AM",
    day: "Today",
    banner: null,
    body: ({ urlHover }) => (
      <>
        <p className="salute">Hello,</p>
        <p>
          Sarah Chen has sent you a new DocuSign document to review and sign.
        </p>
        <div className="docusign-card">
          <div className="ds-logo"><b>Docu</b>Sign<sup style={{ fontSize: 8, marginLeft: 2 }}>®</sup></div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginTop: 4 }}>Employment Agreement</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4 }}>
            7 pages · Envelope ID: 4f8e21c0-NA8-c734-91ad
          </div>
          <a
            className="docusign-cta"
            href="#nope"
            data-real="na8.docusign.net/Member/EmailStart.aspx?a=4f8e21c0-NA8-c734-91ad"
            data-bad="0"
            style={{ marginTop: 16, display: "inline-block", textDecoration: "none" }}
            onClick={(e) => e.preventDefault()}
            onMouseEnter={() => urlHover.set({
              display: "Review and sign",
              real: "na8.docusign.net/Member/EmailStart.aspx?a=4f8e21c0-NA8…",
              bad: false,
            })}
            onMouseLeave={() => urlHover.clear()}
          >
            Review and sign
          </a>
        </div>
        <p style={{ color: "var(--ink-3)", fontSize: 12.5, marginTop: 14 }}>
          This email was sent on behalf of <b>Sarah Chen</b> from Company. If you have
          questions about this document, contact the sender directly. To stop receiving
          this email, click here.
        </p>
        <p style={{ color: "var(--ink-3)", fontSize: 11.5, marginTop: 14 }}>
          DocuSign, Inc. · 221 Main St., San Francisco, CA 94105
        </p>
      </>
    ),
    correct: "safe",
    teach: {
      title: "A genuine DocuSign envelope that looks suspicious",
      summary:
        "The sender is dse_NA8@docusign.net and the link leads to docusign.net. On their own these prove less than they seem, because attackers can send envelopes through real DocuSign accounts too. What settles it is Sarah's earlier email saying this envelope was on its way.",
      indicators: [
        { kind: "ok", text: "Sarah's welcome email said this envelope would arrive within the hour. That is the tell that decides it." },
        { kind: "ok", text: "The sender domain is docusign.net, which DocuSign does use for envelopes. A correct domain would not be enough on its own." },
        { kind: "ok", text: "The link leads to na8.docusign.net, the address DocuSign uses for envelopes in North America." },
        { kind: "neutral", text: "Without Sarah's email, the safe move would have been to open the envelope from docusign.com with its access code instead of clicking the link." },
      ],
      verdictIfRight: "Most people taking this course report this one, because awareness training teaches them to distrust anything transactional. Keeping it when the evidence says it is genuine is harder, and it is correct.",
      verdictIfWrong: {
        junk: "Genuine DocuSign mail is often reported as Junk because it looks transactional. When a team keeps doing that, the security team stops trusting its reports.",
        phishing: "You were told to expect this envelope. Reporting it as phishing is the overreaction this course sets out to correct, and awareness training rarely covers it.",
      },
    },
  },
];

const FOLDERS = [
  { name: "Focused", icon: "★", count: 4, active: true },
  { name: "Other", icon: "📥", count: 12 },
  { name: "Drafts", icon: "✏", count: 1 },
  { name: "Sent items", icon: "→", count: null },
  { name: "Deleted items", icon: "🗑", count: 3, muted: true },
  { name: "Junk email", icon: "⚠", count: null, muted: true },
  { name: "Archive", icon: "▤", count: null, muted: true },
  { name: "Notes", icon: "▭", count: null, muted: true },
  { name: "Conversation history", icon: "↔", count: null, muted: true },
];

const CHOICES = {
  safe:      { id: "safe",     label: "Looks fine",        ribbon: "Looks fine (kept)",   toast: "Kept in Inbox. No further action.",                                            toastKind: "info"    },
  junk:      { id: "junk",     label: "Report as junk",    ribbon: "Report > Junk",       toast: "Reported to your IT team. Message moved to Junk Email.",                       toastKind: "info"    },
  phishing:  { id: "phishing", label: "Report as phishing", ribbon: "Report > Phishing",   toast: "Reported to Security. Message moved to Deleted Items and a copy sent to SOC.", toastKind: "success" },
};

const STANDUP_SECONDS = 180;
function fmtClock(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ─────────────────────────────────────────────────────
   App
   ───────────────────────────────────────────────────── */
function App() {
  const [selectedId, setSelectedId] = useState(EMAILS[0].id);
  const [decisions, setDecisions] = useState({}); // id → { choice, correct }
  const [coach, setCoach] = useState(null);       // { email, choice, correct }
  const [toast, setToast] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [urlInfo, setUrlInfo] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [standupLeft, setStandupLeft] = useState(STANDUP_SECONDS);

  /* Soft time pressure: counts down while the learner triages, stops on results.
     Reaching zero changes nothing but the label. */
  useEffect(() => {
    if (showResults) return;
    const id = setInterval(() => setStandupLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [showResults]);

  const email = useMemo(() => EMAILS.find((e) => e.id === selectedId), [selectedId]);
  const decided = !!decisions[email?.id];

  const done = Object.keys(decisions).length;
  const correct = Object.values(decisions).filter((d) => d.correct).length;
  const progressPct = Math.round((done / EMAILS.length) * 100);
  // Pass = at least 3 of 4 correct AND the trick positive (genuine DocuSign) handled correctly.
  const trickOk = EMAILS.filter((e) => e.trickPositive).every((e) => decisions[e.id]?.correct);
  const passed = correct >= EMAILS.length - 1 && trickOk;

  const urlHover = useMemo(() => ({
    set: (info) => setUrlInfo(info),
    clear: () => setUrlInfo(null),
  }), []);

  const toastTimer = useRef(null);
  const showToast = (msg, kind, ms = 2200) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, kind });
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  // The ribbon's everyday buttons are not triage decisions. They answer with a nudge
  // instead of doing nothing, because "just delete it" is a real new-hire reflex.
  const nudge = (kind) => {
    const msg = {
      delete: "Delete only clears your own inbox, and security never hears about it. Use Looks fine or Report.",
      archive: "Archive keeps the message without a decision. Use Looks fine or Report.",
      reply: "Decide what this message is first, with Looks fine or Report.",
    }[kind];
    showToast(msg, "info", 3200);
  };

  const decide = (choiceId) => {
    if (!email || decisions[email.id]) return;
    const isCorrect = choiceId === email.correct;
    const choice = CHOICES[choiceId];
    setDecisions((d) => ({ ...d, [email.id]: { choice: choiceId, correct: isCorrect } }));
    setReportOpen(false);
    // Toast
    showToast(choice.toast, choice.toastKind);
    // Coach panel after a beat
    setTimeout(() => {
      setCoach({ email, choice: choiceId, correct: isCorrect });
    }, 600);
  };

  const reopenCoach = () => {
    const d = email && decisions[email.id];
    if (d) setCoach({ email, choice: d.choice, correct: d.correct });
  };

  const nextEmail = () => {
    // Start from the message the coach note is about, even if another row was clicked meanwhile.
    const current = coach ? coach.email : email;
    setCoach(null);
    setTimeout(() => {
      // pick next undecided email in order
      const order = EMAILS.map((e) => e.id);
      const startIdx = order.indexOf(current.id);
      let nextId = null;
      for (let i = 1; i <= order.length; i++) {
        const candidate = order[(startIdx + i) % order.length];
        if (!decisions[candidate] && candidate !== current.id) { nextId = candidate; break; }
      }
      // re-check now-completed state including current decision
      const allDone = Object.keys({ ...decisions, [current.id]: true }).length >= EMAILS.length;
      if (!nextId && allDone) {
        setShowResults(true);
      } else if (nextId) {
        setSelectedId(nextId);
      }
    }, 300);
  };

  const restart = () => {
    setSelectedId(EMAILS[0].id);
    setDecisions({});
    setCoach(null);
    setToast(null);
    setShowResults(false);
    setStandupLeft(STANDUP_SECONDS);
  };

  // Close report menu on outside click
  useEffect(() => {
    if (!reportOpen) return;
    const onClick = (e) => {
      if (!e.target.closest(".rb-report-wrap")) setReportOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reportOpen]);

  return (
    <>
      {/* ───── M365 top bar ───── */}
      <header className="m365">
        <div className="m365-left">
          <div className="m365-waffle" title="App launcher">
            <div className="m365-waffle-grid">
              {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
            </div>
          </div>
          <div className="m365-app"><b>Outlook</b></div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="m365-search">
            <span className="m365-search-icon" />
            <span>Search</span>
          </div>
        </div>
        <div className="m365-right">
          <div className="m365-icon" title="Teams">💬</div>
          <div className="m365-icon" title="Settings">⚙</div>
          <div className="m365-icon" title="Help">?</div>
          <div className="m365-avatar" title="You">YN</div>
        </div>
      </header>

      {/* ───── Action ribbon ───── */}
      <div className="ribbon">
        <div className="rb-group">
          <a href="index.html" className="rb-btn" title="Back to portfolio index">
            <span className="rb-icon">←</span>
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Index</span>
          </a>
        </div>

        <div className="rb-group">
          <button className="rb-btn primary">
            <span className="rb-icon">＋</span>
            New mail
            <span className="rb-caret" />
          </button>
        </div>

        <div className="rb-group">
          <button className="rb-btn" disabled={!email || decided} onClick={() => nudge("reply")}>
            <span className="rb-icon">↩</span>Reply
          </button>
          <button className="rb-btn" disabled={!email || decided} onClick={() => nudge("reply")}>
            <span className="rb-icon">↪</span>Forward
          </button>
          <button className="rb-btn rb-delete" disabled={!email || decided} onClick={() => nudge("delete")}>
            <span className="rb-icon">⌫</span>Delete
          </button>
          <button className="rb-btn rb-archive" disabled={!email || decided} onClick={() => nudge("archive")}>
            <span className="rb-icon">▤</span>Archive
          </button>
        </div>

        {/* Triage actions — the real decisions */}
        <div className="rb-group" style={{ background: decided ? "transparent" : "var(--rail)", borderRadius: 4 }}>
          <button
            className="rb-btn"
            onClick={() => decide("safe")}
            disabled={!email || decided}
            title="Keep in Inbox. No further action."
          >
            <span className="rb-icon" style={{ color: "var(--ok-fg)" }}>✓</span>
            Looks fine
          </button>
          <div className="rb-report-wrap">
            <button
              className="rb-btn danger"
              onClick={(e) => { e.stopPropagation(); setReportOpen((o) => !o); }}
              disabled={!email || decided}
              title="Report message"
            >
              <span className="rb-icon">⚠</span>
              Report
              <span className="rb-caret" />
            </button>
            <div className={`rb-report-menu ${reportOpen ? "" : ""}`} style={{ opacity: reportOpen ? 1 : 0, transform: reportOpen ? "translateY(0)" : "translateY(-4px)", pointerEvents: reportOpen ? "auto" : "none" }}>
              <button className="rb-menu-item" onClick={() => decide("phishing")}>
                <span style={{ color: "var(--danger-fg)" }}>⚠</span>
                <div className="rb-menu-item-text">
                  Report as phishing
                  <span className="rb-menu-item-sub">Sends to Security · moves to Deleted</span>
                </div>
              </button>
              <button className="rb-menu-item" onClick={() => decide("junk")}>
                <span style={{ color: "var(--warn-icon)" }}>✉</span>
                <div className="rb-menu-item-text">
                  Report as junk
                  <span className="rb-menu-item-sub">Moves to Junk · IT review queue</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="rb-spacer" />

        <div className="rb-meta">
          <span style={{ fontWeight: 600 }}>Phish-or-Pass</span>
          <div
            className={`standup-chip ${standupLeft <= 0 ? "over" : standupLeft < 60 ? "low" : ""}`}
            role="timer"
            aria-live="off"
            title="The standup is a soft deadline. Missing it does not change your score."
          >
            <span className="standup-icon" aria-hidden="true">◷</span>
            {standupLeft > 0
              ? <><span className="standup-word">Standup in </span>{fmtClock(standupLeft)}</>
              : <><span className="standup-word">Standup </span>started</>}
          </div>
          <div className="progress-chip">
            <span className="ring" style={{ "--p": `${progressPct}%` }} />
            {done} / {EMAILS.length} triaged · {correct} correct
          </div>
        </div>
      </div>

      {/* ───── Main 3-pane ───── */}
      <div className="main">
        {/* Folder rail */}
        <aside className="folders">
          <button className="folder-new">
            <span className="folder-new-plus">＋</span>
            <span>New mail</span>
          </button>
          <div className="folder-section">
            <div className="folder-section-title">Favourites</div>
            <div className="folder-item active">
              <span className="folder-item-icon">📥</span>
              <span>Inbox</span>
              <span className="folder-count">{EMAILS.length - done}</span>
            </div>
            <div className="folder-item muted">
              <span className="folder-item-icon">→</span>
              <span>Sent items</span>
            </div>
            <div className="folder-item muted">
              <span className="folder-item-icon">✏</span>
              <span>Drafts</span>
              <span className="folder-count">1</span>
            </div>
          </div>
          <div className="folder-section">
            <div className="folder-section-title">Folders</div>
            {FOLDERS.map((f) => (
              <div key={f.name} className={`folder-item ${f.muted ? "muted" : ""}`}>
                <span className="folder-item-icon">{f.icon}</span>
                <span>{f.name}</span>
                {f.count != null && <span className="folder-count">{f.count}</span>}
              </div>
            ))}
          </div>
          <div className="folder-section">
            <div className="folder-section-title">Groups</div>
            <div className="folder-item muted">
              <span className="folder-item-icon">▢</span>
              <span>New hires — Q2</span>
            </div>
            <div className="folder-item muted">
              <span className="folder-item-icon">▢</span>
              <span>Platform engineering</span>
            </div>
          </div>
        </aside>

        {/* Email list */}
        <section className="list">
          <div className="list-head">
            <div className="list-title">Inbox</div>
            <div className="list-sub">{EMAILS.length} items · oldest on top</div>
            <div className="list-tabs">
              <span className="list-tab active">Focused <span className="count">{EMAILS.length}</span></span>
              <span className="list-tab">Other <span className="count">12</span></span>
            </div>
          </div>

          <div className="list-day">Today</div>
          {EMAILS.map((e) => {
            const d = decisions[e.id];
            const isUnread = !d;
            const cls = [
              "list-row",
              selectedId === e.id && "selected",
              isUnread && "unread",
              d && "done",
              d && !d.correct && "wrong",
            ].filter(Boolean).join(" ");
            return (
              <div key={e.id} className={cls} onClick={() => { setSelectedId(e.id); setUrlInfo(null); }}>
                <div className="list-row-blue-bar" />
                <div className={`list-row-avatar ${e.avatarClass || ""} ${!d ? "" : ""}`} style={{ background: e.avatarColor, color: e.avatarClass === "docusign" ? "#000" : "#fff" }}>
                  {e.avatarText}
                </div>
                <div className="list-row-header">
                  <span className="list-row-sender">{e.senderShort}</span>
                </div>
                <div className="list-row-time">{e.time}</div>
                <div className="list-row-subject">{e.subject}</div>
                <div className="list-row-preview">{e.preview}</div>
                {d && (
                  <div className="list-row-decision-tag">
                    <span className="dot" />
                    {d.correct
                      ? (d.choice === "safe" ? "Kept in Inbox" : d.choice === "junk" ? "Reported as Junk" : "Reported as Phishing")
                      : `Mis-triaged · ${d.choice === "safe" ? "kept" : d.choice === "junk" ? "junk" : "phish"}`}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Reader */}
        <section className="reader" id="reader">
          {!email ? (
            <div className="reader-empty">Select an item to read.</div>
          ) : (
            <div className="read-card" key={email.id}>
              <div className="read-subject-row">
                <div className="read-subject">{email.subject}</div>
                <div className="read-actions-mini">
                  <button className="read-action-mini" title="Flag">🚩</button>
                  <button className="read-action-mini" title="Mark unread">●</button>
                  <button className="read-action-mini" title="More">⋯</button>
                </div>
              </div>

              {decided && !coach && !showResults && (
                <div className="triaged-note">
                  <span>
                    You chose <b>{CHOICES[decisions[email.id].choice].label}</b> for this message.
                    {done < EMAILS.length ? " Pick the next one in the list." : " All four are done."}
                  </span>
                  <button className="banner-action" onClick={reopenCoach}>Open coach note</button>
                  {done >= EMAILS.length && (
                    <button className="banner-action" onClick={() => setShowResults(true)}>See results</button>
                  )}
                </div>
              )}

              {email.banner && (
                <div className={`banner ${email.banner.kind}`}>
                  <span className="banner-icon">
                    {email.banner.kind === "danger" ? "⚠" : email.banner.kind === "warn" ? "△" : email.banner.kind === "info" ? "ⓘ" : "✓"}
                  </span>
                  <div>
                    <b>{email.banner.title}</b>
                    <div style={{ marginTop: 2, color: "inherit", opacity: 0.85 }}>{email.banner.detail}</div>
                  </div>
                  <button className="banner-action">{email.banner.action}</button>
                </div>
              )}

              <div className="from-row">
                <div className="from-avatar" style={{ background: email.avatarColor, color: email.avatarClass === "docusign" ? "#000" : "#fff" }}>
                  {email.avatarText}
                </div>
                <div>
                  <div className="from-name-row">
                    <span className="from-name">{email.sender.display}</span>
                    <span className={`from-pill ${email.sender.external ? "warn" : "ok"}`}>
                      {email.sender.verification}
                    </span>
                  </div>
                  <div className="from-email">
                    &lt;{email.sender.real}&gt;
                    <span className="caret-down" />
                  </div>
                  <div className="from-to">
                    To: you@company.com <span className="caret-down" />
                  </div>
                </div>
                <div className="from-time">{email.day}, {email.time}</div>
              </div>

              <div className="read-body" onMouseLeave={() => urlHover.clear()}>
                {email.body({ urlHover })}
              </div>

              <div className="reply-bar">
                <button className="reply-btn">
                  <span className="rb-icon">↩</span>Reply
                </button>
                <button className="reply-btn">
                  <span className="rb-icon">↩↩</span>Reply all
                </button>
                <button className="reply-btn">
                  <span className="rb-icon">↪</span>Forward
                </button>
              </div>
            </div>
          )}

          {/* URL preview (status bar) */}
          <div className={`status-bar ${urlInfo ? "show" : ""}`}>
            <span className="url-prefix">URL:</span>
            {urlInfo && (
              urlInfo.bad
                ? <><span className="url-warn">{urlInfo.real}</span><span style={{ marginLeft: 8, color: "var(--ink-4)" }}>· link text shows "{urlInfo.display}"</span></>
                : <><span className="url-real">{urlInfo.real}</span></>
            )}
          </div>

          {/* Toast */}
          <div className={`toast ${toast ? "show" : ""} ${toast?.kind || ""}`}>
            <span>{toast?.kind === "success" ? "✓" : "ⓘ"}</span>
            <span>{toast?.msg}</span>
          </div>

          {/* Coach panel */}
          <CoachPanel
            coach={coach}
            onNext={nextEmail}
            onClose={() => {
              setCoach(null);
              // Closing the last coach note must not strand the learner before the results.
              if (done >= EMAILS.length) setTimeout(() => setShowResults(true), 300);
            }}
            allDone={done >= EMAILS.length}
          />

          {/* Results overlay */}
          <div className={`results ${showResults ? "show" : ""}`}>
            <div className="results-card">
              <div className="results-head">
                <div className="results-title">
                  {correct === EMAILS.length ? "You triaged all four messages correctly" :
                   passed ? "You passed with 3 of 4 right" :
                   correct >= EMAILS.length - 1 ? "You did not pass, because you reported the genuine DocuSign email" :
                   `You got ${correct} of 4 right, below the pass mark of 3`}
                </div>
                <div className="results-sub">
                  One of the four messages is genuine but looks suspicious. To pass you need 3 of 4
                  right, and the genuine one has to be among them.
                </div>
              </div>
              <div className="results-score-row">
                <div className="res-score"><b>{correct}</b>/{EMAILS.length}</div>
                <div className="res-meta">
                  <div className="res-meta-row">
                    <span style={{ minWidth: 110, color: "var(--ink-3)" }}>Pass mark</span>
                    <b>3 of 4, including the DocuSign email</b>
                  </div>
                </div>
              </div>
              <div className="res-list">
                {EMAILS.map((e) => {
                  const d = decisions[e.id];
                  if (!d) return null;
                  return (
                    <div key={e.id} className={`res-row ${d.correct ? "" : "wrong"}`}>
                      <div className="res-icon">{d.correct ? "✓" : "✕"}</div>
                      <div>
                        <div className="res-from">
                          {e.sender.display}
                          {e.trickPositive && (
                            <span style={{ marginLeft: 8, fontSize: 12.5, color: "var(--teach)", fontWeight: 500 }}>
                              (genuine, but looks suspicious)
                            </span>
                          )}
                        </div>
                        <div className="res-sub">{e.subject}</div>
                        <div className="res-note">
                          {d.correct ? e.teach.verdictIfRight : (e.teach.verdictIfWrong[d.choice] || e.teach.summary)}
                        </div>
                      </div>
                      <div className="res-choice">
                        <div>You: <b>{CHOICES[d.choice].ribbon}</b></div>
                        <div style={{ marginTop: 4, opacity: 0.8 }}>Correct: <b>{CHOICES[e.correct].ribbon}</b></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="res-cta">
                <button className="res-btn" onClick={restart}>Try again</button>
                <a className="res-btn secondary" href="index.html">← Back to index</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function CoachPanel({ coach, onNext, onClose, allDone }) {
  if (!coach) return <div className="coach"></div>;
  const { email, choice, correct } = coach;
  const teach = email.teach;
  const verdict = correct ? teach.verdictIfRight : (teach.verdictIfWrong[choice] || teach.summary);

  return (
    <div className={`coach show ${correct ? "" : "wrong"}`}>
      <div className="coach-head">
        <div className="coach-title">{teach.title}</div>
        <div className="coach-tag">
          <span className="coach-tag-dot" />
          {correct ? `${CHOICES[choice].label} fits this message.` : `You chose ${CHOICES[choice].label}. The tells point to ${CHOICES[email.correct].label}.`}
        </div>
      </div>
      <div className="coach-body">
        <div className="coach-section">
          <div className="coach-section-title">About your choice</div>
          <p>{verdict}</p>
        </div>
        <div className="coach-section">
          <div className="coach-section-title">Tells in this message</div>
          <div className="coach-indicators">
            {teach.indicators.map((ind, i) => (
              <div key={i} className={`coach-ind ${ind.kind}`}>
                <span className="coach-ind-icon">
                  {ind.kind === "ok" ? "✓" : ind.kind === "neutral" ? "·" : "!"}
                </span>
                <span>{ind.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="coach-section">
          <div className="coach-section-title">The message in short</div>
          <p>{teach.summary}</p>
        </div>
      </div>
      <div className="coach-foot">
        <button className="next" onClick={onNext}>
          {allDone ? "See results" : "Next message →"}
        </button>
        <button className="ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
