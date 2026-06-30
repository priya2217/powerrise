import { useEffect, useState } from "react";
import {
  getWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from "../api";
import Navbar from "../components/Navbar";
import { FaDumbbell, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

/* ---------------------------------------------------------
   WORKOUT PLAN :: HUD theme, matches Dashboard.jsx / ExerciseLibrary.jsx
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   amber #ffb020  red #ff3b5c  mint #21ffa3
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

const emptyExerciseRow = {
  exercise: "",
  sets: 3,
  reps: 10,
  rest: "60s",
};

export default function WorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [booted, setBooted] = useState(false);

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
      setError("");
      const data = await getWorkoutPlans();
      setPlans(data.plans || []);
    } catch (err) {
      // Surface the real reason instead of a generic string —
      // check your network tab / console for the underlying
      // status code (404 = wrong endpoint, 401/403 = auth,
      // network error = backend not running / CORS).
      console.error("getWorkoutPlans failed:", err);
      const detail =
        err?.response?.data?.message || err?.message || "Unknown error";
      setError(`Failed to fetch plans: ${detail}`);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => setBooted(true));
    }
  };

  const handleNameChange = (e) => {
    setForm({ ...form, name: e.target.value });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...form.exercises];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setForm({
      ...form,
      exercises: updated,
    });
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

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      exercises: [{ ...emptyExerciseRow }],
    });
  };

  const handleSave = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("Plan name is required");
      return;
    }

    const validExercises = form.exercises.filter((e) => e.exercise.trim());

    if (validExercises.length === 0) {
      setError("Add at least one exercise");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        exercises: validExercises,
      };

      if (form.id) {
        await updateWorkoutPlan(form.id, payload);
      } else {
        await createWorkoutPlan(payload);
      }

      await fetchPlans();
      resetForm();
    } catch (err) {
      console.error("save plan failed:", err);
      const detail =
        err?.response?.data?.message || err?.message || "Unknown error";
      setError(`Failed to save plan: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setForm({
      id: plan._id || plan.id,
      name: plan.name,
      exercises:
        plan.exercises?.length > 0
          ? plan.exercises.map((e) => ({ ...e }))
          : [{ ...emptyExerciseRow }],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout plan?")) return;

    try {
      await deleteWorkoutPlan(id);

      setPlans(plans.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("delete plan failed:", err);
      const detail =
        err?.response?.data?.message || err?.message || "Unknown error";
      setError(`Failed to delete plan: ${detail}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04070d]">
        <style>{FONT_IMPORT}</style>
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div
            className="text-center"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-cyan-400/40 border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full border border-cyan-400/30 animate-ping" />
            </div>
            <p className="text-cyan-300 tracking-[0.3em] text-sm">
              LOADING WORKOUT PLANS…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#04070d] text-slate-200 relative overflow-hidden"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      <style>{`
        ${FONT_IMPORT}

        .hud-mono { font-family: 'Share Tech Mono', monospace; }
        .hud-display { font-family: 'Orbitron', sans-serif; }

        .hud-grid {
          background-image:
            linear-gradient(rgba(34,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,229,255,0.05) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .scanline {
          position: absolute; left: 0; right: 0; height: 120px;
          background: linear-gradient(to bottom, transparent, rgba(34,229,255,0.06), transparent);
          animation: scanline 7s linear infinite;
          pointer-events: none;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
        }
        .blink { animation: blink 1.6s ease-in-out infinite; }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: riseIn 0.55s cubic-bezier(.2,.7,.3,1) both; }

        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .fade-scale { animation: fadeScale 0.4s ease-out both; }

        .hud-panel {
          background: linear-gradient(180deg, rgba(13,21,34,0.9), rgba(7,12,20,0.92));
          border: 1px solid rgba(34,229,255,0.16);
          clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
          position: relative;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
        }
        .hud-panel:hover {
          border-color: rgba(34,229,255,0.4);
          box-shadow: 0 0 24px rgba(34,229,255,0.08);
        }
        .hud-corner {
          position: absolute; width: 14px; height: 14px;
          border-color: rgba(34,229,255,0.55);
        }

        .hud-input {
          background: #070b14;
          border: 1px solid rgba(34,229,255,0.18);
          color: #e6f6ff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .hud-input:focus {
          outline: none;
          border-color: #22e5ff;
          box-shadow: 0 0 0 3px rgba(34,229,255,0.12);
        }
        .hud-input::placeholder { color: #46566f; }

        .hud-btn {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.1em;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, opacity 0.2s ease;
          clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
        }
        .hud-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .hud-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
        .hud-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .hud-btn-primary {
          background: linear-gradient(180deg, rgba(34,229,255,0.18), rgba(34,229,255,0.08));
          border: 1px solid rgba(34,229,255,0.5);
          color: #aef3ff;
        }
        .hud-btn-primary:hover:not(:disabled) {
          background: linear-gradient(180deg, rgba(34,229,255,0.3), rgba(34,229,255,0.12));
          box-shadow: 0 0 18px rgba(34,229,255,0.25);
        }

        .hud-btn-ghost {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8;
        }
        .hud-btn-ghost:hover { background: rgba(255,255,255,0.06); }

        .hud-btn-edit {
          background: rgba(33,255,163,0.08);
          border: 1px solid rgba(33,255,163,0.4);
          color: #9dffd9;
        }
        .hud-btn-edit:hover { background: rgba(33,255,163,0.16); box-shadow: 0 0 14px rgba(33,255,163,0.2); }

        .hud-btn-delete {
          background: rgba(255,59,92,0.08);
          border: 1px solid rgba(255,59,92,0.4);
          color: #ffb3c2;
        }
        .hud-btn-delete:hover { background: rgba(255,59,92,0.16); box-shadow: 0 0 14px rgba(255,59,92,0.2); }

        .hud-btn-add {
          background: linear-gradient(90deg, rgba(59,111,237,0.18), rgba(34,229,255,0.12));
          border: 1px solid rgba(59,111,237,0.5);
          color: #bcd4ff;
        }
        .hud-btn-add:hover { box-shadow: 0 0 18px rgba(59,111,237,0.25); }
      `}</style>

      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="scanline" />

      <Navbar />

      <div className="relative max-w-5xl mx-auto p-6">
        {/* Top status strip */}
        <div className="rise-in flex flex-wrap items-center justify-between gap-4 mb-6 hud-panel px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#21ffa3] blink" />
            <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
              WORKOUT PLAN&nbsp;&nbsp;MODULE
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            WORKOUT PLANS
          </h1>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            {plans.length} ACTIVE
          </span>
        </div>

        {error && (
          <div className="hud-panel rise-in px-5 py-4 mb-6 border-[#ff3b5c]/40">
            <p className="hud-mono text-xs text-[#ff3b5c] tracking-wide">
              ⚠ {error.toUpperCase()}
            </p>
          </div>
        )}

        {/* Form Card */}
        <div
          className="hud-panel rise-in p-6 mb-8"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
          <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="hud-display text-sm font-bold tracking-[0.15em] text-slate-100">
              {form.id ? "EDIT WORKOUT PLAN" : "CREATE WORKOUT PLAN"}
            </h2>
            <span className="hud-mono text-[10px] tracking-[0.2em] text-cyan-400/60">
              {form.id ? "EDIT MODE" : "NEW ENTRY"}
            </span>
          </div>

          <input
            type="text"
            placeholder="Plan name"
            value={form.name}
            onChange={handleNameChange}
            className="hud-input w-full px-4 py-3 rounded-sm mb-6 text-sm"
          />

          <div className="space-y-3">
            {form.exercises.map((ex, index) => (
              <div
                key={index}
                className="fade-scale grid grid-cols-1 md:grid-cols-5 gap-3"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <input
                  placeholder="Exercise"
                  value={ex.exercise}
                  onChange={(e) =>
                    handleExerciseChange(index, "exercise", e.target.value)
                  }
                  className="hud-input rounded-sm px-3 py-2 text-sm"
                />

                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) =>
                    handleExerciseChange(index, "sets", Number(e.target.value))
                  }
                  className="hud-input rounded-sm px-3 py-2 text-sm"
                />

                <input
                  type="number"
                  value={ex.reps}
                  onChange={(e) =>
                    handleExerciseChange(index, "reps", Number(e.target.value))
                  }
                  className="hud-input rounded-sm px-3 py-2 text-sm"
                />

                <input
                  value={ex.rest}
                  onChange={(e) =>
                    handleExerciseChange(index, "rest", e.target.value)
                  }
                  className="hud-input rounded-sm px-3 py-2 text-sm"
                />

                <button
                  onClick={() => removeExerciseRow(index)}
                  className="hud-btn hud-btn-delete rounded-sm flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addExerciseRow}
            className="hud-btn hud-btn-add mt-4 px-5 py-3 text-xs flex items-center gap-2"
          >
            <FaPlus size={11} />
            ADD EXERCISE
          </button>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="hud-btn hud-btn-primary px-6 py-3 text-xs"
            >
              {saving ? "SAVING…" : form.id ? "UPDATE PLAN" : "SAVE PLAN"}
            </button>

            {form.id && (
              <button
                onClick={resetForm}
                className="hud-btn hud-btn-ghost px-6 py-3 text-xs"
              >
                CANCEL
              </button>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-5">
          {plans.length === 0 && (
            <div className="hud-panel rise-in p-8 text-center hud-mono text-xs tracking-[0.2em] text-slate-500">
              NO WORKOUT PLANS YET
            </div>
          )}

          {plans.map((plan, i) => (
            <div
              key={plan._id || plan.id}
              className="hud-panel fade-scale p-6"
              style={{
                animationDelay: booted ? `${Math.min(i, 8) * 0.06}s` : "0s",
              }}
            >
              <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
              <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <FaDumbbell className="text-cyan-400" />
                  <h3 className="hud-display text-base font-bold text-slate-100">
                    {plan.name}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="hud-btn hud-btn-edit px-4 py-2 text-[11px] flex items-center gap-2"
                  >
                    <FaEdit size={11} />
                    EDIT
                  </button>

                  <button
                    onClick={() => handleDelete(plan._id || plan.id)}
                    className="hud-btn hud-btn-delete px-4 py-2 text-[11px] flex items-center gap-2"
                  >
                    <FaTrash size={11} />
                    DELETE
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {(plan.exercises || []).map((ex, i2) => (
                  <div
                    key={i2}
                    className="hud-mono text-[12px] bg-[#0a0f1a] border border-cyan-400/10 rounded-sm px-4 py-3 text-slate-300"
                  >
                    <span className="font-bold text-cyan-200">
                      {ex.exercise}
                    </span>
                    {"  •  "}
                    {ex.sets} SETS × {ex.reps} REPS
                    {"  •  "}
                    REST {ex.rest}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
