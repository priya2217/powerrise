import { useEffect, useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import { createBMI, getLatestBMI } from "../api";
import Navbar from "../components/Navbar";

/* ---------------------------------------------------------
   BMI CALCULATOR :: HUD theme, matches Dashboard / ExerciseLibrary / WorkoutPlan
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   amber #ffb020  orange #ff8a1f  red #ff3b5c  mint #21ffa3
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const fetchLatestBMI = async () => {
      try {
        setLoading(true);

        const data = await getLatestBMI();

        if (data?.record) {
          setHeight(data.record.height);
          setWeight(data.record.weight);
          setBmi(data.record.bmi);
          setCategory(data.record.category);
        }
      } catch (err) {
        const detail =
          err?.response?.data?.message || err?.message || err.toString();
        setError(detail);
      } finally {
        setLoading(false);
        requestAnimationFrame(() => setBooted(true));
      }
    };

    fetchLatestBMI();
  }, []);

  const calculateBMI = async () => {
    if (!height || !weight) return;

    const h = height / 100;
    const bmiValue = (weight / (h * h)).toFixed(1);

    let bmiCategory = "";

    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 25) bmiCategory = "Normal";
    else if (bmiValue < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setBmi(bmiValue);
    setCategory(bmiCategory);
    setError("");

    try {
      await createBMI({
        height,
        weight,
        bmi: bmiValue,
        category: bmiCategory,
      });
    } catch (err) {
      const detail =
        err?.response?.data?.message || err?.message || err.toString();
      setError(detail);
    }
  };

  const getColor = () => {
    if (!bmi) return "#5b6b85";
    if (bmi < 18.5) return "#ffb020";
    if (bmi < 25) return "#21ffa3";
    if (bmi < 30) return "#ff8a1f";
    return "#ff3b5c";
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
              LOADING BMI DATA…
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

        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
          50% { filter: drop-shadow(0 0 10px currentColor); }
        }
        .pulse-glow { animation: pulseGlow 2.4s ease-in-out infinite; }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: riseIn 0.55s cubic-bezier(.2,.7,.3,1) both; }

        .hud-panel {
          background: linear-gradient(180deg, rgba(13,21,34,0.9), rgba(7,12,20,0.92));
          border: 1px solid rgba(34,229,255,0.16);
          clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
          position: relative;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .hud-panel:hover {
          border-color: rgba(34,229,255,0.35);
          box-shadow: 0 0 24px rgba(34,229,255,0.07);
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

        .hud-btn-primary {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.12em;
          background: linear-gradient(180deg, rgba(34,229,255,0.2), rgba(34,229,255,0.08));
          border: 1px solid rgba(34,229,255,0.5);
          color: #aef3ff;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
          clip-path: polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
        }
        .hud-btn-primary:hover {
          background: linear-gradient(180deg, rgba(34,229,255,0.32), rgba(34,229,255,0.14));
          box-shadow: 0 0 18px rgba(34,229,255,0.25);
          transform: translateY(-1px);
        }
        .hud-btn-primary:active { transform: translateY(0) scale(0.99); }

        .dash-ring {
          stroke-dasharray: 500;
          transition: stroke-dashoffset 1.1s cubic-bezier(.2,.7,.3,1);
        }

        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 22s linear infinite; }
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
              BIO-METRIC&nbsp;&nbsp;SCAN MODULE
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            BMI CALCULATOR
          </h1>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            {bmi ? "RECORD FOUND" : "NO RECORD"}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div
            className="hud-panel rise-in p-6"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
            <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
            <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
            <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="hud-display text-sm font-bold tracking-[0.15em] text-slate-100">
                ENTER YOUR DETAILS
              </h3>
              <span className="hud-mono text-[10px] tracking-[0.2em] text-cyan-400/60">
                INPUT
              </span>
            </div>

            {error && (
              <p className="hud-mono text-xs text-[#ff3b5c] mb-4 tracking-wide">
                ⚠ {error.toUpperCase()}
              </p>
            )}

            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="hud-input w-full px-4 py-3 rounded-sm mb-4 text-sm"
            />

            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="hud-input w-full px-4 py-3 rounded-sm mb-6 text-sm"
            />

            <button
              onClick={calculateBMI}
              className="hud-btn-primary w-full py-4 text-xs"
            >
              CALCULATE BMI
            </button>
          </div>

          {/* Result */}
          <div
            className="hud-panel rise-in p-6"
            style={{ animationDelay: "0.12s" }}
          >
            <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
            <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
            <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
            <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="hud-display text-sm font-bold tracking-[0.15em] text-slate-100">
                BMI RESULT
              </h3>
              <FaHeartbeat
                className="text-lg pulse-glow"
                style={{ color: getColor() }}
              />
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <svg
                  className="absolute inset-0 spin-slow"
                  viewBox="0 0 192 192"
                >
                  {Array.from({ length: 30 }).map((_, i) => (
                    <line
                      key={i}
                      x1="96"
                      y1="6"
                      x2="96"
                      y2={i % 3 === 0 ? "14" : "11"}
                      stroke="rgba(34,229,255,0.3)"
                      strokeWidth="1"
                      transform={`rotate(${i * 12} 96 96)`}
                    />
                  ))}
                </svg>

                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="12"
                    fill="none"
                  />

                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke={getColor()}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className="dash-ring"
                    style={{
                      strokeDashoffset:
                        booted && bmi ? 500 - (bmi / 40) * 500 : 500,
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="hud-display text-5xl font-bold text-slate-100">
                    {bmi || "--"}
                  </div>

                  <div className="hud-mono text-[10px] tracking-[0.25em] text-slate-500 mt-1">
                    BMI
                  </div>
                </div>
              </div>

              <div
                className="hud-display text-2xl font-bold tracking-wide"
                style={{ color: getColor() }}
              >
                {category ? category.toUpperCase() : "--"}
              </div>

              <p className="hud-mono text-[11px] text-slate-500 mt-3 tracking-wide text-center">
                {bmi
                  ? "CURRENT CLASSIFICATION ON RECORD"
                  : "AWAITING INPUT TO CALCULATE"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
