---
name: Mario Rafael Becerra Dueñas, portfolio
description: A hands-on exhibit hall in GrassLMS colours, where every simulation stands on a coloured plinth beside a plain-spoken placard.
colors:
  paper: "#fbfcf7"
  ink-900: "#0d150d"
  ink-700: "#232b22"
  ink-500: "#485444"
  ink-200: "#c4cdbe"
  ink-50: "#f3f5ef"
  sun-400: "#ffd84d"
  lagoon-600: "#12798f"
  lagoon-800: "#0a4652"
  green-700: "#07683f"
  green-500: "#17915e"
  clay-600: "#c1401d"
  green-900: "#0a3d24"
  green-800: "#054d2f"
  green-300: "#8fd770"
  green-100: "#d4f1c4"
  green-50: "#ecf9e7"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(40px, 5vw, 72px)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 115"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.2vw, 46px)"
    fontWeight: 850
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(22px, 1.8vw, 28px)"
    fontWeight: 850
    lineHeight: 1.08
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title-sm:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 850
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.6
  body-lead:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1
rounded:
  focus: "4px"
  frame: "6px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(48px, 7vw, 96px)"
  plinth: "clamp(18px, 2.4vw, 32px)"
  placard: "clamp(20px, 2.4vw, 32px)"
  gap-sm: "12px"
  gap-md: "20px"
  gap-lg: "32px"
  gap-xl: "40px"
components:
  button-ink:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.sun-400}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
  top-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-900}"
    padding: "12px clamp(16px, 4vw, 56px)"
  floor-plan:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-900}"
    height: "48px"
  floor-plan-here:
    backgroundColor: "{colors.sun-400}"
    textColor: "{colors.ink-900}"
  plinth-lagoon:
    backgroundColor: "{colors.lagoon-600}"
    padding: "{spacing.plinth}"
  placard-featured:
    backgroundColor: "{colors.sun-400}"
    textColor: "{colors.ink-900}"
    padding: "{spacing.placard}"
  placard-exhibit:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-900}"
    padding: "{spacing.placard}"
  room-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.frame}"
    padding: "12px 16px 14px"
  contact-way:
    backgroundColor: "{colors.green-800}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "14px 20px"
  contact-way-hover:
    backgroundColor: "{colors.green-700}"
---

# Design System: Mario Rafael Becerra Dueñas, portfolio

## Overview

**Creative North Star: "The Hands-On Exhibit Hall"**

The portfolio shell is a science-centre floor. Each working simulation is mounted as an exhibit: a live screen set on a saturated plinth, framed by a heavy ink rule, with a placard beside it that explains in two plain paragraphs what you do in it and why it is built that way. The visitor walks the hall top to bottom, and a floor plan pinned to the bottom of the viewport tells them which room they are standing in.

The material is printed signage on paper, not software chrome. Ground is a faintly green paper, text is near-black ink, structure is drawn with 3px ink rules and 6px frame corners. Colour comes in large confident blocks (plinths, the sun placard, the deep-green contact room) rather than as accents sprinkled through text. Headings are wide, heavy Archivo set tight; reading text is Manrope at a comfortable 17px. Facts live in sentences, so the shell carries no labels, tags or captions in small caps.

The shell is one of two visual worlds on the site. Kids activities and the GrassLMS exercise carousel embedded on the home page keep the GrassLMS Lively look of the LMS they come from (`pipeline/kids-interactives/_shared/grasslms.css`); they share the palette but not the shell's form language, and this document does not govern them. Simulations under `pipeline/` have their own product UIs and are also outside it.

**Key Characteristics:**
- Exhibits, not cards: a plinth plus a placard, framed by one 3px ink rule.
- Colour as large flat blocks from the GrassLMS ramps only.
- Wide, heavy display type (Archivo 850, width 112-115%) over a humane Manrope body.
- Ink rules do the structural work; shadows are soft and secondary.
- A fixed floor plan with a sliding sun-yellow "you are here" block.

## Colors

A paper-and-ink ground with a small set of saturated GrassLMS plinth colours, sun yellow as the one bright voice, and a deep-green contact room at the end.

### Primary
- **Sun Placard Yellow** (sun-400): the featured exhibit's placard, the "you are here" block in the floor plan, the label colour on ink buttons, the contact heading on deep green, and text selection. It marks where attention belongs right now.

### Secondary
- **Lagoon Plinth** (lagoon-600): the featured exhibit's plinth and the focus ring colour.
- **Deep Lagoon Plinth** (lagoon-800), **Workshop Green Plinth** (green-700), **Leaf Plinth** (green-500), **Clay Plinth** (clay-600): exhibit plinths. Each exhibit owns one plinth colour, and the same colour repeats as the 5px top stripe of its floor-plan item and, on landings, as the 6px top rule of a module entry.
- **Clay** (clay-600) doubles as the link-hover underline colour in the top bar and module lists.

