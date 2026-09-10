import React from "react";
import Loader from "../../components/Loader/Loader";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,

  Legend,
} from "recharts";
import { MONTHS } from "../../../public/month";
import ChartCashReports from "../../components/cash/ChartCashReports";
import YearCashReport from "../../components/cash/YearCashReport";
import useCashReports from "../../utils/Hooks/cash/useCashReports";

const CashReport = () => {
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const { CashReports, isCashReportsError, isCashReportsLoading } =
    useCashReports();

  // cash out
  const AllCashOut = Array.isArray(CashReports)
    ? CashReports.filter((cash) => cash.type === "out")
    : [];

  // cash in
  const AllCashIn = Array.isArray(CashReports)
    ? CashReports.filter((cash) => cash.type === "in")
    : [];


  // years
  const currentYear = new Date().getFullYear();

  const years = [];

  for (let year = 2025; year <= currentYear; year++) {
    years.push(year);
  }

  // filter function
  const filterData = (cash) => {
    const cashDate = new Date(cash.date);

    const cashYear = cashDate.getFullYear().toString();

    const cashMonth = `${cashDate.getFullYear()}-${String(
      cashDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    // single date
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
  };

  // filtered
  const FilteredCashIn = AllCashIn.filter(filterData);

  const FilteredCashOut = AllCashOut.filter(filterData);

  // totals
  const totalCashIn = FilteredCashIn.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const totalCashOut = FilteredCashOut.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );


const currentBalance = (() => {
  // Month filter
  if (selectedMonth) {
    const endOfMonth = new Date(selectedMonth + "-01");
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const cashIn = AllCashIn
      .filter(item => new Date(item.date) < endOfMonth)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const cashOut = AllCashOut
      .filter(item => new Date(item.date) < endOfMonth)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return cashIn - cashOut;
  }

  // Year filter
  if (selectedYear) {
    const endOfYear = new Date(
      Number(selectedYear) + 1,
      0,
      1
    );

    const cashIn = AllCashIn
      .filter(item => new Date(item.date) < endOfYear)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const cashOut = AllCashOut
      .filter(item => new Date(item.date) < endOfYear)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return cashIn - cashOut;
  }

  // No filter
  const cashIn = AllCashIn.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const cashOut = AllCashOut.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return cashIn - cashOut;
})();
  
  const totalBalance = totalCashIn - totalCashOut;

const chartData = selectedYear

  // ✅ YEAR FILTER MODE
  ? MONTHS.map((m, index) => {

      const month = index;

      const monthlyCashIn =
        FilteredCashIn.filter((item) => {

          const itemDate =
            new Date(item.date);

          return (
            itemDate.getMonth() === month &&
            itemDate.getFullYear() === Number(selectedYear)
          );

        }).reduce(
          (sum, item) =>
            sum + Number(item.amount),
          0
        );

      const monthlyCashOut =
        FilteredCashOut.filter((item) => {

          const itemDate =
            new Date(item.date);

          return (
            itemDate.getMonth() === month &&
            itemDate.getFullYear() === Number(selectedYear)
          );

        }).reduce(
          (sum, item) =>
            sum + Number(item.amount),
          0
        );

      return {
        name: m.label.slice(0, 3),
        cashIn: monthlyCashIn,
        cashOut: monthlyCashOut,
      };

    })

  // ✅ NORMAL MODE (LAST 12 MONTHS)
  : Array.from({ length: 12 }, (_, index) => {

      const date = new Date();

      date.setMonth(
        date.getMonth() - (11 - index)
      );

      const month =
        date.getMonth();

      const year =
        date.getFullYear();

      const monthlyCashIn =
        FilteredCashIn.filter((item) => {

          const itemDate =
            new Date(item.date);

          return (
            itemDate.getMonth() === month &&
            itemDate.getFullYear() === year
          );

        }).reduce(
          (sum, item) =>
            sum + Number(item.amount),
          0
        );

      const monthlyCashOut =
        FilteredCashOut.filter((item) => {

          const itemDate =
            new Date(item.date);

          return (
            itemDate.getMonth() === month &&
            itemDate.getFullYear() === year
          );

        }).reduce(
          (sum, item) =>
            sum + Number(item.amount),
          0
        );

      return {
        name: MONTHS[month].label.slice(0, 3),
        cashIn: monthlyCashIn,
        cashOut: monthlyCashOut,
      };

    });
  // pie data
  const pieData = [
    {
      name: "Cash In",
      value: totalCashIn,
    },
    {
      name: "Cash Out",
      value: totalCashOut,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  if (isCashReportsLoading || isCashReportsError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-5 min-h-screen text-white">
      {/* filters */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* month */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              মাস নির্বাচন
            </label>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
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
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500"
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
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500"
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
          
<button
  onClick={() => window.print()}
  className="bg-green-600 text-white px-5 py-3 rounded-xl"
>
  🖨 Monthly Report
</button>
          
        </div>
      </div>

      {/* top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* cash in */}
        <div className="bg-[#131c31] border border-[#1d2942] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400 font-medium">total Cash In</p>

              <h2 className="text-3xl font-black text-white mt-2">
                ৳ {totalCashIn.toLocaleString()}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {FilteredCashIn.length} টি লেনদেন
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
              📈
            </div>
          </div>
        </div>

        {/* cash out */}
        <div className="bg-[#131c31] border border-[#1d2942] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-400 font-medium">total Cash Out</p>

              <h2 className="text-3xl font-black text-white mt-2">
                ৳ {totalCashOut.toLocaleString()}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {FilteredCashOut.length} টি লেনদেন
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">
              📉
            </div>
          </div>
        </div>

        {/* net Cash Flow */}
        <div className="bg-[#131c31] border border-[#1d2942] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-400 font-medium">Net Cash Flow</p>

              <h2 className="text-3xl font-black text-white mt-2">
                ৳ {totalBalance.toLocaleString()}
              </h2>

            
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">
              📉
            </div>
          </div>
        </div>

        {/* balance */}
        <div className="bg-[#131c31] border border-[#1d2942] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-400 font-medium">
                বর্তমান ব্যালেন্স
              </p>

             <h2 className="text-3xl font-black text-white mt-2">
  ৳ {currentBalance.toLocaleString()}
</h2>

              <p className="text-xs text-gray-400 mt-1">নেট অবস্থা</p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
              💰
            </div>
          </div>
        </div>

        {/* total */}
        <div className="bg-[#131c31] border border-[#1d2942] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-400 font-medium">লেনদেন</p>

              <h2 className="text-3xl font-black text-white mt-2">
                {FilteredCashIn.length + FilteredCashOut.length}
              </h2>

              <p className="text-xs text-gray-400 mt-1">মোট ট্রানজেকশন</p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
              📊
            </div>
          </div>
        </div>
      </div>
      {/* bar chart */}
      <ChartCashReports chartData={chartData} />

      {/* charts */}
      <div className="">
        {/* yearly summary */}
        {/* header */}
        {!selectedMonth &&
          !selectedYear &&
          !startDate &&
          !endDate &&
          !selectedDate && (
            <div className="bg-[#131c31] border border-[#1d2942] rounded-3xl p-5">
              <YearCashReport
                years={years}
                AllCashIn={AllCashIn}
                AllCashOut={AllCashOut}
                totalCashIn={totalCashIn}
                totalCashOut={totalCashOut}
                totalBalance={totalBalance}
              />
            </div>
          )}

        {/* pie chart */}
        <div className="bg-[#131c31] border border-[#1d2942] rounded-3xl p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">Cash Distribution</h2>

            <p className="text-sm text-gray-400 mt-1">আয় বনাম ব্যয়</p>
          </div>

          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashReport;
