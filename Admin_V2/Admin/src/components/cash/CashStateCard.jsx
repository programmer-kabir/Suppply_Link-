import React from "react";

const CashStateCard = ({
  title,
  amount,
  icon,
  border,
  text,
  bg,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${border} bg-[#111827] p-3 md:p-4 shadow-lg cursor-pointer hover:scale-[1.02] transition duration-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${text}`}>
            {title}
          </p>

          <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
            ৳ {Number(amount).toLocaleString()}
          </h2>
        </div>

        <div
          className={`${bg} w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CashStateCard;