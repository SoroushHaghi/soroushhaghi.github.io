import React from "react";

function SignaturePlaceholder() {
  return (
    <div className="signature-placeholder" aria-label="Reserved 3D signature visual area">
      <div className="volume volume-a" />
      <div className="volume volume-b" />
      <div className="volume volume-c" />
      <div className="signature-axis axis-x" />
      <div className="signature-axis axis-y" />
      <div className="signature-axis axis-z" />
      <div className="signature-label">
        <span>3D SIGNATURE VISUAL</span>
        <small>Reserved spatial system</small>
      </div>
    </div>
  );
}

export default SignaturePlaceholder;
