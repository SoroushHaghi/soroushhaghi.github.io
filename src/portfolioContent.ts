export type PortfolioLink = {
  label: string;
  href: string;
};

export type WorkArtifact = {
  kind: "live" | "gif" | "repo" | "evidence";
  label: string;
  href?: string;
  image?: string;
  repo?: string;
  note?: string;
};

export type WorkTimelineItem = {
  id: string;
  kind: "experience" | "project" | "co-op";
  period: string;
  sort: number;
  title: string;
  organization?: string;
  summary: string;
  bullets?: string[];
  tags: string[];
  links?: PortfolioLink[];
  artifact?: WorkArtifact;
  scope?: string;
};

export const workTimeline: WorkTimelineItem[] = [
  {
    id: "career-os",
    kind: "project",
    period: "Sep 2026 — Present",
    sort: 20260912,
    title: "Career OS",
    organization: "Open-source / AI-assisted co-development",
    summary: "Privacy-first shared AI context and evidence-to-knowledge system with provenance-aware workflows, queue/retry processing, provider adapters, and public/private boundaries.",
    bullets: [
      "User-directed requirements, architecture, privacy rules, workflow design, testing, debugging, and iterative refinement.",
      "Public repository contains reusable contracts, tests, synthetic examples, automation logic, and implementation-status boundaries."
    ],
    tags: ["Systems", "Automation", "AI tooling", "Provenance", "GitHub"],
    links: [{ label: "GitHub", href: "https://github.com/SoroushHaghi/career-os" }],
    artifact: {
      kind: "repo",
      label: "Public repository",
      href: "https://github.com/SoroushHaghi/career-os",
      repo: "SoroushHaghi/career-os"
    },
    scope: "Demonstrated · AI-assisted co-development"
  },
  {
    id: "mri-segmentation",
    kind: "project",
    period: "Public repo · Nov 2025",
    sort: 20251122,
    title: "MRI Segmentation Inference Dashboard",
    summary: "Streamlit/PyTorch inference application using pretrained segmentation weights, preprocessing, mask generation, overlays, and area visualization.",
    tags: ["PyTorch", "Streamlit", "Medical imaging", "Inference"],
    links: [
      { label: "GitHub", href: "https://github.com/SoroushHaghi/MRI-tumor-detection" },
      { label: "Live demo", href: "https://ptb-mri-detection.streamlit.app" }
    ],
    artifact: {
      kind: "live",
      label: "MRI segmentation demo",
      href: "https://ptb-mri-detection.streamlit.app/?embed=true",
      note: "Load the live Streamlit preview"
    },
    scope: "Demonstrated inference integration; no model-training authorship claim"
  },
  {
    id: "gas-classification",
    kind: "project",
    period: "Public repo · Nov 2025",
    sort: 20251110,
    title: "Gas Classification Pipeline & Dashboard",
    summary: "Python/Streamlit sensor-classification workflow using statistical window features and RandomForest prediction probabilities.",
    tags: ["Python", "scikit-learn", "RandomForest", "Sensors", "Streamlit"],
    links: [
      { label: "GitHub", href: "https://github.com/SoroushHaghi/gas-detection" },
      { label: "Live demo", href: "https://gas-detection-tubs.streamlit.app" }
    ],
    artifact: {
      kind: "live",
      label: "Gas classification demo",
      href: "https://gas-detection-tubs.streamlit.app/?embed=true",
      note: "Load the live Streamlit preview"
    },
    scope: "Demonstrated project scope; unsupported performance claims omitted"
  },
  {
    id: "activity-recognition",
    kind: "project",
    period: "Public repo · Nov 2025",
    sort: 20251104,
    title: "Activity Recognition ML Comparison",
    summary: "Structured sensor-ML project comparing RandomForest and 1D-CNN approaches with Poetry-managed dependencies and GitLab CI lint/test stages.",
    tags: ["Python", "PyTorch", "scikit-learn", "CI", "Sensor ML"],
    links: [{ label: "GitHub", href: "https://github.com/SoroushHaghi/Activity_Recognition" }],
    artifact: {
      kind: "gif",
      label: "Pipeline demo",
      image: "https://raw.githubusercontent.com/SoroushHaghi/Activity_Recognition/main/docs/demo.gif",
      href: "https://github.com/SoroushHaghi/Activity_Recognition"
    },
    scope: "Demonstrated ML/CI scope; accuracy and Docker claims intentionally omitted"
  },
  {
    id: "bachelor-projects",
    kind: "project",
    period: "Undergraduate work · 2018 — 2024",
    sort: 20180101,
    title: "Bachelor Engineering Projects",
    organization: "Computer Engineering coursework",
    summary: "Curated undergraduate work spanning computer vision, embedded systems, image processing, and signal processing.",
    bullets: [
      "Day/Night Vehicle Detection — MATLAB computer vision and image processing.",
      "Hybrid Image Generation — low/high spatial-frequency image composition.",
      "ATmega32 Digital Clock and Digital Safe — embedded C coursework.",
      "Stereo Sound Direction — MATLAB signal-processing artifact; authorship remains bounded."
    ],
    tags: ["MATLAB", "Computer vision", "Embedded C", "ATmega32", "Signal processing"],
    links: [
      { label: "Project collection", href: "https://soroushhaghi.github.io/bachelor-engineering-projects/" },
      { label: "GitHub", href: "https://github.com/SoroushHaghi/bachelor-engineering-projects" }
    ],
    artifact: {
      kind: "live",
      label: "Bachelor project collection",
      href: "https://soroushhaghi.github.io/bachelor-engineering-projects/",
      note: "Load the interactive project collection"
    },
    scope: "Coursework / demonstrated and user-confirmed items; boundaries preserved per project"
  },
  {
    id: "teaching-assistant",
    kind: "experience",
    period: "Sep 2023 — Jan 2024",
    sort: 20230901,
    title: "Teaching Assistant — Theory of Formal Languages and Automata",
    organization: "Azad University, Mashhad Branch",
    summary: "Led supervised weekly exercise and problem-solving sessions for approximately 20 students and supported assignment/exam evaluation.",
    tags: ["Teaching", "Algorithms", "Technical communication"],
    artifact: {
      kind: "evidence",
      label: "Signed university certification",
      note: "Evidence on file · public document preview not published yet"
    },
    scope: "Demonstrated role; supervised course responsibility"
  },
  {
    id: "rd-denoising",
    kind: "project",
    period: "Public repo · Dec 2023",
    sort: 20231218,
    title: "Image Noise / Denoising / PSNR Repository",
    summary: "Public repository structured around noise simulation, denoising, and PSNR-based image-quality evaluation.",
    tags: ["Python", "Image processing", "Denoising", "PSNR"],
    links: [{ label: "GitHub", href: "https://github.com/SoroushHaghi/RD_denoising" }],
    artifact: {
      kind: "repo",
      label: "Public repository",
      href: "https://github.com/SoroushHaghi/RD_denoising",
      repo: "SoroushHaghi/RD_denoising"
    },
    scope: "Public repository scope only; no stronger authorship or benchmark claim"
  },
  {
    id: "ikco",
    kind: "co-op",
    period: "Apr 2023 — Sep 2023",
    sort: 20230401,
    title: "Iran Khodro (IKCO)",
    organization: "Co-op — Pouyesh Scheme",
    summary: "University participation in a talent/industry context with personal work on a MATLAB day/night vehicle-detection project.",
    bullets: [
      "Participation led to an invitation to work from Iran Khodro.",
      "Ranked 1st among 50 participants in the relevant context."
    ],
    tags: ["Computer vision", "MATLAB", "Industry-university"],
    artifact: {
      kind: "evidence",
      label: "Project / ranking evidence",
      note: "Evidence on file · public document preview not published yet"
    },
    scope: "User-confirmed context; not represented as formal employment"
  },
  {
    id: "ferdowsi-startup",
    kind: "experience",
    period: "Mar 2023 — Aug 2023",
    sort: 20230301,
    title: "Ferdowsi University Startup",
    organization: "Project Contributor",
    summary: "Temporary project-based collaboration supporting coordination, external presentations, stakeholder communication, outreach, attendee coordination, on-site presentation, and professional networking.",
    tags: ["Project coordination", "Presentations", "Stakeholder communication"],
    artifact: {
      kind: "evidence",
      label: "Signed reference letter",
      note: "Evidence on file · public document preview not published yet"
    },
    scope: "Demonstrated by signed reference; no software/model implementation claim"
  },
  {
    id: "volunteer-it",
    kind: "experience",
    period: "Oct 2022 — Aug 2023",
    sort: 20221001,
    title: "Volunteer IT Support",
    organization: "Azad University, Mashhad Branch",
    summary: "Continued supporting the university IT team after the internship, progressing from central support to on-site troubleshooting and repair across internal university units.",
    tags: ["IT support", "Hardware", "Networks", "Windows"],
    artifact: {
      kind: "evidence",
      label: "Role evidence",
      note: "Private evidence retained in Career OS"
    },
    scope: "User-confirmed volunteer continuation"
  },
  {
    id: "it-intern",
    kind: "experience",
    period: "Jul 2022 — Sep 2022",
    sort: 20220701,
    title: "IT Support Intern",
    organization: "Azad University, Mashhad Branch",
    summary: "Desktop troubleshooting and repair, component replacement/upgrades, Windows installation/configuration, physical rack/cabling work, and local network/Wi-Fi setup and troubleshooting.",
    tags: ["IT support", "Hardware", "Networking", "Windows"],
    artifact: {
      kind: "evidence",
      label: "Internship evidence",
      note: "Private evidence retained in Career OS"
    },
    scope: "User-confirmed internship scope"
  }
];

