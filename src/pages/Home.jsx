import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";


export default function Home() {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <img src={logo} alt="logo" style={{ height: "80px" }} />
      <h1>Welcome to PowerRise Fitness</h1>
      <p>Your personal fitness companion 💪</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/profile">
          <button className="gradient-btn">Go to Profile</button>
        </Link>
        <Link to="/exercises">
          <button className="gradient-btn">Exercise Library</button>
        </Link>
        <Link to="/plan">
          <button className="gradient-btn">Workout Plan</button>
        </Link>
        <Link to="/timer">
          <button className="gradient-btn">Workout Timer</button>
        </Link>
        <Link to="/dashboard">
          <button className="gradient-btn">Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
