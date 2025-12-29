import { useEffect, useState } from "react";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../api";

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    description: "",
    duration: 0,
    video_url: "",
  });

  // Load exercises on component mount
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises();
      setExercises(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError("");

      if (!form.name.trim()) {
        setError("Exercise name is required");
        return;
      }

      if (form.id) {
        // Update existing exercise
        const updated = await updateExercise(form.id, form);
        setExercises(
          exercises.map((ex) => (ex._id === form.id ? updated : ex))
        );
      } else {
        // Create new exercise
        const newExercise = await createExercise(form);
        setExercises([...exercises, newExercise]);
      }

      // Reset form
      setForm({
        id: null,
        name: "",
        category: "",
        description: "",
        duration: 0,
        video_url: "",
      });
    } catch (err) {
      setError(err);
    }
  };

  const handleEdit = (exercise) => {
    setForm({
      id: exercise._id,
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      duration: exercise.duration,
      video_url: exercise.video_url,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await deleteExercise(id);
        setExercises(exercises.filter((ex) => ex._id !== id));
      } catch (err) {
        setError(err);
      }
    }
  };

  if (loading) return <div>Loading exercises...</div>;

  return (
    <div className="container">
      <h2>Exercise Library</h2>

      {error && <div className="error">{error}</div>}

      {/* Form and exercise list */}
      {/* ... rest of your component ... */}
    </div>
  );
}
