import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setError("Please fill all fields!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={footerTextStyle}>
          Don't have an account?{" "}
          <a href="/signup" style={linkStyle}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f3f4f6",
};

const cardStyle = {
  width: "400px",
  maxWidth: "90%",
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "25px",
  color: "#4f46e5",
};

const errorStyle = {
  color: "#ef4444",
  textAlign: "center",
  marginBottom: "15px",
  padding: "10px",
  backgroundColor: "#fee2e2",
  borderRadius: "8px",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  background: "linear-gradient(to right, #34d399, #14b8a6)",
  color: "white",
  fontWeight: "600",
  marginBottom: "15px",
  border: "none",
  fontSize: "16px",
  transition: "opacity 0.2s",
};

const footerTextStyle = {
  textAlign: "center",
  fontSize: "14px",
  color: "#6b7280",
  margin: 0,
};

const linkStyle = {
  color: "#4f46e5",
  textDecoration: "underline",
  fontWeight: "500",
};
