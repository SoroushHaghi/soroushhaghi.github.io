export type PortfolioMedia = {
  src: string;
  alt: string;
  href?: string;
  fit?: "cover" | "contain";
  position?: string;
  label?: string;
};

const githubRepoPreview = (repo: string) =>
  `https://opengraph.githubassets.com/1/${repo}`;

const bachelorProjectsPreview = githubRepoPreview("SoroushHaghi/bachelor-engineering-projects");
const gasProjectPreview = githubRepoPreview("SoroushHaghi/gas-detection");

/**
 * Single source of truth for portfolio imagery.
 *
 * Components never contain project-specific image URLs. To replace a visual later,
 * change only the matching entry here (or add an entry for a degree/credential once
 * an approved certificate/document preview URL is available).
 */
export const portfolioMedia: Record<string, PortfolioMedia> = {
  "vehicle-detection": {
    src: bachelorProjectsPreview,
    alt: "Vehicle detection and undergraduate computer-vision project preview",
    href: "https://soroushhaghi.github.io/bachelor-engineering-projects/",
    label: "PROJECT",
  },
  "bachelor-projects": {
    src: bachelorProjectsPreview,
    alt: "Bachelor engineering projects repository preview",
    href: "https://soroushhaghi.github.io/bachelor-engineering-projects/",
    label: "PROJECT COLLECTION",
  },
  "mri-segmentation": {
    src: githubRepoPreview("SoroushHaghi/MRI-tumor-detection"),
    alt: "MRI segmentation inference project preview",
    href: "https://ptb-mri-detection.streamlit.app/",
    label: "PROJECT",
  },
  "career-os": {
    src: githubRepoPreview("SoroushHaghi/career-os"),
    alt: "Career OS public repository preview",
    href: "https://github.com/SoroushHaghi/career-os",
    label: "PROJECT",
  },
  "gas-detection": {
    src: gasProjectPreview,
    alt: "Gas classification project preview",
    href: "https://gas-detection-tubs.streamlit.app/",
    label: "PROJECT",
  },
  "gas-classification": {
    src: gasProjectPreview,
    alt: "Gas classification pipeline and dashboard preview",
    href: "https://gas-detection-tubs.streamlit.app/",
    label: "PROJECT",
  },
  "activity-recognition": {
    src: "https://raw.githubusercontent.com/SoroushHaghi/Activity_Recognition/main/docs/demo.gif",
    alt: "Activity recognition machine-learning pipeline demo",
    href: "https://github.com/SoroushHaghi/Activity_Recognition",
    label: "PROJECT",
  },
  "rd-denoising": {
    src: githubRepoPreview("SoroushHaghi/RD_denoising"),
    alt: "Image denoising and PSNR project repository preview",
    href: "https://github.com/SoroushHaghi/RD_denoising",
    label: "PROJECT",
  },
};

export function getPortfolioMedia(id: string): PortfolioMedia | undefined {
  return portfolioMedia[id];
}
