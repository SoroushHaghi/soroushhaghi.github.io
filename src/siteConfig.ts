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
  { id: "communication", label: "Communication" },
  { id: "photonics", label: "Photonics" },
  { id: "ai-perception", label: "AI & Perception" },
  { id: "devices-sensing", label: "Devices & Sensing" },
  { id: "software-systems", label: "Software & Systems" },
];

export const workItems: WorkItem[] = [
  {
    id: "vehicle-detection",
    title: "Vehicle Detection",
    subtitle: "Automotive computer vision",
    type: "project",
    domains: ["ai-perception", "software-systems"],
    featured: true,
  },
  {
    id: "mri-segmentation",
    title: "MRI Segmentation",
    subtitle: "Medical imaging inference workflow",
    type: "project",
    domains: ["ai-perception", "software-systems"],
    featured: true,
  },
  {
    id: "career-os",
    title: "Career OS",
    subtitle: "Structured software and automation system",
    type: "system",
    domains: ["software-systems"],
    featured: true,
  },
  {
    id: "gas-detection",
    title: "Gas Classification",
    subtitle: "Sensor-data classification and simulation",
    type: "project",
    domains: ["devices-sensing", "ai-perception"],
  },
  {
    id: "activity-recognition",
    title: "Activity Recognition",
    subtitle: "Sensor ML workflow and CI",
    type: "project",
    domains: ["ai-perception", "software-systems"],
  },
  {
    id: "quantum-communication",
    title: "Quantum Communication",
    subtitle: "Academic focus in communication and QKD",
    type: "academic",
    domains: ["quantum", "communication", "photonics"],
  },
];

export const education = [
  {
    id: "msc",
    degree: "M.Sc. Quantum Technologies",
    institution: "TU Braunschweig",
    period: "2024 — Present",
    focus: ["Quantum information & computing", "Communication & photonics", "Semiconductor & device technologies"],
    domains: ["quantum", "communication", "photonics", "devices-sensing"],
  },
  {
    id: "bsc",
    degree: "B.Sc. Computer Engineering",
    institution: "Azad University, Mashhad",
    period: "2018 — 2024",
    focus: ["AI & computer vision", "Embedded systems", "Software & computer engineering"],
    achievement: "Ranked 5th of 131 students",
    domains: ["ai-perception", "devices-sensing", "software-systems"],
  },
];

export const organizationMarks = [
  {
    id: "tu-braunschweig",
    name: "TU Braunschweig",
    href: "https://www.tu-braunschweig.de/",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Siegel_TU_Braunschweig_transparent.svg",
    hue: "354",
  },
  {
    id: "iran-khodro",
    name: "Iran Khodro",
    href: "https://www.ikco.ir/",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Iran_Khodro_symbol.svg",
    hue: "205",
  },
  {
    id: "azad-university",
    name: "Azad University",
    href: "https://iau.ir/",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Azad_University_logo.png",
    hue: "199",
  },
  {
    id: "intel",
    name: "Intel",
    href: "https://www.intel.com/",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Intel_logo_2023.svg",
    hue: "205",
  },
  {
    id: "ptb",
    name: "Physikalisch-Technische Bundesanstalt",
    href: "https://www.ptb.de/",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Physikalisch-Technische_Bundesanstalt_logo.svg",
    hue: "216",
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    href: "https://www.ti.com/",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_Instruments_logo_2024.svg",
    hue: "353",
  },
  {
    id: "sharif",
    name: "Sharif University of Technology",
    href: "https://www.sharif.edu/",
    logo: "https://img.logokit.com/sharif.edu",
    hue: "210",
  },
  {
    id: "ferdowsi",
    name: "Ferdowsi University of Mashhad",
    href: "https://www.um.ac.ir/",
    logo: "https://img.logokit.com/um.ac.ir",
    hue: "160",
  },
] as const;
