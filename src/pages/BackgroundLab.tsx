import React from "react";
import BackgroundControls from "../components/BackgroundControls";
import BackgroundModeGrid from "../components/BackgroundModeGrid";
import BackgroundStage from "../components/BackgroundStage";
import { useBackgroundLab } from "../useBackgroundLab";
import "../backgroundLab.scss";

function BackgroundLab(){
  const x=useBackgroundLab();
  return <main className="subpage page-shell background-lab-page">
    <h1>Dynamic optical background</h1>
    <BackgroundModeGrid value={x.values.mode} onChange={x.mode}/>
    <div className="background-lab-layout">
      <BackgroundControls values={x.values} onChange={x.number}/>
      <BackgroundStage/>
    </div>
  </main>;
}
export default BackgroundLab;
