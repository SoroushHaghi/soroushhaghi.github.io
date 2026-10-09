# Soroush Haghi — Personal Portfolio

**Computer Engineering · Software & AI · Quantum Technologies**

[**Live portfolio**](https://soroushhaghi.github.io/) · [**Work**](https://soroushhaghi.github.io/work/) · [**Education**](https://soroushhaghi.github.io/education/) · [**Current CV**](https://soroushhaghi.github.io/cv/)

This repository contains the public source for my personal engineering portfolio. The site presents selected technical projects, relevant experience, university work, and links to inspectable project evidence.

## Selected work

- [Career OS](https://github.com/SoroushHaghi/career-os) — public framework and reusable code for AI context and evidence-to-knowledge workflows.
- [Activity Recognition](https://github.com/SoroushHaghi/Activity_Recognition) — sensor-based ML comparison and CI configuration.
- [Gas Detection](https://github.com/SoroushHaghi/gas-detection) — sensor-feature classification and dashboard.
- [MRI Tumor Detection](https://github.com/SoroushHaghi/MRI-tumor-detection) — segmentation inference application.
- [Bachelor Engineering Projects](https://soroushhaghi.github.io/bachelor-engineering-projects/) — curated computer vision, signal processing and embedded-systems coursework.

Project descriptions are deliberately evidence-bounded; the site distinguishes academic work and prototypes from validated professional deployment.

## Architecture

- **Frontend:** React 18, TypeScript, SCSS, Material UI and custom components.
- **Content:** structured portfolio records in `src/portfolioContent.ts`; interface copy in `src/content/siteCopy.json`.
- **Assets:** brand/favicon and public media under `public/`; application code under `src/`.
- **Semantic output:** `scripts/generate-semantic-content.js` runs after the production build.
- **Hosting:** GitHub Pages, with GitHub Actions publishing the `main` branch build to `gh-pages`. A separate redesign-preview subtree is retained by the deploy workflow.
- **CV route:** `/cv/` points to the latest *published, approved* PDF copy. The canonical editable CV and source evidence are maintained privately; this repository is the public presentation layer, not the candidate-truth store.

## Local development

Requires Node.js 20 or later.

```bash
npm ci
npm start
```

Production build:

```bash
npm run build
```

The production workflow is in `.github/workflows/deploy-production.yml`. Changes to `main` trigger its GitHub Actions deployment; avoid manual edits of the generated `gh-pages` output. Generated semantic pages are refreshed during the build.

## Brand and publication hygiene

Use the **SH / Soroush Haghi** identity on all public pages. Keep the SVG favicon in `public/favicon.svg`, and ensure standalone HTML routes also declare it explicitly. Prefer updating approved structured content over inserting unsupported claims or resurrecting legacy template assets.

---

© Soroush Haghi. The implementation may include open-source dependencies and adapted design foundations; third-party licensing remains applicable.
