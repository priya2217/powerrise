import { useEffect, useState } from "react";
import {
  getWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from "../api";

const emptyExerciseRow = { exercise: "", sets: 3, reps: 10, rest: "60s" };

export default function WorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    exercises: [{ ...emptyExerciseRow }],
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getWorkoutPlans();
      setPlans(data.plans || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setForm({ ...form, name: e.target.value });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...form.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, exercises: updated });
  };

  const addExerciseRow = () => {
    setForm({
      ...form,
      exercises: [...form.exercises, { ...emptyExerciseRow }],
    });
  };

  const removeExerciseRow = (index) => {
    setForm({
      ...form,
      exercises: form.exercises.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("Plan name is required");
      return;
    }

    const validExercises = form.exercises.filter((ex) => ex.exercise.trim());
    if (validExercises.length === 0) {
      setError("Add at least one exercise");
      return;
    }

    try {
      setSaving(true);

      const payload = { name: form.name, exercises: validExercises };

      if (form.id) {
        await updateWorkoutPlan(form.id, payload);
      } else {
        await createWorkoutPlan(payload);
      }

      await fetchPlans();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", exercises: [{ ...emptyExerciseRow }] });
  };

  const handleEdit = (plan) => {
    setForm({
      id: plan._id || plan.id,
      name: plan.name,
      exercises:
        plan.exercises && plan.exercises.length > 0
          ? plan.exercises.map((ex) => ({ ...ex }))
          : [{ ...emptyExerciseRow }],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this workout plan?")) {
      try {
        await deleteWorkoutPlan(id);
        setPlans(plans.filter((p) => (p._id || p.id) !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete plan");
      }
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading workout plans...</div>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>
        Workout Plan
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

      {/* Form */}
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
          {form.id ? "Edit Plan" : "Create New Plan"}
        </h3>

        <input
          placeholder="Plan name (e.g. Beginner Full Body)"
          value={form.name}
          onChange={handleNameChange}
          style={inputStyle}
        />

        <p
          style={{ fontWeight: "600", marginTop: "16px", marginBottom: "8px" }}
        >
          Exercises
        </p>

        {form.exercises.map((ex, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
              gap: "8px",
              marginBottom: "8px",
              alignItems: "center",
            }}
          >
            <input
              placeholder="Exercise name"
              value={ex.exercise}
              onChange={(e) =>
                handleExerciseChange(index, "exercise", e.target.value)
              }
              style={rowInputStyle}
            />
            <input
              type="number"
              placeholder="Sets"
              value={ex.sets}
              onChange={(e) =>
                handleExerciseChange(index, "sets", Number(e.target.value))
              }
              style={rowInputStyle}
            />
            <input
              type="number"
              placeholder="Reps"
              value={ex.reps}
              onChange={(e) =>
                handleExerciseChange(index, "reps", Number(e.target.value))
              }
              style={rowInputStyle}
            />
            <input
              placeholder="Rest (e.g. 60s)"
              value={ex.rest}
              onChange={(e) =>
                handleExerciseChange(index, "rest", e.target.value)
              }
              style={rowInputStyle}
            />
            <button
              onClick={() => removeExerciseRow(index)}
              style={removeRowButtonStyle}
              title="Remove exercise"
            >
              ✕
            </button>
          </div>
        ))}

        <button onClick={addExerciseRow} style={addRowButtonStyle}>
          + Add Exercise
        </button>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={saveButtonStyle}
          >
            {saving ? "Saving..." : form.id ? "Update Plan" : "Save Plan"}
          </button>
          {form.id && (
            <button onClick={resetForm} style={cancelButtonStyle}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Plans list */}
      <div style={{ display: "grid", gap: "16px" }}>
        {plans.length === 0 && <p>No workout plans yet. Create one above.</p>}
        {plans.map((plan) => (
          <div
            key={plan._id || plan.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ margin: 0 }}>{plan.name}</h4>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleEdit(plan)}
                  style={smallButtonStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id || plan.id)}
                  style={{ ...smallButtonStyle, background: "#ef4444" }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
              {(plan.exercises || []).map((ex, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    background: "#f9fafb",
                    padding: "8px 12px",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{ex.exercise}</strong> — {ex.sets} sets × {ex.reps}{" "}
                  reps, rest {ex.rest}
                </div>
              ))}
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

const rowInputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "13px",
  width: "100%",
  boxSizing: "border-box",
};

const removeRowButtonStyle = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  fontSize: "14px",
};

const addRowButtonStyle = {
  background: "#e0e7ff",
  color: "#4f46e5",
  border: "none",
  borderRadius: "8px",
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
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

const cancelButtonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  background: "#9ca3af",
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
