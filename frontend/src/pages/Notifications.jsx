import { useState } from "react";
import {
  FaFire,
  FaTrophy,
  FaDumbbell,
  FaHeartbeat,
  FaBell,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const initialNotifications = [
  {
    id: 1,
    icon: <FaTrophy className="text-yellow-400" />,
    title: "Welcome to PowerRise!",
    message: "Set up your profile and log your first workout to get started.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    icon: <FaHeartbeat className="text-red-400" />,
    title: "Track your BMI",
    message: "Use the BMI Calculator to keep an eye on your health stats.",
    time: "Today",
    read: false,
  },
  {
    id: 3,
    icon: <FaDumbbell className="text-purple-400" />,
    title: "Build a workout plan",
    message: "Create a personalized workout plan to stay consistent.",
    time: "Today",
    read: true,
  },
  {
    id: 4,
    icon: <FaFire className="text-orange-400" />,
    title: "Stay consistent",
    message: "Daily workouts build your streak — try not to break the chain!",
    time: "Yesterday",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true,
      })),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0b0b14]">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Notifications
            </h1>

            <p className="text-gray-400 mt-2">
              Stay updated with your fitness journey
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:scale-105 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Stats Card */}
        <div className="bg-[#14141f] border border-white/5 rounded-3xl p-5 mb-6 shadow-xl shadow-black/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <FaBell className="text-white text-xl" />
            </div>

            <div>
              <h3 className="text-white text-xl font-bold">
                {unreadCount} Unread Notifications
              </h3>

              <p className="text-gray-400">
                Keep track of your fitness progress
              </p>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`
                bg-[#14141f]
                border
                rounded-3xl
                p-5
                shadow-xl
                shadow-black/30
                transition
                hover:-translate-y-1
                ${n.read ? "border-white/5" : "border-purple-500/30"}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#1d1d2e] flex items-center justify-center text-xl">
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-bold text-lg">{n.title}</h3>

                    <span className="text-gray-500 text-sm">{n.time}</span>
                  </div>

                  <p className="text-gray-400">{n.message}</p>
                </div>

                {/* Unread Dot */}
                {!n.read && (
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