### Tertiary
- **Contact Room Green** (green-800): the contact section ground, the one inverted room in the hall.
- **Footer Green** (green-900): the footer band below it.
- **Spring Rule Green** (green-300): rules and pill outlines inside the contact room.
- **Pale Shoot Green** (green-100): secondary text on the green rooms.
- **Mint Wash** (green-50): a tinted section band on long-form landings.

### Neutral
- **Gallery Paper** (paper): page ground, top bar, floor plan, exhibit placards and room cards.
- **Gallery Ink** (ink-900): all primary text, every structural rule, button fill, the ink plinth.
- **Soft Ink** (ink-700): card and tool descriptions under a heading.
- **Muted Ink** (ink-500): secondary intro lines and asides; never body copy.
- **Hairline Grey-Green** (ink-200): 1px dividers between list rows and floor-plan items, scrollbar thumb.
- **Wash Grey-Green** (ink-50): a neutral tinted section band on long-form landings.

### Named Rules
**The GrassLMS-Only Rule.** Every colour on a shell surface comes from the GrassLMS ramps in `assets/shell.css`. A new hex needs a ramp step first.

**The One Plinth, One Colour Rule.** An exhibit's plinth colour is its identity across the page: the same token on the plinth, its floor-plan stripe and any rule that points to it.

## Typography

**Display Font:** Archivo (with system-ui, sans-serif), loaded with the width axis, set at 112% width by default
**Body Font:** Manrope (with system-ui, sans-serif)

**Character:** Archivo at weight 850 and stretched wide reads like exhibit signage cut from vinyl; Manrope at 500 keeps two-paragraph placards easy to read at length.

### Hierarchy
- **Display** (Archivo 850, clamp(40px, 5vw, 72px), 1.02, width 115%): the contact heading only, in sun on deep green.
- **Headline** (Archivo 850, clamp(30px, 3.2vw, 46px), 1.02): section headings. The home h1 sits in the same voice at clamp(32px, 3.4vw, 50px); long-form landing titles go up to clamp(32px, 4.2vw, 56px).
- **Title** (Archivo 850, clamp(22px, 1.8vw, 28px), 1.08): the featured placard heading; secondary exhibit placards step down to clamp(20px, 1.7vw, 26px). Client names use 26px.
- **Title small** (Archivo 850, 18-22px, 1.15): room cards (18px), records (20px, width 105%), contact offers (22px, width 105%).
- **Body** (Manrope 500, 17px, 1.6; 16px under 760px): running text. Placard and record paragraphs use 16px/1.55; intros and section leads use 18px. Measures are held at 48-66ch.
- **Label** (Manrope 700-800, 14-16px, line-height 1): buttons (800, 15px), top-bar links (700, 16px), floor-plan items (700, 14px), tool names (800, 18px, letter-spacing 0). Sentence case always.

### Named Rules
**The Facts-In-Sentences Rule.** No uppercase micro-captions, mono labels or eyebrows above headings on shell surfaces. A heading names the thing plainly and the paragraph under it carries the facts.

**The Two-Family Rule.** Archivo for headings, Manrope for everything else. Tool names and table headers are Manrope 800, not Archivo.

## Layout

Full-bleed sections with a fluid side gutter (clamp(16px, 4vw, 56px)) and fluid vertical padding (clamp(48px, 7vw, 96px)). There is no centred max-width container on the home page; long-form landings centre their content in one 1180px column.

Section openers are a two-column "wall": heading left, lead paragraph right, bottom-aligned (equal columns, gap 32-40px). Exhibits are a two-column grid, plinth wide (1.7-1.9fr) and placard narrow (1fr, min 300px on the featured one); alternate exhibits flip sides. Room cards run three across with a 20px gap; records and tools use auto-fit columns (min 280-320px). Below 1100px every two-column layout stacks to one column and the placard's divider moves from its side to its top; below 760px body text drops to 16px and the live iframe in the featured screen gives way to its still preview.

The top bar is sticky (scroll padding 72px). On the home page a 48px floor plan is fixed to the bottom of the viewport and the body reserves 56px for it; landings without a floor plan remove that padding.

## Elevation & Depth

Depth is drawn, not lit. Structure comes from 3px ink rules and saturated colour blocks; shadows are a soft supporting cast under framed objects and never carry structure. They are long, low, negative-spread drop shadows tinted with ink, so frames feel set on the wall rather than floating.

