import React, { useEffect, useMemo, useState } from "react";
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
import dayjs from "dayjs";

// chart register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyInstallmentReport = ({ payments = [] }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("All");

  /* ================= FIRST & LAST PAYMENT DATE ================= */
  const { minDate, maxDate } = useMemo(() => {
    if (!payments.length) return { minDate: "", maxDate: "" };

    const dates = payments
      .map((p) => p.paid_date || p.due_date)
      .filter(Boolean)
      .filter((d) => dayjs(d).year() >= 2000)
      .sort();

    return {
      minDate: dayjs(dates[0]).format("YYYY-MM-DD"),
      maxDate: dayjs(dates[dates.length - 1]).format("YYYY-MM-DD"),
    };
  }, [payments]);

  /* ================= AUTO SET DEFAULT RANGE ================= */
  useEffect(() => {
    if (!startDate && minDate) setStartDate(minDate);
    if (!endDate && maxDate) setEndDate(maxDate);
  }, [minDate, maxDate]);

  /* ================= FILTER PAYMENTS ================= */
  const filteredPayments = useMemo(() => {
    if (!startDate || !endDate) return [];

    return payments.filter((p) => {
      const date = p.paid_date || p.due_date;
      if (!date) return false;

      const year = dayjs(date).year();
      if (year < 2000) return false;

      const inRange =
        dayjs(date).isAfter(dayjs(startDate).subtract(1, "day")) &&
        dayjs(date).isBefore(dayjs(endDate).add(1, "day"));

      if (status === "Paid") return p.paid_date && inRange;
      if (status === "Unpaid") return !p.paid_date && inRange;

      return inRange;
    });
  }, [payments, startDate, endDate, status]);

  /* ================= GROUP BY MONTH ================= */
  const monthlyData = useMemo(() => {
    const map = {};

    filteredPayments.forEach((p) => {
      const date = p.paid_date || p.due_date;
      const key = dayjs(date).format("YYYY-MM");

      if (!map[key]) {
        map[key] = {
          key,
          monthLabel: dayjs(date).format("MMMM YYYY"),
          installmentCount: 0,
          totalCollected: 0, // due_amount
          principalCollected: 0, // principal_amount
          profitCollected: 0, // profit_amount
        };
      }

      map[key].installmentCount += 1;
      map[key].totalCollected += Number(p.due_amount || 0);
      map[key].principalCollected += Number(p.principal_amount || 0);
      map[key].profitCollected += Number(p.profit_amount || 0);
    });

    // calendar-wise sort
    return Object.values(map).sort((a, b) =>
      dayjs(a.key).isAfter(dayjs(b.key)) ? 1 : -1
    );
  }, [filteredPayments]);

  /* ================= CHART DATA ================= */
  const chartData = {
    labels: monthlyData.map((m) => m.monthLabel),
    datasets: [
      {
        label: "মোট আদায় (Paid)",
        data: monthlyData.map((m) => m.totalCollected),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "মূলধন (Paid)",
        data: monthlyData.map((m) => m.principalCollected),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "লাভ (Paid)",
        data: monthlyData.map((m) => m.profitCollected),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "মাস ভিত্তিক কিস্তি রিপোর্ট",
      },
    },
  };

  /* ================= TOTALS ================= */
  const grandTotals = monthlyData.reduce(
    (acc, m) => {
      acc.installmentCount += m.installmentCount;
      acc.totalCollected += m.totalCollected;
      acc.principalCollected += m.principalCollected;
      acc.profitCollected += m.profitCollected;
      return acc;
    },
    {
      installmentCount: 0,
      totalCollected: 0,
      principalCollected: 0,
      profitCollected: 0,
    }
  );

  return (
    <main className="space-y-6 mt-10">
      <h2 className="text-xl font-semibold text-center">
        📊 মাস ভিত্তিক কিস্তি রিপোর্ট
      </h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">সকল</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* CHART */}
      <Line options={chartOptions} data={chartData} />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-2">মাস</th>
              <th>কিস্তি</th>
              <th>মোট আদায়</th>
              <th>মূলধন</th>
              <th>লাভ</th>
            </tr>
          </thead>

          <tbody>
            {monthlyData.map((m) => (
              <tr key={m.key} className="border-b">
                <td className="p-2">{m.monthLabel}</td>
                <td>{m.installmentCount}</td>
                <td>৳ {m.totalCollected.toFixed(2)}</td>
                <td>৳ {m.principalCollected.toFixed(2)}</td>
                <td>৳ {m.profitCollected.toFixed(2)}</td>
              </tr>
            ))}

            {/* ✅ GRAND TOTAL */}
            <tr className="font-bold bg-slate-100">
              <td>মোট</td>
              <td>{grandTotals.installmentCount}</td>
              <td>৳ {grandTotals.totalCollected.toFixed(2)}</td>
              <td>৳ {grandTotals.principalCollected.toFixed(2)}</td>
              <td>৳ {grandTotals.profitCollected.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default MonthlyInstallmentReport;
