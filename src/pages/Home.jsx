import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";


export default function Home() {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <img src={logo} alt="logo" style={{ height: "80px" }} />
      <h1>Welcome to PowerRise Fitness</h1>
      <p>Your personal fitness companion 💪</p>
     
      <div className="hero">
        <h1>Welcome to PowerRise Fitness</h1>
        <p>Your personal fitness companion 💪</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/profile">
          <button>Go to Profile</button>
        </Link>
        <Link to="/exercises">
          <button>Exercise Library</button>
        </Link>
        <Link to="/plan">
          <button>Workout Plan</button>
        </Link>
        <Link to="/timer">
          <button>Workout Timer</button>
        </Link>
      </div>
    </div>
  );
}
