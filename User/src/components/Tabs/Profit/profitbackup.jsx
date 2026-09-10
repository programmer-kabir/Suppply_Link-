// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// );

// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const toNumber = (v) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : 0;
// };

// const formatMoney = (n) =>
//   toNumber(n).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const formatNumber = (n) =>
//   toNumber(n).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// const ProfitChart = ({
//   profits = [],
//   filterYear = "all",
//   filterMonth = "",
//   companyOverview = [],
// }) => {
//   const activeYear = filterYear === "all" ? null : Number(filterYear);

//   const activeMonth = filterMonth === "" ? null : Number(filterMonth);

//   // ✅ group by month for selected year (show all 12 months)
//   const monthly = useMemo(() => {
//     const allMonthlyWeights = {};

//     const arr = MONTHS.map((name, idx) => ({
//       monthIndex: idx + 1, // 1-12
//       monthName: name,
//       totalAmount: 0, // amount জমা
//       personalProfit: 0, // profit_amount লাভ
//       personalWeight: 0,
//       totalWeight: 0, // 🔥 add this
//       generatedProfit: 0,
//       totalPercent: 0,
//       companyProfit: 0,
//       investorsProfit: 0,
//     }));

//     const filtered = (profits || []).filter((p) => {
//       const yMatch = activeYear ? Number(p.profit_year) === activeYear : true;

//       const mMatch = activeMonth
//         ? Number(p.profit_month) === activeMonth
//         : true;

//       return yMatch && mMatch;
//     });

//     filtered.forEach((p) => {
//       const m = Number(p.profit_month); // 1-12
//       if (!m || m < 1 || m > 12) return;

//       const item = arr[m - 1];
//       item.totalAmount += toNumber(p.amount);
//       item.personalProfit += toNumber(p.profit_amount);
//       item.personalWeight += toNumber(p.weight_value);
//       item.totalPercent += toNumber(p.percent);
//     });
//     (companyOverview || []).forEach((c) => {
//       const yMatch = activeYear ? Number(c.year) === activeYear : true;
//       const mMatch = activeMonth ? Number(c.month) === activeMonth : true;

//       if (!yMatch || !mMatch) return;

//       const m = Number(c.month);
//       if (!m || m < 1 || m > 12) return;

//       const item = arr[m - 1];

//       // company weight add
//       item.companyWeight += toNumber(c.companyWeight);

//       // generated profit add
//       item.generatedProfit += toNumber(c.companyProfit);
//     });
//     arr.forEach((item) => {
//       const half = item.generatedProfit / 2;

//       item.companyProfit = half;
//       item.investorsProfit = half;
//     });
//     arr.forEach((item) => {
//       item.totalWeight = item.personalWeight;
//     });
//     return arr;
//   }, [profits, companyOverview, filterYear, filterMonth]);
//   // console.log(companyOverview);
//   const monthlyWithActiveAmount = useMemo(() => {
//     let runningAmount = 0;

//     return monthly.map((m) => {
//       runningAmount += m.totalAmount;

//       return {
//         ...m,
//         activeAmount: runningAmount,
//       };
//     });
//   }, [monthly]);

//   const totals = useMemo(() => {
//     return monthly.reduce(
//       (acc, m) => {
//         acc.amount += m.totalAmount;
//         acc.profit += m.personalProfit;
//         acc.weight += m.personalWeight;
//         acc.generatedProfit += m.generatedProfit;
//         acc.companyWeight += m.companyWeight;
//         return acc;
//       },
//       { amount: 0, profit: 0, weight: 0, generatedProfit: 0, companyWeight: 0 },
//     );
//   }, [monthly]);

