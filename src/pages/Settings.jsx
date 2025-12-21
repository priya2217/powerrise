import { useEffect, useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: false,
    metricUnits: true,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleSave = () => {
    alert(`Settings Saved!\n
Enable Notifications: ${settings.notifications ? "Yes" : "No"}
Use Metric Units: ${settings.metricUnits ? "Yes" : "No"}`);
  };

  return (
    <>
      <div className="header orange">Settings</div>
      <div className="container">
        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />{" "}
          Enable Notifications
        </label>
        <br />
        <br />
        <label>
          <input
            type="checkbox"
            name="metricUnits"
            checked={settings.metricUnits}
            onChange={handleChange}
          />{" "}
          Use Metric Units
        </label>
        <br />
        <br />
        <button onClick={handleSave}>Save Settings</button>
      </div>
    </>
  );
}
