import React from "react";
import DynamicBackground from "./DynamicBackground";

function BackgroundStage(){
  return <section className="background-live-stage">
    <DynamicBackground/>
    <div className="background-stage-content">
      <div className="background-glass-sheet sheet-a glass-panel">01</div>
      <div className="background-glass-sheet sheet-b glass-panel">02</div>
      <div className="background-glass-sheet sheet-c glass-panel">03</div>
    </div>
  </section>;
}
export default BackgroundStage;
