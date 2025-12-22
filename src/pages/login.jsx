import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const stored = localStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", email);
      alert("Logged in successfully!");
      navigate("/profile"); // redirect to profile
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="container auth-card">
      <h2>Login</h2>
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
      <button className="gradient-btn" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
