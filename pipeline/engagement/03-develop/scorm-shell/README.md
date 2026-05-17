# Mini-OS SCORM shell · developer docs

> Vanilla HTML/CSS/JS runtime that the six FinTechCard SDR onboarding modules
> (M1–M6) iframe-inline. Implements custom SCORM 1.2 (per `D-005`), simulates
> the rep's workspace (per `D-007`) and keeps audio off the table (`D-006`).

## 1 · What this is + why

The brief asks for SCORM-compliant modules that feel like the rep's actual desk —
Outreach, Gong, Salesforce, LinkedIn / Companies House, Calendar, a Phone-dialler
and Slack. Rather than seven slideware lessons we built one mini-OS shell that
every module mounts. The shell handles window-management, the SCORM 1.2 API,
telemetry to `cmi.suspend_data`, coach-marks, and a shared event bus.

This means each module's index.html is ~ 100 lines of "open these apps, run this
scenario, mark complete" — no shell concerns leak in.

## 2 · File map

```
scorm-shell/
├── index.html                        # demo / preview page (blank desktop)
├── styles/
│   ├── shell.css                     # tokens, layout, window-manager primitives
│   └── apps.css                      # per-app accent skins
├── js/
│   ├── shell.js                      # MiniOS class + bootModule() + exports
│   ├── scorm-bridge.js               # SCORM 1.2 API wrapper + in-memory mock
│   ├── event-log.js                  # keystone-move telemetry → cmi.suspend_data
│   ├── coach-marks.js                # in-context overlay (Rossett & Schafer 2007)
│   └── apps/
│       ├── registry.js               # app registry + inline Phosphor SVGs
│       ├── outreach.js               # dial-queue + sequence step
│       ├── gong.js                   # transcript viewer with M1/M2/M3 overlay
│       ├── salesforce.js             # account/lead/contact/timeline + custom fields
│       ├── linkedin-ch.js            # LinkedIn + Companies House combined lookup
│       ├── calendar.js               # week-view, two suggested slots, send-invite
│       ├── phone-dialler.js          # dark-theme dialler with silence counter
│       └── slack.js                  # #sdr-pod-uk-manchester with pinned job-aids
├── data/
│   ├── sample-profiles.json          # 4 anonymised ICP archetypes (Maria/Tom/Emma/Lukas)
│   └── sample-gong-transcripts.json  # 3 sample transcripts (GC-01/02/03)
├── event-log-spec.md                 # event-name catalogue + KPI → LO mapping
├── a11y-audit.md                     # WCAG 2.1 AA conformance audit
└── README.md                         # ← you are here
```

## 3 · How a module consumes the shell

A module is one folder with one `index.html`. Inside:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Module 1 · The diagnostic opener</title>
  <link rel="stylesheet" href="../../scorm-shell/styles/shell.css">
  <link rel="stylesheet" href="../../scorm-shell/styles/apps.css">
</head>
<body>
  <a class="skip-link" href="#desktop">Skip to main content</a>
  <div id="mini-os-root">
    <header id="topbar"><span class="ftc-logo">FTC</span>
      <span id="module-title"></span>
      <button id="help-button">Help</button>
    </header>
    <main id="desktop"></main>
    <nav id="taskbar"><ul id="taskbar-list"></ul></nav>
  </div>
  <div id="focus-announcer" class="sr-only" aria-live="polite"></div>

  <script type="module">
    import { bootModule } from "../../scorm-shell/js/shell.js";

    bootModule({
      moduleId: "M1",
      title: "Module 1 · The diagnostic opener",
      appsToLaunch: [
        { id: "linkedin-ch", options: { activeProfileId: "L-001" } },
        { id: "outreach"   },
        { id: "phone-dialler" },
      ],
      onReady({ os, eventLog, coachMarks }) {
        coachMarks.show({
          id: "m1-dial-hint",
          anchor: "[data-action='dial']",
          text: "Before you dial — open Calendar in another tab.",
        });
        eventLog.record("worked_example_completed");
        // …rest of scenario…
      },
      onComplete() {
        document.getElementById("desktop").innerHTML =
          `<div class="desktop-empty-state"><h1>Module complete</h1></div>`;
      },
    });
  </script>
