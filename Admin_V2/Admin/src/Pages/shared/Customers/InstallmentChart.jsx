import React, { useMemo, useState } from "react";
import CustomerOrderInfo from "../../../components/Chart/CustomerOrderInfo";
import { InstallmentRow } from "../../../components/Chart/InstallmentRow";
import { useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";
import BackButton from "../../../components/BackButton/BackButton";
import useUsers from "../../../utils/Hooks/useUsers";
import { useAuth } from "../../../Provider/AuthProvider";

const InstallmentChart = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get("cardId");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const {
    isCustomerInstallmentsPaymentsLoading,
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
    refetch
  } = useCustomerInstallmentPayments();
  const {
    isCustomerInstallmentsCardsLoading,
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
  } = useCustomerInstallmentCards();
  const currentCard = customerInstallmentCards?.find(
    (card) => card.id === Number(cardId),
  );
  const InstallmentPayments = customerInstallmentPayments.filter(
    (payment) => payment.card_id === Number(cardId),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installmentType, setInstallmentType] = useState("");
  const [hasDownPayment, setHasDownPayment] = useState(false);

  // const companyStaff = useMemo(() => {
  //   const allowed = ["developer", "manager", "admin", "staff"];
  //   return allowed.includes(users?.role);
  // }, [users]);
  const { users = [] } = useUsers(); // all users
  const userId = currentCard?.user_id;

  const isCompanyStaff = useMemo(() => {
    const user = users.find((u) => Number(u.id) === Number(userId));
    if (!user || !Array.isArray(user.roles)) return false;

    const allowed = ["developer", "manager", "admin", "staff"];
    return user.roles.some((r) => allowed.includes(r));
  }, [users, userId]);
  const isLoading =
    isCustomerInstallmentsCardsLoading || isCustomerInstallmentsPaymentsLoading;
  const isError =
    isCustomerInstallmentsCardsError || isCustomerInstallmentsPaymentsError;
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <NoDataFound />;
  }

  return (
    <div className="mx-auto space-y-8">
      <BackButton />
      <CustomerOrderInfo currentCard={currentCard} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* ===== Title ===== */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white flex items-center gap-2">
            <span className="text-blue-400">📋</span>
            কিস্তি কার্ড: {cardId} এর তালিকা
          </h2>
        </div>

        {/* ===== Button ===== */}
        {InstallmentPayments?.length <= 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="iw-full flex items-center justify-center gap-2
                 rounded-xl px-4 py-2.5
                 bg-gradient-to-r from-blue-600/90 to-indigo-600/90
                 text-sm font-semibold text-white
                 shadow-md shadow-blue-900/30
                 hover:from-blue-500 hover:to-indigo-500
                 hover:shadow-blue-900/50
                 focus:outline-none focus:ring-2 focus:ring-blue-500/40
                 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus /> নতুন কিস্তি
          </button>
        )}
      </div>

      <InstallmentRow
        card={currentCard}
        installmentType={installmentType}
        hasDownPayment={hasDownPayment}
        InstallmentPayments={InstallmentPayments}
        onSaveSuccess={() => setShowSaveButton(false)}
        user={user}
        refetch={refetch}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                নতুন কিস্তি সেটআপ
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Installment Type */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">
                কিস্তির ধরন (একটি নির্বাচন করুন)
              </p>

              <label className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="installment"
                  value="6"
                  checked={installmentType === "6"}
                  onChange={() => setInstallmentType("6")}
                />
                <span className="text-gray-200">৬ মাস কিস্তি</span>
              </label>

              <label className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="installment"
                  value="12"
                  checked={installmentType === "12"}
                  onChange={() => setInstallmentType("12")}
                />
                <span className="text-gray-200">১২ মাস কিস্তি</span>
              </label>
              {isCompanyStaff && (
                <label className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="installment"
                    value="18"
                    checked={installmentType === "18"}
                    onChange={() => setInstallmentType("18")}
                  />
                  <span className="text-gray-200">১৮ মাস কিস্তি</span>
                </label>
              )}
              {isCompanyStaff && (
                <label className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="installment"
                    value="24"
                    checked={installmentType === "24"}
                    onChange={() => setInstallmentType("24")}
                  />
                  <span className="text-gray-200">২৪ মাস কিস্তি</span>
                </label>
              )}

              <label className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  checked={hasDownPayment}
                  onChange={(e) => setHasDownPayment(e.target.checked)}
                />
                <span className="text-gray-200"> Down Payment আছে</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-xl px-4 py-2 text-sm font-medium
                     bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              >
                বাতিল
              </button>

              <button
                disabled={!installmentType}
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="w-full rounded-xl px-4 py-2 text-sm font-semibold
                     bg-gradient-to-r from-blue-600 to-indigo-600
                     text-white hover:from-blue-500 hover:to-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentChart;
