import React, { useState } from "react";
import useCashReports from "../../utils/Hooks/cash/useCashReports";
import Loader from "../../components/Loader/Loader";
import CashStateCard from "../../components/cash/CashStateCard";
import CashOutModal from "../../components/cash/CashOutModal";
import EditCashModal from "../../components/cash/EditCashModal";
import DeleteCashModal from "../../components/cash/DeleteCashModal";
import CashHistoryModal from "../../components/cash/CashHistoryModal";
import { FaEdit, FaTrashAlt, FaHistory } from "react-icons/fa";

const CashOut = () => {
  const { CashReports, isCashReportsError, isCashReportsLoading, refetch } =
    useCashReports();
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedRemark, setSelectedRemark] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [openCashOutModal, setOpenCashOutModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000,
  });  // only cash out
  const normalCashOut = Array.isArray(CashReports)
    ? CashReports.filter(
      (cash) =>
        cash.type === "out" &&
        cash.approval_status === "approved"
    )
    : [];
  const AllCashOut = [...normalCashOut].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  const currentYear = new Date().getFullYear();

  const years = [];

  for (let year = 2025; year <= currentYear; year++) {
    years.push(year);
  }
  const DateFilteredCashOut = AllCashOut.filter((cash) => {
    const cashDate = new Date(cash.date);

    const cashYear = cashDate.getFullYear().toString();

    const cashMonth = `${cashDate.getFullYear()}-${String(
      cashDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    // single day
    if (selectedDate && cash.date !== selectedDate) {
      return false;
    }

    // month
    if (selectedMonth && cashMonth !== selectedMonth) {
      return false;
    }

    // year
    if (selectedYear && cashYear !== selectedYear) {
      return false;
    }

    // range
    if (startDate && endDate) {
      const current = new Date(cash.date).getTime();

      const start = new Date(startDate).getTime();

      const end = new Date(endDate).getTime();

      if (current < start || current > end) {
        return false;
      }
    }

    return true;
  });
  const FilteredCashOut = AllCashOut.filter((cash) => {
    const cashDate = new Date(cash.date);

    const cashYear = cashDate.getFullYear().toString();

    const cashMonth = `${cashDate.getFullYear()}-${String(
      cashDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    // single day
    if (selectedDate && cash.date !== selectedDate) {
      return false;
    }

    // month
    if (selectedMonth && cashMonth !== selectedMonth) {
      return false;
    }

    // year
    if (selectedYear && cashYear !== selectedYear) {
      return false;
    }

    // range
    if (startDate && endDate) {
      const current = new Date(cash.date).getTime();

      const start = new Date(startDate).getTime();

      const end = new Date(endDate).getTime();

      if (current < start || current > end) {
        return false;
      }
    }

    if (selectedCategory) {
      // others
      if (selectedCategory === "others") {
        const knownCategories = [
          "salary",
          "purchase",
          "rent",
          "bill",
          "office-expense",
          "loan-repayment",
          "transport",
          "marketing",
          "maintenance",
          "utility",
          "equipment",
          "food",
          "internet",
          "investor-payout",
          "profit-payout",
        ];

        if (knownCategories.includes(cash.category)) {
          return false;
        }
      } else if (cash.category?.toLowerCase().trim() !== selectedCategory) {
        return false;
      }
    }


    const amount = Number(cash.amount);

    if (
      amount < priceRange.min ||
      amount > priceRange.max
    ) {
      return false;
    }
    return true;
  });

  const SummaryCashOut = DateFilteredCashOut.filter((cash) => {
    const amount = Number(cash.amount);

    return (
      amount >= priceRange.min &&
      amount <= priceRange.max
    );
  });
  // total
  const totalCashOut = SummaryCashOut.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  // category totals
  const salaryTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "salary",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const purchaseTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "purchase",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const rentTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "rent",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const billTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "bill",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const officeExpenseTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "office-expense",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const loanRepaymentTotal = SummaryCashOut.filter(
    (item) => item.category?.trim() === "loan-repayment",
  ).reduce((sum, item) => sum + Number(item.amount), 0);
  const investorPayoutTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "investor-payout",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const profitPayoutTotal = SummaryCashOut.filter(
    (item) => item.category?.toLowerCase().trim() === "profit-payout",
  ).reduce((sum, item) => sum + Number(item.amount), 0);
  const loanGivenTotal = SummaryCashOut.filter(
    (item) => item.category?.trim() === "loan-given",
  ).reduce((sum, item) => sum + Number(item.amount), 0);
  const otherTotal = SummaryCashOut.filter(
    (item) =>
      ![
        "salary",
        "purchase",
        "rent",
        "bill",
        "office-expense",
        "loan-repayment",
        "loan-given",
        "investor-payout",
        "profit-payout",
      ].includes(item.category),
  ).reduce((sum, item) => sum + Number(item.amount), 0);
  // category bangla
  const categoryName = (category) => {
    switch (category) {
      case "salary":
        return "বেতন";

      case "purchase":
        return "কেনাকাটা";

      case "rent":
        return "ভাড়া";

      case "bill":
        return "বিল";

      case "office-expense":
        return "অফিস খরচ";

      case "loan-repayment":
        return "লোন পরিশোধ";

      case "investor-payout":
        return "ইনভেস্টর পেআউট";

      case "profit-payout":
        return "প্রফিট পেআউট";

      case "loan-given":
        return "লোন প্রদান";
      default:
        return "অন্যান্য";
    }
  };
  // category style
  const categoryStyle = (category) => {
    switch (category) {
      case "salary":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";

      case "purchase":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "rent":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      case "bill":
        return "bg-red-500/20 text-red-400 border border-red-500/20";

      case "office-expense":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/20";

      case "loan-repayment":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20";
      case "investor-payout":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/20";

      case "profit-payout":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20";
      case "loan-given":
        return "bg-pink-500/20 text-pink-400 border border-pink-500/20";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/20";
    }
  };

  if (isCashReportsLoading || isCashReportsError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen text-white">
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Cash Out Report</h2>

          <p className="text-gray-400 text-sm mt-1">সকল ক্যাশ আউট এর তালিকা</p>
        </div>

        {/* add button */}
        <button
          onClick={() => setOpenCashOutModal(true)}
          className="bg-green-500 hover:bg-green-600 transition px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg"
        >
          💰 Add Cash Out
        </button>
      </div>
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-4 md:p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* single date */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              নির্দিষ্ট দিন
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 date-fix"
            />
          </div>

          {/* month */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              মাস নির্বাচন
            </label>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 date-fix"
            />
          </div>

          {/* year */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              বছর নির্বাচন
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 text-white"
            >
              <option value="">সকল বছর</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* start */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              শুরুর তারিখ
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 date-fix"
            />
          </div>

          {/* end */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              শেষ তারিখ
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 date-fix"
            />
          </div>
        </div>


        <div>
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <input
              type="number"
              placeholder="Min ৳"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value) || 0,
                }))
              }
              className="bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2 text-white"
            />

            <span className="hidden md:flex items-center text-gray-400">
              →
            </span>

            <input
              type="number"
              placeholder="Max ৳"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value) || 999999999,
                }))
              }
              className="bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2 text-white"
            />
          </div>
        </div>

        {/* clear */}
        <div className="mt-4">
          <button
            onClick={() => {
              setSelectedDate("");
              setSelectedMonth("");
              setSelectedYear("");
              setStartDate("");
              setEndDate("");
            }}
            className="bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-500/30 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {/* top cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4 mb-5">
        <CashStateCard
          title="Total Cash Out"
          amount={totalCashOut}
          icon="💸"
          border="border-rose-500/30"
          text="text-rose-400"
          bg="bg-rose-500/20"
          onClick={() => setSelectedCategory("")}
        />
        <CashStateCard
          title="Transactions"
          amount={FilteredCashOut.length}
          prefix=""
          icon="📊"
          border="border-cyan-500/30"
          text="text-cyan-400"
          bg="bg-cyan-500/20"
          onClick={() => setSelectedCategory("")}
        />
        <CashStateCard
          title="Salary"
          amount={salaryTotal}
          icon="👨‍💼"
          border="border-blue-500/30"
          text="text-blue-400"
          bg="bg-blue-500/20"
          onClick={() => setSelectedCategory("salary")}
        />
        <CashStateCard
          title="Purchase"
          amount={purchaseTotal}
          icon="🛒"
          border="border-emerald-500/30"
          text="text-emerald-400"
          bg="bg-emerald-500/20"
          onClick={() => setSelectedCategory("purchase")}
        />
        <CashStateCard
          title="Rent"
          amount={rentTotal}
          icon="🏠"
          border="border-amber-500/30"
          text="text-amber-400"
          bg="bg-amber-500/20"
          onClick={() => setSelectedCategory("rent")}
        />
        <CashStateCard
          title="Bill"
          amount={billTotal}
          icon="⚡"
          border="border-rose-500/30"
          text="text-rose-400"
          bg="bg-rose-500/20"
          onClick={() => setSelectedCategory("bill")}
        />
        <CashStateCard
          title="Office Expenses"
          amount={officeExpenseTotal}
          icon="🏢"
          border="border-purple-500/30"
          text="text-purple-400"
          bg="bg-purple-500/20"
          onClick={() => setSelectedCategory("office-expense")}
        />
        <CashStateCard
          title="Loan Given"
          amount={loanGivenTotal}
          icon="🤝"
          border="border-pink-500/30"
          text="text-pink-400"
          bg="bg-pink-500/20"
          onClick={() => setSelectedCategory("loan-given")}
        />
        <CashStateCard
          title="Loan Repayment"
          amount={loanRepaymentTotal}
          icon="💳"
          border="border-cyan-500/30"
          text="text-cyan-400"
          bg="bg-cyan-500/20"
          onClick={() => setSelectedCategory("loan-repayment")}
        />
        <CashStateCard
          title="Investor Payout"
          amount={investorPayoutTotal}
          icon="💼"
          border="border-orange-500/30"
          text="text-orange-400"
          bg="bg-orange-500/20"
          onClick={() => setSelectedCategory("investor-payout")}
        />
        <CashStateCard
          title="Profit Payout"
          amount={profitPayoutTotal}
          icon="📈"
          border="border-emerald-500/30"
          text="text-emerald-400"
          bg="bg-emerald-500/20"
          onClick={() => setSelectedCategory("profit-payout")}
        />
        <CashStateCard
          title="Others"
          amount={otherTotal}
          icon="📦"
          border="border-slate-700"
          text="text-slate-300"
          bg="bg-slate-800"
          onClick={() => setSelectedCategory("others")}
        />
      </div>

      {/* table section */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        {/* header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Cash Out Report</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">
              সকল ক্যাশ আউট লেনদেনের তালিকা
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
            {FilteredCashOut.length} Records
          </span>
        </div>

        {/* table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap">#</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Purpose</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Amount</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Remarks</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-right">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-sm">
              {FilteredCashOut.map((cash, index) => {
                const historyList = (() => {
                  try {
                    const h = typeof cash.edit_history === "string" ? JSON.parse(cash.edit_history) : cash.edit_history;
                    return Array.isArray(h) ? h : [];
                  } catch (e) {
                    return [];
                  }
                })();
                const hasHistory = historyList.length > 0;
                const editCount = historyList.length;

                return (
                  <tr
                    key={cash.id}
                    className={`transition duration-150 ${
                      hasHistory
                        ? "bg-amber-500/[0.03] hover:bg-amber-500/[0.08] border-l-2 border-l-amber-500"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs whitespace-nowrap">
                      {FilteredCashOut.length - index}
                    </td>

                    <td className="px-5 py-3.5 font-medium text-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="whitespace-nowrap">
                          {cash.purpose || "N/A"}
                        </span>
                        {hasHistory && (
                          <button
                            onClick={() => setHistoryItem(cash)}
                            title={`সর্বশেষ কারণ: ${cash.last_edit_reason || "ইতিহাস দেখতে ক্লিক করুন"}`}
                            className="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 text-xs font-semibold shadow-sm shadow-amber-500/10 transition-all duration-200 cursor-pointer"
                          >
                            <FaHistory className="w-2.5 h-2.5 text-amber-400 group-hover:rotate-[-45deg] transition-transform duration-200" />
                            <span className="text-[11px] font-medium">
                              Edited ({editCount})
                            </span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center shrink-0 ${categoryStyle(
                          cash.category,
                        )}`}
                      >
                        {categoryName(cash.category)}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap font-mono tabular-nums inline-block">
                        ৳ {Number(cash.amount).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 max-w-[180px]">
                      <p
                        onClick={() => setSelectedRemark(cash.remarks)}
                        className="truncate text-xs md:text-sm text-slate-300 cursor-pointer hover:text-indigo-300 transition"
                      >
                        {cash.remarks || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 text-xs font-mono">
                      {cash.date}
                    </td>

                    {/* actions */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {hasHistory && (
                          <button
                            onClick={() => setHistoryItem(cash)}
                            title="সম্পাদনার ইতিহাস দেখুন"
                            className="relative p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition duration-150 cursor-pointer"
                          >
                            <FaHistory className="w-3.5 h-3.5" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => setEditItem(cash)}
                          title="এডিট করুন"
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 hover:text-indigo-300 text-slate-400 border border-slate-700/80 transition duration-150"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(cash)}
                          title="মুছে ফেলুন"
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition duration-150"
                        >
                          <FaTrashAlt className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRemark && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-white font-semibold text-lg">
                Remarks
              </h2>

              <button
                onClick={() => setSelectedRemark("")}
                className="text-gray-400 hover:text-red-400 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-300 mt-4 break-words leading-relaxed">
              {selectedRemark}
            </p>
          </div>
        </div>
      )}

      <CashOutModal
        openCashOutModal={openCashOutModal}
        onClose={() => setOpenCashOutModal(false)}
      />

      {/* Edit Modal */}
      <EditCashModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        onSuccess={refetch}
      />

      {/* Delete Modal */}
      <DeleteCashModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        item={deleteItem}
        onSuccess={refetch}
      />

      {/* History Modal */}
      <CashHistoryModal
        isOpen={!!historyItem}
        onClose={() => setHistoryItem(null)}
        item={historyItem}
      />
    </div>
  );
};

export default CashOut;
