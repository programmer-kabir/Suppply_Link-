import React, { useState } from "react";
import useCashReports from "../../utils/Hooks/cash/useCashReports";
import Loader from "../../components/Loader/Loader";
import CashStateCard from "../../components/cash/CashStateCard";
import CashOutModal from "../../components/cash/CashOutModal";

const CashOut = () => {
  const { CashReports, isCashReportsError, isCashReportsLoading } =
    useCashReports();
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedRemark, setSelectedRemark] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [openCashOutModal, setOpenCashOutModal] = useState(false);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 md:gap-4 mb-5">
        <CashStateCard
          title="Total Cash Out"
          amount={totalCashOut}
          icon="💸"
          border="border-red-500/20"
          text="text-red-400"
          bg="bg-red-500/20"
          onClick={() => setSelectedCategory("")}
        />
        <CashStateCard
          title="Transactions"
          amount={FilteredCashOut.length}
          icon="📊"
          border="border-gray-800"
          text="text-cyan-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("")}
        />
        <CashStateCard
          title="Salary"
          amount={salaryTotal}
          icon="👨‍💼"
          border="border-blue-500/20"
          text="text-blue-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("salary")}
        />
        <CashStateCard
          title="Purchase"
          amount={purchaseTotal}
          icon=" 🛒"
          border="border-green-500/20"
          text="text-green-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("purchase")}
        />
        <CashStateCard
          title="Rent"
          amount={rentTotal}
          icon=" 🏠"
          border="border-yellow-500/20"
          text="text-yellow-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("rent")}
        />
        <CashStateCard
          title="Bill"
          amount={billTotal}
          icon=" ⚡"
          border="border-red-500/20"
          text="text-red-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("bill")}
        />
        <CashStateCard
          title="Office Expenses"
          amount={officeExpenseTotal}
          icon=" 🏢"
          border="border-purple-500/20"
          text="text-purple-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("office-expense")}
        />
        <CashStateCard
          title="Loan Given"
          amount={loanGivenTotal}
          icon="🤝"
          border="border-pink-500/20"
          text="text-pink-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("loan-given")}
        />
        <CashStateCard
          title="Lone Repayment"
          amount={loanRepaymentTotal}
          icon="💳"
          border="border-cyan-500/20"
          text="text-cyan-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("loan-repayment")}
        />
        <CashStateCard
          title=" Investor Payout"
          amount={investorPayoutTotal}
          icon="💼"
          border="border-orange-500/20"
          text="text-orange-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("investor-payout")}
        />
        <CashStateCard
          title="Profit Payout"
          amount={profitPayoutTotal}
          icon="📈"
          border="border-emerald-500/20"
          text="text-emerald-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("profit-payout")}
        />
        <CashStateCard
          title="Others"
          amount={otherTotal}
          icon="📦"
          border="border-gray-500/20"
          text="text-gray-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("others")}
        />
      </div>

      {/* table section */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Cash Out Report</h2>

          <p className="text-gray-400 text-sm mt-1">
            সকল ক্যাশ আউট লেনদেনের তালিকা
          </p>
        </div>

        {/* table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
          <table className="w-full">
            <thead className="bg-[#1f2937] text-gray-300 text-xs md:text-sm">
              <tr>
                <th className="px-5 py-4 text-left">#</th>

                <th className="px-5 py-4 text-left">Purpose</th>

                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-left">Amount</th>
                <th className="px-5 py-4 text-left">Remarks</th>

                <th className="px-5 py-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {FilteredCashOut.map((cash, index) => (
                <tr
                  key={cash.id}
                  className="border-t border-gray-800 hover:bg-[#1e293b] transition duration-200"
                >
                  <td className="px-4 md:py-3 py-2 text-gray-300 font-medium">
                    {FilteredCashOut.length - index}
                  </td>

                  <td className="px-4 md:py-3 py-2">
                    <p className="font-medium text-white text-xs md:text-sm whitespace-nowrap">
                      {cash.purpose || "N/A"}
                    </p>
                  </td>

                  <td className="px-4 md:py-3 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle(
                        cash.category,
                      )}`}
                    >
                      {categoryName(cash.category)}
                    </span>
                  </td>

                  <td className="px-4 md:py-3 py-2">
                    <span className="bg-red-500/20 text-red-400 border border-red-500/20 md:px-4 md:py-1 px-3 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap">
                      ৳ {Number(cash.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 md:py-3 py-2 max-w-[180px]">
                    <p
                      onClick={() => setSelectedRemark(cash.remarks)}
                      className="truncate text-xs md:text-sm text-gray-300 cursor-pointer"
                    >
                      {cash.remarks}
                    </p>
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
                  </td>

                  <td className="px-4 md:py-3 py-2 whitespace-nowrap text-gray-400">
                    {cash.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CashOutModal
        openCashOutModal={openCashOutModal}
        onClose={() => setOpenCashOutModal(false)}
      />
    </div>
  );
};

export default CashOut;
