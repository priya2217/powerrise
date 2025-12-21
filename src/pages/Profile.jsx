import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved!");
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
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}
