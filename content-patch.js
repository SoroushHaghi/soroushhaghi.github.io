(() => {
  const content = {
    name: "Soroush Haghi",
    role: "Computer Engineering | Software & AI | Quantum Technologies",
    email: "s.haghi.career@outlook.com",
    skills: [
      "Python",
      "MATLAB",
      "C++ (coursework)",
      "Embedded C / ATmega32 (coursework)",
      "scikit-learn",
      "Streamlit",
      "GitLab CI / pytest / flake8",
    ],
    timeline: [
      {
        date: "Oct 2024 - Present",
        title: "M.Sc. Quantum Technologies in Electrical and Computer Engineering",
        place: "Technische Universität Braunschweig, Germany",
        description: "In progress (Internship and Thesis). Selected coursework: Quantum Communication Networks; Information & Coding Theory with Computational Experiments; Network Information Theory; Nonlinear Photonics; Semiconductor/GaN Technology; Quantum Information & Computing. Academic engagement includes presentations on QKD satellite communication, state-dependent channel coding, Quantum Communication Networks, and semiconductor crystal defects, plus a plasmonic-metasurface journal-club literature review.",
      },
      {
        date: "2018 - Feb 2024",
        title: "B.Sc. Computer Engineering (Professionalization subject: AI)",
        place: "Azad University, Mashhad Branch, Iran",
        description: "Overall grade: 17.28/20; ranked 5th out of 131 students. Relevant focus: Artificial Intelligence; Embedded Systems; C/C++ programming; SQL and database coursework.",
      },
    ],
    projects: [
      {
        title: "Activity Recognition and CI Configuration",
        description: "Structured a sensor-activity workflow comparing RandomForest and 1D-CNN approaches. Configured Poetry dependency management and GitLab CI quality checks with flake8 and pytest.",
      },
      {
        title: "Gas Classification Pipeline and Simulation Dashboard",
        description: "Constructed statistical features from multi-sensor time windows and used a stratified train/test workflow for six-gas RandomForest classification with class-probability output. Integrated pandas, NumPy, scikit-learn, and joblib in an interactive Streamlit simulation and probability dashboard.",
      },
      {
        title: "MRI Segmentation Inference Dashboard",
        description: "Integrated pretrained U-Net++ and EfficientNet-B4 inference workflows with preprocessing, weight loading, execution, and Streamlit visualization of masks, overlays, and outputs.",
      },
    ],
  };

  const replaceText = (el, value) => {
    if (el && el.textContent !== value) el.textContent = value;
  };

  const apply = () => {
    replaceText(document.querySelector('.navbar-brand'), content.name);
    replaceText(document.querySelector('.about-section .content h1'), content.name);
    replaceText(document.querySelector('.about-section .content > p'), content.role);

    const skillLabels = document.querySelectorAll('#expertise .MuiChip-label');
    content.skills.forEach((skill, index) => replaceText(skillLabels[index], skill));

    const timelineItems = document.querySelectorAll('#history .vertical-timeline-element');
    content.timeline.forEach((item, index) => {
      const node = timelineItems[index];
      if (!node) return;
      replaceText(node.querySelector('.vertical-timeline-element-date'), item.date);
      replaceText(node.querySelector('.vertical-timeline-element-title'), item.title);
      replaceText(node.querySelector('.vertical-timeline-element-subtitle'), item.place);
      replaceText(node.querySelector('p'), item.description);
    });

    const projectCards = document.querySelectorAll('#projects .project');
    content.projects.forEach((project, index) => {
      const node = projectCards[index];
      if (!node) return;
      replaceText(node.querySelector('h2'), project.title);
      replaceText(node.querySelector('p'), project.description);
    });

    const emailLink = document.querySelector('#contact a[href^="mailto:"]');
    if (emailLink) {
      if (emailLink.textContent !== content.email) emailLink.textContent = content.email;
      if (emailLink.getAttribute('href') !== `mailto:${content.email}`) {
        emailLink.setAttribute('href', `mailto:${content.email}`);
      }
    }
  };

  const root = document.getElementById('root');
  if (root) {
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
  window.addEventListener('load', apply);
})();
