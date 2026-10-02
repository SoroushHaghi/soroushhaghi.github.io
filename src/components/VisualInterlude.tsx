import React from "react";

function VisualInterlude() {
  return (
    <section className="visual-interlude" aria-label="Dynamic visual pause">
      <div className="interlude-field" aria-hidden="true">
        <div className="interlude-orbit interlude-orbit-a" />
        <div className="interlude-orbit interlude-orbit-b" />
        <div className="interlude-wave interlude-wave-a" />
        <div className="interlude-wave interlude-wave-b" />
        <div className="interlude-caustic interlude-caustic-a" />
        <div className="interlude-caustic interlude-caustic-b" />
        <div className="interlude-core" />
        <div className="interlude-scan" />
      </div>
    </section>
  );
}

export default VisualInterlude;
