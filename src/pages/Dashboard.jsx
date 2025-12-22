import { useEffect, useState } from "react";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Load profile
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    // Load exercises
    const savedExercises = localStorage.getItem("exercises");
    if (savedExercises) setExercises(JSON.parse(savedExercises));
  }, []);

  const countExercises = exercises.length;

  const getBMI = () => {
    if (!profile) return null;
    const heightMeters = profile.height / 100;
    if (!heightMeters || !profile.weight) return null;
    const bmi = (profile.weight / (heightMeters * heightMeters)).toFixed(1);
    return bmi;
  };

  const bmi = getBMI();

  return (
    <div className="container dashboard">
      <h2>Dashboard</h2>

      {/* Profile Summary */}
      {profile ? (
        <div className="card">
          <h3>Welcome, {profile.name}</h3>
          <p>
            Age: {profile.age} • Height: {profile.height} cm • Weight:{" "}
            {profile.weight} kg
          </p>
          {bmi && (
            <p>
              <strong>Your BMI:</strong> {bmi}
            </p>
          )}
        </div>
      ) : (
        <p>No profile saved yet.</p>
      )}

      {/* Exercise Summary */}
      <div className="card">
        <h3>Exercise Summary</h3>
        <p>Total Exercises: {countExercises}</p>
      </div>

      {/* Quick Navigation */}
      <div className="card nav-cards">
        <h3>Quick Actions</h3>
        <button
          className="gradient-btn"
          onClick={() => (window.location = "/exercises")}
        >
          View Exercises
        </button>
        <button
          className="gradient-btn"
          onClick={() => (window.location = "/plan")}
        >
          Workout Plan
        </button>
        <button
          className="gradient-btn"
          onClick={() => (window.location = "/timer")}
        >
          Timer
        </button>
      </div>
    </div>
  );
}
