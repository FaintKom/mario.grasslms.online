# Case brief · FinTechCard · SMB SDR Onboarding

> The full engagement input pack. Client snapshot, named stakeholders with verbatim inputs, 10 SME interviews, 22 Gong call findings, ICP buyer specs, product facts, dashboard schema, comp plan, brand voice, regulatory context.

---

## 1 · Client snapshot

| Field | Value |
|---|---|
| Client | FinTechCard Ltd. (anonymised) |
| Industry | Fintech · corporate cards + expense management for SMB segment |
| Stage | Series-B · €48m raised · 18 months post-Series-A |
| Revenue | ARR ~€22m · target ARR €40m by EOY |
| Headcount | ~280 FTE · **120-rep sales org** |
| Pods | UK · IE · NL · DE · ES · IT |
| ICP | SMB owners · 5–100 FTE · recurring card spend ≥€10K / month · EU-incorporated |
| Product | Corporate card + spend-control platform: real-time limits, multi-user cards, auto-FX at interbank, receipt capture, QuickBooks / Xero / Sage sync |
| Regulator | Tier-1 EU partner bank (anonymised); funds segregated from FinTechCard balance sheet |
| Existing onboarding length | 6 weeks formal + ad-hoc afterwards |
| Existing ramp time (baseline) | Mean 95 days to first paid quota · top decile 52 d · bottom quartile >120 d |
| Existing day-120 retention | ~83 % (i.e. ~17 % bottom-quartile churn pre-payback) |

---

## 2 · Named stakeholders

| Name (anonymised) | Role | Decision power | Engagement role |
|---|---|---|---|
| **K.M.** | VP Sales Enablement · 11 months in role · ex-Stripe SE manager | Sponsor · economic buyer · final sign-off on curriculum | Kickoff lead · weekly check-ins · phase-gate signer |
| **A.S.** | Head of SDR Org (UK + IE) · 3 yrs at FinTechCard, promoted from senior SDR | Champion · SME gatekeeper | Provides 8 SDR + 2 manager SMEs · validates behavioural moves |
| **D.R.** | Head of People · L&D budget owner | Contract co-signer · phased payment trigger | Signs contract + invoices |
| **J.V.** | RevOps Director · owns Salesforce + Outreach + Gong stack | L4 measurement plan signer | Dashboard wiring · ramp-time data · day-120 retention rollup |
| **8 × SDR SMEs** | 2 top-decile · 4 mid-band · 2 bottom-quartile (1 current + 1 recent exit) | n/a | Interview source for M1/M2/M3 |
| **2 × SDR Managers** | UK pod · DE pod | n/a | Manager-side persona · L3 rubric calibration |
| **R.K.** | CMO · owns marketing-sourced inbound | n/a | Lead-quality dependency (out of scope; K.M. owns the conversation) |
| **LMS admin** | Sana administrator | Phase 5 launch signer | SCORM upload + cohort enrollment |

---

## 3 · Engagement contract

| Field | Value |
|---|---|
| Engagement | Full instructional-design cycle · Discover → Iterate · 6 months end-to-end |
| Start | March 2026 · week 1 Monday |
| First cohort live | 1 July 2026 (16 weeks from kickoff) |
| Hard date | Slip past 15 July pushes to September (sales-org kickoff blackout) |
| Budget | €58 000 fixed-fee |
| Payment schedule | 25 % at Phase 1 gate · 50 % at Phase 4 gate · 25 % at Phase 6 gate |
| Lead designer | Mario Becerra · solo + 2 client SMEs + 1 client LMS admin |
| Cohort cadence post-launch | Every 4 weeks · 10–15 reps per cohort |
| Language v1 | EN only · ES + DE post-pilot |

---

## 4 · Business problem · K.M.'s words at kickoff

> "Ramp time for new SDRs is sitting at ~95 days to first paid quota attainment. Top decile hits it in ~52. Bottom quartile churns out before day 120 without ever paying for themselves. We need to compress mean ramp by 25 % and stop the bottom-quartile churn — losing two reps before they pay back costs us ~€90K each in unrecovered onboarding."

> "I've committed −25 % ramp compression to the CRO. That's the public number. If we hit it, we hit it together. If we miss it, I need to know whether the cause was training or lead quality or comp, because the conversation with the CRO is honest either way."

---

## 5 · Success measures (agreed at kickoff)

