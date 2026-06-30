import { useEffect, useState } from "react";
import {
  FaDumbbell,
  FaHeartbeat,
  FaFire,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaShoePrints,
  FaTint,
} from "react-icons/fa";
import { getDashboardStats, getLatestBMI } from "../api";
import Navbar from "../components/Navbar";
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    caloriesBurned: 0,
    streak: 0,
    avgWorkoutTime: 0,
  });
  const [bmiRecord, setBmiRecord] = useState(null);
  const [booted, setBooted] = useState(false);
  const clock = useClock();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [statsRes, bmiRes] = await Promise.allSettled([
          getDashboardStats(),
          getLatestBMI(),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value?.success) {
          setStats(statsRes.value.stats);
        }

        if (bmiRes.status === "fulfilled" && bmiRes.value?.record) {
          setBmiRecord(bmiRes.value.record);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
        requestAnimationFrame(() => setBooted(true));
      }
    };

    fetchDashboardData();
  }, []);

  const bmi = bmiRecord?.bmi || null;

  const bmiStatus = () => {
    if (!bmi) return { text: "NO DATA", color: "#5b6b85" };
    if (bmi < 18.5) return { text: "UNDERWEIGHT", color: "#ffb020" };
    if (bmi < 25) return { text: "OPTIMAL", color: "#21ffa3" };
    if (bmi < 30) return { text: "ELEVATED", color: "#ffb020" };
    return { text: "CRITICAL", color: "#ff3b5c" };
  };
  const status = bmiStatus();

  // Daily goal targets driving the core gauge rings — adjust to taste / wire to real goals
  const GOALS = { workouts: 5, calories: 3000, time: 60 };
  const pctWorkouts = Math.min(1, stats.totalWorkouts / GOALS.workouts);
  const pctCalories = Math.min(1, stats.caloriesBurned / GOALS.calories);
  const pctTime = Math.min(1, stats.avgWorkoutTime / GOALS.time);
  const corePct = Math.round(((pctWorkouts + pctCalories + pctTime) / 3) * 100);
  const coreDisplay = useCountUp(booted ? corePct : 0);

  const timeStr = clock.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = clock
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#04070d] flex items-center justify-center">
        <style>{FONT_IMPORT}</style>
        <Navbar />
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
            INITIALIZING BIO-CORE…
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

        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
          50% { filter: drop-shadow(0 0 10px currentColor); }
        }
        .pulse-glow { animation: pulseGlow 2.4s ease-in-out infinite; }

        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 18s linear infinite; }

        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
        }
        .blink { animation: blink 1.6s ease-in-out infinite; }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: riseIn 0.6s cubic-bezier(.2,.7,.3,1) both; }

        .hud-panel {
          background: linear-gradient(180deg, rgba(13,21,34,0.9), rgba(7,12,20,0.92));
          border: 1px solid rgba(34,229,255,0.16);
          clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
          position: relative;
        }
        .hud-panel::before {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(120% 60% at 0% 0%, rgba(34,229,255,0.06), transparent 60%);
          pointer-events: none;
        }
        .hud-corner {
          position: absolute; width: 14px; height: 14px;
          border-color: rgba(34,229,255,0.55);
        }

        .dash-ring {
          stroke-dasharray: 1000;
          transition: stroke-dashoffset 1.1s cubic-bezier(.2,.7,.3,1);
        }
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        .bar-grow { transform-origin: bottom; animation: barGrow 0.9s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      `}</style>

      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="scanline" />

      <Navbar />

      <div className="relative p-6 max-w-[1400px] mx-auto">
        {/* Top status strip */}
        <div className="rise-in flex flex-wrap items-center justify-between gap-4 mb-6 hud-panel px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#21ffa3] blink" />
            <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
              BIO-CORE MAINFRAME&nbsp;&nbsp;v4.2
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            NeuroFit{" "}
          </h1>
          <div className="hud-mono text-right text-cyan-300/90 text-sm leading-tight">
            <div className="text-lg tracking-widest">{timeStr}</div>
            <div className="text-[10px] text-slate-400 tracking-[0.15em]">
              {dateStr}
            </div>
          </div>
        </div>

        {error && (
          <p className="hud-mono text-xs text-[#ff3b5c] mb-4 tracking-wide">
            ⚠ {error.toUpperCase()}
          </p>
        )}

        {/* Capacity dials row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Dial
            icon={<FaTrophy />}
            label="WORKOUTS"
            value={stats.totalWorkouts}
            pct={pctWorkouts}
            color="#ffb020"
            sub={`GOAL ${GOALS.workouts}`}
            delay="0s"
            booted={booted}
          />
          <Dial
            icon={<FaFire />}
            label="CALORIES"
            value={stats.caloriesBurned}
            pct={pctCalories}
            color="#ff3b5c"
            sub={`GOAL ${GOALS.calories}`}
            delay="0.08s"
            booted={booted}
          />
          <Dial
            icon={<FaChartLine />}
            label="STREAK"
            value={stats.streak}
            pct={Math.min(1, stats.streak / 30)}
            color="#21ffa3"
            sub="DAYS / 30"
            delay="0.16s"
            booted={booted}
          />
          <Dial
            icon={<FaClock />}
            label="AVG TIME"
            value={stats.avgWorkoutTime}
            pct={pctTime}
            color="#3b6fed"
            sub={`MIN / GOAL ${GOALS.time}`}
            delay="0.24s"
            booted={booted}
          />
        </div>

        {/* Main grid: vitals log | core gauge | bio status */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-5">
          {/* Vitals log */}
          <Panel title="WEEKLY VITALS LOG" eyebrow="ACTIVITY" delay="0.3s">
            <WeeklyBars seed={stats.totalWorkouts || 4} booted={booted} />
            <div className="mt-4 grid grid-cols-2 gap-3 hud-mono text-[11px]">
              <MiniStat
                icon={<FaShoePrints />}
                label="STEPS TODAY"
                value="7,420"
                color="#22e5ff"
              />
              <MiniStat
                icon={<FaTint />}
                label="HYDRATION"
                value="1.8 L"
                color="#3b6fed"
              />
            </div>
          </Panel>

          {/* Core gauge */}
          <Panel
            title="DAILY CORE"
            eyebrow="COMPLETION"
            delay="0.36s"
            highlight
          >
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-64 h-64">
                <svg
                  className="absolute inset-0 spin-slow"
                  viewBox="0 0 200 200"
                >
                  {Array.from({ length: 36 }).map((_, i) => (
                    <line
                      key={i}
                      x1="100"
                      y1="6"
                      x2="100"
                      y2={i % 3 === 0 ? "14" : "11"}
                      stroke="rgba(34,229,255,0.35)"
                      strokeWidth="1"
                      transform={`rotate(${i * 10} 100 100)`}
                    />
                  ))}
                </svg>

                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 200 200"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    fill="none"
                    stroke="rgba(255,176,32,0.12)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    fill="none"
                    stroke="#ffb020"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="dash-ring"
                    style={{
                      strokeDashoffset: booted
                        ? 1000 - pctWorkouts * 540
                        : 1000,
                    }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="68"
                    fill="none"
                    stroke="rgba(255,59,92,0.12)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="68"
                    fill="none"
                    stroke="#ff3b5c"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="dash-ring"
                    style={{
                      strokeDashoffset: booted
                        ? 1000 - pctCalories * 427
                        : 1000,
                    }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="50"
                    fill="none"
                    stroke="rgba(34,229,255,0.12)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="50"
                    fill="none"
                    stroke="#22e5ff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="dash-ring"
                    style={{
                      strokeDashoffset: booted ? 1000 - pctTime * 314 : 1000,
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="hud-display text-5xl font-bold text-cyan-300 pulse-glow">
                    {Math.round(coreDisplay)}%
                  </span>
                  <span className="hud-mono text-[10px] tracking-[0.25em] text-slate-400 mt-1">
                    DAY COMPLETE
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-5 hud-mono text-[10px] tracking-wide">
                <LegendDot color="#ffb020" label="WORKOUTS" />
                <LegendDot color="#ff3b5c" label="CALORIES" />
                <LegendDot color="#22e5ff" label="TIME" />
              </div>
            </div>
          </Panel>

          {/* Bio status */}
          <Panel title="BIO STATUS" eyebrow="HEALTH" delay="0.42s">
            <div className="flex flex-col items-center py-2">
              <div className="relative w-32 h-32 mb-3">
                <FaHeartbeat
                  className="absolute inset-0 m-auto text-[42px] pulse-glow"
                  style={{ color: status.color }}
                />
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    stroke={status.color}
                    className="dash-ring"
                    style={{
                      strokeDasharray: 327,
                      strokeDashoffset:
                        booted && bmi ? 327 - Math.min(1, bmi / 40) * 327 : 327,
                    }}
                  />
                </svg>
              </div>
              <p className="hud-display text-3xl font-bold text-slate-100">
                {bmi || "--"}
              </p>
              <p
                className="hud-mono text-xs tracking-[0.2em] mt-1"
                style={{ color: status.color }}
              >
                {status.text}
              </p>
              {!bmi && (
                <button
                  onClick={() => (window.location = "/bmi")}
                  className="hud-mono mt-4 px-4 py-2 text-[11px] tracking-wide border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 transition-colors"
                  style={{
                    clipPath:
                      "polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)",
                  }}
                >
                  RUN BMI SCAN
                </button>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-cyan-400/10 hud-mono text-[11px] text-slate-400 flex items-center gap-2">
              <FaDumbbell className="text-cyan-400/70" />
              Stay consistent — system tracking nominal.
            </div>
          </Panel>
        </div>

        {/* Quick action control bar */}
        <Panel
          title="CONTROL PANEL"
          eyebrow="ACTIONS"
          delay="0.5s"
          className="mt-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <ControlButton
              label="EXERCISES"
              icon="🏃"
              onClick={() => (window.location = "/exercises")}
            />
            <ControlButton
              label="WORKOUT PLAN"
              icon="🗓"
              onClick={() => (window.location = "/plan")}
            />
            <ControlButton
              label="TIMER"
              icon="⏱"
              onClick={() => (window.location = "/timer")}
            />
            <ControlButton
              label="BMI CALC"
              icon="📊"
              onClick={() => (window.location = "/bmi")}
            />
            <ControlButton
              label="AI ASSISTANT"
              icon="🤖"
              onClick={() => (window.location = "/ai-chat")}
            />
            <ControlButton
              label="SETTINGS"
              icon="⚙️"
              onClick={() => (window.location = "/settings")}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, eyebrow, children, delay, highlight, className = "" }) {
  return (
    <div
      className={`hud-panel rise-in p-5 ${highlight ? "shadow-[0_0_30px_rgba(34,229,255,0.08)]" : ""} ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
      <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
      <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
      <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="hud-display text-sm font-bold tracking-[0.15em] text-slate-100">
          {title}
        </h3>
        <span className="hud-mono text-[10px] tracking-[0.2em] text-cyan-400/60">
          {eyebrow}
        </span>
      </div>
      {children}
    </div>
  );
}

