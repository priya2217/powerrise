import AIChatBox from "./AIChatBox";
import Navbar from "../components/Navbar";
import { FaRobot } from "react-icons/fa";

/* ---------------------------------------------------------
   AI CHAT PAGE :: HUD theme, matches Dashboard / WorkoutPlan / BMICalculator
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function AIChatPage() {
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

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out both; }

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

        .hud-bot-icon {
          width: 56px; height: 56px;
          border-radius: 4px;
          background: rgba(34,229,255,0.1);
          border: 1px solid rgba(34,229,255,0.4);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="scanline" />

      <Navbar />

      <div className="relative max-w-6xl mx-auto p-6">
        {/* Top status strip */}
        <div className="animate-slideDown flex flex-wrap items-center justify-between gap-4 mb-6 hud-panel px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#21ffa3] blink" />
            <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
              AI ASSISTANT&nbsp;&nbsp;UPLINK ACTIVE
            </span>
          </div>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            MODEL: FITNESS-CORE
          </span>
        </div>

        {/* Header */}
        <div
          className="mb-8 animate-slideDown"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="flex items-center gap-4">
            <div className="hud-bot-icon">
              <FaRobot className="text-cyan-300 pulse-glow" size={22} />
            </div>

            <div>
              <h1 className="hud-display text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                AI FITNESS ASSISTANT
              </h1>

              <p className="hud-mono text-[12px] text-slate-400 mt-2 tracking-wide">
                ASK ABOUT WORKOUTS, FORM, NUTRITION, RECOVERY AND GOALS
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div
          className="hud-panel animate-slideUp p-6"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
          <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

          <AIChatBox height="70vh" />
        </div>
      </div>
    </div>
  );
}
