// InvestmentCardLayout.jsx
import React, { useEffect, useState } from "react";
import useInvestInstallmentCards from "../Utils/Hooks/useInvestInstallmentCards";
import useInvestInstallment from "../Utils/Hooks/useInvestInstallments";
import currentUser from "../Utils/currentUser";

const fmt = (v) => (v !== null && v !== undefined && v !== "" ? v : "-");

const InvestmentCardLayout = ({ children, onSelectedCardChange }) => {
  const { investInstallmentCards } = useInvestInstallmentCards();
  const runningUser = currentUser();

  const [selectedCardId, setSelectedCardId] = useState(null);
  const { investInstallments, inInvestInstallmentsLoading } =
    useInvestInstallment(selectedCardId);

  const currentCard = investInstallmentCards.filter(
    (card) => card.investor_id === runningUser?.id
  );

  const sortedCards = [...currentCard].sort((a, b) => {
    if (a.status === "running" && b.status === "closed") return -1;
    if (a.status === "closed" && b.status === "running") return 1;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  useEffect(() => {
    if (!selectedCardId && sortedCards.length > 0) {
      setSelectedCardId(sortedCards[0].id);
    }
  }, [selectedCardId, sortedCards]);

  const selectedCard = currentCard.find((c) => c.id === selectedCardId);

  // 👉 selectedCard যখনই বদলাবে, parent-এ জানিয়ে দিচ্ছি
  useEffect(() => {
    if (onSelectedCardChange) {
      onSelectedCardChange(selectedCard || null);
    }
  }, [selectedCard, onSelectedCardChange]);

  const statusBadgeClass =
    selectedCard?.status === "running"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  // console.log(sortedCards?.length);
  return (
    <div className="space-y-6">
      {/* উপরে কার্ড লিস্ট */}
      <div>
        {sortedCards.length > 1 && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              আপনার ইনভেস্টমেন্ট কার্ডসমূহ
            </h2>
            <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4`}>
              {sortedCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 text-sm shadow-sm transition-all
                ${
                  selectedCardId === card.id
                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md"
                }`}
                >
                  <p className="text-xs text-slate-500 mb-1">
                    কার্ড #{card.id}
                  </p>
                  <p className="font-semibold text-slate-800 mb-1">
                    {fmt(card.card_name)}
                  </p>

                  <p className="text-xs text-slate-500 mb-1">
                    বিনিয়োগ{" "}
                    <span className="font-semibold text-slate-800">
                      ৳{fmt(card.investment_amount)}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500 mb-1">
                    পেমেন্ট টাইপ: {fmt(card.payment_type)}
                  </p>

                  <p className="text-xs text-slate-500 mb-1">
                    স্ট্যাটাস:{" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium
                  ${
                    card.status === "running"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                    >
                      {card.status === "running" ? "চলমান" : "বন্ধ"}
                    </span>
                  </p>

                  <p className="text-[11px] text-slate-400">
                    শুরু: {fmt(card.start_date)} • শেষ:{" "}
                    {fmt(card.maturity_date)}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* নিচে extra children কন্টেন্ট */}
      {children &&
        (typeof children === "function"
          ? children({
              selectedCard,
              sortedCards,
              investInstallments,
              inInvestInstallmentsLoading,
              statusBadgeClass,
            })
          : children)}
    </div>
  );
};

export default InvestmentCardLayout;
