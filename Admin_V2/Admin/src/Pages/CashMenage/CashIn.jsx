import React, { useState } from "react";
import useCashReports from "../../utils/Hooks/cash/useCashReports";
import Loader from "../../components/Loader/Loader";
import CashStateCard from "../../components/cash/CashStateCard";
import CashInModal from "../../components/cash/CashInModal";

const CashIn = () => {
  const { CashReports, isCashReportsError, isCashReportsLoading,refetch } =
    useCashReports();
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
    const [openCashInModal , setOpenCashInModal] = useState(false);
const [priceRange, setPriceRange] = useState({
  min: 0,
  max: 10000,
});
const AllCashIn = Array.isArray(CashReports)
  ? CashReports.filter(
      (cash) =>
        cash.type === "in" &&
        cash.approval_status === "approved"
    )
  : [];
  // category bangla
  const categoryName = (category) => {
    switch (category) {
      case "invest":
        return "বিনিয়োগ";

      case "installment":
        return "কিস্তি";

      case "downpayment":
        return "ডাউন পেমেন্ট";

      case "loan":
        return "লোন";
        case "daily-installment":
          return "দৈনিক কিস্তি"
case "loan-return":
  return "লোন ফেরত";
      default:
        return "অন্যান্য";
    }
  };

  // category style
  const categoryStyle = (category) => {
    switch (category) {
      case "invest":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";

      case "installment":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "downpayment":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      case "loan":
        return "bg-red-500/20 text-red-400 border border-red-500/20";
case "loan-return":
  return "bg-pink-500/20 text-pink-400 border border-pink-500/20";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/20";
    }
  };
  const currentYear = new Date().getFullYear();

  const years = [];

  for (let year = 2025; year <= currentYear; year++) {
    years.push(year);
  }
  const DateFilteredCashIn = AllCashIn.filter((cash) => {
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
const FilteredCashIn = DateFilteredCashIn.filter((cash) => {

  if (selectedCategory) {

    // others
    if (selectedCategory === "others") {

      const knownCategories = [
        "invest",
        "installment",
        "downpayment",
        "loan",
      ];

      if (knownCategories.includes(cash.category)) {
        return false;
      }

    } else if (
      cash.category?.toLowerCase().trim() !== selectedCategory
    ) {
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
const SummaryCashIn = DateFilteredCashIn.filter((cash) => {
  const amount = Number(cash.amount);

  return (
    amount >= priceRange.min &&
    amount <= priceRange.max
  );
});
  // total cash in
  const totalCashIn = SummaryCashIn.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  // category totals
  const investTotal = SummaryCashIn.filter(
    (item) => item.category === "invest",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const installmentTotal = SummaryCashIn.filter(
    (item) => item.category === "installment",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const downpaymentTotal = SummaryCashIn.filter(
    (item) => item.category === "downpayment",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const loanTotal = SummaryCashIn.filter(
    (item) => item.category === "loan",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const dailyInstallmentsTotal = SummaryCashIn.filter(
    (item) => item.category === "daily-installment",
  ).reduce((sum, item) => sum + Number(item.amount), 0);
const loanReturnTotal = SummaryCashIn.filter(
  (item) => item.category === "loan-return",
).reduce((sum, item) => sum + Number(item.amount), 0);
  const otherTotal = SummaryCashIn.filter(
    (item) =>
      !["invest", "installment", "downpayment", "loan","daily-installment","loan-return"].includes(item.category),
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  if (isCashReportsLoading || isCashReportsError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );

  return (
    <div className=" min-h-screen text-white">
      {/* header */}
<div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-bold text-white">
      Cash In Report
    </h2>

    <p className="text-gray-400 text-sm mt-1">
      সকল ক্যাশ ইন লেনদেনের তালিকা
    </p>
  </div>

  {/* add button */}
  <button
    onClick={() => setOpenCashInModal(true)}
    className="bg-green-500 hover:bg-green-600 transition px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg"
  >
  💰 Add Cash In
  </button>
</div>
      {/* filters */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-4 md:p-5 mb-5 mt-2">
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
        {/* clear */}
        <div className="mt-4">
          <button
            onClick={() => {
              setSelectedDate("");
              setSelectedMonth("");
              setSelectedYear("");
              setStartDate("");
              setEndDate("");
              setPriceRange({
  min: 0,
  max: 1000000000,
});
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
          title="  Total Cash In"
          amount={totalCashIn}
          icon="💰"
          border="border-green-500/20"
          text="text-green-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("")}
        />
        <CashStateCard
          title="Transactions"
          amount={FilteredCashIn.length}
          icon="📊"
          border="border-gray-800"
          text=" text-cyan-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("")}
        />
        <CashStateCard
          title="Investment"
          amount={investTotal}
          icon="💵"
          border="border-blue-500/20"
          text=" text-blue-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("invest")}
        />
        <CashStateCard
          title="Installment"
          amount={installmentTotal}
          icon="📈"
          border="border-green-500/20"
          text=" text-green-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("installment")}
        />
        <CashStateCard
          title="Down Payment"
          amount={downpaymentTotal}
          icon="🏦"
          border="border-yellow-500/20"
          text=" text-yellow-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("downpayment")}
        />
        <CashStateCard
          title="Daily Installment"
          amount={dailyInstallmentsTotal}
          icon="🏦"
          border="border-cyan-500/20"
          text=" text-cyan-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("daily-installment")}
        />
        <CashStateCard
          title="Loan"
          amount={loanTotal}
          icon="💳"
          border="border-red-500/20"
          text=" text-red-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("loan")}
        />
        <CashStateCard
  title="Loan Return"
  amount={loanReturnTotal}
  icon="💵"
  border="border-pink-500/20"
  text=" text-pink-400"
  bg="bg-[#111827]"
  onClick={() => setSelectedCategory("loan-return")}
/>
        <CashStateCard
          title="Others"
          amount={otherTotal}
          icon="📦"
          border="border-gray-500/20"
          text=" text-gray-400"
          bg="bg-[#111827]"
          onClick={() => setSelectedCategory("others")}
        />
      </div>

      {/* table section */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Cash In Report</h2>

          <p className="text-gray-400 text-sm mt-1">
            সকল ক্যাশ ইন লেনদেনের তালিকা
          </p>
        </div>

        {/* table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
          <table className="w-full">
            <thead className="bg-[#1f2937] text-gray-300 text-xs md:text-sm">
              <tr>
                <th className="px-5 py-4 text-left">#</th>

                <th className="px-5 py-4 text-left">Source</th>

                <th className="px-5 py-4 text-left">Category</th>

                <th className="px-5 py-4 text-left">Amount</th>

                <th className="px-5 py-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {FilteredCashIn.map((cash, index) => (
                <tr
                  key={cash.id}
                  className="border-t border-gray-800 hover:bg-[#1e293b] transition duration-200"
                >
                  {/* serial */}
                  <td className="px-4 md:py-3 py-2 text-gray-300 font-medium">
                    {FilteredCashIn.length - index}
                  </td>

                  {/* source */}
                  <td className="px-4 md:py-3 py-2">
                    <p className="font-medium text-white text-xs md:text-sm whitespace-nowrap">
                      {" "}
                      {cash.source || "N/A"}
                    </p>
                  </td>

                  {/* category */}
                  <td className="px-4 md:py-3 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle(
                        cash.category,
                      )}`}
                    >
                      {categoryName(cash.category)}
                    </span>
                  </td>

                  {/* amount */}
                  <td className="px-4 md:py-3 py-2">
                    <span className="bg-green-500/20 text-green-400 border border-green-500/20 md:px-4 md:py-1 px-3 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap">
                      ৳ {Number(cash.amount).toLocaleString()}
                    </span>
                  </td>

                  {/* date */}
                  <td className="px-4 md:py-3 py-2 whitespace-nowrap">
                    {" "}
                    {cash.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
            <CashInModal openCashInModal ={openCashInModal } onClose={() => setOpenCashInModal(false)} />

    </div>
  );
};

export default CashIn;
