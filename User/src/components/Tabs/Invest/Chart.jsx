import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import useInvestInstallment from "../../../Utils/Hooks/useInvestInstallments";
import Loader from "../../Loader/Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// 🔹 Date helper
const parseDateParts = (dateStr) => {
  if (!dateStr) return {};
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return {};
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
};

const Chart = ({ selectedCard }) => {
  const paymentType = selectedCard?.payment_type;

  const { investInstallments = [], inInvestInstallmentsLoading } =
    useInvestInstallment(selectedCard?.id);

  // 🔹 Available years from data
  const availableYears = useMemo(() => {
    const years = new Set();
    investInstallments.forEach((inst) => {
      const { year } = parseDateParts(inst.investment_date);
      if (year) years.add(year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [investInstallments]);

  // 🔹 Default year = first available or current year
  const defaultYear = availableYears[0] || new Date().getFullYear();

  const [filterYear, setFilterYear] = useState(defaultYear);
  const [filterMonth, setFilterMonth] = useState("all");

  // selected card change হলে reset
  useEffect(() => {
    if (availableYears.length > 0) {
      setFilterYear(availableYears[0]);
    }
    setFilterMonth("all");
  }, [selectedCard?.id, availableYears]);

  const formatNumber = (n) =>
    n != null
      ? Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })
      : "-";

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

  // 🔹 Filtered installments (Year always applied)
  const filteredInstallments = useMemo(() => {
    if (!investInstallments.length) return [];

    return investInstallments.filter((inst) => {
      const { year, month } = parseDateParts(inst.investment_date);
      if (!year || !month) return false;

      if (year !== Number(filterYear)) return false;

      if (filterMonth === "all") return true;

      return month === Number(filterMonth);
    });
  }, [investInstallments, filterYear, filterMonth]);

  // 🔹 Chart data
  const chartData = useMemo(() => {
    if (!selectedCard) return { labels: [], datasets: [] };

    const getAmount = (inst) => Number(inst.amount || 0);

    // ✅ ONETIME
    if (paymentType === "onetime") {
      const total = filteredInstallments.reduce(
        (sum, inst) => sum + getAmount(inst),
        0
      );
      return {
        labels: ["Payment"],
        datasets: [
          {
            label: "এককালীন পেমেন্ট",
            data: [total],
            backgroundColor: "#10b981",
          },
        ],
      };
    }

    // ✅ MONTH = ALL → show full year (Jan–Dec)
    if (filterMonth === "all") {
      const monthlyTotals = Array(12).fill(0);

      filteredInstallments.forEach((inst) => {
        const { month } = parseDateParts(inst.investment_date);
        if (month) {
          monthlyTotals[month - 1] += getAmount(inst);
        }
      });

      return {
        labels: monthNames,
        datasets: [
          {
            label: `${filterYear} - মাসভিত্তিক জমা`,
            data: monthlyTotals,
            backgroundColor: "#3b82f6",
          },
        ],
      };
    }

    // ✅ DAILY / FLEXIBLE (specific month)
    if (paymentType === "daily" || paymentType === "flexible") {
      const days = daysInMonth(filterYear, filterMonth);
      const dailyTotals = Array(days).fill(0);

      filteredInstallments.forEach((inst) => {
        const { day } = parseDateParts(inst.investment_date);
        if (day) dailyTotals[day - 1] += getAmount(inst);
      });

      return {
        labels: Array.from({ length: days }, (_, i) => `${i + 1}`),
        datasets: [
          {
            label: `${monthNames[filterMonth - 1]} ${filterYear}`,
            data: dailyTotals,
            backgroundColor: "#0ea5e9",
          },
        ],
      };
    }

    // ✅ WEEKLY
    if (paymentType === "weekly") {
      const days = daysInMonth(filterYear, filterMonth);
      const weekCount = Math.ceil(days / 7);
      const weeklyTotals = Array(weekCount).fill(0);

      filteredInstallments.forEach((inst) => {
        const { day } = parseDateParts(inst.investment_date);
        if (day) {
          const weekIndex = Math.floor((day - 1) / 7);
          weeklyTotals[weekIndex] += getAmount(inst);
        }
      });

      return {
        labels: weeklyTotals.map((_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: `${monthNames[filterMonth - 1]} ${filterYear}`,
            data: weeklyTotals,
            backgroundColor: "#22c55e",
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  }, [
    filteredInstallments,
    paymentType,
    filterYear,
    filterMonth,
    selectedCard,
  ]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `৳${formatNumber(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `৳${formatNumber(v)}`,
        },
      },
    },
  };

  if (!selectedCard)
    return (
      <p className="text-sm text-slate-500">কোনো কার্ড সিলেক্ট করা হয়নি।</p>
    );

  if (inInvestInstallmentsLoading)
    return (
      <div className="py-8 flex justify-center">
        <Loader />
      </div>
    );

  if (!investInstallments.length)
    return (
      <p className="text-sm text-slate-500">
        এই কার্ডের জন্য কোনো কিস্তির ডাটা নেই।
      </p>
    );

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* 🔹 Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Year</label>
          <select
            className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Month</label>
          <select
            className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">All</option>
            {monthNames.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chartData.labels.length === 0 ? (
        <p className="text-sm text-slate-500">
          নির্বাচিত ফিল্টারের জন্য কোনো ডাটা নেই।
        </p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default Chart;
