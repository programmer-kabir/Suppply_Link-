import React from "react";

export const FinanceModal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal box */}
      <div
        className="
          relative w-full max-w-3xl
          rounded-2xl border border-white/10 bg-slate-950/90
          shadow-2xl
          max-h-[85vh] sm:max-h-[90vh]
          flex flex-col
        "
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-slate-50">{title}</h3>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5
                       text-sm text-slate-200 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* content (scroll here) */}
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
