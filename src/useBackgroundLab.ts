import { useState } from "react";
import { applyBackground, backgroundDefaults, BackgroundMode, BackgroundValues } from "./backgroundConfig";

export function useBackgroundLab() {
  const [values,setValues]=useState<BackgroundValues>(backgroundDefaults);
  const number=(key:keyof BackgroundValues,value:number)=>{
    const next={...values,[key]:value}; setValues(next); applyBackground(next);
  };
  const mode=(mode:BackgroundMode)=>{
    const next={...values,mode}; setValues(next); applyBackground(next);
  };
  const reset=()=>{ setValues(backgroundDefaults); applyBackground(backgroundDefaults); };
  return {values,number,mode,reset};
}
