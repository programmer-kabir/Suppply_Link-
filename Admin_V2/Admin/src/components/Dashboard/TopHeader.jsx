import React from "react";
import { FiMenu, FiBell, FiCalendar, FiClock } from "react-icons/fi";
import { useAuth } from "../../Provider/AuthProvider";
import useUsers from "../../utils/Hooks/useUsers";

const TopHeader = ({ onMenuClick }) => {
  const { user } = useAuth() || {};
  const { users = [] } = useUsers();
  const currentUser = users.find((u) => u?.id === user?.id);

  const todayFormatted = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30 print:hidden transition-all duration-150">
      <div className="px-4 py-3 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Breadcrumb hint */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium font-mono">
            <FiCalendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{new Date().toISOString().split("T")[0]}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-white relative transition"
            aria-label="Notifications"
          >
            <FiBell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-950" />
          </button>

          {/* User Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-indigo-500/40 bg-slate-800 shrink-0">
              <img
                className="w-full h-full object-cover"
                src={`https://management.supplylinkbd.com/${currentUser?.photo}`}
                alt=""
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=" + (currentUser?.name || "Admin") + "&background=6366f1&color=fff";
                }}
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-200 leading-tight truncate max-w-[120px]">
                {currentUser?.name || "Admin"}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium leading-none flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>অনলাইন</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
