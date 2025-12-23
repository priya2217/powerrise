import { useEffect, useState } from "react";

export default function WorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    duration: "",
    exercises: "",
  });

  // Load saved plans
  useEffect(() => {
    const saved = localStorage.getItem("workoutPlans");
    if (saved) setPlans(JSON.parse(saved));
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("workoutPlans", JSON.stringify(data));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    if (!form.name || !form.duration || !form.exercises) {
      alert("Please fill all fields");
      return;
    }

    let updatedPlans = [...plans];

    if (form.id) {
      updatedPlans = updatedPlans.map((p) => (p.id === form.id ? form : p));
    } else {
      updatedPlans.push({ ...form, id: Date.now().toString() });
    }

    setPlans(updatedPlans);
    saveToLocalStorage(updatedPlans);

    setForm({ id: null, name: "", duration: "", exercises: "" });
  };

  const handleEdit = (plan) => {
    setForm(plan);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f9fafb",
      }}
    >
      <h2 style={{ fontSize: "32px", color: "#4f46e5" }}>Workout Plans</h2>

      {/* Form */}
      <div
        style={{
          width: "450px",
          background: "#fff",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <input
          name="name"
          placeholder="Workout Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="duration"
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="exercises"
          placeholder="Exercises (comma separated)"
          value={form.exercises}
          onChange={handleChange}
          style={{ ...inputStyle, height: "80px" }}
        />

        <button onClick={handleSave} style={saveBtn}>
          {form.id ? "Update Plan" : "Save Plan"}
        </button>
      </div>

      {/* Saved Plans */}
      <h3 style={{ marginTop: "40px", color: "#4f46e5" }}>Saved Plans</h3>

      {plans.length === 0 ? (
        <p>No workout plans added.</p>
      ) : (
        <div style={{ width: "450px", marginTop: "15px" }}>
          {plans.map((plan) => (
            <div key={plan.id} style={card}>
              <div>
                <strong>{plan.name}</strong>
                <p>{plan.duration} minutes</p>
                <p style={{ color: "#6b7280" }}>{plan.exercises}</p>
              </div>
              <button onClick={() => handleEdit(plan)} style={editBtn}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
};

const saveBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "18px",
  background: "linear-gradient(to right, #34d399, #14b8a6)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
};

const card = {
  background: "#fff",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const editBtn = {
  padding: "8px 14px",
  borderRadius: "12px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