| Level | Measure | Baseline | 6-month target | 12-month target | Source |
|---|---|---|---|---|---|
| L4 | Mean ramp to first paid quota | 95 d | ≤ 71 d (−25 %) | ≤ 65 d (−32 %) | Salesforce `Ramp_Time__c` field |
| L4 | Day-120 retention | ~83 % | ≥ 92 % (churn ≤ 8 %) | ≥ 95 % (churn ≤ 5 %) | HRIS exit rollup + Salesforce |
| L3 | Talk-track adherence weeks 4–8 | ~52 % | ≥ 80 % | ≥ 85 % | Gong opener-tag adherence flag |
| L3 | Objection-handling rubric, week 4 | ~2.4 / 5 | ≥ 3.5 / 5 | ≥ 4.0 / 5 | Manager rubric (built in Phase 6) |
| L2 | SCORM quiz mastery, first attempt | n/a | ≥ 80 % | ≥ 85 % | `cmi.core.score.raw` |
| L2 | Spaced retrieval at +7 d | n/a | ≥ 70 % | ≥ 75 % | LMS-scheduled mini-quiz |
| L1 | "I could use this on a call today" | n/a | ≥ 4.0 / 5 | ≥ 4.2 / 5 | Thalheimer post-module micro-pulse |

---

## 6 · Scope

**In scope:**
- 0–60 day ramp arc for newly hired SDRs in the SMB segment.
- Call-motion craft: discovery, positioning, objection handling, call close.
- Manager-side reinforcement layer: shared 1:1 rubric, week-2 + week-6 calibration sessions, manager call-review cadence.
- Measurement plumbing: Kirkpatrick L1–L4 wired to Gong + Salesforce + HRIS (no new tooling).
- Manager-side training adoption: a floor under 1:1 cadence quality.

**Out of scope (K.M. co-signed):**
1. Regulatory / compliance training (KYC, AML, SCA, PSD2, GDPR) — handled by compliance team via separate Cornerstone modules: "Reg-101", "AML for Card Sellers", "GDPR Refresher".
2. Manager hiring + onboarding — separate engagement.
3. Mid-Market + Enterprise SDR motion — different cycle, different stakeholder map; Q4 2026 separate engagement.
4. Comp-plan redesign — RevOps-owned; surface findings only.
5. CRM / tooling swap — Salesforce + Outreach + Gong + Slack are fixed.
6. Marketing-source lead-quality fix — outside training-side responsibility; K.M. owns CMO conversation.

---

## 7 · Constraints

- **Cohort tolerance ≤ 10 min per module.** Between-call windows. No 90-min training sessions; floor schedule blocks them.
- **No new authoring-tool purchase.** Client already owns Articulate 360 (Rise + Storyline) + SCORM Cloud. Use that OR custom SCORM if interaction outpaces Storyline.
- **LMS = Sana.** SCORM 1.2 compatibility required. xAPI nice-to-have.
- **WCAG 2.1 AA · GDPR no PII in training content.** Use anonymised buyer personas ("Maria, retail SMB owner") not real customer data.
- **No audio narration in v1.** No in-house studio.

---

## 8 · K.M. (Sponsor) · full kickoff input

### What K.M. said about the business outcome

> "Two KPIs live on the same dashboard: days-to-first-paid-quota in Salesforce, and day-120 retention in the HRIS rollup. Move both."

> "Six months in: mean ramp ≤ 71, churn ≤ 8 %. Twelve months: mean ramp ≤ 65, churn ≤ 5 %. The 25 % compression on ramp is what I've committed publicly."

### What K.M. said about previous training

> "Last vendor spent the kickoff call pitching me Articulate add-ons. They built a 90-minute slide deck no one finished. Don't do that."

> "K.M.'s phrasing on failure mode: 'Another Articulate slide-deck no one finishes.' Use this verbatim if you ever build a 'what we learned' section."

### What K.M. said about the manager layer

> "Manager 1:1 quality varies massively. I've got pods where managers do 30-min weekly call reviews with rubrics, and pods where the manager hasn't sat in on a call in a month. If you can put a floor under that, the program lands. If you can't, the program lives on the LMS and never makes it into 1:1s."

> "Don't try to retrain managers. Give them a shared rubric and two calibration sessions. That's enough."

### What K.M. said about non-training causes

> "Lead quality is messy. Marketing-sourced inbound close-rate dropped 12 % → 8 % over the last two quarters. I've told the CMO. Not your problem, but I want you to know I know it's in the picture."

> "Comp plan rewards closed-won regardless of source. New reps grind on stale leads chasing the SPIF rather than working the day-1 list. RevOps owns the redesign. I'm not asking you to fix it; I am asking you to surface it."

> "The 25 % ramp compression target assumes I get the lead-quality conversation moving on my end. I am not asking you to fix marketing."

### What K.M. said about scope discipline

> "Three things we are explicitly not solving: compliance training, manager hiring + onboarding, and the mid-market segment. They have their own programs / owners."

