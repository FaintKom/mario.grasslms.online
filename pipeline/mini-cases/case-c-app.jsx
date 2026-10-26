const { useState, useEffect, useMemo, useRef } = React;

/* ─────────────────────────────────────────────────────
   Route-the-PO · Procurefy procurement-system simulation
   4 POs · routing rules over UI · first match wins
   ───────────────────────────────────────────────────── */

const RULES = [
  {
    id: "r1",
    code: "01",
    text: <>Is the vendor <b>onboarded</b>, that is, on the approved vendor list?</>,
    then: <>If it is not, the order goes to <b>Legal & Compliance</b>, because the vendor-onboarding pack has to clear first.</>,
    field: "Vendor status",
    evaluate: (po) => (po.vendor.onboarded ? "yes" : "no"),
    onNo: { queue: "legal", note: "The vendor is not onboarded yet, and Legal owns the onboarding pack." },
  },
  {
    id: "r2",
    code: "02",
    text: <>Is the vendor based <b>outside Germany</b>?</>,
    then: <>If it is, the order goes to <b>Legal & Compliance</b>, which checks cross-border terms, data residency and withholding.</>,
    field: "Jurisdiction",
    evaluate: (po) => (po.vendor.jurisdiction !== "DE" ? "yes" : "no"),
    onYes: { queue: "legal", note: "The vendor is outside Germany, so Legal has to clear the cross-border terms." },
  },
  {
    id: "r3",
    code: "03",
    text: <>Is the <b>net total above €10,000</b>, or is the category <b>CapEx</b>?</>,
    then: <>If either is true, the order goes to <b>Finance review</b> for a funding-line check before anything is committed.</>,
    field: "Amount × category",
    evaluate: (po) => (po.amount > 10000 || po.category === "CapEx" ? "yes" : "no"),
    onYes: { queue: "finance", note: "The order is over the threshold or CapEx, so Finance checks the funding line." },
  },
  {
    id: "r4",
    code: "04",
    text: <>If none of the rules above matched, the order goes to the <b>Auto-approve queue</b>.</>,
    then: <>This is the default queue for low-risk spend that follows policy.</>,
    field: "Default route",
    evaluate: () => "yes",
    onYes: { queue: "auto", note: "No earlier rule matched." },
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
    teach: "Acme is onboarded and based in Germany, so rules 01 and 02 do not apply. Rule 03 matches twice, because the total of €12,480 is above €10K and the category is CapEx. Either fact alone would send the order to Finance. A good vendor and an ordinary-looking amount make it tempting to wave the order through. Rule 03 is about who answers for the funding line, and the vendor's quality has nothing to do with it.",
    flow: [
      { rule: "r1", outcome: "yes", note: "Onboarded · Tier-2" },
      { rule: "r2", outcome: "no",  note: "Jurisdiction DE, domestic" },
      { rule: "r3", outcome: "yes", note: "€12,480 > €10K and CapEx" },
    ],
    activity: [
      { who: "Anouk Mehta", what: <>created the PO from quote <b>QT-9088</b></>, when: "Mar 14, 10:22", kind: "default" },
      { who: "System", what: <>budget pre-check <b>passed</b> against <b>ENG-CAPEX-450</b> (€48,200 remaining)</>, when: "Mar 14, 10:23", kind: "ok" },
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
    teach: "A small yearly SaaS order is easy to wave through. The vendor is not yet on the approved list, and that alone sends the order to Legal under rule 01. The US jurisdiction would have sent it there under rule 02 as well, before the amount or the category is even considered.",
    flow: [
      { rule: "r1", outcome: "no", note: "Vendor not onboarded" },
    ],
    activity: [
      { who: "Jules Tanaka", what: <>requested vendor onboarding for <b>Globex Cloud Services</b></>, when: "Mar 12, 14:01", kind: "default" },
      { who: "Jules Tanaka", what: <>submitted PO referencing pending vendor record</>, when: "Mar 14, 09:48", kind: "default" },
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
    teach: "This is routine catalogue spend from an approved Tier-1 vendor in Germany. It is OpEx and well under the threshold, so no rule before 04 matches and the order belongs in the auto-approve queue. Sending orders like this to Finance clogs its queue and makes the reviews that matter arrive late.",
    flow: [
      { rule: "r1", outcome: "yes", note: "Tier-1 approved" },
      { rule: "r2", outcome: "no",  note: "Domestic DE" },
      { rule: "r3", outcome: "no",  note: "€847 < €10K · OpEx" },
      { rule: "r4", outcome: "yes", note: "Default route" },
    ],
    activity: [
      { who: "Karim Voss", what: <>created the PO from standard catalogue order</>, when: "Mar 14, 11:02", kind: "default" },
      { who: "System", what: <>budget pre-check <b>passed</b> against <b>FAC-OPEX-100/110</b></>, when: "Mar 14, 11:02", kind: "ok" },
      { who: "System", what: <>awaiting <b>routing decision</b></>, when: "Mar 14, 11:02", kind: "default" },
    ],
  },
  {
    // The precedence trap: everything about the money says Finance, but rule 02 matches first.
    id: "PO-2026-0344",
    name: "Nordwerk Automation GmbH",
    line: "Warehouse label-printer line upgrade · Quote NW-2231",
    amount: 18960,
    category: "CapEx",
    department: "Warehouse Operations",
    departmentCode: "OPS-WH-07",
    requestedBy: "Lena Brandt",
    requestedByRole: "Warehouse Lead",
    requestedDate: "Mar 14, 2026",
    needBy: "May 15, 2026",
    payment: "Net-30",
    currency: "EUR",
    items: [
      { desc: "Industrial label printer · 600 dpi", sub: "Nordwerk part #NW-LP600, 2-year warranty", account: "OPS-CAPEX-300", qty: 4, unit: 3850, total: 15400 },
      { desc: "Print-and-apply module", sub: "One per printer, conveyor mount", account: "OPS-CAPEX-300", qty: 4, unit: 690, total: 2760 },
      { desc: "Commissioning & operator training", sub: "On site, one day", account: "OPS-OPEX-120", qty: 1, unit: 800, total: 800 },
    ],
    vendor: { name: "Nordwerk Automation GmbH", onboarded: true, tier: 2, jurisdiction: "AT", vendorId: "VEN-00317", since: "Nov 2022", contract: "MSA-Nordwerk-2023", paymentTerms: "Net-30", taxId: "ATU 6620-4418", logo: "NA" },
    correct: "legal",
    teach: "Everything about the money points to Finance, because €18,960 is over the threshold and the order is CapEx. The rules are applied from the top, and the first one that matches decides. Nordwerk is onboarded, so rule 01 does not apply. Rule 02 then matches because the vendor is in Austria. The order goes to Legal & Compliance before anyone looks at the amount.",
    flow: [
      { rule: "r1", outcome: "yes", note: "Onboarded · Tier-2" },
      { rule: "r2", outcome: "yes", note: "Jurisdiction AT, cross-border" },
    ],
    activity: [
      { who: "Lena Brandt", what: <>created the PO from quote <b>NW-2231</b></>, when: "Mar 14, 13:37", kind: "default" },
      { who: "System", what: <>budget pre-check <b>passed</b> against <b>OPS-CAPEX-300</b></>, when: "Mar 14, 13:38", kind: "ok" },
      { who: "System", what: <>awaiting <b>routing decision</b></>, when: "Mar 14, 13:38", kind: "default" },
    ],
  },
];

const COUNTRY = { DE: "Germany", US: "United States", AT: "Austria" };

const QUEUES = [
  { id: "auto", kind: "auto", name: "Auto-approve queue", icon: "01", sub: "On-policy spend · approved vendor · under threshold", meta: ["Same-day", "No human touch"] },
  { id: "finance", kind: "finance", name: "Finance review queue", icon: "02", sub: "Over €10K or CapEx · funding-line check", meta: ["1–3 days", "Funding-line check"] },
  { id: "legal", kind: "legal", name: "Legal & Compliance review", icon: "03", sub: "New vendor or foreign jurisdiction · terms review", meta: ["3–10 days", "Terms / IP / data"] },
];

function fmtEUR(n) {
  // English grouping (12,480.00) to match the English UI and the feedback text.
  return n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        : `Routed to ${queueLabel(queueId)}, where a reviewer will move it to the right queue.`,
      kind: isCorrect ? "success" : "info",
    });
    setTimeout(() => setToast(null), 2300);
    setTimeout(() => {
      setVerdict({ correct: isCorrect, queue: queueId, po });
      setDrawerOpen(true);  // open policy drawer to show why
    }, 500);
  };

  // Next undecided PO after the current one; null once all are routed.
  const nextOpenIdx = () => {
    for (let k = 1; k <= POS.length; k++) {
      const j = (idx + k) % POS.length;
      if (!decisions[POS[j].id]) return j;
    }
    return null;
  };

  const advance = () => {
    const next = nextOpenIdx();
    setVerdict(null);
    setTimeout(() => {
      setDrawerOpen(false);
      if (next === null) setShowResults(true);
      else setIdx(next);
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

  /* Keep the verdict and its Next button in view: the policy drawer opens under it. */
  const verdictRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    if (!verdict) return;
    const t = setTimeout(() => {
      if (verdictRef.current) verdictRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
      if (nextRef.current) nextRef.current.focus({ preventScroll: true });
    }, 400);
    return () => clearTimeout(t);
  }, [verdict]);

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
  // German VAT only on domestic vendors; cross-border purchases are reverse-charged.
  const domestic = po.vendor.jurisdiction === "DE";
  const tax = domestic ? +(lineTotal * 0.19).toFixed(2) : 0;

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
            <input type="checkbox" aria-label="Select all orders" />
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
                  onClick={() => { if (!d && !verdict && !decisions[po.id]) setIdx(i); }}
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
                  <div className="summary-label">Net total</div>
                  <div className="summary-val amount">€{fmtEUR(po.amount)}</div>
                  {/* Raw facts only: the screen states the data, the learner applies the rules. */}
                  <div className="summary-sub">Excl. VAT · {po.items.length} line{po.items.length === 1 ? "" : "s"}</div>
                </div>
                <div className="summary-cell">
                  <div className="summary-label">Category</div>
                  <div className="summary-val">{po.category}</div>
                  <div className="summary-sub">
                    {po.category === "CapEx" ? "Capital expenditure" : "Operating expenditure"}
                  </div>
                </div>
                <div className="summary-cell">
                  <div className="summary-label">Jurisdiction</div>
                  <div className="summary-val">{po.vendor.jurisdiction}</div>
                  <div className="summary-sub">{COUNTRY[po.vendor.jurisdiction] || po.vendor.jurisdiction}</div>
                </div>
                <div className="summary-cell">
                  <div className="summary-label">Vendor status</div>
                  <div className="summary-val">{po.vendor.onboarded ? `Tier ${po.vendor.tier}` : "Not onboarded"}</div>
                  <div className="summary-sub">
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
                    <td colSpan="4" style={{ color: "var(--ink-3)" }}>{domestic ? "VAT (19%)" : "VAT (reverse charge)"}</td>
                    <td className="num" style={{ color: "var(--ink-3)" }}>€{fmtEUR(tax)}</td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="4" style={{ fontWeight: 700 }}>Total ({po.currency})</td>
                    <td className="num" style={{ fontWeight: 700, fontSize: 14 }}>€{fmtEUR(lineTotal + tax)}</td>
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
            <div className="right-title">Pick a queue</div>
            <div className="right-sub">
              Decide which queue each order goes to by the routing policy rather than by how the screen looks. You can open the policy at the bottom of this panel whenever you need to check a rule.
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
            <div className={`verdict show ${verdict.correct ? "ok" : "wrong"}`} ref={verdictRef} role="status">
              <div className="verdict-title">
                {verdict.correct
                  ? `You sent it to the right queue, ${queueLabel(verdict.queue)}.`
                  : `This order belongs in ${queueLabel(verdict.po.correct)}. A reviewer will move it there from ${queueLabel(verdict.queue)}.`}
              </div>
              <div className="verdict-body">{verdict.po.teach}</div>
              <button className="verdict-next" onClick={advance} ref={nextRef}>
                {nextOpenIdx() === null ? "See results →" : "Next PO →"}
              </button>
            </div>
          )}

          {/* Policy reference drawer */}
          <div className={`drawer ${drawerOpen ? "open" : ""}`}>
            <div className="drawer-head" onClick={() => setDrawerOpen((o) => !o)}>
              <div className="drawer-title">
                <span className="doc-icon">P</span>
                Routing policy, section 4.2
              </div>
              <span className="drawer-toggle">▼</span>
            </div>
            <div className="drawer-body">
              <div className="drawer-inner">
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginBottom: 10 }}>
                  Go through the rules from the top and stop at the first one that matches. That rule decides the route, and the rules stay the same when the screens are redesigned.
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
            <div className="results-title">
              {correctCount === POS.length ? "You routed all 4 orders to the right queue" :
               `You routed ${correctCount} of 4 orders correctly, and the pass mark is all 4`}
            </div>
            <div className="results-sub">
              {correctCount === POS.length
                ? "You routed each order by applying the rules. Your decisions will still hold when Procurement redesigns the screens next quarter."
                : "Go back through the rule trace below. The mistake is usually a rule that matched earlier than you noticed."}
            </div>
          </div>
          <div className="results-score">
            <div className="res-score-num"><b>{correctCount}</b>/{POS.length}</div>
            <div>
              <div className="res-meta-row"><span style={{ minWidth: 130, color: "var(--ink-3)" }}>Pass mark</span><b>all {POS.length} orders correct</b></div>
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
                      {d.correct ? "Right queue" : "Wrong queue"}
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
            <button className="res-btn" onClick={restart}>Try again</button>
            <a className="res-btn secondary" href="index.html">← Back to index</a>
          </div>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
