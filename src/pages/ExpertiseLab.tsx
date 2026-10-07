import React from "react";
import ExpertiseSphere from "../components/ExpertiseSphere";

function ExpertiseLab() {
  return (
    <main className="page-shell" style={{ paddingTop: "140px", paddingBottom: "96px" }}>
      <div style={{ marginBottom: "28px", maxWidth: "760px" }}>
        <div className="eyebrow">EXPERTISE SPACE / RENDERER LAB</div>
        <h1 style={{ margin: "10px 0 12px" }}>Geometry first. Visual language next.</h1>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          Isolated integration surface for the Career OS expertise sphere. This lab keeps the
          redesign safe while shell geometry, projection, materials, labels and interaction are
          iterated before the component replaces the current Home expertise index.
        </p>
      </div>
      <ExpertiseSphere />
    </main>
  );
}

export default ExpertiseLab;
