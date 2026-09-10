import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import useUsers from "../../../utils/Hooks/useUsers";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import BackButton from "../../../components/BackButton/BackButton";
import { useAuth } from "../../../Provider/AuthProvider";
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
const DailyInstallmentsUsersDetails = () => {
  const { id } = useParams();

  const { users } = useUsers();
  const { user } = useAuth();
  const { customerInstallmentCards } = useCustomerInstallmentCards();
  const { customerInstallmentPayments } = useCustomerInstallmentPayments();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [updateReason, setUpdateReason] = useState("");
  // 🔥 CURRENT DATA
  const currentCard = customerInstallmentCards.find(
    (card) => Number(card.id) === Number(id),
  );

  const currentUser = users.find((user) => user.id === currentCard?.user_id);

  // 🔥 DAILY INSTALLMENTS API
  useEffect(() => {
    fetch(
      "https://management.supplylinkbd.com/apis/DailyInstallments/getDailyInstallments.php",
    )
      .then((res) => res.json())
      .then((res) => {
        const filtered = (res.data || []).filter(
          (item) => String(item.cardId) === String(id),
        );
        setData(filtered);
      });
  }, [id]);

  // 🔥 CALCULATIONS
  const totalPaid = useMemo(() => {
    return data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [data]);

  const totalInstallments = data.length;

  const expectedPayment = Number(currentCard?.sale_price || 0);

  const totalDue = expectedPayment - totalPaid;
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = search.toLowerCase();

      return (
        String(item.date).toLowerCase().includes(text) ||
        String(item.amount).toLowerCase().includes(text) ||
        String(item.receiver).toLowerCase().includes(text)
      );
    });
  }, [data, search]);
  const finalData = useMemo(() => {
    return [...filteredData].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [filteredData]);
  const currentMonth = new Date().getMonth(); // 0-11
  const currentYear = new Date().getFullYear();
  const currentCardPayments = customerInstallmentPayments?.filter(
    (card) => Number(card.card_id) === Number(currentCard?.card_number),
  );
  const thisMonthInstallments = useMemo(() => {
    return currentCardPayments.find((item) => {
      const d = new Date(item.due_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [currentCardPayments]);
  const thisMonthPayments = useMemo(() => {
    return finalData.filter((item) => {
      const d = new Date(item.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [finalData]);
  const thisMonthTotal = useMemo(() => {
    return thisMonthPayments.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
  }, [thisMonthPayments]);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editingRow, setEditingRow] = useState(null);

  const openEditModal = (row) => {
    setEditingRow(row);
    setIsEditOpen(true);
    setUpdateReason(row.update_reason || "");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    
  if (!updateReason.trim()) {
    toast.error("Update reason is required!");
    return;
  }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/DailyInstallments/updateDailyInstallment.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingRow.id,
            amount: editingRow.amount,
            date: editingRow.date,
            receiver: editingRow.receiver,
            cardId: editingRow.cardId,
            updated_by: user?.id,
            update_reason: updateReason,
          }),
        },
      );

      const result = await res.json();

      if (!result?.success) {
        toast.error("Update failed");
        return;
      }

      toast.success("Updated successfully");
      setIsEditOpen(false);
      setData((prev) =>
        prev.map((item) =>
          item.id === editingRow.id ? { ...item, ...editingRow } : item,
        ),
      );
    } catch (err) {
      toast.error("Server error");
    }
  };

  // ✅ Delete confirm + API
  const handleDelete = async (row) => {
    const ok = await Swal.fire({
      title: "Delete করবেন?",
      text: `Installment delete করলে আর ফিরে পাবেন না`,
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
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/DailyInstallments/deleteDailyInstallment.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number(row.id),
          }),
        },
      );

      const result = await res.json();

      if (!result?.success) {
        toast.error(result?.error || "Delete করা যায়নি");
        return;
      }

      toast.success("Installment delete হয়েছে");

      // ✅ UI থেকেও remove
      setData((prev) => prev.filter((item) => item.id !== row.id));
    } catch (e) {
      toast.error("Server error");
    }
  };
  const findIdByName = (id) => {
    const user = users.find((u) => String(u.id) === String(id));

    if (!user) return "Unknown";

    return user.name
      .replace(/^মোঃ\s*/g, "")
      .replace(/^Md\.?\s*/gi, "")
      .replace(/^Mohammad\s*/gi, "");
  };
  let runningTotal = 0;

  return (
    <div className=" min-h-screen text-white">
      <BackButton />
      {/* 🔥 USER CARD */}
      <div className="bg-[#0f172a] border pt-2 border-gray-800 rounded-2xl p-5 mb-6 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser?.photo
                ? `https://management.supplylinkbd.com/${currentUser?.photo}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUser?.name || "User",
                  )}&background=4f46e5&color=fff`
            }
            alt="user"
            className="w-14 h-14 rounded-full border border-gray-700 object-cover"
          />

          <div>
            <h2 className="text-lg font-semibold">
              {currentUser?.name || "Unknown User"}
            </h2>
            <p className="text-gray-400 text-sm">
              {currentUser?.address || "No address"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">
            regular
          </span>
          <p className="text-gray-400 text-xs mt-1">ID: {currentCard?.id}</p>
        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs">Total Installments</p>
          <h2 className="text-lg font-bold">{totalInstallments}</h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs">Expected Payment</p>
          <h2 className="text-lg font-bold text-indigo-400">
            ৳{expectedPayment}
          </h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs">Total Paid</p>
          <h2 className="text-lg font-bold text-green-400">৳{totalPaid}</h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs">Total Due</p>
          <h2 className="text-lg font-bold text-red-400">৳{totalDue}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs">This Month Paid</p>
          <h2 className="text-lg font-bold text-green-400">৳{thisMonthPaid}</h2>
        </div> */}

        {/* <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs">This Month Status</p>
          <h2
            className={`text-lg font-bold ${
              thisMonthStatus === "Paid" ? "text-green-400" : "text-red-400"
            }`}
          >
            {thisMonthStatus} (৳{thisMonthDue})
          </h2>
        </div> */}
      </div>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search amount, note or date..."
        className="w-full mb-5 px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-800 focus:outline-none text-sm"
      />

      {/* 📊 TABLE */}
      <div className="overflow-x-auto bg-[#0f172a] border border-gray-800 rounded-xl shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#111827] text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((item, index) => {
              const isMatch =
                search &&
                (String(item.date).includes(search) ||
                  String(item.amount).includes(search) ||
                  String(item.receiver)
                    .toLowerCase()
                    .includes(search.toLowerCase()));
              runningTotal += Number(item.amount || 0);

              return (
                <tr
                  key={item.id}
                  className={`border-t border-gray-800 transition 
        ${isMatch ? "bg-yellow-400/10 border-l-4 border-yellow-400" : ""}`}
                >
                  <td className="px-4 py-3 text-gray-400"> {index + 1}</td>

                  <td className="px-4 py-3 text-gray-400">{item.date}</td>

                  <td className="px-4 py-3 text-indigo-400 font-semibold">
                    ৳{Number(item.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-indigo-400 font-semibold">
                    ৳{runningTotal.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-gray-300">
                    {findIdByName(item.receiver)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {" "}
                    <div className="flex items-center justify-end gap-1.5 md:gap-2">
                      <button
                        title="Edit"
                        onClick={() => openEditModal(item)}
                        className={`${iconBtn} w-8 h-8 md:w-9 md:h-9`}
                      >
                        <FiEdit2 className="text-white/80 text-[14px] md:text-[16px]" />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDelete(item)}
                        className={`${iconBtnDanger} w-8 h-8 md:w-9 md:h-9`}
                      >
                        <FiTrash2 className="text-[14px] md:text-[16px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No matching data found
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f172a] p-6 rounded-xl w-full max-w-md border border-gray-800 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">কিস্তি এডিট</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-sm text-gray-400">টাকার পরিমাণ</label>
                <input
                  type="number"
                  value={editingRow?.amount || ""}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, amount: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#020617] border border-gray-700"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-400">তারিখ</label>
                <input
                  type="date"
                  value={editingRow?.date || ""}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, date: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#020617] border border-gray-700 date-fix"
                  required
                />
              </div>

              {/* Receiver */}
              <div>
                <label className="text-sm text-gray-400">Update Reason</label>

                <textarea
                  rows={3}
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  placeholder="Update করার কারণ লিখুন..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#020617] border border-gray-700"
                  
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInstallmentsUsersDetails;
