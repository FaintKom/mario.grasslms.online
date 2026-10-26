# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and recruiters at EdTech and L&D companies looking for a Learning Experience / Instructional Designer. They give the site a few minutes and decide whether to invite Mario to an interview. Mario targets relocation to Spain or remote EU work.

## Product Purpose

Static portfolio for Mario Rafael Becerra Dueñas, Learning Experience Designer with 10+ years in EdTech. It proves the whole process (analysis, design, build, evaluation) through programs he shipped and through demos a visitor can open and play in the browser. Success: a hiring manager opens a demo, sees it works and why it was designed that way, and gets in touch.

## Positioning

A designer who also builds: playable scenario simulations, SCORM modules, a mini-OS shell, AI content pipelines and his own LMS (GrassLMS). The demos are working artefacts, not screenshots.

## Operating Context

- Live at https://mario.grasslms.online, served by GitHub Pages straight from `main` (no build step, no CI).
- Visitors land on `index.html` and open demos under `pipeline/`. Simulations are desktop-first (`pipeline/_shared/desktop-only.js`).
- Mini-cases are JSX compiled by `pipeline/mini-cases/build.sh`; everything else is hand-written static HTML/CSS/JS.

## Capabilities and Constraints

- Sections: cases (shipped programs), demos D1-D9, GrassLMS exercise carousel, tools, contact.
- Kids activities (`pipeline/kids-interactives/`, 24 items) come from real production courses used by children; age ranges differ per activity and the catalogue should make each one visible.
- Site copy is English.

## Brand Commitments

- GrassLMS colour palette (`pipeline/kids-interactives/_shared/grasslms.css`: green, sun, clay, lagoon, ink, paper ramps) stays the colour basis for every surface.
- Kids activities and the GrassLMS exercise carousel keep the GrassLMS Lively look of the LMS they come from: fixed and polished, not restyled. The portfolio shell (home, demo indexes, catalogues) gets a new visual world built in GrassLMS colours.

## Evidence on Hand

- Shipped programs: Yandex Practicum, TripleTen (Nebius Group), BEAM Institute, Algonova (current consulting).
- Playable demos in `pipeline/`, CV at `Mario_Becerra_CV.pdf`, design logs in `pipeline/engagement/module-*/design-log.md`.
- Metrics on the home page (10+ years, 50+ courses, 60% content time saved) are the owner's claims; do not add new numbers, testimonials or client logos.

## Product Principles

1. Every demo must be solvable end to end; a broken demo costs more than a missing one.
2. Show the reasoning, not only the artefact: what problem, which design decision, what it costs the learner to get it wrong.
3. A hiring manager should reach a playable demo in one click from the first screen.
4. Kids material is shown as real production work, with the audience age and learning goal stated.
