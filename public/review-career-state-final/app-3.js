canvas.addEventListener("pointerdown",e=>{
  pointerX=e.clientX;pointerY=e.clientY;
  if(!(interactiveDepthStage()||interactiveFinalStage()))return;
  dragging=true;lastX=e.clientX;lastY=e.clientY;
  rodTooltip.classList.remove("show");
  canvas.style.cursor="grabbing";
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove",e=>{
  pointerX=e.clientX;pointerY=e.clientY;
  if(dragging){
    const dx=e.clientX-lastX,dy=e.clientY-lastY;
    if(interactiveFinalStage()){
      userSpin+=dx*.006;
      userPitch=clamp(userPitch+dy*.004,-.45,.45);
    }else{
      inspectSpin=clamp(inspectSpin+dx*.0045,-.18,.18);
      inspectPitch=clamp(inspectPitch+dy*.0035,-.12,.12);
    }
    lastX=e.clientX;lastY=e.clientY;
    return;
  }
  updateRodTooltip();
});
canvas.addEventListener("pointerup",e=>{
  dragging=false;
  canvas.style.cursor=(interactiveDepthStage()||interactiveFinalStage())?"grab":"default";
  try{canvas.releasePointerCapture(e.pointerId)}catch{}
});
canvas.addEventListener("pointercancel",()=>{
  dragging=false;canvas.style.cursor="default";rodTooltip.classList.remove("show");
});
canvas.addEventListener("pointerleave",()=>{
  if(!dragging)rodTooltip.classList.remove("show");
});

function stageText(p){
  const final=segment(p,STOPS[4]+(STOPS[5]-STOPS[4])*.78,STOPS[5]);
  const ready=final>.32;
  equation.classList.toggle("show",ready);
  equation.classList.toggle("idleCue",ready && !measure);
  legend.classList.toggle("show",final>.48);
  if(scrollHint){
    scrollHint.style.opacity = p < .12 ? "1" : "0";
  }
}

function segment(v,a,b){return smooth(a,b,v)}

function makeView(){
  const rotation=segment(scrollProgress,STOPS[3],STOPS[4]);
  const depthInteractive=segment(scrollProgress,STOPS[3],STOPS[4]);
  const baseSpin=VIEW_SPIN*rotation;
  const basePitch=VIEW_PITCH*rotation;
  const baseRoll=VIEW_ROLL*rotation;

  const inspectionBlend=smooth01(depthInteractive)*0.62;
  return {
    spin:lerp(baseSpin,INSPECT_SPIN,inspectionBlend)+inspectSpin*depthInteractive,
    pitch:lerp(basePitch,INSPECT_PITCH,inspectionBlend)+inspectPitch*depthInteractive,
    roll:lerp(baseRoll,INSPECT_ROLL,inspectionBlend)
  };
}

function rotateLegacy(point,view){
  const cs=Math.cos(view.spin),ss=Math.sin(view.spin);
  const x1=cs*point.x-ss*point.y;
  const y1=ss*point.x+cs*point.y;
  const z1=point.z;

  const cp=Math.cos(view.pitch),sp=Math.sin(view.pitch);
  const x2=x1;
  const y2=cp*y1-sp*z1;
  const z2=sp*y1+cp*z1;

  const cr=Math.cos(view.roll),sr=Math.sin(view.roll);
  return {x:cr*x2-sr*y2,y:sr*x2+cr*y2,z:z2};
}

function rotateFinal(point){
  let yaw=-.52+userSpin+autoSpin;
  let pitch=-.30+userPitch;
  const cy=Math.cos(yaw),sy=Math.sin(yaw);
  const x1=cy*point.x+sy*point.z;
  const z1=-sy*point.x+cy*point.z;
  const y1=point.y;
  const cp=Math.cos(pitch),sp=Math.sin(pitch);
  return {x:x1,y:cp*y1-sp*z1,z:sp*y1+cp*z1};
}

function resetEquationCollapse(){
  psiButton.classList.remove("measuring","recovering");
  psiButton.blur();
  psiTerms.forEach(term=>{
    term.classList.remove("selected");
    term.style.removeProperty("--collapse-shift");
    term.style.removeProperty("color");
    if(term.dataset.originalHtml) term.innerHTML=term.dataset.originalHtml;
  });
}
function collapseEquationTo(key){
  resetEquationCollapse();
  const selected=psiTerms.find(term=>term.dataset.basis===key);
  if(!selected)return;

  psiTerms.forEach(term=>{
    if(!term.dataset.originalHtml) term.dataset.originalHtml=term.innerHTML;
  });

  selected.innerHTML="|"+BASIS_NAMES[key]+"⟩";
  selected.classList.add("selected");
  selected.style.color=COLORS[key];

  requestAnimationFrame(()=>{
    const lhs=psiButton.querySelector(".psiLhs");
    const lhsBox=lhs.getBoundingClientRect();
    const selectedBox=selected.getBoundingClientRect();
    const targetLeft=lhsBox.right+8;
    const delta=targetLeft-selectedBox.left;
    selected.style.setProperty("--collapse-shift",delta+"px");
    psiButton.classList.add("measuring");
  });
}
function pointSegmentDistance(px,py,a,b){
  const vx=b.x-a.x,vy=b.y-a.y;
  const wx=px-a.x,wy=py-a.y;
  const vv=vx*vx+vy*vy||1;
  const t=clamp((wx*vx+wy*vy)/vv,0,1);
  const qx=a.x+t*vx,qy=a.y+t*vy;
  return Math.hypot(px-qx,py-qy);
}
function interactiveDepthStage(){
  return scrollProgress>=STOPS[3]-.01 && scrollProgress<=STOPS[4]+.015;
}
function interactiveFinalStage(){
  return scrollProgress>=STOPS[4]+(STOPS[5]-STOPS[4])*.70;
}
function updateRodTooltip(){
  if(dragging||measure||!(interactiveDepthStage()||interactiveFinalStage())){
    rodTooltip.classList.remove("show");
    return;
  }
  let best=null,bestD=10;
  for(const h of hitRods){
    const d=pointSegmentDistance(pointerX,pointerY,h.a,h.b);
    if(d<bestD){bestD=d;best=h}
  }
  if(!best){
    rodTooltip.classList.remove("show");
    return;
  }
  rodTooltipName.textContent=best.item.name;
  rodTooltipMeta.textContent=best.item.mode;
  rodTooltip.style.left=pointerX+"px";
  rodTooltip.style.top=pointerY+"px";
  rodTooltip.classList.add("show");
}

function measurementAmount(now){
  if(!measure)return 0;
  const t=(now-measure.started)/1000;
  if(t<.42)return smooth(0,.42,t);
  if(t<1.35)return 1;
  if(t<2.10){
    if(t>1.48&&!psiButton.classList.contains("recovering")){psiButton.classList.add("recovering");psiButton.classList.remove("measuring")}
    return 1-smooth(1.35,2.10,t);
  }
  measure=null;measureOutput.classList.remove("show");resetEquationCollapse();return 0;
}