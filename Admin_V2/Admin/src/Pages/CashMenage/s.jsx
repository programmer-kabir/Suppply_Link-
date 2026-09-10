import React from "react";
import useCashReports from "../../utils/Hooks/cash/useCashReports";
import Loader from "../../components/Loader/Loader";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { MONTHS } from "../../../public/month";
import ChartCashReports from "../../components/cash/ChartCashReports";
import YearCashReport from "../../components/cash/YearCashReport";

const CashReportPrint = () => {
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

      const cashIn = AllCashIn.filter(
        (item) => new Date(item.date) < endOfMonth,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      const cashOut = AllCashOut.filter(
        (item) => new Date(item.date) < endOfMonth,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      return cashIn - cashOut;
    }

    // Year filter
    if (selectedYear) {
      const endOfYear = new Date(Number(selectedYear) + 1, 0, 1);

      const cashIn = AllCashIn.filter(
        (item) => new Date(item.date) < endOfYear,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      const cashOut = AllCashOut.filter(
        (item) => new Date(item.date) < endOfYear,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      return cashIn - cashOut;
    }

    // No filter
    const cashIn = AllCashIn.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const cashOut = AllCashOut.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    return cashIn - cashOut;
  })();

  const totalBalance = totalCashIn - totalCashOut;

  const printTransactions = React.useMemo(() => {
    return [...FilteredCashIn, ...FilteredCashOut].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [FilteredCashIn, FilteredCashOut]);
  const COLORS = ["#22c55e", "#ef4444"];

  if (isCashReportsLoading || isCashReportsError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );

  return (
    <>
      <div className="space-y-5  text-white">
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



<div className="text-center mb-4">
  <h1 className="text-3xl font-bold">
    SupplyLink Cash Report
  </h1>

  <p className="text-lg mt-1">
    {selectedMonth
      ? `মাসিক ক্যাশ রিপোর্ট (${selectedMonth})`
      : selectedYear
      ? `বার্ষিক ক্যাশ রিপোর্ট (${selectedYear})`
      : "সকল ক্যাশ রিপোর্ট"}
  </p>

  <div className="mt-4 rounded p-3 inline-block text-left space-y-3">
    <p>
      <strong>Total Cash In:</strong> ৳{" "}
      {totalCashIn.toLocaleString()}
    </p>

    <p>
      <strong>Total Cash Out:</strong> ৳{" "}
      {totalCashOut.toLocaleString()}
    </p>

    <p>
      <strong>Net Cash Flow:</strong> ৳{" "}
      {totalBalance.toLocaleString()}
    </p>

    <p>
      <strong>Current Balance:</strong> ৳{" "}
      {currentBalance.toLocaleString()}
    </p>

    <p>
      <strong>Total Transactions:</strong>{" "}
      {FilteredCashIn.length + FilteredCashOut.length}
    </p>
  </div>
</div>
          <div className="overflow-x-auto">

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">তারিখ</th>
                  <th className="p-2 text-left">ধরণ</th>
                  <th className="p-2 text-left">বিবরণ</th>
                  <th className="p-2 text-right">পরিমাণ</th>
                </tr>
              </thead>

            <tbody>
  {printTransactions.map((item, index) => (
    <React.Fragment key={item.id || index}>

      {(index === 28 || index === 65 || index === 100) && (
        <tr className="page-break">
          <td colSpan="5"></td>
        </tr>
      )}

      <tr className="border-b border-gray-800">
        <td className="p-2">{index + 1}</td>
        <td className="p-2">{item.date}</td>

        <td
          className={`p-2 font-semibold ${
            item.type === "in"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {item.type === "in" ? "Cash In" : "Cash Out"}
        </td>

        <td className="p-2">
          {item.source ||
            item.category ||
            item.details ||
            item.note ||
            "-"}
        </td>

        <td className="p-2 text-right">
          ৳{Number(item.amount).toLocaleString()}
        </td>
      </tr>

    </React.Fragment>
  ))}
</tbody>

            </table>
          </div>
      </div>
<style>{`
@media print {

  @page{
    size:A4 portrait;
    margin:6mm;
  }

  html,
  body{
    margin:0 !important;
    padding:0 !important;
    background:#fff !important;
    color:#000 !important;
  }

  /* Hide Filter Area */
  .bg-\\[\\#111827\\]{
    display:none !important;
  }

  button,
  input,
  select,
  label{
    display:none !important;
  }

  /* Report Header */
  h1{
    color:#000 !important;
  }

  p{
    color:#000 !important;
  }

  /* Table Wrapper */
  .overflow-x-auto{
    overflow:visible !important;
  }

  /* Table */
  table{
    width:100% !important;
    border-collapse:collapse !important;
    page-break-inside:auto !important;
  }

  thead{
    display:table-header-group;
  }

  tfoot{
    display:table-footer-group;
  }

  tbody{
    page-break-inside:auto !important;
  }

  tr{
    page-break-inside:auto !important;
    break-inside:auto !important;
    page-break-after:auto !important;
  }

  td,
  th{
    border:1px solid #999 !important;
    padding:6px !important;
    font-size:12px !important;
    line-height:1.2 !important;
    color:#000 !important;
    page-break-inside:auto !important;
    break-inside:auto !important;
  }

  th{
    font-weight:700 !important;
  }

  /* Remove Tailwind Dark Colors */
  .text-white,
  .text-green-400,
  .text-red-400,
  .text-blue-400{
    color:#000 !important;
  }

  /* Summary Section */
  .space-y-3{
    gap:2px !important;
  }

  .space-y-3 p{
    margin:2px 0 !important;
  }

  /* Prevent Empty Gap */
  .space-y-5{
    margin:0 !important;
    padding:0 !important;
  }

  /* Page Break Helper */
  .page-break{
    page-break-before:always;
  }

}
`}</style>
    </>
  );
};

export default CashReportPrint;
