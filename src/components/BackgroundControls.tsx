import React from "react";
import { BackgroundValues } from "../backgroundConfig";
import { backgroundControlSpecs } from "../backgroundControlSpecs";

type NumericBackgroundKey = Exclude<keyof BackgroundValues, "mode">;

type Props = {
  values: BackgroundValues;
  onChange: (key: NumericBackgroundKey, value: number) => void;
  onReset: () => void;
};

const displayValue = (key: NumericBackgroundKey, value: number) => {
  if (key === "hue") return Math.round(value) + "°";
  if (key === "speed") return Math.round(value) + "s";
  if (key === "scale") return value.toFixed(2) + "×";
  return value.toFixed(2);
};

function BackgroundControls({ values, onChange, onReset }: Props) {
  return (
    <aside className="background-controls glass-panel">
      <div className="background-control-head">
        <div>
          <small>LIVE MATERIAL CONTROLS</small>
          <strong>Background response</strong>
        </div>
        <button type="button" onClick={onReset}>Reset</button>
      </div>

      {backgroundControlSpecs.map(([rawKey, label, min, max, step]) => {
        const key = rawKey as NumericBackgroundKey;
        const value = values[key];

        return (
          <label key={key}>
            <span>
              {label}
              <strong>{displayValue(key, value)}</strong>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => onChange(key, Number(event.target.value))}
            />
          </label>
        );
      })}

      <div className="background-control-note">
        <span>Hue controls the optical tint.</span>
        <span>Edge controls how strongly glass catches the field.</span>
        <span>Speed and scale affect the live field, not page content.</span>
      </div>
    </aside>
  );
}

export default BackgroundControls;
