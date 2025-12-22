import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    const stored = localStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      alert("User already exists!");
      return;
    }

    // Save new user
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! You can now log in.");
  };

  return (
    <div className="container auth-card">
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="gradient-btn" onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}
