import { useEffect, useState } from "react";

export default function WorkoutTimer() {
  const [minutes, setMinutes] = useState(30);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Sync when minutes change
  useEffect(() => {
    if (!isRunning) setSecondsLeft(minutes * 60);
  }, [minutes]);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      alert("Workout Completed! 💪");
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(minutes * 60);
  };

  const progress = 100 - Math.floor((secondsLeft / (minutes * 60)) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        padding: "40px",
      }}
    >
      <h2 style={{ fontSize: "32px", color: "#4f46e5" }}>Workout Timer</h2>

      {/* Time Input */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "600" }}>Set Minutes:</label>
        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          style={{
            marginLeft: "10px",
            width: "80px",
            padding: "8px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      {/* Timer Circle */}
      <div
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `conic-gradient(#34d399 ${progress}%, #e5e7eb 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "700",
            color: "#4f46e5",
          }}
        >
          {displayMinutes}:
          {displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "20px" }}>
        <button onClick={() => setIsRunning(!isRunning)} style={mainBtn}>
          {isRunning ? "Pause" : "Start"}
        </button>

        <button onClick={handleReset} style={resetBtn}>
          Reset
        </button>
      </div>
    </div>
  );
}

const mainBtn = {
  padding: "14px 30px",
  borderRadius: "20px",
  background: "linear-gradient(to right, #34d399, #14b8a6)",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
};

const resetBtn = {
  padding: "14px 30px",
  borderRadius: "20px",
  background: "linear-gradient(to right, #f87171, #ef4444)",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
};
