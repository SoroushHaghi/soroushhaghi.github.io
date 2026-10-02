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

  const previewStyle = {
    "--dynamic-hue": String(x.values.hue),
    "--dynamic-intensity": String(Math.min(0.92, Math.max(0.34, x.values.intensity * 2.5))),
    "--dynamic-edge": String(Math.min(0.82, Math.max(0.26, x.values.edge * 2))),
    "--dynamic-speed": Math.max(2.5, x.values.speed / 6) + "s",
    "--dynamic-field-scale": String(x.values.scale),
  } as React.CSSProperties;

  return <main className="subpage page-shell background-lab-page">
    <div className="background-lab-heading">
      <div>
        <span className="eyebrow">DEV ONLY</span>
        <h1>Dynamic optical background</h1>
        <p>Choose the physical behavior first, then tune the material response. The large preview intentionally exaggerates light and motion so differences are easy to judge.</p>
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
      <div className="background-stage-preview" style={previewStyle}>
        <div className="background-preview-note"><strong>INSPECTION BOOST</strong><span>motion ×6 · light amplified for comparison only</span></div>
        <BackgroundStage/>
      </div>
    </div>
  </main>;
}
export default BackgroundLab;
