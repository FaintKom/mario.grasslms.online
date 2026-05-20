const { useState, useEffect, useRef, useMemo, Fragment } = React;

/* ─────────────────────────────────────────────────────
   Phish-or-Pass — Outlook-immersive simulation
   Day-1 inbox triage with one trick-positive.
   ───────────────────────────────────────────────────── */

const EMAILS = [
  {
    id: "m-helpdesk",
    avatarColor: "#605E5C",
    avatarText: "IT",
    senderShort: "IT Helpdesk",
    sender: { display: "IT Helpdesk", real: "helpdesk@compan-y-it.com", spoof: true, verification: "Failed authentication" },
    subject: "Action required: your password expires today",
    preview: "Our records show your corporate password expires today at 17:00…",
    time: "9:14 AM",
    day: "Today",
    banner: { kind: "danger", title: "Defender for Office 365 marked this message as a potential phishing attempt.", detail: "Sender domain compan-y-it.com fails authentication. Links have been rewritten with Safe Links protection.", action: "Show details" },
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
      title: "Credential-harvest phish — textbook.",
      summary:
        "Display name says IT Helpdesk, but the real sender is compan-y-it.com — a look-alike of the company domain. The reset link rewrites to the same look-alike. Three pressure phrases are stacked in 4 lines.",
      indicators: [
        { kind: "bad", text: "Display name vs sender: \"IT Helpdesk\" claims internal, real domain is external look-alike (compan-y-it.com)." },
        { kind: "bad", text: "Domain authentication failed (Defender banner). SPF/DKIM did not pass." },
        { kind: "bad", text: "Link text says company.com but resolves to compan-y-it.com — classic redirect." },
        { kind: "bad", text: "Urgency stacking: \"expires today\", \"keep your account active\", \"failure to act\"." },
      ],
      verdictIfRight: "Reporting this directly is exactly right — the indicators are conclusive. The Junk-only option also catches it but starts a longer triage clock for the SOC team.",
      verdictIfWrong: {
        safe: "Marking this safe leaves a credential-harvest URL in production inboxes. This is the easy one — if it slipped past, the next won't be obvious.",
        junk: "Junk-only is too soft for this signal stack. Authentication-failed + look-alike domain + pressure stacking warrants the phishing report, which routes to the SOC fast-lane.",
      },
    },
  },
  {
    id: "m-people-ops",
    avatarColor: "#C239B3",
    avatarText: "SC",
    senderShort: "Sarah Chen",
    sender: { display: "Sarah Chen", real: "sarah.chen@company.com", spoof: false, match: true, verification: "Verified internal sender" },
    subject: "Welcome to the team — your week-1 checklist",
    preview: "So glad you're with us. I've shared your week-1 checklist below — calendar invites…",
    time: "8:46 AM",
    day: "Today",
    banner: null,
    body: () => (
      <>
        <p className="salute">Hi, and welcome to the team!</p>
        <p>
          So glad you're with us. I've shared your <b>week-1 checklist</b> below — calendar
          invites for your 1:1 with your manager and the Friday team lunch are already in
          your inbox.
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
      title: "Routine onboarding — looks exactly like what it is.",
      summary:
        "Display name and real sender domain match. Internal sender is verified. No urgency, no payment ask, no surprise links. The mention of an inbound DocuSign envelope is the context you'll want for the fourth message.",
      indicators: [
        { kind: "ok", text: "Display name and real sender domain match (sarah.chen@company.com)." },
        { kind: "ok", text: "Internal verified sender (Defender authentication passed)." },
        { kind: "neutral", text: "No urgency, no payment ask, no out-of-band channel jumping." },
        { kind: "neutral", text: "Mentions a DocuSign envelope coming in the next hour — note this for later." },
      ],
      verdictIfRight: "Right call. Not every new email needs a Defender escalation — clean signals get the clean disposition.",
      verdictIfWrong: {
        junk: "Reporting a verified internal sender as Junk is exactly the noise the SOC training tries to dial down. Junk-rate inflation buries real signal.",
        phishing: "Reporting your People-Ops contact as phishing is the over-rotation new hires often make after generic awareness training. Calibrate.",
      },
    },
  },
  {
    id: "m-ceo-bec",
    avatarColor: "#0078D4",
    avatarText: "SA",
    senderShort: "Sundar Aravind",
    sender: { display: "Sundar Aravind", real: "ceo.aravind@gmail.com", spoof: true, verification: "External sender · personal mailbox" },
    subject: "Quick favour — are you at your desk?",
    preview: "Are you at your desk? I need a quick favour and I'm stuck in back-to-back meetings…",
    time: "8:22 AM",
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
          Please reply from your <b>phone</b> (not email) so we can move fast. I'll send
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
      title: "Business Email Compromise — CEO impersonation pattern.",
      summary:
        "Display says CEO but the real sender is a personal Gmail. The opener stacks three pressure-isolation moves: \"quick favour\", \"don't loop anyone in\", \"reply from your phone\". The classic follow-up is a gift-card or wire request.",
      indicators: [
        { kind: "bad", text: "Display \"Sundar Aravind\" resembles internal exec; real sender is ceo.aravind@gmail.com." },
        { kind: "bad", text: "External sender flagged by Defender. No prior thread with this address." },
        { kind: "bad", text: "Urgency + channel switch (\"reply from your phone, not email\")." },
        { kind: "bad", text: "Isolation (\"don't loop anyone in\") — keeps the target from a sanity-check." },
      ],
      verdictIfRight: "Right call. BEC openers like this rarely contain a payload yet — the trick is catching the opener so you never see the wire request.",
      verdictIfWrong: {
        safe: "Marking safe is the failure mode this whole cohort exists to fix. BEC successfully delivered is six-figure money on average.",
        junk: "Junk-only sends this to a slower SOC queue. The combined indicators warrant the phishing report and the executive-team alert that comes with it.",
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
    sender: { display: "DocuSign via Sarah Chen", real: "dse_NA8@docusign.net", spoof: false, match: true, verification: "Verified DocuSign sender" },
    subject: "Sarah Chen sent you a document to sign: Employment Agreement",
    preview: "Sarah Chen has sent you a document to sign. Employment Agreement · 7 pages…",
    time: "7:58 AM",
    day: "Today",
    banner: { kind: "info", title: "First time you've received mail from this DocuSign envelope.", detail: "DocuSign is a verified sender. The link below has been protected by Safe Links and resolves to docusign.net.", action: "Learn more" },
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
            data-real="docusign.net/sign/4f8e21c0-NA8-c734-91ad"
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
      title: "The trick-positive. Looks transactional, isn't a phish.",
      summary:
        "Real sender is dse_NA8@docusign.net (DocuSign's actual mail domain). The link resolves to docusign.net. Sarah told you in the previous email this envelope was coming. Three independent confirmations.",
      indicators: [
        { kind: "ok", text: "Sender domain is docusign.net — DocuSign's real envelope-sender." },
        { kind: "ok", text: "Authentication passed. Defender marked sender as verified." },
        { kind: "ok", text: "Link resolves to na8.docusign.net (the real DocuSign region for North-America EU envelopes)." },
        { kind: "ok", text: "Context match: the People-Ops email from Sarah explicitly mentioned this envelope was on its way." },
      ],
      verdictIfRight: "Exactly the call the cohort usually misses. Awareness training over-trains for \"report anything transactional\" — the discipline you just showed is what good triage looks like.",
      verdictIfWrong: {
        junk: "Most cohorts mark legit DocuSign as Junk because it \"looks transactional\". Over-reporting buries real signals under noise — the SOC stops trusting alerts from your team.",
        phishing: "Reporting a verified DocuSign envelope that you were told to expect is exactly the over-rotation we're calibrating away from. This is the part awareness training skips.",
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
  safe:      { id: "safe",     label: "Looks fine",        ribbon: "It's not junk",       toast: "Kept in Inbox. No further action.",                                            toastKind: "info"    },
  junk:      { id: "junk",     label: "Report as Junk",    ribbon: "Report > Junk",       toast: "Reported to your IT team. Message moved to Junk Email.",                       toastKind: "info"    },
  phishing:  { id: "phishing", label: "Report as Phishing", ribbon: "Report > Phishing",   toast: "Reported to Security. Message moved to Deleted Items and a copy sent to SOC.", toastKind: "success" },
};

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

  const email = useMemo(() => EMAILS.find((e) => e.id === selectedId), [selectedId]);
  const decided = !!decisions[email?.id];

  const done = Object.keys(decisions).length;
  const correct = Object.values(decisions).filter((d) => d.correct).length;
  const progressPct = Math.round((done / EMAILS.length) * 100);

  const urlHover = useMemo(() => ({
    set: (info) => setUrlInfo(info),
    clear: () => setUrlInfo(null),
  }), []);

  const decide = (choiceId) => {
    if (!email || decisions[email.id]) return;
    const isCorrect = choiceId === email.correct;
    const choice = CHOICES[choiceId];
    setDecisions((d) => ({ ...d, [email.id]: { choice: choiceId, correct: isCorrect } }));
    setReportOpen(false);
    // Toast
    setToast({ msg: choice.toast, kind: choice.toastKind });
    setTimeout(() => setToast(null), 2200);
    // Coach panel after a beat
    setTimeout(() => {
      setCoach({ email, choice: choiceId, correct: isCorrect });
    }, 600);
  };

  const nextEmail = () => {
    setCoach(null);
    setTimeout(() => {
      // pick next undecided email in order
      const order = EMAILS.map((e) => e.id);
      const startIdx = order.indexOf(email.id);
      let nextId = null;
      for (let i = 1; i <= order.length; i++) {
        const candidate = order[(startIdx + i) % order.length];
        if (!decisions[candidate] && candidate !== email.id) { nextId = candidate; break; }
      }
      // re-check now-completed state including current decision
      const allDone = Object.keys({ ...decisions, [email.id]: true }).length >= EMAILS.length;
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
          <button className="rb-btn" disabled={!email || decided}>
            <span className="rb-icon">↩</span>Reply
          </button>
          <button className="rb-btn" disabled={!email || decided}>
            <span className="rb-icon">↪</span>Forward
          </button>
          <button className="rb-btn" disabled={!email}>
            <span className="rb-icon">⌫</span>Delete
          </button>
          <button className="rb-btn" disabled={!email}>
            <span className="rb-icon">▤</span>Archive
          </button>
        </div>

        {/* Triage actions — the real decisions */}
        <div className="rb-group" style={{ background: decided ? "transparent" : "var(--rail)", borderRadius: 4 }}>
          <button
            className="rb-btn"
            onClick={() => decide("safe")}
            disabled={!email || decided}
            title="Keep in Inbox — no further action"
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
          <span style={{ color: "var(--ink-3)" }}>CASE A ·</span>
          <span style={{ fontWeight: 600 }}>Phish-or-Pass simulation</span>
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
            <div className="list-sub">{EMAILS.length} items · sorted by date</div>
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
                <div className="list-row-flag" />
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
                    <span className={`from-pill ${email.sender.spoof ? "danger" : email.sender.match ? "ok" : "warn"}`}>
                      {email.sender.verification}
                    </span>
                  </div>
                  <div className={"from-email " + (email.sender.spoof ? "spoof" : "")}>
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
            onClose={() => setCoach(null)}
            allDone={done >= EMAILS.length}
          />

          {/* Results overlay */}
          <div className={`results ${showResults ? "show" : ""}`}>
            <div className="results-card">
              <div className="results-head">
                <div className="results-eyebrow">
                  <span className="shield">D</span>
                  Defender for Office 365 · Attack Simulation Training
                </div>
                <div className="results-title">
                  {correct === EMAILS.length ? "Clean triage. Pass-bar cleared." :
                   correct >= EMAILS.length - 1 ? "Almost there. Pass-bar cleared." :
                   correct >= EMAILS.length / 2 ? "Worth a re-take." :
                   "Re-take recommended."}
                </div>
                <div className="results-sub">
                  Simulated phish-cohort #14 · 4 messages including one trick-positive. The
                  pass-bar is 3 / 4 correct triages — including catching the legitimate
                  message that looks suspicious.
                </div>
              </div>
              <div className="results-score-row">
                <div className="res-score"><b>{correct}</b>/{EMAILS.length}</div>
                <div className="res-meta">
                  <div className="res-meta-row">
                    <span style={{ minWidth: 110, color: "var(--ink-3)" }}>Pass bar</span>
                    <b>3 / 4 correct</b>
                  </div>
                  <div className="res-meta-row">
                    <span style={{ minWidth: 110, color: "var(--ink-3)" }}>L3 target</span>
                    <b>click-rate 18% → ≤ 5%</b>
                  </div>
                  <div className="res-meta-row">
                    <span style={{ minWidth: 110, color: "var(--ink-3)" }}>L4 target</span>
                    <b>incidents 2/q → ≤ 1/yr</b>
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
                            <span style={{ marginLeft: 8, fontSize: 11, color: "var(--teach)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                              · Trick positive
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
                <button className="res-btn" onClick={restart}>Run again</button>
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
        <div className="coach-eyebrow">
          <span className="shield">D</span>
          Attack Simulation Training · Coach
        </div>
        <div className="coach-title">{teach.title}</div>
        <div className="coach-tag">
          <span className="coach-tag-dot" />
          {correct ? "Triage correct" : "Re-think the call"}
        </div>
      </div>
      <div className="coach-body">
        <div className="coach-section">
          <div className="coach-section-title">Why this matters</div>
          <p>{verdict}</p>
        </div>
        <div className="coach-section">
          <div className="coach-section-title">Indicators in this message</div>
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
          <div className="coach-section-title">Plain-language summary</div>
          <p>{teach.summary}</p>
        </div>
      </div>
      <div className="coach-foot">
        <button className="next" onClick={onNext}>
          {allDone ? "See completion" : "Next message →"}
        </button>
        <button className="ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
