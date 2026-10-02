import React from "react";
import { BackgroundValues } from "../backgroundConfig";

type Props = {
  values: BackgroundValues;
  onChange: (key: keyof BackgroundValues, value: number) => void;
};

function BackgroundControls({ values, onChange }: Props) {
  return (
    <aside className="background-controls glass-panel">
      <label>
        <span>Light intensity <strong>{values.intensity.toFixed(2)}</strong></span>
        <input type="range" min=".08" max=".72" step=".01" value={values.intensity} onChange={(e) => onChange("intensity", Number(e.target.value))} />
      </label>
    </aside>
  );
}

export default BackgroundControls;
