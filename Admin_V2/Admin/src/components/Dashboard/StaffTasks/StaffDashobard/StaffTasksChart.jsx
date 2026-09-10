import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MONTHS } from "../../../../../public/month"; // ✅ তোমার path
import { getYMDFromRow } from "../../../../utils/dashboardHelpers";

// ✅ register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// ✅ dark defaults (global)
ChartJS.defaults.color = "rgba(255,255,255,0.85)";
ChartJS.defaults.borderColor = "rgba(255,255,255,0.10)";
ChartJS.defaults.plugins.legend.labels.color = "rgba(255,255,255,0.85)";
ChartJS.defaults.plugins.tooltip.titleColor = "rgba(255,255,255,0.95)";
ChartJS.defaults.plugins.tooltip.bodyColor = "rgba(255,255,255,0.90)";
ChartJS.defaults.plugins.tooltip.backgroundColor = "rgba(2,6,23,0.95)";
ChartJS.defaults.plugins.tooltip.borderColor = "rgba(255,255,255,0.15)";
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

const pad2 = (n) => String(n).padStart(2, "0");

const toBDToday = () => {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
  );
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const addDays = (ymd, diff) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + diff);
  const yy = dt.getUTCFullYear();
  const mm = pad2(dt.getUTCMonth() + 1);
  const dd = pad2(dt.getUTCDate());
  return `${yy}-${mm}-${dd}`;
};

const daysInMonth = (year, month01) => {
  const y = Number(year);
  const m = Number(month01); // 01-12
  return new Date(y, m, 0).getDate();
};

const normStatus = (status) => String(status || "").toLowerCase();
const isComplete = (status) => {
  const st = normStatus(status);
  return st === "complete" || st === "completed" || st === "done";
};

