import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

const GiftCreditModal = ({
  open,
  onClose,
  users = [], // all users array
  defaultStaffId = "", // optional pre-selected staff id
  currentUserId = "", // admin/manager id (optional)
  onSuccess, // callback
}) => {
  const staffUsers = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  const [staffId, setStaffId] = useState(String(defaultStaffId || ""));
  const [points, setPoints] = useState(10);
  const [type, setType] = useState("BONUS"); // BONUS | GIFT | PENALTY | ADJUST
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStaffId(String(defaultStaffId || ""));
    setPoints(10);
    setType("BONUS");
    setNote("");
  };

  const closeAndReset = () => {
    reset();
    onClose?.();
  };

  const lockedStaff = useMemo(() => {
    if (!defaultStaffId) return null;
    return (
      staffUsers.find((u) => String(u.id) === String(defaultStaffId)) || null
    );
  }, [staffUsers, defaultStaffId]);
  if (!open) return null;
  const submit = async () => {
    if (!staffId) return toast.error("Select staff");
    if (!Number.isFinite(Number(points)) || Number(points) === 0)
      return toast.error("Points cannot be 0");

    setLoading(true);
    try {
      const payload = {
        staff_id: Number(defaultStaffId),
        credit_points: Number(points),
        type,
        note: note.trim(),
        created_by: Number(currentUserId || 0),
      };
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/Staff_Tasks/add_gift_points.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (!data?.success) throw new Error(data?.message || "Failed");

      toast.success("Gift credit added ✅");
      onSuccess?.(data);
      closeAndReset();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={closeAndReset} />

      {/* modal */}
      <div className="relative w-[92%] max-w-lg rounded-2xl border border-white/10 bg-[#0B0E16] p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white text-lg font-semibold">
              Gift Credit Points
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Bonus / Gift / Penalty / Adjust — সব ledger এ save হবে।
            </p>
          </div>

          <button
            onClick={closeAndReset}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* staff */}
          {/* Staff (Locked) */}
          <div>
            <label className="text-xs text-slate-400">Staff</label>

            <div className="mt-1 w-full rounded-xl bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white">
              {lockedStaff
                ? `${lockedStaff.name || "Unknown"} (#${lockedStaff.id})`
                : `Staff #${defaultStaffId}`}
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Selected staff locked (no dropdown)
            </p>
          </div>

          {/* type + points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
              >
                <option value="BONUS">BONUS</option>
                <option value="PENALTY">PENALTY</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Penalty দিলে negative points দাও।
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-400">Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="mt-1 w-full rounded-xl bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
                placeholder="e.g. 10 or -5"
              />

              {/* quick presets */}
              <div className="mt-2 flex flex-wrap gap-2">
                {[5, 10, 20, 50, -5, -10].map((v) => (
                  <button
                    key={v}
                    onClick={() => setPoints(v)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
                    type="button"
                  >
                    {v > 0 ? `+${v}` : v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* note */}
          <div>
            <label className="text-xs text-slate-400">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-xl bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
              placeholder="Why you give this credit..."
            />
          </div>
        </div>

        {/* actions */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={closeAndReset}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Gift"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCreditModal;
