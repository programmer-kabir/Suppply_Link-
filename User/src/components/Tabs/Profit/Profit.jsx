import { useMemo, useState } from "react";
import InvestmentCardLayout from "../../InvestmentCardLayout";
import Loader from "../../Loader/Loader";
import { FaChevronDown } from "react-icons/fa";
import useProfitAnalytics from "../../../Utils/Hooks/useProfitAnalytics";
import useProfitStatus from "../../../Utils/Hooks/useProfitStatus";
import usePaymentMethod from "../../../Utils/Hooks/usePaymentMethod";
import { getPaymentOptions } from "../../../Utils/getPaymentOptions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import ProfitChart from "./ProfitChart";
import useCurrentUser from "../../../Utils/currentUser";
import useInvestInstallmentCards from "../../../Utils/Hooks/useInvestInstallmentCards";
import CompanyProfitChart from "./CompanyProfitChart";
import { monthOptions } from "../../../../public/months";
import useInvestorProfitHistory from "../../../Utils/Hooks/useInvestorProfitHistory";
import useCustomerInstallmentPayments from "../../../Utils/Hooks/useCustomerInstallmentPayments";
import useInvestInstallment from "../../../Utils/Hooks/useInvestInstallments";
import useAllInvestInstalments from "../../../Utils/Hooks/useAllInvestInstalments";
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const Profit = () => {
  const [selectedCardForSummary, setSelectedCardForSummary] = useState(null);

  const { investInstallmentCards, isInvestInstallmentsCardsLoading } =
    useInvestInstallmentCards();
  const {
    allInvestInstallments,
    isAllInvestInstallmentsLoading,
    isAllInvestInstallmentsError,
  } = useAllInvestInstalments();
  const runningUser = useCurrentUser();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  // =======================
  // 🔎 Filter State
  // =======================
  // const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  // 2021 → running year
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years = Array.from(
      { length: current - 2025 + 1 },
      (_, i) => 2025 + i,
    );

    return ["all", ...years]; 
  }, []);
  const { isProfitAnalyticsLoading, profitAnalytics = [] } =
    useProfitAnalytics();
  // ✅ MUST return ALL profit_history rows for this card (withdraw decisions etc.)
