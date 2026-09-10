export const TogglePill = ({
  checked,
  onChange,
  label,
  tone = "green",
  icon: Icon = null,
  size = "md",
  disabled = false,
}) => {
  const toneMap = {
    green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    yellow: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    red: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    shop: "border-indigo-500/40 bg-indigo-500/10 text-indigo-200",
  };

  const pad = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      className={`flex items-center gap-2 rounded-2xl border transition ${pad} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${
        checked
          ? toneMap[tone]
          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-900"
      }`}
    >
      {Icon ? <Icon className="text-base" /> : null}
      <span>{label}</span>
    </button>
  );
};

import React, { useMemo } from "react";

export const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="text-sm text-slate-300">{label}</span>
    <input
      {...props}
      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-500 date-fix"
    />
  </label>
);

export const TextArea = ({ label, value, ...props }) => (
  <label className="block md:col-span-2">
    <span className="text-sm text-slate-300">{label}</span>
    <textarea
      {...props}
      {...(value !== undefined ? { value } : {})}
      className="mt-1 w-full resize-none rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-500"
    />
  </label>
);

export const SectionCard = ({ title, tone = "green", children }) => {
  const cls = useMemo(() => {
    const map = {
      green: "border-emerald-500/30 bg-emerald-500/5",
      yellow: "border-amber-500/30 bg-emerald-500/5",
      red: "border-rose-500/30 bg-rose-500/5",
      shop: "border-indigo-500/30 bg-indigo-500/5",
    };
    return map[tone] || map.green;
  }, [tone]);

  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <h3 className="mb-3 text-lg font-semibold text-slate-100">{title}</h3>
      {children}
    </div>
  );
};
