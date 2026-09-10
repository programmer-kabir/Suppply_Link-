
export const Badge = ({ children, tone = "slate" }) => {
  const map = {
    slate: "bg-slate-500/15 text-slate-200 ring-slate-400/20",
    green: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/20",
    yellow: "bg-amber-500/15 text-amber-200 ring-amber-400/20",
    red: "bg-rose-500/15 text-rose-200 ring-rose-400/20",
    indigo: "bg-indigo-500/15 text-indigo-200 ring-indigo-400/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${map[tone] || map.slate}`}
    >
      {children}
    </span>
  );
};

export const CardTone = (card) => {
  if (card === "green") return "green";
  if (card === "yellow") return "yellow";
  if (card === "red") return "red";
  return "indigo"; // shop
};

export const Field = ({ label, value }) => (
  <div className="min-w-0">
    <div className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </div>
    <div className="mt-0.5 text-sm text-slate-100 break-words">
      {value || "-"}
    </div>
  </div>
);

export const Section = ({ title, children }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <div className="mb-3 text-sm font-semibold text-slate-100">{title}</div>
    <div className="grid gap-3 md:grid-cols-2">{children}</div>
  </div>
);

export const DocThumb = ({ src, label }) => {
  if (!src) return null;
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="group rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
      title={label}
    >
      <div className="mb-2 text-xs text-slate-300">{label}</div>
      <img
        src={src}
        alt={label}
        className="h-28 w-full rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-white/20"
        loading="lazy"
      />
    </a>
  );
};

export const Chevron = ({ open }) => (
  <svg
    className={`h-5 w-5 text-slate-300 transition-transform ${
      open ? "rotate-180" : "rotate-0"
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);
