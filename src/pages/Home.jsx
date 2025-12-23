import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FaDumbbell,
  FaClipboardList,
  FaStopwatch,
  FaChartLine,
  FaUser,
  FaCog,
  FaHeartbeat,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const buttons = [
    {
      name: "Exercise Library",
      path: "/exercises",
      icon: <FaDumbbell />,
      gradient: "from-green-400 to-teal-500",
    },
    {
      name: "Workout Plan",
      path: "/plan",
      icon: <FaClipboardList />,
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      name: "Workout Timer",
      path: "/timer",
      icon: <FaStopwatch />,
      gradient: "from-red-400 to-pink-500",
    },
    {
      name: "BMICalculator",
      path: "/BMICalculator",
      icon: <FaHeartbeat />,
      gradient: "from-red-300 to-orange-700",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaChartLine />,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
      gradient: "from-blue-400 to-purple-500",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
      gradient: "from-green-300 to-purple-700",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-50 via-white to-gray-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-0 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Logo */}
      <img
        src={logo}
        alt="PowerRise Logo"
        className="h-28 mt-12 mb-6 rounded-full shadow-2xl border-4 border-white z-10"
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-2 text-center z-10">
        PowerRise Fitness
      </h1>
      <p className="text-lg text-gray-600 italic mb-12 text-center z-10">
        Your personal fitness companion 💪
      </p>

      {/* Button Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 z-10">
        {buttons.map((btn) => (
          <button
            key={btn.name}
            onClick={() => navigate(btn.path)}
            className={`w-56 h-32 rounded-3xl bg-gradient-to-r ${btn.gradient} text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex flex-col items-center justify-center gap-3 font-bold`}
          >
            <span className="text-3xl">{btn.icon}</span>
            <span className="text-lg">{btn.name}</span>
          </button>
        ))}
      </div>

      {/* Tailwind Animations for blobs */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px,-50px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  );
}
