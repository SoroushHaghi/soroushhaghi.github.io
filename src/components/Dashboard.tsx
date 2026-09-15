import React from "react";

const sections = [
  "Overview",
  "Opportunities",
  "Applications",
  "Companies",
  "University Project",
  "Germany Internship",
  "Abroad / Erasmus",
  "Emails / Follow-ups",
  "Next Actions",
];

const panelStyle: React.CSSProperties = {
  width: "min(760px, calc(100% - 32px))",
  padding: "28px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(15, 23, 42, 0.72)",
  boxShadow: "0 20px 70px rgba(0,0,0,0.32)",
  backdropFilter: "blur(18px)",
};

function Dashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top left, #182848 0%, #111827 42%, #050816 100%)",
        color: "#f8fafc",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "32px 0",
      }}
    >
      <section style={panelStyle}>
        <div style={{ fontSize: 13, opacity: 0.68, letterSpacing: 1.6, textTransform: "uppercase" }}>
          Private workspace
        </div>
        <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(32px, 5vw, 52px)" }}>
          Career OS Dashboard
        </h1>
        <p style={{ marginTop: 0, opacity: 0.78, lineHeight: 1.6 }}>
          This route is reserved for the authenticated Career OS control center. No private Career OS data is embedded in the public website bundle.
        </p>

        <div
          style={{
            margin: "28px 0",
            padding: "18px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <strong>Secure sign-in is being connected.</strong>
          <div style={{ marginTop: 8, opacity: 0.72, lineHeight: 1.5 }}>
            Authentication and the private-data API will be configured separately so GitHub credentials and Career OS data never ship to the browser.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {sections.map((section) => (
            <div
              key={section}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.035)",
                opacity: 0.76,
              }}
            >
              {section}
            </div>
          ))}
        </div>

        <a
          href="/"
          style={{ display: "inline-block", marginTop: 26, color: "#dbeafe", textDecoration: "none" }}
        >
          ← Back to public portfolio
        </a>
      </section>
    </main>
  );
}

export default Dashboard;
