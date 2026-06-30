import { useState } from "react";
import { FaFire, FaTrophy, FaDumbbell, FaHeartbeat } from "react-icons/fa";

// Static notifications for now — can be wired to a backend endpoint later.
const initialNotifications = [
  {
    id: 1,
    icon: <FaTrophy color="#f59e0b" />,
    title: "Welcome to PowerRise!",
    message: "Set up your profile and log your first workout to get started.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    icon: <FaHeartbeat color="#ef4444" />,
    title: "Track your BMI",
    message: "Use the BMI Calculator to keep an eye on your health stats.",
    time: "Today",
    read: false,
  },
  {
    id: 3,
    icon: <FaDumbbell color="#4f46e5" />,
    title: "Build a workout plan",
    message: "Create a personalized workout plan to stay consistent.",
    time: "Today",
    read: true,
  },
  {
    id: 4,
    icon: <FaFire color="#f97316" />,
    title: "Stay consistent",
    message: "Daily workouts build your streak — try not to break the chain!",
    time: "Yesterday",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>Notifications</h2>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={markReadButtonStyle}>
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              ...cardStyle,
              background: n.read ? "#fff" : "#eef2ff",
            }}
          >
            <div style={iconWrapStyle}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 style={{ margin: 0, fontSize: "15px" }}>{n.title}</h4>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                  {n.time}
                </span>
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {n.message}
              </p>
            </div>
            {!n.read && <div style={dotStyle} />}
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const iconWrapStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  flexShrink: 0,
};

const dotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#4f46e5",
  marginTop: "6px",
};

const markReadButtonStyle = {
  background: "none",
  border: "none",
  color: "#4f46e5",
  fontWeight: "600",
  fontSize: "13px",
  cursor: "pointer",
};
