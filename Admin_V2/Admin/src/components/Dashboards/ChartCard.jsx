import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";

const chartThemes = {
  "Sales Trend": {
    color: "#10b981",
    gradientId: "salesGrad",
    badge: "বিক্রয়",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  "Installments Trend": {
    color: "#3b82f6",
    gradientId: "instGrad",
    badge: "কিস্তি আদায়",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  "Investment Trend": {
    color: "#f59e0b",
    gradientId: "invGrad",
    badge: "বিনিয়োগ",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  "Daily Installments Trend": {
    color: "#06b6d4",
    gradientId: "dailyGrad",
    badge: "দৈনিক কিস্তি",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  },
  "Expense Trend": {
    color: "#f43f5e",
    gradientId: "expGrad",
    badge: "কোম্পানি খরচ",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value || 0;
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-slate-400 text-[11px] font-medium mb-1">{label}</p>
        <p className="text-sm font-bold text-white flex items-center gap-1 font-sans">
          <span>৳</span>
          <span>{Number(val).toLocaleString("en-IN")}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ChartCard = ({ title, data }) => {
  const theme = chartThemes[title] || {
    color: "#6366f1",
    gradientId: "defaultGrad",
    badge: "চার্ট",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-xl relative overflow-hidden group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
            {title}
          </h4>
          <span className="text-[10px] text-slate-500">সময়ভিত্তিক ট্রেন্ড গ্রাফ</span>
        </div>

        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${theme.badgeColor}`}>
          {theme.badge}
        </span>
      </div>

      {/* Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={theme.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={theme.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#64748b", fontSize: 10 }} 
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "#64748b", fontSize: 10 }} 
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={theme.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${theme.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ChartCard;