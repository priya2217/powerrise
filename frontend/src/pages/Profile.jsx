import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, saveProfile } from "../api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { FaEdit, FaSave, FaSignOutAlt } from "react-icons/fa";

/* ---------------------------------------------------------
   PROFILE :: HUD theme, matches Dashboard / WorkoutPlan / BMICalculator
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   mint #21ffa3  red #ff3b5c
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    photo: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [booted, setBooted] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile();

        if (response?.success && response?.profile) {
          setProfile(response.profile);
        }
      } catch (err) {
        console.error(err);
        const detail =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile";
        setError(detail);
      } finally {
        setLoading(false);
        requestAnimationFrame(() => setBooted(true));
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({
        ...profile,
        photo: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfile({
      ...profile,
      photo: null,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await saveProfile(profile);

      if (response?.success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save profile";
      setError(detail);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

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
              LOADING PROFILE…
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
        }
        .hud-corner {
          position: absolute; width: 14px; height: 14px;
          border-color: rgba(34,229,255,0.55);
        }

        .hud-avatar-ring {
          border: 2px solid rgba(34,229,255,0.5);
          box-shadow: 0 0 24px rgba(34,229,255,0.15);
        }

        .hud-field {
          background: #0a101c;
          border: 1px solid rgba(34,229,255,0.12);
          border-radius: 2px;
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

        .hud-btn-save {
          background: rgba(33,255,163,0.1);
          border: 1px solid rgba(33,255,163,0.45);
          color: #9dffd9;
        }
        .hud-btn-save:hover:not(:disabled) { background: rgba(33,255,163,0.18); box-shadow: 0 0 16px rgba(33,255,163,0.22); }

        .hud-btn-ghost {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8;
        }
        .hud-btn-ghost:hover { background: rgba(255,255,255,0.06); }

        .hud-btn-delete {
          background: rgba(255,59,92,0.08);
          border: 1px solid rgba(255,59,92,0.4);
          color: #ffb3c2;
        }
        .hud-btn-delete:hover { background: rgba(255,59,92,0.16); box-shadow: 0 0 14px rgba(255,59,92,0.2); }
      `}</style>

      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="scanline" />

      <Navbar />

      <div className="relative max-w-4xl mx-auto p-6">
        {/* Top status strip */}
        <div className="rise-in flex flex-wrap items-center justify-between gap-4 mb-6 hud-panel px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#21ffa3] blink" />
            <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
              IDENTITY&nbsp;&nbsp;RECORD
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            MY PROFILE
          </h1>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            {isEditing ? "EDIT MODE" : "VIEW MODE"}
          </span>
        </div>

        {error && (
          <p className="hud-mono text-xs text-[#ff3b5c] mb-5 tracking-wide rise-in">
            ⚠ {error.toUpperCase()}
          </p>
        )}

        {/* Profile Card */}
        <div
          className="hud-panel rise-in p-8"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
          <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

          {/* Avatar */}
          <div className="flex flex-col items-center">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="profile"
                className="hud-avatar-ring w-36 h-36 rounded-full object-cover"
              />
            ) : (
              <div className="hud-avatar-ring w-36 h-36 rounded-full bg-[#0a101c] flex items-center justify-center">
                <span className="hud-display text-4xl font-bold text-cyan-300">
                  {initials}
                </span>
              </div>
            )}

            {isEditing && (
              <div className="mt-5 flex flex-col items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hud-mono text-xs text-slate-400"
                />

                {profile.photo && (
                  <button
                    onClick={removePhoto}
                    className="hud-btn hud-btn-delete px-4 py-2 text-[11px]"
                  >
                    REMOVE PHOTO
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Profile Fields */}
          <div className="mt-8 space-y-3">
            {isEditing ? (
              <>
                <input
                  name="name"
                  placeholder="Name"
                  value={profile.name || ""}
                  onChange={handleChange}
                  className="hud-input w-full px-4 py-3 rounded-sm text-sm"
                />

                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={profile.age || ""}
                  onChange={handleChange}
                  className="hud-input w-full px-4 py-3 rounded-sm text-sm"
                />

                <input
                  name="height"
                  type="number"
                  placeholder="Height (cm)"
                  value={profile.height || ""}
                  onChange={handleChange}
                  className="hud-input w-full px-4 py-3 rounded-sm text-sm"
                />

                <input
                  name="weight"
                  type="number"
                  placeholder="Weight (kg)"
                  value={profile.weight || ""}
                  onChange={handleChange}
                  className="hud-input w-full px-4 py-3 rounded-sm text-sm"
                />
              </>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <ProfileField
                  label="NAME"
                  value={profile.name}
                  delay="0s"
                  booted={booted}
                />
                <ProfileField
                  label="AGE"
                  value={profile.age}
                  delay="0.05s"
                  booted={booted}
                />
                <ProfileField
                  label="HEIGHT"
                  value={profile.height ? `${profile.height} cm` : ""}
                  delay="0.1s"
                  booted={booted}
                />
                <ProfileField
                  label="WEIGHT"
                  value={profile.weight ? `${profile.weight} kg` : ""}
                  delay="0.15s"
                  booted={booted}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="hud-btn hud-btn-save px-6 py-3 text-xs flex items-center gap-2"
                >
                  <FaSave size={12} />
                  {saving ? "SAVING…" : "SAVE"}
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="hud-btn hud-btn-ghost px-6 py-3 text-xs"
                >
                  CANCEL
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="hud-btn hud-btn-primary px-6 py-3 text-xs flex items-center gap-2"
              >
                <FaEdit size={12} />
                EDIT PROFILE
              </button>
            )}

            <button
              onClick={handleLogout}
              className="hud-btn hud-btn-delete px-6 py-3 text-xs flex items-center gap-2"
            >
              <FaSignOutAlt size={12} />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, delay, booted }) {
  return (
    <div
      className="hud-field fade-scale p-4"
      style={{ animationDelay: booted ? delay : "0s" }}
    >
      <p className="hud-mono text-[10px] tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="hud-display text-base font-bold text-slate-100 mt-1">
        {value || "NOT SET"}
      </p>
    </div>
  );
}