//   const chartData = useMemo(() => {
//     return {
//       labels: monthly.map((m) => m.monthName),
//       datasets: [
//         {
//           label: "জমা (amount)",
//           data: monthly.map((m) => m.totalAmount),
//           borderColor: "#2563eb",
//           backgroundColor: "rgba(37, 99, 235, 0.12)",
//           fill: true,
//           tension: 0.35,
//           pointRadius: 3,
//           pointHoverRadius: 5,
//         },
//         {
//           label: "লাভ (profit_amount)",
//           data: monthly.map((m) => m.personalProfit),
//           borderColor: "#16a34a",
//           backgroundColor: "rgba(22, 163, 74, 0.12)",
//           fill: true,
//           tension: 0.35,
//           pointRadius: 3,
//           pointHoverRadius: 5,
//         },
//       ],
//     };
//   }, [monthly]);

//   const chartOptions = useMemo(() => {
//     return {
//       responsive: true,
//       plugins: {
//         legend: { position: "top" },
//         title: {
//           display: true,
//           text: `Month-wise Amount & Profit ${
//             activeYear ? `(${activeYear})` : "(All Years)"
//           }`,
//         },
//         tooltip: {
//           callbacks: {
//             label: (ctx) => `${ctx.dataset.label}: ৳ ${formatMoney(ctx.raw)}`,
//           },
//         },
//       },
//       scales: {
//         y: {
//           ticks: {
//             callback: (v) => `৳ ${formatMoney(v)}`,
//           },
//         },
//       },
//     };
//   }, [filterYear]);

//   const hasData = (profits || []).length > 0;
//   const lastCompletedMonthIndex = useMemo(() => {
//     const now = new Date();

//     // যদি selected year current year হয়
//     if (activeYear === now.getFullYear()) {
//       return now.getMonth() - 1; // current month বাদ
//     }

//     // অন্য year হলে সব show
//     return 11;
//   }, [activeYear]);
//   const visibleMonthly = useMemo(() => {
//     return monthlyWithActiveAmount.filter(
//       (_, i) => i <= lastCompletedMonthIndex,
//     );
//   }, [monthlyWithActiveAmount, lastCompletedMonthIndex]);

//   return (
//     <section className="mt-6 space-y-4">
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-800">
//               📈 Profit & Amount Chart
//             </h3>
//             <p className="text-xs text-slate-500 mt-1">
//               শুধু Year সিলেক্ট করলেই সব মাসে কত জমা আর কত লাভ হয়েছে দেখাবে।
//             </p>
//           </div>
//         </div>

//         {!hasData ? (
//           <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
//             <p className="text-sm text-slate-500">কোনো ডাটা পাওয়া যায়নি।</p>
//           </div>
//         ) : (
//           <>
//             <div className="mt-4">
//               <Line options={chartOptions} data={chartData} />
//             </div>

//             {/* mini summary (rows বাদ) */}
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//                 <p className="text-xs text-slate-500">Total weight</p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   {formatNumber(totals.weight)}
//                 </p>
//               </div>
//               <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//                 <p className="text-xs text-slate-500">Total amount</p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   ৳ {formatMoney(totals.amount)}
//                 </p>
//               </div>
//               <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//                 <p className="text-xs text-slate-500">Total profit</p>
//                 <p className="text-lg font-semibold text-slate-800">
//                   ৳ {formatMoney(totals.profit)}
//                 </p>
//               </div>
//             </div>

//             {/* table (rows বাদ, weight যোগ) */}
//             <div className="mt-5 overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-900 text-white">
//                     <th className="px-3 py-2 text-left">Month</th>
//                     <th className="px-3 py-2 text-right">
//                       Investment Amount (জমা)
//                     </th>
//                     <th className="px-3 py-2 text-right">Personal Weight</th>

//                     <th className="px-3 py-2 text-right">Total Weight</th>

