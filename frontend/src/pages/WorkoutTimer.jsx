import { useEffect, useState } from "react";
import { FaPlay, FaPause, FaRedo, FaClock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { logWorkout } from "../api";

/* ---------------------------------------------------------
   WORKOUT TIMER :: HUD theme, matches Dashboard / WorkoutPlan / Settings
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   mint #21ffa3  amber #ffb020  red #ff3b5c
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

const CALORIES_PER_MINUTE = 7;

export default function WorkoutTimer() {
  const [minutes, setMinutes] = useState(30);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completedMessage, setCompletedMessage] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setBooted(true));
  }, []);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(minutes * 60);
    }
  }, [minutes]);

  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      handleWorkoutComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleWorkoutComplete = async () => {
    setSaving(true);
    setCompletedMessage("");
    setSaveFailed(false);

    try {
      await logWorkout({
        name: "Timed Workout",
        duration: minutes,
        calories: minutes * CALORIES_PER_MINUTE,
      });

      setCompletedMessage("Workout complete — saved to dashboard.");
    } catch (err) {
      console.error(err);
      const detail = err?.response?.data?.message || err?.message;
      setCompletedMessage(
        `Workout complete — couldn't save to dashboard${detail ? `: ${detail}` : "."}`,
      );
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(minutes * 60);
    setCompletedMessage("");
    setSaveFailed(false);
  };

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  const progress = 100 - Math.floor((secondsLeft / (minutes * 60)) * 100);
  const circumference = 2 * Math.PI * 90;
  const ringOffset =
    circumference -
    (Math.min(100, Math.max(0, progress)) / 100) * circumference;

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

        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
          50% { filter: drop-shadow(0 0 10px currentColor); }
        }
        .pulse-glow { animation: pulseGlow 1.6s ease-in-out infinite; }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: riseIn 0.55s cubic-bezier(.2,.7,.3,1) both; }

        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 24s linear infinite; }

        .hud-panel {
          background: linear-gradient(180deg, rgba(13,21,34,0.9), rgba(7,12,20,0.92));
          border: 1px solid rgba(34,229,255,0.16);
          clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
          position: relative;
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
        .hud-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .ring-anim {
          stroke-dasharray: ${circumference};
          transition: stroke-dashoffset 1s linear;
        }

        .hud-btn {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.1em;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, opacity 0.2s ease;
          clip-path: polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
        }
        .hud-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .hud-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
        .hud-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .hud-btn-start {
          background: rgba(33,255,163,0.12);
          border: 1px solid rgba(33,255,163,0.5);
          color: #9dffd9;
        }
        .hud-btn-start:hover:not(:disabled) { background: rgba(33,255,163,0.2); box-shadow: 0 0 18px rgba(33,255,163,0.25); }

        .hud-btn-pause {
          background: rgba(255,176,32,0.12);
          border: 1px solid rgba(255,176,32,0.5);
          color: #ffd28a;
        }
        .hud-btn-pause:hover:not(:disabled) { background: rgba(255,176,32,0.2); box-shadow: 0 0 18px rgba(255,176,32,0.25); }

        .hud-btn-reset {
          background: rgba(255,59,92,0.08);
          border: 1px solid rgba(255,59,92,0.4);
          color: #ffb3c2;
        }
        .hud-btn-reset:hover:not(:disabled) { background: rgba(255,59,92,0.16); box-shadow: 0 0 14px rgba(255,59,92,0.2); }
      `}</style>

      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="scanline" />

      <Navbar />

      <div className="relative max-w-4xl mx-auto p-6">
        {/* Top status strip */}
        <div className="rise-in flex flex-wrap items-center justify-between gap-4 mb-6 hud-panel px-5 py-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${isRunning ? "bg-[#21ffa3] blink" : "bg-slate-600"}`}
            />
            <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
              SESSION&nbsp;&nbsp;{isRunning ? "RUNNING" : "STANDBY"}
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            WORKOUT TIMER
          </h1>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            {CALORIES_PER_MINUTE} CAL/MIN
          </span>
        </div>

        {completedMessage && (
          <p
            className="hud-mono text-xs mb-5 tracking-wide rise-in"
            style={{ color: saveFailed ? "#ffb020" : "#21ffa3" }}
          >
            {saveFailed ? "⚠" : "✓"} {completedMessage.toUpperCase()}
          </p>
        )}

        {/* Main Card */}
        <div
          className="hud-panel rise-in p-8"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
          <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

          {/* Minutes Input */}
          <div className="flex items-center gap-4 mb-10">
            <FaClock className="text-cyan-300 text-lg" />
            <span className="hud-mono text-[12px] tracking-[0.15em] text-slate-300">
              SET MINUTES
            </span>

            <input
              type="number"
              min="1"
              value={minutes}
              disabled={isRunning}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="hud-input w-24 rounded-sm px-4 py-2 text-sm"
            />
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center mb-10">
            <div className="relative w-64 h-64">
              <svg
                className="absolute inset-0 spin-slow"
                viewBox="0 0 220 220"
                style={{ opacity: isRunning ? 1 : 0.4 }}
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <line
                    key={i}
                    x1="110"
                    y1="6"
                    x2="110"
                    y2={i % 5 === 0 ? "16" : "12"}
                    stroke="rgba(34,229,255,0.3)"
                    strokeWidth="1"
                    transform={`rotate(${i * 9} 110 110)`}
                  />
                ))}
              </svg>

              <svg
                className="absolute inset-0 -rotate-90"
                viewBox="0 0 220 220"
              >
                <circle
                  cx="110"
                  cy="110"
                  r="90"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="90"
                  fill="none"
                  stroke="#22e5ff"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="ring-anim"
                  style={{
                    strokeDashoffset: booted ? ringOffset : circumference,
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="hud-display text-5xl font-bold text-slate-100">
                    {displayMinutes}:
                    {displaySeconds < 10
                      ? `0${displaySeconds}`
                      : displaySeconds}
                  </div>

                  <p className="hud-mono text-[10px] tracking-[0.25em] text-slate-500 mt-2">
                    REMAINING
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={saving}
              className={`hud-btn ${isRunning ? "hud-btn-pause" : "hud-btn-start"} px-8 py-4 text-xs flex items-center gap-3`}
            >
              {isRunning ? (
                <>
                  <FaPause size={13} />
                  PAUSE
                </>
              ) : (
                <>
                  <FaPlay size={13} />
                  START
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={saving}
              className="hud-btn hud-btn-reset px-8 py-4 text-xs flex items-center gap-3"
            >
              <FaRedo size={13} />
              RESET
            </button>
          </div>

          {/* Info */}
          <div
            className="mt-8 hud-panel px-5 py-4"
            style={{
              clipPath: "none",
              border: "1px solid rgba(34,229,255,0.1)",
            }}
          >
            <p className="hud-mono text-[11px] text-slate-400 text-center tracking-wide leading-relaxed">
              ESTIMATED BURN:{" "}
              <span className="text-[#21ffa3]">
                ~{CALORIES_PER_MINUTE} CAL/MIN
              </span>
              <br />
              COMPLETING THE TIMER AUTO-LOGS YOUR WORKOUT TO THE DASHBOARD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
