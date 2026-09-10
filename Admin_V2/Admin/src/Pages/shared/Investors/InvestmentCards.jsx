import React, { useEffect, useMemo, useState } from "react";
import useInvestmentCards from "../../../utils/Investors/useInvestmentCards";
import useUsers from "../../../utils/Hooks/useUsers";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";

const InvestmentCards = () => {
  const [search, setSearch] = useState("");
const [minAmount, setMinAmount] = useState("");
const [maxAmount, setMaxAmount] = useState("");
const [statusFilter, setStatusFilter] = useState("");
  const {
    investmentCards = [],
    isInvestmentCardsLoading,
    isInvestmentCardsError,
  } = useInvestmentCards();
  const { users, isUsersLoading, isUsersError } = useUsers();

  const mergedInvestmentCards = useMemo(() => {
    if (!investmentCards || !users) return [];

    return investmentCards.map((card) => {
      const investor = users.find((user) => user.id === card.investor_id);
      return { ...card, investor };
    });
  }, [investmentCards, users]);

  // 🔍 search logic
// 🔍 search logic & sorting
const filteredCards = useMemo(() => {
  let result = mergedInvestmentCards;

  if (search) {
    const term = search.toLowerCase();

    result = result.filter((card) => {
      const investor = card.investor;

      return (
        investor?.name?.toLowerCase().includes(term) ||
        String(investor?.id).includes(term) ||
        String(card?.id).includes(term)
      );
    });
  }

  if (minAmount) {
    result = result.filter(
      (card) => Number(card.investment_amount) >= Number(minAmount)
    );
  }

  if (maxAmount) {
    result = result.filter(
      (card) => Number(card.investment_amount) <= Number(maxAmount)
    );
  }

  if (statusFilter) {
    result = result.filter(
      (card) => card.status === statusFilter
    );
  }

  return [...result].sort((a, b) => {
  if (a.status === "closed" && b.status !== "closed") return 1;
  if (a.status !== "closed" && b.status === "closed") return -1;
  return 0;
});
}, [
  search,
  minAmount,
  maxAmount,
  statusFilter,
  mergedInvestmentCards,
]);
useEffect(() => {
  // ডাটা যখন রেডি এবং কার্ডগুলো রেন্ডার হয়ে গেছে
  if (!isInvestmentCardsLoading && filteredCards?.length > 0) {
    const savedPos = window.scrollPositions?.[window.location.pathname];
    
    if (savedPos) {
      // আমরা ২-৩ বার ট্রাই করব কারণ ব্রাউজার অনেক সময় বড় লিস্ট রেন্ডার করতে দেরি করে
      const scrollElement = document.getElementById("app-scroll-container");
      
      if (scrollElement) {
        // ১. ইমিডিয়েট ট্রাই
        scrollElement.scrollTo({ top: savedPos, behavior: 'instant' });
        
        // ২. ১০০ মিলি-সেকেন্ড পর আবার ট্রাই (নিশ্চিত হওয়ার জন্য)
        setTimeout(() => {
          scrollElement.scrollTo({ top: savedPos, behavior: 'instant' });
        }, 100);
      }
    }
  }
}, [isInvestmentCardsLoading, filteredCards.length]);
// 📊 Stats calculation
  const activeCount = filteredCards.filter(card => card.status !== "closed").length;
  const closedCount = filteredCards.filter(card => card.status === "closed").length;
  // ✅ Loading UI
  // if (isInvestmentCardsLoading || isUsersLoading) {
  //   return (
  //     <div className="min-h-[60vh] w-full flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  // ✅ Error UI
  if (isInvestmentCardsError || isUsersError) {
    return (
      <NoDataFound
        message="ডাটা লোড করা যায়নি"
        subMessage="পরে আবার চেষ্টা করুন"
      />
    );
  }

  return (
    <div className="py-4 px-2">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Investment Cards
          </h2>
          <p className="text-sm text-gray-400">
            Total cards: {filteredCards.length}
          </p>
          <p className="text-sm text-emerald-400">
      Active: <span className="font-medium">{activeCount}</span>
    </p>
    <p className="text-sm text-rose-400">
      Closed: <span className="font-medium">{closedCount}</span>
  </p>
        </div>

<div className="md:flex items-center gap-2">
  <input
    type="text"
    placeholder="Search by Investor ID, Card ID, Name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full md:w-96
               text-gray-200 placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-sky-500"
  />

  <div className="flex gap-2 mt-2 md:mt-0">
    <input
      type="number"
      placeholder="Min Amount"
      value={minAmount}
      onChange={(e) => setMinAmount(e.target.value)}
      className="w-1/2 px-3 py-2 rounded bg-gray-800 border border-gray-700"
    />

    <input
      type="number"
      placeholder="Max Amount"
      value={maxAmount}
      onChange={(e) => setMaxAmount(e.target.value)}
      className="w-1/2 px-3 py-2 rounded bg-gray-800 border border-gray-700"
    />
  </div>
</div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {filteredCards.map((card) => {
          const investor = card.investor;

          return (
            <div
              key={card.id}
              className="rounded-2xl p-4 bg-gradient-to-br from-[#0b1220] via-[#0e1629] to-[#0a1020]
                         border border-white/10 shadow-lg text-white flex flex-col justify-between"
            >
              {/* Top */}
              <div className="flex gap-3">
                <img
                  src={`https://management.supplylinkbd.com/${investor?.photo}`}
                  alt="user"
                  className="w-14 h-14 rounded-full object-cover border-2 border-sky-400/40 p-1"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-sm leading-snug break-words w-[220px]">
                      {card?.card_name || "Unknown"}
                    </h2>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-400/20">
                      ID {investor?.id}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">
                    📞 {investor?.mobile}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <p>💳 Card: {card.id}</p>
                <p>📍 {investor?.address || "ঠিকানা নেই"}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/investors/investment_cards/details?card_id=${card.id}`}
                  className="flex-1 rounded-xl py-2 text-sm border border-white/20 text-center text-slate-200 hover:bg-white/10 transition"
                >
                  দেখুন
                </Link>
                {card.status === "closed" ? (
                  <button
                    disabled
                    className="flex-1 rounded-xl py-2 text-sm text-center
               bg-gray-600/40 text-gray-400
               border border-gray-500/30
               cursor-not-allowed"
                    title="এই কার্ডটি বন্ধ (Closed), কিস্তি দেওয়া যাবে না"
                  >
                    Closed
                  </button>
                ) : (
                  <Link
                    to={`/investors/investment_payments?card_id=${card.id}`}
                    className="flex-1 rounded-xl py-2 text-sm text-center
               bg-sky-500 hover:bg-sky-600 text-white transition"
                  >
                    কিস্তি
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          😕 কোনো তথ্য পাওয়া যায়নি
        </p>
      )}
    </div>
  );
};

export default InvestmentCards;
