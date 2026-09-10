import React, { useMemo, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
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
  BarElement,
);

const ProfitChart = ({
  profits = [],
  filterYear = "",
  filterMonth = "",
  companyOverview = [],
  monthlyTotalWeight = [],
  payments = [],
  selectedCard = null,
}) => {
  // ✅ WAIT FOR CARD
  if (!selectedCard?.id) {
    return null;
  }
  // const activeYear = filterYear === "" ? null : Number(filterYear);
  const activeYear = filterYear;
  const activeMonth = filterMonth === "" ? null : Number(filterMonth);
  const [chartType, setChartType] = useState("line");
  const makeKey = (year, month) =>
    `${Number(year)}-${String(month).padStart(2, "0")}`;
  const weightMap = useMemo(() => {
    const map = {};

    (monthlyTotalWeight || []).forEach((w) => {
      const key =
  makeKey(
    w.year,
    w.month
  );
      map[key] = toNumber(w.totalWeight);
    });

    return map;
  }, [monthlyTotalWeight]);
  const depositMap = useMemo(() => {
    const map = {};

    (payments || []).forEach((p) => {
      // ✅ ONLY SELECTED CARD
      if (Number(p.investment_card_no) !== Number(selectedCard?.id)) return;

      const date = new Date(p.payment_date || p.investment_date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = makeKey(year, month);
      if (!map[key]) map[key] = 0;

      map[key] += toNumber(p.amount);
    });

    return map;
}, [payments, selectedCard?.id]);
  // ✅ group by month for selected year (show all 12 months)
  const monthly = useMemo(() => {
    // ===============================
    // 🔵 ALL YEARS MODE
    // ===============================
    if (activeYear === "all") {
      const map = {};

      (profits || []).forEach((p) => {
        if (Number(p.card_id) !== Number(selectedCard?.id)) {
          return;
        }
        const year = Number(p.profit_year);
        const month = Number(p.profit_month);
        if (!year || !month) return;

        const key = makeKey(year, month);

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
        // item.totalAmount += toNumber(p.deposit_amount);
        // item.totalAmount += toNumber(p.card_investment_amount);
        const depositKey =
  makeKey(year, month);
        item.totalAmount = depositMap[depositKey] || 0;
        item.personalProfit += toNumber(p.profit_amount);
        item.personalWeight += toNumber(p.weight_value);
        item.totalPercent += toNumber(p.percent);
      });

      (companyOverview || []).forEach((c) => {
        const year = Number(c.year);
        const month = Number(c.month);
        if (!year || !month) return;

       const key =
  makeKey(year, month);
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
        (a, b) => a.year - b.year || a.monthIndex - b.monthIndex,
      );
    }

    // ===============================
    // 🟢 SINGLE YEAR MODE (FIXED)
    // ===============================

    const map = {};

    // ===== PROFITS LOOP =====
    // (profits || []).forEach((p) => {
    //   if (Number(p.profit_year) !== Number(activeYear)) return;
    //   if (activeMonth && Number(p.profit_month) !== activeMonth) return;

    //   const m = Number(p.profit_month);
    //   if (!m || m < 1 || m > 12) return;

    //   const key = `${activeYear}-${m}`;

    //   if (!map[key]) {
    //     map[key] = {
    //       year: activeYear,
    //       monthIndex: m,
    //       monthName: MONTHS[m - 1],
    //       totalAmount: 0,
    //       personalProfit: 0,
    //       personalWeight: 0,
    //       totalWeight: 0,
    //       generatedProfit: 0,
    //       totalPercent: 0,
    //       companyProfit: 0,
    //       investorsProfit: 0,
    //     };
    //   }

    //   const item = map[key];
    //   item.totalAmount += toNumber(p.amount);
    //   item.personalProfit += toNumber(p.profit_amount);
    //   item.personalWeight += toNumber(p.weight_value);
    //   item.totalPercent += toNumber(p.percent);
    // });

    (profits || []).forEach((p) => {
      // ✅ ONLY SELECTED CARD
      if (Number(p.card_id) !== Number(selectedCard?.id)) {
        return;
      }

      // 🔥 FIXED CONDITION
      if (activeYear !== "all" && Number(p.profit_year) !== Number(activeYear))
        return;
      // 🔥 FIXED CONDITION

      if (activeMonth && Number(p.profit_month) !== activeMonth) return;

      const m = Number(p.profit_month);
      if (!m || m < 1 || m > 12) return;

      const key =
  makeKey(
    p.profit_year,
    m
  );

      if (!map[key]) {
        map[key] = {
          year: p.profit_year,
          monthIndex: m,
          monthName: `${MONTHS[m - 1]} (${p.profit_year})`,
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
      const depositKey = makeKey(p.profit_year, p.profit_month);
      item.totalAmount = depositMap[depositKey] || 0;
      // 🔥 deposit only first month
      // const firstMonth = Math.min(...profits.map(p => p.profit_month));
      // if (p.profit_month === firstMonth) {
      //   item.totalAmount = toNumber(p.card_investment_amount);
      // }

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

      const key =
  makeKey(activeYear, m);
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
    return Object.values(map).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [profits, companyOverview, activeYear, activeMonth, weightMap]);

  const previousBalance = useMemo(() => {
    if (activeYear === "all") return 0;

    const prevMonths = [];

    // আগের সব বছরের data collect
    (profits || []).forEach((p) => {
      if (Number(p.card_id) !== Number(selectedCard?.id)) {
        return;
      }

      const year = Number(p.profit_year);
      const month = Number(p.profit_month);

      if (year < Number(activeYear)) {
        prevMonths.push({
          year,
          month,
          profit: toNumber(p.profit_amount),
          deposit: depositMap[makeKey(year, month)] || 0,
        });
      }
    });

    // sort
    prevMonths.sort((a, b) => a.year - b.year || a.month - b.month);

    let balance = 0;

    prevMonths.forEach((m, index) => {
      if (index === 0) {
        balance = m.deposit + m.profit; // ✅ FIXED
      } else {
        balance = balance + m.deposit + m.profit;
      }
    });

    return balance;
  }, [profits, activeYear, depositMap]);

  const monthlyWithActiveAmount = useMemo(() => {
    let balance = previousBalance;

    // ✅ last profit from previous year
    const previousYearProfit = profits
      .filter(
        (p) =>
          Number(p.card_id) === Number(selectedCard?.id) &&
          Number(p.profit_year) < Number(activeYear),
      )
      .sort((a, b) => {
        if (a.profit_year !== b.profit_year) {
          return b.profit_year - a.profit_year;
        }

        return b.profit_month - a.profit_month;
      })[0];

    const previousYearProfitAmount = previousYearProfit
      ? toNumber(previousYearProfit.profit_amount)
      : 0;

    return monthly.map((m, index) => {
      const selfDeposit = m.totalAmount;

      let profitCarry = 0;

      // ✅ normal carry
      if (index > 0) {
        profitCarry = monthly[index - 1].personalProfit;
      }

      // ✅ first month → last year carry
      else {
        profitCarry = previousYearProfitAmount;
      }

      const deposit = selfDeposit + profitCarry;

      /* =========================================
       🔥 WEIGHT BREAKDOWN
    ========================================= */

      const currentMonthEnd = new Date(Number(m.year), Number(m.monthIndex), 1);

      const monthStart = new Date(Number(m.year), Number(m.monthIndex) - 1, 1);

      const totalDays = Math.floor((currentMonthEnd - monthStart) / 86400000);

      const weightBreakdown = [];

      /* =====================================
       🔥 ALL OLD INVESTMENTS
    ===================================== */

      (payments || [])

        .filter((p) => {
          return Number(p.investment_card_no) === Number(selectedCard?.id);
        })

        .filter((p) => {
          // const investDate =
          //   new Date(
          //     p.payment_date ||
          //     p.investment_date
          //   );
          const [y, mth, d] = (p.payment_date || p.investment_date).split("-");

          const investDate = new Date(y, mth - 1, d);
          return investDate < monthStart;
        })

        .forEach((p) => {
          // const investDate =
          //   new Date(
          //     p.payment_date ||
          //     p.investment_date
          //   );
          const [y, mth, d] = (p.payment_date || p.investment_date).split("-");

          const investDate = new Date(y, mth - 1, d);
          const amount = toNumber(p.amount);

          weightBreakdown.push({
            type: "Investment",

            originalDate: investDate.toISOString().split("T")[0],

            amount,

            days: totalDays,

            weight: amount * totalDays,
          });
        });

      /* =====================================
       🔥 PROFIT REINVEST
    ===================================== */

      /* =====================================
   🔥 ALL PROFIT REINVESTS
===================================== */

      profits

        .filter((p) => {
          return Number(p.card_id) === Number(selectedCard?.id);
        })

        .forEach((p) => {
          const profitMonth = Number(p.profit_month);

          const profitYear = Number(p.profit_year);

          // ✅ reinvest month start
          const reinvestDate = new Date(
            p.action_date || p.created_at || p.inserted_at,
          );

          // ✅ only previous profits
          if (reinvestDate >= currentMonthEnd) {
            return;
          }

          let days = 0;

          // ✅ previous month profits
          if (reinvestDate < monthStart) {
            days = totalDays;
          }

          // ✅ current month profits
          else {
            days = Math.floor((currentMonthEnd - reinvestDate) / 86400000);
          }

          const amount = toNumber(p.profit_amount);

          weightBreakdown.push({
            type: "Profit Reinvest",

            originalDate: reinvestDate.toLocaleDateString("en-CA"),

            amount,

            days,

            weight: amount * days,

            isReinvest: true,
          });
        });

      /* =====================================
       🔥 CURRENT MONTH NEW INVESTMENTS
    ===================================== */

      (payments || [])

        .filter((p) => {
          return Number(p.investment_card_no) === Number(selectedCard?.id);
        })

        // ✅ current month deposits
        .filter((p) => {
          // const investDate =
          //   new Date(
          //     p.payment_date ||
          //     p.investment_date
          //   );
          const [y, mth, d] = (p.payment_date || p.investment_date).split("-");

          const investDate = new Date(y, mth - 1, d);
          return investDate >= monthStart && investDate < currentMonthEnd;
        })

        // ✅ remove duplicate reinvest
        .filter((p) => {
          const amount = toNumber(p.amount);

          return Math.abs(amount - profitCarry) > 0.01;
        })

        .forEach((p) => {
          // const investDate =
          //   new Date(
          //     p.payment_date ||
          //     p.investment_date
          //   );
          const [y, mth, d] = (p.payment_date || p.investment_date).split("-");

          const investDate = new Date(y, mth - 1, d);
          const days = Math.floor((currentMonthEnd - investDate) / 86400000);

          const amount = toNumber(p.amount);

          weightBreakdown.push({
            type: "New Investment",

            originalDate: investDate.toISOString().split("T")[0],

            amount,

            days,

            weight: amount * days,
          });
        });

      // ✅ balance update
      if (index === 0) {
        balance = balance + selfDeposit;
      } else {
        balance = balance + deposit;
      }

      return {
        ...m,

        selfDeposit,
        profitCarry,

        deposit,

        activeAmount: balance,

        weightBreakdown,
      };
    });
  }, [monthly, previousBalance, profits, activeYear, payments, selectedCard]);

  const totals = useMemo(() => {
    return monthly.reduce(
      (acc, m) => {
        // ✅ FIXED deposit (sum of all months)
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

  const currentBalance = totals.profit + totals.amount
  console.log(currentBalance)
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
  // const visibleMonthly = useMemo(() => {
  //   return monthlyWithActiveAmount.filter(
  //     (_, i) => i <= lastCompletedMonthIndex,
  //   );
  // }, [monthlyWithActiveAmount, lastCompletedMonthIndex]);
  const visibleMonthly = useMemo(() => {
    // ✅ all year হলে সব show
    if (activeYear === "all") {
      return monthlyWithActiveAmount;
    }

    return monthlyWithActiveAmount.filter(
      (_, i) => i <= lastCompletedMonthIndex,
    );
  }, [monthlyWithActiveAmount, lastCompletedMonthIndex, activeYear]);

  const chartData = useMemo(() => {
    return {
      // labels: monthly.map((m) => m.monthName),
      labels: visibleMonthly.map((m) => m.monthName),

      datasets: [
        {
          label: "মাসিক জমা",
          // data: monthly.map((m) => m.deposit),
          data: visibleMonthly.map((m) => m.deposit),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.5)",

          fill: true,
          tension: 0.35,

          pointRadius: 3,
          pointHoverRadius: 5,
        },

        {
          label: "মাসিক লাভ",
          // data: monthly.map((m) => m.personalProfit),
          data: visibleMonthly.map((m) => m.personalProfit),
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.5)",

          fill: true,
          tension: 0.35,

          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [visibleMonthly]);
console.log(selectedCard)
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
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setChartType("line")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all
    ${
      chartType === "line"
        ? "bg-blue-600 text-white shadow-md"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`}
              >
                📈 Line Chart
              </button>

              <button
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all
    ${
      chartType === "bar"
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`}
              >
                📊 Bar Chart
              </button>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">কোনো ডাটা পাওয়া যায়নি।</p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              {chartType === "line" ? (
                <Line options={chartOptions} data={chartData} />
              ) : (
                <Bar options={chartOptions} data={chartData} />
              )}
            </div>

            {/* mini summary (rows বাদ) */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Current Amount
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  ৳ {formatMoney(currentBalance)}
                </p>
              </div>
            </div>
            {activeYear !== "all" && (
              <div>
                <ProfitChartTable
                  visibleMonthly={monthlyWithActiveAmount}
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