function Dial({ icon, label, value, pct, color, sub, delay, booted }) {
  const circumference = 2 * Math.PI * 34;
  return (
    <div
      className="hud-panel rise-in p-4 flex items-center gap-4"
      style={{ animationDelay: delay }}
    >
      <div className="relative w-16 h-16 shrink-0">
        <svg className="-rotate-90 w-16 h-16" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke={color}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: booted
                ? circumference - pct * circumference
                : circumference,
              transition: "stroke-dashoffset 1s cubic-bezier(.2,.7,.3,1)",
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-base"
          style={{ color }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="hud-display text-2xl font-bold text-slate-100 leading-none">
          {value}
        </p>
        <p className="hud-mono text-[10px] tracking-[0.18em] text-slate-400 mt-1">
          {label}
        </p>
        <p className="hud-mono text-[9px] tracking-[0.15em] text-slate-600">
          {sub}
        </p>
      </div>
    </div>
  );
}

function WeeklyBars({ seed, booted }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  // deterministic-ish pseudo data derived from seed so it isn't static across renders
  const heights = days.map((_, i) => {
    const v = Math.abs(Math.sin((seed + 1) * (i + 1) * 1.7)) * 70 + 25;
    return Math.round(v);
  });
  return (
    <div className="flex items-end justify-between h-32 gap-2">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full h-full flex items-end">
            <div
              className="bar-grow w-full rounded-sm"
              style={{
                height: booted ? `${h}%` : "0%",
                background:
                  "linear-gradient(180deg, #22e5ff, rgba(34,229,255,0.15))",
                animationDelay: `${0.5 + i * 0.06}s`,
                transition: "height 0.8s cubic-bezier(.2,.7,.3,1)",
              }}
            />
          </div>
          <span className="hud-mono text-[10px] text-slate-500">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function MiniStat({ icon, label, value, color }) {
  return (
    <div className="hud-panel px-3 py-2 flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <div>
        <p className="text-slate-100 text-sm leading-none">{value}</p>
        <p className="text-[9px] text-slate-500 tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-400">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function ControlButton({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="hud-mono group relative border border-cyan-400/20 hover:border-cyan-300/60 bg-cyan-400/[0.02] hover:bg-cyan-400/[0.07] transition-all duration-200 px-4 py-4 flex flex-col items-center gap-2 text-[11px] tracking-wider text-slate-300 hover:text-cyan-200"
      style={{
        clipPath:
          "polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)",
      }}
    >
      <span className="text-xl group-hover:scale-110 transition-transform">
        {icon}
      </span>
      {label}
    </button>
  );
}
