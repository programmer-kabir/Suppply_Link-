import React from "react";
import ChartCard from "./ChartCard";
import { FiCalendar, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

const DashboardChart = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handlePreset,
  salesChart,
  installmentChart,
  investmentChart,
  dailyInstallmentChart,
  expenseChart,
  activePreset,
  setActivePreset
}) => {
  const buttons = [
    { label: "৭ দিন (7D)", value: "7d" },
    { label: "৩০ দিন (30D)", value: "30d" },
    { label: "চলতি মাস (Month)", value: "month" },
    { label: "চলতি বছর (Year)", value: "year" },
  ];

  return (
    <div className="mt-8">
      {/* Chart Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <FiTrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">বিশ্লেষণ ও ট্রেন্ড গ্রাফ</h3>
            <p className="text-[10px] text-slate-400">ফিল্টার করে নির্দিষ্ট সময়ের ডাটা অ্যানালিসিস করুন</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Date Pickers */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset("");
                }}
                className="px-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition date-fix cursor-pointer"
              />
            </div>
            <span className="text-slate-500 text-xs font-bold">থেকে</span>
            <div className="relative flex items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset("");
                }}
                className="px-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition date-fix cursor-pointer"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
            {buttons.map((btn) => {
              const isActive = activePreset === btn.value;
              return (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => handlePreset(btn.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🔹 CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Sales Trend" data={salesChart} />
        <ChartCard title="Installments Trend" data={installmentChart} />
        <ChartCard title="Investment Trend" data={investmentChart} />
        <ChartCard title="Daily Installments Trend" data={dailyInstallmentChart} />
        <div className="lg:col-span-2">
          <ChartCard title="Expense Trend" data={expenseChart} />
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
