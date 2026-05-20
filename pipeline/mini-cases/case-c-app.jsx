const { useState, useEffect, useMemo, useRef } = React;

/* ─────────────────────────────────────────────────────
   Route-the-PO · Procurefy procurement-system simulation
   3 POs · routing rules over UI · keystone moment
   ───────────────────────────────────────────────────── */

const RULES = [
  {
    id: "r1",
    code: "01",
    text: <>Is the vendor <b>onboarded</b>? <code>vendor.onboarded === true</code></>,
    then: <>If <b>no</b> → <b>Legal & Compliance</b> (vendor-onboarding pack must clear first).</>,
    field: "Vendor status",
    evaluate: (po) => (po.vendor.onboarded ? "yes" : "no"),
    onNo: { queue: "legal", note: "Vendor not yet onboarded — Legal owns the onboarding pack." },
  },
  {
    id: "r2",
    code: "02",
    text: <>Is the vendor's jurisdiction <b>non-domestic</b>? <code>vendor.jurisdiction !== "DE"</code></>,
    then: <>If <b>yes</b> → <b>Legal & Compliance</b> (cross-border terms, data residency, withholding).</>,
    field: "Jurisdiction",
    evaluate: (po) => (po.vendor.jurisdiction !== "DE" ? "yes" : "no"),
    onYes: { queue: "legal", note: "Foreign jurisdiction — Legal must clear cross-border terms." },
  },
  {
    id: "r3",
    code: "03",
    text: <>Is <b>total &gt; €10,000</b> OR category is <b>CapEx</b>?</>,
    then: <>If <b>yes</b> → <b>Finance review</b> (funding-line check before commitment).</>,
    field: "Amount × category",
    evaluate: (po) => (po.amount > 10000 || po.category === "CapEx" ? "yes" : "no"),
    onYes: { queue: "finance", note: "Over threshold or CapEx — Finance owns funding-line check." },
  },
  {
    id: "r4",
    code: "04",
    text: <>Otherwise → <b>Auto-approve queue</b>.</>,
    then: <>Default lane for low-risk, on-policy spend.</>,
    field: "Default route",
    evaluate: () => "yes",
    onYes: { queue: "auto", note: "All gates cleared." },
  },
];

