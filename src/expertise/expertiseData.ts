export type ExpertiseCapability = {
  id: string;
  name: string;
  provenance: "Education" | "Work";
  mode: "Knowledge" | "Experience";
  x: number;
  y: number;
  score: number;
  K: number;
  E: number;
};

export type ExpertiseTarget = {
  id: string;
  name: string;
  support: number;
  pos: { x: number; y: number; z: number };
};

export const expertiseCapabilities: ExpertiseCapability[] = [{"id":"qinfo","name":"Quantum Information","provenance":"Education","mode":"Knowledge","x":42,"y":78,"score":4.0,"K":0.94,"E":0.28},{"id":"qalgo","name":"Quantum Algorithms","provenance":"Education","mode":"Knowledge","x":70,"y":84,"score":3.0,"K":0.88,"E":0.38},{"id":"qpl","name":"QPL / CV Quantum Computing","provenance":"Education","mode":"Knowledge","x":20,"y":90,"score":4.0,"K":0.88,"E":0.32},{"id":"qcomm","name":"Quantum Communication Networks","provenance":"Education","mode":"Knowledge","x":27,"y":70,"score":4.0,"K":0.88,"E":0.36},{"id":"qkd","name":"QKD / Optical Networks","provenance":"Education","mode":"Knowledge","x":-10,"y":74,"score":3.0,"K":0.76,"E":0.3},{"id":"qml","name":"Quantum Machine Learning","provenance":"Education","mode":"Knowledge","x":78,"y":58,"score":1.0,"K":0.7,"E":0.2},{"id":"qhardware","name":"Quantum Hardware Platforms","provenance":"Education","mode":"Knowledge","x":-60,"y":84,"score":3.0,"K":0.78,"E":0.2},{"id":"qphysics","name":"Quantum Physics Foundations","provenance":"Education","mode":"Knowledge","x":-44,"y":63,"score":4.0,"K":0.9,"E":0.18},{"id":"photonicqc","name":"Photonic Quantum Computing","provenance":"Education","mode":"Knowledge","x":-20,"y":88,"score":3.0,"K":0.78,"E":0.22},{"id":"nonlinear","name":"Nonlinear Photonics","provenance":"Education","mode":"Knowledge","x":-52,"y":18,"score":4.0,"K":0.92,"E":0.4},{"id":"nano","name":"Nano Optics / Plasmonics","provenance":"Education","mode":"Knowledge","x":-64,"y":7,"score":2.0,"K":0.72,"E":0.18},{"id":"em","name":"Electromagnetics / Field Theory","provenance":"Education","mode":"Knowledge","x":-72,"y":-18,"score":4.0,"K":0.91,"E":0.33},{"id":"semi","name":"Semiconductor Technology","provenance":"Education","mode":"Knowledge","x":-76,"y":-39,"score":3.0,"K":0.78,"E":0.2},{"id":"gan","name":"GaN Technology","provenance":"Education","mode":"Knowledge","x":-80,"y":-25,"score":3.0,"K":0.74,"E":0.18},{"id":"materials","name":"Crystal Defects / Materials","provenance":"Education","mode":"Knowledge","x":-73,"y":-51,"score":3.0,"K":0.7,"E":0.24},{"id":"coding","name":"Information & Coding Theory","provenance":"Education","mode":"Knowledge","x":34,"y":-16,"score":4.0,"K":0.88,"E":0.38},{"id":"nit","name":"Network Information Theory","provenance":"Education","mode":"Knowledge","x":26,"y":-5,"score":4.0,"K":0.84,"E":0.28},{"id":"formal","name":"Formal Languages / Automata","provenance":"Education","mode":"Knowledge","x":61,"y":-78,"score":3.0,"K":0.76,"E":0.46},{"id":"sql","name":"SQL","provenance":"Education","mode":"Knowledge","x":79,"y":-94,"score":1.0,"K":0.56,"E":0.16},{"id":"embedded","name":"Embedded / ATmega32","provenance":"Education","mode":"Experience","x":-42,"y":-72,"score":2.0,"K":0.56,"E":0.72},{"id":"cpp","name":"C / C++ Implementation","provenance":"Education","mode":"Experience","x":74,"y":-87,"score":2.0,"K":0.54,"E":0.62},{"id":"codinglab","name":"Coding Theory Computational Lab","provenance":"Education","mode":"Experience","x":46,"y":-20,"score":2.0,"K":0.62,"E":0.58},{"id":"itsupport","name":"IT Support / Hardware","provenance":"Work","mode":"Experience","x":-86,"y":-88,"score":4.0,"K":0.4,"E":0.88},{"id":"networkinfra","name":"Local Networking / Infrastructure","provenance":"Work","mode":"Experience","x":-57,"y":-84,"score":3.0,"K":0.48,"E":0.78},{"id":"career","name":"Career OS","provenance":"Work","mode":"Experience","x":91,"y":-34,"score":4.6,"K":0.76,"E":0.88},{"id":"website","name":"Portfolio Website","provenance":"Work","mode":"Experience","x":96,"y":-27,"score":3.0,"K":0.56,"E":0.74},{"id":"pythonml","name":"Python ML Applications","provenance":"Work","mode":"Experience","x":84,"y":-75,"score":4.0,"K":0.72,"E":0.86},{"id":"activity","name":"Activity Recognition + CI","provenance":"Work","mode":"Experience","x":82,"y":-67,"score":3.0,"K":0.62,"E":0.78},{"id":"mri","name":"MRI Segmentation Inference","provenance":"Work","mode":"Experience","x":80,"y":-58,"score":4.0,"K":0.66,"E":0.82},{"id":"vehicle","name":"Vehicle Detection","provenance":"Work","mode":"Experience","x":59,"y":-56,"score":3.0,"K":0.6,"E":0.72},{"id":"image","name":"Image Processing","provenance":"Work","mode":"Experience","x":53,"y":-45,"score":3.0,"K":0.58,"E":0.7},{"id":"ta","name":"Teaching Assistant / Exercise Class","provenance":"Work","mode":"Experience","x":61,"y":-78,"score":3.0,"K":0.64,"E":0.68},{"id":"gitci","name":"Git / CI / Technical Tooling","provenance":"Work","mode":"Experience","x":92,"y":-53,"score":4.0,"K":0.56,"E":0.86}];