> "I co-sign your additions: comp-plan redesign, CRM swap, marketing lead-quality. Document them."

### What K.M. said about the SPOC

> "A.S. for SME access. Me for sign-offs. D.R. for contract amendments and payment triggers."

### What K.M. said about the timeline

> "First cohort live July 1st. That's 16 weeks from this call. Slipping past July 15th puts us into a sales-org kickoff blackout — would push to September. We do not want September."

### What K.M. wants in the manager-reinforcement layer (week 2 follow-up call)

> "I want managers to walk out of the week-2 calibration session with a rubric they can use on 4 calls per rep per month. Not a 12-page document — a single sheet with 3 rows (one per move) and 1–5 scoring with anchored descriptors."

> "The week-6 session should be calibration: managers score the same 3 sample calls and we surface where they disagree. That's where the real coaching skill develops."

---

## 9 · A.S. (Head of SDR) · full input

### What A.S. said about the top-vs-bottom delta (kickoff §03)

> "Three things stand out from Gong reviews. One — top reps spend the first 60 seconds of every cold call asking one diagnostic question that exposes which pain to pitch against. The rest of them launch into the pitch in the first 15 seconds. Two — when the buyer pushes back, top reps re-state the objection back in the buyer's own words before responding. The rest of them argue. Three — top reps end every call with a written next step booked in the calendar before they hang up. The rest say 'I'll follow up.'"

> "Top reps sound nothing alike. They don't follow a script. But those three moves are always there."

> "Bottom quartile inverts all three. Skip the diagnostic. Argue with objections. End with 'I'll follow up.'"

### What A.S. said about the keystone behaviour

> "If a rep finishes this program, the first observable thing they do differently on Monday morning is open every cold call with the diagnostic question. That's the keystone."

### What A.S. said about pod-level cadence variance

> "Pod-by-pod manager cadence:
> - UK Pod 1 (Manchester) — weekly 30-min call review, rubric-led. Manager: J.T.
> - UK Pod 2 (London A) — weekly 1:1 but no call review. Manager: H.M.
> - UK Pod 3 (London B) — bi-weekly, ad-hoc. Manager: F.O.
> - UK Pod 4 (Belfast) — has not had a structured call review in 5 weeks. Manager: D.W. (newly promoted)
> - DE Pod 1 (Berlin) — weekly call review. Manager: M.K. (the closest analogue to the UK Pod 1 cadence)
> - DE Pod 2 (Munich) — bi-weekly. Manager: S.B.
> - ES Pod (Barcelona) — weekly but in Spanish; rubric not translated. Manager: I.C.
> - NL Pod (Amsterdam) — weekly. Manager: T.V.
> - IT Pod (Milan) — bi-weekly. Manager: G.R."

> "If we get the rubric translated and adopted in all 9 pods within the first 6 weeks of the program, that's the floor I'm asking for."

### What A.S. said about Gong access

> "I'll give you a Gong viewer license for the duration of the engagement. You can pull any call by rep, by week, by tag. Don't share recordings outside the engagement team — Gong has consent flags on each call and not every buyer is on a recorded line."

### What A.S. said about the SME interview list

> "I'll set up 10 interviews. 8 SDRs + 2 managers. Top-decile reps: **M.G.** (Manchester, 14 months) and **L.D.** (Berlin, 11 months). Bottom-quartile: **P.B.** (London, struggling at month 4) + one we just exited (her name is anonymised in your notes, treat as 'exit interview'). Mid: 4 reps across UK + DE + ES. Managers: J.T. (UK Pod 1) and M.K. (DE Pod 1) — the two highest-cadence pods, so you can see what 'good' looks like."

---

## 10 · 10 SME interview pack · key Q&A per rep

### 10.1 · M.G. (top-decile · Manchester · 14 months) — 32 min

**Q: Walk me through your first 60 seconds of a cold call.**
> "I never start with 'how are you.' I open with one diagnostic that I've picked off LinkedIn or their Companies House filing. Last week I called a retail SMB owner — opened with 'I noticed you've opened a second location in the last 6 months — who's approving expense reports across both stores now?' She paused for 4 seconds. Then she told me her bookkeeper was overwhelmed. From there it was a 14-min call."

**Q: What do you do when the buyer pushes back?**
> "I repeat what they said back in their own words. If they say 'we already have a Visa,' I say 'so you've got the card-issuing side sorted.' Then I wait. Usually they tell me what's actually broken. 'But the controls are a mess' or 'our bookkeeper hates it.' That's where the actual pitch happens."

