import React from "react";
import DynamicBackground from "./DynamicBackground";

function BackgroundStage(){
  return <section className="background-live-stage">
    <DynamicBackground/>
    <div className="background-stage-content">
      <div className="background-glass-sheet glass-panel">01</div>
    </div>
  </section>;
}
export default BackgroundStage;
