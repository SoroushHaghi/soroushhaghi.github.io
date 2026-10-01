# Portfolio Redesign — Architecture & Release Plan

Status: ACTIVE DEVELOPMENT
Branch: `redesign-2026-10`
Production branch: `main`

## Release boundary

- The current public site on `main` remains live until the redesign is explicitly approved.
- All redesign work happens on `redesign-2026-10`.
- No redesign deployment or merge to `main` occurs without explicit approval.
- The public URL remains `https://soroushhaghi.github.io`.
- The final redesign replaces the current visual/content implementation while preserving the stable URL and `/cv` route.

## Public-site structure

1. Hero
2. Organization / trust strip
3. Focus
4. Selected Work
5. Experience / Trajectory
6. Education / Master Focus
7. About / Honors / Certificates
8. Contact / CV

Design principles:
- recruiter-first clarity;
- one tangible quantum signature (interactive Bloch-sphere / qubit-state visual);
- restrained dark/light glass material language;
- spectral cobalt as the primary brand accent;
- violet only as a quantum/optical semantic accent;
- evidence-first project presentation;
- maintainable reusable sections and cards;
- 3D is an enhancement, never a dependency for critical content.

## Identity assets

- Primary mark: minimal `SH` monogram.
- Browser icon / favicon: dedicated `SH` favicon asset, replacing the template favicon.
- Organization logos may be used as compact trust/context signals only where the relationship is evidence-backed and correctly labelled.
- Do not imply employment, affiliation, education, or partnership beyond the supported relationship.

## Content architecture

The redesign must separate content from components.

Planned structured content owners:
- site/profile copy;
- focus areas;
- projects/case studies;
- experience;
- education;
- organizations/logos;
- honors/certificates;
- links/contact;
- theme/settings.

Every reorderable item should have a stable ID and explicit sort/order field.
Every public item should support draft/published state.
Projects should support image/media, evidence type, tags, links, featured state and order.

## Private content dashboard requirement

The public portfolio must not depend on manual source-code edits for routine updates.

Required dashboard capabilities:
- add/edit/archive projects;
- upload/replace project images;
- reorder projects and sections;
- edit profile/hero copy;
- edit focus items;
- edit experience and education;
- manage organization logos/context labels;
- edit links/contact/CV metadata;
- toggle featured/draft/published;
- preview changes before publishing.

### Security boundary

- Do not ship GitHub tokens, OAuth secrets or Career OS private data in the public browser bundle.
- The existing public `/dashboard` placeholder is not a secure admin system and is not the redesign solution.
- Public portfolio data may remain in the public website repository because it is already intended for publication.
- Editing access must require authenticated repository write permission.

### Chosen implementation direction

Use a Git-backed CMS/admin layer over structured portfolio content.

Preferred production path:
- Decap CMS-style content editor;
- GitHub repository as content storage;
- authenticated GitHub write access;
- no admin link in public navigation;
- hosted OAuth/auth proxy (Decap Turbo or equivalent) so no secret is shipped client-side;
- optional later hardening behind a separately protected admin hostname if complete invisibility of the login surface is desired.

The CMS should edit structured content and media; the React site renders the same files.

For the urgent application-ready release, build the public redesign first around the same structured content model. CMS authentication can be connected immediately after the public content/layout is stable without requiring another redesign.

## Merge gate

Merge to `main` only after:
- content accuracy review;
- current approved CV is served at `/cv`;
- favicon / metadata / social links are updated;
- responsive/mobile QA;
- keyboard and contrast QA;
- reduced-motion fallback;
- 3D fallback;
- links tested;
- no unsupported project/academic claims;
- production build passes.

