import { useEffect, useState } from "react";

export default function ExerciseLibrary() {
  const exercises = [
    { name: "Push-Up", description: "Upper body exercise" },
    { name: "Squat", description: "Leg strengthening" },
    { name: "Plank", description: "Core exercise" },
  ];

  return (
    <div className="container">
      <h2>Exercise Library</h2>
      {exercises.map((exercise, index) => (
       <div className="glass-card" key={index}>
        <div className="neu-card">
  <h3>{exercise.name}</h3>
  <p>{exercise.description}</p>
</div>

  <h3>{exercise.name}</h3>
  <p>{exercise.description}</p>
  <button className="gradient-btn">View Exercise</button>
</div>

      ))}
    </div>
  );
}
