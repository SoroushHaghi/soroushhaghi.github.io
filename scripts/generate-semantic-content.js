/* Build-time semantic export generated from the same canonical data used by the React site.
   It creates no separate manually-maintained bot copy. */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const buildDir = path.join(root, "build");

function loadTs(relativePath) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: filename,
  }).outputText;

  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(output, filename);
  return mod.exports;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanTitle(value) {
  return String(value || "").replaceAll("|", " ");
}

const copy = JSON.parse(fs.readFileSync(path.join(root, "src/content/siteCopy.json"), "utf8"));
const portfolio = loadTs("src/portfolioContent.ts");
const expertise = loadTs("src/expertise/expertiseData.ts");
const siteConfig = loadTs("src/siteConfig.ts");

const semantic = {
  identity: copy.identity,
  navigation: copy.nav,
  home: copy.home,
  careerState: {
    ...copy.careerState,
    stages: copy.careerState.stages.map((stage) => ({
      ...stage,
      title: cleanTitle(stage.title),
    })),
    capabilities: expertise.expertiseCapabilities.map((item) => ({
      id: item.id,
      name: item.name,
      mode: item.mode,
      hardwareSoftware: item.x,
      classicalQuantum: item.y,
      knowledge: item.K,
      experience: item.E,
    })),
  },
  work: {
    page: copy.workPage,
    items: portfolio.workTimeline,
  },
  education: {
    page: copy.educationPage,
    degrees: siteConfig.education,
    academicWork: portfolio.academicWork,
    trainingAndCredentials: portfolio.trainingAndCredentials,
    masterCourseAreas: portfolio.masterCourseAreas,
  },
  affiliations: siteConfig.organizationMarks.map((item) => ({
    id: item.id,
    name: item.name,
    url: item.url,
  })),
  footer: copy.footer,
};

function capabilityList() {
  return semantic.careerState.capabilities
    .map((item) => `<li><strong>${esc(item.name)}</strong> — ${esc(item.mode)}</li>`)
    .join("");
}

function homeHtml() {
  const stages = semantic.careerState.stages
    .filter((stage) => stage.eyebrow || stage.title || stage.copy)
    .map((stage) => `<li><strong>${esc(stage.eyebrow)}</strong> ${esc(stage.title)}${stage.copy ? ` — ${esc(stage.copy)}` : ""}</li>`)
    .join("");

  const degrees = semantic.education.degrees
    .map((item) => `<article><h3>${esc(item.degree)}</h3><p>${esc(item.institution)} · ${esc(item.period)}</p><ul>${(item.focus || []).map((focus) => `<li>${esc(focus)}</li>`).join("")}</ul></article>`)
    .join("");

  const featured = siteConfig.workItems
    .filter((item) => item.featured)
    .slice(0, 3)
    .map((item) => `<article><h3>${esc(item.title)}</h3><p>${esc(item.subtitle)}</p></article>`)
    .join("");

  return `
    <main>
      <section>
        <p>${esc(copy.home.hero.eyebrow)}</p>
        <h1>${esc(copy.identity.fullName)}</h1>
      </section>
      <section>
        <h2>${esc(copy.careerState.semanticHeading)}</h2>
        <p>${esc(copy.careerState.semanticIntro)}</p>
        <ol>${stages}</ol>
        <p>Axes: ${esc(copy.careerState.axes.hardware)} ↔ ${esc(copy.careerState.axes.software)}; ${esc(copy.careerState.axes.classical)} ↔ ${esc(copy.careerState.axes.quantum)}; ${esc(copy.careerState.axes.experience)} ↔ ${esc(copy.careerState.axes.knowledge)}.</p>
        <p>Final states: QH — ${esc(copy.careerState.basisNames.QH)}; QS — ${esc(copy.careerState.basisNames.QS)}; CH — ${esc(copy.careerState.basisNames.CH)}; CS — ${esc(copy.careerState.basisNames.CS)}.</p>
        <h3>Capability and evidence nodes</h3>
        <ul>${capabilityList()}</ul>
      </section>
      <section>
        <p>${esc(copy.home.education.eyebrow)}</p>
        <h2>${esc(copy.home.education.title)}</h2>
        <p>${esc(copy.home.education.copy)}</p>
        ${degrees}
      </section>
      <section>
        <p>${esc(copy.home.expertise.eyebrow)}</p>
        <h2>${esc(copy.home.expertise.title)}</h2>
        <p>${esc(copy.home.expertise.copy)}</p>
      </section>
      <section>
        <p>${esc(copy.home.work.eyebrow)}</p>
        <h2>${esc(copy.home.work.title)}</h2>
        <p>${esc(copy.home.work.copy)}</p>
        ${featured}
      </section>
      <section>
        <p>${esc(copy.home.affiliations.eyebrow)}</p>
        <ul>${semantic.affiliations.map((item) => `<li><a href="${esc(item.url)}">${esc(item.name)}</a></li>`).join("")}</ul>
      </section>
      <section>
        <p>${esc(copy.home.contact.eyebrow)}</p>
        <h2>${esc(copy.home.contact.title)}</h2>
      </section>
    </main>`;
}

