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

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises();
      // backend returns { success, count, exercises }
      setExercises(data.exercises || []);
    } catch (err) {
      setError(err.toString());
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
        const updated = await updateExercise(form.id, form);
        setExercises(
          exercises.map((ex) => (ex._id === form.id ? updated : ex)),
        );
      } else {
        const newExercise = await createExercise(form);
        setExercises([...exercises, newExercise]);
      }

      setForm({
        id: null,
        name: "",
        category: "",
        description: "",
        duration: 0,
        video_url: "",
      });
    } catch (err) {
      setError(err.toString());
    }
  };

  const handleEdit = (exercise) => {
    setForm({
      id: exercise._id || exercise.id,
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      duration: exercise.duration,
      video_url: exercise.video_url || "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await deleteExercise(id);
        setExercises(exercises.filter((ex) => (ex._id || ex.id) !== id));
      } catch (err) {
        setError(err.toString());
      }
    }
  };

  if (loading)
    return <div style={{ padding: "40px" }}>Loading exercises...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>
        Exercise Library
      </h2>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>
          {form.id ? "Edit Exercise" : "Add New Exercise"}
        </h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Category (e.g. cardio, strength)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ ...inputStyle, minHeight: "60px" }}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: Number(e.target.value) })
          }
          style={inputStyle}
        />
        <button onClick={handleSave} style={saveButtonStyle}>
          {form.id ? "Update Exercise" : "Add Exercise"}
        </button>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {exercises.length === 0 && <p>No exercises found.</p>}
        {exercises.map((ex) => (
          <div
            key={ex._id || ex.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ margin: 0 }}>{ex.name}</h4>
              <p
                style={{ margin: "4px 0", color: "#6b7280", fontSize: "14px" }}
              >
                {ex.category} · {ex.duration} min
                {ex.calories ? ` · ${ex.calories} cal` : ""}
              </p>
              {ex.description && (
                <p style={{ margin: 0, fontSize: "14px" }}>{ex.description}</p>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleEdit(ex)} style={smallButtonStyle}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(ex._id || ex.id)}
                style={{ ...smallButtonStyle, background: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
  fontSize: "14px",
};

const saveButtonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const smallButtonStyle = {
  padding: "8px 14px",
  borderRadius: "8px",
  background: "#10b981",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
};
