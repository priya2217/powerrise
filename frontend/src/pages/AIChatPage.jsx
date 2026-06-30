import AIChatBox from "./AIChatBox";

export default function AIChatPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        AI Fitness Assistant
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        Ask about workouts, exercise form, nutrition basics, or recovery tips.
      </p>

      <AIChatBox height="60vh" />
    </div>
  );
}
