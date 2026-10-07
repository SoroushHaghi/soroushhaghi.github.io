import React from "react";
import { BackgroundMode, backgroundModes } from "../backgroundConfig";

type Props={value:BackgroundMode;onChange:(mode:BackgroundMode)=>void};

function BackgroundModeGrid({value,onChange}:Props){
  return <div className="background-mode-grid">
    {backgroundModes.map(([id,title,copy])=><button key={id} type="button" className={value===id?"background-mode-card active":"background-mode-card"} onClick={()=>onChange(id)}>
      <strong>{title}</strong><span>{copy}</span>
    </button>)}
  </div>;
}
export default BackgroundModeGrid;
