import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    photo: null,
  });

  const navigate = useNavigate();

  // Load profile
  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Upload image
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removePhoto = () => {
    setProfile({ ...profile, photo: null });
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    setIsEditing(false);
    alert("Profile saved!");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("profile");
    navigate("/login");
  };

  // Avatar initials
  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>My Profile</h1>

      <div style={cardStyle}>
        {/* Profile Photo / Avatar */}
        <div style={{ textAlign: "center" }}>
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" style={photoStyle} />
          ) : (
            <div style={avatarStyle}>{initials}</div>
          )}

          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ marginTop: "10px" }}
              />

              {profile.photo && (
                <button style={removeBtn} onClick={removePhoto}>
                  Remove Photo
                </button>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div style={infoStyle}>
          {isEditing ? (
            <>
              <input
                name="name"
                placeholder="Name"
                value={profile.name}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={profile.age}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="height"
                type="number"
                placeholder="Height (cm)"
                value={profile.height}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                value={profile.weight}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          ) : (
            <>
              <p>
                <b>Name:</b> {profile.name || "-"}
              </p>
              <p>
                <b>Age:</b> {profile.age || "-"}
              </p>
              <p>
                <b>Height:</b> {profile.height || "-"} cm
              </p>
              <p>
                <b>Weight:</b> {profile.weight || "-"} kg
              </p>
            </>
          )}
        </div>

        {/* Buttons */}
        <div style={buttonRow}>
          {isEditing ? (
            <button style={saveBtn} onClick={handleSave}>
              Save Profile
            </button>
          ) : (
            <button style={editBtn} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}

          {/* Logout Button */}
          <button
            style={{ ...editBtn, background: "#ef4444", marginLeft: "10px" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const pageStyle = {
  width: "100vw",
  minHeight: "100vh",
  background: "#f3f4f6",
  padding: "50px",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "34px",
  color: "#4f46e5",
  marginBottom: "30px",
};

const cardStyle = {
  width: "600px",
  margin: "auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
};

const photoStyle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #6366f1",
};

const avatarStyle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1, #14b8a6)",
  color: "white",
  fontSize: "48px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
};

const infoStyle = {
  marginTop: "25px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
};

const buttonRow = {
  marginTop: "25px",
  textAlign: "center",
};

const editBtn = {
  padding: "14px 30px",
  borderRadius: "20px",
  background: "#6366f1",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
};

const saveBtn = {
  padding: "14px 30px",
  borderRadius: "20px",
  background: "linear-gradient(to right, #34d399, #14b8a6)",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
};

const removeBtn = {
  marginTop: "10px",
  background: "transparent",
  border: "none",
  color: "red",
  cursor: "pointer",
};
