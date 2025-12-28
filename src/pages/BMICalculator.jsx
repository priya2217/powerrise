import { useEffect, useState } from "react";
import { createBMI, getLatestBMI } from "../api";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load last BMI from backend
  useEffect(() => {
    const fetchLatestBMI = async () => {
      try {
        setLoading(true);
        const data = await getLatestBMI();
        if (data) {
          setHeight(data.height);
          setWeight(data.weight);
          setBmi(data.bmi);
          setCategory(data.category);
        }
      } catch (err) {
        setError(err || "Failed to fetch BMI");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBMI();
  }, []);

  const calculateBMI = async () => {
    if (!height || !weight) return;

    const heightMeters = height / 100;
    const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(1);

    let bmiCategory = "";
    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 25) bmiCategory = "Normal";
    else if (bmiValue < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setBmi(bmiValue);
    setCategory(bmiCategory);

    // Save BMI to backend
    try {
      await createBMI({ height, weight, bmi: bmiValue, category: bmiCategory });
    } catch (err) {
      setError(err || "Failed to save BMI");
    }
  };

  if (loading) return <div>Loading BMI...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={page}>
      <h1 style={title}>BMI Calculator</h1>

      <div style={card}>
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          style={input}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={input}
        />

        <button onClick={calculateBMI} style={btn}>
          Calculate BMI
        </button>

        {bmi && (
          <div style={result}>
            <h2>Your BMI: {bmi}</h2>
            <p>
              Category: <b>{category}</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const page = {
  width: "100vw",
  minHeight: "100vh",
  background: "#f3f4f6",
  padding: "50px",
  textAlign: "center",
};

const title = {
  fontSize: "36px",
  color: "#4f46e5",
  marginBottom: "30px",
};

const card = {
  width: "400px",
  margin: "auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const input = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
};

const btn = {
  padding: "14px",
  borderRadius: "20px",
  background: "linear-gradient(to right, #6366f1, #14b8a6)",
  color: "white",
  fontWeight: "700",
  border: "none",
  cursor: "pointer",
};

const result = {
  marginTop: "20px",
  background: "#eef2ff",
  padding: "20px",
  borderRadius: "16px",
};
