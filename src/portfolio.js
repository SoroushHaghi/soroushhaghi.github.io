/* src/portfolio.js */

const header = {
  homepage: "https://github.com/soroushhaghi",
  title: "Soroush Haghi",
}

const about = {
  name: "Soroush Haghi",
  role: "Computer Engineering | Software & AI | Quantum Technologies",
  description:
    "M.Sc. student in Quantum Technologies at TU Braunschweig with a B.Sc. in Computer Engineering and an AI-focused specialization. Hands-on across both software and hardware, with practical Python and MATLAB work in computer vision, sensor-data analysis, CI/testing, and hardware-near coursework. Academic work spans communication and coding systems, photonics, semiconductor/GaN technology, and quantum information and computing; experience includes industry-university engineering work, IT support, and supervised university teaching.",
  resume: "/cv",
  social: {
    linkedin: "https://linkedin.com/in/soroushhaghi",
    github: "https://github.com/soroushhaghi",
  },
}

const about2 = {
  title: "",
  description: "",
}

const projects = [
  {
    name: "Activity Recognition and CI Configuration",
    description:
      "Structured a sensor-activity workflow comparing RandomForest and 1D-CNN approaches. Configured Poetry dependency management and GitLab CI quality checks with flake8 and pytest.",
    stack: ["Python", "GitLab CI", "pytest", "flake8", "Poetry"],
    sourceCode: "https://github.com/SoroushHaghi/Job-Prep2025",
    livePreview: "",
    image: "AI_EYES.png",
  },
  {
    name: "Gas Classification Pipeline and Simulation Dashboard",
    description:
      "Constructed statistical features from multi-sensor time windows and used a stratified train/test workflow for six-gas RandomForest classification with class-probability output. Integrated pandas, NumPy, scikit-learn, and joblib in an interactive Streamlit simulation and probability dashboard.",
    stack: ["Python", "pandas", "NumPy", "scikit-learn", "RandomForest", "Streamlit"],
    sourceCode: "https://github.com/SoroushHaghi/gas-detection",
    livePreview: "https://gas-detection-tubs.streamlit.app/",
    image: "AI_NOSE.png",
  },
  {
    name: "MRI Segmentation Inference Dashboard",
    description:
      "Integrated pretrained U-Net++ and EfficientNet-B4 inference workflows with preprocessing, weight loading, execution, and Streamlit visualization of masks, overlays, and outputs.",
    stack: ["PyTorch", "Streamlit"],
    sourceCode: "https://github.com/SoroushHaghi/ptb-mri-detection",
    livePreview: "",
    image: "AI_ASSISTANT.png",
  },
]

const skills = [
  "Python",
  "MATLAB",
  "C++ (coursework)",
  "Embedded C / ATmega32 (coursework)",
  "SQL (coursework)",
  "scikit-learn",
  "Streamlit",
  "PyTorch inference integration",
  "Git / GitHub",
  "GitLab CI",
  "Information & Coding Theory",
  "Quantum Communication",
  "Nonlinear Photonics",
  "Semiconductor / GaN Technology",
  "Quantum Information & Computing foundations",
]

const timeline = [
  {
    type: "education",
    date: "Oct 2024 - Present",
    title: "M.Sc. Quantum Technologies in Electrical and Computer Engineering",
    place: "Technische Universität Braunschweig, Germany",
    description:
      "In progress (Internship and Thesis). Selected coursework: Quantum Communication Networks; Information & Coding Theory with Computational Experiments; Network Information Theory; Nonlinear Photonics; Semiconductor/GaN Technology; Quantum Information & Computing. Academic engagement includes presentations on QKD satellite communication, state-dependent channel coding, Quantum Communication Networks, and semiconductor crystal defects, plus a plasmonic-metasurface journal-club literature review.",
  },
  {
    type: "education",
    date: "2018 - Feb 2024",
    title: "B.Sc. Computer Engineering (Professionalization subject: AI)",
    place: "Azad University, Mashhad Branch, Iran",
    description:
      "Overall grade: 17.28/20; ranked 5th out of 131 students. Relevant focus: Artificial Intelligence; Embedded Systems; C/C++ programming; SQL and database coursework.",
  },
]

const contact = {
  email: "s.haghi.career@outlook.com",
}

export { header, about, about2, projects, skills, timeline, contact }
