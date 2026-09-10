import React from "react";
import { motion } from "framer-motion";
import { 
  FiUsers, 
  FiUserCheck, 
  FiAward, 
  FiBriefcase, 
  FiShield, 
  FiSliders, 
  FiCode 
} from "react-icons/fi";

const roleMeta = {
  "Total Users": {
    gradient: "from-cyan-500 to-blue-600",
    bgGlow: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    icon: FiUsers,
    textColor: "text-cyan-400"
  },
  Customers: {
    gradient: "from-emerald-400 to-green-600",
    bgGlow: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: FiUserCheck,
    textColor: "text-emerald-400"
  },
  Investors: {
    gradient: "from-amber-400 to-orange-600",
    bgGlow: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: FiAward,
    textColor: "text-amber-400"
  },
  Staff: {
    gradient: "from-pink-500 to-rose-600",
    bgGlow: "bg-pink-500/10",
    border: "border-pink-500/30",
    icon: FiBriefcase,
    textColor: "text-pink-400"
  },
  Managers: {
    gradient: "from-purple-500 to-indigo-600",
    bgGlow: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: FiSliders,
    textColor: "text-purple-400"
  },
  Admins: {
    gradient: "from-red-500 to-pink-600",
    bgGlow: "bg-red-500/10",
    border: "border-red-500/30",
    icon: FiShield,
    textColor: "text-red-400"
  },
  Developers: {
    gradient: "from-sky-400 to-blue-600",
    bgGlow: "bg-sky-500/10",
    border: "border-sky-500/30",
    icon: FiCode,
    textColor: "text-sky-400"
  },
};

const StateCardCopy = ({ title, value }) => {
  const meta = roleMeta[title] || {
    gradient: "from-indigo-500 to-blue-600",
    bgGlow: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    icon: FiUsers,
    textColor: "text-indigo-400"
  };

  const IconComponent = meta.icon;

  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border ${meta.border} bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-lg hover:shadow-xl backdrop-blur-xl transition-all duration-300 group`}
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">
            {title}
          </p>
          <h2 className="text-2xl font-black mt-1 text-white font-sans tracking-tight">
            {value ?? 0}
          </h2>
        </div>

        <div className={`p-2.5 rounded-xl ${meta.bgGlow} ${meta.textColor} border border-white/5 transition-transform group-hover:scale-110`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom glowing gradient accent line */}
      <div
        className={`absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r ${meta.gradient}`}
      />
    </motion.div>
  );
};

export default StateCardCopy;