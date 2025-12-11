/* src/portfolio.js */

const header = {
  homepage: "https://github.com/soroushhaghi", // یوزرنیم گیت‌هاب خودت رو اینجا بنویس
  title: "S. Haghi",
}

const about = {
  name: "S. Haghi",
  role: "Quantum Tech & AI Engineer",
  description:
    "Master's student in Quantum Technology with a strong background in Software Engineering. Specializing in Quantum Machine Learning (QML), MLOps, and Automotive AI. Passionate about bridging the gap between classical AI and quantum advantages in the industry.",
  resume: "https://example.com/resume.pdf", // بعداً لینک رزومه PDF رو اینجا می‌ذاریم
  social: {
    linkedin: "https://linkedin.com/in/soroushhaghi",
    github: "https://github.com/soroushhaghi",
  },
}

const about2 = {
    // این بخش اختیاریه، فعلاً خالی می‌ذاریم برای سرعت
    title: "", 
    description: "", 
}

const projects = [
  {
    name: "Real-Time Activity Recognition",
    description:
      "A scalable MLOps pipeline to classify human actions from sensor streams using PyTorch and 1D-CNN. Features Docker containerization and GitLab CI/CD for automated testing.",
    stack: ["Python", "PyTorch", "Docker", "CI/CD"],
    sourceCode: "https://github.com/SoroushHaghi/Job-Prep2025", // لینک ریپو اگر داری
    livePreview: "",
  },
  {
    name: "Gas Detection MLOps Pipeline",
    description:
      "Real-time gas classification system processing data from a 16-sensor array. Achieved 95% accuracy using Random Forest and deployed via an interactive Streamlit dashboard.",
    stack: ["Scikit-learn", "Streamlit", "Pandas", "MLOps"],
    sourceCode: "https://github.com/SoroushHaghi/gas-detection",
    livePreview: "",
  },
  {
    name: "MRI Brain Tumor Segmentation",
    description:
      "Implemented SOTA semantic segmentation models (U-Net++, EfficientNet) for medical imaging. Optimized with CUDA acceleration and visualized via a web app.",
    stack: ["Deep Learning", "Computer Vision", "PyTorch"],
    sourceCode: "https://github.com/SoroushHaghi/ptb-mri-detection",
    livePreview: "",
  },
]

const skills = [
  "Python",
  "Quantum Machine Learning (QML)",
  "PyTorch",
  "Docker",
  "Computer Vision",
  "Git",
  "C++",
]

const contact = {
  email: "s.haghi@tu-braunschweig.de",
}

export { header, about, about2, projects, skills, contact }