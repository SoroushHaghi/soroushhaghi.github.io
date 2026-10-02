import React from "react";

type Props = {
  className?: string;
};

function HomeIcon({ className = "" }: Props) {
  return (
    <svg
      className={`home-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 10.7 12 4l8 6.7v8.1a1.2 1.2 0 0 1-1.2 1.2H5.2A1.2 1.2 0 0 1 4 18.8Z" />
      <path d="M7.4 10.7h9.2" />
    </svg>
  );
}

export default HomeIcon;
