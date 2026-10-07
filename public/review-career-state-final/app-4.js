function render(now){
  requestAnimationFrame(render);
  stageText(scrollProgress);
  const frameNow=now||performance.now();
  const measureAmount=measurementAmount(frameNow);

  if(lastFrameNow){
    const dt=Math.min(40,frameNow-lastFrameNow);
    const sphereSettled=scrollProgress>=STOPS[4]+(STOPS[5]-STOPS[4])*.88;
    if(sphereSettled&&!dragging&&!measure){
      autoSpin=(autoSpin+dt*.000045)%(Math.PI*2);
    }
  }
  lastFrameNow=frameNow;
  hitRods=[];

  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle="#020406";ctx.fillRect(0,0,W,H);

  const p=scrollProgress;
  const xAxisIn=segment(p,STOPS[0],STOPS[1]);
  const yAxisIn=segment(p,STOPS[1],STOPS[2]);
  const planeIn=segment(p,STOPS[1]+(STOPS[2]-STOPS[1])*.42,STOPS[2]);
  const pointsIn=segment(p,STOPS[2],STOPS[3]);
  const zAxisIn=segment(p,STOPS[3],STOPS[4]);
  const rodsGrow=zAxisIn;

  const finalIn=segment(p,STOPS[4],STOPS[5]);
  const pointsOut=smooth(0,.15,finalIn);
  const centering=smooth(.06,.32,finalIn);
  const planeFade=1-smooth(.03,.27,finalIn);
  const collapse=smooth(.22,.61,finalIn);
  const sphereReveal=smooth(.61,.98,finalIn);
  const settle=smooth(.88,1,finalIn);
  const hold=smooth(.12,.24,finalIn)*(1-smooth(.36,.47,finalIn));

  const desktop=W>900;
  const centerX=desktop?W*.56:W*.52,centerY=desktop?H*.49:H*.42;
  const leftReserve=desktop?Math.max(280,W*.29):10;
  const sideSafe=W<760?18:44,topSafe=W<760?110:92,bottomSafe=W<760?56:66,labelReserve=50;
  const availableLeft=Math.max(110,centerX-leftReserve-sideSafe-labelReserve);
  const availableRight=Math.max(110,W-sideSafe-centerX-labelReserve);
  const scaleX=Math.min(availableLeft,availableRight)/AXIS_R;
  const scaleTop=(centerY-topSafe-labelReserve)/AXIS_R;
  const scaleBottom=(H-bottomSafe-centerY-labelReserve)/AXIS_R;
  const fittedScale=(desktop?.93:1.06)*Math.max(.54,Math.min(scaleX,scaleTop,scaleBottom));
  const view=makeView();

  const projectLegacy=(point,legacyScale=1)=>{
    const q={x:point.x*legacyScale,y:point.y*legacyScale,z:point.z*legacyScale};
    const r=rotateLegacy(q,view);
    const persp=CAMERA_DISTANCE/(CAMERA_DISTANCE-r.z);
    return {x:centerX+r.x*fittedScale*persp,y:centerY-r.y*fittedScale*persp,depth:r.z,persp};
  };

  const line=(a,b,stroke,width=1,alpha=1)=>{
    ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();
  };
  const dot2=(a,r,fill,alpha=1,blur=0)=>{
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=fill;if(blur){ctx.shadowColor=fill;ctx.shadowBlur=blur}
    ctx.beginPath();ctx.arc(a.x,a.y,r,0,Math.PI*2);ctx.fill();ctx.restore();
  };
  const label=(text,a,alpha,dx=0,dy=0)=>{
    if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle="rgba(229,235,244,.57)";
    ctx.font="600 10px Inter,system-ui,sans-serif";ctx.textAlign="center";ctx.fillText(text,a.x+dx,a.y+dy);ctx.restore();
  };
  const arrow=(neg,pos,alpha)=>{
    line(neg,pos,"rgba(224,232,242,.72)",1,alpha);
    for(const [tip,from] of [[neg,pos],[pos,neg]]){
      const ang=Math.atan2(tip.y-from.y,tip.x-from.x),s=8,sp=.48;
      line(tip,{x:tip.x-s*Math.cos(ang-sp),y:tip.y-s*Math.sin(ang-sp)},"rgba(224,232,242,.72)",1,alpha);
      line(tip,{x:tip.x-s*Math.cos(ang+sp),y:tip.y-s*Math.sin(ang+sp)},"rgba(224,232,242,.72)",1,alpha);
    }
  };
  const axisLabel=(text,end,alpha,gap=25)=>{
    const dx=end.x-centerX,dy=end.y-centerY,n=Math.hypot(dx,dy)||1;
    label(text,end,alpha,(dx/n)*gap,(dy/n)*gap);
  };

  const glow=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,Math.max(W,H)*.68);
  glow.addColorStop(0,"rgba(31,46,66,.10)");glow.addColorStop(.58,"rgba(8,15,22,.025)");glow.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  const legacyScale=1-collapse;

  if(planeIn>.001 && planeFade>.001 && collapse<.999){
    const gridCount=5,extent=100;
    for(let i=-gridCount;i<=gridCount;i++){
      const v=i/gridCount*extent;
      const a=projectLegacy({x:-extent,y:v,z:0},legacyScale);
      const b=projectLegacy({x: extent,y:v,z:0},legacyScale);
      const c=projectLegacy({x:v,y:-extent,z:0},legacyScale);
      const d=projectLegacy({x:v,y: extent,z:0},legacyScale);
      line(a,b,"rgba(170,187,208,.28)",1,.095*planeIn*planeFade*(1-collapse));
      line(c,d,"rgba(170,187,208,.28)",1,.095*planeIn*planeFade*(1-collapse));
    }
  }

  if(pointsIn>.001 && pointsOut<1 && collapse<.999){
    const alpha=pointsIn*(1-pointsOut)*(1-collapse);
    for(const item of capabilities){
      dot2(projectLegacy(item.base2D,legacyScale),2.8,"#dde5ef",alpha*.90);
    }
  }

  if(rodsGrow>.001 && collapse<.999){
    for(const item of capabilities){
      const base={
        x:lerp(item.base2D.x,0,centering),
        y:lerp(item.base2D.y,0,centering),
        z:0
      };
      const dir=mixDirection(item.initialDirection,item.oldFinalDirection,centering);
      const visible=lerp(item.depthLength,item.rodLength,centering)*rodsGrow;
      const tip={x:base.x+dir.x*visible,y:base.y+dir.y*visible,z:dir.z*visible};

      const a=projectLegacy(base,legacyScale);
      const b=projectLegacy(tip,legacyScale);
      line(a,b,item.color,1.35+(item.rodLength/SPHERE_R)*1.8,.82*(1-collapse));
      dot2(b,2+(item.rodLength/SPHERE_R)*1.4,item.color,.92*(1-collapse),4);
      if(zAxisIn>.72&&collapse<.35)hitRods.push({item,a,b});
    }
  }

  if(xAxisIn>.001 && collapse<.999){
    const ex=AXIS_R*xAxisIn;
    const l=projectLegacy({x:-ex,y:0,z:0},legacyScale),r=projectLegacy({x:ex,y:0,z:0},legacyScale);
    arrow(l,r,.30*xAxisIn*(1-collapse));axisLabel("HARDWARE",l,.64*xAxisIn*(1-collapse),42);axisLabel("SOFTWARE",r,.64*xAxisIn*(1-collapse),42);
  }
  if(yAxisIn>.001 && collapse<.999){
    const ex=AXIS_R*yAxisIn;
    const c=projectLegacy({x:0,y:-ex,z:0},legacyScale),q=projectLegacy({x:0,y:ex,z:0},legacyScale);
    arrow(c,q,.28*yAxisIn*(1-collapse));axisLabel("CLASSICAL",c,.62*yAxisIn*(1-collapse),42);axisLabel("QUANTUM",q,.62*yAxisIn*(1-collapse),42);
  }
  if(zAxisIn>.001 && collapse<.999){
    const ex=AXIS_R*zAxisIn;
    const e=projectLegacy({x:0,y:0,z:-ex},legacyScale),k=projectLegacy({x:0,y:0,z:ex},legacyScale);
    arrow(e,k,.28*zAxisIn*(1-collapse));axisLabel("EXPERIENCE",e,.64*zAxisIn*(1-collapse),42);axisLabel("KNOWLEDGE",k,.64*zAxisIn*(1-collapse),42);
  }

  if(collapse>.001 && sphereReveal<.75){
    const c=collapse;
    const r=4+20*(1-c);
    const core=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,40+70*(1-c));
    core.addColorStop(0,`rgba(0,0,0,${.98})`);
    core.addColorStop(.30,`rgba(29,56,92,${.20+.28*c})`);
    core.addColorStop(.62,`rgba(74,127,189,${.06+.12*c})`);
    core.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=core;ctx.beginPath();ctx.arc(centerX,centerY,120,0,Math.PI*2);ctx.fill();

    ctx.save();
    ctx.globalAlpha=.10+.34*c;
    ctx.strokeStyle="rgba(119,176,239,.44)";
    ctx.shadowColor="rgba(96,158,231,.55)";ctx.shadowBlur=14;
    for(let i=0;i<26;i++){
      const a=i/26*Math.PI*2 + c*.7;
      const rr=28+((i*19)%37);
      const x1=centerX+Math.cos(a)*rr*(1-c);
      const y1=centerY+Math.sin(a)*rr*(1-c);
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(centerX,centerY);ctx.stroke();
    }
    ctx.restore();
    dot2({x:centerX,y:centerY},r,"#000",1,0);
  }

  if(sphereReveal>.001){
    drawFinalSphere(centerX,centerY,fittedScale,sphereReveal,settle,measureAmount);
  }

  if(!dragging)canvas.style.cursor=(interactiveDepthStage()||interactiveFinalStage())?"grab":"default";
  updateRodTooltip();

  if(hold>.001 && collapse<.001){
    const pulse=.5+.5*Math.sin(performance.now()/420);
    ctx.save();ctx.globalAlpha=.08*hold*hold;
    ctx.strokeStyle="rgba(151,194,244,.7)";ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(centerX,centerY,6+8*pulse,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
}