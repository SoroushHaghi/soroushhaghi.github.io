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
      <path d="M3.8 10.8 12 4l8.2 6.8v8.5a.9.9 0 0 1-.9.9H4.7a.9.9 0 0 1-.9-.9Z" />
    </svg>
  );
}

export default HomeIcon;
