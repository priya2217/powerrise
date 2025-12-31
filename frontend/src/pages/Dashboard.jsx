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
import { getSettings, saveSettings as saveSettingsAPI } from "../api";

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: false,
    publicProfile: true,
    emailUpdates: true,
    soundEffects: true,
    autoLogout: false,
    language: "English",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSettings();
        console.log("Settings response:", response); // Debug log

        if (response && response.success && response.settings) {
          setSettings(response.settings);
        } else if (response && !response.success) {
          console.log("No settings found, using defaults");
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.body.style.backgroundColor = settings.darkMode
      ? "#0f172a"
      : "#f9fafb";
    document.body.style.color = settings.darkMode ? "#fff" : "#000";
  }, [settings.darkMode]);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const saveSettings = async () => {
    try {
      setError("");
      const response = await saveSettingsAPI(settings);
      console.log("Save response:", response); // Debug log

      if (response && response.success) {
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save settings");
      alert("Failed to save settings");
    }
  };

  const clearData = async () => {
    if (window.confirm("This will clear all app data. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading settings...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#4f46e5",
          marginBottom: "20px",
        }}
      >
        Settings
      </h1>

      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            background: "#fee2e2",
            color: "#dc2626",
            borderRadius: "12px",
            maxWidth: "400px",
          }}
        >
          {error}
        </div>
      )}

      <SettingRow
        icon={<FaMoon />}
        label="Dark Mode"
        value={settings.darkMode}
        onClick={() => toggle("darkMode")}
      />

      <SettingRow
        icon={<FaBell />}
        label="Notifications"
        value={settings.notifications}
        onClick={() => toggle("notifications")}
      />

      <SettingRow
        icon={<FaUserLock />}
        label="Public Profile"
        value={settings.publicProfile}
        onClick={() => toggle("publicProfile")}
      />

      <SettingRow
        icon={<FaEnvelope />}
        label="Email Updates"
        value={settings.emailUpdates}
        onClick={() => toggle("emailUpdates")}
      />

      <SettingRow
        icon={<FaVolumeUp />}
        label="Sound Effects"
        value={settings.soundEffects}
        onClick={() => toggle("soundEffects")}
      />

      <SettingRow
        icon={<FaSignOutAlt />}
        label="Auto Logout"
        value={settings.autoLogout}
        onClick={() => toggle("autoLogout")}
      />

      {/* Language */}
      <div style={rowStyle}>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <FaLanguage style={{ color: "#4f46e5", fontSize: "22px" }} />
          <strong>Language</strong>
        </div>
        <select
          name="language"
          value={settings.language}
          onChange={handleChange}
          style={{
            padding: "8px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
          }}
        >
          <option>English</option>
          <option>Tamil</option>
          <option>Hindi</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        style={{
          marginTop: "30px",
          width: "300px",
          padding: "14px",
          borderRadius: "20px",
          fontWeight: "600",
          background: "linear-gradient(to right, #34d399, #14b8a6)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Save Settings
      </button>

      {/* Danger Zone */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ color: "#ef4444", marginBottom: "15px" }}>Danger Zone</h3>
        <button
          onClick={clearData}
          style={{
            padding: "14px 20px",
            borderRadius: "18px",
            background: "linear-gradient(to right, #ef4444, #dc2626)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            width: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "16px",
          }}
        >
          <FaTrash /> Clear App Data
        </button>
      </div>
    </div>
  );
}

const rowStyle = {
  width: "400px",
  maxWidth: "100%",
  marginTop: "20px",
  padding: "18px",
  borderRadius: "18px",
  background: "#fff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

function SettingRow({ icon, label, value, onClick }) {
  return (
    <div style={{ ...rowStyle, cursor: "pointer" }} onClick={onClick}>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span style={{ fontSize: "22px", color: "#4f46e5" }}>{icon}</span>
        <strong>{label}</strong>
      </div>

      <div
        style={{
          width: "46px",
          height: "24px",
          borderRadius: "999px",
          background: value ? "#34d399" : "#d1d5db",
          position: "relative",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: "2px",
            left: value ? "24px" : "2px",
            transition: "all 0.3s",
          }}
        />
      </div>
    </div>
  );
}
