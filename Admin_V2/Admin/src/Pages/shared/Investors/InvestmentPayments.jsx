import React, { useEffect, useMemo, useState } from "react";
import useInvestmentCards from "../../../utils/Investors/useInvestmentCards";
import { useSearchParams } from "react-router-dom";
import useInvestInstallment from "../../../utils/Investors/useInvestInstallment";
import { toast } from "react-toastify";
import useUsers from "../../../utils/Hooks/useUsers";
import NoDataFound from "../../../components/NoData/NoDataFound";
import BackButton from "../../../components/BackButton/BackButton";
import Loader from "../../../components/Loader/Loader";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useAuth } from "../../../Provider/AuthProvider";
import { MONTHS } from "../../../../public/month";

const InvestmentPayments = () => {
  const [searchParams] = useSearchParams();
  const cardIdRaw = searchParams.get("card_id");
  const cardId = Number(cardIdRaw);
  const [installmentNo, setInstallmentNo] = useState("");
  const [amount, setAmount] = useState("");
  const { user } = useAuth();

  // edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [update_reason,setUpdate_reason] =  useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const { investmentCards, isInvestmentCardsLoading, isInvestmentCardsError } =
    useInvestmentCards();

  const {
    investInstallments,
    inInvestInstallmentsLoading,
    isInvestInstallmentsError,
    refetch,
  } = useInvestInstallment();

  const { users, isUsersLoading, isUsersError } = useUsers();

  const card = useMemo(
    () => investmentCards.find((c) => String(c.id) === String(cardId)),
    [investmentCards, cardId],
  );

  const cardInvestInstallments = useMemo(
    () =>
      investInstallments.filter(
        (i) => String(i.investment_card_no) === String(cardId),
      ),
    [investInstallments, cardId],
  );
  const filteredInstallments = useMemo(() => {
    let data = [...cardInvestInstallments];

    if (filterType === "date" && filterDate) {
      data = data.filter((item) => item.investment_date === filterDate);
    }

    if (filterType === "month" && filterMonth) {
      data = data.filter((item) => {
        const date = new Date(item.investment_date);

        return (
          date.getMonth() + 1 === Number(filterMonth) &&
          date.getFullYear() === Number(filterYear)
        );
      });
    }

    if (filterType === "year" && filterYear) {
      data = data.filter((item) => {
        const date = new Date(item.investment_date);
        return date.getFullYear() === Number(filterYear);
      });
    }

    return data;
  }, [cardInvestInstallments, filterType, filterDate, filterMonth, filterYear]);
  const totalFilteredAmount = useMemo(() => {
    return filteredInstallments.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
  }, [filteredInstallments]);
  const mergedInvestmentCards = useMemo(
    () => users.find((user) => user?.id === card?.investor_id),
    [users, card?.investor_id],
  );

  useEffect(() => {
    if (cardInvestInstallments?.length > 0) {
      const lastInstallmentNo = Math.max(
        ...cardInvestInstallments.map((item) => Number(item.investment_no)),
      );
      setInstallmentNo(lastInstallmentNo + 1);
    } else {
      setInstallmentNo(1);
    }
  }, [cardInvestInstallments]);

  const inputClass = `
    w-full rounded-lg px-3 py-2 text-sm
    bg-[#0f1b2d] text-slate-100
    border border-white/10
    focus:outline-none focus:ring-2 focus:ring-sky-500/60
    placeholder:text-slate-400
    transition
  `;

  const primaryBtn = `
    rounded-lg px-4 py-2 text-sm font-medium
    bg-gradient-to-r from-sky-500 to-blue-600
    hover:from-sky-400 hover:to-blue-500
    text-white
    shadow-md shadow-sky-500/20
    transition
  `;

  const iconBtn = `
  inline-flex items-center justify-center
  rounded-lg
  border border-white/10
  bg-white/5 hover:bg-white/10
  transition active:scale-95
`;

  const iconBtnDanger = `
  inline-flex items-center justify-center
  rounded-lg
  border border-red-400/20
  bg-red-500/10 hover:bg-red-500/20
  text-red-200
  transition active:scale-95
`;

  const handleInvestInstallments = async () => {
    if (!installmentNo) return toast.error("কিস্তি নং দিতে হবে");
    if (!amount) return toast.error("পরিমাণ দিতে হবে");
    if (Number(amount) <= 0)
      return toast.error("পরিমাণ অবশ্যই ০ এর বেশি হতে হবে");
    if (!card?.id || !card?.investor_id)
      return toast.error("কার্ড তথ্য পাওয়া যায়নি");
    const today = new Date().toISOString().split("T")[0];
    const data = {
      investment_card_no: Number(card?.id),
      investor_id: Number(card?.investor_id),
      installment_no: Number(installmentNo),
      installment_date: today,
      amount: Number(amount),
      signature_by: user?.id,
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/investors/insert_investment_installment.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "কিছু একটা সমস্যা হয়েছে");
        return;
      }

      toast.success(`${card?.card_name} এর বিনিয়োগ কিস্তি সফলভাবে যোগ হয়েছে`);
      refetch();
      setAmount("");
    } catch (error) {
      toast.error("সার্ভারে সমস্যা হয়েছে");
    }
  };

  // ✅ Edit modal open
  const openEditModal = (row) => {
    setEditingRow(row);
    setEditDate(row?.investment_date || "");
    setEditAmount(String(row?.amount ?? ""));
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingRow(null);
      setUpdate_reason("");
  };

  // ✅ TODO: update api call
  const handleUpdate = async () => {
    if (!editingRow?.id) return;
    if (!editDate) return toast.error("তারিখ দিতে হবে");
    if (!editAmount || Number(editAmount) <= 0)
      return toast.error("সঠিক পরিমাণ দিন");
if (!update_reason.trim()) {
  return toast.error("Update reason লিখতে হবে");
}
    const payload = {
      id: Number(editingRow.id),
      investment_date: editDate,
      amount: Number(editAmount),
      updated_by: user?.id,
      update_reason,
    };
    try {
      // ✅ তোমার update endpoint এখানে বসাও
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/investors/update_investment_installment.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();

      if (!result?.success) {
        toast.error(result?.error || "Update করা যায়নি");
        return;
      }

      toast.success("Installment update হয়েছে");
      closeEditModal();
      refetch();
    } catch (e) {
      toast.error("Server error");
    }
  };

  // ✅ Delete confirm + API
  const handleDelete = async (row) => {
    const ok = await Swal.fire({
      title: "Delete করবেন?",
      text: `Installment #${row?.investment_no} delete করলে আর ফিরে পাবেন না`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      background: "#0b1220",
      color: "#e5e7eb",
    });

    if (!ok.isConfirmed) return;

    try {
      // ✅ তোমার delete endpoint এখানে
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/investors/delete_investment_installment.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: Number(row.id) }),
        },
      );
      const result = await res.json();

      if (!result?.success) {
        toast.error(result?.error || "Delete করা যায়নি");
        return;
      }

      toast.success("Installment delete হয়েছে");
      refetch();
    } catch (e) {
      toast.error("Server error");
    }
  };
  if (
    inInvestInstallmentsLoading ||
    isUsersLoading ||
    isInvestmentCardsLoading
  ) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isInvestInstallmentsError || isUsersError || isInvestmentCardsError) {
    return (
      <NoDataFound
        message="ডাটা লোড করা যায়নি"
        subMessage="পরে আবার চেষ্টা করুন"
      />
    );
  }
  const targetRoles = ["developer", "staff", "manager", "admin"];
  const userRole =
    targetRoles.find((role) => user.role?.includes(role)) || "no valid role";

  const showAction = userRole !== "staff";

  const cols = showAction
    ? "grid-cols-[40px_90px_90px_1fr_96px] md:grid-cols-[180px_160px_140px_1fr_120px]"
    : "grid-cols-[40px_90px_90px_1fr]      md:grid-cols-[200px_200px_200px_1fr]";

  const formatMoney = (v) =>
    Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8  page-content">
        <BackButton />

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Installment Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            বিনিয়োগকারীর কিস্তি ব্যবস্থাপনা
          </p>
        </div>

        {/* Investor Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded p-5 flex items-center gap-4">
          <img
            src={`https://management.supplylinkbd.com/${mergedInvestmentCards?.photo}`}
            alt="investor"
            className="w-14 h-14 rounded-full border border-white/20 p-1 object-cover"
          />
          <div>
            <p className="text-xs text-slate-400">বিনিয়োগকারীর নাম</p>
            <p className="text-base font-medium text-white">
              {card?.card_name}
            </p>
          </div>
        </div>

        {/* Add Installment */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded p-6">
          <h2 className="text-sm font-semibold text-white mb-4">
            কিস্তি যোগ করুন
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="কিস্তি নং"
              value={installmentNo}
              onChange={(e) => setInstallmentNo(e.target.value)}
              className={inputClass}
            />
            {/* <input
            type="date"
            value={installmentDate}
            onChange={(e) => setInstallmentDate(e.target.value)}
            className={`${inputClass} date-fix`}
          /> */}
            <input
              type="text"
              placeholder="পরিমাণ"
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              onClick={handleInvestInstallments}
              className={`${primaryBtn} `}
            >
              + যুক্ত করুন
            </button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={inputClass}
            >
              <option value="all">All</option>
              <option value="date">Date Wise</option>
              <option value="month">Month Wise</option>
              <option value="year">Year Wise</option>
            </select>

            {filterType === "date" && (
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className={inputClass}
              />
            )}

            {filterType === "month" && (
              <>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Month</option>
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  placeholder="Year"
                  className={inputClass}
                />
              </>
            )}

            {filterType === "year" && (
              <input
                type="number"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                placeholder="Year"
                className={inputClass}
              />
            )}

            <div className="ml-auto flex items-end gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Amount</p>
                <p className="text-lg font-bold text-green-400">
                  ৳ {formatMoney(totalFilteredAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          {/* ✅ mobile: scroll only when showAction=true | md+: never scroll */}
          <div
            className={`${showAction ? "overflow-x-auto" : "overflow-x-hidden"} md:overflow-x-hidden`}
          >
            {/* ✅ mobile: only set min-width when showAction=true (so it can scroll) */}
            <div
              className={`${showAction ? "min-w-[520px]" : "min-w-0"} md:min-w-0`}
            >
              {/* Head */}
              <div
                className={`grid ${cols}
        text-[11px] md:text-xs font-semibold text-slate-300
        bg-white/5 px-3 md:px-5 py-3`}
              >
                <div className="opacity-90">নং</div>
                <div className="opacity-90">তারিখ</div>
                <div className="opacity-90 text-right">পরিমাণ</div>
                <div className="opacity-90 text-center">স্বাক্ষর</div>
                {showAction && (
                  <div className="opacity-90 text-right no-print">Action</div>
                )}
              </div>

              {/* Body */}
              {filteredInstallments?.length === 0 ? (
                <div className="px-5 py-10 text-center text-slate-400 text-sm">
                  কোনো কিস্তি পাওয়া যায়নি
                </div>
              ) : (
                filteredInstallments?.map((row) => (
                  <div
                    key={row.id}
                    className={`grid ${cols} items-center
            px-3 md:px-5 py-3.5 md:py-4
            text-sm text-white border-t border-white/10`}
                  >
                    <div className="text-white/90">{row?.investment_no}</div>

                    <div className="text-white/85 whitespace-nowrap">
                      {row?.investment_date}
                    </div>

                    <div className="font-semibold text-right tabular-nums whitespace-nowrap">
                      {formatMoney(row?.amount)}
                    </div>

                    <div className="flex items-center justify-center">
                      {/* <img
                      src={getSignatureByName(row?.signature_by)}
                      alt="signature"
                      className="h-6 md:h-8 object-contain brightness-200 invert"
                    /> */}
                      <p>{row?.signature_by}</p>
                    </div>

                    {showAction && (
                      <div className="flex items-center justify-end gap-1.5 md:gap-2 no-print">
                        <button
                          title="Edit"
                          onClick={() => openEditModal(row)}
                          className={`${iconBtn} w-8 h-8 md:w-9 md:h-9`}
                        >
                          <FiEdit2 className="text-white/80 text-[14px] md:text-[16px]" />
                        </button>

                        <button
                          title="Delete"
                          onClick={() => handleDelete(row)}
                          className={`${iconBtnDanger} w-8 h-8 md:w-9 md:h-9`}
                        >
                          <FiTrash2 className="text-[14px] md:text-[16px]" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ✅ Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
              onClick={closeEditModal}
              className="absolute inset-0 bg-black/60"
            />

            {/* modal box */}
            <div className="relative w-[92%] max-w-lg rounded-2xl border border-white/10 bg-[#0b1220] p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Edit Installment
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Installment #{editingRow?.investment_no}
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className={`${inputClass} date-fix`}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    পরিমাণ
                  </label>
                  <input
                    type="text"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className={inputClass}
                  />
                </div>

               <div>
  <label className="block text-xs text-slate-400 mb-1">
    Update Reason
  </label>

  <textarea
    rows={3}
    value={update_reason}
    onChange={(e) => setUpdate_reason(e.target.value)}
    placeholder="Update করার কারণ লিখুন..."
    className={inputClass}
  />
</div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={closeEditModal}
                    className="rounded-lg px-4 py-2 text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition"
                  >
                    Cancel
                  </button>
                  <button onClick={handleUpdate} className={primaryBtn}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InvestmentPayments;
