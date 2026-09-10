import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import BackButton from "../../../components/BackButton/BackButton";
import useInvestmentCards from "../../../utils/Investors/useInvestmentCards";
import useUsers from "../../../utils/Hooks/useUsers";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";
import { FaUserCircle } from "react-icons/fa";

const PAGE_SIZE = 8;

const money = (n) => {
  const num = Number(n || 0);
  return `৳ ${num.toLocaleString("en-US")}`;
};

const InvestorDetailsWithId = () => {
  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get("user_id") || 0);
  const { users, isUsersLoading, isUsersError } = useUsers();

  const { investmentCards, isInvestmentCardsError, isInvestmentCardsLoading } =
    useInvestmentCards();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const investor = useMemo(() => {
    if (!users?.length) return null;
    return users.find((u) => Number(u.id) === userId) || null;
  }, [users, userId]);

  const investorCards = useMemo(() => {
    const list = (investmentCards || []).filter(
      (c) => Number(c.investor_id) === userId,
    );

    const keyword = q.trim().toLowerCase();
    if (!keyword) return list;

    // টেক্সট সার্চ: card id / title / note / amount / date ইত্যাদি
    return list.filter((c) => {
      const hay = [
        c.id,
        c.card_no,
        c.title,
        c.note,
        c.amount,
        c.deposit,
        c.profit,
        c.created_at,
        c.date,
        c.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(keyword);
    });
  }, [investmentCards, userId, q]);
  const stats = useMemo(() => {
    const totalDeposit = investorCards.reduce(
      (sum, c) => sum + Number(c?.investment_amount || 0),
      0,
    );
    const activeCount = investorCards.filter(
      (c) => String(c?.status || "").toLowerCase() === "running",
    ).length;

    return {
      totalDeposit,
      activeCount,
      totalCards: investorCards.length,
    };
  }, [investorCards]);

  const totalPages = Math.max(1, Math.ceil(investorCards.length / PAGE_SIZE));

  const pagedCards = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return investorCards.slice(start, start + PAGE_SIZE);
  }, [investorCards, page]);

  // query পরিবর্তনে page 1 এ ফেরত
  React.useEffect(() => {
    setPage(1);
  }, [q, userId]);

  if (isUsersLoading || isInvestmentCardsLoading ) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isUsersError || isInvestmentCardsError ) {
    return (
      <NoDataFound
        message="ডাটা লোড করা যায়নি"
        subMessage="পরে আবার চেষ্টা করুন"
      />
    );
  }

  if (!userId || !investor) {
    return (
      <div className="pt-5 pb-7 px-5">
        <BackButton />
        <div className="mt-6">
          <NoDataFound
            message="Investor পাওয়া যায়নি"
            subMessage="user_id চেক করুন"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 pb-7 px-5">
      <div className="flex items-center gap-5">
        <BackButton />
        <Link
  to={`https://management.supplylinkbd.com/login?id=${investor?.id}&password=${investor?.password}`}
          className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-gray-600 px-6 font-medium text-neutral-200 mb-3 gap-2"
        >
          <div className="mr-0 w-0 -translate-x-[100%] opacity-0 transition-all duration-200 group-hover:mr-1 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100">
            <FaUserCircle className="text-lg" />
          </div>

          <span>Investor Login</span>
        </Link>
      </div>
      {/* Header Card */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
            {(investor?.name || "I").slice(0, 1)}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">
              {investor?.name || "Investor"}
            </h1>

            <div className="mt-1 text-sm text-white/60">
              {investor?.phone || "-"}
            </div>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300 border border-emerald-400/20">
              {String(investor?.status || "Active").toLowerCase() === "active"
                ? "Active Investor"
                : "Inactive Investor"}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <div className="text-xs text-white/50">Investor ID</div>
            <div className="text-white font-semibold">{investor?.id}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-white/50">Total Deposit</div>
            <div className="mt-1 text-white font-semibold">
              {money(stats.totalDeposit)}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-white/50">Active Cards</div>
            <div className="mt-1 text-white font-semibold">
              {stats.activeCount}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-white/50">Total Cards</div>
            <div className="mt-1 text-white font-semibold">
              {stats.totalCards}
            </div>
          </div>
        </div>
      </div>

      {/* Search + List */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1">
            <div className="text-sm text-white/70 mb-1">Search Cards</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="card no / note / amount / date ..."
              className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-400/40"
            />
          </div>

          <div className="md:w-[220px]">
            <div className="text-sm text-white/70 mb-1">Showing</div>
            <div className="rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white/80">
              {investorCards.length} items
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {pagedCards.length === 0 ? (
            <div className="col-span-full">
              <NoDataFound
                message="কোনো investment card নেই"
                subMessage="সার্চ ফিল্টার ক্লিয়ার করে দেখুন"
              />
            </div>
          ) : (
            pagedCards.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">
                      {c.title || `Card #${c.id}`}
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                      start date: {c.start_date}
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                      Maturity date {c.start_date}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      String(c.status || "").toLowerCase() === "active"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
                        : "bg-amber-500/15 text-amber-300 border-amber-400/20"
                    }`}
                  >
                    {c.status || "N/A"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-[11px] text-white/50">Deposit</div>
                    <div className="mt-1 text-sm text-white font-semibold">
                      {money(c.investment_amount)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-[11px] text-white/50">
                      Weight Value
                    </div>
                    <div className="mt-1 text-sm text-white font-semibold">
                      {c.total_time_wighted_value || "-"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-[11px] text-white/50">Card Type</div>
                    <div className="mt-1 text-sm text-white font-semibold">
                      {c.payment_type || "-"}
                    </div>
                  </div>
                </div>

                {c.note ? (
                  <div className="mt-3 text-sm text-white/70 line-clamp-2">
                    {c.note}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {investorCards.length > PAGE_SIZE ? (
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-sm text-white/60">
              Page <span className="text-white">{page}</span> /{" "}
              <span className="text-white">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 disabled:opacity-40"
              >
                Prev
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InvestorDetailsWithId;
