# Quality Rubric — Course Design Pipeline Page + Artefacts

Single source of truth for what "good enough to ship" means on this build.
Every artefact passes through this rubric **before** it goes into the page or gets linked.

---

## Sources of truth (read-only canonical)

| Source | Path | What it canonizes |
|---|---|---|
| Resume EN | `resume_en.md` | Every numeric / role / company claim |
| Portfolio data | `portfolio/index.html` (window.PROJECTS) | Every project name, stack, status, metric |
| Pipeline mapping | `portfolio/pipeline/CONTENT.md` | Phase → artefact assignment |
| target Sales Enablement role JD | (inline below + saved during application) | Must-haves / nice-to-haves to satisfy |

**Anything not traceable to a source above = fabrication = block.**

---

## Citation rules (memory-enforced)

- **Cite by company name only:** Yandex Practicum (Jan 2023) and later. Allowed: Yandex Practicum, TripleTen (Nebius Group), Beezo, BEAM Institute of Technology, Algonova, GrassLMS (own).
- **Do NOT name:** SIT Programming School, Foxford, Moscow Programming School, AEFE, Algorithmics, Lego Education Academy, RobolabKids.
- **NDA-blocked:** any client project explicitly under NDA — never reference even generically.
- **Algonova work cite-able:** computer literacy course, presentation generator, Miro / Figma board creators, LMS seeder, video-lesson analysis pipeline. NDA-protected sub-projects within Algonova are out of scope.

---

## target Sales Enablement role JD must-haves (gating checklist for total coverage)

After all artefacts ship, each box must be ticked by ≥1 artefact:

- [ ] 3+ years Instructional Designer in fast-paced B2B / tech
- [ ] Designing e-learning, facilitator guides, participant workbooks, job aids
- [ ] Adult learning principles + ID methodologies in remote-first orgs
- [ ] Articulate Storyline / Rise 360 / Captivate / Vyond proficiency demonstrated
- [ ] ADDIE / SAM application visible
- [ ] Excellent written communication (entire page is the proof)
- [ ] Portfolio link → that link IS this pipeline page
- [ ] Independent + collaborative work in dynamic environment
- [ ] Project management of multiple simultaneous projects
- [ ] Stakeholder communication + needs assessment
- [ ] Assessment + evaluation strategies (Kirkpatrick L1–L4)
- [ ] Full lifecycle of training content (concept → develop → revise → retire)
- [ ] LMS admin familiarity (GrassLMS = own LMS = strongest possible proof)
- [ ] AI in instructional design (own Algonova pipelines = strongest possible proof)

Nice-to-have coverage:
- [ ] Sales enablement / sales process understanding (cover via Phase 4 artefact framing)
- [ ] Fintech / B2B SaaS context (cover via "FinTech B2B Card Onboarding" generic demo)
- [ ] ID / education / communication degree — skip (no, but Coursera LXD certs in resume = proxy)

---

## Per-artefact rubric (6 dimensions, 1–5 each)

| # | Dimension | Gate | Target |
|---|---|---|---|
| 1 | **Factual accuracy** | every claim traceable | 5/5 required |
| 2 | **JD fit** | maps to ≥1 must-have OR nice-to-have | ≥4/5 |
| 3 | **Pedagogical correctness** | frameworks named + attributed correctly | 5/5 required |
| 4 | **Self-evident from artefact** | reader gets purpose without my narration | ≥4/5 |
| 5 | **Visual quality** | DS-only tokens, hierarchy, responsive | ≥4/5 |
| 6 | **Information density** | no filler, bounded length per element | ≥4/5 |

**Ship gate:** dims 1 + 3 = 5/5 mandatory. Dims 2 / 4 / 5 / 6 ≥ 4/5. Composite avg ≥ 4.3/5.

---

## Per-item loop

For every artefact (B1 framework card, C1 SCORM module, C2 facilitator guide, etc.):

```
1. DRAFT — write per CONTENT.md mapping
2. FACT-CHECK — line-by-line against resume_en.md + portfolio/index.html
   - Strike anything not traceable
   - Flag any number, any company, any framework attribution
3. JD FIT-CHECK — name the JD requirement(s) this artefact closes
4. PEDAGOGY CHECK — confirm framework names + primary author + when-to-use
5. SCORE 6 dimensions
6. GATE:
   - Pass → commit to file, mark coverage box
   - Fail → revise → re-loop (max 3 iterations, then escalate)
```

I write the score line at the top of every artefact file:

```
QC: F=5 JD=4 P=5 S=4 V=- D=4 | Closes JD: [facilitator guide, ADDIE]
```

(V scored only after rendering on page.)

---

## Pedagogical-correctness reference (lock framework attribution before B1)

| Framework | Primary attribution | Primary "when to use" |
|---|---|---|
| ADDIE | US Army / Florida State Univ. (1975) | Linear compliance / scale / regulated content |
| SAM (Successive Approximation) | Michael Allen (2012) | Rapid iteration / prototyping / agile contexts |
| 4C/ID (Four-Component ID) | Jeroen van Merriënboer | Complex cognitive whole-task skills |
| Backward Design | Wiggins & McTighe ("Understanding by Design", 1998) | Start from desired learner outcomes, design backwards |
| Bloom's Taxonomy (revised) | Anderson & Krathwohl (2001) | Verb-level outcome calibration |
| Action Mapping | Cathy Moore (2008+) | Performance-first, strip non-essential content |
| Merrill First Principles | M. David Merrill (2002) | Problem-centred: activation → demonstration → application → integration |
| Mayer Multimedia Principles | Richard Mayer | Slide / e-learning visual + narration design |
| Knowles Andragogy | Malcolm Knowles | Adult learner motivation + self-direction |
| Kirkpatrick 4 Levels | Donald Kirkpatrick (1959; New World 2016) | Evaluation: reaction, learning, behaviour, results |
| 5 Moments of Need | Bob Mosher + Conrad Gottfredson | Performance support, job aids, in-flow learning |
| Worked-example fading | Sweller / Renkl (cognitive load theory) | Procedural skill acquisition, reduce extraneous load |
| Microlearning | general practice, no single attribution | Spaced, single-objective bursts |
| Sales Enablement model | Forrester / SiriusDecisions | Sales rep onboarding + ongoing competency |

---

## File-level checklist before deploy (E2)

- [ ] All artefacts in `portfolio/pipeline/` carry `QC: …` header line
- [ ] Total target Sales Enablement role JD coverage = 100 % must-haves
- [ ] No untraceable claim survives in any artefact
- [ ] No restricted company name appears
- [ ] No NDA project referenced
- [ ] Lighthouse on `mario.grasslms.online/pipeline/` ≥ 90/95/95/90
- [ ] HTTPS valid (no cert errors)
- [ ] All internal links resolve (no 404)
- [ ] PDF / SCORM artefacts open from page modal
- [ ] Cross-link from main portfolio added