</body>
</html>
```

That's the whole consumer surface.

## 4 · Public API (what `bootModule` returns)

```ts
interface BootApi {
  os:         MiniOS;        // openApp(), closeApp(), listWindows(), cycleFocus()
  scorm:      ScormBridge;   // getValue, setValue, setScore, setStatus, setSuspendData
  eventLog:   EventLog;      // .record(event_name, payload); .snapshot()
  eventBus:   EventTarget;   // CustomEvent transport for inter-app + telemetry
  coachMarks: CoachMarks;    // .show({id, anchor, text}); .dismiss(id); .resetDismiss()
  complete(score?: number): void;
  fail(score: number, max?: number): void;
}
```

## 5 · Event-log fields → outcome IDs

See `event-log-spec.md`. Quick reference:

| LO        | Event name                          |
|-----------|-------------------------------------|
| LO-M1.1/2 | `diagnostic_delivered`              |
| LO-M1.3   | `silence_observed`                  |
| LO-M2.1   | `objection_restated` / `objection_argued` |
| LO-M2.2   | `followup_question_asked`           |
| LO-M3.1   | `phone_dial_attempt` + `calendar_opened` |
| LO-M3.2   | `slots_stated`, `invite_sent`, `next_step_booked_set` |
| LO-M4.1   | `archetype_picked`                  |
| LO-M5.1   | `prop_mapped`                       |
| LO-M6.1   | `reg_question_classified` / `reg_row_picked` |
| LO-M6.2   | `reg_question_escalated`            |

## 6 · How to add a new app (3-step guide)

> Referenced by `06-iterate/handoff-pack.md`.

1. **Create `js/apps/<id>.js`.** Import `{ registerApp, icon }` from `./registry.js`.
   Call `registerApp({ id, name, iconName, defaultSize, mount(ctx) { ... } })`.
   `mount(ctx)` receives `{ container, eventBus, openApp, options }` and returns
   a handle (with optional `update` / `destroy`).
2. **Add a per-app skin** to `styles/apps.css`. Scope every rule under
   `.app--<id>` so it never bleeds into another window.
3. **Eager-import** the new app at the top of `js/shell.js` so `registerApp`'s
   side-effect runs at page load:

   ```js
   import "./apps/<id>.js";
   ```

That's it. The window manager, taskbar, focus model, and event bus pick the
app up for free.

## 7 · Local preview

1. Open `index.html` in a modern browser. The demo launchers in the empty-state
   panel open each app so you can poke them.
2. Append `?debug=1` to the URL to see SCORM API calls + event-log emissions in
   the console (`console.debug` only fires with the flag).

The shell will use an in-memory SCORM mock — no LMS required for local work.
(If your browser blocks `fetch()` on `file://` URLs, serve the folder via a
quick `python -m http.server` from `03-develop/scorm-shell/` and open
`http://localhost:8000/` instead.)

## 8 · SCORM Cloud preview procedure

Each module packages with the shell as sibling folder. Before cohort-1 launch
(per `04-implement/cohort-1-launch-checklist.md` Day -7), the LMS admin runs the
following dry-upload sequence on SCORM Cloud sandbox.

### Per-module checklist

For each of the 6 modules:

1. Run `scripts/package.sh <module-folder>` → produces `<module-id>-v1.zip`
   containing the module folder + a copy of `scorm-shell/` as sibling, with a
   generated/consumed `imsmanifest.xml`.
2. Upload to SCORM Cloud → New course → SCORM 1.2 package.
3. Launch in SCORM Cloud preview player. SCORM Cloud auto-injects `window.API`
   (the LMS-provided SCORM 1.2 object). The shell finds it via `findApi()` and
   writes `cmi.core.lesson_status` + `cmi.suspend_data` per
   `event-log-spec.md`.
4. Verify smoke checks:
   - Module boots without console error (open DevTools first; expected log lines:
     `[scorm] initialize() ok`, `[shell] mini-OS mounted`).
   - Gagné timeline progresses (worked example → completion → solo → quiz visible).
   - `cmi.core.lesson_status` is set to `completed` upon finish.
   - `cmi.core.score.raw` reports a numeric score (≥0 ≤100).
   - `cmi.suspend_data` contains the event-log KPI block.
5. Capture: SCORM Cloud run ID + lesson_status + score + a screenshot of the
   launch.
6. Log results to `04-implement/lms-deployment-runbook.md` §smoke-test (or
   `scorm-shell/preview-runs.md` if a per-package log file is preferred).

### Per-run log (to be populated by LMS admin Day -7)

| Module | Package zip | SCORM Cloud run ID | lesson_status | score | screenshot | Date | Notes |
|---|---|---|---|---|---|---|---|
| M1 | _pending_ | — | — | — | — | — | — |
| M2 | _pending_ | — | — | — | — | — | — |
| M3 | _pending_ | — | — | — | — | — | — |
| M4 | _pending_ | — | — | — | — | — | — |
| M5 | _pending_ | — | — | — | — | — | — |
| M6 | _pending_ | — | — | — | — | — | — |

### Fallback if SCORM Cloud unavailable

Local preview proxy: serve module folder via `python -m http.server` then
launch through a local SCORM RTE shim (the `js/scorm-bridge.js` mock
auto-activates when no parent `API` is found). Capture console KPI dump as
`cmi.suspend_data` proxy.

### Sign-off

Gate criterion #1 (master-plan §3) marks PASS once all 6 rows above show
`lesson_status=completed` + non-null score. Until then: Phase 3 gate is
CONDITIONAL PASS pending live preview-run evidence.

## 9 · Decisions backing this build

- `D-005` — custom SCORM (vs. Articulate/Rise) → enabled the workspace simulation.
- `D-006` — no audio → silence shown via text + visual + aria-live (three cues).
- `D-007` — mini-OS → modules feel like the desk, not slides.
- `D-008` — attribution → academic sources cited in source-comments only;
  the runtime ships zero footer copy.

## 10 · Engineering rules in force

- Vanilla HTML/CSS/JS only · ES modules · ES2022 · no build step.
- No external network at runtime (no fetched fonts, no CDN JS).
- All synthetic data — no PII per brief §7.
- WCAG 2.1 AA — see `a11y-audit.md`.
- JSDoc on every public method.
- `console.debug` gated by `?debug=1`.
