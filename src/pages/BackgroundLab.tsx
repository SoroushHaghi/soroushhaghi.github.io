import React from "react";
import BackgroundControls from "../components/BackgroundControls";
import BackgroundModeGrid from "../components/BackgroundModeGrid";
import BackgroundStage from "../components/BackgroundStage";
import { backgroundPresets } from "../backgroundConfig";
import { toPublicPath } from "../routes";
import { useBackgroundLab } from "../useBackgroundLab";
import "../backgroundLab.scss";

function BackgroundLab(){
  const x=useBackgroundLab();
  return <main className="subpage page-shell background-lab-page">
    <div className="background-lab-heading">
      <div>
        <span className="eyebrow">DEV ONLY</span>
        <h1>Dynamic optical background</h1>
        <p>Choose the physical behavior first, then tune the material response. Values are saved locally and affect the redesign preview.</p>
      </div>
      <a className="background-lab-link" href={toPublicPath("/lab")}>Style Lab →</a>
    </div>
    <BackgroundModeGrid value={x.values.mode} onChange={x.mode}/>
    <div className="background-preset-grid" aria-label="Background preview presets">
      {backgroundPresets.map((preset)=><button key={preset.id} type="button" onClick={()=>x.preset(preset.values)}>
        <strong>{preset.title}</strong><span>{preset.copy}</span>
      </button>)}
    </div>
    <div className="background-lab-layout">
      <BackgroundControls values={x.values} onChange={x.number} onReset={x.reset}/>
      <BackgroundStage/>
    </div>
  </main>;
}
export default BackgroundLab;
