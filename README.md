# mario.grasslms.online

Static portfolio site, live at <https://mario.grasslms.online>. GitHub Pages serves this repository as is (custom domain in `CNAME`), so a change goes live a minute or two after it lands on `main`. There is no Actions workflow.

## Local preview

```sh
python -m http.server 8000
```

Then open http://localhost:8000.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home page: cases, demos, GrassLMS exercise carousel, tools, contact. Styles and scripts are inline |
| `assets/`, `previews/` | Demo card screenshots and the link preview image |
| `favicon.svg`, `icon.svg`, `og.png` | Tab icons and the older link preview |
| `Mario_Becerra_CV.pdf` | CV linked from the hero and the contact block |
| `pipeline/engagement/` | SDR onboarding: the mini-OS shell and six SCORM modules |
| `pipeline/mini-cases/` | Three SCORM mini-cases with their own index page |
| `pipeline/fintech-fraud-triage/`, `vishing-call/`, `incident-response/`, `typing/` | Standalone scenario demos |
| `pipeline/artefacts/compliance-microlearning/` | Compliance micro-course design map and playable Unit 1 |
| `pipeline/kids-interactives/` | Catalogue of twenty activities for children |
| `pipeline/_shared/` | Desktop-only notice for the simulations and the vendored React 18 production build |

## Mini-cases build

The three cases are written in JSX (`pipeline/mini-cases/case-*-app.jsx`). The pages load the compiled `case-*-app.js` next to them, with React and ReactDOM from `pipeline/_shared/vendor/`, so nothing is compiled in the browser and no CDN is needed. After editing a `.jsx` file, rebuild with Node installed:

```sh
sh pipeline/mini-cases/build.sh
```

Commit the `.jsx` source and the rebuilt `.js` together.

## Notes

- DNS: `mario.grasslms.online` is a CNAME to `faintkom.github.io`.
