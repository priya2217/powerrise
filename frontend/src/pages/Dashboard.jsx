import { useEffect, useState } from "react";
import {
  FaDumbbell,
  FaHeartbeat,
  FaFire,
  FaTrophy,
  FaChartLine,
  FaClock,
} from "react-icons/fa";
import { getDashboardStats, getLatestBMI } from "../api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    caloriesBurned: 0,
    streak: 0,
    avgWorkoutTime: 0,
  });
  const [bmiRecord, setBmiRecord] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [statsRes, bmiRes] = await Promise.allSettled([
          getDashboardStats(),
          getLatestBMI(),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value?.success) {
          setStats(statsRes.value.stats);
        }

        if (bmiRes.status === "fulfilled" && bmiRes.value?.record) {
          setBmiRecord(bmiRes.value.record);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const bmi = bmiRecord?.bmi || null;

  const bmiStatus = () => {
    if (!bmi) return { text: "--", color: "#6b7280" };
    if (bmi < 18.5) return { text: "Underweight", color: "#f59e0b" };
    if (bmi < 25) return { text: "Normal", color: "#10b981" };
    if (bmi < 30) return { text: "Overweight", color: "#f59e0b" };
    return { text: "Obese", color: "#ef4444" };
  };

  const status = bmiStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navbar />
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "70vh" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Navbar />

      <div className="p-6">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here's your fitness overview
          </p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaTrophy />}
            label="Total Workouts"
            value={stats.totalWorkouts}
            gradient="from-yellow-400 to-orange-500"
            delay="0s"
          />
          <StatCard
            icon={<FaFire />}
            label="Calories Burned"
            value={stats.caloriesBurned}
            gradient="from-red-400 to-pink-500"
            delay="0.1s"
          />
          <StatCard
            icon={<FaChartLine />}
            label="Day Streak"
            value={`${stats.streak} Days`}
            gradient="from-green-400 to-teal-500"
            delay="0.2s"
          />
          <StatCard
            icon={<FaClock />}
            label="Avg Workout"
            value={`${stats.avgWorkoutTime} min`}
            gradient="from-blue-400 to-purple-500"
            delay="0.3s"
          />
        </div>

        {/* Main Content Grid - now 2 columns since Profile moved to navbar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BMI & Health Stats */}
          <div
            className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <FaHeartbeat className="text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Health Stats</h3>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-40 h-40 mb-4">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={status.color}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${bmi ? (bmi / 40) * 440 : 0} 440`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-800">
                      {bmi || "--"}
                    </p>
                    <p className="text-sm text-gray-500">BMI</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p
                  className="text-2xl font-bold mb-2"
                  style={{ color: status.color }}
                >
                  {status.text}
                </p>
                <p className="text-sm text-gray-500">
                  {bmi ? "Your current BMI status" : "No BMI recorded yet"}
                </p>
                {!bmi && (
                  <button
                    onClick={() => (window.location = "/bmi")}
                    className="mt-3 px-5 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-full text-sm hover:scale-105 transition-transform"
                  >
                    Calculate BMI
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <p className="text-sm text-gray-600 text-center">
                <FaDumbbell className="inline mr-2" />
                Keep up the great work! Stay consistent with your workouts.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp"
            style={{ animationDelay: "0.5s" }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <ActionButton
                label="Manage Exercises"
                icon="🏃"
                gradient="from-green-400 to-teal-500"
                onClick={() => (window.location = "/exercises")}
              />
              <ActionButton
                label="Workout Plan"
                icon="🗓"
                gradient="from-blue-400 to-purple-500"
                onClick={() => (window.location = "/plan")}
              />
              <ActionButton
                label="Start Timer"
                icon="⏱"
                gradient="from-orange-400 to-red-500"
                onClick={() => (window.location = "/timer")}
              />
              <ActionButton
                label="BMI Calculator"
                icon="📊"
                gradient="from-pink-400 to-purple-500"
                onClick={() => (window.location = "/bmi")}
              />
              <ActionButton
                label="Ask AI Assistant"
                icon="🤖"
                gradient="from-indigo-400 to-blue-500"
                onClick={() => (window.location = "/ai-chat")}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out both; }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, gradient, delay }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideUp"
      style={{ animationDelay: delay }}
    >
      <div
        className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-3 text-white text-2xl`}
      >
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ActionButton({ label, icon, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 bg-gradient-to-r ${gradient} text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
