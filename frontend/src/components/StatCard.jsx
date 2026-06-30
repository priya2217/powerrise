import { motion } from "framer-motion";

export default function StatCard({ icon, title, value, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      className="
        relative overflow-hidden
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-6
        shadow-2xl
        hover:shadow-purple-500/20
        transition-all
      "
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient}
        flex items-center justify-center text-white text-2xl mb-4`}
      >
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-white">{value}</h2>

      <p className="text-gray-400 mt-1">{title}</p>

      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full"></div>
    </motion.div>
  );
}
