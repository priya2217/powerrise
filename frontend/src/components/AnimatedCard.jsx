import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function AnimatedCard({ icon, title, value, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -10,
        scale: 1.05,
        boxShadow: "0 0 30px rgba(99,102,241,0.4)",
      }}
      transition={{ duration: 0.4 }}
      className="bg-[#14141f] rounded-3xl p-6 border border-white/5"
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient}
        flex items-center justify-center text-white text-2xl mb-4`}
      >
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-white">
        {typeof value === "number" ? (
          <CountUp end={value} duration={2} />
        ) : (
          value
        )}
      </h2>

      <p className="text-gray-400 mt-2">{title}</p>
    </motion.div>
  );
}
