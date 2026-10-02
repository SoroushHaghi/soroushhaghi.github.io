import React from "react";
import DynamicBackground from "./DynamicBackground";

function BackgroundStage(){
  return <section className="background-live-stage">
    <DynamicBackground/>
    <div className="background-stage-content"/>
  </section>;
}
export default BackgroundStage;
