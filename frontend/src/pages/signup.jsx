import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Basic validation
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

    try {
      setLoading(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Account created! You can now log in.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "20px",
            background: loading
              ? "#94f3e4"
              : "linear-gradient(to right, #34d399, #14b8a6)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
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
