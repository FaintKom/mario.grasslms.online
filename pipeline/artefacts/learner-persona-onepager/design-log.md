# Design log — Learner Persona One-Pager

> A one-page template for capturing a single learner segment. JTBD-anchored so the persona drives design decisions; behavioural scenarios so the designer can stress-test the program against three real moments in the persona's week; named anti-patterns so the team commits to what it will *not* design for this segment.

---

## 1 · Analyse

**Audience.** A learning designer or designer-led team in week one of an engagement, post-kickoff, pre-architecture. They have stakeholder + SME notes and need a single artefact to pin to the wall so every later design decision can be checked against "would this persona actually use it?"

**Performance context.** ~20 minutes to fill in after a single SME call + a 1-hour observation pass (or 20 Gong call review). The output gets printed and pinned over the designer's monitor. If they can't fill it in 20 minutes, the SME call was too thin.

**Constraints.** One page per segment. If the program has 3 personas, that's 3 sheets. Resist the urge to make a "composite" persona — it always ends up describing nobody.

**Prior-art scan.** Most persona templates in circulation come from UX-design / product-management lineage (Cooper's *About Face*, 2007; Pruitt + Adlin, 2006). Those work for product but lack the **anti-pattern** column that learning design needs — UX personas optimise for inclusion, learning personas need to optimise for ruthless exclusion of what won't work for *this* learner.

---

## 2 · Design

### 2a · JTBD over demographics

Clayton Christensen + Bob Moesta's **Jobs-to-be-Done** lens (Christensen et al., *Competing Against Luck*, 2016; Klement's *When Coffee and Kale Compete*, 2016) is the load-bearing structure. Three job types — functional, emotional, social — capture *why* the persona shows up, not just *who* they are. The JTBD block is the second visible section on the page, before pain / gain. Demographics live in a thin "Snapshot" block; they exist to disambiguate, not to design from.

### 2b · Scenarios over personas-in-prose

Three named scenarios — **happy / pressure / stuck** — replace the typical paragraph-long persona narrative. They force the designer to predict three real moments in the persona's week where the program either lands or doesn't. The stuck scenario is the most useful: it surfaces the gap the program is being hired to close.

### 2c · Anti-patterns block

The single most important section of the template. Three named things we will *not* design for this persona, with the reason. This is what separates a usable persona from a vanity persona.

The block is coral-bordered on purpose — visually distinct so reviewers cannot skip it. A persona without anti-patterns is a persona that gives the team permission to build everything, which is the same as building nothing.

### 2d · Sources block at the bottom, not the top

Putting sources at the bottom is a deliberate inversion of academic-style writing. The designer is reading the persona quickly and needs the actionable content first. But the sources row is **mandatory** — if the SME interview count is 0 and the call-recording count is 0, the persona is fiction and the designer needs to push back on the engagement before going further.

### 2e · Modern LXD methods named

- **Christensen / Klement JTBD** — §02 job statement structure.
- **Cooper personas + Pruitt-Adlin** — §01 snapshot block (used as influence, not the spine).
- **Anti-pattern naming** — agency / product-design discipline (e.g. Norman *The Design of Everyday Things*, error-prevention principle). Lifted into learning persona work because most ID-side templates lack it.

---

## 3 · Develop

- **Decision: visible `fillme` placeholders with example copy.** Rather than blank fields, every field shows a realistic worked example (B2B SDR persona). The designer overwrites; placeholder style (italic, faint background) makes it visually obvious what's still unfilled.
- **Decision: 2-up section grid for parallel content.** Snapshot ⟷ JTBD, Pains ⟷ Gains. Print-friendly + screen-friendly.
- **Decision: scenario blocks, not bullet lists.** Forces the designer to write 2–3 sentences per scenario, not a one-liner. The narrative is the design tool.
- **Decision: standalone with the needs-assessment-template base CSS.** Reuses Lively tokens + section structure; small persona-specific overlay block for avatar, JTBD list, scenario cards, anti-pattern banner.

---

## 4 · Implement

- Single-page printable HTML (folds to a 2-page A4 spread).
- Standalone — no LMS, no JS interactions beyond `window.print()`.
- Cross-links to the Needs Assessment template + Stakeholder Interview Script in the design-log narrative, since the persona is the third leg of the Phase-1 Discover tripod (assessment + script + persona).

---

## 5 · Evaluate — metric plan

| Level | Target | Instrument |
|---|---|---|
| **L1 — Reaction** (designer) | Persona fills in ≤20 min from a single SME call | Self-report after first 5 uses |
| **L2 — Learning** (designer) | Designer can list this persona's 3 anti-patterns from memory by week 2 | Architecture-review check |
| **L3 — Behaviour** (team) | Design decisions in build phase reference the persona by name in ≥60 % of design-doc comments | Doc-comment audit; design-review meeting transcript scan |
| **L4 — Results** (program) | Programs with anti-pattern-block personas show ≥20 % higher L3 behaviour-adoption rate vs. baseline | Compare cohort post-program behavioural rubric scores |

---

## 6 · Reflect

**What worked**
- The anti-pattern block is the part teams talk about in design review. The named exclusions ("no long-form async video for this persona") give the designer ammunition to defend against scope creep.
- JTBD-first ordering surfaces the *emotional* job (e.g. "feel like a credible peer in 30 seconds") which always changes the tone of microcopy.

**What I would change next iteration**
- A linked artefact: a **persona-decision worksheet** the designer fills weekly to check whether the last 5 design choices passed the persona-fit test.
- A **persona-pair diff view** — when there are 2+ segments, surface the deltas between them so the designer can see whether the differences justify separate tracks or whether one program serves both.
- A **manager-side persona** for sales / customer-facing roles — the rep persona alone misses the 70-20-10 manager-1:1 layer. Pair-shipping rep + manager personas would make L3 behaviour design more honest.

---

## QC scoreline

```
QC: F=5 JD=5 P=5 S=5 V=4 D=5 | Composite 4.8/5 SHIP
Closes Phase 1 (Discover) artefact gap: one-page learner persona with JTBD + scenarios + anti-patterns + named sources
```
