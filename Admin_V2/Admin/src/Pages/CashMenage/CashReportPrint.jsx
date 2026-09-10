import React from "react";
import useCashReports from "../../utils/Hooks/cash/useCashReports";
import Loader from "../../components/Loader/Loader";


const CashReportPrint = () => {
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");

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

    // custom filters
    if (filterType === "expenses") {
      const source = (cash.source || cash.category || cash.remarks || "").toLowerCase();
      if (!source.includes("company-expense")) {
        return false;
      }
    } else if (filterType === "purchases") {
      const source = (cash.source || cash.category || cash.details || cash.purpose || cash.remarks || "").toLowerCase();
      if (!source.includes("purchase") && !source.includes("ক্রয়") && !source.includes("product")) {
        return false;
      }
    } else if (filterType === "exclude-expenses") {
      const source = (cash.source || cash.category || cash.remarks || "").toLowerCase();
      if (source.includes("company-expense")) {
        return false;
      }
    } else if (filterType === "downpayment") {
      const cat = (cash.category || "").toLowerCase().trim();
      const text = (cash.source || cash.purpose || cash.remarks || "").toLowerCase().trim();
      const isDownPayment = 
        cat.includes("downpayment") || 
        cat.includes("down_payment") || 
        cat.includes("down payment") || 
        text.includes("downpayment") || 
        text.includes("down_payment") || 
        text.includes("down payment") || 
        text.includes("ডাউন পেমেন্ট") || 
        text.includes("ডাউনপেমেন্ট") || 
        text.includes("ডাউন");
      if (!isDownPayment) {
        return false;
      }
    } else if (filterType === "installment") {
      const cat = (cash.category || "").toLowerCase().trim();
      const text = (cash.source || cash.purpose || cash.remarks || "").toLowerCase().trim();
      const isDownPayment = 
        cat.includes("downpayment") || 
        cat.includes("down_payment") || 
        cat.includes("down payment") || 
        text.includes("downpayment") || 
        text.includes("down_payment") || 
        text.includes("down payment") || 
        text.includes("ডাউন পেমেন্ট") || 
        text.includes("ডাউনপেমেন্ট") || 
        text.includes("ডাউন");
      const isInstallment = 
        cat.includes("installment") || 
        cat.includes("daily-installment") || 
        cat.includes("daily_installment") || 
        text.includes("installment") || 
        text.includes("কিস্তি");
      if (!isInstallment || isDownPayment) {
        return false;
      }
    }

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
    const BalanceCashIn = AllCashIn;
    const BalanceCashOut = filterType === "exclude-expenses"
      ? AllCashOut.filter(cash => {
        const source = (cash.source || cash.category || "").toLowerCase();
        return !source.includes("company-expense");
      })
      : AllCashOut;

    // Month filter
    if (selectedMonth) {
      const endOfMonth = new Date(selectedMonth + "-01");
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      const cashIn = BalanceCashIn.filter(
        (item) => new Date(item.date) < endOfMonth,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      const cashOut = BalanceCashOut.filter(
        (item) => new Date(item.date) < endOfMonth,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      return cashIn - cashOut;
    }

    // Year filter
    if (selectedYear) {
      const endOfYear = new Date(Number(selectedYear) + 1, 0, 1);

      const cashIn = BalanceCashIn.filter(
        (item) => new Date(item.date) < endOfYear,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      const cashOut = BalanceCashOut.filter(
        (item) => new Date(item.date) < endOfYear,
      ).reduce((sum, item) => sum + Number(item.amount), 0);

      return cashIn - cashOut;
    }

    // No filter
    const cashIn = BalanceCashIn.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const cashOut = BalanceCashOut.reduce(
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
      <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-200 print-wrapper">
        <div className=" mx-auto space-y-6">
          {/* filters */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-5 md:p-6 print:hidden">
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
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedDate("");
                  setSelectedMonth("");
                  setSelectedYear("");
                  setStartDate("");
                  setEndDate("");
                  setFilterType("all");
                }}
                className="bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-500/30 transition"
              >
                Clear Filters
              </button>

              <button
                onClick={() => setFilterType("all")}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${filterType === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/20 hover:bg-blue-500/30"
                  }`}
              >
                সকল রেকর্ড
              </button>

              <button
                onClick={() => setFilterType("expenses")}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${filterType === "expenses"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-purple-500/20 text-purple-400 border-purple-500/20 hover:bg-purple-500/30"
                  }`}
              >
                কোম্পানি খরচ
              </button>

              <button
                onClick={() => setFilterType("purchases")}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${filterType === "purchases"
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-orange-500/20 text-orange-400 border-orange-500/20 hover:bg-orange-500/30"
                  }`}
              >
                ক্রয় (Purchase)
              </button>
              <button
                onClick={() => setFilterType("downpayment")}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${filterType === "downpayment"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30"
                  }`}
              >
                ডাউন পেমেন্ট (Down Payment)
              </button>
              <button
                onClick={() => setFilterType("installment")}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${filterType === "installment"
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-600/30"
                  : "bg-cyan-500/20 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/30"
                  }`}
              >
                কিস্তি (Installment)
              </button>

              <button
                onClick={() => setFilterType("exclude-expenses")}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${filterType === "exclude-expenses"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-teal-500/20 text-teal-400 border-teal-500/20 hover:bg-teal-500/30"
                  }`}
              >
                কোম্পানি খরচ ব্যতীত
              </button>

              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                🖨 Print Report
              </button>
            </div>
          </div>



          <div className="text-center mb-8 print-header">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 print-title">
              {filterType === "expenses"
                ? "কোম্পানি খরচ রিপোর্ট"
                : filterType === "purchases"
                  ? "ক্রয় (Purchase) রিপোর্ট"
                  : filterType === "downpayment"
                    ? "ডাউন পেমেন্ট (Down Payment) রিপোর্ট"
                    : filterType === "installment"
                      ? "কিস্তি আদায় (Installment) রিপোর্ট"
                      : filterType === "exclude-expenses"
                        ? "ক্যাশ রিপোর্ট (কোম্পানি খরচ ব্যতীত)"
                        : "SupplyLink Cash Report"}
            </h1>

            <p className="text-lg mt-2 text-slate-400 print-subtitle">
              {selectedMonth
                ? `মাসিক রিপোর্ট (${selectedMonth})`
                : selectedYear
                  ? `বার্ষিক রিপোর্ট (${selectedYear})`
                  : "সকল রিপোর্ট"}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 print-summary-grid">
              {filterType === "expenses" || filterType === "purchases" || filterType === "downpayment" || filterType === "installment" ? (
                <>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 min-w-[160px] shadow-lg print-stat-card">
                    <p className="text-sm text-slate-400 mb-1">
                      {filterType === "expenses" 
                        ? "Total Expenses" 
                        : filterType === "purchases" 
                          ? "Total Purchase" 
                          : filterType === "downpayment"
                            ? "Total Down Payment"
                            : "Total Installment"}
                    </p>
                    <p className={`text-2xl font-bold print-stat-val ${filterType === "expenses" || filterType === "purchases" ? "text-red-400" : "text-emerald-400"}`}>
                      ৳ {(totalCashIn + totalCashOut).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 min-w-[160px] shadow-lg print-stat-card">
                    <p className="text-sm text-slate-400 mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold text-blue-400 print-stat-val">{FilteredCashIn.length + FilteredCashOut.length}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 min-w-[140px] shadow-lg print-stat-card">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Total Cash In</p>
                    <p className="text-xl font-bold text-emerald-400 print-stat-val">৳ {totalCashIn.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 min-w-[140px] shadow-lg print-stat-card">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Total Cash Out</p>
                    <p className="text-xl font-bold text-red-400 print-stat-val">৳ {totalCashOut.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 min-w-[140px] shadow-lg print-stat-card">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Net Cash Flow</p>
                    <p className={`text-xl font-bold print-stat-val ${totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ৳ {totalBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 min-w-[140px] shadow-lg print-stat-card">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Current Balance</p>
                    <p className="text-xl font-bold text-blue-400 print-stat-val">৳ {currentBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 min-w-[140px] shadow-lg print-stat-card">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Transactions</p>
                    <p className="text-xl font-bold text-slate-200 print-stat-val">{FilteredCashIn.length + FilteredCashOut.length}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print-table-wrapper">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-800/80 text-slate-300 uppercase text-xs tracking-wider">
                  <tr className="border-b border-slate-700">
                    <th className="p-4 font-semibold">#</th>
                    <th className="p-4 font-semibold">তারিখ</th>
                    <th className="p-4 font-semibold">ধরণ</th>
                    <th className="p-4 font-semibold">বিবরণ</th>
                    <th className="p-4 font-semibold">উদ্দেশ্য</th>
                    <th className="p-4 font-semibold">মন্তব্য</th>
                    <th className="p-4 font-semibold text-right">পরিমাণ</th>
                  </tr>
                </thead>

                <tbody>
                  {printTransactions.map((item, index) => (
                    <React.Fragment key={item.id || index}>



                      <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 whitespace-nowrap">{item.date}</td>

                        <td
                          className={`p-4 font-semibold ${item.type === "in"
                            ? "text-emerald-400"
                            : "text-red-400"
                            }`}
                        >
                          {item.type === "in" ? "Cash In" : "Cash Out"}
                        </td>

                        <td className="p-4">
                          {item.source ||
                            item.category ||
                            item.details ||
                            item.note ||
                            "-"}
                        </td>

                        <td className="p-4 text-slate-400">
                          {item.purpose || "-"}
                        </td>

                        <td className="p-4 text-slate-400">
                          {item.remarks || item.note || "-"}
                        </td>

                        <td className="p-4 text-right font-medium text-slate-300">
                          ৳{Number(item.amount).toLocaleString()}
                        </td>
                      </tr>

                    </React.Fragment>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
      <style>{`
@media print {
  @page {
    size: A4 portrait;
  }

  html, body, .print-wrapper {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    color: #1a1a1a !important;
    min-height: auto !important;
    height: auto !important;
  }

  .print-table-wrapper, .overflow-x-auto {
    overflow: visible !important;
    height: auto !important;
  }

  .print-header {
    text-align: center !important;
    margin-bottom: 30px !important;
  }

  .print-title {
    color: #000 !important;
    background: none !important;
    -webkit-text-fill-color: #000 !important;
    font-size: 24pt !important;
    margin-bottom: 5px !important;
  }

  .print-subtitle {
    color: #666 !important;
    font-size: 12pt !important;
  }

  .print-summary-grid {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
    justify-content: center !important;
    margin-top: 20px !important;
    margin-bottom: 30px !important;
  }

  .print-stat-card {
    border: 1px solid #ddd !important;
    background: #f9fafb !important;
    border-radius: 8px !important;
    padding: 12px 16px !important;
    box-shadow: none !important;
    min-width: 120px !important;
    text-align: center !important;
  }
  
  .print-stat-card p {
    color: #444 !important;
    margin: 0 0 4px 0 !important;
  }

  .print-stat-val {
    color: #000 !important;
    font-size: 14pt !important;
    font-weight: bold !important;
  }

  .print-table-wrapper {
    border: none !important;
    box-shadow: none !important;
    background: #fff !important;
    border-radius: 0 !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
    page-break-inside: auto !important;
  }

  thead {
    display: table-header-group !important;
  }

  tbody {
    page-break-inside: auto !important;
  }

  th {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
    border: 1px solid #e5e7eb !important;
    padding: 10px !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  td {
    border: 1px solid #e5e7eb !important;
    padding: 8px 10px !important;
    color: #374151 !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  tr {
    page-break-inside: avoid !important;
    break-inside: avoid-page !important;
    -webkit-column-break-inside: avoid !important;
  }

  .page-break {
    page-break-before: always !important;
    border: none !important;
  }

  .text-emerald-400, .text-red-400, .text-slate-400, .text-blue-400, .text-slate-300 {
    color: inherit !important;
  }
}
`}</style>
    </>
  );
};

export default CashReportPrint;