const rawTotal = profitAnalytics.reduce((sum, item) => {
  return sum + parseFloat(item.profit_amount || 0);
}, 0);

  const {
    profitHistory = [],
    isProfitHistoryLoading,
    refetch: refetchProfitStatus,
  } = useProfitStatus({
    cardId: selectedCardForSummary?.id,
  });


  const { paymentMethods } = usePaymentMethod(
    selectedCardForSummary?.investor_id,
  );

  const currentCardAnalytics = useMemo(() => {
    if (!selectedCardForSummary?.id) return [];
    return (profitAnalytics || []).filter(
      (p) => Number(p.card_id) === Number(selectedCardForSummary.id),
    );
  }, [profitAnalytics, selectedCardForSummary?.id]);
  const filteredAnalytics = useMemo(() => {
    return (currentCardAnalytics || []).filter((p) => {
      const yearMatch =
        filterYear === "all"
          ? true
          : Number(p.profit_year) === Number(filterYear);

      const monthMatch =
        filterMonth === "" || filterMonth === "all"
          ? true
          : Number(p.profit_month) === Number(filterMonth);

      return yearMatch && monthMatch;
    });
  }, [currentCardAnalytics, filterYear, filterMonth]);

  const totalWeightedValue = useMemo(() => {
    return (currentCardAnalytics  || []).reduce(
      (acc, inst) => acc + toNumber(inst.weight_value),
      0,
    );
  }, [profitAnalytics]);
  const yourWeight = useMemo(() => {
    return (filteredAnalytics || []).reduce(
      (acc, inst) => acc + toNumber(inst.weight_value),
      0,
    );
  }, [filteredAnalytics]);

  const yourAllProfit = useMemo(() => {
    return (filteredAnalytics || []).reduce(
      (acc, inst) => acc + toNumber(inst.profit_amount),
      0,
    );
  }, [filteredAnalytics]);

  // ✅ PreviousProfit = only APPROVED withdraw amounts
  const PreviousProfit = useMemo(() => {
    return (profitHistory || [])
      .filter(
        (inst) =>
          String(inst.status || "").toLowerCase() === "withdraw" &&
          String(inst.action_name || "").toLowerCase() === "approved",
      )
      .reduce((acc, inst) => acc + toNumber(inst.amount), 0);
  }, [profitHistory]);

  const yourProfit = Number(yourAllProfit.toFixed(2)) - Number(PreviousProfit);

  const yourPercent = useMemo(() => {
    if (!totalWeightedValue) return 0;
    const rawPercent = (yourWeight / totalWeightedValue) * 100;
    return Math.round(rawPercent * 100) / 100;
  }, [yourWeight, totalWeightedValue]);

  const formatNumber = (n) =>
    n != null
      ? Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })
      : "-";
  // Date range badge
  // =======================
  const start = selectedCardForSummary?.start_date || null;
  const end = selectedCardForSummary
    ? selectedCardForSummary.maturity_date || today
    : null;

  // Decision window (after maturity)
  // =======================
  const isDecisionWindow = useMemo(() => {
    const md = selectedCardForSummary?.maturity_date;
    if (!md || md === "0000-00-00") return false;

    const m = new Date(md);
    if (isNaN(m.getTime())) return false;

    const now = new Date();
    const mOnly = new Date(m.getFullYear(), m.getMonth(), m.getDate());
    const tOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return tOnly >= mOnly;
  }, [selectedCardForSummary?.maturity_date]);

  // =======================
  // ✅ Period key (monthly/yearly)
  // =======================
  // Rule: shorttime => monthly, otherwise yearly (change here if needed)
  const periodType = useMemo(() => {
    return selectedCardForSummary?.payment_type === "shorttime"
      ? "monthly"
      : "yearly";
  }, [selectedCardForSummary?.payment_type]);

  // Use END date for period (same as backend)
  const periodYear = useMemo(() => {
    const d = new Date(end || today);
    return isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  }, [end, today]);

  const periodMonth = useMemo(() => {
    if (periodType !== "monthly") return 0;
    const d = new Date(end || today);
    return isNaN(d.getTime()) ? new Date().getMonth() + 1 : d.getMonth() + 1;
  }, [end, today, periodType]);

  // =======================
  // ✅ latest withdraw record for this period
  // =======================
  const latestWithdrawRecord = useMemo(() => {
    if (!selectedCardForSummary?.id) return null;

    const list = (profitHistory || [])
      .filter((p) => {
        const sameCard =
          Number(p.card_id) === Number(selectedCardForSummary.id);
        const sameYear = Number(p.profit_year) === Number(periodYear);
        const sameMonth = Number(p.profit_month || 0) === Number(periodMonth);
        const isWithdraw = String(p.status || "").toLowerCase() === "withdraw";
        return sameCard && sameYear && sameMonth && isWithdraw;
      })
      .sort((a, b) => Number(b.id) - Number(a.id));

    return list[0] || null;
  }, [profitHistory, selectedCardForSummary?.id, periodYear, periodMonth]);

  // ✅ decision is action_name
  const decisionStatus = useMemo(() => {
    return (
      String(latestWithdrawRecord?.action_name || "").toLowerCase() || null
    );
  }, [latestWithdrawRecord]);

  const isPending = decisionStatus === "pending";
  const isApproved = decisionStatus === "approved";

  const isProfitLoading = isProfitHistoryLoading || isProfitAnalyticsLoading;

  const canWithdraw =
    !isProfitLoading &&
    !!selectedCardForSummary &&
    yourProfit > 0 &&
    isDecisionWindow &&
    !isPending &&
    !isApproved;

  // =======================
  // Withdraw handler
  // =======================
  const handleWithdraw = async () => {
    if (!selectedCardForSummary || !yourProfit) return;

    if (paymentMethods?.review === "pending") {
      Swal.fire({
        icon: "warning",
        title: "Payment Method Pending",
        text: "আপনার পেমেন্ট মেথড এখনো যাচাই করা হয়নি। অনুগ্রহ করে অনুমোদনের জন্য অপেক্ষা করুন।",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (paymentMethods?.review === "rejected") {
      Swal.fire({
        icon: "error",
        title: "Payment Method Rejected",
        text: "আপনার পেমেন্ট মেথডটি বাতিল করা হয়েছে। অনুগ্রহ করে নতুন করে আপডেট করুন।",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // min rule for non-shorttime
    if (
      selectedCardForSummary?.payment_type !== "shorttime" &&
      yourProfit < 10
    ) {
      toast.info("উইথড্র করার জন্য ন্যূনতম ১০ টাকা প্রয়োজন।");
      return;
    }

    if (!isDecisionWindow) {
      toast.info("Withdraw window এখনো আসেনি (maturity date হয়নি)।");
      return;
    }

    // frontend safety
    if (isPending) {
      toast.info("আপনার আগের Withdraw request এখনো Pending আছে।");
      return;
    }

    if (isApproved) {
      toast.info("আপনার Withdraw request ইতিমধ্যে Approved হয়েছে।");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি কি আপনার প্রাপ্য লাভের সম্পূর্ণ অর্থ উত্তোলন (Withdraw) করতে চান? এই সিদ্ধান্তটি পরে পরিবর্তন করা যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, Withdraw করবো",
      cancelButtonText: "না, এখনই না",
    });

    if (!confirmResult.isConfirmed) return;

    // Select payment method
    const paymentOptions = getPaymentOptions(paymentMethods);
    let selectedPaymentMethod = "cash";

    if (paymentOptions.length > 0) {
      const optionsHtml = paymentOptions
        .map((op) => `<option value="${op.value}">${op.label}</option>`)
        .join("");

      const methodResult = await Swal.fire({
        title: "Payment Method নির্বাচন করুন",
        html: `
          <label class="block text-sm font-medium text-left mb-1">Payment Method</label>
          <select id="payment_method" class="swal2-input">
            <option value="">Select method</option>
            ${optionsHtml}
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: "Confirm Withdraw",
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#dc2626",
        preConfirm: () => {
          const payment_method =
            document.getElementById("payment_method")?.value;
          if (!payment_method) {
            Swal.showValidationMessage("Payment method নির্বাচন করুন");
            return false;
          }
          return { payment_method };
        },
      });

      if (!methodResult.isConfirmed) return;
      selectedPaymentMethod = methodResult.value.payment_method;
    }

    try {
      const body = new URLSearchParams({
        investor_id: String(selectedCardForSummary.investor_id),
        card_id: String(selectedCardForSummary.id),
        status: "withdraw",
        action_name: "pending",
        period_type: periodType, // ✅ IMPORTANT
        payment_method: selectedPaymentMethod,
        amount: String(yourProfit),
        start_date: start || "",
        end_date: end || "",
        requested_at: today,
      });

      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/profit/save_profit_action.php`,
        {
          method: "POST",
          body,
        },
      );

      const data = await res.json();

      if (!data?.success) {
        Swal.fire(
          "ভুল হয়েছে",
          data?.message || "Withdraw করা যায়নি",
          "error",
        );
        return;
      }

      Swal.fire({
        title: "Request Sent",
        text: "আপনার withdraw request admin review এর জন্য পাঠানো হয়েছে।",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      refetchProfitStatus?.();
    } catch (error) {
      Swal.fire("সমস্যা হয়েছে", "অনুগ্রহ করে পরে আবার চেষ্টা করুন।", "error");
    }
  };

  // =======================
  // Company cards
  // =======================
  const companyCards = useMemo(() => {
    return (investInstallmentCards || []).filter(
      (c) => Number(c.investor_id) === Number(runningUser?.id),
    );
  }, [investInstallmentCards, runningUser?.id]);

  const {
    isCustomerInstallmentsPaymentsLoading,
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
  } = useCustomerInstallmentPayments();

  const companyProfitHistory = useMemo(() => {
    const map = {};

    (customerInstallmentPayments || []).forEach((p) => {
      if (!p.paid_date) return; // unpaid বাদ
      if (p.status !== "Paid") return;

      const d = new Date(p.paid_date);

      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-12

      const key = `${year}-${month}`;

      if (!map[key]) {
        map[key] = {
          year,
          month,
          companyProfit: 0,
        };
      }
      map[key].companyProfit += Number(p.profit_amount || 0);
    });
 
    return Object.values(map);
  }, [customerInstallmentPayments, allInvestInstallments]);

  const filteredCompanyProfitHistory = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return (companyProfitHistory || []).filter((p) => {
      const yearMatch =
        filterYear === "all" ? true : Number(p.year) === Number(filterYear);

      const monthMatch =
        filterMonth === "" || filterMonth === "all"
          ? true
          : Number(p.month) === Number(filterMonth);

      // ✅ ALWAYS block running month (even in ALL mode)
      const isRunningMonth =
        Number(p.year) === currentYear && Number(p.month) === currentMonth;

      return yearMatch && monthMatch && !isRunningMonth;
    });
  }, [companyProfitHistory, filterYear, filterMonth]);

  const totalCompanyProfit = useMemo(() => {
    return (filteredCompanyProfitHistory || []).reduce(
      (sum, p) => sum + Number(p.companyProfit || 0),
      0,
    );
  }, [filteredCompanyProfitHistory]);

  // const chartCompanyProfit = useMemo(() => {
  //   return (filteredCompanyProfitHistory || []).map((p) => ({
  //     year: p.year,
  //     month: p.month,
  //     companyProfit: Number(p.companyProfit || 0),
  //     totalWeight: Number(p.totalWeight || 0),
  //   }));
  // }, [filteredCompanyProfitHistory]);
const chartCompanyProfit = useMemo(() => {

  return (filteredCompanyProfitHistory || []).map((p) => ({
    year: p.year,
    month: p.month,
    companyProfit: Number(p.companyProfit || 0),
    totalWeight: 0,
  }));

}, [filteredCompanyProfitHistory]);
  // const monthlyTotalWeight = useMemo(() => {
  //   const map = {};
  //   const now = new Date();
  //   const currentYear = now.getFullYear();
  //   const currentMonth = now.getMonth() + 1;

  //   (profitAnalytics || []).forEach((item) => {
  //     const year = Number(item.profit_year);
  //     const month = Number(item.profit_month);
  //     const weight = toNumber(item.weight_value);

  //     if (!year || !month) return;

  //     // ✅ running month skip
  //     if (year === currentYear && month === currentMonth) return;

  //     const key = `${year}-${month}`;

  //     if (!map[key]) {
  //       map[key] = {
  //         year,
  //         month,
  //         totalWeight: 0,
  //       };
  //     }

  //     map[key].totalWeight += weight;
  //   });

  //   return Object.values(map).sort((a, b) => {
  //     if (a.year !== b.year) return a.year - b.year;
  //     return a.month - b.month;
  //   });
  // }, [profitAnalytics]);
const monthlyTotalWeight = useMemo(() => {

  if (!selectedCardForSummary?.id) {
    return [];
  }

  const map = {};

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  (currentCardAnalytics || []).forEach((item) => {

    const year =
      Number(item.profit_year);

    const month =
      Number(item.profit_month);

    const weight =
      toNumber(item.weight_value);

    if (!year || !month) return;

    // ✅ running month skip
    if (
      year === currentYear &&
      month === currentMonth
    ) {
      return;
    }

    const key = `${year}-${month}`;

    if (!map[key]) {

      map[key] = {
        year,
        month,
        totalWeight: 0,
      };

    }

    map[key].totalWeight += weight;

  });

  return Object.values(map).sort((a, b) => {

    if (a.year !== b.year) {
      return a.year - b.year;
    }

    return a.month - b.month;

  });

}, [
  currentCardAnalytics,
  selectedCardForSummary?.id
]);
  return (
    <div className="space-y-6">
      <InvestmentCardLayout onSelectedCardChange={setSelectedCardForSummary}>
        {() => null}
      </InvestmentCardLayout>

      {isProfitLoading ? (
        <div className="flex items-center justify-center"><Loader /> </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              {/* Year */}
              {/* Year */}
              <div className="relative">
                <FaChevronDown
                  size={12}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-300 ${
                    yearOpen ? "rotate-180" : "rotate-0"
                  }`}
                />

                <select
                  onFocus={() => setYearOpen(true)}
                  onBlur={() => setYearOpen(false)}
                  value={filterYear}
                  onChange={(e) =>
                    setFilterYear(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    )
                  }
                  className="appearance-none pr-8 bg-white text-slate-700 text-sm px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Year</option>
                  {yearOptions
                    .filter((y) => y !== "all")
                    .map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </select>
              </div>

              {/* Month */}
              {/* Month */}
              <div className="relative">
                <FaChevronDown
                  size={12}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-300 ${
                    monthOpen ? "rotate-180" : "rotate-0"
                  }`}
                />

                <select
                  onFocus={() => setMonthOpen(true)}
                  onBlur={() => setMonthOpen(false)}
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="appearance-none pr-8 bg-white text-slate-700 text-sm px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setFilterMonth("");
                  setFilterYear("all");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-300"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* ======================= */}

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-800 flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-lg">
                    ৳
                  </span>
                  প্রফিট ওভারভিউ
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  সিলেক্টেড ইনভেস্টমেন্ট কার্ড অনুযায়ী আপনার প্রফিট, ওজন এবং
                  শেয়ার দেখাবে।
                </p>
              </div>

              {selectedCardForSummary && (
                <div className="flex flex-col items-start md:items-end gap-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-slate-700">
                      হিসাবের সময়কাল:
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {start || "-"} → {end || "-"}
                    </span>
                  </div>

                  {canWithdraw ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Withdraw window active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Withdraw window নেই / শেষ হয়েছে
                    </span>
                  )}
                </div>
              )}
            </div>

            {!selectedCardForSummary ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-500">
                  উপরে থাকা ইনভেস্টমেন্ট কার্ডগুলোর মধ্য থেকে কোনো একটি সিলেক্ট
                  করুন, তারপর এখানে প্রফিটের হিসাব দেখতে পারবেন।
                </p>
              </div>
            ) : (
              <>
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 shadow-sm">
                    <p className="text-sm text-emerald-700 font-semibold">
                      আপনার মোট ওজন
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatNumber(yourWeight)}
                    </p>
                    <p className="text-[11px] text-emerald-700/80 mt-1">
                      এই কার্ডে আপনার মোট বিনিয়োগের টাইম-ওয়েটেড মান।
                    </p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-4 shadow-sm">
                    <p className="text-sm text-indigo-700 font-semibold">
                      কোম্পানির লাভ
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      ৳{formatNumber(totalCompanyProfit)}
                    </p>
                    <p className="text-[11px] text-indigo-700/80 mt-1">
                      এখন পর্যন্ত বিনিয়োগকারীদের মোট আদায়কৃত লাভ
                    </p>
                  </div>

                  {/* Your profit card */}
                  <div className="rounded-xl bg-teal-50 border border-teal-200 px-5 py-4 shadow-sm xl:col-span-3 md:col-span-2">
                    <p className="text-sm text-teal-700 font-semibold">
                      আপনার লাভ
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      ৳{formatNumber(yourProfit)}
                    </p>

                    {/* Decision status messages */}
                    {decisionStatus === "pending" && (
                      <p className="text-[11px] text-amber-700 mt-2">
                        আপনার Withdraw request admin review এ আছে (Pending)।
                      </p>
                    )}

                    {decisionStatus === "approved" && (
                      <p className="text-[11px] text-emerald-700 mt-2">
                        আপনার Withdraw request Approved হয়েছে ✅
                      </p>
                    )}

                    {decisionStatus === "rejected" && (
                      <div className="mt-2">
                        <p className="text-[11px] text-rose-700">
                          আপনার Withdraw request Rejected হয়েছে ❌ — আবার
                          Withdraw করতে পারবেন।
                        </p>
                        {latestWithdrawRecord?.remarks && (
                          <p className="text-[11px] text-rose-700/90 mt-1">
                            Reason: {latestWithdrawRecord.remarks}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Withdraw button */}
                    <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Withdraw window এর মধ্যে আপনি আপনার লাভ উত্তোলন করতে
                        পারবেন।
                      </p>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleWithdraw}
                          disabled={!canWithdraw}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition
                          ${
                            canWithdraw
                              ? "border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 active:scale-[0.98]"
                              : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-80"
                          }`}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>

                    {!isDecisionWindow && (
                      <p className="text-[11px] text-slate-500 mt-2">
                        Withdraw window এখনো আসেনি (maturity date হয়নি)।
                      </p>
                    )}

                    {(isPending || isApproved) && (
                      <p className="text-[11px] text-slate-500 mt-2">
                        Withdraw বাটন বন্ধ আছে কারণ আপনার request{" "}
                        {decisionStatus} অবস্থায় আছে।
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-200 mt-2">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      কার্ড নাম
                    </p>
                    <p className="text-base font-semibold text-slate-800 mt-0.5">
                      {selectedCardForSummary.card_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Total Weighted Value (এই কার্ড)
                    </p>
                    <p className="text-base font-semibold text-emerald-600 mt-0.5">
                      {formatNumber(
                        selectedCardForSummary.total_time_wighted_value,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      শুরুর তারিখ
                    </p>
                    <p className="text-sm text-slate-700 mt-0.5">
                      {selectedCardForSummary.start_date || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      মেয়াদ শেষ
                    </p>
                    <p className="text-sm text-slate-700 mt-0.5">
                      {selectedCardForSummary.maturity_date || "নির্ধারিত নয়"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {Number(runningUser?.id) > 1 && (
        <ProfitChart
          profits={currentCardAnalytics}
          companyOverview={chartCompanyProfit}
          monthlyTotalWeight={monthlyTotalWeight}
          filterYear={filterYear}
          filterMonth={filterMonth}
           payments = {allInvestInstallments}
           selectedCard={selectedCardForSummary}
        />
      )}


      {runningUser?.id === 1 && (
        <CompanyProfitChart
          profitAnalytics={profitAnalytics}
          companyCards={companyCards}
          selectedCardForSummary={selectedCardForSummary}
        />
      )}
            {Number(runningUser?.id) === 1 && (
        <ProfitChart
          profits={currentCardAnalytics}
          companyOverview={chartCompanyProfit}
          monthlyTotalWeight={monthlyTotalWeight}
          filterYear={filterYear}
          filterMonth={filterMonth}
           payments = {allInvestInstallments}
           selectedCard={selectedCardForSummary}
        />
      )}
    </div>
  );
};

export default Profit;