//                     <th className="px-3 py-2 text-right">Percent (%)</th>
//                     <th className="px-3 py-2 text-right">
//                       Generated Profit (লাভ)
//                     </th>
//                     <th className="px-3 py-2 text-right">
//                       Company Profit (50%)
//                     </th>
//                     <th className="px-3 py-2 text-right">
//                       Investors Profit (50%)
//                     </th>
//                     <th className="px-3 py-2 text-right">
//                       {" "}
//                       Personal Profit (নিজস্ব লাভ)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleMonthly.map((m) => (
//                     <tr
//                       key={m.monthIndex}
//                       className="border-b border-slate-100 hover:bg-slate-50"
//                     >
//                       <td className="px-3 py-2 text-left">{m.monthName}</td>

//                       {/* 🔥 Running Investment */}
//                       <td className="px-3 py-2 text-right">
//                         ৳ {formatMoney(m.activeAmount)}
//                       </td>

//                       {/* Weight */}
//                       <td className="px-3 py-2 text-right">
//                         {formatNumber(m.personalWeight)}
//                       </td>
//                       {/* Weight */}
//                       <td className="px-3 py-2 text-right">
//                         {formatNumber(m.totalWeight)}
//                       </td>

//                       {/* Percent */}
//                       <td className="px-3 py-2 text-right">
//                         {formatMoney(m.totalPercent)} %
//                       </td>

//                       {/* Profit */}
//                       <td className="px-3 py-2 text-right">
//                         ৳ {formatMoney(m.generatedProfit)}
//                       </td>
//                       <td className="px-3 py-2 text-right">
//                         ৳ {formatMoney(m.companyProfit)}
//                       </td>
//                       <td className="px-3 py-2 text-right">
//                         ৳ {formatMoney(m.investorsProfit)}
//                       </td>
//                       <td className="px-3 py-2 text-right">
//                         ৳ {formatMoney(m.personalProfit)}
//                       </td>
//                     </tr>
//                   ))}

//                   <tr className="bg-slate-100 font-semibold">
//                     <td className="px-3 py-2 text-left">Grand Total</td>

//                     <td className="px-3 py-2 text-right">
//                       ৳ {formatMoney(totals.amount)}
//                     </td>

//                     <td className="px-3 py-2 text-right">
//                       {formatNumber(totals.weight)}
//                     </td>
//                     <td className="px-3 py-2 text-right">
//                       {formatNumber(totals.companyWeight)}
//                     </td>

//                     <td></td>
//                     <td className="px-3 py-2 text-right">
//                       {formatNumber(totals.generatedProfit)}
//                     </td>