### Shadow Vocabulary
- **Exhibit hang** (`box-shadow: 0 18px 40px -24px rgba(13,21,13,.45)`; -26px spread on secondary exhibits and the play card): under featured and secondary exhibit frames.
- **Screen inset** (`box-shadow: 0 10px 24px -12px rgba(0,0,0,.6)`): under the screen sitting on a plinth.
- **Floor-plan stripe** (`box-shadow: inset 0 5px 0 var(--c)`): a 5px top band in the exhibit's plinth colour on each floor-plan item; a colour marker, not elevation.

### Named Rules
**The Drawn-Not-Lit Rule.** If removing a shadow makes a layout ambiguous, the layout is missing a rule. Hard offset shadows belong to the GrassLMS Lively world, not the shell.

## Shapes

Rectangles with barely softened corners (6px) on every framed object: exhibits, screens, room cards, tables, the play card. Interactive pills are fully round (999px): ink buttons and the contact ways. Borders come in three weights with fixed jobs: 3px ink for structure (exhibit frames, top bar, floor plan, section dividers, placard dividers), 2px ink for lighter frames (room cards, buttons, client and bench dividers, table wraps), 1px ink-200 for list and floor-plan separators.

## Components

### Buttons
Confident ink pills with a sun label, one per placard.
- **Shape:** fully round pill (999px), 2px ink border.
- **Ink:** ink-900 fill, sun-400 text, Manrope 800 15px, padding 12px 18px, an optional 1em inline SVG arrow after the label. On the long-form landing's play card it grows to 17px with 14px 22px padding, and goes full width on phones.
- **Hover / Focus:** lifts 2px over 0.2s on the expo-out ease; focus is the global 3px lagoon-600 outline offset 3px.
- **Secondary action:** a plain bold underlined text link beside the pill, never a second pill style.

### Cards / Containers
- **Exhibit:** a 3px ink frame, 6px corners, clipped, holding a plinth (saturated block, padding clamp(18px, 2.4vw, 32px)) with a 16:10 screen on it, and a placard divided from the plinth by a 3px ink rule. The featured placard is sun-400; the rest are paper.
- **Placard:** heading, the action row, then two paragraphs (what you do; why it is built that way), gap 14px.
- **Room card:** paper, 2px ink border, 6px corners, a 16:10 image over an 18px title and one 15px ink-700 sentence; lifts 3px on hover over 0.25s.
- **Play card (long-form landings):** a sun-400 panel with the 3px ink frame and the exhibit hang shadow, holding one sentence and the ink button.

### Navigation
- **Top bar:** sticky paper bar with a 3px ink bottom rule; the full name left in Archivo 850 20px (16px under 520px); plain underlined links right in Manrope 700 16px, 2px underline that turns clay on hover.
- **Floor plan (signature):** fixed 48px paper strip with a 3px ink top rule along the bottom of the viewport. Items are Manrope 700 14px, separated by 1px ink-200 lines, each exhibit item carrying a 5px stripe in its plinth colour. A sun-400 block slides under the item for the room in view (0.5s expo-out on transform and width) and every item jumps to its room. It scrolls sideways on narrow screens with the scrollbar hidden.

### Contact Room
The one inverted section: green-800 ground, paper text, the display heading in sun-400, three offers over a 2px green-300 rule, and contact ways as pill links with a 2px green-300 outline that fill green-700 on hover.

### Tables (long-form landings)
Wrapped in a 2px ink frame with 6px corners; header row ink-900 with paper Manrope 800 15px; rows divided by 1px ink-200; the first column set in Archivo 800 at 105% width. Under 760px each row becomes a stacked block with its column names inline.

## Do's and Don'ts

### Do:
- **Do** present every playable piece as an exhibit: plinth plus placard inside one 3px ink frame with 6px corners.
- **Do** give each exhibit one plinth colour from lagoon-600, lagoon-800, green-700, green-500, clay-600, ink-900 or sun-400, and repeat it on its floor-plan stripe.
- **Do** keep sun-400 for the one place attention belongs: the featured placard, the "you are here" block, button labels, the contact heading.
- **Do** set headings in Archivo 850 at 112% width with -0.02em tracking and body in Manrope 500.
- **Do** use the expo-out ease (cubic-bezier(.16,1,.3,1)) for lifts and the floor-plan slide, and drop all transitions under prefers-reduced-motion.

### Don't:
- **Don't** add eyebrows, kickers, mono labels, chips or uppercase micro-captions to shell surfaces.
- **Don't** use colours outside the GrassLMS ramps.
- **Don't** restyle kids activities or the embedded GrassLMS exercise carousel in shell form, and don't import their Lively details (hard offset shadows, mono captions, 14-24px radii) into the shell.
- **Don't** make structure depend on shadows; use an ink rule.
- **Don't** add a second button style; a secondary action is an underlined text link.
