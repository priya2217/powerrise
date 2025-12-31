import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e?.preventDefault(); // Prevent form submission if called from form

    // Clear previous errors
    setError("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!terms) {
      setError("You must accept the Terms & Conditions!");
      return;
    }

    try {
      setLoading(true);

      console.log("Attempting signup with:", { name, email }); // Debug log

      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      console.log("Signup response:", response.data); // Debug log

      if (response.data.success) {
        alert("Account created successfully! You can now log in.");
        navigate("/login");
      } else {
        setError(response.data.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Signup error:", err); // Debug log

      // Detailed error handling
      if (err.message === "Network error. Please check your connection.") {
        setError(
          "Cannot connect to server. Make sure backend is running on http://localhost:5000"
        );
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Server is taking too long to respond.");
      } else if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.message || err.response.data?.error;
        setError(errorMsg || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request made but no response
        setError("No response from server. Check if backend is running.");
      } else {
        // Other errors
        setError(err.message || "Something went wrong. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "90%",
          padding: "40px",
          backgroundColor: "#ffffff",
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

        {error && (
          <div
            style={{
              color: "#ef4444",
              textAlign: "center",
              marginBottom: "15px",
              padding: "12px",
              backgroundColor: "#fee2e2",
              borderRadius: "8px",
              fontSize: "14px",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              disabled={loading}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            />
            <span style={{ fontSize: "14px", color: "#555" }}>
              I agree to the{" "}
              <Link
                to="/terms"
                style={{ color: "#4f46e5", textDecoration: "underline" }}
              >
                Terms & Conditions
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "20px",
              background: loading
                ? "#94a3b8"
                : "linear-gradient(to right, #34d399, #14b8a6)",
              color: "white",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              marginBottom: "15px",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#777",
            marginTop: "15px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#4f46e5", textDecoration: "underline" }}
          >
            Login
          </Link>
        </p>

        {/* Debug info */}
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          API URL: {import.meta.env.VITE_API_URL || "http://localhost:5000"}
          <br />
          Endpoint: /api/auth/signup
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "14px",
};
