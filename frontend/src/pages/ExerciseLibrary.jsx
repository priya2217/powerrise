import { useEffect, useState } from "react";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../api";

/* ---------------------------------------------------------
   EXERCISE LIBRARY :: HUD theme, matches Dashboard.jsx
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   amber #ffb020  red #ff3b5c  mint #21ffa3
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booted, setBooted] = useState(false);
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
      setError("");
      const data = await getExercises();
      setExercises(data.exercises || []);
    } catch (err) {
      setError(err.message || "Failed to load exercises");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => setBooted(true));
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
          exercises.map((ex) => ((ex._id || ex.id) === form.id ? updated : ex)),
        );
      } else {
        const created = await createExercise(form);
        setExercises([...exercises, created]);
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
      setError(err.message || "Failed to save exercise");
    }
  };

  const handleEdit = (exercise) => {
    setForm({
      id: exercise._id || exercise.id,
      name: exercise.name || "",
      category: exercise.category || "",
      description: exercise.description || "",
      duration: exercise.duration || 0,
      video_url: exercise.video_url || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exercise?")) return;

    try {
      await deleteExercise(id);
      setExercises(exercises.filter((ex) => (ex._id || ex.id) !== id));
    } catch (err) {
      setError(err.message || "Failed to delete exercise");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04070d] flex items-center justify-center">
        <style>{FONT_IMPORT}</style>
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
            LOADING EXERCISE LIBRARY…
          </p>
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
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
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
          position: relative;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.12em;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
          clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
        }
        .hud-btn:hover { transform: translateY(-1px); }
        .hud-btn:active { transform: translateY(0) scale(0.98); }

        .hud-btn-primary {
          background: linear-gradient(180deg, rgba(34,229,255,0.18), rgba(34,229,255,0.08));
          border: 1px solid rgba(34,229,255,0.5);
          color: #aef3ff;
        }
        .hud-btn-primary:hover {
          background: linear-gradient(180deg, rgba(34,229,255,0.3), rgba(34,229,255,0.12));
          box-shadow: 0 0 18px rgba(34,229,255,0.25);
        }

        .hud-btn-edit {
          background: rgba(33,255,163,0.08);
          border: 1px solid rgba(33,255,163,0.4);
          color: #9dffd9;
        }
        .hud-btn-edit:hover {
          background: rgba(33,255,163,0.16);
          box-shadow: 0 0 14px rgba(33,255,163,0.2);
        }

        .hud-btn-delete {
          background: rgba(255,59,92,0.08);
          border: 1px solid rgba(255,59,92,0.4);
          color: #ffb3c2;
        }
        .hud-btn-delete:hover {
          background: rgba(255,59,92,0.16);
          box-shadow: 0 0 14px rgba(255,59,92,0.2);
        }

        .pulse-dot { animation: blink 1.8s ease-in-out infinite; }
      `}</style>

      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="scanline" />

      <div className="relative p-6 max-w-[1100px] mx-auto">
        {/* Top status strip */}
        <div className="rise-in flex flex-wrap items-center justify-between gap-4 mb-6 hud-panel px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#21ffa3] pulse-dot" />
            <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
              EXERCISE LIBRARY&nbsp;&nbsp;MODULE
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            EXERCISE LIBRARY
          </h1>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            {exercises.length} LOGGED
          </span>
        </div>

        {error && (
          <p className="hud-mono text-xs text-[#ff3b5c] mb-5 tracking-wide rise-in">
            ⚠ {error.toUpperCase()}
          </p>
        )}

        {/* Add/Edit Form */}
        <div
          className="hud-panel rise-in p-6 mb-6"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
          <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="hud-display text-sm font-bold tracking-[0.15em] text-slate-100">
              {form.id ? "EDIT EXERCISE" : "ADD NEW EXERCISE"}
            </h3>
            <span className="hud-mono text-[10px] tracking-[0.2em] text-cyan-400/60">
              {form.id ? "EDIT MODE" : "NEW ENTRY"}
            </span>
          </div>

          <input
            placeholder="Exercise name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="hud-input w-full px-3 py-3 mb-3 rounded-sm text-sm"
          />

          <input
            placeholder="Category (cardio, strength…)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="hud-input w-full px-3 py-3 mb-3 rounded-sm text-sm"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="hud-input w-full px-3 py-3 mb-3 rounded-sm text-sm"
            style={{ minHeight: "80px", resize: "vertical" }}
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: Number(e.target.value),
              })
            }
            className="hud-input w-full px-3 py-3 mb-4 rounded-sm text-sm"
          />

          <button
            onClick={handleSave}
            className="hud-btn hud-btn-primary px-6 py-3 text-xs"
          >
            {form.id ? "UPDATE EXERCISE" : "ADD EXERCISE"}
          </button>
        </div>

        {/* Exercise List */}
        <div className="grid gap-4">
          {exercises.length === 0 ? (
            <div className="hud-panel rise-in p-8 text-center hud-mono text-xs tracking-[0.2em] text-slate-500">
              NO EXERCISES FOUND
            </div>
          ) : (
            exercises.map((ex, i) => (
              <div
                key={ex._id || ex.id}
                className="hud-panel fade-scale p-5 flex justify-between items-center gap-4"
                style={{
                  animationDelay: booted ? `${Math.min(i, 8) * 0.05}s` : "0s",
                }}
              >
                <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
                <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

                <div className="min-w-0">
                  <h3 className="hud-display text-base font-bold text-slate-100 truncate">
                    {ex.name}
                  </h3>

                  <p className="hud-mono text-[11px] text-cyan-300/70 tracking-wide mt-1">
                    {ex.category} • {ex.duration} MIN
                    {ex.calories ? ` • ${ex.calories} CAL` : ""}
                  </p>

                  {ex.description && (
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                      {ex.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(ex)}
                    className="hud-btn hud-btn-edit px-4 py-2 text-[11px]"
                  >
                    EDIT
                  </button>

                  <button
                    onClick={() => handleDelete(ex._id || ex.id)}
                    className="hud-btn hud-btn-delete px-4 py-2 text-[11px]"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
