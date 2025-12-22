import { useEffect, useState } from "react";

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    description: "",
    duration: 0,
    video_url: "",
  });

  const [saveError, setSaveError] = useState("");

  // Load exercises from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("exercises");
    if (saved) {
      setExercises(JSON.parse(saved));
    }
  }, []);

  // Save exercises array to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem("exercises", JSON.stringify(data));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "duration" ? parseInt(value) || 0 : value,
    });
  };

  const handleSave = () => {
    setSaveError("");

    // Validation
    if (!form.name.trim()) {
      setSaveError("Exercise name is required.");
      return;
    }

    let updatedExercises = [...exercises];

    if (form.id !== null) {
      // Update existing
      updatedExercises = updatedExercises.map((ex) =>
        ex.id === form.id ? form : ex
      );
    } else {
      // Add new
      const newExercise = {
        ...form,
        id: Date.now().toString(), // unique ID
      };
      updatedExercises.push(newExercise);
    }

    // Save to localStorage and update state
    saveToLocalStorage(updatedExercises);
    setExercises(updatedExercises);

    // Reset form
    setForm({
      id: null,
      name: "",
      category: "",
      description: "",
      duration: 0,
      video_url: "",
    });
  };

  const handleEdit = (exercise) => {
    setForm(exercise);
  };

  return (
    <div className="container">
      <h2>Exercise Library</h2>

      {saveError && <p className="error">{saveError}</p>}

      <div className="exercise-form">
        <input
          name="name"
          placeholder="Exercise Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category (e.g., chest, legs)"
          value={form.category}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="duration"
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
        />

        <input
          name="video_url"
          placeholder="Video URL"
          value={form.video_url}
          onChange={handleChange}
        />

        <button className="gradient-btn" onClick={handleSave}>
          {form.id ? "Update Exercise" : "Add Exercise"}
        </button>
      </div>

      <h3>Existing Exercises</h3>

      {exercises.length === 0 ? (
        <p>No exercises added yet.</p>
      ) : (
        <ul className="exercise-list">
          {exercises.map((ex) => (
            <li key={ex.id} className="exercise-item">
              <div>
                <strong>{ex.name}</strong> ({ex.category}) - {ex.duration} min
              </div>
              <button
                className="gradient-btn small"
                onClick={() => handleEdit(ex)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
