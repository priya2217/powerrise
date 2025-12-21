import { useEffect, useState } from "react";

export default function WorkoutTimer() {
  const [time, setTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleReset = () => {
    setTime(60);
    setIsRunning(false);
  };

  return (
    <>
      <div className="header green">Workout Timer</div>
      <div className="container">
        <h1>{time} seconds</h1>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset Timer
        </button>
      </div>
    </>
  );
}
