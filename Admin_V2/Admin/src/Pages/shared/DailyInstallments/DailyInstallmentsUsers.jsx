import React, { useMemo, useState } from "react";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useUsers from "../../../utils/Hooks/useUsers";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Provider/AuthProvider";

const DailyInstallmentsUsers = () => {
  const {
    isCustomerInstallmentsCardsLoading,
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
  } = useCustomerInstallmentCards();

  const { isUsersLoading, users, isUsersError } = useUsers();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [errors, setErrors] = useState({});
  const allowedRoles = ["staff", "manager"];
  const {user} = useAuth()

const hasPermission = user?.role?.some(role =>
  allowedRoles.includes(role)
);

  const validate = () => {
    let newErrors = {};

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    }

    // if (!formData.receiver) {
    //   newErrors.receiver = "Receiver is required";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const DailyInstallmentsCards = useMemo(() => {
    return (customerInstallmentCards || []).filter(
      (card) => card.remarks === "Daily",
    );
  }, [customerInstallmentCards]);

  // Merge card + customer
  const cardsWithCustomer = useMemo(() => {
    if (!DailyInstallmentsCards || !users) return [];

    return DailyInstallmentsCards.map((card) => {
      const customer = users.find((user) => user.id === card.user_id);

      return {
        ...card,
        customer: customer || null,
      };
    });
  }, [DailyInstallmentsCards, users]);
  // const filteredCards = useMemo(() => {
  //   if (!search) return cardsWithCustomer;

  //   const term = search.toLowerCase();

  //   return cardsWithCustomer.filter((card) => {
  //     return (
  //       card.customer?.name?.toLowerCase().includes(term) ||
  //       String(card.id).includes(term) ||
  //       String(card.customer?.id).includes(term) ||
  //       card.customer?.mobile?.includes(term)
  //     );
  //   });
  // }, [search, cardsWithCustomer]);

  const filteredCards = useMemo(() => {
  let result = cardsWithCustomer;

  if (search) {
    const term = search.toLowerCase();

    result = result.filter((card) => {
      return (
        card.customer?.name?.toLowerCase().includes(term) ||
        String(card.id).includes(term) ||
        String(card.customer?.id).includes(term) ||
        card.customer?.mobile?.includes(term)
      );
    });
  }

  // ✅ Sort: Fully Paid last
  return result.sort((a, b) => {
    if (a.status === "Fully Paid" && b.status !== "Fully Paid") return 1;
    if (a.status !== "Fully Paid" && b.status === "Fully Paid") return -1;
    return 0;
  });
}, [search, cardsWithCustomer]);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const handleSubmitFrom = async (e) => {
    e.preventDefault();

    if (!validate()) return;
if (!hasPermission) {
  toast.error("আপনি payment receive করতে পারবেন না ❌");
  return;
}
    const payload = {
      userId: selectedCard?.customer?.id,
      cardId: selectedCard?.id,
      amount: formData.amount,
      date: today,
       receiver: user?.id, 
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/DailyInstallments/addDailyInstallment.php`,
        payload,
      );

      const data = res.data;
      if (data.success) {
        toast.success("Payment Added সফল হয়েছে ✅");

        // reset
        setFormData({
          amount: "",
          date: "",
        });

        setShowModal(false);
      } else {
        
        toast.error("Failed ❌");
      }
    } catch (err) {

      toast.error("Server error ❌");
    }
  };

  if (isCustomerInstallmentsCardsError || isUsersError) {
    return <p>Error loading data</p>;
  }


  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-white">
            Daily Installments
          </h1>
          <p className="text-sm text-gray-400">
            Manage and track all daily customer payments
          </p>
        </div>

          {/* Search */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="🔍 Search by name, card ID, user ID, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* 🔥 Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0f172a] border border-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Cards</p>
          <h2 className="text-white text-lg font-bold">
            {filteredCards.length}
          </h2>
        </div>

      </div>

      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.length === 0 && (
          <p className="text-gray-400 text-center col-span-full mt-10">
            No results found 😔
          </p>
        )}

        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0f172a] hover:bg-[#111827] transition-all duration-300 rounded-2xl p-5 border border-gray-800 hover:shadow-xl"
          >
            {/* Top */}
            <div className="flex justify-between gap-6">
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    src={
                      card.customer?.photo
                        ? `https://management.supplylinkbd.com/${card.customer.photo}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            card?.customer?.name || "User",
                          )}&background=4f46e5&color=fff`
                    }
                    alt="customer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></span>
                </div>

                <div>
                  <h3 className="font-semibold text-white text-base">
                    {card.customer?.name || "Unknown User"}
                  </h3>

                  <p className="text-xs text-gray-400">
                    ID: {card.customer?.id || "N/A"}
                  </p>

                  <span className="inline-block mt-1 bg-green-900/40 text-green-400 px-2 py-[2px] text-xs rounded-full">
                    {card.remarks}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-indigo-400">
                  ৳{card.sale_price}
                </p>
                <p className="text-xs text-gray-500">Installment</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 my-4"></div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-400">
              <p>📌 Card: {card.id}</p>
              <p>📞 {card.customer?.mobile || "N/A"}</p>
              <p className="truncate">📍 {card.customer?.address || "N/A"}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Link
                to={`${card?.id}`}
                className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition active:scale-95 shadow-md hover:shadow-indigo-500/30"
              >
                Details
              </Link>
            {/* <button
disabled={!hasPermission || card.status === "Fully Paid"}  onClick={() => {
    if (card.status === "Fully Paid") return; // extra safety
    setSelectedCard(card);
    setShowModal(true);
  }}
  className={`px-4 py-1.5 text-xs rounded-lg border transition active:scale-95
    ${
      card.status === "Fully Paid"
        ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
        : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
    }
  `}
>
  {card.status === "Fully Paid" ? "Paid" : "Pay"}
</button> */}
<button
  onClick={() => {
    if (card.status === "Fully Paid") return;

    if (!hasPermission) {
      toast.error("আপনি payment receive করতে পারবেন না ❌");
      return;
    }

    setSelectedCard(card);
    setShowModal(true);
  }}
  className={`px-4 py-1.5 text-xs rounded-lg border transition active:scale-95
    ${
      card.status === "Fully Paid"
        ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
        : !hasPermission
        ? "bg-red-900 text-red-400 border-red-700 hover:bg-red-800"
        : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
    }
  `}
>
  {card.status === "Fully Paid"
    ? "Paid"
    : !hasPermission
    ? "No Access"
    : "Pay"}
</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div
            className="relative bg-[#0f172a] w-full max-w-md rounded-2xl p-6 border border-gray-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 🔥 IMPORTANT
          >
            {" "}
            {/* Header */}
            <h2 className="text-lg font-semibold mb-2">কিস্তি এন্ট্রি</h2>
            <p className="text-sm text-gray-400 mb-4">
              User ID: {selectedCard?.customer?.id}
            </p>
            {/* Form */}
            <form onSubmit={handleSubmitFrom} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-sm text-gray-300">
                  টাকার পরিমাণ (৳) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="উদাহরণ: 500"
                  className={`w-full mt-1 px-4 py-2 rounded-lg bg-[#020617] border ${
                    errors.amount ? "border-red-500" : "border-gray-700"
                  } focus:outline-none`}
                />
                {errors.amount && (
                  <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
                )}
              </div>



              {/* Receiver */}
             

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-medium"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInstallmentsUsers;
