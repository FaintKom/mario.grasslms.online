const {useState, useRef, useEffect} = React;

/* ── Data ───────────────────────────────────────── */
const MAILS = [
  { id:"m1", time:"08:47", color:"#5B7FA6", initial:"C", clean:true,
    fromName:"Comms Team", fromAddr:"newsletter@yourcompany.com",
    fromNameHTML:`<span class="spot" data-id="d3">Comms Team</span>`,
    fromAddrHTML:`<span class="spot" data-id="d3">newsletter@yourcompany.com</span>`,
    subj:"March town hall — recording and slides",
    subjHTML:`<span class="spot" data-id="d4">March town hall — recording and slides</span>`,
    prev:"Hi all, the recording from Tuesday's town hall…",
    html:`<p>Hi all,</p>
      <p>The recording from Tuesday's town hall is now on <span class="spot" data-id="d1"><span class="mlink" data-url="https://intranet.yourcompany.com/townhall/march">the intranet</span></span>. Slides attached for anyone who wants the short version.</p>
      <p><span class="spot" data-id="d2"><span class="attach"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>townhall-march-slides.pdf · 2.1 MB</span></span></p>
      <p>— Comms</p>` },
  { id:"m2", time:"08:58", color:"#8A6FB0", initial:"IT",
    fromName:"IT Support", fromAddr:"it-helpdesk@yourcompany-security.net",
    fromNameHTML:`<span class="spot" data-id="c1">IT Support</span>`,
    fromAddrHTML:`<span class="spot" data-id="c1">it-helpdesk@yourcompany-security.net</span>`,
    subj:"ACTION REQUIRED: password expires in 2 hours",
    subjHTML:`<span class="spot" data-id="c2">ACTION REQUIRED: password expires in 2 hours</span>`,
    prev:"Your network password expires today at 17:00…",
    html:`<p>Dear user,</p>
      <p><span class="spot" data-id="c3">Your network password expires today at 17:00. To avoid losing access to email and shared drives, you must act within 2 hours</span>.</p>
      <p><span class="spot" data-id="c4">Confirm your current password</span> using the secure portal below:</p>
      <p><span class="spot" data-id="c5"><span class="mlink" data-url="http://yourcompany-security.net/portal/verify">Verify now — IT Security Portal</span></span></p>
      <p><span class="spot" data-id="d5">IT Support Desk</span></p>` },
  { id:"m3", time:"09:01", color:"#B07A5B", initial:"D",
    fromName:"Daniel Reeve (CEO)", fromAddr:"ceo.office.mail@gmail.com",
    fromNameHTML:`<span class="spot" data-id="c6">Daniel Reeve (CEO)</span>`,
    fromAddrHTML:`<span class="spot" data-id="c6">ceo.office.mail@gmail.com</span>`,
    subj:"Quick favour — are you at your desk?",
    prev:"I'm heading into a board meeting and can't talk…",
    html:`<p>Hi,</p>
      <p><span class="spot" data-id="c7">I'm heading into a board meeting and can't talk</span>. <span class="spot" data-id="c8">I need you to buy 4 × €100 gift cards for a client thank-you. Send me the codes here</span>.</p>
      <p><span class="spot" data-id="c9">Keep it between us for now</span> — I'll explain later.</p>
      <p><span class="spot" data-id="d6">Sent from my iPhone</span></p>` },
];

