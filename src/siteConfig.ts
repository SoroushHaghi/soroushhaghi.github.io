export type Domain = {
  id: string;
  label: string;
};

export type WorkItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "project" | "experience" | "academic";
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
    type: "project",
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
    short: "TUBS",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Siegel_TU_Braunschweig_transparent.svg",
    hue: "354",
    scale: 0.84,
  },
  {
    id: "leibniz-hannover",
    name: "Leibniz Universität Hannover",
    short: "LUH",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Universit%C3%A4t_Hannover.svg",
    hue: "188",
    scale: 0.88,
  },
  {
    id: "sharif",
    name: "Sharif University of Technology",
    short: "SUT",
    logo: "https://img.logokit.com/sharif.edu",
    hue: "210",
    scale: 0.86,
  },
  {
    id: "ferdowsi",
    name: "Ferdowsi University of Mashhad",
    short: "FUM",
    logo: "https://img.logokit.com/um.ac.ir",
    hue: "160",
    scale: 0.84,
  },
  {
    id: "azad-university",
    name: "Azad University",
    short: "AU",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Azad_University_logo.png",
    hue: "199",
    scale: 0.82,
  },
  {
    id: "iran-khodro",
    name: "Iran Khodro",
    short: "IKCO",
    caption: "IKCO",
    logo: "https://img.logokit.com/ikcoglobal.com",
    hue: "205",
    scale: 0.84,
  },
  {
    id: "ptb",
    name: "Physikalisch-Technische Bundesanstalt",
    short: "PTB",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Physikalisch-Technische_Bundesanstalt_logo.svg",
    hue: "216",
    scale: 0.92,
  },
  {
    id: "intel",
    name: "Intel",
    short: "INTEL",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Intel_logo_2023.svg",
    hue: "205",
    scale: 0.94,
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    short: "TI",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_Instruments_logo_2024.svg",
    hue: "353",
    scale: 0.90,
  },
  {
    id: "volkswagen",
    name: "Volkswagen",
    short: "VW",
    logo: "https://api.iconify.design/simple-icons/volkswagen.svg?color=%23001E50",
    hue: "216",
    scale: 0.86,
  },
  {
    id: "huawei",
    name: "Huawei",
    short: "HUAWEI",
    logo: "https://api.iconify.design/simple-icons/huawei.svg?color=%23CF0A2C",
    hue: "354",
    scale: 0.86,
  },
  {
    id: "ericsson",
    name: "Ericsson",
    short: "ERICSSON",
    logo: "https://api.iconify.design/simple-icons/ericsson.svg?color=%230080C8",
    hue: "205",
    scale: 0.90,
  },
  {
    id: "infineon",
    name: "Infineon",
    short: "INFINEON",
    logo: "https://api.iconify.design/simple-icons/infineon.svg?color=%2300878F",
    hue: "184",
    scale: 0.92,
  },
] as const;
