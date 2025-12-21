import { useEffect, useState } from "react";

export default function WorkoutPlan() {
  const [workout, setWorkout] = useState({
    name: "",
    duration: "",
    exercises: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout({ ...workout, [name]: value });
  };

  const handleSave = () => {
    alert(`Workout Plan Saved!\n
Name: ${workout.name}
Duration: ${workout.duration} minutes
Exercises: ${workout.exercises}`);
  };

  return (
    <div className="container">
      <h2>Create Workout Plan</h2>
      <input
        name="name"
        placeholder="Workout Name"
        value={workout.name}
        onChange={handleChange}
      />
      <input
        name="duration"
        type="number"
        placeholder="Duration (minutes)"
        value={workout.duration}
        onChange={handleChange}
      />
      <input
        name="exercises"
        placeholder="Exercises"
        value={workout.exercises}
        onChange={handleChange}
      />
      <button onClick={handleSave}>Save Workout Plan</button>
    </div>
  );
}
