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
    short: "TU Braunschweig",
    logo: "data:image/webp;base64,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",
    hue: "348",
    scale: 1.00,
    variant: "wide",
  },
  {
    id: "leibniz-hannover",
    name: "Leibniz Universität Hannover",
    short: "LUH",
    logo: "https://d3nc7nwi4bo41q.cloudfront.net/Institues-logo/GERMANY_Leibniz-Universitat-Hannover.png",
    hue: "211",
    scale: 1.00,
    variant: "luh-rect",
  },
  {
    id: "sharif",
    name: "Sharif University of Technology",
    short: "Sharif",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/sharif-logo-png-transparent.png",
    hue: "210",
    scale: 1.04,
  },
  {
    id: "ferdowsi",
    name: "Ferdowsi University of Mashhad",
    short: "Ferdowsi",
    logo: "https://tasjil.education/wp-content/uploads/2025/02/%D8%AC%D8%A7%D9%85%D8%B9%D8%A9-%D9%81%D8%B1%D8%AF%D9%88%D8%B3%D9%8A-%D9%85%D8%B4%D9%87%D8%AF-logo.jpg",
    hue: "160",
    scale: 1.00,
    variant: "ferdowsi-symbol",
  },
  {
    id: "azad-university",
    name: "Azad University",
    short: "Azad",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/IAUTMU_Logo_(cropped).png",
    hue: "201",
    scale: 1.00,
    variant: "azad-clean",
  },
  {
    id: "iran-khodro",
    name: "Iran Khodro",
    short: "IKCO",
    logo: "https://media.licdn.com/dms/image/v2/D4D22AQGtCZ4nKND3Qg/feedshare-shrink_800/B4DZWfC3o6HkAg-/0/1742130087596?e=2147483647&t=mG2XD6_Zmu8YcpWh6AXUJL98kfTqUa7NvYuS6qBWQgU&v=beta",
    hue: "204",
    scale: 1.00,
    variant: "ikco-new",
  },
  {
    id: "ptb",
    name: "Physikalisch-Technische Bundesanstalt",
    short: "PTB",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Physikalisch-Technische_Bundesanstalt_logo.svg",
    hue: "188",
    scale: 1.00,
    variant: "ptb-signature",
  },
  {
    id: "intel",
    name: "Intel",
    short: "INTEL",
    logo: "data:image/webp;base64,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",
    hue: "205",
    scale: 1.00,
    variant: "wide",
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    short: "TI",
    logo: "https://api.iconify.design/simple-icons/texasinstruments.svg?color=%23EC1C24",
    hue: "354",
    scale: 1.00,
    variant: "ti-signature",
  },
  {
    id: "volkswagen",
    name: "Volkswagen",
    short: "VW",
    logo: "https://api.iconify.design/simple-icons/volkswagen.svg?color=%23001E50",
    hue: "216",
    scale: 1.08,
  },
  {
    id: "huawei",
    name: "Huawei",
    short: "HUAWEI",
    logo: "https://api.iconify.design/simple-icons/huawei.svg?color=%23CF0A2C",
    hue: "354",
    scale: 0.92,
  },
  {
    id: "ericsson",
    name: "Ericsson",
    short: "ERICSSON",
    logo: "https://api.iconify.design/simple-icons/ericsson.svg?color=%230080C8",
    hue: "205",
    scale: 1.05,
  },
  {
    id: "infineon",
    name: "Infineon",
    short: "INFINEON",
    logo: "data:image/webp;base64,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",
    hue: "184",
    scale: 1.10,
    variant: "wide",
  },
] as const;