//                     <td className="px-3 py-2 text-right">
//                       ৳ {formatMoney(totals.profit)}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ProfitChart;

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
   payments = [],
    selectedCard = null, 
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
const depositMap = useMemo(() => {
  const map = {};

(payments || []).forEach((p) => {

  // ✅ ONLY SELECTED CARD
  if (Number(p.investment_card_no) !== Number(selectedCard?.id)) return;

  const date = new Date(p.payment_date || p.investment_date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const key = `${year}-${month}`;

  if (!map[key]) map[key] = 0;

  map[key] += toNumber(p.amount);
});

  return map;
}, [payments]);
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
      // item.totalAmount += toNumber(p.deposit_amount);
      // item.totalAmount += toNumber(p.card_investment_amount);
      const depositKey = `${year}-${month}`;
item.totalAmount = depositMap[depositKey] || 0;
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

  // 🔥 FIXED CONDITION
  if (activeYear !== "all" && Number(p.profit_year) !== Number(activeYear)) return;

  if (activeMonth && Number(p.profit_month) !== activeMonth) return;

  const m = Number(p.profit_month);
  if (!m || m < 1 || m > 12) return;

  const key = `${p.profit_year}-${m}`; // 🔥 also fix this

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
const depositKey = `${p.profit_year}-${p.profit_month}`;
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

const previousBalance = useMemo(() => {
  if (activeYear === "all") return 0;

  const prevMonths = [];

  // আগের সব বছরের data collect
  (profits || []).forEach((p) => {
    const year = Number(p.profit_year);
    const month = Number(p.profit_month);

    if (year < Number(activeYear)) {
      prevMonths.push({
        year,
        month,
        profit: toNumber(p.profit_amount),
        deposit: depositMap[`${year}-${month}`] || 0,
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
// const monthlyWithActiveAmount = useMemo(() => {
// let balance = previousBalance;
//   return monthly.map((m, index) => {
//     const profit = m.personalProfit;

//     let deposit = 0;

//     if (index === 0) {
//       // first month → শুধু real deposit
//       deposit = m.totalAmount;
//       balance = deposit;
//     } else {
//       const prevProfit = monthly[index - 1].personalProfit;
//       const currentDeposit = m.totalAmount;

//       // 🔥 FINAL FIX
//       deposit = prevProfit + currentDeposit;

//       // 🔥 balance update
//       balance = balance + deposit;
//     }

//     return {
//       ...m,
//       deposit,
//       activeAmount: balance,
//     };
//   });
// }, [monthly]);



// const monthlyWithActiveAmount = useMemo(() => {
//   let balance = previousBalance;

//   return monthly.map((m, index) => {
//     const profit = m.personalProfit;

//     let deposit = 0;

//     if (index === 0) {
//       deposit = m.totalAmount;

//       // ✅ FIXED (carry forward থাকবে)
//       balance = balance + deposit;
//     } else {
//       const prevProfit = monthly[index - 1].personalProfit;
//       const currentDeposit = m.totalAmount;

//       deposit = prevProfit + currentDeposit;

//       balance = balance + deposit;
//     }

//     return {
//       ...m,
//       deposit,
//       activeAmount: balance,
//     };
//   });
// }, [monthly, previousBalance]);


// const monthlyWithActiveAmount = useMemo(() => {
//   let balance = previousBalance;

//   return monthly.map((m, index) => {
//     const profit = m.personalProfit;

//     // ✅ নিজের জমা
//     const selfDeposit = m.totalAmount;

//     // ✅ আগের মাসের লাভ carry
//     const profitCarry =
//       index === 0 ? 0 : monthly[index - 1].personalProfit;

//     // ✅ total deposit
//     const deposit = selfDeposit + profitCarry;

//     // ✅ balance update
//     balance = balance + deposit;

//     return {
//       ...m,

//       selfDeposit,
//       profitCarry,

//       deposit,
//       activeAmount: balance,
//     };
//   });
// }, [monthly, previousBalance]);


const monthlyWithActiveAmount = useMemo(() => {
  let balance = previousBalance;

  // ✅ last profit from previous year
  const previousYearProfit = profits
    .filter(
      (p) =>
        Number(p.profit_year) < Number(activeYear)
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

    // ✅ first month → show last year profit
    else {
      profitCarry = previousYearProfitAmount;
    }

    const deposit = selfDeposit + profitCarry;
const weightBreakdown = (payments || [])
  .filter((p) => {

    // ✅ only selected card
    if (
      Number(p.investment_card_no) !== Number(selectedCard?.id)
    ) {
      return false;
    }

    const d = new Date(
      p.payment_date || p.investment_date
    );

    return (
      d.getFullYear() === Number(m.year) &&
      d.getMonth() + 1 === Number(m.monthIndex)
    );
  })
  .map((p) => {

    const investDate = new Date(
      p.payment_date || p.investment_date
    );

    // 🔥 next month first date
    const endExclusive = new Date(
      Number(m.year),
      Number(m.monthIndex),
      1
    );

    const days = Math.floor(
      (endExclusive - investDate) / 86400000
    );

    const amount = toNumber(p.amount);

    return {
      date: investDate.toISOString().split("T")[0],
      amount,
      days,
      weight: amount * days,
    };
  });
    // ✅ IMPORTANT:
    // first month এ carry already previousBalance এ আছে
    // তাই আবার add হবে না
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
}, [monthly, previousBalance, profits, activeYear]);
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
    }
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
