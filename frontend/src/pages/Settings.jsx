import { useEffect, useState } from "react";
import {
  FaMoon,
  FaBell,
  FaUserLock,
  FaEnvelope,
  FaVolumeUp,
  FaSignOutAlt,
  FaLanguage,
  FaTrash,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getSettings, saveSettings as saveSettingsAPI } from "../api";

/* ---------------------------------------------------------
   SETTINGS :: HUD theme, matches Dashboard / WorkoutPlan / Profile
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   mint #21ffa3  red #ff3b5c
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: false,
    publicProfile: true,
    emailUpdates: true,
    soundEffects: true,
    autoLogout: false,
    language: "English",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        requestAnimationFrame(() => setBooted(true));
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(null), 3500);
    return () => clearTimeout(id);
  }, [status]);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setStatus(null);
      await saveSettingsAPI(settings);
      setStatus({ type: "success", message: "Settings saved" });
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save settings";
      setStatus({ type: "error", message: detail });
    } finally {
      setSaving(false);
    }
  };

  const clearData = () => {
    if (window.confirm("This will clear all app data. Continue?")) {
      localStorage.clear();
      window.location.reload();
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
              LOADING SETTINGS…
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
        }
        .hud-corner {
          position: absolute; width: 14px; height: 14px;
          border-color: rgba(34,229,255,0.55);
        }

        .hud-row {
          background: #0a101c;
          border: 1px solid rgba(34,229,255,0.12);
          transition: border-color 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        .hud-row:hover {
          border-color: rgba(34,229,255,0.35);
          background: #0c1422;
        }

        .hud-switch {
          width: 44px; height: 22px; border-radius: 999px;
          position: relative;
          transition: background 0.25s ease, box-shadow 0.25s ease;
          flex-shrink: 0;
        }
        .hud-switch-on {
          background: rgba(33,255,163,0.18);
          border: 1px solid rgba(33,255,163,0.6);
          box-shadow: 0 0 10px rgba(33,255,163,0.3);
        }
        .hud-switch-off {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .hud-switch-thumb {
          position: absolute; top: 2px; width: 16px; height: 16px; border-radius: 50%;
          transition: left 0.25s cubic-bezier(.2,.7,.3,1), background 0.25s ease;
        }
        .hud-thumb-on { left: 24px; background: #21ffa3; }
        .hud-thumb-off { left: 2px; background: #6b7894; }

        .hud-select {
          background: #070b14;
          border: 1px solid rgba(34,229,255,0.18);
          color: #e6f6ff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .hud-select:focus {
          outline: none;
          border-color: #22e5ff;
          box-shadow: 0 0 0 3px rgba(34,229,255,0.12);
        }

        .hud-btn {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.1em;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, opacity 0.2s ease;
          clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
        }
        .hud-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .hud-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
        .hud-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .hud-btn-save {
          background: rgba(33,255,163,0.1);
          border: 1px solid rgba(33,255,163,0.45);
          color: #9dffd9;
        }
        .hud-btn-save:hover:not(:disabled) { background: rgba(33,255,163,0.18); box-shadow: 0 0 18px rgba(33,255,163,0.22); }

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
              CONFIG&nbsp;&nbsp;MODULE
            </span>
          </div>
          <h1 className="hud-display text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            SETTINGS
          </h1>
          <span className="hud-mono text-[11px] tracking-[0.2em] text-slate-400">
            POWERRISE
          </span>
        </div>

        {status && (
          <p
            className="hud-mono text-xs mb-5 tracking-wide rise-in"
            style={{ color: status.type === "success" ? "#21ffa3" : "#ff3b5c" }}
          >
            {status.type === "success" ? "✓" : "⚠"}{" "}
            {status.message.toUpperCase()}
          </p>
        )}

        {/* Settings Card */}
        <div
          className="hud-panel rise-in p-6"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="hud-corner top-0 left-0 border-t-2 border-l-2" />
          <span className="hud-corner top-0 right-0 border-t-2 border-r-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />

          <div className="space-y-3">
            <SettingRow
              icon={<FaMoon />}
              label="Dark mode"
              value={settings.darkMode}
              onClick={() => toggle("darkMode")}
              delay="0s"
              booted={booted}
            />

            <SettingRow
              icon={<FaBell />}
              label="Notifications"
              value={settings.notifications}
              onClick={() => toggle("notifications")}
              delay="0.04s"
              booted={booted}
            />

            <SettingRow
              icon={<FaUserLock />}
              label="Public profile"
              value={settings.publicProfile}
              onClick={() => toggle("publicProfile")}
              delay="0.08s"
              booted={booted}
            />

            <SettingRow
              icon={<FaEnvelope />}
              label="Email updates"
              value={settings.emailUpdates}
              onClick={() => toggle("emailUpdates")}
              delay="0.12s"
              booted={booted}
            />

            <SettingRow
              icon={<FaVolumeUp />}
              label="Sound effects"
              value={settings.soundEffects}
              onClick={() => toggle("soundEffects")}
              delay="0.16s"
              booted={booted}
            />

            <SettingRow
              icon={<FaSignOutAlt />}
              label="Auto logout"
              value={settings.autoLogout}
              onClick={() => toggle("autoLogout")}
              delay="0.2s"
              booted={booted}
            />

            {/* Language */}
            <div
              className="hud-row fade-scale rounded-sm p-4 flex justify-between items-center"
              style={{ animationDelay: booted ? "0.24s" : "0s" }}
            >
              <div className="flex items-center gap-4">
                <FaLanguage className="text-cyan-300 text-lg" />
                <span className="hud-mono text-[12px] tracking-[0.1em] text-slate-200">
                  LANGUAGE
                </span>
              </div>

              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="hud-select rounded-sm px-4 py-2 text-sm"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-6 border-t border-cyan-400/10">
            <p className="hud-mono text-[10px] tracking-[0.2em] text-[#ff3b5c]/70 mb-3">
              DANGER ZONE
            </p>
            <button
              onClick={clearData}
              className="hud-btn hud-btn-delete w-full md:w-auto px-6 py-3 text-xs flex items-center justify-center gap-2"
            >
              <FaTrash size={12} />
              CLEAR APP DATA
            </button>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="hud-btn hud-btn-save px-8 py-4 text-xs"
            >
              {saving ? "SAVING…" : "SAVE SETTINGS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value, onClick, delay, booted }) {
  return (
    <div
      onClick={onClick}
      className="hud-row fade-scale rounded-sm p-4 flex justify-between items-center"
      style={{ animationDelay: booted ? delay : "0s" }}
    >
      <div className="flex items-center gap-4">
        <span className="text-cyan-300 text-lg">{icon}</span>
        <span className="hud-mono text-[12px] tracking-[0.1em] text-slate-200">
          {label.toUpperCase()}
        </span>
      </div>

      <div
        className={`hud-switch ${value ? "hud-switch-on" : "hud-switch-off"}`}
      >
        <div
          className={`hud-switch-thumb ${value ? "hud-thumb-on" : "hud-thumb-off"}`}
        />
      </div>
    </div>
  );
}
