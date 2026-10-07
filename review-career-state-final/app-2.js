function resize(){
  const rect=canvas.getBoundingClientRect();
  W=Math.max(1,rect.width);H=Math.max(1,rect.height);
  dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
}
resize();
addEventListener("resize",resize);

function nearestStage(){
  let idx=0,best=Infinity;
  STOPS.forEach((stop,i)=>{const d=Math.abs(stop-scrollProgress);if(d<best){best=d;idx=i}});
  return idx;
}
function applyStage(i){
  if(i===activeStage && kicker.dataset.ready==="1")return;
  activeStage=i;kicker.dataset.ready="1";
  const [e,h,b]=STAGE_COPY[i];
  kicker.textContent=e;headline.innerHTML=h;body.textContent=b;
  stageCopy.style.opacity=i===0 ? "0" : "1";
  stepDots.forEach((dot,n)=>dot.classList.toggle("on",i>0 && n===i-1));
}
function updateScroll(){
  const r=sequence.getBoundingClientRect();
  const travel=Math.max(1,sequence.offsetHeight-innerHeight);
  scrollProgress=clamp01(-r.top/travel);
  applyStage(nearestStage());
}
function animateTo(targetY,duration=1100){
  const startY=scrollY,distance=targetY-startY,started=performance.now();
  if(wheelRAF!==null)cancelAnimationFrame(wheelRAF);
  const tick=now=>{
    const t=clamp01((now-started)/duration);
    const e=t*t*t*(t*(t*6-15)+10);
    scrollTo(0,startY+distance*e);
    if(t<1)wheelRAF=requestAnimationFrame(tick);else wheelRAF=null;
  };
  wheelRAF=requestAnimationFrame(tick);
}
function onWheel(event){
  const r=sequence.getBoundingClientRect();
  const active=r.top<=1 && r.bottom>=innerHeight-1;
  if(!active || Math.abs(event.deltaY)<4)return;
  const dir=event.deltaY>0?1:-1;
  if((dir<0&&scrollProgress<=.001)||(dir>0&&scrollProgress>=.999))return;
  event.preventDefault();
  const now=performance.now();if(now<wheelLockUntil)return;
  const current=nearestStage();
  const next=clamp(current+dir,0,STOPS.length-1);
  const sectionTop=scrollY+r.top;
  const travel=Math.max(1,sequence.offsetHeight-innerHeight);
  const duration=next===STOPS.length-1 ? 2800 : 1100;
  wheelLockUntil=now+duration+90;
  measure=null;measureOutput.classList.remove("show");resetEquationCollapse();
  animateTo(sectionTop+STOPS[next]*travel,duration);
}
updateScroll();
addEventListener("scroll",updateScroll,{passive:true});
addEventListener("wheel",onWheel,{passive:false});