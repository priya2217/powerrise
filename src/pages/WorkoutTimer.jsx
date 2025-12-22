import { useEffect, useState } from "react";

export default function WorkoutTimer() {
  const [minutes, setMinutes] = useState(30); // start at 30 minutes
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Update every second while running
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Calculate “minutes:seconds”
  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(minutes * 60); // reset timer
  };

  return (
    <div className="container timer-page">
      <div className="timer-header">Workout Timer</div>

      <div className="timer-display">
        {displayMinutes}:
        {displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds} minutes
      </div>

      <div className="timer-controls">
        <button
          className="gradient-btn"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? "Pause Timer" : "Start Timer"}
        </button>

        <button className="gradient-btn reset-btn" onClick={handleReset}>
          Reset Timer
        </button>
      </div>
    </div>
  );
}
