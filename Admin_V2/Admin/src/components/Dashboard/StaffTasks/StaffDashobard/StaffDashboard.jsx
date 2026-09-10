import React, { useCallback, useMemo, useState } from "react";
import { getYMDFromRow } from "../../../../utils/dashboardHelpers";
import { MONTHS } from "../../../../../public/month";
import StaffTasksChart from "./StaffTasksChart";
import StaffCreditWidget from "../StaffCreditWidget";

const StaffDashboard = ({
  staffTasks = [],
  user = null,
  users = [],
  staffTasksCreditPoints,
}) => {
  const staffId = user?.id ? String(user.id) : null;
  const currentUser = users.find((u) => Number(u.id) === Number(staffId));
  const [filterType, setFilterType] = useState("regular"); // regular|daily|monthly|yearly
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear()),
  );
  const [openCreditModal, setOpenCreditModal] = useState(false);
  const START_YEAR = 2025;
  const CURRENT_YEAR = new Date().getFullYear();

  const years = useMemo(() => {
    const arr = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) arr.push(String(y));
    return arr;
  }, [CURRENT_YEAR]);

  const todayBD = useMemo(() => {
    const d = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );
    return d.toISOString().slice(0, 10);
  }, []);

  const currentSTaffRewards = useMemo(() => {
    const arr = Array.isArray(staffTasksCreditPoints)
      ? staffTasksCreditPoints
      : [];
    return arr.filter((r) => String(r.staff_id) === String(staffId));
  }, [staffTasksCreditPoints, staffId]);
  const myAllTasks = useMemo(() => {
    if (!staffId) return [];
    if (!Array.isArray(staffTasks)) return [];
    return staffTasks.filter((t) => String(t.staff_id) === staffId);
  }, [staffTasks, staffId]);

  const filteredTasks = useMemo(() => {
    let list = [...myAllTasks];

    // Regular = today + pending carry forward
    if (filterType === "regular") {
      list = list.filter((t) => {
        const day = getYMDFromRow(t);
        const st = String(t.status || "").toLowerCase();
        const pending = st === "todo" || st === "doing";
        return day === todayBD || pending;
      });
    }

    // Daily
    if (filterType === "daily" && selectedDate) {
      list = list.filter((t) => getYMDFromRow(t) === selectedDate);
    }

    // Monthly
    if (filterType === "monthly" && selectedMonth && selectedYear) {
      const ym = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
      list = list.filter((t) => (getYMDFromRow(t) || "").slice(0, 7) === ym);
    }

    // Yearly
    if (filterType === "yearly" && selectedYear) {
      list = list.filter(
        (t) => (getYMDFromRow(t) || "").slice(0, 4) === selectedYear,
      );
    }

    return list.sort((a, b) => Number(b.id) - Number(a.id));
  }, [
    myAllTasks,
    filterType,
    selectedDate,
    selectedMonth,
    selectedYear,
    todayBD,
  ]);

  const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

  const getWeight = useCallback((p) => {
    const k = String(p || "medium").toLowerCase();
    return PRIORITY_WEIGHT[k] ?? 2;
  }, []);

  const isDone = useCallback((status) => {
    const st = String(status || "").toLowerCase();
    return st === "complete" || st === "done" || st === "completed";
  }, []);
  const creditRows = useMemo(() => {
    let list = [...currentSTaffRewards];

    if (filterType === "daily" && selectedDate) {
      list = list.filter(
        (r) => String(r.created_at || "").slice(0, 10) === selectedDate,
      );
    }

    if (filterType === "monthly" && selectedMonth && selectedYear) {
      const ym = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
      list = list.filter((r) => String(r.created_at || "").slice(0, 7) === ym);
    }

    if (filterType === "yearly" && selectedYear) {
      list = list.filter(
        (r) => String(r.created_at || "").slice(0, 4) === selectedYear,
      );
    }

    // latest first
    return list
      .map((r) => ({
        id: r.id,
        type: String(r.type || "").toUpperCase(),
        points: Number(r.credit_points || 0),
        note: r.note || r.credit_note || "-",
        date: r.created_at || r.updated_at || r.completed_at || "",
      }))
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [
    currentSTaffRewards,
    filterType,
    selectedDate,
    selectedMonth,
    selectedYear,
  ]);

  const creditTotal = useMemo(() => {
    let total = 0;

    for (const r of creditRows) {
      const type = String(r.type || "").toUpperCase();
      const pts = Math.abs(Number(r.points || 0)); // always positive

      if (type === "PENALTY") {
        total -= pts; // ❌ minus
      } else {
        total += pts; // ✅ plus (TASK_COMPLETE, BONUS)
      }
    }

    return total;
  }, [creditRows]);

  const stats = useMemo(() => {
    let total = 0,
      todo = 0,
      done = 0,
      high = 0,
      pointsTotal = 0,
      pointsDone = 0;

    for (const t of filteredTasks) {
      total += 1;

      const pr = String(t.priority || "medium").toLowerCase();
      if (pr === "high") high += 1;

      const w = getWeight(pr);
      pointsTotal += w;

      if (isDone(t.status)) {
        done += 1;
        pointsDone += w;
      } else {
        todo += 1;
      }
    }

    const pct = Math.round((pointsDone / Math.max(1, pointsTotal)) * 100);
    return { total, todo, done, high, pct, credit: creditTotal };
  }, [filteredTasks, getWeight, isDone, creditTotal]);

  const getPeriodLabel = useCallback(() => {
    if (filterType === "regular") return "Regular (আজ + pending carry-forward)";
    if (filterType === "daily") return `Daily (${selectedDate || todayBD})`;
    if (filterType === "monthly")
      return `Monthly (${selectedYear}-${String(selectedMonth || "").padStart(2, "0")})`;
    if (filterType === "yearly") return `Yearly (${selectedYear})`;
    return "All";
  }, [filterType, selectedDate, selectedMonth, selectedYear, todayBD]);

  const celebration = useMemo(() => {
    if (stats.total <= 0) return { show: false, title: "", msg: "" };
    if (stats.pct !== 100) return { show: false, title: "", msg: "" };

    const period = getPeriodLabel();

    if (filterType === "regular") {
      return {
        show: true,
        title: "অভিনন্দন! 🎉",
        msg: `আপনি ${period} এর সব কাজ শেষ করেছেন ✅ (আজকের সব কাজ complete + pending নেই)।`,
      };
    }

    return {
      show: true,
      title: "অসাধারণ! 🎉",
      msg: `আপনি ${period} এর সব কাজ 100% complete করেছেন ✅`,
    };
  }, [stats.total, stats.pct, filterType, getPeriodLabel]);

  if (!staffId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0B0E16] p-6 text-slate-300">
        Staff user not found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">My Tasks</h2>
          <p className="text-xs text-slate-400 mt-1">
            Regular = আজকের tasks + আগের pending tasks (carry-forward)
          </p>
        </div>
      </div>
      {celebration.show && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl leading-none">🏆</div>
            <div>
              <p className="text-white font-semibold">{celebration.title}</p>
              <p className="text-sm text-emerald-100/90 mt-1">
                {celebration.msg}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Summary card */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0E16] p-4">
        <div className="flex items-center justify-between">
          <p className="text-white font-semibold">
            {user?.name || `${currentUser?.name}`}
          </p>
          <div className="text-right">
            <p className="text-xs text-slate-400">Progress</p>
            <p className="text-sm font-semibold text-white">{stats.pct}%</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MiniStat label="Total" value={stats.total} />
          <MiniStat label="Todo" value={stats.todo} />
          <MiniStat label="Done" value={stats.done} />
          {/* <MiniStat
            label="Credit"
            value={stats.credit}
            clickable
            onClick={() => setOpenCreditModal(true)}
          /> */}
            <StaffCreditWidget
    staffId={staffId}
    staffTasksCreditPoints={staffTasksCreditPoints}
    filterType={filterType}
    selectedDate={selectedDate}
    selectedMonth={selectedMonth}
    selectedYear={selectedYear}
    compact
  />
        </div>

        <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0E16] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
          >
            <option value="regular">Regular</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {filterType === "daily" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
            />
          )}

          {filterType === "monthly" && (
            <>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg bg-[#0B0E16] border border-white/10 px-3 py-2 text-sm text-white"
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option
                    key={m.value}
                    value={String(m.value).padStart(2, "0")}
                  >
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg bg-[#0B0E16] border border-white/10 px-3 py-2 text-sm text-white"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </>
          )}

          {filterType === "yearly" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setFilterType("regular");
              setSelectedDate("");
              setSelectedMonth("");
              setSelectedYear(String(new Date().getFullYear()));
            }}
            className="rounded-lg border border-white/10 bg-[#0F1B2D] px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Clear Filter
          </button>

          <span className="text-xs text-slate-400 ml-auto">
            Showing: <b className="text-white">{filteredTasks.length}</b> tasks
          </span>
        </div>

        {/* Table */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-white/10">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Priority</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Assign Date</th>
                <th className="py-2 pr-3">Due Date</th>
                <th className="py-2 pr-3">Complete Date</th>
                <th className="py-2 pr-3">Update Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-white/5 text-white/85"
                >
                  <td className="py-2 pr-3 text-slate-400">{t.id}</td>
                  <td className="py-2 pr-3">{t.title}</td>
                  <td className="py-2 pr-3">
                    <Pill
                      text={t.priority || "medium"}
                      kind={String(t.priority || "medium").toLowerCase()}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <Pill
                      text={t.status || "todo"}
                      kind={String(t.status || "todo").toLowerCase()}
                    />
                  </td>
                  <td className="py-2 pr-3 text-slate-300">
                    {t.created_at || "-"}
                  </td>
                  <td className="py-2 pr-3 text-slate-300">
                    {t.due_date || "-"}
                  </td>
                  <td className="py-2 pr-3 text-slate-300">
                    {t.completed_at || "-"}
                  </td>
                  <td className="py-2 pr-3 text-slate-300">
                    {t.updated_at || "-"}
                  </td>
                </tr>
              ))}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    কোন task পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <StaffTasksChart staffTasks={staffTasks} staffId={user?.id} />
      {openCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B0E16] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">Credit Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total Credit: <b className="text-white">{creditTotal}</b>
                  <span className="ml-2 text-slate-500">
                    (TASK_COMPLETE + BONUS - PENALTY)
                  </span>
                </p>
              </div>

              <button
                onClick={() => setOpenCreditModal(false)}
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
                  {creditRows.map((c) => (
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

                  {creditRows.length === 0 && (
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
    </div>
  );
};

export default StaffDashboard;

/* ---------- small UI bits ---------- */
const MiniStat = ({ label, value, onClick, clickable }) => (
  <div
    onClick={clickable ? onClick : undefined}
    className={`rounded-xl border border-white/10 bg-[#0f1b2d]/60 px-3 py-2
      ${clickable ? "cursor-pointer hover:bg-white/10" : ""}`}
  >
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
  </div>
);

const Pill = ({ text, kind }) => {
  const k = String(kind || "").toLowerCase();

  const cls =
    k === "high"
      ? "border-red-400/30 text-red-200 bg-red-500/10"
      : k === "low"
        ? "border-emerald-400/30 text-emerald-200 bg-emerald-500/10"
        : k === "done" || k === "completed" || k === "complete"
          ? "border-sky-400/30 text-sky-200 bg-sky-500/10"
          : "border-white/10 text-white/80 bg-[#0B0E16]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}
    >
      {String(text || "").toUpperCase()}
    </span>
  );
};
