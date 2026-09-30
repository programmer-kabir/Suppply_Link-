import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import BackButton from "../../../components/BackButton/BackButton";
import Loader from "../../../components/Loader/Loader";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Building2,
  CheckCircle2,
  X,
  Search,
  Receipt,
  Sparkles,
  Wallet,
  Coins,
  History,
  AlertTriangle,
  ArrowRight,
  Check,
} from "lucide-react";

const formatMoney = (val) => {
  const num = Number(val || 0);
  return `৳ ${num.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const MonthlyProfitReport = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState(null);
  const [error, setError] = useState(null);

  // Month Details Modal State
  const [activeModalMonth, setActiveModalMonth] = useState(null);
  const [monthDetailLoading, setMonthDetailLoading] = useState(false);
  const [monthDetailData, setMonthDetailData] = useState(null);
  const [activeTab, setActiveTab] = useState("payments"); // 'payments' | 'sales' | 'expenses' | 'withdrawals'
  const [searchQuery, setSearchQuery] = useState("");

  // Profit Withdrawal Modal State
  const [withdrawModalMonth, setWithdrawModalMonth] = useState(null);
  const [withdrawMonthData, setWithdrawMonthData] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDate, setWithdrawDate] = useState(new Date().toISOString().slice(0, 10));
  const [withdrawMethod, setWithdrawMethod] = useState("Cash");
  const [withdrawRemarks, setWithdrawRemarks] = useState("");
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  const baseUrl = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:8000/apis";

  // Fetch Timeline Data
  const fetchMonthlyProfitData = async () => {
    try {
      setLoading(true);
      setError(null);
      const url =
        selectedYear === "all"
          ? `${baseUrl}/reports/monthly_profit.php`
          : `${baseUrl}/reports/monthly_profit.php?year=${selectedYear}`;
      const response = await axios.get(url);
      if (response.data && response.data.success) {
        setTimelineData(response.data);
      } else {
        setError(response.data?.message || "Failed to load profit data");
      }
    } catch (err) {
      console.error("Error fetching profit data:", err);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyProfitData();
  }, [selectedYear]);

  // Fetch Month Detail Data for Modal
  const openMonthDetail = async (month) => {
    setActiveModalMonth(month);
    setMonthDetailLoading(true);
    setActiveTab("payments");
    setSearchQuery("");
    try {
      const response = await axios.get(`${baseUrl}/reports/monthly_profit.php?month=${month}`);
      if (response.data && response.data.success) {
        setMonthDetailData(response.data);
      }
    } catch (err) {
      console.error("Error fetching month detail:", err);
    } finally {
      setMonthDetailLoading(false);
    }
  };

  const closeModal = () => {
    setActiveModalMonth(null);
    setMonthDetailData(null);
  };

  // Open Withdrawal Modal
  const openWithdrawModal = (monthObj) => {
    setWithdrawModalMonth(monthObj.month);
    setWithdrawMonthData(monthObj);
    setWithdrawAmount(String(monthObj.remaining_profit || ""));
    setWithdrawDate(new Date().toISOString().slice(0, 10));
    setWithdrawMethod("Cash");
    setWithdrawRemarks("");
  };

  const closeWithdrawModal = () => {
    setWithdrawModalMonth(null);
    setWithdrawMonthData(null);
  };

  // Handle Withdraw Form Submission
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);

    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    if (amt > (withdrawMonthData?.remaining_profit || 0) + 0.01) {
      toast.error(
        `Withdrawal amount cannot exceed remaining net profit (৳ ${withdrawMonthData?.remaining_profit})!`
      );
      return;
    }

    const availableCash = timelineData?.available_cash_balance || 0;
    if (amt > availableCash) {
      toast.error(`Insufficient cash in hand! Available Cash: ৳ ${availableCash}`);
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirm Profit Withdrawal",
      html: `
        <div class="text-left text-sm space-y-1">
          <p><strong>Month:</strong> ${withdrawMonthData?.label} (${withdrawMonthData?.month})</p>
          <p><strong>Withdrawal Amount:</strong> <span class="text-emerald-400 font-bold">৳ ${amt.toLocaleString()}</span></p>
          <p><strong>Payment Method:</strong> ${withdrawMethod}</p>
          <p><strong>Date:</strong> ${withdrawDate}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm Withdrawal",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      background: "#0f172a",
      color: "#f8fafc",
    });

    if (!confirm.isConfirmed) return;

    try {
      setWithdrawSubmitting(true);
      const res = await axios.post(`${baseUrl}/reports/withdraw_profit.php`, {
        month: withdrawModalMonth,
        amount: amt,
        date: withdrawDate,
        payment_method: withdrawMethod,
        remarks: withdrawRemarks,
      });

      if (res.data && res.data.success) {
        Swal.fire({
          title: "Success!",
          text: res.data.message || "Profit withdrawn successfully ✅",
          icon: "success",
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#10b981",
        });
        closeWithdrawModal();
        fetchMonthlyProfitData();
      } else {
        toast.error(res.data?.message || "Profit withdrawal failed");
      }
    } catch (err) {
      console.error("Error withdrawing profit:", err);
      toast.error(err.response?.data?.message || "Server error! Withdrawal failed");
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  // Filter items in modal
  const filteredPayments = useMemo(() => {
    if (!monthDetailData?.collected_payments) return [];
    if (!searchQuery.trim()) return monthDetailData.collected_payments;
    const q = searchQuery.toLowerCase();
    return monthDetailData.collected_payments.filter(
      (p) =>
        p.customer_name?.toLowerCase().includes(q) ||
        p.customer_mobile?.includes(q) ||
        p.product_name?.toLowerCase().includes(q) ||
        String(p.card_id).includes(q) ||
        p.tag?.toLowerCase().includes(q) ||
        p.payment_method?.toLowerCase().includes(q)
    );
  }, [monthDetailData, searchQuery]);

  const filteredSales = useMemo(() => {
    if (!monthDetailData?.sales_cards) return [];
    if (!searchQuery.trim()) return monthDetailData.sales_cards;
    const q = searchQuery.toLowerCase();
    return monthDetailData.sales_cards.filter(
      (s) =>
        s.customer_name?.toLowerCase().includes(q) ||
        s.customer_mobile?.includes(q) ||
        s.product_name?.toLowerCase().includes(q) ||
        String(s.card_id).includes(q)
    );
  }, [monthDetailData, searchQuery]);

  const filteredExpenses = useMemo(() => {
    if (!monthDetailData?.expenses) return [];
    if (!searchQuery.trim()) return monthDetailData.expenses;
    const q = searchQuery.toLowerCase();
    return monthDetailData.expenses.filter(
      (e) =>
        e.purpose?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.source?.toLowerCase().includes(q)
    );
  }, [monthDetailData, searchQuery]);

  const filteredWithdrawals = useMemo(() => {
    if (!monthDetailData?.withdrawals) return [];
    if (!searchQuery.trim()) return monthDetailData.withdrawals;
    const q = searchQuery.toLowerCase();
    return monthDetailData.withdrawals.filter(
      (w) =>
        w.purpose?.toLowerCase().includes(q) ||
        w.remarks?.toLowerCase().includes(q) ||
        w.date?.includes(q)
    );
  }, [monthDetailData, searchQuery]);

  const totals = timelineData?.totals || {};
  const months = timelineData?.months || [];
  const availableCashBalance = timelineData?.available_cash_balance || 0;

  return (
    <div className="min-h-screen text-slate-100 pb-12">
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Monthly Profit & Withdrawal Overview
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Profit & Settlement
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Track monthly realized profits, company expenses, net earnings & profit distributions
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Live Cash Badge */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Current Available Cash In-Hand */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 rounded-xl px-3.5 py-2 shadow-inner">
            <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Cash In-Hand Balance
              </p>
              <p className="text-sm font-black text-emerald-400">
                {formatMoney(availableCashBalance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 shadow-inner">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Years
              </option>
              <option value="2026" className="bg-slate-900 text-white">
                2026
              </option>
              <option value="2025" className="bg-slate-900 text-white">
                2025
              </option>
              <option value="2024" className="bg-slate-900 text-white">
                2024
              </option>
            </select>
          </div>

          <button
            onClick={fetchMonthlyProfitData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <Loader />
          <p className="text-sm text-slate-400">Loading profit & settlement data...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md mx-auto my-12">
          <p className="text-rose-400 font-semibold mb-3">{error}</p>
          <button
            onClick={fetchMonthlyProfitData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* ================= SUMMARY STATS CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* 1. Realized / Collected Profit */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900 border border-emerald-500/30 shadow-lg group hover:border-emerald-500/50 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  Realized Profit
                </span>
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {formatMoney(totals.total_collected_profit)}
              </h3>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Collections: {formatMoney(totals.total_collected_amount)}</span>
              </div>
            </div>

            {/* 2. Company Expenses */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900 border border-amber-500/30 shadow-lg group hover:border-amber-500/50 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  Company Expenses
                </span>
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {formatMoney(totals.total_company_expenses)}
              </h3>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Operating Expenses</span>
              </div>
            </div>

            {/* 3. Net Profit */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900 border border-indigo-500/30 shadow-lg group hover:border-indigo-500/50 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                  Final Net Profit
                </span>
                <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black text-indigo-400 tracking-tight">
                {formatMoney(totals.total_net_profit)}
              </h3>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Realized Profit - Expenses</span>
              </div>
            </div>

            {/* 4. Total Withdrawn Profit */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-slate-900 border border-purple-500/30 shadow-lg group hover:border-purple-500/50 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                  Withdrawn Profit
                </span>
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black text-purple-400 tracking-tight">
                {formatMoney(totals.total_withdrawn_profit)}
              </h3>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Profit Withdrawn</span>
              </div>
            </div>

            {/* 5. Remaining Distributable Profit */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-900 border border-cyan-500/30 shadow-lg group hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                  Remaining Distributable Profit
                </span>
                <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black text-cyan-400 tracking-tight">
                {formatMoney(totals.total_remaining_profit)}
              </h3>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Available for Withdrawal</span>
              </div>
            </div>
          </div>

          {/* ================= MONTHLY BREAKDOWN TABLE ================= */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🗓️</span> Monthly Profit & Withdrawal Breakdown
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click &quot;Withdraw&quot; on any eligible month to withdraw from remaining net profit
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 self-start sm:self-auto">
                Total {months.length} Months
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                    <th className="py-3.5 px-4 font-semibold">Month</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Realized Profit</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Company Expenses</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Net Profit</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Withdrawn</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Remaining Profit</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {months.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-slate-400">
                        No profit records found
                      </td>
                    </tr>
                  ) : (
                    months.map((m, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => openMonthDetail(m.month)}
                      >
                        {/* Month Label */}
                        <td className="py-4 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-125 transition" />
                            <div>
                              <p className="text-slate-100 font-bold">{m.label}</p>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {m.month}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Realized Profit */}
                        <td className="py-4 px-4 text-right">
                          <p className="font-bold text-emerald-400">
                            {formatMoney(m.collected_profit)}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {m.payments_count} installments
                          </p>
                        </td>

                        {/* Company Expenses */}
                        <td className="py-4 px-4 text-right">
                          <p className="font-medium text-amber-400">
                            {formatMoney(m.company_expenses ?? m.operating_expenses)}
                          </p>
                        </td>

                        {/* Net Profit */}
                        <td className="py-4 px-4 text-right">
                          <p
                            className={`font-black ${
                              m.net_profit >= 0 ? "text-indigo-400" : "text-rose-400"
                            }`}
                          >
                            {formatMoney(m.net_profit)}
                          </p>
                        </td>

                        {/* Withdrawn Amount */}
                        <td className="py-4 px-4 text-right">
                          <p className="font-bold text-purple-400">
                            {formatMoney(m.withdrawn_amount)}
                          </p>
                        </td>

                        {/* Remaining Profit */}
                        <td className="py-4 px-4 text-right">
                          <p className="font-bold text-cyan-400">
                            {formatMoney(m.remaining_profit)}
                          </p>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 text-center">
                          {m.withdrawal_status === "completed" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <Check className="w-3 h-3" />
                              Withdrawn
                            </span>
                          ) : m.withdrawal_status === "partial" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              <Coins className="w-3 h-3" />
                              Partial
                            </span>
                          ) : m.withdrawal_status === "loss" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Loss
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td
                          className="py-4 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {/* Withdraw Button */}
                            <button
                              disabled={m.remaining_profit <= 0.01}
                              onClick={() => openWithdrawModal(m)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                                m.remaining_profit > 0.01
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                              }`}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>Withdraw</span>
                            </button>

                            {/* Detail Button */}
                            <button
                              onClick={() => openMonthDetail(m.month)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= PROFIT WITHDRAWAL MODAL ================= */}
      {withdrawModalMonth && withdrawMonthData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Profit Withdrawal
                  </h3>
                  <p className="text-xs text-slate-400">
                    {withdrawMonthData.label} ({withdrawMonthData.month})
                  </p>
                </div>
              </div>
              <button
                onClick={closeWithdrawModal}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              {/* Mini Info Card */}
              <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Total Net Profit:</span>
                  <p className="font-bold text-indigo-400 text-sm">
                    {formatMoney(withdrawMonthData.net_profit)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Already Withdrawn:</span>
                  <p className="font-bold text-purple-400 text-sm">
                    {formatMoney(withdrawMonthData.withdrawn_amount)}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Remaining Distributable:</span>
                  <p className="font-black text-emerald-400 text-sm">
                    {formatMoney(withdrawMonthData.remaining_profit)}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Available Cash:</span>
                  <p className="font-black text-amber-400 text-sm">
                    {formatMoney(availableCashBalance)}
                  </p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Withdrawal Amount (BDT) <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(String(withdrawMonthData.remaining_profit))}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30"
                    >
                      Full (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setWithdrawAmount(
                          String(Math.round(withdrawMonthData.remaining_profit / 2))
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700"
                    >
                      Half (50%)
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={withdrawMonthData.remaining_profit}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    placeholder="Enter withdrawal amount"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {parseFloat(withdrawAmount) > withdrawMonthData.remaining_profit && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Amount cannot exceed remaining net profit
                  </p>
                )}
              </div>

              {/* Date & Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Withdrawal Date</label>
                  <input
                    type="date"
                    value={withdrawDate}
                    onChange={(e) => setWithdrawDate(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Payment Method</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Bkash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </select>
                </div>
              </div>

              {/* Remarks / Note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Remarks / Notes (Optional)</label>
                <input
                  type="text"
                  value={withdrawRemarks}
                  onChange={(e) => setWithdrawRemarks(e.target.value)}
                  placeholder="e.g. Owner drawing, dividend distribution"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeWithdrawModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    withdrawSubmitting ||
                    parseFloat(withdrawAmount) <= 0 ||
                    parseFloat(withdrawAmount) > withdrawMonthData.remaining_profit
                  }
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    withdrawSubmitting ||
                    parseFloat(withdrawAmount) <= 0 ||
                    parseFloat(withdrawAmount) > withdrawMonthData.remaining_profit
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                  }`}
                >
                  {withdrawSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Withdrawal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MONTH DETAIL MODAL ================= */}
      {activeModalMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {monthDetailData?.summary?.month_label || activeModalMonth} Profit & Settlement Statement
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive statement of realized profit, sales, operating expenses & withdrawals
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {monthDetailLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader />
                <p className="text-sm text-slate-400">Loading statement details...</p>
              </div>
            ) : !monthDetailData ? (
              <div className="text-center py-16 text-slate-400">No records found</div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                {/* Modal KPI Mini Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Realized Profit</p>
                    <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                      {formatMoney(monthDetailData.summary?.collected_profit)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Company Expenses</p>
                    <p className="text-base font-extrabold text-amber-400 mt-0.5">
                      {formatMoney(monthDetailData.summary?.company_expenses)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Final Net Profit</p>
                    <p className="text-base font-extrabold text-indigo-400 mt-0.5">
                      {formatMoney(monthDetailData.summary?.net_profit)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Withdrawn Amount</p>
                    <p className="text-base font-extrabold text-purple-400 mt-0.5">
                      {formatMoney(monthDetailData.summary?.withdrawn_amount)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Remaining Profit</p>
                    <p className="text-base font-extrabold text-cyan-400 mt-0.5">
                      {formatMoney(monthDetailData.summary?.remaining_profit)}
                    </p>
                  </div>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
                    <button
                      onClick={() => setActiveTab("payments")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        activeTab === "payments"
                          ? "bg-emerald-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Realized Profit ({monthDetailData.collected_payments?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("sales")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        activeTab === "sales"
                          ? "bg-indigo-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Sales List ({monthDetailData.sales_cards?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("expenses")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        activeTab === "expenses"
                          ? "bg-amber-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Company Expenses ({monthDetailData.expenses?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("withdrawals")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        activeTab === "withdrawals"
                          ? "bg-purple-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Withdrawals ({monthDetailData.withdrawals?.length || 0})</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, phone, card #..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
                    />
                  </div>
                </div>

                {/* TAB 1: Collected Payments List */}
                {activeTab === "payments" && (
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <th className="py-3 px-3.5 font-semibold">Date & Installment</th>
                            <th className="py-3 px-3.5 font-semibold">Customer & Phone</th>
                            <th className="py-3 px-3.5 font-semibold">Product & Card</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Amount Paid</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Principal</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Profit</th>
                            <th className="py-3 px-3.5 font-semibold text-center">Method</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredPayments.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-8 text-slate-400">
                                No installment collections recorded
                              </td>
                            </tr>
                          ) : (
                            filteredPayments.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-800/30 transition">
                                <td className="py-3 px-3.5">
                                  <p className="font-semibold text-slate-200">{p.paid_date}</p>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {p.tag || `Inst #${p.installment_no}`}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5">
                                  <p className="font-bold text-slate-100">
                                    {p.customer_name || "N/A"}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {p.customer_mobile || "-"}
                                  </p>
                                </td>

                                <td className="py-3 px-3.5">
                                  <p className="text-slate-200 font-medium truncate max-w-[180px]">
                                    {p.product_name || "Card #" + p.card_id}
                                  </p>
                                  <span className="text-[10px] font-mono text-indigo-400">
                                    Card #{p.card_id}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5 text-right font-bold text-slate-100">
                                  {formatMoney(p.due_amount)}
                                </td>

                                <td className="py-3 px-3.5 text-right text-slate-400 font-medium">
                                  {formatMoney(p.principal_amount)}
                                </td>

                                <td className="py-3 px-3.5 text-right font-bold text-emerald-400">
                                  +{formatMoney(p.profit_amount)}
                                </td>

                                <td className="py-3 px-3.5 text-center">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                    {p.payment_method || "Cash"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: Sales Cards List */}
                {activeTab === "sales" && (
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <th className="py-3 px-3.5 font-semibold">Delivery Date</th>
                            <th className="py-3 px-3.5 font-semibold">Customer Details</th>
                            <th className="py-3 px-3.5 font-semibold">Product & Card</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Sale Price</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Cost Price</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Booked Profit</th>
                            <th className="py-3 px-3.5 font-semibold text-center">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredSales.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-8 text-slate-400">
                                No sales recorded for this month
                              </td>
                            </tr>
                          ) : (
                            filteredSales.map((s) => (
                              <tr key={s.id} className="hover:bg-slate-800/30 transition">
                                <td className="py-3 px-3.5 font-medium text-slate-300">
                                  {s.delivery_date || "-"}
                                </td>

                                <td className="py-3 px-3.5">
                                  <p className="font-bold text-slate-100">
                                    {s.customer_name || "N/A"}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {s.customer_mobile || "-"}
                                  </p>
                                </td>

                                <td className="py-3 px-3.5">
                                  <p className="text-slate-200 font-medium truncate max-w-[180px]">
                                    {s.product_name}
                                  </p>
                                  <span className="text-[10px] font-mono text-indigo-400">
                                    Card #{s.card_id}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5 text-right font-bold text-slate-100">
                                  {formatMoney(s.sale_price)}
                                </td>

                                <td className="py-3 px-3.5 text-right text-slate-400 font-medium">
                                  {formatMoney(s.cost_price)}
                                </td>

                                <td className="py-3 px-3.5 text-right font-bold text-indigo-400">
                                  +{formatMoney(s.booked_profit)}
                                </td>

                                <td className="py-3 px-3.5 text-center">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {s.sale_type || "Installment"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: Company Expenses List */}
                {activeTab === "expenses" && (
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <th className="py-3 px-3.5 font-semibold">Date</th>
                            <th className="py-3 px-3.5 font-semibold">Purpose</th>
                            <th className="py-3 px-3.5 font-semibold">Category</th>
                            <th className="py-3 px-3.5 font-semibold">Source</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Expense Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredExpenses.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-8 text-slate-400">
                                No company expenses found for this month
                              </td>
                            </tr>
                          ) : (
                            filteredExpenses.map((e) => (
                              <tr key={e.id} className="hover:bg-slate-800/30 transition">
                                <td className="py-3 px-3.5 font-medium text-slate-300">
                                  {e.date}
                                </td>

                                <td className="py-3 px-3.5 font-semibold text-slate-100">
                                  {e.purpose || "-"}
                                </td>

                                <td className="py-3 px-3.5">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    {e.category || "General"}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5 text-slate-400">
                                  {e.source || "-"}
                                </td>

                                <td className="py-3 px-3.5 text-right font-bold text-amber-400">
                                  -{formatMoney(e.amount)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 4: Profit Withdrawals List */}
                {activeTab === "withdrawals" && (
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <th className="py-3 px-3.5 font-semibold">Date</th>
                            <th className="py-3 px-3.5 font-semibold">Purpose</th>
                            <th className="py-3 px-3.5 font-semibold">Remarks</th>
                            <th className="py-3 px-3.5 font-semibold">Source</th>
                            <th className="py-3 px-3.5 font-semibold text-right">Amount Withdrawn</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredWithdrawals.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-8 text-slate-400">
                                No profit withdrawals recorded for this month
                              </td>
                            </tr>
                          ) : (
                            filteredWithdrawals.map((w) => (
                              <tr key={w.id} className="hover:bg-slate-800/30 transition">
                                <td className="py-3 px-3.5 font-medium text-slate-300">
                                  {w.date}
                                </td>

                                <td className="py-3 px-3.5 font-bold text-slate-100">
                                  {w.purpose || "-"}
                                </td>

                                <td className="py-3 px-3.5 text-slate-400">
                                  {w.remarks || "-"}
                                </td>

                                <td className="py-3 px-3.5">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                    {w.source || "profit-distribution"}
                                  </span>
                                </td>

                                <td className="py-3 px-3.5 text-right font-bold text-purple-400">
                                  -{formatMoney(w.amount)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyProfitReport;
