import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/Profile";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutTimer from "./pages/WorkoutTimer";
import Settings from "./pages/Settings";
import BMICalculator from "./pages/BMICalculator";
import './index.css'; // or './app.css' if you renamed it


import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <header className="header">
        <h2>PowerRise</h2>

        <nav>
          {/* Always visible links */}
          <NavLink to="/" end>
            Home
          </NavLink>

          {/* Show login/signup if not logged in */}
          {!currentUser && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
          )}

          {/* Show app links if logged in */}
          {currentUser && (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/exercises">Exercises</NavLink>
              <NavLink to="/plan">Plan</NavLink>
              <NavLink to="/timer">Timer</NavLink>
              <NavLink to="/BMICalculator">BMICalculator</NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "10px",
                  background: "#ff4b4b",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Display logged in email/name */}
        {currentUser && (
          <span
            style={{ marginLeft: "16px", fontWeight: "bold", color: "#fff" }}
          >
            {currentUser}
          </span>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Auth routes */}
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route path="/signup" element={<Signup />} />
          {/* Protected pages (optional: block if not logged in) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/plan" element={<WorkoutPlan />} />
          <Route path="/timer" element={<WorkoutTimer />} />
          <Route path="/BMICalculator" element={<BMICalculator />} />;
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
