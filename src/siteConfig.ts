export type Domain = {
  id: string;
  label: string;
};

export type WorkItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "project" | "experience" | "system" | "academic";
  domains: string[];
  featured?: boolean;
};

export const navItems = [
  { label: "WORK", href: "/work" },
  { label: "EDUCATION", href: "/education" },
  { label: "CV", href: "/cv", external: true },
];

export const domains: Domain[] = [
  { id: "quantum", label: "Quantum" },
  { id: "software", label: "Software" },
  { id: "hardware", label: "Hardware" },
  { id: "classical", label: "Classical" },
];

export const expertiseTerms: Record<string, string[]> = {
  quantum: ["Quantum information", "QKD", "Photonics", "Quantum computing"],
  software: ["AI & perception", "Python", "Scientific computing", "Software systems"],
  hardware: ["Embedded systems", "Sensing", "Electronics", "Devices"],
  classical: ["Communication", "Signals & systems", "Electromagnetics", "Engineering foundations"],
};

export const workItems: WorkItem[] = [
  {
    id: "vehicle-detection",
    title: "Vehicle Detection",
    subtitle: "Automotive computer vision",
    type: "project",
    domains: ["software", "classical"],
    featured: true,
  },
  {
    id: "mri-segmentation",
    title: "MRI Segmentation",
    subtitle: "Medical imaging inference workflow",
    type: "project",
    domains: ["software", "classical"],
    featured: true,
  },
  {
    id: "career-os",
    title: "Career OS",
    subtitle: "Structured software and automation system",
    type: "system",
    domains: ["software"],
    featured: true,
  },
  {
    id: "gas-detection",
    title: "Gas Classification",
    subtitle: "Sensor-data classification and simulation",
    type: "project",
    domains: ["hardware", "software"],
  },
  {
    id: "activity-recognition",
    title: "Activity Recognition",
    subtitle: "Sensor ML workflow and CI",
    type: "project",
    domains: ["software", "classical"],
  },
  {
    id: "quantum-communication",
    title: "Quantum Communication",
    subtitle: "Academic focus in communication and QKD",
    type: "academic",
    domains: ["quantum", "classical"],
  },
];

export const education = [
  {
    id: "msc",
    degree: "M.Sc. Quantum Technologies",
    institution: "TU Braunschweig",
    period: "2024 — Present",
    focus: ["Quantum information & computing", "Communication & photonics", "Semiconductor & device technologies"],
    domains: ["quantum", "hardware", "classical"],
  },
  {
    id: "bsc",
    degree: "B.Sc. Computer Engineering",
    institution: "Azad University, Mashhad",
    period: "2018 — 2024",
    focus: ["AI & computer vision", "Embedded systems", "Software & computer engineering"],
    achievement: "Ranked 5th of 131 students",
    domains: ["software", "hardware", "classical"],
  },
];

export const organizationMarks = [
  {
    id: "tu-braunschweig",
    name: "TU Braunschweig",
    href: "https://www.tu-braunschweig.de/",
    logo: "https://www.google.com/s2/favicons?domain=tu-braunschweig.de&sz=128",
    hue: "354",
  },
  {
    id: "iran-khodro",
    name: "Iran Khodro",
    href: "https://www.ikco.ir/",
    logo: "https://www.google.com/s2/favicons?domain=ikco.ir&sz=128",
    hue: "205",
  },
  {
    id: "azad-university",
    name: "Islamic Azad University",
    href: "https://iau.ir/",
    logo: "https://www.google.com/s2/favicons?domain=iau.ir&sz=128",
    hue: "199",
  },
  {
    id: "intel",
    name: "Intel",
    href: "https://www.intel.com/",
    logo: "https://www.google.com/s2/favicons?domain=intel.com&sz=128",
    hue: "205",
  },
  {
    id: "ptb",
    name: "Physikalisch-Technische Bundesanstalt",
    href: "https://www.ptb.de/",
    logo: "https://www.google.com/s2/favicons?domain=ptb.de&sz=128",
    hue: "216",
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    href: "https://www.ti.com/",
    logo: "https://www.google.com/s2/favicons?domain=ti.com&sz=128",
    hue: "353",
  },
  {
    id: "sharif",
    name: "Sharif University of Technology",
    href: "https://www.sharif.edu/",
    logo: "https://www.google.com/s2/favicons?domain=sharif.edu&sz=128",
    hue: "210",
  },
  {
    id: "ferdowsi",
    name: "Ferdowsi University of Mashhad",
    href: "https://www.um.ac.ir/",
    logo: "https://www.google.com/s2/favicons?domain=um.ac.ir&sz=128",
    hue: "160",
  },
] as const;