export const expertiseTargets: ExpertiseTarget[] = [{"id":"t_qcomm","name":"Quantum Communication / QKD","support":72.4,"pos":{"x":12.4236888423026,"y":91.78571455734595,"z":68.16182625742255}},{"id":"t_qsoft","name":"Quantum Software / Simulation","support":73.2,"pos":{"x":81.54267710732842,"y":69.0308377628177,"z":42.550384815340045}},{"id":"t_phot","name":"Photonics / Quantum Optics","support":70.3,"pos":{"x":-62.96354598458815,"y":65.54401918067784,"z":70.45972911308695}},{"id":"t_semi","name":"Semiconductor / Device / Test","support":64.4,"pos":{"x":-87.47235792376003,"y":-47.734279098409196,"z":57.402310042478206}},{"id":"t_emb","name":"Embedded / Firmware / Hardware-near","support":60.4,"pos":{"x":-31.930777359325308,"y":-108.29339357414759,"z":-21.86244189069391}},{"id":"t_test","name":"Test Automation / Validation","support":71.7,"pos":{"x":76.38107776484793,"y":-83.09474861986331,"z":-22.049800708441282}},{"id":"t_soft","name":"Python / Software Systems","support":77.8,"pos":{"x":98.09404962786563,"y":-58.63155664086574,"z":-12.841261366189375}},{"id":"t_sensor","name":"Sensor AI / Automotive Validation","support":65.7,"pos":{"x":81.1654959605033,"y":-80.25872669258231,"z":-13.98924784149944}}];

/**
 * Curated views of the canonical capability set for smaller contextual spheres.
 *
 * These arrays do not introduce new claims or scores. They only select existing
 * capability records so the same career-state geometry can be reused in a
 * degree or domain context.
 */
export const expertiseViews = {
  master: [
    "qinfo",
    "qalgo",
    "qpl",
    "qcomm",
    "qkd",
    "qml",
    "qhardware",
    "qphysics",
    "photonicqc",
    "nonlinear",
    "nano",
    "em",
    "semi",
    "gan",
    "materials",
    "coding",
    "nit",
    "codinglab",
  ],
  bachelor: [
    "formal",
    "sql",
    "embedded",
    "cpp",
    "itsupport",
    "networkinfra",
    "vehicle",
    "image",
    "ta",
  ],
  quantum: [
    "qinfo",
    "qalgo",
    "qpl",
    "qcomm",
    "qkd",
    "qml",
    "qhardware",
    "qphysics",
    "photonicqc",
  ],
  photonics: [
    "photonicqc",
    "nonlinear",
    "nano",
    "qkd",
    "em",
  ],
  "devices-sensing": [
    "qhardware",
    "semi",
    "gan",
    "materials",
    "embedded",
    "itsupport",
    "activity",
  ],
  "software-systems": [
    "qalgo",
    "qpl",
    "formal",
    "sql",
    "cpp",
    "codinglab",
    "career",
    "website",
    "pythonml",
    "activity",
    "mri",
    "vehicle",
    "gitci",
  ],
  "ai-perception": [
    "qml",
    "pythonml",
    "activity",
    "mri",
    "vehicle",
    "image",
  ],
  communication: [
    "qcomm",
    "qkd",
    "coding",
    "nit",
    "networkinfra",
  ],
} as const;

export type ExpertiseViewKey = keyof typeof expertiseViews;
