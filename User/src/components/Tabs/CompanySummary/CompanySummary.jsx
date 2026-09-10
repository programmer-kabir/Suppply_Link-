import React, { useEffect, useMemo, useState } from "react";
import useCustomerInstallmentCards from "../../../Utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../../../Utils/Hooks/useCustomerInstallmentPayments";
import Loader from "../../Loader/Loader";
import MonthlyInstallmentReport from "./MonthlyInstallmentReport";
import useInvestInstallmentCards from "../../../Utils/Hooks/useInvestInstallmentCards";
import useAllInvestInstalments from "../../../Utils/Hooks/useAllInvestInstalments";
import useProfitAnalytics from "../../../Utils/Hooks/useProfitAnalytics";
import useProfitStatus from "../../../Utils/Hooks/useProfitStatus";
import useInvestorProfitHistory from "../../../Utils/Hooks/useInvestorProfitHistory";

const CompanySummary = () => {
  const {
    isCustomerInstallmentsCardsLoading,
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
  } = useCustomerInstallmentCards();
  const {
    isCustomerInstallmentsPaymentsLoading,
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
  } = useCustomerInstallmentPayments();
  const {
    allInvestInstallments,
    isAllInvestInstallmentsLoading,
    isAllInvestInstallmentsError,
  } = useAllInvestInstalments();

  const {
    investInstallmentCards,
    isInvestInstallmentsCardsLoading,
    isInvestInstallmentsCardsError,
  } = useInvestInstallmentCards();

  const { investorProfitHistory = [], isInvestProfitHistoryLoading } =
    useInvestorProfitHistory();
  const isLoading =
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading ||
    isInvestInstallmentsCardsLoading ||
    isAllInvestInstallmentsLoading ||
    isInvestProfitHistoryLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center"><Loader /></div>;
  }
  const totalCostPrice = customerInstallmentCards.reduce(
    (sum, card) => sum + Number(card.cost_price || 0),
    0
  );
  const totalSalePrice = customerInstallmentCards.reduce(
    (sum, card) => sum + Number(card.sale_price || 0),
    0
  );
  const totalProfit = customerInstallmentCards.reduce(
    (sum, p) => sum + Number(p.profit || 0),
    0
  );

  const payments = customerInstallmentPayments || [];
  // ✅ আদায়যোগ্য লাভ (paid only)
  const paidProfit = payments.reduce((sum, p) => {
    if (p.paid_date) {
      return sum + Number(p.profit_amount || 0);
    }
    return sum;
  }, 0);
  const totalPaidPricipal = payments.reduce((sum, p) => {
    if (p.paid_date) {
      return sum + Number(p.principal_amount || 0);
    }
    return sum;
  }, 0);

  const totalDuePaid = payments.reduce((sum, p) => {
    if (p.paid_date) {
      return sum + Number(p.due_amount || 0);
    }
    return sum;
  }, 0);

  // বকেয়া
  const unpaidPayments = payments.filter((p) => p.status === "Unpaid");

  const totalDueUnPaid = unpaidPayments.reduce(
    (sum, p) => sum + Number(p.due_amount || 0),
    0
  );
  const totalUnPaidPrincipal = unpaidPayments.reduce(
    (sum, p) => sum + Number(p.principal_amount || 0),
    0
  );
  const totalUnPaidProfit = unpaidPayments.reduce(
    (sum, p) => sum + Number(p.profit_amount || 0),
    0
  );
  const paidPayments = payments.filter((p) => p.status === "Paid");
  const investorInvestments = allInvestInstallments.filter(
  (item) => ![1, 2].includes(Number(item.investment_card_no))
);
  const totalInvestment = investorInvestments.reduce(
    (sum, installments) => sum + Number(installments.amount || 0),
    0
  );
  const totalClosedInvestment = investInstallmentCards
    .filter((inst) => inst.status === "closed")
    .reduce((sum, inst) => sum + Number(inst.investment_amount || 0), 0);

  const currentInvestment = totalInvestment - totalClosedInvestment;
  // totalProfitWithdraw
const totalProfitWithdraw = investorProfitHistory.reduce(
  (sum, profit) => sum + Math.floor(Number(profit.amount || 0)),
  0
);
  const currentCash =
    currentInvestment + totalDuePaid - totalCostPrice - totalProfitWithdraw;

  return (
    <main>
      <div className="space-y-6 mt-6 mb-24 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">👁️</span>
          <h2 className="text-xl font-semibold text-slate-800">
            এক নজরে সামগ্রিক আর্থিক চিত্র
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1 */}
          <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-emerald-700 font-semibold">
              মোট ক্রয় মূল্য (Cost Price)
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalCostPrice.toFixed(2)}
            </p>
          </div>

          {/* 2 */}
          <div className="rounded-xl border-2 border-indigo-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-indigo-700 font-semibold">
              মোট বিক্রয় মূল্য (Sale Price)
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalSalePrice.toFixed(2)}
            </p>
          </div>

          {/* 3 */}
          <div className="rounded-xl border-2 border-amber-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-amber-700 font-semibold">
              মোট লাভ (Profit)
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalProfit.toFixed(2)}
            </p>
          </div>

          {/* 4 */}
          <div className="rounded-xl border-2 border-emerald-600 bg-white p-4 shadow-sm">
            <p className="text-sm text-emerald-700 font-semibold">
              মোট আদায়কৃত বিক্রয় মূল্য
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalDuePaid.toFixed(2)}
            </p>
          </div>

          {/* 5 */}
          <div className="rounded-xl border-2 border-slate-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-700 font-semibold">
              মোট আদায়কৃত মূলধন
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalPaidPricipal.toFixed(2)}
            </p>
          </div>
          {/* 6 */}
          <div className="rounded-xl border-2 border-slate-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-700 font-semibold">
              মোট আদায়কৃত লাভ
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {paidProfit.toFixed(2)}
            </p>
          </div>

          {/* 7 */}
          <div className="rounded-xl border-2 border-red-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-red-600 font-semibold">মোট বকেয়া</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalDueUnPaid.toFixed(2)}
            </p>
          </div>

          {/* 8 */}
          <div className="rounded-xl border-2 border-rose-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-rose-600 font-semibold">
              মোট বকেয়া মূলধন
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalUnPaidPrincipal.toFixed(2)}
            </p>
          </div>

          {/* 9 */}
          <div className="rounded-xl border-2 border-red-600 bg-white p-4 shadow-sm">
            <p className="text-sm text-red-700 font-semibold">মোট বকেয়া লাভ</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalUnPaidProfit.toFixed(2)}
            </p>
          </div>
        </div>
        {/* Comay Cash */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
          <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-emerald-700 font-semibold">
              মোট সংগ্রহীত বিনিয়োগ
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalInvestment.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-emerald-700 font-semibold">
              মোট উত্তোলিত বিনিয়োগ
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalClosedInvestment.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-emerald-700 font-semibold">
              নেট বিনিয়োগ
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {currentInvestment.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-5">
          <div
            className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-emerald-700 font-semibold">
              মোট প্রফিট উত্তোলন
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {totalProfitWithdraw.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-emerald-700 font-semibold">
              বর্তমান ক্যাশ
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ৳ {currentCash.toFixed(2)}
            </p>
          </div>
        </div>
        <MonthlyInstallmentReport payments={paidPayments} />
      </div>
      
    </main>
  );
};

export default CompanySummary;
