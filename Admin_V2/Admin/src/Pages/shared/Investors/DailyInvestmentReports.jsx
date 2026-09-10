import React, { useState, useMemo } from "react";
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

const DailyInvestmentReports = () => {
  const { users, isUsersLoading } = useUsers();
  const { investInstallments, inInvestInstallmentsLoading } =
    useInvestInstallment();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  /* 🧠 users map (id → name) */
  const usersMap = useMemo(() => {
    return (
      users?.reduce((acc, u) => {
        acc[u.id] = u.name;
        return acc;
      }, {}) || {}
    );
  }, [users]);
const getShortName = (name = "") => {
  return name
    .replace(/^(মোঃ|মো:|মো|মোহাম্মদ|Md\.?|MD\.?|Mohammad|Mohammed)\s*/i, "")
    .trim();
};
  const filteredData = useMemo(() => {
    if (!investInstallments?.length) return [];
    return investInstallments
      .filter(
        (item) =>
          item.investment_date?.slice(0, 10) === date &&
          Number(item.investment_card_no) !== 1,
      )

      .sort((a, b) => a.investor_id - b.investor_id)
      .map((item) => ({
        id: item.id,
        investorId: item.investor_id,
        investorName: usersMap[item.investor_id] || "Unknown",
        slip: item.investment_no,
        amount: Number(item.amount),
collector: getShortName(usersMap[item.signature_by] || "Unknown"),
     updatedBy: getShortName(usersMap[item.updated_by]),
        updatedAt: item.updated_at,
        updateReason: item.update_reason,
      }));
  }, [investInstallments, date, usersMap]);

  /* 💰 total amount (dynamic) */
  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }, [filteredData]);

  if (isUsersLoading || inInvestInstallmentsLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <main className="bg-slate-900 text-slate-200 p-6">
      <BackButton />
      {/* Header */}
      <header className="flex flex-col py-5 md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            দৈনিক বিনিয়োগ সংগ্রহ রিপোর্ট
          </h1>
          <p className="text-sm text-slate-400">তারিখ: {toYYMMDD(date)}</p>
        </div>

        {/* Date Filter */}
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 date-fix rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm"
          >
            প্রিন্ট
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl shadow overflow-x-scroll">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">গ্রাহকের নাম (ID)</th>
              <th className="px-4 py-3 text-left">স্লিপ নং</th>
              <th className="px-4 py-3 text-left">টাকা (৳)</th>
              <th className="px-4 py-3 text-left">সংগ্রহকারী</th>
              <th className="px-4 py-3 text-left">Updated By</th>
              <th className="px-4 py-3 text-left">Updated At</th>
              <th className="px-4 py-3 text-left">Reason</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-slate-400">
                  এই তারিখে কোন ডাটা নেই
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {row.investorName} ({row.investorId})
                  </td>
                  <td className="px-4 py-3">{row.slip}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">
                    {row.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 capitalize">{row.collector}</td>
                  <td className="px-4 py-3">{row.updatedBy || "-"}</td>

                  <td className="px-4 py-3 text-xs">{row.updatedAt || "-"}</td>

                  <td className="px-4 py-3">{row.updateReason || "-"}</td>
                </tr>
              ))
            )}
          </tbody>

          {/* Footer total */}
          {filteredData.length > 0 && (
            <tfoot className="bg-slate-700">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right font-semibold">
                  মোট
                </td>
                <td className="px-4 py-3 font-bold text-emerald-400">
                  {totalAmount.toFixed(2)}
                </td>
                <td />
                <td />
                <td />
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </main>
  );
};

export default DailyInvestmentReports;
