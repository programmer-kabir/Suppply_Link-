import React from "react";
import currentUser from "../Utils/currentUser";
import useCustomerInstallmentCards from "../Utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../Utils/Hooks/useCustomerInstallmentPayments";
import CustomerCardView from "../components/Cards/CustomerCardView";
import Loader from "../components/Loader/Loader";

const CustomerHome = () => {
  const runningUser = currentUser();
  const {
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
    isCustomerInstallmentsCardsLoading,
  } = useCustomerInstallmentCards();
  const {
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
    isCustomerInstallmentsPaymentsLoading,
  } = useCustomerInstallmentPayments();

  if (
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading
  ) {
    return (
      <div className="text-center  h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (isCustomerInstallmentsCardsError || isCustomerInstallmentsPaymentsError) {
    return (
      <div className="px-20 py-10 text-center text-red-600">
        Something went wrong. Please try again later.
      </div>
    );
  }

  const myCards =
    customerInstallmentCards?.filter(
      (card) => Number(card.user_id) === Number(runningUser?.id)
    ) || [];
  const myCardsWithPayments = myCards.map((card) => {
    const payments =
      customerInstallmentPayments?.filter(
        (payment) => Number(payment.card_id) === Number(card.id)
      ) || [];

    const installments = payments.filter((p) => p.installment_no > 0);
    const paidCount = installments.filter((p) => p.status === "Paid").length;

    const progress = Math.round(
      (paidCount / Number(card.installment_count)) * 100
    );
    return {
      ...card,
      payments,
      progress,
    };
  });

  if (myCardsWithPayments.length === 0) {
    return (
      <div className="px-20 py-10 text-center text-gray-500">
        No installment cards found.
      </div>
    );
  }
  // 🔥 STATUS BASED SORTING
  const runningCards = myCardsWithPayments.filter(
    (card) => card.status !== "Fully Paid"
  );

  const completedCards = myCardsWithPayments.filter(
    (card) => card.status === "Fully Paid"
  );

  const sortedCards = [...runningCards, ...completedCards];

  return (
    <div className="md:px-20 py-10 px-3 ">
      {sortedCards.map((card) => (
        <CustomerCardView user={runningUser} key={card.id} card={card} />
      ))}
    </div>
  );
};

export default CustomerHome;
