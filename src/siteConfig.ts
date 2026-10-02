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
    logo: "https://www2.daad.de/app/ip/media/cache/full_web_optimized/uploads/images/logo/67bf251c2e86a.png",
    hue: "348",
    scale: 1.00,
    variant: "tubs-source",
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
