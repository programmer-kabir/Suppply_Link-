import React from "react";
import { 
  FiCalendar, 
  FiFilter, 
  FiRotateCcw, 
  FiClock, 
  FiChevronDown 
} from "react-icons/fi";
import { motion } from "framer-motion";

const DashboardFilter = ({
  filterType,
  setFilterType,
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  yearOptions,
}) => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  const filterTabs = [
    { label: "দৈনিক (Daily)", value: "daily" },
    { label: "মাসিক (Monthly)", value: "monthly" },
    { label: "বাৎসরিক (Yearly)", value: "yearly" },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl mb-6 shadow-xl backdrop-blur-xl flex flex-wrap gap-4 items-center justify-between">
      
      {/* Left: Filter Type Segmented Buttons */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
        {filterTabs.map((tab) => {
          const isActive = filterType === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterType(tab.value)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Center/Right: Dynamic Filter Inputs */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Daily Date Picker */}
        {filterType === "daily" && (
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-indigo-400">
              <FiCalendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition date-fix cursor-pointer"
            />
          </div>
        )}

        {/* Monthly Picker */}
        {filterType === "monthly" && (
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-indigo-400">
              <FiClock className="w-4 h-4" />
            </div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition date-fix cursor-pointer"
            />
          </div>
        )}

        {/* Yearly Dropdown */}
        {filterType === "yearly" && (
          <div className="relative flex items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="pl-4 pr-8 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition appearance-none cursor-pointer"
            >
              <option value="">বছর নির্বাচন করুন</option>
              {yearOptions.map((year) => (
                <option key={year} value={year} className="bg-slate-900 text-white">
                  {year}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 pointer-events-none text-slate-400 w-3.5 h-3.5" />
          </div>
        )}

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setSelectedDate(today);
            setSelectedMonth("");
            setSelectedYear("");
            setFilterType("daily");
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all duration-200"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>রিসেট</span>
        </motion.button>
      </div>

    </div>
  );
};

export default DashboardFilter;
