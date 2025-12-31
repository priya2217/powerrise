import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, saveProfile } from "../api";
import { useAuth } from "../context/AuthContext";

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

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getProfile();

        console.log("Profile response:", response); // Debug log

        // Handle different response formats
        if (response && response.success && response.profile) {
          setProfile(response.profile);
        } else if (response && !response.success) {
          // Profile doesn't exist yet, use defaults
          console.log("No profile found, using defaults");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfile({ ...profile, photo: null });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await saveProfile(profile);
      console.log("Save response:", response); // Debug log

      if (response && response.success) {
        setIsEditing(false);
        alert("Profile saved successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err?.message || "Failed to save profile");
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
      <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>My Profile</h1>

      {error && <div style={errorBoxStyle}>{error}</div>}

      <div style={cardStyle}>
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
                style={{ marginTop: "10px", fontSize: "14px" }}
              />

              {profile.photo && (
                <button style={removeBtn} onClick={removePhoto}>
                  Remove Photo
                </button>
              )}
            </>
          )}
        </div>

        <div style={infoStyle}>
          {isEditing ? (
            <>
              <input
                name="name"
                placeholder="Name"
                value={profile.name || ""}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={profile.age || ""}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="height"
                type="number"
                placeholder="Height (cm)"
                value={profile.height || ""}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                value={profile.weight || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          ) : (
            <>
              <p>
                <b>Name:</b> {profile.name || "Not set"}
              </p>
              <p>
                <b>Age:</b> {profile.age || "Not set"}
              </p>
              <p>
                <b>Height:</b>{" "}
                {profile.height ? `${profile.height} cm` : "Not set"}
              </p>
              <p>
                <b>Weight:</b>{" "}
                {profile.weight ? `${profile.weight} kg` : "Not set"}
              </p>
            </>
          )}
        </div>

        <div style={buttonRow}>
          {isEditing ? (
            <>
              <button style={saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                style={{ ...cancelBtn, marginLeft: "10px" }}
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          ) : (
            <button style={editBtn} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}

          <button
            style={{
              ...editBtn,
              background: "#ef4444",
              marginLeft: "10px",
              marginTop: "10px",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const pageStyle = {
  padding: "40px",
  minHeight: "100vh",
  background: "#f9fafb",
};

const titleStyle = {
  fontSize: "32px",
  color: "#4f46e5",
  marginBottom: "30px",
};

const errorBoxStyle = {
  maxWidth: "600px",
  margin: "0 auto 20px",
  padding: "15px",
  background: "#fee2e2",
  color: "#dc2626",
  borderRadius: "12px",
  border: "1px solid #fecaca",
};

const cardStyle = {
  maxWidth: "600px",
  margin: "auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const photoStyle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  objectFit: "cover",
};

const avatarStyle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "#4f46e5",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "48px",
  fontWeight: "700",
  margin: "0 auto",
};

const infoStyle = { marginTop: "20px" };

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const buttonRow = {
  marginTop: "30px",
  textAlign: "center",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
};

const saveBtn = {
  padding: "14px 30px",
  borderRadius: "18px",
  background: "linear-gradient(to right, #34d399, #14b8a6)",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};

const editBtn = {
  padding: "14px 30px",
  borderRadius: "18px",
  background: "#6366f1",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};

const cancelBtn = {
  padding: "14px 30px",
  borderRadius: "18px",
  background: "#9ca3af",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};

const removeBtn = {
  marginTop: "10px",
  padding: "8px 16px",
  borderRadius: "10px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "12px",
};