**Q: What do you do at the end of every call?**
> "I have my calendar open in a second tab the entire time. The moment they show any interest, I say 'what's the best 20 minutes next week to walk you through the SMB version?' and I read out two slots. I do not say 'I'll send you something.' I have lost too many deals to follow-up."

**Q: What would you tell a brand-new SDR?**
> "Stop trying to sound smart. The buyer doesn't care if you know fintech jargon. They care if you understand their problem. Ask one good question and then shut up for 5 seconds. Five seconds feels like an hour but it's where the deal happens."

**Q: What's broken about current onboarding for you?**
> "They taught me the four product props in week 1. Useful but not what I needed. What I needed was the framing of when to use which prop against which objection. Took me 4 months to figure that out on my own."

### 10.2 · L.D. (top-decile · Berlin · 11 months) — 28 min

**Q: Same first-60-seconds question.**
> "Mein Standard-Opener auf Deutsch: 'Ich rufe an, weil ich sehe, Sie haben in den letzten 6 Monaten 12 neue Mitarbeiter eingestellt — wer genehmigt zur Zeit die Spesenabrechnungen?' Auf Englisch ist es derselbe Move. Eine spezifische Beobachtung über ihr Geschäft + eine Frage darüber, wer was kontrolliert."

**Q: How do you handle "we already use Brex" or competitive displacement?**
> "I never argue against Brex. I say 'Brex is great if you're a US-based startup with USD-only spend. We're built for EU multi-currency and we sit on top of your existing accounts — additive, not replacement.' Then I ask what their FX exposure looks like. 90 % of the time they don't know and I have a wedge."

**Q: What separates DE pods from UK pods in your view?**
> "DE buyers want more numbers and more process. UK buyers want more relationship. Same product, different opening. The diagnostic question I pick for a DE call is always quant-anchored — FX volume, headcount growth, monthly card spend. For UK I lean more behavioural — who approves what, who hates what."

### 10.3 · 4 mid-band reps · summary

| Rep | Pod | Tenure | Key quote |
|---|---|---|---|
| H.K. | UK Pod 2 (London A) | 8 months | "I know the three moves but I forget them under pressure. By call 3 of a tough day I'm just pitching." |
| N.W. | DE Pod 2 (Munich) | 6 months | "My manager has not listened to one of my calls in three weeks. I don't know what I'm doing wrong." |
| R.A. | ES Pod (Barcelona) | 9 months | "Half my pipeline is Spanish-speaking but the cheat sheets I get are all in English. I translate them in my head live on the call." |
| O.B. | UK Pod 1 (Manchester) | 5 months | "My manager runs call reviews every week with a rubric. I'm getting better fast but I see other pods don't have that and I think that's why they're behind." |

### 10.4 · P.B. (bottom-quartile · London · month 4 · still in role) — 41 min

**Q: Walk me through your last cold call.**
> "I opened with 'hi, this is P. calling from FinTechCard, do you have a moment to talk about your corporate spending?' She said 'no' and hung up. That was the third one this morning. By the fourth I just started saying 'I know you're busy, but our card is cheaper than your bank's...' which I know is wrong but I don't know what else to say."

**Q: What do you do when the buyer pushes back?**
> "I argue. I know I'm not supposed to. I say things like 'but our fees are lower' or 'but our controls are better.' I can hear it not working. I just don't have anything better loaded."

**Q: What would help?**
> "I want to know the move before I'm on the call — not have to invent it while a CFO is breathing down the line. The product training I got in week 1 was thorough but it didn't load any moves. It loaded knowledge."

**Q: What's your manager 1:1 cadence?**
> "Officially weekly. In practice every 9–14 days. Last call review was 19 days ago. He's busy."

**Q: Why do you stay?**
> "I want this to work. I left retail for this, this was supposed to be my upgrade. But if I don't see ramp by month 6 I'm going back. Probably to Klarna or one of the other fintechs hiring."

### 10.5 · Exit interview (recent exit · UK · left at month 4.5) — 22 min

**Q: Top 3 reasons you left.**
> "One — no feedback on my calls for the last 6 weeks of my tenure. I genuinely didn't know if I was getting better or worse. Two — the leaderboard in Slack. Every Monday I was bottom 3 and everyone could see it. Three — the cold-call rejection rate. Around 70 % of dials were hangups within 10 seconds. I started dreading mornings."

**Q: Anything that would have changed your decision?**
> "Probably the call-feedback piece. If my manager had sat in on a call once a week for 30 minutes and told me what to fix, I think I would have made it past month 6."

### 10.6 · J.T. (UK Pod 1 Manager · highest-cadence pod) — 35 min

