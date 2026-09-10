import React, { useMemo, useState } from "react";
import { MONTHS } from "../../../../public/month"; // path adjust if needed

const selectCls =
  "h-10 rounded bg-[#071025] px-3 text-sm text-white/80 border border-white/10 outline-none hover:border-white/20";
const inputCls =
  "h-10 rounded bg-[#071025] px-3 text-sm text-white/80 border border-white/10 outline-none hover:border-white/20";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const getYMD = (d) => {
  if (!d) return "";
  // "2026-01-25 10:11:12" -> "2026-01-25"
  return String(d).slice(0, 10);
};

const getMonth = (ymd) => {
  if (!ymd) return 0;
  const m = Number(String(ymd).split("-")[1] || 0);
  return Number.isFinite(m) ? m : 0;
};

const getYear = (ymd) => {
  if (!ymd) return 0;
  const y = Number(String(ymd).split("-")[0] || 0);
  return Number.isFinite(y) ? y : 0;
};

const formatBDT = (n) =>
  toNum(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ProductCalculator = ({ customerInstallmentCards = [] }) => {
  // ✅ filter states
  const [filterType, setFilterType] = useState("monthly"); // all | daily | monthly | yearly
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [profitYear, setProfitYear] = useState("");

  // ✅ build years list from data
  const years = useMemo(() => {
    const set = new Set();
    (customerInstallmentCards || []).forEach((c) => {
      const ymd = getYMD(
        c.created_at || c.delivery_date || c.first_installment_date,
      );
      const y = getYear(ymd);
      if (y) set.add(y);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [customerInstallmentCards]);

  // ✅ filtered rows
  const filteredCards = useMemo(() => {
    const rows = Array.isArray(customerInstallmentCards)
      ? customerInstallmentCards
      : [];

    return rows.filter((c) => {
      const ymd = getYMD(
        c.created_at || c.delivery_date || c.first_installment_date,
      );
      const y = getYear(ymd);
      const m = getMonth(ymd);

      // year filter (সব view এ apply হবে)
      if (profitYear && Number(profitYear) !== y) return false;

      if (filterType === "daily") {
        if (!selectedDate) return true; // date না দিলে সব
        return ymd === selectedDate;
      }

      if (filterType === "monthly") {
        if (!selectedMonth) return true; // month না দিলে সব
        return Number(selectedMonth) === m;
      }

      if (filterType === "yearly") {
        // yearly view এ year dropdown থাকেই, profitYear empty হলে সব বছর
        return true;
      }

      // all
      return true;
    });
  }, [
    customerInstallmentCards,
    filterType,
    selectedDate,
    selectedMonth,
    profitYear,
  ]);
  // ✅ total cost_price
  const totalCostPrice = useMemo(() => {
    return filteredCards.reduce((sum, c) => sum + toNum(c.cost_price), 0);
  }, [filteredCards]);


  return (
    <main className="p-6 text-slate-200">
      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap items-end gap-3 rounded bg-[#1A253A] p-4">
        {/* View */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">View</label>
          <select
            value={filterType}
            onChange={(e) => {
              const v = e.target.value;
              setFilterType(v);
              setSelectedDate("");
              setSelectedMonth("");
            }}
            className={selectCls}
          >
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Daily */}
        {filterType === "daily" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={inputCls + " dark:[color-scheme:dark]"}
            />
          </div>
        )}

        {/* Monthly */}
        {filterType === "monthly" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={selectCls}
            >
              <option value="">All months</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Year</label>
          <select
            value={profitYear}
            onChange={(e) => setProfitYear(e.target.value)}
            className={selectCls}
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setFilterType("monthly");
            setSelectedDate("");
            setSelectedMonth("");
            setProfitYear("");
          }}
          className="h-10 rounded bg-[#071025] px-4 text-sm text-white/80 hover:bg-white/10"
          type="button"
        >
          Reset
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-slate-800/60 border border-white/10 p-4">
          <p className="text-xs text-slate-400">Filtered Cards</p>
          <p className="text-2xl font-semibold">{filteredCards.length}</p>
        </div>

        <div className="rounded-xl bg-slate-800/60 border border-white/10 p-4">
          <p className="text-xs text-slate-400">Total Cost Price</p>
          <p className="text-2xl font-semibold text-emerald-400">
            ৳ {formatBDT(totalCostPrice)}
          </p>
        </div>
      </div>

      {/* ================= TABLE (optional) ================= */}
      <div className="mt-4 rounded-xl bg-slate-800/60 border border-white/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-700/60 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Card</th>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Cost Price (৳)</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-slate-400"
                  colSpan={5}
                >
                  No data
                </td>
              </tr>
            ) : (
              filteredCards.map((c, idx) => {
                const ymd = getYMD(
                  c.created_at || c.delivery_date || c.first_installment_date,
                );
                return (
                  <tr
                    key={c.id ?? idx}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{c.card_number}</td>
                    <td className="px-4 py-3">{c.user_id ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300">
                      {formatBDT(c.cost_price)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{ymd}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ProductCalculator;
