import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { toYMD } from "../../../utils/dashboardHelpers";

const DashboardHeader = ({ onOpenAssign }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Dashboard — {toYMD(new Date())}
        </h2>
        <p className="text-slate-400 mt-1 text-sm">
          Reference user ভিত্তিক (আপনার করা কাজের) রিপোর্ট
        </p>
      </div>

      <button
        onClick={onOpenAssign}
        type="button"
        className="relative inline-flex items-center justify-start
        py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-300
        transition-all duration-150 ease-in-out rounded-lg
        hover:pl-10 hover:pr-6 bg-white/5 border border-white/10 group"
      >
        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-500 group-hover:h-full" />
        <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
          <FiArrowRight className="w-5 h-5 text-emerald-400" />
        </span>
        <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 duration-200 ease-out">
          <FiArrowRight className="w-5 h-5 text-emerald-400" />
        </span>
        <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
          Add New Task
        </span>
      </button>
    </div>
  );
};

export default DashboardHeader;
