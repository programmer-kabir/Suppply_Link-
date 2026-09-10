import React, { useMemo, useState } from "react";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useUsers from "../../../utils/Hooks/useUsers";
import {
  FaUser,
  FaPhoneAlt,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import { FaChartLine, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";
import { useAuth } from "../../../Provider/AuthProvider";
import BackButton from "../../../components/BackButton/BackButton";

const InstallmentCards = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

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
  const { isUsersLoading, users, isUsersError } = useUsers();

  const cardsWithCustomer = useMemo(() => {
    if (!customerInstallmentCards || !users) return [];

    return customerInstallmentCards?.map((card) => {
      const customer = users?.find((user) => user?.id === card?.user_id);

      return {
        ...card,
        customer: customer || null,
      };
    });
  }, [customerInstallmentCards, users]);
  const paymentCardMap = useMemo(() => {
    if (!customerInstallmentPayments?.length) return {};

    return customerInstallmentPayments.reduce((acc, payment) => {
      const cardId = String(payment?.card_id);
      acc[cardId] = true;
      return acc;
    }, {});
  }, [customerInstallmentPayments]);
  const filteredCards = useMemo(() => {
    if (!search.trim()) return cardsWithCustomer;

    const q = search.toLowerCase();

    return cardsWithCustomer.filter((item) => {
      return (
        item.card_number?.toLowerCase().includes(q) ||
        item.product_name?.toLowerCase().includes(q) ||
        String(item.customer?.id || "").includes(q)
      );
    });
  }, [search, cardsWithCustomer]);
  const statusPriority = {
    Running: 1,
    Overdue: 2,
    "Fully Paid": 3,
  };
  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      return statusPriority[a.status] - statusPriority[b.status];
    });
  }, [filteredCards]);
  const statusCount = useMemo(() => {
  return sortedCards.reduce(
    (acc, item) => {
      if (item.status === "Running") acc.running++;
      if (item.status === "Fully Paid") acc.fullyPaid++;
      return acc;
    },
    { running: 0, fullyPaid: 0 }
  );
}, [sortedCards]);
  // if (
  //   isCustomerInstallmentsCardsLoading ||
  //   isUsersLoading ||
  //   isCustomerInstallmentsPaymentsLoading
  // ) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  if (
    isCustomerInstallmentsCardsError ||
    isUsersError ||
    isCustomerInstallmentsPaymentsError
  ) {
    return (
      <NoDataFound message="No Card Found" subMessage="Please Try again" />
    );
  }
  const currentUser = users?.find((u) => u.id === user.id);
  const statusStyles = {
    Running: "bg-blue-900/30 text-blue-300",
    "Fully Paid": "bg-emerald-900/30 text-emerald-300",
    Overdue: "bg-red-900/30 text-red-300",
  };
  return (
    <div className="w-full">
      <div className="mb-6 w-full flex gap-4 justify-end items-center">
                <div className="lg:flex gap-4 hidden">
  <div className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
    Running: {statusCount.running}
  </div>

  <div className="bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded text-xs">
    Fully Paid: {statusCount.fullyPaid}
  </div>
</div>
        <div className="relative w-full max-w-md ">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Card No / User ID / Product"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl
                       bg-gray-900 border border-gray-800
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

      </div>

      <div className="">
        {/* Cards */}
        {filteredCards.length === 0 ? (
          <NoDataFound
            message="No Matching Card Found"
            subMessage="Try different Card No, User ID or Product"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCards.map((item) => (
              <div
              key={item?.id}
              className="cursor-pointer"
              
              >
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-800
                         bg-gradient-to-b from-gray-900 to-gray-950
                         p-5 hover:border-blue-500
                         hover:shadow-xl transition-all"
                >
                <Link to={`/customers/installment_cards/card_Details?cardId=${item?.id}`}>
                    {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Card No</p>
                      <p className="font-semibold text-white">
                        {item.card_number}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full
                  ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Product */}
                  <div className="mb-4 space-y-1">
                    <p className="flex items-center gap-2 text-gray-300 text-sm">
                      <FaBoxOpen className="text-gray-500" />
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Sale Type:{" "}
                      <span className="text-gray-200 font-medium">
                        {item.sale_type}
                      </span>
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="border-t border-gray-800 pt-3 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-300">
                      <FaUser className="text-gray-500" />
                      <span className="font-semibold">
                        ({item.customer?.id})
                      </span>{" "}
                      {item.customer?.name || "Unknown"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-400">
                      <FaPhoneAlt className="text-gray-500" />
                      {item.customer?.mobile || "N/A"}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="mt-3 space-y-1 text-xs text-gray-400">
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500" />
                      Delivery: {item.delivery_date || "—"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500" />
                      First Installment: {item.first_installment_date || "—"}
                    </p>
                  </div>

                </Link>
                  {/* ===== Action Area (fixed height) ===== */}
                  <div className="mt-auto h-[64px] flex items-end">
                    {currentUser?.role !== "staff" &&
                      item.status !== "Fully Paid" && (
                        <Link
                          // onMouseDown={saveInstallmentCardsScroll}
                          // onTouchStart={saveInstallmentCardsScroll}
                          to={`/customer/create_installment_chart?cardId=${item.id}`}
                          className="w-full"
                        >
                          <button
                            className="group w-full flex items-center justify-center gap-2
                     rounded-xl px-4 py-2.5
                     bg-gradient-to-r from-blue-600/90 to-indigo-600/90
                     text-sm font-semibold text-white
                     hover:from-blue-500 hover:to-indigo-500
                     transition-all"
                          >
                            <FaChartLine />
                            <span>
                              {paymentCardMap[String(item.id)]
                                ? "Update Installment Chart"
                                : "Create Installment Chart"}
                            </span>
                            <FaArrowRight className="group-hover:translate-x-1 transition" />
                          </button>
                        </Link>
                      )}
                  </div>
                </div>


                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallmentCards;
