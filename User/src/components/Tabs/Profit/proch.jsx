import React, { useMemo, useState, useEffect } from "react";
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
import ProfitChartTable from "./ProfitChartTable/ProfitChartTable";
import { formatMoney, formatNumber, toNumber } from "../../../Utils/format";
import { MONTHS } from "../../../../public/months";
import AllProfitChartTable from "./ProfitChartTable/AllProfitChartTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const ProfitChart = ({
  profits = [],
  filterYear = "",
  filterMonth = "",
  companyOverview = [],
  monthlyTotalWeight = [],
}) => {
  // const activeYear = filterYear === "" ? null : Number(filterYear);
  const activeYear = filterYear;
  const activeMonth = filterMonth === "" ? null : Number(filterMonth);

  const weightMap = useMemo(() => {
    const map = {};

    (monthlyTotalWeight || []).forEach((w) => {
      const key = `${Number(w.year)}-${Number(w.month)}`;
      map[key] = toNumber(w.totalWeight);
    });

    return map;
  }, [monthlyTotalWeight]);

  // ✅ group by month for selected year (show all 12 months)
const monthly = useMemo(() => {

  // ===============================
  // 🔵 ALL YEARS MODE
  // ===============================
  if (activeYear === "all") {
    const map = {};

    (profits || []).forEach((p) => {
      const year = Number(p.profit_year);
      const month = Number(p.profit_month);
      if (!year || !month) return;

      const key = `${year}-${month}`;

      if (!map[key]) {
        map[key] = {
          year,
          monthIndex: month,
          monthName: `${MONTHS[month - 1]} (${year})`,
          totalAmount: 0,
          personalProfit: 0,
          personalWeight: 0,
          totalWeight: 0,
          generatedProfit: 0,
          totalPercent: 0,
          companyProfit: 0,
          investorsProfit: 0,
        };
      }

      const item = map[key];
      item.totalAmount += toNumber(p.amount);
      item.personalProfit += toNumber(p.profit_amount);
      item.personalWeight += toNumber(p.weight_value);
      item.totalPercent += toNumber(p.percent);
    });

    (companyOverview || []).forEach((c) => {
      const year = Number(c.year);
      const month = Number(c.month);
      if (!year || !month) return;

      const key = `${year}-${month}`;
      if (!map[key]) return;

      const item = map[key];
      item.totalWeight = weightMap[key] || 0;
      item.generatedProfit += toNumber(c.companyProfit);
    });

    Object.values(map).forEach((item) => {
      const half = item.generatedProfit / 2;
      item.companyProfit = half;
      item.investorsProfit = half;
    });

    return Object.values(map).sort(
      (a, b) => a.year - b.year || a.monthIndex - b.monthIndex
    );
  }

  // ===============================
  // 🟢 SINGLE YEAR MODE (FIXED)
  // ===============================

  const map = {};

  // ===== PROFITS LOOP =====
  (profits || []).forEach((p) => {
    if (Number(p.profit_year) !== Number(activeYear)) return;
    if (activeMonth && Number(p.profit_month) !== activeMonth) return;

    const m = Number(p.profit_month);
    if (!m || m < 1 || m > 12) return;

    const key = `${activeYear}-${m}`;

    if (!map[key]) {
      map[key] = {
        year: activeYear,
        monthIndex: m,
        monthName: MONTHS[m - 1],
        totalAmount: 0,
        personalProfit: 0,
        personalWeight: 0,
        totalWeight: 0,
        generatedProfit: 0,
        totalPercent: 0,
        companyProfit: 0,
        investorsProfit: 0,
      };
    }

    const item = map[key];
    item.totalAmount += toNumber(p.amount);
    item.personalProfit += toNumber(p.profit_amount);
    item.personalWeight += toNumber(p.weight_value);
    item.totalPercent += toNumber(p.percent);
  });

  // ===== COMPANY OVERVIEW LOOP =====
  (companyOverview || []).forEach((c) => {
    if (Number(c.year) !== Number(activeYear)) return;
    if (activeMonth && Number(c.month) !== activeMonth) return;

    const m = Number(c.month);
    if (!m || m < 1 || m > 12) return;

    const key = `${activeYear}-${m}`;
    if (!map[key]) return;

    const item = map[key];
    item.totalWeight = weightMap[key] || 0;
    item.generatedProfit += toNumber(c.companyProfit);
  });

  // ===== SPLIT PROFIT =====
  Object.values(map).forEach((item) => {
    const half = item.generatedProfit / 2;
    item.companyProfit = half;
    item.investorsProfit = half;
  });

  // ===== SORT & RETURN =====
  return Object.values(map).sort(
    (a, b) => a.monthIndex - b.monthIndex
  );

}, [profits, companyOverview, activeYear, activeMonth, weightMap]);


const monthlyWithActiveAmount = useMemo(() => {
  let runningAmount = 0;

  return monthly.map((m) => {
    runningAmount += m.totalAmount + m.personalProfit;

    return {
      ...m,
      activeAmount: runningAmount,
    };
  });
}, [monthly]);

  const totals = useMemo(() => {
    return monthly.reduce(
      (acc, m) => {
        acc.amount += m.totalAmount;
        acc.profit += m.personalProfit;
        acc.weight += m.personalWeight;
        acc.generatedProfit += m.generatedProfit;
        acc.totalCompanyProfit += m.companyProfit;
        return acc;
      },
      {
        amount: 0,
        profit: 0,
        weight: 0,
        generatedProfit: 0,
        totalCompanyProfit: 0,
      },
    );
  }, [monthly]);

  const chartData = useMemo(() => {
    return {
      labels: monthly.map((m) => m.monthName),
      datasets: [
        {
          label: "জমা (amount)",
          data: monthly.map((m) => m.totalAmount),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "লাভ (profit_amount)",
          data: monthly.map((m) => m.personalProfit),
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [monthly]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: `Month-wise Amount & Profit ${
            activeYear ? `(${activeYear})` : "(All Years)"
          }`,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ৳ ${formatMoney(ctx.raw)}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => `৳ ${formatMoney(v)}`,
          },
        },
      },
    };
  }, [filterYear]);

  const hasData = (profits || []).length > 0;
  const lastCompletedMonthIndex = useMemo(() => {
    const now = new Date();

    // যদি selected year current year হয়
    if (activeYear === now.getFullYear()) {
      return now.getMonth() - 1; // current month বাদ
    }

    // অন্য year হলে সব show
    return 11;
  }, [activeYear]);
  const visibleMonthly = useMemo(() => {
    return monthlyWithActiveAmount.filter(
      (_, i) => i <= lastCompletedMonthIndex,
    );
  }, [monthlyWithActiveAmount, lastCompletedMonthIndex]);

  return (
    <section className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              📈 Profit & Amount Chart
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              শুধু Year সিলেক্ট করলেই সব মাসে কত জমা আর কত লাভ হয়েছে দেখাবে।
            </p>
          </div>
        </div>

        {!hasData ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">কোনো ডাটা পাওয়া যায়নি।</p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <Line options={chartOptions} data={chartData} />
            </div>

            {/* mini summary (rows বাদ) */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Total weight</p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatNumber(totals.weight)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Total amount</p>
                <p className="text-lg font-semibold text-slate-800">
                  ৳ {formatMoney(totals.amount)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Total profit</p>
                <p className="text-lg font-semibold text-slate-800">
                  ৳ {formatMoney(totals.profit)}
                </p>
              </div>
            </div>
            {activeYear !== "all" && (
              <div>
                <ProfitChartTable
                  visibleMonthly={visibleMonthly}
                  totals={totals}
                />
              </div>
            )}
            {activeYear === "all" && (
              <div>
                <AllProfitChartTable
                  visibleMonthly={visibleMonthly}
                  totals={totals}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProfitChart;
