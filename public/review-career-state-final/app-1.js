"use strict";

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const sequence = document.getElementById("sequence");
const stageCopy = document.getElementById("copy");
const kicker = document.getElementById("kicker");
const headline = document.getElementById("headline");
const body = document.getElementById("body");
const equation = document.getElementById("equation");
const legend = document.getElementById("legend");
const psiButton = document.getElementById("psiButton");
const measureOutput = document.getElementById("measureOutput");
const measureCode = document.getElementById("measureCode");
const measureName = document.getElementById("measureName");
const scrollHint = document.getElementById("scrollHint");
const rodTooltip = document.getElementById("rodTooltip");
const rodTooltipName = document.getElementById("rodTooltipName");
const rodTooltipMeta = document.getElementById("rodTooltipMeta");
const psiTerms = [...document.querySelectorAll(".psiTerm")];
const stepDots = [...document.querySelectorAll(".stepDots i")];

const SPHERE_R = 115;
const AXIS_R = 132;
const CAMERA_DISTANCE = 430;
const VIEW_SPIN = (-20 * Math.PI) / 180;
const VIEW_PITCH = (-60 * Math.PI) / 180;
const VIEW_ROLL = (8 * Math.PI) / 180;
const INSPECT_SPIN = (-10 * Math.PI) / 180;
const INSPECT_PITCH = (-54 * Math.PI) / 180;
const INSPECT_ROLL = (3 * Math.PI) / 180;

const COLORS = {
  Knowledge:"#4b86d8",
  Experience:"#cf5a5a",
  QH:"#63e6be",
  QS:"#cf7cff",
  CH:"#5e9fff",
  CS:"#f0b957"
};

/* capabilities are loaded from data.js */

function clamp01(v){return Math.max(0,Math.min(1,v))}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function smooth(a,b,v){
  const t=clamp01((v-a)/Math.max(1e-6,b-a));
  return t*t*(3-2*t);
}
function smooth01(v){return smooth(0,1,v)}
function normalize(x,y,z){
  const n=Math.hypot(x,y,z)||1;
  return {x:x/n,y:y/n,z:z/n};
}
function mixDirection(a,b,t){
  return normalize(lerp(a.x,b.x,t),lerp(a.y,b.y,t),lerp(a.z,b.z,t));
}
function dot(a,b){return a.x*b.x+a.y*b.y+a.z*b.z}
function add4(a,b,c,d){return {x:a.x+b.x+c.x+d.x,y:a.y+b.y+c.y+d.y,z:a.z+b.z+c.z+d.z}}
function scaleV(v,s){return {x:v.x*s,y:v.y*s,z:v.z*s}}

const BASIS={
  CH:normalize(-1,-1, 1),
  QH:normalize(-1, 1,-1),
  CS:normalize( 1,-1,-1),
  QS:normalize( 1, 1, 1)
};

const KNOWLEDGE_MAX = 100;
const EXPERIENCE_MAX = 100;
const COMBINED_MAX = KNOWLEDGE_MAX + EXPERIENCE_MAX;
const DEPTH_VALUE_R = 100;

for(const item of capabilities){
  item.knowledge100=clamp(item.K*100,0,KNOWLEDGE_MAX);
  item.experience100=clamp(item.E*100,0,EXPERIENCE_MAX);
  const sourceValue=item.mode==="Knowledge" ? item.knowledge100 : item.experience100;
  const depthSign=item.mode==="Knowledge" ? 1 : -1;

  item.base2D={x:item.x,y:item.y,z:0};
  item.zValue=depthSign*sourceValue;
  item.initialDirection={x:0,y:0,z:depthSign};
  item.oldFinalDirection=normalize(item.x,item.y,item.zValue);
  item.depthLength=(sourceValue/100)*DEPTH_VALUE_R;
  item.radialStrength=clamp01((item.knowledge100+item.experience100)/COMBINED_MAX);
  item.rodLength=item.radialStrength*SPHERE_R;
  item.color=COLORS[item.mode];

  const sx=clamp(item.x/100,-1,1);
  const sy=clamp(item.y/100,-1,1);
  const pS=(sx+1)/2, pH=1-pS, pQ=(sy+1)/2, pC=1-pQ;
  item.w={QH:pQ*pH,QS:pQ*pS,CH:pC*pH,CS:pC*pS};
  const b=add4(
    scaleV(BASIS.QH,item.w.QH),
    scaleV(BASIS.QS,item.w.QS),
    scaleV(BASIS.CH,item.w.CH),
    scaleV(BASIS.CS,item.w.CS)
  );
  item.semanticDirection=normalize(b.x,b.y,b.z);
  item.dominant=Object.entries(item.w).sort((a,b)=>b[1]-a[1])[0][0];
}

const liveState={QH:0,QS:0,CH:0,CS:0};
let den=0;
for(const item of capabilities){
  const weight=Math.max(.08,item.score/5);
  den+=weight;
  for(const k of ["QH","QS","CH","CS"]) liveState[k]+=item.w[k]*weight;
}
for(const k of ["QH","QS","CH","CS"]) liveState[k]/=den;

const shellDots=[];
const N=3200, golden=Math.PI*(3-Math.sqrt(5));
for(let i=0;i<N;i++){
  const y=1-(i/(N-1))*2;
  const r=Math.sqrt(Math.max(0,1-y*y));
  const a=golden*i;
  const p={x:Math.cos(a)*r,y,z:Math.sin(a)*r};
  let basis="QH",best=-Infinity;
  for(const k of ["QH","QS","CH","CS"]){
    const d=dot(p,BASIS[k]);
    if(d>best){best=d;basis=k}
  }
  shellDots.push({p,basis,j:.78+((i*41)%101)/101*.22});
}

const STOPS=[0,.18,.36,.58,.78,1];
const STAGE_COPY=[
  ["","", ""],
  ["01 · Bachelor","Computer Engineering",""],
  ["02 · Master","Quantum Engineering",""],
  ["03 · Evidence","Every dot<br>is<br>one step.",""],
  ["04 · Depth","Each step<br>is either<br>knowledge or experience.",""],
  ["05 · Superposition","I am a qubit<br>in superposition<br>of 4 states.",""]
];
const BASIS_NAMES={QH:"Quantum Hardware",QS:"Quantum Computing",CH:"Classical Hardware",CS:"Classical Computing"};
let dpr=1,W=1,H=1;
let scrollProgress=0;
let userSpin=0;
let userPitch=0;
let inspectSpin=0,inspectPitch=0,autoSpin=0,lastFrameNow=0;
let pointerX=0,pointerY=0,hitRods=[];
let dragging=false,lastX=0,lastY=0;
let wheelLockUntil=0,wheelRAF=null,activeStage=0,measure=null;