**Q: Walk me through your weekly cadence with each rep.**
> "Monday morning standup — 15 min, pipeline review. Tuesday 1:1 — 30 min, rotating focus: weeks 1 + 3 = call review, weeks 2 + 4 = pipeline + comp + career. Thursday floor walk — I sit at a rep's desk for 30 min listening to live calls + giving live feedback between dials."

**Q: What rubric do you use during call review?**
> "I made my own. Three rows — opener / objection / close — each scored 1–5 with 3 example anchors per row. Took me 6 months to develop. I'd happily share it with the program."

**Q: Why does your pod ramp faster?**
> "Two reasons. The cadence is real — I actually do the call review every week, not just put it on the calendar. And the rubric is shared — reps know what I'm grading them on so they self-correct between calls."

### 10.7 · M.K. (DE Pod 1 Manager · 2nd-highest cadence) — 31 min

**Q: Same cadence question.**
> "Wöchentliches 1:1 mit Call-Review. 30 Min. Ich nutze eine eigene Rubrik aber sie ist nicht so strukturiert wie J.T.'s. Wenn ihr eine bessere baut, ich übernehme sie."

**Q: What's the biggest blocker for new reps in your pod?**
> "Language switching mid-call. A buyer answers in DE, mid-call switches to EN because their CFO joined, and the rep is caught flat-footed. We need bilingual cheat sheets for cohort 2."

### 10.8 · Combined manager view on the missing rubric

> Both managers asked unprompted for a **shared, calibrated 3-row rubric** they could use during call reviews — and for a way to compare scores across pods so they could spot pattern misses early. This is the single most-requested artefact from the manager side. (Becomes the L3 observation rubric in Phase 6.)

---

## 11 · 22 Gong call review · 1-line findings per call

| ID | Rep band | M1 (diagnostic) | M2 (acknowledge) | M3 (calendar-close) | Outcome |
|---|---|---|---|---|---|
| GC-01 | Top (M.G.) | ✓ (38 s) | ✓ | ✓ (booked 20-min demo) | Demo booked |
| GC-02 | Top (M.G.) | ✓ (52 s) | ✓ | ✓ | Demo booked |
| GC-03 | Top (L.D.) | ✓ (29 s) | ✓ | ✓ (booked 10-min product-fit) | Booked |
| GC-04 | Top (L.D.) | ✓ (45 s) | n/a (no objection) | ✓ | Booked |
| GC-05 | Top (M.G.) | ✓ (50 s) | ✓ | partial ("I'll send a calendar invite") | Booked w/ follow-up |
| GC-06 | Top (L.D.) | ✓ (33 s) | ✓ (Brex displacement) | ✓ | Booked |
| GC-07 | Top (M.G.) | ✓ (42 s) | ✓ | ✓ | Booked |
| GC-08 | Top (L.D.) | ✓ (29 s) | ✓ | ✓ | Booked |
| GC-09 | Mid (H.K.) | ✓ (58 s) | ✗ (argued) | partial | Lost mid-call |
| GC-10 | Mid (H.K.) | ✗ (skipped) | n/a | ✗ ("follow up") | No re-engage |
| GC-11 | Mid (N.W.) | ✓ (60 s) | ✓ | ✗ ("I'll email") | Re-engaged via Outreach |
| GC-12 | Mid (N.W.) | ✓ (44 s) | ✗ (deflected) | ✓ | Booked w/ low intent |
| GC-13 | Mid (R.A.) | ✓ in ES (38 s) | ✓ in ES | ✓ in ES | Booked (Spanish call) |
| GC-14 | Mid (R.A.) | ✗ (skipped) | ✗ (argued) | ✗ | Hung up at 1:08 |
| GC-15 | Mid (O.B.) | ✓ (51 s) | ✓ | ✓ | Booked |
| GC-16 | Mid (O.B.) | ✓ (40 s) | ✓ | ✓ | Booked |
| GC-17 | Mid (H.K.) | ✗ (15 s pitch launch) | ✗ (defensive) | ✗ | Hung up at 0:22 |
| GC-18 | Mid (N.W.) | ✓ (35 s) | ✓ | ✓ | Booked |
| GC-19 | Bottom (P.B.) | ✗ (12 s pitch launch) | ✗ (argued on fees) | ✗ ("follow up") | Hung up at 0:18 |
| GC-20 | Bottom (P.B.) | ✗ (skipped) | ✗ (argued) | ✗ | Hung up at 0:24 |
| GC-21 | Bottom (P.B.) | partial (asked but generic) | ✗ (defensive) | ✗ ("I'll send pricing") | Lost |
| GC-22 | Bottom (exit interview rep) | ✗ (skipped, all 3 calls in sample) | ✗ (argued on all 3) | ✗ ("follow up" all 3) | All 3 lost |

