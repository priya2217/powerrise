import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login({ email, password });

      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        background:
          "radial-gradient(circle at 18% 20%, rgba(139,43,255,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,43,214,0.14), transparent 45%), #05010c",
      }}
    >
      <style>{`
        ${FONT_IMPORT}

        .cb-mono { font-family: 'Share Tech Mono', monospace; }
        .cb-display { font-family: 'Orbitron', sans-serif; }

        .cb-grid {
          background-image:
            linear-gradient(rgba(0,246,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,43,214,0.05) 1px, transparent 1px);
          background-size: 34px 34px;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .cb-scanline {
          position: absolute; left: 0; right: 0; height: 140px;
          background: linear-gradient(to bottom, transparent, rgba(0,246,255,0.07), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: riseIn 0.6s cubic-bezier(.2,.7,.3,1) both; }

        @keyframes flickerBorder {
          0%, 19%, 21%, 23%, 55%, 100% { opacity: 1; }
          20%, 22%, 54% { opacity: 0.55; }
        }
        .cb-panel {
          background: linear-gradient(160deg, rgba(24,6,42,0.92), rgba(5,1,12,0.96));
          border: 1px solid rgba(0,246,255,0.22);
          box-shadow:
            0 0 0 1px rgba(255,43,214,0.08),
            0 0 28px rgba(0,246,255,0.10),
            0 0 70px rgba(255,43,214,0.08),
            inset 0 0 30px rgba(139,43,255,0.06);
          clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
          position: relative;
        }
        .cb-panel-edge {
          position: absolute; inset: 0;
          pointer-events: none;
          animation: flickerBorder 5s infinite;
          box-shadow: 0 0 0 1px rgba(0,246,255,0.18);
          clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
        }
        .cb-top-bar {
          height: 3px;
          background: linear-gradient(90deg, #00f6ff, #8b2bff 50%, #ff2bd6);
        }

        .glitch-title {
          position: relative;
          display: inline-block;
          color: #f3f3ff;
        }
        .glitch-title::before,
        .glitch-title::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
        }
        .glitch-title::before {
          color: #00f6ff;
          z-index: -1;
          animation: glitchAnim1 3.2s infinite linear alternate-reverse;
        }
        .glitch-title::after {
          color: #ff2bd6;
          z-index: -2;
          animation: glitchAnim2 3.2s infinite linear alternate-reverse;
        }
        @keyframes glitchAnim1 {
          0% { clip-path: inset(20% 0 60% 0); transform: translate(-1.5px, -1px); }
          25% { clip-path: inset(60% 0 5% 0); transform: translate(1.5px, 1px); }
          50% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1.5px); }
          75% { clip-path: inset(40% 0 30% 0); transform: translate(1.5px, -1.5px); }
          100% { clip-path: inset(5% 0 80% 0); transform: translate(-1px, 1px); }
        }
        @keyframes glitchAnim2 {
          0% { clip-path: inset(70% 0 5% 0); transform: translate(1.5px, 1px); }
          25% { clip-path: inset(10% 0 70% 0); transform: translate(-1.5px, -1px); }
          50% { clip-path: inset(50% 0 20% 0); transform: translate(1px, -1.5px); }
          75% { clip-path: inset(20% 0 60% 0); transform: translate(-1.5px, 1.5px); }
          100% { clip-path: inset(60% 0 10% 0); transform: translate(1px, -1px); }
        }

        .cb-kana {
          writing-mode: vertical-rl;
          letter-spacing: 6px;
          color: rgba(0,246,255,0.35);
          text-shadow: 0 0 8px rgba(0,246,255,0.45);
        }

        .cb-input {
          background: #0a0414;
          border: 1px solid rgba(0,246,255,0.2);
          color: #ece9ff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cb-input::placeholder { color: #5b5478; }
        .cb-input:focus {
          outline: none;
          border-color: rgba(255,43,214,0.55);
          box-shadow: 0 0 0 3px rgba(255,43,214,0.10), 0 0 14px rgba(0,246,255,0.15);
        }

        .cb-btn {
          background: linear-gradient(90deg, rgba(0,246,255,0.18), rgba(255,43,214,0.18));
          border: 1px solid rgba(0,246,255,0.45);
          color: #e8feff;
          text-shadow: 0 0 6px rgba(0,246,255,0.6);
          transition: all 0.2s ease;
        }
        .cb-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, rgba(0,246,255,0.32), rgba(255,43,214,0.32));
          border-color: rgba(255,43,214,0.7);
          box-shadow: 0 0 18px rgba(255,43,214,0.35), 0 0 18px rgba(0,246,255,0.25);
        }

        .cb-boot-line {
          opacity: 0;
          animation: riseIn 0.5s ease forwards;
        }
      `}</style>

      <div className="cb-grid absolute inset-0 opacity-70" />
      <div className="cb-scanline" />

      {/* Decorative vertical kana strip */}
      <div className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 cb-mono cb-kana text-lg select-none pointer-events-none">
        ログイン・システム
      </div>

      <div className="cb-panel rise-in relative z-10 w-[420px] max-w-[90%] overflow-hidden">
        <div className="cb-top-bar" />
        <div className="cb-panel-edge" />

        <div className="p-8">
          <p className="cb-mono text-[10px] tracking-[0.3em] text-cyan-300/60 mb-1">
            NeuroFit — ACCESS TERMINAL
          </p>

          <h1
            data-text="LOG IN"
            className="glitch-title cb-display text-4xl font-black tracking-wide mb-2"
          >
            LOG IN
          </h1>

          <div className="cb-mono text-[10px] text-fuchsia-300/50 leading-relaxed mb-6 space-y-0.5">
            <p className="cb-boot-line" style={{ animationDelay: "0.1s" }}>
              &gt; INIT_SESSION ............ OK
            </p>
            <p className="cb-boot-line" style={{ animationDelay: "0.25s" }}>
              &gt; AWAITING_CREDENTIALS ....
            </p>
          </div>

          {error && (
            <div
              className="cb-mono text-xs text-[#ff3b6b] border border-[#ff3b6b]/40 bg-[#ff3b6b]/10 px-3 py-2 mb-5 tracking-wide"
              style={{ boxShadow: "0 0 12px rgba(255,59,107,0.25)" }}
            >
              ⚠ {error.toUpperCase()}
            </div>
          )}

          <label className="cb-mono text-[10px] tracking-[0.2em] text-fuchsia-300/70 mb-1 block">
            EMAIL_ADDRESS
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            className="cb-input w-full px-4 py-3 mb-4 text-sm"
          />

          <label className="cb-mono text-[10px] tracking-[0.2em] text-fuchsia-300/70 mb-1 block">
            PASSWORD
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            className="cb-input w-full px-4 py-3 mb-6 text-sm"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="cb-btn cb-mono w-full py-3 tracking-[0.2em] text-sm font-bold disabled:opacity-60"
            style={{
              clipPath:
                "polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)",
            }}
          >
            {loading ? "AUTHENTICATING…" : "ENTER_GRID"}
          </button>

          <p className="cb-mono text-[11px] text-center text-slate-500 mt-6 tracking-wide">
            no account?{" "}
            <Link to="/signup" className="text-cyan-300 hover:text-fuchsia-300">
              register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
