import React from "react";

type WordmarkProps = {
  variant?: "nav" | "hero";
};

function Wordmark({ variant = "nav" }: WordmarkProps) {
  if (variant === "hero") {
    return (
      <span className="wordmark wordmark-hero" aria-label="Soroush Haghi">
        <span className="wm-s">S</span>
        <span className="wm-given-tail" aria-hidden="true">OROUSH</span>
        <span className="wm-dot" aria-hidden="true">.</span>
        <span className="wm-space" aria-hidden="true">&nbsp;</span>
        <span className="wm-surname">HAGHI</span>
      </span>
    );
  }

  return (
    <span className="wordmark wordmark-nav" aria-label="S. Haghi">
      <span className="wm-s">S</span>
      <span className="wm-nav-dot" aria-hidden="true">.</span>
      <span className="wm-nav-h">H</span>
      <span className="wm-nav-tail" aria-hidden="true">AGHI</span>
    </span>
  );
}

export default Wordmark;
