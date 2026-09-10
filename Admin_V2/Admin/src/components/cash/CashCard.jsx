import React from "react";

const CashCard = ({ title, subtitle, value, icon: Icon, accent }) => {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl 
    bg-[#0f172a] border border-white/10 
    shadow-[0_0_0_1px_rgba(255,255,255,0.02)] 
    hover:bg-[#111827] transition">

      {/* Left */}
      <div className="flex items-center gap-4">
        
        {/* Icon Box */}
        <div className="w-12 h-12 flex items-center justify-center 
        rounded-xl bg-white/5 border border-white/10">
          <Icon className={`text-xl ${accent}`} />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-base font-semibold text-gray-300">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      {/* Value */}
      <h2 className="text-xl font-semibold text-white">{value}</h2>
    </div>
  );
};

export default CashCard;