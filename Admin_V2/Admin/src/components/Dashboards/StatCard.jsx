import React from "react";
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingBag, 
  FiCreditCard, 
  FiPieChart, 
  FiCalendar, 
  FiArrowUpRight,
  FiArrowDownRight
} from "react-icons/fi";
import { motion } from "framer-motion";

const cardConfig = {
  "Total Sales": {
    icon: FiShoppingBag,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    glow: "shadow-emerald-500/10",
    textColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    badge: "Revenue",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  "Total Installments": {
    icon: FiCreditCard,
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    border: "border-blue-500/30 hover:border-blue-400/60",
    glow: "shadow-blue-500/10",
    textColor: "text-blue-400",
    iconBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    badge: "Received",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  "Total Investment": {
    icon: FiPieChart,
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border-amber-500/30 hover:border-amber-400/60",
    glow: "shadow-amber-500/10",
    textColor: "text-amber-400",
    iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    badge: "Capital",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  "Total Daily Installments": {
    icon: FiCalendar,
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    glow: "shadow-cyan-500/10",
    textColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    badge: "Daily POS",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  },
  "Total Company Expense": {
    icon: FiArrowDownRight,
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    border: "border-rose-500/30 hover:border-rose-400/60",
    glow: "shadow-rose-500/10",
    textColor: "text-rose-400",
    iconBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    badge: "Expense",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
};

const StatCard = ({ title, value }) => {
  const config = cardConfig[title] || {
    icon: FiDollarSign,
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    border: "border-indigo-500/30 hover:border-indigo-400/60",
    glow: "shadow-indigo-500/10",
    textColor: "text-indigo-400",
    iconBg: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    badge: "Metrics",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  };

  const IconComponent = config.icon;
  const numValue = typeof value === "number" ? value : Number(value) || 0;

  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 border ${config.border} shadow-lg ${config.glow} backdrop-blur-xl transition-all duration-300 group`}
    >
      {/* Background Radial Ambient Glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

      <div className="relative z-10">
        {/* Header: Title & Icon Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wide text-slate-400 group-hover:text-slate-200 transition-colors truncate max-w-[150px]">
            {title}
          </span>
          <div className={`p-2.5 rounded-xl border ${config.iconBg} shadow-inner transition-transform group-hover:rotate-6`}>
            <IconComponent className="w-4 h-4" />
          </div>
        </div>

        {/* Value Display */}
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-base font-bold text-slate-400 font-sans">৳</span>
          <h3 className={`text-2xl font-black tracking-tight ${config.textColor} font-sans truncate`}>
            {numValue.toLocaleString("en-IN")}
          </h3>
        </div>

        {/* Footer Badge */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${config.badgeColor}`}>
            {config.badge}
          </span>
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Active
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;