**Aggregate:**
- Top decile (n=8): M1 8/8 · M2 7/7 (1 n/a) · M3 7/8
- Mid (n=10): M1 7/10 · M2 5/9 · M3 5/10
- Bottom (n=4): M1 0/4 · M2 0/4 · M3 0/4
- Avg call duration top: 8:42 · mid: 4:11 · bottom: 0:31

---

## 12 · ICP buyer specs · 4 archetypes

### 12.1 · Maria · Retail SMB owner

| Field | Value |
|---|---|
| Industry | Multi-location retail (2 stores, growing online) |
| FTE | 35 |
| Revenue | $4M annual |
| Card spend | ~$25K / month across team |
| Tenure as owner | 7 years |
| Top pain | "Who spent what" — last quarter $1 200 charge nobody could explain for 2 weeks |
| Decision criteria | Visibility · per-card limits · receipt capture |
| Top objection | "We already have a corporate Visa from our bank" |
| Ideal opener | "Who's currently approving every expense report, and how long does it take?" |
| Best pitch prop | Prop 4 (receipt capture + accounting sync) |
| Closing move | "What's the best 20 minutes next week to walk you through the SMB version with both your stores in mind?" |

### 12.2 · Tom · Series-B tech founder (Brex-comparison buyer)

| Field | Value |
|---|---|
| Industry | SaaS · pre-revenue scale-up |
| FTE | 22 |
| Card spend | ~€18K / month, heavy on AWS + SaaS subscriptions |
| Stage | Series-B, just raised €15M |
| Top pain | FX on international SaaS · per-employee card issuance speed |
| Decision criteria | Speed to issue · API for engineering · FX rate |
| Top objection | "We already use Brex" |
| Ideal opener | "I see you closed your Series-B last quarter — how are you handling per-employee card issuance for your new hires?" |
| Best pitch prop | Prop 2 (multi-user cards) + Prop 3 (auto-FX) |
| Closing move | "Want me to show you the difference in FX cost vs Brex on your last month's spend? 10 minutes." |

### 12.3 · Emma · Manufacturing operations head

| Field | Value |
|---|---|
| Industry | Industrial manufacturing · regional SMB |
| FTE | 78 |
| Card spend | ~€42K / month, heavy on raw materials + supplier payments |
| Tenure | 4 years in role, reports to MD |
| Top pain | Bookkeeping drudgery — supplier receipts arrive late, accountant re-keys |
| Decision criteria | Accounting sync · spend control across 3 sites |
| Top objection | "Our accountant won't deal with another tool" |
| Ideal opener | "How much time does your bookkeeping team spend re-keying supplier receipts every month?" |
| Best pitch prop | Prop 4 (receipt capture + accounting sync) |
| Closing move | "Let me set up a 10-minute call with your accountant — we'll walk them through the Xero sync and they can ask whatever they want." |

### 12.4 · Lukas · Restaurant group owner (German market)

| Field | Value |
|---|---|
| Industry | Hospitality · 4-location restaurant group |
| FTE | 52 (mostly part-time) |
| Card spend | ~€31K / month, heavy on fresh produce + supplier deliveries |
| Tenure | 12 years |
| Top pain | Expense fraud (had to fire someone last year) + multi-currency on Italian supplier |
| Decision criteria | Per-card limits · real-time alerts · auto-FX |
| Top objection | "I don't trust new fintechs with my money" |
| Ideal opener | "I noticed you opened a fourth location in Hamburg last month — how are you handling spend visibility across the 4 sites?" |
| Best pitch prop | Prop 1 (real-time spend control) + Prop 2 (per-card limits) |
| Closing move | "Funds are held at a regulated tier-1 partner bank — here's the regulator page. Want a 15-min call where you can ask all the trust questions and then decide?" |

---

## 13 · Product facts

### 13.1 · Four value props

| Prop | Name | What it does | Best buyer fit |
|---|---|---|---|
| 1 | Real-time spend control | See every transaction the moment it clears. Freeze a card from your phone in 2 taps. | Owners who got burned by expense fraud |
| 2 | Multi-user cards · per-card limits | Issue a card per employee or per project. Set spending caps. Cancel instantly. | Growing teams; scale-ups; manufacturing |
| 3 | Auto FX at interbank rate | Pay foreign suppliers at the interbank rate. No markup, no spread surprise. | Cross-border SMBs; SaaS-buying scale-ups |
| 4 | Receipt capture + accounting sync | Photo a receipt; auto-matches the transaction; QuickBooks / Xero / Sage pulls it pre-coded. | Bookkeeping-painful operations |

