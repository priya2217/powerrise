import { useEffect, useState } from "react";
import { FaBell, FaDumbbell } from "react-icons/fa";
import { getProfile } from "../api";

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
    <div style={navStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
        onClick={() => (window.location = "/dashboard")}
      >
        <div style={logoIconStyle}>
          <FaDumbbell color="#fff" size={16} />
        </div>
        <span style={logoTextStyle}>PowerRise</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          onClick={() => (window.location = "/notifications")}
          style={bellButtonStyle}
          title="Notifications"
        >
          <FaBell size={18} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => (window.location = "/profile")}
          title="Go to profile"
        >
          {profile?.photo ? (
            <img src={profile.photo} alt="Profile" style={avatarImgStyle} />
          ) : (
            <div style={avatarStyle}>{initials}</div>
          )}
          <span style={nameStyle}>{profile?.name || "Guest User"}</span>
        </div>
      </div>
    </div>
  );
}

const navStyle = {
  width: "100%",
  padding: "14px 24px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const logoIconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoTextStyle = {
  fontWeight: "800",
  fontSize: "18px",
  background: "linear-gradient(to right, #7c3aed, #db2777)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const bellButtonStyle = {
  background: "#f3f4f6",
  border: "none",
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#4b5563",
};

const avatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "700",
};

const avatarImgStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover",
};

const nameStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};
