import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutTimer from "./pages/WorkoutTimer";
import Settings from "./pages/Settings";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <img src="/logo.png" alt="logo" />
        <h2>PowerRise Fitness</h2>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/exercises">Exercises</NavLink>
          <NavLink to="/plan">Plan</NavLink>
          <NavLink to="/timer">Timer</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/plan" element={<WorkoutPlan />} />
          <Route path="/timer" element={<WorkoutTimer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
