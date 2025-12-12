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
    image: "AI_EYES.png",
  },
  {
    name: "Gas Detection MLOps Pipeline",
    description:
      "Real-time gas classification system processing data from a 16-sensor array. Achieved 95% accuracy using Random Forest and deployed via an interactive Streamlit dashboard.",
    stack: ["Scikit-learn", "Streamlit", "Pandas", "MLOps"],
    sourceCode: "https://github.com/SoroushHaghi/gas-detection",
    livePreview: "https://gas-detection-tubs.streamlit.app/",
    image: "AI_NOSE.png",
  },
  {
    name: "MRI Brain Tumor Segmentation",
    description:
      "Implemented SOTA semantic segmentation models (U-Net++, EfficientNet) for medical imaging. Optimized with CUDA acceleration and visualized via a web app.",
    stack: ["Deep Learning", "Computer Vision", "PyTorch"],
    sourceCode: "https://github.com/SoroushHaghi/ptb-mri-detection",
    livePreview: "",
    image: "AI_ASSISTANT.png",
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

const timeline = [
  {
    type: "education",
    date: "Master's Degree (2025 - Present)",
    title: "M.Sc. Quantum Technology",
    place: "TU Braunschweig, Germany",
    description:
      "Specializing in a comprehensive curriculum divided into two core pillars: Quantum Information Theory and Quantum Structure Devices. While mastering the physical and theoretical frameworks of quantum technologies, I am actively directing my independent research toward Quantum Machine Learning (QML). My core ambition is to bridge these disciplines to revolutionize Autonomous Driving, specifically by integrating Quantum Sensors (LiDAR) with Computer Vision and Mixed-Signal Electronics.",
  },
  {
    type: "education",
    date: "Bachelor's Degree (2019 - 2024)",
    title: "B.Eng. Computer Engineering",
    place: "Azad University, Iran",
    description:
      "A multidisciplinary engineering degree combining Software Engineering with Electronic Systems. Beyond the core curriculum, I aggressively expanded my software stack, completing two specialized Python tracks (Machine Learning & Data Science – see Certificates on LinkedIn) and mastering SQL & Database Management. I specialized in building end-to-end systems—from designing circuit logic in Proteus to implementing intelligent algorithms in Python, C, and MATLAB. This comprehensive background provided the necessary foundation for my current research in Quantum Technology.",
  },
]

const contact = {
  email: "s.haghi@tu-braunschweig.de",
}

export { header, about, about2, projects, skills, timeline, contact }