import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getYMDFromRow } from "../../../utils/dashboardHelpers";
import { MONTHS } from "../../../../public/month";
import StaffTasksChart from "./StaffDashobard/StaffTasksChart";
import Swal from "sweetalert2";
import GiftCreditModal from "./StaffDashobard/GiftCreditModal";
import StaffCreditWidget from "./StaffCreditWidget";

const StaffTasks = ({
  staffUsers,
  staffTasks,
  refetch,
  user,
  staffTasksCreditPoints,
}) => {
  const [activeStaffId, setActiveStaffId] = useState(null);
  const [filterType, setFilterType] = useState("regular");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear()),
  );
  const [openGift, setOpenGift] = useState(false);

  const START_YEAR = 2025;
  const CURRENT_YEAR = new Date().getFullYear();
  const todayBD = useMemo(() => {
    const d = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }, []);

  const years = useMemo(() => {
    const arr = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) arr.push(String(y));
    return arr;
  }, [CURRENT_YEAR]);

  const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

  const getWeight = (p) => {
    const k = String(p || "medium").toLowerCase();
    return PRIORITY_WEIGHT[k] ?? 2;
  };

  const isDone = (status) => {
    const st = String(status || "").toLowerCase();
    return st === "complete" || st === "done" || st === "completed";
  };
  const staffTaskCountMap = useMemo(() => {
    const map = new Map();

    const todaysTasks = Array.isArray(staffTasks)
      ? staffTasks.filter((t) => getYMDFromRow(t) === todayBD)
      : [];

    for (const t of todaysTasks) {
      const sid = String(t.staff_id ?? "");
      if (!sid) continue;

      if (!map.has(sid)) {
        map.set(sid, {
          total: 0,
          todo: 0,
          done: 0,
          high: 0,
          pointsTotal: 0,
          pointsDone: 0,
        });
      }

      const obj = map.get(sid);
      obj.total += 1;

      const pr = String(t.priority || "medium").toLowerCase();
      if (pr === "high") obj.high += 1;

      const w = getWeight(pr);
      obj.pointsTotal += w;

      if (isDone(t.status)) {
        obj.done += 1;
        obj.pointsDone += w;
      } else {
        obj.todo += 1;
      }
    }

    return map;
  }, [staffTasks, todayBD]);

  const staffCards = useMemo(() => {
    return staffUsers?.map((s) => {
      const sid = String(s.id);
      const c = staffTaskCountMap.get(sid) || {
        total: 0,
        todo: 0,
        done: 0,
        high: 0,
      };
      const pct = Math.round((c.pointsDone / Math.max(1, c.pointsTotal)) * 100);
      return {
        id: sid,
        name: s.name || `Staff #${sid}`,
        total: c.total,
        todo: c.todo,
        done: c.done,
        high: c.high,
        pct,
      };
    });
  }, [staffUsers, staffTaskCountMap]);

  const activeTasks = useMemo(() => {
    if (!activeStaffId) return [];

    let list = staffTasks.filter(
      (t) => String(t.staff_id) === String(activeStaffId),
    );
    if (filterType === "regular") {
      list = list.filter((t) => {
        const day = getYMDFromRow(t); // created day
        const st = String(t.status || "").toLowerCase();
        const pending = st === "todo" || st === "doing";
        return day === todayBD || pending; // ✅ today tasks + all pending from previous days
      });
    }

    // ✅ created_at based filter
    if (filterType === "daily" && selectedDate) {
      list = list.filter((t) => getYMDFromRow(t) === selectedDate);
    }

    if (filterType === "monthly" && selectedMonth && selectedYear) {
      const ym = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
      list = list.filter((t) => (getYMDFromRow(t) || "").slice(0, 7) === ym);
    }

    if (filterType === "yearly" && selectedYear) {
      list = list.filter(
        (t) => (getYMDFromRow(t) || "").slice(0, 4) === selectedYear,
      );
    }

    return list.sort((a, b) => Number(b.id) - Number(a.id));
  }, [
    staffTasks,
    activeStaffId,
    filterType,
    selectedDate,
    selectedMonth,
    selectedYear,
    todayBD,
  ]);
  const filteredTasksForStaff = useMemo(() => {
    if (!activeStaffId) return [];

    let list = staffTasks.filter(
      (t) => String(t.staff_id) === String(activeStaffId),
    );

    // ✅ Regular = today + pending carry forward (Option A)
    if (filterType === "regular") {
      list = list.filter((t) => {
        const day = getYMDFromRow(t);
        const st = String(t.status || "").toLowerCase();
        const pending = st === "todo" || st === "doing";
        return day === todayBD || pending;
      });
    }

    // ✅ Daily
    if (filterType === "daily" && selectedDate) {
      list = list.filter((t) => getYMDFromRow(t) === selectedDate);
    }

    // ✅ Monthly
    if (filterType === "monthly" && selectedMonth && selectedYear) {
      const ym = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
      list = list.filter((t) => (getYMDFromRow(t) || "").slice(0, 7) === ym);
    }

    // ✅ Yearly
    if (filterType === "yearly" && selectedYear) {
      list = list.filter(
        (t) => (getYMDFromRow(t) || "").slice(0, 4) === selectedYear,
      );
    }

    return list;
  }, [
    staffTasks,
    activeStaffId,
    filterType,
    selectedDate,
    selectedMonth,
    selectedYear,
    todayBD,
  ]);
  const activeStaffStats = useMemo(() => {
    const list = filteredTasksForStaff;

    let total = 0,
      todo = 0,
      done = 0,
      high = 0,
      pointsTotal = 0,
      pointsDone = 0;

    for (const t of list) {
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

    return { total, todo, done, high, pct, pointsTotal, pointsDone };
  }, [filteredTasksForStaff]);

  const handleComplete = async (task) => {
    if (!task?.id) return;
    if (String(task.status).toLowerCase() === "complete") return;

    const { isConfirmed, value } = await Swal.fire({
      title: "Complete task?",
      text: "যদি note দিতে চাও লিখতে পারো (optional)",
      input: "textarea",
      inputPlaceholder: "Note (optional) ...",
      inputValue: "",
      showCancelButton: true,
      confirmButtonText: "Complete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      inputAttributes: {
        "aria-label": "Optional note",
      },
    });

    if (!isConfirmed) return;

    const note = (value || "").trim(); // ✅ empty allowed

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/Staff_Tasks/complete_staff_task.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            task_id: task.id,
            note, // ✅ optional
          }),
        },
      );

      const data = await res.json();
      if (!data?.success) throw new Error(data?.message || "Failed");

      refetch();
      toast.success("Task completed ✅");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Staff Tasks Summary
          </h2>
        </div>

        {activeStaffId && (
          <>
            <button
              onClick={() => setActiveStaffId(null)}
              className="px-3 py-2 rounded-xl bg-[#0B0E16] border border-white/10 text-white/80 hover:bg-white/10 text-sm"
            >
              Clear Selection
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {staffCards?.map((st) => {
          const isActive = String(activeStaffId) === String(st.id);
          return (
            <button
              key={st.id}
              onClick={() => setActiveStaffId(st.id)}
              className={`text-left rounded-2xl border p-4 transition
                ${
                  isActive
                    ? "border-sky-400/40 bg-sky-500/10"
                    : "border-white/10 bg-[#0B0E16] hover:bg-white/10"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-semibold">{st.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">ID: #{st.id}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Done</p>
                  <p className="text-sm font-semibold text-white">
                    {" "}
                    {isActive ? activeStaffStats.pct : st.pct}%
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <MiniStat
                  label="Total"
                  value={isActive ? activeStaffStats.total : st.total}
                />
                <MiniStat
                  label="Todo"
                  value={isActive ? activeStaffStats.todo : st.todo}
                />
                <MiniStat
                  label="Done"
                  value={isActive ? activeStaffStats.done : st.done}
                />
                {/* <MiniStat
                  label="High"
                  value={isActive ? activeStaffStats.high : st.high}
                /> */}
                
                  <StaffCreditWidget
                    staffId={st.id}
                    staffTasksCreditPoints={staffTasksCreditPoints} // ← এটা StaffTasks props এ দাও
                  />
             
              </div>

              {/* ✅ Progress + Percent (same source) */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-semibold">
                    {isActive ? activeStaffStats.pct : st.pct}%
                  </span>
                </div>

                <div className="mt-2 w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                    style={{
                      width: `${isActive ? activeStaffStats.pct : st.pct}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activeStaffId && (
        <div className="rounded-2xl border border-white/10 bg-[#0B0E16] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">
              Tasks of Staff #{activeStaffId}
            </h3>
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenGift(true)}
                    className="px-3 py-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-xs hover:bg-emerald-500/20"
                  >
                    🎁 Gift Points
                  </button>

                  <p className="text-xs text-slate-400">
                    Total: {activeTasks.length}
                  </p>
                </div>
              </div>
            </>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
            >
              <option value="regular">Regular (All)</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            {filterType === "daily" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white date-fix"
              />
            )}

            {filterType === "monthly" && (
              <>
                {/* Month */}
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

                {/* Year */}
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
              Showing: <b className="text-white">{activeTasks.length}</b> tasks
            </span>
          </div>

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
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.map((t) => (
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
                    <td className="py-2 pr-3 text-slate-300">
                      <button
                        onClick={() => handleComplete(t)}
                        disabled={String(t.status).toLowerCase() === "complete"}
                        className={`px-3 py-1.5 rounded-lg border text-xs
      ${
        String(t.status).toLowerCase() === "complete"
          ? "border-emerald-400/30 text-emerald-200 bg-emerald-500/10 cursor-not-allowed"
          : "border-sky-400/30 text-sky-200 bg-sky-500/10 hover:bg-sky-500/20"
      }`}
                      >
                        {String(t.status).toLowerCase() === "complete"
                          ? "Completed"
                          : "Complete"}
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      এই staff এর কোন task নাই
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <StaffTasksChart
        staffId={activeStaffId}
        staffTasks={staffTasks}
        refetch={refetch}
      />
      {openGift && (
        <GiftCreditModal
          open={openGift}
          onClose={() => setOpenGift(false)}
          users={staffUsers}
          defaultStaffId={activeStaffId}
          currentUserId={user?.id}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};

export default StaffTasks;

/* ---------- small UI bits ---------- */
const MiniStat = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-[#0f1b2d]/60 px-3 py-2">
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
        : k === "done" || k === "completed"
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
