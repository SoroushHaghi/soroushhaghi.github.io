import React, { useEffect } from "react";

function DynamicBackground() {
  useEffect(() => { document.documentElement.style.setProperty("--dynamic-ready", "1"); }, []);
  return (
    <div className="dynamic-background" aria-hidden="true">
      <div className="bg-field bg-field-a" />
      <div className="bg-field bg-field-b" />
      <div className="bg-grazing-light" />
      <div className="bg-interference bg-interference-a" />
      <div className="bg-interference bg-interference-b" />
      <div className="bg-caustic bg-caustic-a" />
      <div className="bg-caustic bg-caustic-b" />
    </div>
  );
}

export default DynamicBackground;