const CUES = {
  c1:{label:"The address, <b>yourcompany-security.net</b>, only resembles your company's domain. The name \"IT Support\" above it proves nothing.", ref:"27002 §8.7"},
  c2:{label:"The subject uses capital letters and a two-hour deadline you had never heard of.", ref:"27002 §8.7"},
  c3:{label:"The body repeats the deadline, and a deadline in a message you weren't expecting is the first tell.", ref:"27002 §8.7"},
  c4:{label:"It asks you to confirm your current password. IT has admin access and never needs it.", ref:"27002 §5.17"},
  c5:{label:"Hovering over the link shows <b>http://yourcompany-security.net</b>, which is not your company's real sign-in page.", ref:"27002 §8.7"},
  c6:{label:"The CEO's name sits on a <b>personal Gmail address</b>. Anyone can type a display name, so judge the sender by the address.", ref:"27002 §8.7"},
  c7:{label:"Saying he is in a meeting and can't talk stops you from checking with him.", ref:"27002 §6.3"},
  c8:{label:"He asks you to buy gift cards and send him the codes. Gift-card codes work like cash that nobody can trace.", ref:"27002 §8.7"},
  c9:{label:"\"Keep it between us\" is there to cut you off from anyone who might check.", ref:"27002 §6.3"},
};
const DECOYS = {
  d1:"This link goes to the intranet on your company's real domain, for an event you already knew about.",
  d2:"These are the slides you were expecting, from a known internal sender.",
  d3:"This is your company's own domain and the team that runs the town hall.",
  d4:"The subject is about an event you already knew about, with no deadline and no request.",
  d5:"Anyone can type a sign-off, so it proves nothing either way.",
  d6:"Real colleagues send this line from their phones every day, so it says nothing about who wrote the message.",
};
const TOTAL = Object.keys(CUES).length;
// One hotspot can span several elements (sender name + address), so dedupe.
const spotIds = (row) => [...new Set((row.html + (row.fromNameHTML||"") + (row.fromAddrHTML||"") + (row.subjHTML||"")).match(/data-id="([^"]+)"/g)?.map(s => s.slice(9,-1)) || [])];

/* ── App ────────────────────────────────────────── */
function InboxSim() {
  const [opened, setOpened] = useState(() => new Set());
  const [flags, setFlags] = useState(() => new Set());
  const [current, setCurrent] = useState(null);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [last, setLast] = useState(null);   // flags at the last Check, so the debrief survives a retry
  const readerRef = useRef(null);
  // The address in the status bar, kept in a ref as well so a pointerdown can
  // tell synchronously whether this link was already showing before the tap.
  const shownRef = useRef("");
  const show = (url) => { shownRef.current = url; setStatus(url); };

  // Tell the SCORM shell the exercise is complete only on a clean sweep —
  // every tell found, zero false alarms. False alarms drown the signal, so
  // they must not unlock the gate. Same bar as the "Clean sweep" verdict below.
  useEffect(() => {
    if (!checked) return;
    const nHits = [...flags].filter(id => CUES[id]).length;
    const nFps = [...flags].filter(id => !CUES[id]).length;
    if (nHits === TOTAL && nFps === 0) {
      try { window.parent && window.parent.postMessage({ type: 'u1-progress', id: 'practice' }, '*'); } catch (e) {}
    }
  }, [checked]);

  const openMail = (id) => {
    setCurrent(id);
    setOpened(prev => { const n = new Set(prev); n.add(id); return n; });
    show("");
  };
  const check = () => { setChecked(true); setLast(new Set(flags)); };
  // Try again keeps the correct flags and drops the false alarms, so the
  // second pass is about the clues the debrief named, not starting over.
  const retry = () => {
    setFlags(prev => new Set([...prev].filter(id => CUES[id])));
    setChecked(false);
    show("");
  };
  const toggleFlag = (sid) => {
    setFlags(prev => { const n = new Set(prev); n.has(sid) ? n.delete(sid) : n.add(sid); return n; });
  };

  const hits = [...flags].filter(id => CUES[id]);
  const fps = [...flags].filter(id => !CUES[id]);
  const missed = Object.keys(CUES).filter(id => !flags.has(id));

  const gateReady = opened.size === MAILS.length && flags.size > 0;
  let gateMsg;
  if (!checked) {
    if (opened.size < MAILS.length) gateMsg = <span>Open all three messages first. You've opened {opened.size} of 3.</span>;
    else if (flags.size === 0) gateMsg = <span>Nothing flagged yet. Click the parts of a message that look wrong.</span>;
    else if (last) gateMsg = <span>Your correct flags are still there. Find the ones you missed and press Check.</span>;
    else gateMsg = <span>Press Check when you're done. You can still remove a flag by clicking it again.</span>;
  }

  let vClass = "", vIcon = "", vNote = "";
  if (checked) {
    const fpText = fps.length ? ` and flagged ${fps.length} normal part${fps.length > 1 ? "s" : ""} by mistake` : "";
    if (hits.length === TOTAL && fps.length === 0) {
      vClass = "ok"; vIcon = "✓";
      vNote = "All nine and no false alarms. At work any one of them would be reason to stop and check the message.";
    } else if (hits.length >= 6 && fps.length <= 1) {
      vClass = "mid"; vIcon = "!";
      vNote = `You found ${hits.length} of ${TOTAL}${fpText}.` + (missed.length
        ? " The dashed outlines show where the rest are."
        : " The list below says why that part was normal.");
    } else {
      vClass = "bad"; vIcon = "✕";
      vNote = `You found ${hits.length} of ${TOTAL}${fpText}.` + (missed.length
        ? " The dashed outlines show where the others were." : "") +
        " Read the list below, then try again. Your correct flags stay.";
    }
  }

  const spotClass = (sid) => {
    const isCue = !!CUES[sid], flagged = flags.has(sid);
    if (!checked) return "spot" + (flagged ? " flag" : "");
    if (isCue && flagged) return "spot hit";
    if (!isCue && flagged) return "spot fp";
    if (isCue && !flagged) return "spot miss";
    return "spot";
  };

  // wire spot clicks + link hover after each render of the reading pane
  React.useEffect(() => {
    const root = readerRef.current;
    if (!root) return;
    const seenIds = new Set();
    root.querySelectorAll(".spot").forEach(sp => {
      sp.className = spotClass(sp.dataset.id);
      // A tell that spans two elements (sender name + address) is one tab stop.
      const firstOfId = !seenIds.has(sp.dataset.id); seenIds.add(sp.dataset.id);
      // Keyboard and touch: every hotspot is a toggle button; a link inside
      // one shows its real address on focus or tap, not only on hover.
      const link = sp.querySelector(".mlink");
      sp.tabIndex = checked || !firstOfId ? -1 : 0;
      sp.setAttribute("role", "button");
      sp.setAttribute("aria-pressed", String(flags.has(sp.dataset.id)));
      // A link hotspot shows its real address before it can be flagged. With a
      // mouse, hover already showed it, so the click flags. On a phone the
      // first tap only reveals the address and the second tap flags, so
      // checking a safe link is never counted as a false alarm.
      // Focus also shows the address, and a tap focuses before it clicks, so
      // whether the address was already showing is read at pointerdown.
      sp.onpointerdown = link ? () => { sp.dataset.peeked = shownRef.current === link.dataset.url ? "1" : ""; } : null;
      sp.onclick = checked ? null : (e) => {
        e.stopPropagation();
        if (link && !sp.dataset.peeked) { show(link.dataset.url); sp.dataset.peeked = "1"; return; }
        toggleFlag(sp.dataset.id);
      };
      sp.onkeydown = checked ? null : (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFlag(sp.dataset.id); } };
      sp.onfocus = link ? () => show(link.dataset.url) : null;
      sp.onblur = link ? () => show("") : null;
    });
    root.querySelectorAll(".mlink").forEach(a => {
      // Pointer events, mouse only: a tap must not clear the address it just showed.
      a.onpointerenter = (e) => { if (e.pointerType === "mouse") show(a.dataset.url); };
      a.onpointerleave = (e) => { if (e.pointerType === "mouse") show(""); };
    });
  });

  const m = MAILS.find(x => x.id === current);
  const debrief = checked ? flags : last;   // after a retry, the last check stays readable
  const unreadCount = MAILS.length - opened.size;

  return (
    <div>
      <div className="top">
        <h1>Your inbox, Monday 09:02</h1>
        <span className="flagcount">Flagged: {flags.size}</span>
      </div>
      <div className="qtext">Find and flag the tells in these three messages</div>
      <div className="qsub">Open all <b>three</b> messages and click every part that looks wrong: the sender, the subject, a request or a link. Nine tells are hidden in them. Hover over a link to see where it goes (on a phone, tap once to see the address and again to flag it). Flagging a normal part counts as a false alarm.</div>

      <div className="mailapp">
        <div className="mtitle"><span className="appname">Inbox ({unreadCount})</span></div>
        <div className="mbody">
          <div className="mlist">
            <div className="lhead">Inbox</div>
            {MAILS.map(row => {
              const n = spotIds(row).filter(id => flags.has(id)).length;
              return (
                <div key={row.id} className={"mrow" + (opened.has(row.id) ? " read" : "") + (current === row.id ? " active" : "")}
                     role="button" tabIndex={0} aria-current={current === row.id ? "true" : undefined}
                     aria-label={`${row.fromName}: ${row.subj}${opened.has(row.id) ? "" : " (unread)"}`}
                     onClick={() => openMail(row.id)}
                     onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openMail(row.id); } }}>
                  <div className="rfrom"><span className="unread"/>{row.fromName}</div>
                  <div className="rsub">{row.subj}</div>
                  <div className="rprev">{row.prev}</div>
                  <div className="rmeta"><span className="rtime">{row.time}</span>{n ? <span className="rflags">⚑ {n}</span> : <span/>}</div>
                </div>
              );
            })}
          </div>
          <div className="mread">
            {!m ? <div className="mempty">Choose a message from the list to read it</div> : (
              <div ref={readerRef}>
                <div className="mhead">
                  <div className="msubj" dangerouslySetInnerHTML={{__html: m.subjHTML || m.subj}}/>
                  <div className="mfrom">
                    <div className="avatar" style={{background: m.color}}>{m.initial}</div>
                    <div className="mmeta">
                      <div><span className="name" dangerouslySetInnerHTML={{__html: m.fromNameHTML || m.fromName}}/> <span className="addr" dangerouslySetInnerHTML={{__html: "&lt;" + (m.fromAddrHTML || m.fromAddr) + "&gt;"}}/></div>
                      <div className="to">To: you@yourcompany.com</div>
                    </div>
                    <div className="mtime">Mon {m.time}</div>
                  </div>
                  <div className="ghostrow" aria-hidden="true">
                    <span className="ghostbtn">Reply</span>
                    <span className="ghostbtn">Forward</span>
                  </div>
                </div>
                <div className="mcontent" dangerouslySetInnerHTML={{__html: m.html}}/>
              </div>
            )}
            <div className="statusbar" aria-live="polite">{status ? <span>→ <span className="url">{status}</span></span> : " "}</div>
          </div>
        </div>
      </div>

      <div className={"foot " + vClass}>
        {checked && <div className="fico">{vIcon}</div>}
        <div className="fmsg">{checked ? <span>{vNote}</span> : gateMsg}</div>
        <button className="cbtn" disabled={!checked && !gateReady}
          onClick={checked ? retry : check}>
          {checked ? "Try again" : "Check"}
        </button>
      </div>

      {debrief && (
        <div className="debrief">
          <h3>{checked ? "What each tell was" : "The tells from your last check"}</h3>
          {Object.keys(CUES).map(id => (
            <div className="dbrow" key={id}>
              <span className={"dbadge " + (debrief.has(id) ? "g" : "m")}>{debrief.has(id) ? "✓" : "•"}</span>
              <span><span dangerouslySetInnerHTML={{__html: CUES[id].label}}/>{debrief.has(id) ? "" : " You missed this one."} <span className="dref">ISO {CUES[id].ref}</span></span>
            </div>
          ))}
          {[...debrief].filter(id => !CUES[id]).map(id => (
            <div className="dbrow" key={id}>
              <span className="dbadge r">✕</span>
              <span>This part was normal. {DECOYS[id]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<InboxSim/>);
