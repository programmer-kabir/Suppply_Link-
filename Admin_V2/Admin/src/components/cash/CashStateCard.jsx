import React from "react";

const CashStateCard = ({
  title,
  amount,
  icon,
  prefix = "৳ ",
  border = "border-slate-800",
  text = "text-slate-300",
  bg = "bg-slate-800",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${border} bg-slate-900/80 backdrop-blur-md p-3.5 sm:p-4 shadow-lg cursor-pointer hover:scale-[1.02] hover:border-indigo-500/40 hover:bg-slate-800/70 transition-all duration-200 flex flex-col justify-between group`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-medium truncate ${text}`}>
            {title}
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold mt-1 text-white truncate tabular-nums font-mono tracking-tight">
            {prefix}{Number(amount || 0).toLocaleString()}
          </h2>
        </div>

        <div
          className={`${bg} w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-base shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CashStateCard;