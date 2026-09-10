import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import Loader from "../../../components/Loader/Loader";
import useUsers from "../../../utils/Hooks/useUsers";
import CustomerCardView from "../../../components/Dashboard/CustomerCardView";
import BackButton from "../../../components/BackButton/BackButton";
import useCustomerGranter from "../../../utils/Granters/useCustomerGranter";
import CustomerDetailsPrintView from "../../../components/Dashboard/Customer/CustomerDetailsPrintView/CustomerDetailsPrintView";

const CustomerDetails = () => {
  const [showPrint, setShowPrint] = useState(false);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const { users = [], isUsersError, isUsersLoading } = useUsers();
  const user = users.find((u) => Number(u.id) === Number(userId));
  const {
    customerInstallmentCards = [],
    isCustomerInstallmentsCardsError,
    isCustomerInstallmentsCardsLoading,
  } = useCustomerInstallmentCards();

  const {
    customerInstallmentPayments = [],
    isCustomerInstallmentsPaymentsError,
    isCustomerInstallmentsPaymentsLoading,
  } = useCustomerInstallmentPayments();

  const {
    CustomerGranter = [],
    isCustomerGranterError,
    isCustomerGranterLoading,
  } = useCustomerGranter();

  const runningUserGranter = CustomerGranter.find(
    (granter) => Number(granter.customer_user_id) === Number(userId),
  );
  const granterId = runningUserGranter?.guarantor_user_id;
  const granter = users.find((u) => Number(u.id) === Number(granterId));

  if (
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading ||
    isCustomerGranterLoading ||
    isUsersLoading
  ) {
    return (
      <div className="text-center min-h-[60vh] w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (
    isCustomerInstallmentsCardsError ||
    isCustomerInstallmentsPaymentsError ||
    isCustomerGranterError ||
    isUsersError
  ) {
    return (
      <div className="px-5 md:px-20 py-10 text-center text-red-600">
        Something went wrong. Please try again later.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-5 md:px-20 py-10 text-center text-red-600">
        User not found.
      </div>
    );
  }

  const myCards =
    customerInstallmentCards.filter(
      (card) => Number(card.user_id) === Number(user.id),
    ) || [];

  const myCardsWithPayments = myCards.map((card) => {
    const payments =
      customerInstallmentPayments.filter(
        (payment) => Number(payment.card_id) === Number(card.id),
      ) || [];

    // ✅ down payment সহ progress (consistent)
    const downPayment = payments.find((p) => Number(p.installment_no) === 0);
    const hasDown = !!downPayment;
    const regular = payments.filter((p) => Number(p.installment_no) > 0);
    const all = hasDown ? [downPayment, ...regular] : regular;

    const paidCount = all.filter((p) => p.status === "Paid").length;
    const total = Number(card.installment_count) + (hasDown ? 1 : 0);
    const progress = total ? Math.round((paidCount / total) * 100) : 0;

    return { ...card, payments, progress };
  });

  if (myCardsWithPayments.length === 0) {
    return (
      <div className="px-5 md:px-20 py-10 text-center text-gray-500">
        No installment cards found.
      </div>
    );
  }

  // ✅ Running first, then completed
  const runningCards = myCardsWithPayments.filter(
    (card) => card.status !== "Fully Paid",
  );
  const completedCards = myCardsWithPayments.filter(
    (card) => card.status === "Fully Paid",
  );
  const sortedCards = [...runningCards, ...completedCards];

  // ✅ PRINT VIEW
  if (showPrint) {
    return (
      <CustomerDetailsPrintView
        user={user}
        granter={granter}
        cards={sortedCards}
        onClose={() => setShowPrint(false)}
        minRows={0} 
        users={users}
      />
    );
  }

  return (
    <div className="pt-5 pb-7 px-5">
      <div className="flex items-center justify-between mb-4">
        <BackButton />

        <button
          onClick={() => setShowPrint(true)}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          🖨️ Print View
        </button>
      </div>

      <div
        className="w-full space-y-1.5 px-3 py-3 rounded-md mb-5 mt-5"
        style={{
          backgroundColor: "#182337",
          border: "1px solid #0f1d3a",
          boxShadow: "0 0 0 1px rgba(56,189,248,0.05)",
          color: "#e5e7eb",
        }}
      >
        <p className="text-sm">
          🆔 {user?.id} {user?.name}
        </p>
        <p className="text-sm text-gray-300">📞 {user?.mobile}</p>
        <p className="text-sm text-gray-400">📍 {user?.address}</p>
      </div>

      {sortedCards.map((card) => (
        <CustomerCardView user={user} key={card.id} card={card} />
      ))}
    </div>
  );
};

export default CustomerDetails;
