import React, { useEffect, useState } from "react";
import StatCard from "../components/Dashboards/StatCard";
import { MONTHS } from "../../public/month";
import useDashboardData from "../utils/Hooks/dashboard/useDashboardData";
import { applyPreset, getChartData, sumBy } from "../utils/dashboardUtils";
import DashboardFilter from "../components/Dashboards/DashboardFilter";
import DashboardChart from "../components/Dashboards/DashboardChart";
import { Link } from "react-router-dom";
import StateCardCopy from "../components/Dashboards/StateCardCopy";
import { 
  FiFileText, 
  FiClock, 
  FiLayers, 
  FiZap,
  FiTrendingUp,
  FiRefreshCw
} from "react-icons/fi";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [filterType, setFilterType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activePreset, setActivePreset] = useState("");

  const {
    customerInstallmentCards,
    customerInstallmentPayments,
    investInstallments,
    companyExpenses,
    dailyInstallments,
    isLoading,
    isError,
    users,
    roleStats,
  } = useDashboardData();

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, i) => currentYear - i,
  );
  
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  useEffect(() => {
    setSelectedDate(today);
  }, []);

  const matchDate = (itemDate) => {
    if (!itemDate) return false;

    const cleanDate = itemDate.split(" ")[0];

    if (filterType === "daily") {
      return cleanDate === (selectedDate || today);
    }

    if (filterType === "monthly" && selectedMonth) {
      return cleanDate.startsWith(selectedMonth);
    }

    if (filterType === "yearly" && selectedYear) {
      return cleanDate.startsWith(selectedYear);
    }

    return true;
  };

  const safePayments = Array.isArray(customerInstallmentPayments) ? customerInstallmentPayments : [];
  const safeInvestments = Array.isArray(investInstallments) ? investInstallments : [];
  const safeDailyInstallments = Array.isArray(dailyInstallments) ? dailyInstallments : [];
  const safeSales = Array.isArray(customerInstallmentCards) ? customerInstallmentCards : [];
  const safeExpenses = Array.isArray(companyExpenses) ? companyExpenses : [];

  const filteredPayments = safePayments.filter((p) => {
    const isPaid = p.status === "Paid";
    const isMatchedDate = matchDate(p.paid_date);
    return isPaid && isMatchedDate;
  });

  const filteredInvestments = safeInvestments.filter((i) =>
    matchDate(i.investment_date) &&
    Number(i.investment_card_no) !== 1,
  );

  const filteredDailyInstallments = safeDailyInstallments.filter((d) =>
    matchDate(d.date),
  );

  const filteredSales = safeSales.filter((c) =>
    matchDate(c.delivery_date),
  );

  const filteredExpenses = safeExpenses.filter((c) =>
    matchDate(c.date || c.expense_date),
  );

  const totalSalesAmount = sumBy(filteredSales, "sale_price");
  const totalInstallmentAmount = sumBy(filteredPayments, "due_amount");
  const totalInvestmentAmount = sumBy(filteredInvestments, "amount");
  const totalExpenseAmount = sumBy(filteredExpenses, "amount");
  const totalDailyInstallmentAmount = sumBy(
    filteredDailyInstallments,
    "amount",
  );

  const chartConfig = (data, field, dateField) =>
    getChartData({
      data: Array.isArray(data) ? data : [],
      field,
      dateField,
      startDate,
      endDate,
      activePreset,
      MONTHS,
    });

  const salesChart = chartConfig(
    safeSales,
    "sale_price",
    "delivery_date",
  );
  
  const installmentChart = chartConfig(
    safePayments,
    "due_amount",
    "paid_date",
  );

  const investmentChart = chartConfig(
    safeInvestments.filter(
      (i) => Number(i.investment_card_no) !== 1
    ),
    "amount",
    "investment_date",
  );

  const dailyInstallmentChart = chartConfig(
    safeDailyInstallments,
    "amount",
    "date",
  );

  const expenseChart = chartConfig(safeExpenses, "amount", "date");

  const handlePreset = (type) => {
    const { startDate, endDate, activePreset } = applyPreset(type);
    setStartDate(startDate);
    setEndDate(endDate);
    setActivePreset(activePreset);
  };

  useEffect(() => {
    handlePreset("7d");
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* ===== Top Hero Welcome Banner ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 p-6 sm:p-8 border border-slate-800/90 shadow-2xl backdrop-blur-2xl">
        {/* Glow Spots */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SupplyLink Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              অ্যাডমিন ড্যাশবোর্ড ওভারভিউ
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              আজকের হিসাব, কাস্টমার কিস্তি আদায়, ইনভেস্টমেন্ট এবং ব্যবসার সামগ্রিক আর্থিক অবস্থা এক নজরে পর্যবেক্ষণ করুন।
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <Link to="/today-report">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-900/40 border border-indigo-400/30 transition-all duration-200"
              >
                <FiFileText className="w-4 h-4" />
                <span>আজকের সম্পূর্ণ রিপোর্ট</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Roles & Active Users Ribbon ===== */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FiLayers className="w-3.5 h-3.5 text-indigo-400" />
            ইউজার ও পার্টনার পরিসংখ্যান
          </h3>
          <span className="text-[11px] text-slate-500">লাইভ ডাটাবেজ রেকর্ড</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StateCardCopy title="Total Users" value={roleStats.total} />
          <StateCardCopy title="Customers" value={roleStats.customer} />
          <StateCardCopy title="Investors" value={roleStats.investor} />
          <StateCardCopy title="Staff" value={roleStats.staff} />
          <StateCardCopy title="Managers" value={roleStats.manager} />
          <StateCardCopy title="Admins" value={roleStats.admin} />
          <StateCardCopy title="Developers" value={roleStats.developer} />
        </div>
      </div>

      {/* ===== Main Company Overview Section ===== */}
      <div className="relative rounded-3xl bg-slate-900/50 border border-slate-800/80 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              কোম্পানির আর্থিক পর্যালোচনা
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ফিল্টার অনুযায়ী মোট বিক্রয়, আদায়, ইনভেস্টমেন্ট ও ব্যয়ের রিপোর্ট
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 font-sans">
              <FiClock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedDate || today}</span>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <DashboardFilter
          filterType={filterType}
          setFilterType={setFilterType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          yearOptions={yearOptions}
        />

        {/* Financial KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title={"Total Sales"} value={totalSalesAmount} />
          <StatCard
            title={"Total Installments"}
            value={totalInstallmentAmount}
          />
          <StatCard title={"Total Investment"} value={totalInvestmentAmount} />
          <StatCard
            title={"Total Daily Installments"}
            value={totalDailyInstallmentAmount}
          />
          <StatCard
            title={"Total Company Expense"}
            value={totalExpenseAmount}
          />
        </div>

        {/* Dynamic Interactive Charts */}
        <DashboardChart
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handlePreset={handlePreset}
          salesChart={salesChart}
          installmentChart={installmentChart}
          investmentChart={investmentChart}
          dailyInstallmentChart={dailyInstallmentChart}
          expenseChart={expenseChart}
          activePreset={activePreset}
          setActivePreset={setActivePreset}
        />
      </div>

    </div>
  );
};

export default Dashboard;
