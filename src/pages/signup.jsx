import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!terms) {
      alert("You must accept the Terms & Conditions!");
      return;
    }

    const stored = localStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];

    if (users.some((u) => u.email === email)) {
      alert("User already exists!");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! You can now log in.");
    navigate("/login");
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: "100vw", height: "100vh", backgroundColor: "#f0f0f0" }}
    >
      <div
        style={{
          width: "400px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#4f46e5",
            fontSize: "28px",
            fontWeight: "800",
            marginBottom: "20px",
          }}
        >
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          <span style={{ fontSize: "14px", color: "#555" }}>
            I agree to the{" "}
            <a
              href="/terms"
              style={{ color: "#4f46e5", textDecoration: "underline" }}
            >
              Terms & Conditions
            </a>
          </span>
        </label>

        <button
          onClick={handleSignup}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "20px",
            background: "linear-gradient(to right, #34d399, #14b8a6)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#777",
            marginTop: "15px",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#4f46e5", textDecoration: "underline" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
