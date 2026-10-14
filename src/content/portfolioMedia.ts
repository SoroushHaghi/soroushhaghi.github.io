export type PortfolioMedia = {
  src: string;
  alt: string;
  href?: string;
  fit?: "cover" | "contain";
  position?: string;
  label?: string;
};

/**
 * Public portfolio covers: illustrative AI-generated imagery, not photographs,
 * screenshots, implementation evidence, or measured results of these projects.
 * All project visuals are hosted locally for consistent, cached loading.
 */
const projectImage = (name: string) => `/media/projects/${name}.webp`;

export const portfolioMedia: Record<string, PortfolioMedia> = {
  "vehicle-detection": {
    src: projectImage("vehicle-detection"),
    alt: "Illustration of fixed roadside CCTV detecting vehicles on a city road",
    href: "https://soroushhaghi.github.io/bachelor-engineering-projects/",
    label: "PROJECT",
  },
  "bachelor-projects": {
    src: projectImage("bachelor-projects"),
    alt: "Illustrative engineering workstation with electronics and computer-vision displays",
    href: "https://soroushhaghi.github.io/bachelor-engineering-projects/",
    label: "PROJECT COLLECTION",
  },
  "mri-segmentation": {
    src: projectImage("mri-segmentation"),
    alt: "Illustrative MRI brain segmentation software on a medical imaging monitor",
    href: "https://ptb-mri-detection.streamlit.app/",
    label: "PROJECT",
  },
  "career-os": {
    src: projectImage("career-os"),
    alt: "Concept illustration of Career OS connecting email, AI assistants, software backend, portfolio and job tracking",
    href: "https://github.com/SoroushHaghi/career-os",
    label: "PROJECT",
  },
  "gas-detection": {
    src: projectImage("gas-classification"),
    alt: "Conceptual gas classification and city monitoring heatmap on a dashboard",
    href: "https://gas-detection-tubs.streamlit.app/",
    label: "PROJECT",
  },
  "gas-classification": {
    src: projectImage("gas-classification"),
    alt: "Conceptual urban gas concentration heatmap, not actual model output",
    href: "https://gas-detection-tubs.streamlit.app/",
    label: "PROJECT",
  },
  "activity-recognition": {
    src: projectImage("activity-recognition"),
    alt: "Conceptual camera-based recognition of a person squatting, not actual project interface",
    href: "https://github.com/SoroushHaghi/Activity_Recognition",
    label: "PROJECT",
  },
  "ikco": {
    src: projectImage("vehicle-detection"),
    alt: "Illustrative roadside vehicle-detection camera representing the MATLAB computer-vision project",
    href: "https://soroushhaghi.github.io/bachelor-engineering-projects/",
    label: "PROJECT CONTEXT",
  },
  "ferdowsi-startup": {
    src: projectImage("ferdowsi-startup"),
    alt: "Conceptual dental software interface showing multiple tooth and dental imaging views",
    label: "PROJECT CONTEXT",
  },
  "it-intern": {
    src: projectImage("it-intern"),
    alt: "Illustrative desktop computer troubleshooting and hardware repair workstation",
    label: "EXPERIENCE",
  },
  "volunteer-it": {
    src: projectImage("volunteer-it"),
    alt: "Illustrative scene of one person assisting another with an office computer issue",
    label: "EXPERIENCE",
  },
};

export function getPortfolioMedia(id: string): PortfolioMedia | undefined {
  return portfolioMedia[id];
}
