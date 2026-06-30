import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
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
      setError(err?.message || err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={logoStyle}>⚡ PowerRise</h1>

        <h2 style={titleStyle}>Welcome Back</h2>

        <p style={subtitleStyle}>Login to continue your fitness journey</p>

        {error && <div style={errorStyle}>{error}</div>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={footerStyle}>
          Don't have an account?{" "}
          <Link to="/signup" style={linkStyle}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const containerStyle = {
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(135deg, #0b0b14 0%, #14141f 50%, #1b1b29 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  width: "420px",
  maxWidth: "90%",
  background: "#14141f",
  padding: "40px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
};

const logoStyle = {
  textAlign: "center",
  color: "#6366f1",
  fontSize: "32px",
  marginBottom: "10px",
};

const titleStyle = {
  textAlign: "center",
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "8px",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#9494ab",
  marginBottom: "30px",
  fontSize: "14px",
};

const errorStyle = {
  background: "rgba(239,68,68,0.15)",
  border: "1px solid rgba(239,68,68,0.3)",
  color: "#f87171",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "20px",
  textAlign: "center",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#1b1b29",
  color: "#ffffff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(to right, #6366f1, #4f46e5)",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
};

const footerStyle = {
  textAlign: "center",
  marginTop: "25px",
  color: "#9494ab",
  fontSize: "14px",
};

const linkStyle = {
  color: "#6366f1",
  textDecoration: "none",
  fontWeight: "600",
};