const POS = [
  {
    id: "PO-2026-0341",
    name: "Acme Industrial GmbH",
    line: "Rack-mount server replacement · Quote QT-9088",
    amount: 12480,
    category: "CapEx",
    department: "Platform Engineering",
    departmentCode: "ENG-PLT-12",
    requestedBy: "Anouk Mehta",
    requestedByRole: "Senior SRE",
    requestedDate: "Mar 14, 2026",
    needBy: "Apr 30, 2026",
    payment: "Net-45",
    currency: "EUR",
    items: [
      { desc: "Rack-mount server · 2U dual-Xeon", sub: "Acme part #AC-XS-2240, 3-year on-site warranty", account: "ENG-CAPEX-450", qty: 6, unit: 1920, total: 11520 },
      { desc: "Installation labour", sub: "Per-rack install + cable management", account: "ENG-CAPEX-450", qty: 6, unit: 120, total: 720 },
      { desc: "Shipping & handling", sub: "Frankfurt warehouse → Berlin DC1", account: "ENG-OPEX-110", qty: 1, unit: 240, total: 240 },
    ],
    vendor: { name: "Acme Industrial GmbH", onboarded: true, tier: 2, jurisdiction: "DE", vendorId: "VEN-00482", since: "Aug 2023", contract: "MSA-Acme-2024", paymentTerms: "Net-45", taxId: "DE 8821-4477-90", logo: "AI" },
    correct: "finance",
    teach: "Two independent gates fire: total (€12,480 > €10K) AND category (CapEx). Either alone routes to Finance — both stacked makes it unambiguous. The trap: vendor looks fine and amount is \"ordinary\" — but the gates aren't about vendor goodness, they're about funding-line accountability.",
    flow: [
      { rule: "r1", outcome: "yes", note: "Onboarded · Tier-2" },
      { rule: "r2", outcome: "no",  note: "Jurisdiction DE — domestic" },
      { rule: "r3", outcome: "yes", note: "€12,480 > €10K and CapEx" },
    ],
    activity: [
      { who: "Anouk Mehta", what: <>created the PO from quote <b>QT-9088</b></>, when: "Mar 14, 10:22", kind: "default" },
      { who: "System", what: <>budget pre-check <b>passed</b> against <b>ENG-CAPEX-450</b> (€48,200 remaining)</>, when: "Mar 14, 10:23", kind: "ok" },
      { who: "System", what: <>flagged: <b>amount &gt; €10K threshold</b> and <b>CapEx</b> category</>, when: "Mar 14, 10:23", kind: "flag" },
      { who: "System", what: <>awaiting <b>routing decision</b></>, when: "Mar 14, 10:23", kind: "default" },
    ],
  },
  {
    id: "PO-2026-0342",
    name: "Globex Cloud Services",
    line: "Log analytics SaaS · 12-month annual",
    amount: 2400,
    category: "OpEx",
    department: "Security Operations",
    departmentCode: "SEC-OPS-04",
    requestedBy: "Jules Tanaka",
    requestedByRole: "SOC Lead",
    requestedDate: "Mar 14, 2026",
    needBy: "Apr 1, 2026",
    payment: "Annual, prepaid",
    currency: "EUR",
    items: [
      { desc: "Globex Cloud — Pro tier · 12 months", sub: "Up to 250 GB / day log retention, single region", account: "SEC-OPEX-220", qty: 1, unit: 2400, total: 2400 },
    ],
    vendor: { name: "Globex Cloud Services Inc.", onboarded: false, tier: null, jurisdiction: "US", vendorId: "VEN-NEW", since: "—", contract: "Pending Legal", paymentTerms: "Annual prepaid (no NET terms)", taxId: "US-EIN 88-3300114", logo: "GX" },
    correct: "legal",
    teach: "Small recurring SaaS — easy to wave through. And that's the trap. The vendor isn't on the approved list yet, which alone routes to Legal. The US jurisdiction would have caught it too. Two independent gates fire before amount or category even matter.",
    flow: [
      { rule: "r1", outcome: "no", note: "Vendor not onboarded" },
    ],
    activity: [
      { who: "Jules Tanaka", what: <>requested vendor onboarding for <b>Globex Cloud Services</b></>, when: "Mar 12, 14:01", kind: "default" },
      { who: "Jules Tanaka", what: <>submitted PO referencing pending vendor record</>, when: "Mar 14, 09:48", kind: "default" },
      { who: "System", what: <>flagged: <b>vendor not yet onboarded</b> (VEN-NEW)</>, when: "Mar 14, 09:48", kind: "flag" },
      { who: "System", what: <>flagged: <b>foreign jurisdiction</b> (US)</>, when: "Mar 14, 09:48", kind: "flag" },
      { who: "System", what: <>awaiting <b>routing decision</b></>, when: "Mar 14, 09:48", kind: "default" },
    ],
  },
  {
    id: "PO-2026-0343",
    name: "Office Depot Deutschland",
    line: "Q2 office supplies · standard catalogue",
    amount: 847,
    category: "OpEx",
    department: "Office Management",
    departmentCode: "FAC-OFF-01",
    requestedBy: "Karim Voss",
    requestedByRole: "Office Manager",
    requestedDate: "Mar 14, 2026",
    needBy: "Apr 7, 2026",
    payment: "Net-30",
    currency: "EUR",
    items: [
      { desc: "Copier paper · 80 g/m² · A4", sub: "20 reams · standard catalogue", account: "FAC-OPEX-100", qty: 20, unit: 5.20, total: 104 },
      { desc: "Multi-purpose pens · ballpoint", sub: "12 boxes of 50", account: "FAC-OPEX-100", qty: 12, unit: 14.50, total: 174 },
      { desc: "Whiteboard markers · assorted", sub: "Set of 24", account: "FAC-OPEX-100", qty: 8, unit: 22.50, total: 180 },
      { desc: "Coffee · whole bean · single-origin", sub: "8 kg · break-room stock", account: "FAC-OPEX-110", qty: 8, unit: 28.60, total: 228.80 },
      { desc: "Cleaning supplies, sundry", sub: "Restock per facilities checklist", account: "FAC-OPEX-110", qty: 1, unit: 160.20, total: 160.20 },
    ],
    vendor: { name: "Office Depot Deutschland AG", onboarded: true, tier: 1, jurisdiction: "DE", vendorId: "VEN-00031", since: "Jan 2018", contract: "MSA-OD-2024", paymentTerms: "Net-30", taxId: "DE 4421-7790-11", logo: "OD" },
    correct: "auto",
    teach: "Routine catalogue spend, approved Tier-1 vendor, domestic, OpEx, well under threshold. The lesson is the opposite of the others: when no gate fires, trust the auto-approve lane. Over-routing routine spend to Finance is what clogs the queue and makes the real reviews late.",
    flow: [
      { rule: "r1", outcome: "yes", note: "Tier-1 approved" },
      { rule: "r2", outcome: "no",  note: "Domestic DE" },
      { rule: "r3", outcome: "no",  note: "€847 < €10K · OpEx" },
      { rule: "r4", outcome: "yes", note: "Default route" },
    ],
    activity: [
      { who: "Karim Voss", what: <>created the PO from standard catalogue order</>, when: "Mar 14, 11:02", kind: "default" },
      { who: "System", what: <>budget pre-check <b>passed</b> against <b>FAC-OPEX-100/110</b></>, when: "Mar 14, 11:02", kind: "ok" },
      { who: "System", what: <>vendor pre-flight <b>passed</b> (Tier-1, contract current)</>, when: "Mar 14, 11:02", kind: "ok" },
      { who: "System", what: <>awaiting <b>routing decision</b></>, when: "Mar 14, 11:02", kind: "default" },
    ],
  },
];

