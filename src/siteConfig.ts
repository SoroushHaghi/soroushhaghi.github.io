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
    logo: "https://api.iconify.design/simple-icons/intel.svg?color=%230071C5",
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
    logo: "https://api.iconify.design/simple-icons/infineon.svg?color=%2300878F",
    hue: "184",
    scale: 1.22,
    variant: "wide",
  },
] as const;
