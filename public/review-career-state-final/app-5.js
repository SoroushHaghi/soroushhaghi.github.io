function drawFinalSphere(cx,cy,baseScale,reveal,settle,measureAmount){
  const R=SPHERE_R*(.18+.82*smooth(0,.62,reveal));
  const selectedKey=measure?.key||null;

  const focusX=cx;
  const focusY=cy;
  const scale=baseScale*(.96+.04*settle);
  const shellR=scale*R*(CAMERA_DISTANCE/Math.sqrt(Math.max(1,CAMERA_DISTANCE*CAMERA_DISTANCE-R*R)));

  const project=(point)=>{
    const r=rotateFinal(point);
    const persp=CAMERA_DISTANCE/(CAMERA_DISTANCE-r.z);
    return {x:focusX+r.x*scale*persp,y:focusY-r.y*scale*persp,depth:r.z,persp};
  };

  ctx.save();
  const g=ctx.createRadialGradient(cx-shellR*.22,cy-shellR*.25,shellR*.04,cx,cy,shellR);
  g.addColorStop(0,"rgba(231,239,250,.055)");
  g.addColorStop(.5,"rgba(143,166,196,.018)");
  g.addColorStop(1,"rgba(76,98,129,.025)");
  ctx.globalAlpha=reveal;ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,shellR,0,Math.PI*2);ctx.fill();ctx.restore();

  const dots=shellDots.map(d=>{
    const p={x:d.p.x*R,y:d.p.y*R,z:d.p.z*R};
    const r=rotateFinal(p),q=project(p);
    return {d,r,q};
  }).sort((a,b)=>a.r.z-b.r.z);

  for(const q of dots){
    const front=clamp01((q.r.z/R+1)/2);
    const selected=!selectedKey||q.d.basis===selectedKey;
    const dim=selectedKey?(selected?1:.08+.12*(1-measureAmount)):1;
    ctx.save();
    ctx.globalAlpha=reveal*(.05+.28*front)*q.d.j*dim;
    ctx.fillStyle=COLORS[q.d.basis];
    ctx.beginPath();ctx.arc(q.q.x,q.q.y,.65+front*.9,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  const circle=(plane,backA,frontA)=>{
    const N=220,pts=[];
    for(let i=0;i<=N;i++){
      const t=i/N*Math.PI*2;let p;
      if(plane==="xy")p={x:R*Math.cos(t),y:R*Math.sin(t),z:0};
      else if(plane==="xz")p={x:R*Math.cos(t),y:0,z:R*Math.sin(t)};
      else p={x:0,y:R*Math.cos(t),z:R*Math.sin(t)};
      const r=rotateFinal(p),q=project(p);
      pts.push({q,front:r.z>=0});
    }
    for(const want of [false,true]){
      ctx.save();ctx.globalAlpha=reveal*(want?frontA:backA);ctx.strokeStyle="rgba(225,235,248,.56)";ctx.lineWidth=.75;ctx.beginPath();
      let open=false;
      for(const z of pts){
        if(z.front===want){if(!open){ctx.moveTo(z.q.x,z.q.y);open=true}else ctx.lineTo(z.q.x,z.q.y)}
        else open=false;
      }
      ctx.stroke();ctx.restore();
    }
  };
  circle("xy",.025,.10);circle("xz",.018,.075);circle("yz",.018,.07);

  const rows=capabilities.map(item=>{
    const dir=item.semanticDirection;
    const p={x:dir.x*R*item.radialStrength,y:dir.y*R*item.radialStrength,z:dir.z*R*item.radialStrength};
    const r=rotateFinal(p),q=project(p);
    const anchor=project({x:dir.x*R,y:dir.y*R,z:dir.z*R});
    return {item,r,q,anchor};
  }).sort((a,b)=>a.r.z-b.r.z);

  const origin=project({x:0,y:0,z:0});
  for(const row of rows){
    const front=clamp01((row.r.z/R+1)/2);
    const belongs=!selectedKey||row.item.dominant===selectedKey;
    const dim=selectedKey?(belongs?1:.10+.16*(1-measureAmount)):1;
    ctx.save();
    ctx.globalAlpha=reveal*(.24+.68*front)*dim;
    ctx.strokeStyle=row.item.color;
    ctx.lineWidth=1.1+row.item.radialStrength*1.2;
    ctx.lineCap="round";
    ctx.shadowColor=row.item.color;ctx.shadowBlur=4;
    ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(row.q.x,row.q.y);ctx.stroke();ctx.restore();
    if(reveal>.82)hitRods.push({item:row.item,a:origin,b:row.q});

    ctx.save();ctx.globalAlpha=reveal*(.30+.55*front)*dim;ctx.strokeStyle=COLORS[row.item.dominant];ctx.lineWidth=.8;
    ctx.beginPath();ctx.arc(row.anchor.x,row.anchor.y,2.1+front*.8,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  const basisOrder=["CH","QH","CS","QS"];
  for(const k of basisOrder){
    const v={x:BASIS[k].x*R,y:BASIS[k].y*R,z:BASIS[k].z*R};
    const r=rotateFinal(v),q=project(v),front=clamp01((r.z/R+1)/2);
    const selected=!selectedKey||selectedKey===k;
    const dim=selectedKey?(selected?1:.10+.13*(1-measureAmount)):1;
    ctx.save();
    ctx.globalAlpha=reveal*(.45+.52*front)*dim;
    ctx.fillStyle=COLORS[k];ctx.shadowColor=COLORS[k];ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(q.x,q.y,2.7,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle="rgba(241,246,253,.90)";
    ctx.font="650 10px Inter,system-ui,sans-serif";ctx.textAlign="center";
    ctx.fillText(k,q.x,q.y-14);
    ctx.restore();
  }

  if(selectedKey&&measureAmount>0){
    const d=BASIS[selectedKey];
    const q=project({x:d.x*R*.91,y:d.y*R*.91,z:d.z*R*.91});
    ctx.save();
    ctx.globalAlpha=measureAmount*.20;ctx.strokeStyle=COLORS[selectedKey];ctx.lineWidth=12;ctx.shadowColor=COLORS[selectedKey];ctx.shadowBlur=24;
    ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(q.x,q.y);ctx.stroke();
    ctx.globalAlpha=measureAmount;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();
  }

  ctx.save();ctx.globalAlpha=reveal*.44;ctx.strokeStyle="rgba(229,237,248,.62)";ctx.lineWidth=1.15;
  ctx.beginPath();ctx.arc(cx,cy,shellR,0,Math.PI*2);ctx.stroke();ctx.restore();
}

psiButton.addEventListener("click",()=>{
  if(scrollProgress<STOPS[4]+(STOPS[5]-STOPS[4])*.80)return;
  if(measure)return;

  let r=Math.random(),sum=0,key="CS";
  for(const k of ["CH","QH","CS","QS"]){sum+=liveState[k];if(r<=sum){key=k;break}}

  equation.classList.remove("idleCue");
  measure={key,started:performance.now()};
  collapseEquationTo(key);

  measureCode.textContent="|ψCareer⟩ = |"+BASIS_NAMES[key]+"⟩";
  measureCode.style.color=COLORS[key];
  measureName.textContent="";
  measureOutput.classList.add("show");
});

requestAnimationFrame(render);