export default function StaffTasksChart({ staffTasks = [], staffId }) {
  const [filterType, setFilterType] = useState("yearly"); // daily|monthly|yearly
  const [selectedDate, setSelectedDate] = useState(toBDToday()); // daily end-date
  const [selectedMonth, setSelectedMonth] = useState(
    pad2(new Date().getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear()),
  );

  const START_YEAR = 2025;
  const CURRENT_YEAR = new Date().getFullYear();

  const years = useMemo(() => {
    const arr = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) arr.push(String(y));
    return arr;
  }, [CURRENT_YEAR]);

  // ✅ only this staff tasks
  const myTasks = useMemo(() => {
    if (!staffId) return [];
    return Array.isArray(staffTasks)
      ? staffTasks.filter((t) => String(t.staff_id) === String(staffId))
      : [];
  }, [staffTasks, staffId]);

  // ✅ title text based on filter
  const chartTitle = useMemo(() => {
    if (filterType === "daily") {
      const end = selectedDate || toBDToday();
      const start = addDays(end, -13);
      return `Daily Tasks Report (${start} → ${end})`;
    }
    if (filterType === "monthly") {
      const mName =
        MONTHS.find((m) => pad2(m.value) === String(selectedMonth))?.label ||
        "Month";
      return `Monthly Tasks Report (${mName} ${selectedYear})`;
    }
    return `Yearly Tasks Report (${selectedYear})`;
  }, [filterType, selectedDate, selectedMonth, selectedYear]);

  // ===== Build buckets based on filterType =====
  const { labels, totalArr, todoArr, completeArr } = useMemo(() => {
    const tasks = myTasks;

    const bump = (map, key, status) => {
      if (!map.has(key)) map.set(key, { total: 0, todo: 0, complete: 0 });
      const o = map.get(key);
      o.total += 1;
      if (isComplete(status)) o.complete += 1;
      else o.todo += 1;
    };

    // ✅ DAILY: last 14 days ending selectedDate
    if (filterType === "daily") {
      const end = selectedDate || toBDToday();
      const start = addDays(end, -13);
      const dayKeys = [];
      for (let i = 0; i < 14; i++) dayKeys.push(addDays(start, i));

      const map = new Map();
      for (const t of tasks) {
        const day = getYMDFromRow(t); // YYYY-MM-DD
        if (!day) continue;
        if (day < start || day > end) continue;
        bump(map, day, t.status);
      }

      return {
        labels: dayKeys, // show YYYY-MM-DD
        totalArr: dayKeys.map((d) => map.get(d)?.total ?? 0),
        todoArr: dayKeys.map((d) => map.get(d)?.todo ?? 0),
        completeArr: dayKeys.map((d) => map.get(d)?.complete ?? 0),
      };
    }

    // ✅ MONTHLY: days of selectedMonth in selectedYear
    if (filterType === "monthly") {
      const y = selectedYear;
      const m = selectedMonth; // 01-12
      const dim = daysInMonth(y, m);

      const dayKeys = Array.from(
        { length: dim },
        (_, i) => `${y}-${m}-${pad2(i + 1)}`,
      );

      const map = new Map();
      for (const t of tasks) {
        const day = getYMDFromRow(t);
        if (!day) continue;
        if (day.slice(0, 7) !== `${y}-${m}`) continue;
        bump(map, day, t.status);
      }

      return {
        labels: dayKeys.map((d) => d.slice(8, 10)), // show DD only
        totalArr: dayKeys.map((d) => map.get(d)?.total ?? 0),
        todoArr: dayKeys.map((d) => map.get(d)?.todo ?? 0),
        completeArr: dayKeys.map((d) => map.get(d)?.complete ?? 0),
      };
    }

    // ✅ YEARLY: months of selectedYear
    const y = selectedYear;
    const monthKeys = MONTHS.map((m) => `${y}-${pad2(m.value)}`); // YYYY-MM
    const map = new Map();

    for (const t of tasks) {
      const day = getYMDFromRow(t);
      if (!day) continue;
      if (day.slice(0, 4) !== y) continue;
      bump(map, day.slice(0, 7), t.status);
    }

    return {
      labels: MONTHS.map((m) => m.label),
      totalArr: monthKeys.map((ym) => map.get(ym)?.total ?? 0),
      todoArr: monthKeys.map((ym) => map.get(ym)?.todo ?? 0),
      completeArr: monthKeys.map((ym) => map.get(ym)?.complete ?? 0),
    };
  }, [myTasks, filterType, selectedDate, selectedMonth, selectedYear]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Total",
          data: totalArr,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34,211,238,0.15)",
          pointBackgroundColor: "#22d3ee",
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Complete",
          data: completeArr,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.15)",
          pointBackgroundColor: "#22c55e",
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Todo",
          data: todoArr,
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.12)",
          pointBackgroundColor: "#f97316",
          borderWidth: 2,
          borderDash: [6, 6], // ✅ dashed line
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }),
    [labels, totalArr, todoArr, completeArr],
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 12, weight: "500" },
          boxWidth: 16,
          padding: 16,
        },
      },
      title: {
        display: true,
        text:
          filterType === "daily"
            ? "Daily Tasks Report"
            : filterType === "monthly"
              ? "Monthly Tasks Report"
              : `Yearly Tasks Report (${selectedYear})`,
        color: "#f8fafc",
        font: { size: 14, weight: "600" },
        padding: { top: 8, bottom: 16 },
      },
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#f8fafc",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          stepSize: 1,
        },
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },
    },
  };

  const totalInChart = useMemo(
    () => totalArr.reduce((a, b) => a + b, 0),
    [totalArr],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B0E16] p-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
        >
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
              className="rounded-lg bg-[#0F1B2D] border border-white/10 px-3 py-2 text-sm text-white"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={pad2(m.value)}>
                  {m.label}
                </option>
              ))}
            </select>

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

        <div className="ml-auto text-xs text-slate-400">
          Total in chart: <span className="text-white">{totalInChart}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 h-[320px] md:h-[380px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
