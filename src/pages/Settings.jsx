import { useState, useEffect } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: false,
    darkMode: false,
    showProfilePublic: true,
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    alert("Settings saved!");
  };

  return (
    <div className="container settings-page">
      <h1>Settings</h1>

      {/* Account Section */}
      <div className="settings-section">
        <h2>Account</h2>
        <p>Manage your account details and preferences.</p>
        
      </div>

      {/* Display */}
      <div className="settings-section">
        <h2>Display</h2>
        <div className="field toggle">
          <label>
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
            />{" "}
            Enable Dark Mode
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="field toggle">
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />{" "}
            Allow Push Notifications
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="settings-section">
        <h2>Privacy</h2>
        <div className="field toggle">
          <label>
            <input
              type="checkbox"
              name="showProfilePublic"
              checked={settings.showProfilePublic}
              onChange={handleChange}
            />{" "}
            Show my profile publicly
          </label>
        </div>
      </div>

      {/* Save */}
      <button className="gradient-btn settings-save-btn" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
}