### 13.2 · Pricing structure

- **Free tier:** up to 50 transactions / month, no card issuance fee.
- **Growth tier:** €12 / user / month, unlimited transactions, all 4 props.
- **Business tier:** €25 / user / month, adds SSO, custom approval workflows, dedicated CSM.

### 13.3 · Integration partners

- Accounting: QuickBooks · Xero · Sage Business Cloud
- HR: Personio · BambooHR (for auto-card-issue on new hire)
- SSO: Okta · Azure AD · Google Workspace

### 13.4 · Regulatory positioning

- Funds held at tier-1 EU partner bank (segregated from FinTechCard balance sheet).
- Regulated by [national financial regulator, anonymised].
- Public regulator page + audited annually.
- Uptime: 99.99 % over last 12 months, status page public.

---

## 14 · Current onboarding state · what new SDRs get today

| Week | Current content | Format | Failure mode (per Phase 1 audit) |
|---|---|---|---|
| 1 | Product walkthrough · 4 props · tool stack tour | 6 × 90-min live sessions | Knowledge load with no behavioural anchor |
| 2 | Salesforce + Outreach + Gong tooling · CRM hygiene | Self-paced LMS modules (Articulate) | Tools learned in isolation, not in workflow |
| 3 | "Ride-along" with senior rep · shadow 4 calls | Floor-based | Quality varies wildly by which senior rep you shadow |
| 4 | First solo calls · manager observation (if cadence allows) | On-the-job | Manager cadence variance kicks in here |
| 5–6 | Cohort wrap-up + first pipeline review | Live cohort session | Generic; not anchored on observable behavioural moves |
| Post-6 | Ad-hoc · 1:1 cadence varies by pod | Manager-led | This is where bottom-quartile loses signal |

**Audit verdict:** the current onboarding teaches *product + tool* (correctly). It does **not** teach the three keystone behavioural moves (M1/M2/M3) explicitly. Reps either pick them up via osmosis from top performers (slow, uneven) or never pick them up (churn).

---

## 15 · Dashboard + data schema

### 15.1 · Salesforce custom fields wired to ramp tracking

| Field | Type | Purpose |
|---|---|---|
| `Ramp_Time__c` | Number (days) | Days from hire date to first paid quota attainment |
| `Tenure_Cohort__c` | Picklist | Onboarding cohort ID (e.g. "2026-Q1-W3") |
| `Pod__c` | Picklist | UK-Manchester / UK-London-A / etc. |
| `First_Paid_Quota_Date__c` | Date | When the rep hit their first paid commission |
| `Next_Step_Booked__c` | Checkbox | TRUE if a calendar invite went out same-call |

### 15.2 · HRIS retention rollup

- Source: BambooHR-equivalent.
- Field: `Day_120_Retained` (boolean), computed nightly.
- Slice: by hire cohort + by pod.

### 15.3 · Gong tags + rubric schema

- `tag:diagnostic-opener` — set if M1 detected by Gong NLP.
- `tag:objection-acknowledged` — set if M2 detected.
- `tag:calendar-booked` — set if M3 detected.
- Custom rubric: 3 rows (M1/M2/M3), each scored 1–5, applied by manager during call review.
- Rubric scores live in Gong scorecards and flow to a Salesforce custom object `Call_Review__c`.

### 15.4 · Outreach sequence completion

- Field: `Sequence_Completion_Rate` per rep per week.
- Used as a proxy for grind-on-stale-leads behaviour (high completion + low conversion = SPIF-chasing).

---

## 16 · Tooling configuration

- **LMS: Sana.** SCORM 1.2 supported. xAPI partial (statements supported, full LRS query not yet). Cohort enrollment via API. Single sign-on through Okta.
- **Authoring: Articulate 360** (12 seats, mostly idle). Mario gets a seat for the engagement. Storyline + Rise both available.
- **Preview: SCORM Cloud** account for pre-LMS testing.
- **Gong** viewer license issued by A.S. for engagement duration.
- **Slack:** training-team channel #sdr-onboarding-design (set up week 1).
- **Notion:** shared workspace for raw notes, separate from sponsor-facing artefacts.

---

## 17 · Comp plan + SPIFs (the friction)

- **Base + commission:** €36K base + €18K OTE (variable). Standard EU SDR pattern.
- **SPIF mechanics:** monthly SPIF rewards closed-won regardless of pipeline source. Top SPIF tier = €500/month.
- **The distortion:** new reps in month 2–4 see senior reps closing stale leads chasing SPIF. They emulate the behaviour, work the same stale leads, lose their day-1 fresh list, fall behind on net-new pipeline.
- **Why RevOps owns the fix:** J.V. has the comp-plan redesign on her Q3 roadmap. Surfaced to her by K.M. in week 2 of this engagement.

