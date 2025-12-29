import { useEffect, useState } from "react";
import { getProfile, getExercises } from "../api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);

        const exercisesData = await getExercises();
        setExercises(exercisesData);
      } catch (err) {
        setError(err || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const countExercises = exercises.length;

  const getBMI = () => {
    if (!profile) return null;
    const heightMeters = profile.height / 100;
    if (!heightMeters || !profile.weight) return null;
    return (profile.weight / (heightMeters * heightMeters)).toFixed(1);
  };

  const bmi = getBMI();

  const bmiStatus = () => {
    if (!bmi) return "--";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🏠 Dashboard</h1>

      {/* Profile Card */}
      <div className="dashboard-card">
        <h3>👤 Profile</h3>
        {profile ? (
          <>
            <p>
              <b>Name:</b> {profile.name}
            </p>
            <p>
              <b>Age:</b> {profile.age}
            </p>
            <p>
              <b>Height:</b> {profile.height} cm
            </p>
            <p>
              <b>Weight:</b> {profile.weight} kg
            </p>
          </>
        ) : (
          <p className="muted">No profile saved yet.</p>
        )}
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <h4>🏋 Exercises</h4>
          <p className="stat-number">{countExercises}</p>
        </div>

        <div className="stat-box">
          <h4>📊 BMI</h4>
          <p className="stat-number">{bmi || "--"}</p>
        </div>

        <div className="stat-box">
          <h4>📌 Status</h4>
          <p className="stat-number">{bmiStatus()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <h3>⚡ Quick Actions</h3>
        <div className="action-row">
          <button onClick={() => (window.location = "/exercises")}>
            🏃 Manage Exercises
          </button>
          <button onClick={() => (window.location = "/plan")}>
            🗓 Workout Plan
          </button>
          <button onClick={() => (window.location = "/timer")}>
            ⏱ Start Timer
          </button>
        </div>
      </div>
    </div>
  );
}