export type AcademicWorkItem = {
  id: string;
  status: string;
  title: string;
  context: string;
  summary: string;
  tags: string[];
};

export const academicWork: AcademicWorkItem[] = [
  {
    id: "qkd-satellite",
    status: "COMPLETED",
    title: "QKD Satellite Communication — Academic Work",
    context: "Master's selected academic work",
    summary: "Source-approved academic work in QKD satellite communication; represented here at academic-work scope without implying experimental or deployment experience.",
    tags: ["QKD", "Satellite communication", "Quantum communication"]
  },
  {
    id: "qkd-seminar",
    status: "PRESENTATION PENDING",
    title: "Co-propagation of QKD Signals with Next-Generation Optical Networks",
    context: "Master's seminar",
    summary: "Seminar work on coexistence of QKD signals with next-generation optical-network infrastructure; final presentation is still pending.",
    tags: ["QKD", "Optical networks", "Quantum communication"]
  },
  {
    id: "qcn-presentation",
    status: "COMPLETED",
    title: "Quantum Communication Networks — Technical Presentation",
    context: "Master's academic work",
    summary: "Presentation covering quantum-state concepts, tomography, CHSH, entanglement, dense coding, and teleportation.",
    tags: ["Quantum communication", "Entanglement", "CHSH"]
  },
  {
    id: "channel-coding-presentation",
    status: "COMPLETED",
    title: "Channel Coding with State — Technical Presentation",
    context: "Master's academic work",
    summary: "Presentation on state-dependent channels, random binning, dirty-paper coding, and achievable-rate ideas.",
    tags: ["Information theory", "Coding", "Communication"]
  },
  {
    id: "defects-presentation",
    status: "COMPLETED",
    title: "Dislocations and Crystal Defects — Presentation",
    context: "Master's academic work",
    summary: "Presentation on crystalline defects, Burgers-vector interpretation, glide/climb, and multiplication mechanisms.",
    tags: ["Semiconductors", "Materials", "Crystal defects"]
  },
  {
    id: "metasurface-journal-club",
    status: "COMPLETED",
    title: "Sn Nanobar Plasmonic Metasurface — Journal Club",
    context: "Master's academic work",
    summary: "Literature-review presentation summarizing a published FDTD setup and resonance results; no personal FDTD execution implied.",
    tags: ["Photonics", "Nano-optics", "Metasurfaces"]
  },
  {
    id: "nonlinear-photonics",
    status: "COMPLETED",
    title: "Nonlinear Photonics Exercise Portfolio",
    context: "12 preserved written submissions",
    summary: "Analytical work covering dispersion, phase matching, harmonic generation, Kerr effects, fiber nonlinearities, and gain/threshold calculations.",
    tags: ["Photonics", "Nonlinear optics", "Analytical coursework"]
  },
  {
    id: "coding-lab",
    status: "COMPLETED",
    title: "Coding Theory Computational Lab",
    context: "Group worksheet / MATLAB-based exercises",
    summary: "Named group participation in cyclic-code/error-correction exercises, generator-matrix work, and recorded bit-error behavior versus SNR.",
    tags: ["Coding theory", "MATLAB", "Error correction"]
  },
  {
    id: "information-theory-hw",
    status: "COMPLETED",
    title: "Information & Coding Theory — Graded Written Work",
    context: "Personally named graded coursework",
    summary: "Analytical work on code properties, entropy/source models, Markov processes, relative entropy, typical sets, and related coding calculations.",
    tags: ["Information theory", "Coding theory", "Analytical coursework"]
  }
];