---

## 18 · Brand voice + tonality

### 18.1 · External (how FinTechCard speaks to buyers)

- Transparent (regulator-aware, names the partner bank).
- Anti-jargon ("spend control" not "expense management orchestration").
- Specific over generic ("you'll see every transaction the moment it clears" not "real-time visibility").
- Concedes weakness when it builds trust ("we explicitly recommend keeping one bank card as backup").

### 18.2 · Internal (how training should sound)

- Peer-to-peer (a senior rep talking to a junior, not a trainer talking to a student).
- No L&D-speak ("learning objectives" stays in the design doc, not in the cohort-facing copy).
- Show the move, then name the move (worked example first, framework after).
- Honest about hard parts ("you will get hung up on. That's not a sign you're failing. Here's what to do next.").

### 18.3 · Visual brand (the part Mario inherits)

- Primary: green (`#00b67a` — close to Mario's Lively green-600). Lean on this in the SCORM module to avoid Salesforce-blue confusion.
- Mono accent for data + numbers (matches the Geist Mono Mario already uses).
- No stock photography. FinTechCard uses iconography + flat illustration only.
- Icon set: Phosphor (open-source). Mario can use it in the SCORM module if he wants iconography.

---

## 19 · Regulatory context (what compliance owns; surface-area for sales)

Sales reps **do not sell against regulation**; they **defer to it as proof of seriousness**. The compliance modules (handled by Cornerstone team, out of this engagement's scope) cover the formal training. What this engagement covers is the **rep's response when a buyer asks a regulatory question**.

| Acronym | What it actually means | Rep's response | Where in cohort |
|---|---|---|---|
| KYC | Know Your Customer · identity verification at signup | "We run KYC at signup. Takes 10 minutes for the owner. We've done it for 12 000+ businesses; the process is smoother than your bank's." | Week 1 product walkthrough |
| AML | Anti-Money Laundering · transaction monitoring | "Every transaction is monitored. You will not see this as a customer unless something gets flagged, which is rare and we walk you through it." | Week 1 |
| SCA | Strong Customer Authentication · 2FA on payments | "Every card transaction over €30 triggers SCA. Your team will see a push to approve. Takes 2 seconds." | Week 1 |
| PSD2 | EU Payment Services Directive · open banking framework | Rarely asked. If asked: "We're PSD2-compliant. The short version: it's the regulation that lets us be additive to your bank, not a replacement." | Reference only |
| GDPR | EU data protection | "Your card data lives in the EU. We don't sell it. We don't share it. Here's our DPA — happy to send it over." | Week 1 |

**Honest carve-out for sales reps:** if a regulatory question goes deeper than the table above, the rep should defer to compliance — never invent answers. The cohort training includes a "when to escalate" decision card.

---

## 20 · Risks (from the engagement brief, restated)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Marketing lead-quality keeps declining; L4 target misses | Medium | High | Surface in Mager analysis; K.M. owns CMO conversation; contract caps training-side responsibility |
| Manager-side adoption uneven (1–2 pods don't run the rubric) | High | Medium | Phase 5 launch comms + week-1-of-cohort calibration; revisit at Phase 5 gate |
| Top-decile articulation gap (M.G. + L.D. can't teach by demonstration) | High | Medium | Mitigated by 4C/ID whole-task framework — the system teaches the moves, not the mentor |
| Cohort cadence (every 4 weeks) leaves no slack for v2 mid-rollout | Medium | Medium | Phase 7 schedules quarterly content-refresh sprints between cohort waves |
| Sponsor turnover (K.M. has been in role 11 months) | Low | High | Every phase summary documents decisions in writing; successor inherits signed paper trail |
| ES pod gets the program in English (translation delayed to v2) | Medium | Medium | Phase 3 sequences ES + DE for v2; v1 EN-only cohorts in UK + DE pods first |

---

## 21 · Done · what the engagement looks like at close

By 15 December 2026 (6 months after first cohort live):
- 4 cohorts shipped (cadence every 4 weeks starting 1 July).
- ~50 SDRs through the program.
- Mean ramp time on the trailing-4-cohort average ≤ 71 days.
- Day-120 retention on the same cohort base ≥ 92 %.
- Manager 1:1 rubric adopted in all 9 pods.
- L3 + L1 telemetry flowing into the dashboard nightly.
- Engagement closed with phase-7 iteration log handed to K.M. for in-house ownership.

---

*Brief v1.0 · written 17 May 2026 by Mario Becerra · all anonymisation initials and synthetic numbers consistent across this document.*
