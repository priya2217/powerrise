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

  useEffect(() => {
    const saved = localStorage.getItem("exercises");
    if (saved) setExercises(JSON.parse(saved));
  }, []);

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
    if (!form.name.trim()) {
      setSaveError("Exercise name is required.");
      return;
    }

    let updatedExercises = [...exercises];
    if (form.id !== null) {
      updatedExercises = updatedExercises.map((ex) =>
        ex.id === form.id ? form : ex
      );
    } else {
      updatedExercises.push({ ...form, id: Date.now().toString() });
    }

    saveToLocalStorage(updatedExercises);
    setExercises(updatedExercises);
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
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#4f46e5",
          marginBottom: "30px",
        }}
      >
        Exercise Library
      </h2>

      {saveError && (
        <p style={{ color: "red", marginBottom: "20px" }}>{saveError}</p>
      )}

      {/* Form */}
      <div
        style={{
          width: "600px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          marginBottom: "50px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            name="name"
            placeholder="Exercise Name"
            value={form.name}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
          <input
            name="category"
            placeholder="Category (e.g., Chest, Legs)"
            value={form.category}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
              minHeight: "80px",
            }}
          />
          <input
            name="duration"
            type="number"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
          <input
            name="video_url"
            placeholder="Video URL"
            value={form.video_url}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />

          <button
            onClick={handleSave}
            style={{
              padding: "14px",
              borderRadius: "20px",
              fontWeight: "600",
              background: "linear-gradient(to right, #34d399, #14b8a6)",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {form.id ? "Update Exercise" : "Add Exercise"}
          </button>
        </div>
      </div>

      {/* Exercise List */}
      <h3
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#4f46e5",
          marginBottom: "20px",
        }}
      >
        Existing Exercises
      </h3>
      {exercises.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No exercises added yet.</p>
      ) : (
        <div
          style={{
            width: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {exercises.map((ex) => (
            <div
              key={ex.id}
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h4
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    color: "#4f46e5",
                  }}
                >
                  {ex.name}
                </h4>
                <p style={{ color: "#6b7280" }}>
                  {ex.category} - {ex.duration} min
                </p>
                {ex.description && (
                  <p style={{ color: "#9ca3af" }}>{ex.description}</p>
                )}
                {ex.video_url && (
                  <a
                    href={ex.video_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#14b8a6", textDecoration: "underline" }}
                  >
                    Watch Video
                  </a>
                )}
              </div>
              <button
                onClick={() => handleEdit(ex)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  background: "linear-gradient(to right, #facc15, #f97316)",
                  color: "white",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
