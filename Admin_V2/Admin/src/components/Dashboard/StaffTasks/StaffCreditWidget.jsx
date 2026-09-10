import React, { useMemo, useState } from "react";

const StaffCreditWidget = ({ staffId, staffTasksCreditPoints = [] }) => {
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const arr = Array.isArray(staffTasksCreditPoints)
      ? staffTasksCreditPoints
      : [];

    const mine = arr.filter((r) => String(r.staff_id) === String(staffId));

    return mine
      .map((r) => ({
        id: r.id,
        type: String(r.type || "").toUpperCase(),
        points: Number(r.credit_points || 0),
        note: r.note || r.credit_note || "-",
        date: r.created_at || r.updated_at || r.completed_at || "",
      }))
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [staffTasksCreditPoints, staffId]);

  const total = useMemo(() => {
    let t = 0;
    for (const r of rows) {
      const type = String(r.type || "").toUpperCase();
      const pts = Math.abs(Number(r.points || 0));
      if (type === "PENALTY") t -= pts;
      else t += pts;
    }
    return t;
  }, [rows]);

  return (
    <>
      {/* small pill */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // ✅ card click (activeStaffId) trigger হবে না
          setOpen(true);
        }}
        className="rounded-xl border text-start border-white/10 bg-[#0f1b2d]/60 px-2.5 py-1 text-xs hover:bg-white/10"
        title="Click to see credit details"
      >
        <span className="text-slate-400">Credit</span>
        <p
          className={
            total < 0
              ? "text-red-400 font-medium"
              : "text-emerald-400 font-bold"
          }
        >
          {total}
        </p>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0B0E16] border border-white/10 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">
                  Credit Details (Staff #{staffId})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total Credit: <b className="text-white">{total}</b>
                  <span className="ml-2 text-slate-500">
                    (TASK_COMPLETE + BONUS - PENALTY)
                  </span>
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
                    <th className="py-2 text-left">Type</th>
                    <th className="py-2 text-left">Points</th>
                    <th className="py-2 text-left">Note</th>
                    <th className="py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/5 text-white/85"
                    >
                      <td className="py-2">{c.type}</td>
                      <td
                        className={`py-2 font-semibold ${
                          c.type === "PENALTY"
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {Number(c.points || 0)}
                      </td>
                      <td className="py-2">{c.note}</td>
                      <td className="py-2 text-slate-300">
                        {String(c.date || "").slice(0, 10)}
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-slate-400"
                      >
                        কোন credit record নাই
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffCreditWidget;