const QUEUES = [
  { id: "auto", kind: "auto", name: "Auto-approve queue", icon: "01", sub: "On-policy spend · approved vendor · under threshold", meta: ["Same-day", "No human touch"] },
  { id: "finance", kind: "finance", name: "Finance review queue", icon: "02", sub: "Over €10K or CapEx · funding-line check", meta: ["1–3 days", "Funding-line check"] },
  { id: "legal", kind: "legal", name: "Legal & Compliance review", icon: "03", sub: "New vendor or foreign jurisdiction · terms review", meta: ["3–10 days", "Terms / IP / data"] },
];

function fmtEUR(n) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function queueLabel(id) {
  const q = QUEUES.find((x) => x.id === id);
  return q ? q.name : id;
}

function App() {
  const [idx, setIdx] = useState(0);
  const [decisions, setDecisions] = useState({});  // poId → { queue, correct }
  const [picked, setPicked] = useState(null);       // for queue flash animation
  const [verdict, setVerdict] = useState(null);
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const po = POS[idx];

  /* The set of rules that fire for the current PO (stop after first match) */
  const evaluations = useMemo(() => {
    const arr = [];
    let matched = null;
    for (const rule of RULES) {
      const outcome = rule.evaluate(po);
      let stopHere = false;
      if (rule.onYes && outcome === "yes") stopHere = true;
      if (rule.onNo && outcome === "no") stopHere = true;
      arr.push({ rule, outcome });
      if (stopHere) { matched = rule.id; break; }
    }
    return { rows: arr, matchedId: matched };
  }, [idx]);

  const correctCount = Object.values(decisions).filter((d) => d.correct).length;
  const progressPct = (Object.keys(decisions).length / POS.length) * 100;

  /* Routing decision */
  const route = (queueId) => {
    if (decisions[po.id]) return;
    const isCorrect = queueId === po.correct;
    setDecisions((d) => ({ ...d, [po.id]: { queue: queueId, correct: isCorrect } }));
    setPicked({ queueId, correct: isCorrect });
    setTimeout(() => setPicked(null), 1500);
    setToast({
      msg: isCorrect
        ? `Routed to ${queueLabel(queueId)}.`
        : `Routed to ${queueLabel(queueId)} — re-routing on review.`,
      kind: isCorrect ? "success" : "info",
    });
    setTimeout(() => setToast(null), 2300);
    setTimeout(() => {
      setVerdict({ correct: isCorrect, queue: queueId, po });
      setDrawerOpen(true);  // open policy drawer to show why
    }, 500);
  };

  const advance = () => {
    setVerdict(null);
    setTimeout(() => {
      setDrawerOpen(false);
      if (idx + 1 >= POS.length) setShowResults(true);
      else setIdx(idx + 1);
    }, 280);
  };

  const restart = () => {
    setDecisions({});
    setIdx(0);
    setVerdict(null);
    setToast(null);
    setShowResults(false);
    setDrawerOpen(false);
  };

  /* Keyboard 1/2/3 → route */
  useEffect(() => {
    const onKey = (e) => {
      if (showResults) return;
      if (verdict) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          advance();
        }
        return;
      }
      if (e.key === "1") route("auto");
      else if (e.key === "2") route("finance");
      else if (e.key === "3") route("legal");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const lineTotal = po.items.reduce((a, i) => a + i.total, 0);
  const tax = +(lineTotal * 0.19).toFixed(2);

  return (
    <>
      {/* ───── Top app bar ───── */}
      <header className="appbar">
        <div className="ab-brand">
          <div className="ab-logo">Pf</div>
          <div className="ab-app-name">Procurefy <span>· Procurement</span></div>
        </div>
        <div className="ab-modules">
          <div className="ab-mod">Home</div>
          <div className="ab-mod">Sourcing</div>
          <div className="ab-mod">Contracts</div>
          <div className="ab-mod">Suppliers</div>
          <div className="ab-mod active">
            Orders <span className="ab-mod-count">{POS.length - Object.keys(decisions).length}</span>
          </div>
          <div className="ab-mod">Invoices</div>
          <div className="ab-mod">Reports</div>
        </div>
        <div className="ab-right">
          <div className="ab-search">
            <span style={{ fontSize: 12, opacity: 0.6 }}>🔍</span>
            <span>Search orders, suppliers…</span>
          </div>
          <a href="index.html" className="ab-icon-btn" title="Back to index" style={{ fontSize: 16 }}>←</a>
          <div className="ab-icon-btn" title="Notifications">
            🔔<span className="ab-notif-dot" />
          </div>
          <div className="ab-icon-btn" title="Help">?</div>
          <div className="ab-avatar">YN</div>
        </div>
      </header>

      {/* ───── Subbar ───── */}
      <div className="subbar">
        <div className="breadcrumb">
          <span>Orders</span>
          <span className="sep">/</span>
          <b>Pending routing</b>
          <span className="sep">/</span>
          <span>{po.id}</span>
        </div>
        <div className="sub-filters">
          <span className="filter-chip active">Pending <span className="ct">{POS.length - Object.keys(decisions).length}</span></span>
          <span className="filter-chip">Routed <span className="ct">{Object.keys(decisions).length}</span></span>
          <span className="filter-chip">All</span>
          <span style={{ marginLeft: 6 }} />
          <span className="filter-chip">Sort: Created ↓</span>
        </div>
      </div>

      {/* ───── Main grid ───── */}
      <div className="main">
        {/* ─── PO list ─── */}
        <aside className="list">
          <div className="list-head">
            <div className="list-title">Pending routing</div>
            <div className="list-meta">
              {POS.length - Object.keys(decisions).length} of {POS.length} orders · awaiting your decision
            </div>
          </div>
          <div className="list-col-head">
            <input type="checkbox" />
            <span>Order</span>
            <span>Amount</span>
          </div>
          <div className="list-rows">
            {POS.map((p, i) => {
              const d = decisions[p.id];
              const cls = [
                "list-row",
                i === idx && !showResults && "selected",
                d && "done",
              ].filter(Boolean).join(" ");
              return (
                <div
                  key={p.id}
                  className={cls}
                  onClick={() => { if (!d) setIdx(i); }}
                >
                  <div className="list-row-check">{d && "✓"}</div>
                  <div>
                    <div className="list-row-id">{p.id}</div>
                    <div className="list-row-vendor">{p.vendor.name}</div>
                    <div className="list-row-meta">
                      <span>{p.department}</span>
                      <span className="list-row-meta-pip" />
                      <span>{p.category}</span>
                    </div>
                  </div>
                  <div>
                    <div className="list-row-amount">€{fmtEUR(p.amount)}</div>
                    <div className="list-row-status">
                      <span className={`badge ${d ? (d.correct ? "approved" : "rejected") : "pending"}`}>
                        <span className="dot" />
                        {d ? (d.correct ? "Routed" : "Re-route") : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ─── Detail ─── */}
        <section className="detail">
          <div className="detail-stack" key={po.id}>
            <div className="detail-head">
              <div>
                <div className="detail-id">{po.id} · created Mar 14, 2026 · {po.payment}</div>
                <div className="detail-title">{po.vendor.name}</div>
                <div className="detail-line">{po.line}</div>
              </div>
              <div className="detail-actions">
                <button className="btn">Edit PO</button>
                <button className="btn">⋯</button>
              </div>
            </div>

            {/* Summary grid */}
            <div className="card">
              <div className="summary">
                <div className="summary-cell">
                  <div className="summary-label">Total</div>
                  <div className="summary-val amount">€{fmtEUR(po.amount)}</div>
                  <div className={"summary-sub " + (po.amount > 10000 ? "warn" : "ok")}>
                    {po.amount > 10000 ? "Over €10K threshold" : "Under €10K threshold"}
                  </div>
                </div>
                <div className="summary-cell">
                  <div className="summary-label">Category</div>
                  <div className="summary-val">{po.category}</div>
                  <div className={"summary-sub " + (po.category === "CapEx" ? "warn" : "")}>
                    {po.category === "CapEx" ? "Capital expenditure" : "Operating expenditure"}
                  </div>
                </div>
                <div className="summary-cell">
                  <div className="summary-label">Jurisdiction</div>
                  <div className="summary-val">{po.vendor.jurisdiction}</div>
                  <div className={"summary-sub " + (po.vendor.jurisdiction !== "DE" ? "bad" : "ok")}>
                    {po.vendor.jurisdiction !== "DE" ? "Cross-border" : "Domestic"}
                  </div>
                </div>
                <div className="summary-cell">
                  <div className="summary-label">Vendor status</div>
                  <div className="summary-val">{po.vendor.onboarded ? `Tier ${po.vendor.tier}` : "Not onboarded"}</div>
                  <div className={"summary-sub " + (po.vendor.onboarded ? "ok" : "bad")}>
                    {po.vendor.onboarded ? `Approved · since ${po.vendor.since}` : "Pending vendor record"}
                  </div>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-title">Line items ({po.items.length})</div>
                <div className="card-head-meta">Currency · {po.currency}</div>
              </div>
              <table className="lineitems">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Description</th>
                    <th>Account</th>
                    <th className="num">Qty</th>
                    <th className="num">Unit price</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((it, i) => (
                    <tr key={i}>
                      <td>
                        <div className="li-desc">{it.desc}</div>
                        <div className="li-sub">{it.sub}</div>
                      </td>
                      <td><span className="li-acct">{it.account}</span></td>
                      <td className="num">{it.qty}</td>
                      <td className="num">€{fmtEUR(it.unit)}</td>
                      <td className="num">€{fmtEUR(it.total)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="4">Subtotal</td>
                    <td className="num">€{fmtEUR(lineTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ color: "var(--ink-3)" }}>VAT (19%)</td>
                    <td className="num" style={{ color: "var(--ink-3)" }}>€{fmtEUR(tax)}</td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="4" style={{ fontWeight: 700 }}>Total ({po.currency})</td>
                    <td className="num" style={{ fontWeight: 700, fontSize: 14 }}>€{fmtEUR(po.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Vendor + Requester side-by-side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card">
                <div className="card-head">
                  <div className="card-head-title">Vendor</div>
                  <div className="card-head-meta">{po.vendor.vendorId}</div>
                </div>
                <div className="card-body">
                  <div className="vendor">
                    <div className="vendor-logo">{po.vendor.logo}</div>
                    <div>
                      <div className="vendor-name">{po.vendor.name}</div>
                      <div className="vendor-meta">
                        <span className={"vendor-tier " + (po.vendor.onboarded ? "" : "bad")}>
                          {po.vendor.onboarded ? `Tier ${po.vendor.tier} approved` : "Not onboarded"}
                        </span>
                        <span>· {po.vendor.jurisdiction}</span>
                      </div>
                    </div>
                  </div>
                  <div className="vendor-stats">
                    <div>
                      <div className="vendor-stat-label">Vendor since</div>
                      <div className="vendor-stat-val">{po.vendor.since}</div>
                    </div>
                    <div>
                      <div className="vendor-stat-label">Contract</div>
                      <div className="vendor-stat-val">{po.vendor.contract}</div>
                    </div>
                    <div>
                      <div className="vendor-stat-label">Payment terms</div>
                      <div className="vendor-stat-val">{po.vendor.paymentTerms}</div>
                    </div>
                    <div>
                      <div className="vendor-stat-label">Tax ID</div>
                      <div className="vendor-stat-val" style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12 }}>
                        {po.vendor.taxId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div className="card-head-title">Requester &amp; delivery</div>
                  <div className="card-head-meta">{po.departmentCode}</div>
                </div>
                <div className="card-body">
                  <div className="vendor">
                    <div className="vendor-logo" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
                      {po.requestedBy.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div>
                      <div className="vendor-name">{po.requestedBy}</div>
                      <div className="vendor-meta">{po.requestedByRole} · {po.department}</div>
                    </div>
                  </div>
                  <div className="vendor-stats">
                    <div>
                      <div className="vendor-stat-label">Requested</div>
                      <div className="vendor-stat-val">{po.requestedDate}</div>
                    </div>
                    <div>
                      <div className="vendor-stat-label">Need-by</div>
                      <div className="vendor-stat-val">{po.needBy}</div>
                    </div>
                    <div>
                      <div className="vendor-stat-label">Cost centre</div>
                      <div className="vendor-stat-val">{po.departmentCode}</div>
                    </div>
                    <div>
                      <div className="vendor-stat-label">Payment terms</div>
                      <div className="vendor-stat-val">{po.payment}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval chain */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-head">
                <div className="card-head-title">Approval chain</div>
                <div className="card-head-meta">Step 2 of 4 · pending routing</div>
              </div>
              <div className="card-body">
                <div className="approval">
                  <div className="approval-step done">
                    <div className="approval-step-icon">✓</div>
                    <div className="approval-step-name">Submit</div>
                    <div className="approval-step-meta">{po.requestedBy.split(" ")[0]}</div>
                  </div>
                  <div className="approval-line" />
                  <div className="approval-step active">
                    <div className="approval-step-icon">!</div>
                    <div className="approval-step-name">Route</div>
                    <div className="approval-step-meta">YOU</div>
                  </div>
                  <div className="approval-line" />
                  <div className="approval-step">
                    <div className="approval-step-icon">·</div>
                    <div className="approval-step-name">Approve</div>
                    <div className="approval-step-meta">Queue</div>
                  </div>
                  <div className="approval-line" />
                  <div className="approval-step">
                    <div className="approval-step-icon">·</div>
                    <div className="approval-step-name">Issue PO</div>
                    <div className="approval-step-meta">Vendor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity log */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-head">
                <div className="card-head-title">Activity</div>
                <div className="card-head-meta">{po.activity.length} events</div>
              </div>
              <div className="card-body">
                <div className="activity">
                  {po.activity.map((a, i) => (
                    <div className="activity-row" key={i}>
                      <span className={`activity-icon ${a.kind}`}>
                        {a.kind === "ok" ? "✓" : a.kind === "flag" ? "!" : "·"}
                      </span>
                      <div className="activity-msg"><b>{a.who}</b> {a.what}</div>
                      <span className="activity-time">{a.when}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Right action panel ─── */}
        <aside className="right">
          <div className="right-head">
            <div className="right-eyebrow">Step · Route</div>
            <div className="right-title">Pick a queue</div>
            <div className="right-sub">
              The screens move; the rules don't. Route from the rules — check the Policy reference below if you need to confirm.
            </div>
          </div>

          <div className="queues">
            {QUEUES.map((q, i) => {
              const disabled = !!decisions[po.id];
              let cls = `queue ${q.kind}`;
              if (picked && picked.queueId === q.id) {
                cls += picked.correct ? " correct-flash" : " wrong-flash";
              }
              return (
                <button
                  key={q.id}
                  className={cls}
                  onClick={() => route(q.id)}
                  disabled={disabled}
                >
                  <div className="queue-head">
                    <div className="queue-name">{q.name}</div>
                    <div className="queue-icon">{q.icon}</div>
                  </div>
                  <div className="queue-sub">{q.sub}</div>
                  <div className="queue-meta">
                    {q.meta.map((m, j) => <span key={j} className="queue-meta-pip">{m}</span>)}
                    <span style={{ marginLeft: "auto", color: "var(--ink-4)" }}>
                      <span className="queue-meta-pip" style={{ background: "transparent", padding: 0 }}>{i + 1}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Verdict */}
          {verdict && (
            <div className={`verdict show ${verdict.correct ? "ok" : "wrong"}`}>
              <div className="verdict-head">
                {verdict.correct ? "Routed correctly" : "Re-route on review"}
              </div>
              <div className="verdict-title">
                {verdict.correct
                  ? `Right lane: ${queueLabel(verdict.queue)}.`
                  : `Procurement will re-route this PO from "${queueLabel(verdict.queue)}" to "${queueLabel(po.correct)}".`}
              </div>
              <div className="verdict-body">{po.teach}</div>
              <button className="verdict-next" onClick={advance}>
                {idx + 1 >= POS.length ? "See summary →" : "Next PO →"}
              </button>
            </div>
          )}

          {/* Policy reference drawer */}
          <div className={`drawer ${drawerOpen ? "open" : ""}`}>
            <div className="drawer-head" onClick={() => setDrawerOpen((o) => !o)}>
              <div className="drawer-title">
                <span className="doc-icon">P</span>
                Routing policy · §4.2 reference
              </div>
              <span className="drawer-toggle">▼</span>
            </div>
            <div className="drawer-body">
              <div className="drawer-inner">
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginBottom: 10 }}>
                  Apply rules top-to-bottom. First match owns the routing decision. The UI moves; this list doesn't.
                </div>
                {RULES.map((r) => (
                  <div
                    key={r.id}
                    className={`drawer-rule ${verdict && evaluations.matchedId === r.id ? "matched" : ""}`}
                  >
                    <span className="drawer-rule-num">{r.code}</span>
                    {r.text}
                    <span className="drawer-rule-then">{r.then}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? "show" : ""} ${toast?.kind === "success" ? "success" : ""}`}>
        <span>{toast?.kind === "success" ? "✓" : "ⓘ"}</span>
        <span>{toast?.msg}</span>
      </div>

      {/* Results overlay */}
      <div className={`results ${showResults ? "show" : ""}`}>
        <div className="results-card">
          <div className="results-head">
            <div className="results-eyebrow">Procurefy · Routing review</div>
            <div className="results-title">
              {correctCount === POS.length ? "Rules-routed clean." :
               correctCount >= POS.length - 1 ? "Almost there." :
               "Re-take recommended."}
            </div>
            <div className="results-sub">
              {correctCount === POS.length
                ? "You routed from the rules, not the UI. Procurement can rebuild the screens next quarter — your decision logic moves with the rules, not the buttons."
                : "The UI moves; the rules don't. Walk back through the trace below — the failure is almost always a gate that fired earlier than you noticed."}
            </div>
          </div>
          <div className="results-score">
            <div className="res-score-num"><b>{correctCount}</b>/{POS.length}</div>
            <div>
              <div className="res-meta-row"><span style={{ minWidth: 130, color: "var(--ink-3)" }}>Pass bar</span><b>3 / 3 correct</b></div>
              <div className="res-meta-row"><span style={{ minWidth: 130, color: "var(--ink-3)" }}>L3 target</span><b>misrouted POs −50% in 6 weeks</b></div>
              <div className="res-meta-row"><span style={{ minWidth: 130, color: "var(--ink-3)" }}>L3 target</span><b>hand-edits at finance −60%</b></div>
            </div>
          </div>
          <div>
            {POS.map((p) => {
              const d = decisions[p.id];
              if (!d) return null;
              return (
                <div key={p.id} className="res-row">
                  <div>
                    <div className="res-poid">{p.id}</div>
                    <div className="res-name">{p.vendor.name}</div>
                    <div className="res-amount">€{fmtEUR(p.amount)} · {p.category} · {p.vendor.jurisdiction}</div>
                  </div>
                  <div>
                    {p.flow.map((step, i) => {
                      const rule = RULES.find((r) => r.id === step.rule);
                      return (
                        <div key={i} className="res-flow-step">
                          <b>{rule.code}</b>
                          <span style={{ color: "var(--ink-3)" }}> · {rule.field}: </span>
                          <span className={step.outcome === "yes" ? "yes" : "no"}>{step.outcome}</span>
                          <span style={{ color: "var(--ink-3)" }}> ({step.note})</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="res-decision">
                    <span className={`res-tag ${d.correct ? "" : "wrong"}`}>
                      {d.correct ? "Routed correctly" : "Re-route"}
                    </span>
                    <div className="res-decision-line">
                      You routed: <b>{queueLabel(d.queue)}</b>
                    </div>
                    {!d.correct && (
                      <div className="res-decision-line" style={{ color: "var(--ink-3)" }}>
                        Should be: <b style={{ color: "var(--ink)" }}>{queueLabel(p.correct)}</b>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="results-cta">
            <button className="res-btn" onClick={restart}>Re-run</button>
            <a className="res-btn secondary" href="index.html">← Back to index</a>
          </div>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
