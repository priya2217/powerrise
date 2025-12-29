import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, saveProfile } from "../api";
import { useAuth } from "../context/AuthContext";

export function Profile() {
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
        const data = await getProfile(); // API call
        if (data) setProfile(data);
      } catch (err) {
        console.error(err);
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

  // Save profile via API
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      await saveProfile(profile); // API call
      setIsEditing(false);
      alert("Profile saved successfully!");
    } catch (err) {
      setError(err || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout(); // AuthContext logout
    navigate("/login");
  };

  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading profile...
      </div>
    );

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>My Profile</h1>

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

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={buttonRow}>
          {isEditing ? (
            <button style={saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
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

// Styles remain the same as your original component
