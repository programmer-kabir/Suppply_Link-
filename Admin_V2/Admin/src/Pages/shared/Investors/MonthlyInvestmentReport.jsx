import React, { useMemo, useState } from "react";
import useInvestInstallment from "../../../utils/Investors/useInvestInstallment";
import useUsers from "../../../utils/Hooks/useUsers";
import Loader from "../../../components/Loader/Loader";
import BackButton from "../../../components/BackButton/BackButton";

/* 🔁 yyyy-mm-dd → yy-mm-dd */
const toYYMMDD = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y.slice(2)}-${m}-${d}`;
};

const pad2 = (n) => String(n).padStart(2, "0");

const MonthlyInvestmentReport = () => {
  const { users, isUsersLoading } = useUsers();
  const { investInstallments, inInvestInstallmentsLoading } =
    useInvestInstallment();

  // ✅ default current month (yyyy-mm)
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  const [month, setMonth] = useState(defaultMonth);

  /* 🧠 users map (id → name) */
  const usersMap = useMemo(() => {
    return (
      users?.reduce((acc, u) => {
        acc[Number(u.id)] = u.name;
        return acc;
      }, {}) || {}
    );
  }, [users]);

  // ✅ month start date (yyyy-mm-01)
  const monthStart = useMemo(() => `${month}-01`, [month]);

  // ✅ Opening Balance = selected month-এর আগের সব জমা যোগফল
  const openingBalance = useMemo(() => {
    if (!investInstallments?.length) return 0;

    return investInstallments.reduce((sum, item) => {
          if (Number(item.investment_card_no) === 1) return sum; // ❌ বাদ

      const d = item.investment_date?.slice(0, 10); // yyyy-mm-dd
      if (!d) return sum;
      if (d < monthStart) return sum + Number(item.amount || 0);
      return sum;
    }, 0);
  }, [investInstallments, monthStart]);

  // ✅ monthly flat rows
  const monthlyRows = useMemo(() => {
    if (!investInstallments?.length) return [];

    return investInstallments
      .filter((item) => {
              if (Number(item.investment_card_no) === 1) return false; // ❌ বাদ
0
        const d = item.investment_date?.slice(0, 10);
        return d && d.slice(0, 7) === month; // yyyy-mm
      })
      .map((item) => ({
        id: item.id,
        date: item.investment_date?.slice(0, 10),
        investorId: Number(item.investor_id),
        investorName: usersMap[Number(item.investor_id)] || "Unknown",
        slip: item.investment_no,
        amount: Number(item.amount || 0),
        collector: item.signature_by || "",
      }));
  }, [investInstallments, month, usersMap]);

  // ✅ group by date + running total
  const dailySummary = useMemo(() => {
    const map = new Map();

    for (const r of monthlyRows) {
      if (!r.date) continue;

      if (!map.has(r.date)) {
        map.set(r.date, {
          date: r.date,
          uniqueInvestors: new Set(),
          dailyTotal: 0,
        });
      }

      const obj = map.get(r.date);
      obj.uniqueInvestors.add(r.investorId);
      obj.dailyTotal += r.amount;
    }

    const sorted = Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    let running = Number(openingBalance || 0);

    return sorted.map((d) => {
      const daily = Number(d.dailyTotal || 0);
      running += daily;

      return {
        date: d.date,
        investorsCount: d.uniqueInvestors.size,
        dailyTotal: daily,
        runningTotal: running,
      };
    });
  }, [monthlyRows, openingBalance]);

  const monthDepositTotal = useMemo(() => {
    return dailySummary.reduce((sum, d) => sum + Number(d.dailyTotal || 0), 0);
  }, [dailySummary]);

  const closingBalance = useMemo(() => {
    return Number(openingBalance || 0) + Number(monthDepositTotal || 0);
  }, [openingBalance, monthDepositTotal]);
  const BN_MONTHS = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const formatMonthLabelBN = (yyyyMM) => {
    if (!yyyyMM) return "";
    const [y, m] = yyyyMM.split("-");
    const idx = Number(m) - 1;
    const name = BN_MONTHS[idx] || yyyyMM;
    return `${name} ${y}`; // যেমন: মে 2025
  };

  if (isUsersLoading || inInvestInstallmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <main className="bg-slate-900 text-slate-200 px-6  py-2 print:p-0 print:bg-white print:text-black">
      {/* ✅ PRINT CSS */}
      <style>{`
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  @media print {
    :root{
      --tbl-font: 13px;        /* ✅ এখানে 11/12/13 করে ট্রাই করো */
      --cell-py: 6px;          /* ✅ row height control */
      --cell-px: 8px;
      --tbl-scale: 1;          /* ✅ overflow হলে 0.95/0.9 */
    }

    html, body {
      background: #fff !important;
      color: #000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    #root, #app, main, section, header, footer, div {
      background: #fff !important;
      color: #000 !important;
    }

    .bg-slate-900,
    .bg-slate-800,
    .bg-slate-700,
    .bg-black,
    .bg-gray-900,
    .bg-gray-800,
    .shadow {
      background: #fff !important;
      box-shadow: none !important;
    }

    .text-slate-200,
    .text-slate-300,
    .text-slate-400,
    .text-white {
      color: #000 !important;
    }

    .print-no-scroll {
      overflow: visible !important;
    }

    /* ✅ TABLE */
    table {
      width: 100% !important;
      overflow:hidden;
      border-collapse: collapse !important;
      font-size: var(--tbl-font) !important;
      background: #fff !important;
    }

    th, td {
      padding: var(--cell-py) var(--cell-px) !important;
      color: #000 !important;
      border-bottom: 1px solid #e5e7eb !important;
      line-height: 1 !important;
    }

    thead tr {
      background: #f3f4f6 !important;
      color: #000 !important;
    }

    .border-slate-700 {
      border-color: #e5e7eb !important;
    }

    .print-flat {
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    /* ✅ scale control (এক লাইনে fit করানোর জন্য) */
    .print-scale {
      transform: scale(var(--tbl-scale)) !important;
      transform-origin: top left;
    }

    tr, td, th {
      page-break-inside: avoid !important;
    }

    .hover\\:bg-slate-700\\/40 {
      background: transparent !important;
    }

    .print-hide {
      display: none !important;
    }
      @media print {
  .min-h-screen,
  .h-screen {
    min-height: auto !important;
    height: auto !important;
  }
}
  }
`}</style>

      {/* Header (hidden in print) */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-xl font-semibold">
              মাসিক বিনিয়োগ সংগ্রহ রিপোর্ট
            </h1>
            <p className="text-sm text-slate-400">মাস: {month}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm"
          >
            প্রিন্ট
          </button>
        </div>
      </header>

      {/* ✅ Print Header (visible only in print) */}
      <div className="hidden print:block mb-2 bg-white">
        <h1 className="text-lg font-bold">মাসিক বিনিয়োগ সংগ্রহ রিপোর্ট</h1>
        <p className="text-xs">
          মাস:{" "}
          <span className="font-semibold">{formatMonthLabelBN(month)}</span>
        </p>

        <div className="text-xs mt-1 flex gap-4">
          <span>
             জমা:{" "}
            <span className="font-semibold">
              {monthDepositTotal.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl shadow overflow-x-auto overflow-y-hidden print-no-scroll print-flat print-scale">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">ক্রমিক</th>
              <th className="px-4 py-3 text-left">তারিখ</th>
              <th className="px-4 py-3 text-left">ইনভেস্টর সংখ্যা</th>
              <th className="px-4 py-3 text-left">দৈনিক সংগ্রহ</th>
              <th className="px-4 py-3 text-left">এখন পর্যন্ত মোট</th>
            </tr>
          </thead>

          <tbody>
            {dailySummary.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-400">
                  এই মাসে কোন ডাটা নেই
                </td>
              </tr>
            ) : (
              dailySummary.map((d, index) => (
                <tr
                  key={d.date}
                  className="border-b border-slate-700 hover:bg-slate-700/40"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{toYYMMDD(d.date)}</td>
                  <td className="px-4 py-3">{d.investorsCount}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400 print:text-black">
                    {d.dailyTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-bold text-sky-300 print:text-black">
                    {d.runningTotal.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {dailySummary.length > 0 && (
            <tfoot className="bg-slate-700 text-slate-100 print:bg-gray-200 print:text-black">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right font-semibold">
                  এই মাসে মোট জমা
                </td>
                <td className="px-4 py-3 font-bold">
                  {monthDepositTotal.toFixed(2)}
                </td>
                <td className="px-4 py-3 font-bold">
                  {closingBalance.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </main>
  );
};

export default MonthlyInvestmentReport;