export const masterCourseAreas = [
  {
    title: "Quantum Information & Computing",
    courses: [
      "Advanced Quantum Technology for Engineers",
      "Introduction to Quantum Information Technology and Quantum Computing",
      "Applied Quantum Computing: Basics and Devices"
    ]
  },
  {
    title: "Communication & Information",
    courses: [
      "Coding Theory",
      "Mathematical Foundations of Information Theory and Coding Theory",
      "Network Information Theory",
      "Quantum Communication Networks"
    ]
  },
  {
    title: "Photonics, Devices & Fields",
    courses: [
      "Advanced Applications of Field Theory",
      "Nonlinear Photonics",
      "Semiconductor Technology",
      "Gallium Nitride Technology"
    ]
  }
];

export type EducationArtifact = {
  label: string;
  note: string;
  image?: string;
};

export const degreeArtifacts: Record<string, EducationArtifact> = {
  master: {
    label: "Current academic record",
    note: "Approved public image can be added here later; grades stay hidden on the website."
  },
  bachelor: {
    label: "Degree certificate",
    note: "Approved certificate image can be added here later."
  }
};

export const trainingAndCredentials = [
  { period: "2026", title: "Quantum Programming Language", issuer: "Sharif University of Technology", status: "In progress", artifact: "Course record" },
  { period: "2025", title: "Quantum Machine Learning", issuer: "Ariaquanta Institute", status: "Training", artifact: "Certificate" },
  { period: "2025", title: "Machine Learning + Introduction to Programming Using Python", issuer: "Kaggle", status: "Training", artifact: "Certificates" },
  { period: "2024", title: "TOEFL iBT", issuer: "ETS", status: "Language credential", artifact: "Score report" },
  { period: "2023", title: "Data & ML Bootcamp — 96 hours", issuer: "Azad University, Mashhad", status: "Training", artifact: "Certificate" },
  { period: "2021", title: "Python Programming — 40 hours", issuer: "Jahad Daneshgahi, Khorasan Razavi", status: "Certificate", artifact: "Certificate" }
];