function workHtml() {
  return `
    <main>
      <p>${esc(copy.workPage.eyebrow)}</p>
      <h1>${esc(copy.workPage.title)}</h1>
      ${semantic.work.items.map((item) => `
        <article>
          <p>${esc(item.period)} · ${esc(item.kind)}</p>
          <h2>${esc(item.title)}</h2>
          ${item.organization ? `<p>${esc(item.organization)}</p>` : ""}
          <p>${esc(item.summary)}</p>
          ${item.bullets ? `<ul>${item.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>` : ""}
          <p>${(item.tags || []).map(esc).join(" · ")}</p>
          ${item.scope ? `<p>${esc(item.scope)}</p>` : ""}
        </article>`).join("")}
    </main>`;
}

function educationHtml() {
  return `
    <main>
      <p>${esc(copy.educationPage.eyebrow)}</p>
      <h1>${esc(copy.educationPage.title)}</h1>
      <p>${esc(copy.educationPage.copy)}</p>
      <section>
        <h2>Degrees</h2>
        ${semantic.education.degrees.map((item) => `<article><h3>${esc(item.degree)}</h3><p>${esc(item.institution)} · ${esc(item.period)}</p><ul>${(item.focus || []).map((focus) => `<li>${esc(focus)}</li>`).join("")}</ul>${item.achievement ? `<p>${esc(item.achievement)}</p>` : ""}</article>`).join("")}
      </section>
      <section>
        <h2>Academic work</h2>
        ${semantic.education.academicWork.map((item) => `<article><p>${esc(item.status)}</p><h3>${esc(item.title)}</h3><p>${esc(item.context)}</p><p>${esc(item.summary)}</p><p>${item.tags.map(esc).join(" · ")}</p></article>`).join("")}
      </section>
      <section>
        <h2>Training and credentials</h2>
        ${semantic.education.trainingAndCredentials.map((item) => `<article><p>${esc(item.period)} · ${esc(item.status)}</p><h3>${esc(item.title)}</h3><p>${esc(item.issuer)}</p></article>`).join("")}
      </section>
      <p><strong>${esc(copy.educationPage.timelineRuleLabel)}:</strong> ${esc(copy.educationPage.timelineRuleCopy)}</p>
    </main>`;
}

function fullSiteHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(copy.identity.fullName)} — Machine-readable portfolio content</title>
<meta name="description" content="Plain semantic representation of the public portfolio, generated from the same canonical content sources as the visual site.">
<style>
body{margin:0 auto;max-width:920px;padding:40px 24px;background:#0b0d10;color:#eef2f5;font:16px/1.6 system-ui,sans-serif}
a{color:#b9d8ff} h1,h2,h3{line-height:1.15} section,article{margin:32px 0} article{padding-bottom:20px;border-bottom:1px solid #252a31}
code{background:#15191f;padding:2px 5px;border-radius:5px}
</style>
</head>
<body>
<p>This plain-text-friendly view is generated automatically from the same source data as the visual portfolio. It is not a separate résumé or keyword layer.</p>
${homeHtml()}
<hr>
${workHtml()}
<hr>
${educationHtml()}
</body>
</html>`;
}

function noscriptFor(route) {
  const body = route === "work" ? workHtml() : route === "education" ? educationHtml() : homeHtml();
  return `<noscript><div class="semantic-noscript">${body}</div></noscript>`;
}

function injectFile(filename, route) {
  if (!fs.existsSync(filename)) return;
  let html = fs.readFileSync(filename, "utf8");
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, noscriptFor(route));

  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: copy.identity.fullName,
    url: "https://soroushhaghi.github.io/",
    alumniOf: semantic.education.degrees.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    knowsAbout: [
      "Computer Engineering",
      "Quantum Technologies",
      "Software",
      "Artificial Intelligence",
      "Quantum Computing",
      "Quantum Communication",
      "Photonics",
      "Embedded Systems"
    ]
  };
  const jsonLd = `<script type="application/ld+json">${JSON.stringify(ld).replaceAll("<", "\\u003c")}</script>`;
  if (!html.includes('application/ld+json')) {
    html = html.replace("</head>", `${jsonLd}</head>`);
  }

  fs.writeFileSync(filename, html);
}

if (!fs.existsSync(buildDir)) {
  process.exit(0);
}

fs.writeFileSync(path.join(buildDir, "site-content.json"), JSON.stringify(semantic, null, 2));

const contentDir = path.join(buildDir, "site-content");
fs.mkdirSync(contentDir, { recursive: true });
fs.writeFileSync(path.join(contentDir, "index.html"), fullSiteHtml());

const plain = [
  copy.identity.fullName,
  copy.home.hero.eyebrow,
  "",
  copy.careerState.semanticHeading,
  copy.careerState.semanticIntro,
  ...copy.careerState.stages.map((stage) => [stage.eyebrow, cleanTitle(stage.title), stage.copy].filter(Boolean).join(" — ")),
  "",
  "Capabilities:",
  ...semantic.careerState.capabilities.map((item) => `- ${item.name} — ${item.mode}`),
  "",
  copy.workPage.title,
  ...semantic.work.items.map((item) => `${item.period} | ${item.title} | ${item.summary}`),
  "",
  copy.educationPage.title,
  ...semantic.education.degrees.map((item) => `${item.period} | ${item.degree} | ${item.institution}`),
  ...semantic.education.academicWork.map((item) => `${item.status} | ${item.title} | ${item.summary}`),
].join("\n");
fs.writeFileSync(path.join(buildDir, "site-content.txt"), plain);

injectFile(path.join(buildDir, "index.html"), "home");
injectFile(path.join(buildDir, "work", "index.html"), "work");
injectFile(path.join(buildDir, "education", "index.html"), "education");

console.log("Generated semantic portfolio export from canonical site data.");
