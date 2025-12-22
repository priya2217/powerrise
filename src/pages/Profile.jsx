import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
  });

  // ✅ Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: ["age", "height", "weight"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved locally!");
  };

  return (
    <div className="container">
      <h2>Profile</h2>

      <input
        name="name"
        placeholder="Name"
        value={profile.name}
        onChange={handleChange}
      />

      <input
        name="age"
        type="number"
        placeholder="Age"
        value={profile.age}
        onChange={handleChange}
      />

      <input
        name="height"
        type="number"
        placeholder="Height (cm)"
        value={profile.height}
        onChange={handleChange}
      />

      <input
        name="weight"
        type="number"
        placeholder="Weight (kg)"
        value={profile.weight}
        onChange={handleChange}
      />

      <button className="gradient-btn" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
}
