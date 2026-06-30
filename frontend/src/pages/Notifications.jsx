import { useState } from "react";
import {
  FaFire,
  FaTrophy,
  FaDumbbell,
  FaHeartbeat,
  FaBell,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

const initialNotifications = [
  {
    id: 1,
    icon: <FaTrophy className="text-yellow-400" />,
    title: "Welcome to PowerRise!",
    message: "Set up your profile and log your first workout to get started.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    icon: <FaHeartbeat className="text-red-400" />,
    title: "Track your BMI",
    message: "Use the BMI Calculator to keep an eye on your health stats.",
    time: "Today",
    read: false,
  },
  {
    id: 3,
    icon: <FaDumbbell className="text-purple-400" />,
    title: "Build a workout plan",
    message: "Create a personalized workout plan to stay consistent.",
    time: "Today",
    read: true,
  },
  {
    id: 4,
    icon: <FaFire className="text-orange-400" />,
    title: "Stay consistent",
    message: "Daily workouts build your streak — try not to break the chain!",
    time: "Yesterday",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true,
      })),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      `}</style>

      {/* GRID BACKGROUND */}
      <div className="hud-grid absolute inset-0 opacity-60" />

      {/* SCANLINE EFFECT */}
      <div className="scanline" />

      <Navbar />

      <div className="max-w-5xl mx-auto p-6 relative">
        {/* HEADER (HUD STYLE) */}
        <div className="hud-panel rise-in p-5 flex justify-between items-center mb-6">
          <div>
            <h1 className="hud-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400">
              NOTIFICATIONS
            </h1>
            <p className="hud-mono text-xs text-slate-400 tracking-widest mt-1">
              SYSTEM ALERT STREAM / FITNESS CORE
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="hud-mono px-4 py-2 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 transition-colors"
              style={{
                clipPath:
                  "polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)",
              }}
            >
              MARK ALL READ
            </button>
          )}
        </div>

        {/* STATS PANEL */}
        <div className="hud-panel rise-in p-4 mb-6 flex items-center gap-4">
          <FaBell className="text-cyan-300 text-2xl pulse-glow" />

          <div>
            <h3 className="hud-display text-xl text-slate-100">
              {unreadCount} UNREAD SIGNALS
            </h3>
            <p className="hud-mono text-xs text-slate-400">
              Monitoring active fitness events
            </p>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`hud-panel p-5 flex items-start gap-4 rise-in transition-transform hover:-translate-y-1 ${
                n.read
                  ? "border-white/10"
                  : "border-cyan-400/40 shadow-[0_0_20px_rgba(34,229,255,0.08)]"
              }`}
            >
              {/* ICON */}
              <div className="w-12 h-12 flex items-center justify-center bg-[#0a101c] rounded-lg text-xl shrink-0">
                {n.icon}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="hud-display text-lg text-slate-100">
                    {n.title}
                  </h3>
                  <span className="hud-mono text-xs text-slate-500">
                    {n.time}
                  </span>
                </div>

                <p className="hud-mono text-sm text-slate-400 mt-1">
                  {n.message}
                </p>
              </div>

              {/* UNREAD SIGNAL */}
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse mt-2 shadow-[0_0_10px_#22e5ff]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
