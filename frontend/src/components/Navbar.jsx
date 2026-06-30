import { useEffect, useState } from "react";
import { FaBell, FaDumbbell } from "react-icons/fa";
import { getProfile } from "../api";

/* ---------------------------------------------------------
   NAVBAR :: HUD theme, matches Dashboard / ExerciseLibrary / WorkoutPlan
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function Navbar() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data && data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="hud-nav" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      <style>{`
        ${FONT_IMPORT}

        .hud-mono { font-family: 'Share Tech Mono', monospace; }
        .hud-display { font-family: 'Orbitron', sans-serif; }

        .hud-nav {
          width: 100%;
          padding: 14px 30px;
          background: rgba(7,12,20,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34,229,255,0.16);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .hud-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          background: linear-gradient(135deg, rgba(34,229,255,0.25), rgba(59,111,237,0.25));
          border: 1px solid rgba(34,229,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .hud-logo-group:hover .hud-logo-icon {
          box-shadow: 0 0 14px rgba(34,229,255,0.35);
          transform: translateY(-1px);
        }

        .hud-logo-text {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.08em;
          background: linear-gradient(to right, #22e5ff, #3b6fed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
        }
        .hud-pulse-dot { animation: blink 1.8s ease-in-out infinite; }

        .hud-bell-btn {
          background: #0a101c;
          border: 1px solid rgba(34,229,255,0.2);
          width: 38px;
          height: 38px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #aef3ff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
          clip-path: polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
        }
        .hud-bell-btn:hover {
          border-color: rgba(34,229,255,0.55);
          box-shadow: 0 0 12px rgba(34,229,255,0.25);
          transform: translateY(-1px);
        }

        .hud-profile-group {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 4px 10px 4px 4px;
          border-radius: 999px;
          border: 1px solid transparent;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .hud-profile-group:hover {
          border-color: rgba(34,229,255,0.3);
          background: rgba(34,229,255,0.05);
        }

        .hud-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22e5ff, #3b6fed);
          color: #03141c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(34,229,255,0.5);
        }

        .hud-avatar-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(34,229,255,0.5);
        }

        .hud-name {
          font-size: 13px;
          font-weight: 600;
          color: #d6e9f8;
          letter-spacing: 0.02em;
        }
      `}</style>

      <div
        className="hud-logo-group"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
        onClick={() => (window.location = "/dashboard")}
      >
        <div className="hud-logo-icon">
          <FaDumbbell color="#aef3ff" size={15} />
        </div>
        <span className="hud-logo-text">NeuroFit</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <button
          onClick={() => (window.location = "/notifications")}
          className="hud-bell-btn"
          title="Notifications"
        >
          <FaBell size={16} />
        </button>

        <div
          className="hud-profile-group"
          onClick={() => (window.location = "/profile")}
          title="Go to profile"
        >
          {profile?.photo ? (
            <img src={profile.photo} alt="Profile" className="hud-avatar-img" />
          ) : (
            <div className="hud-avatar">{initials}</div>
          )}
          <span className="hud-name hud-mono">
            {profile?.name || "GUEST USER"}
          </span>
        </div>
      </div>
    </div>
  );
}
