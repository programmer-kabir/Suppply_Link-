import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import Loader from "../../../components/Loader/Loader";
import BackButton from "../../../components/BackButton/BackButton";
import { toast } from "react-toastify";
import useUsers from "../../../utils/Hooks/useUsers";
const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-400">{label}</label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
const CustomerCardDetails = () => {
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get("cardId");
  const { isUsersLoading, users, isUsersError } = useUsers()
  const { customerInstallmentCards, isCustomerInstallmentsCardsLoading } =
    useCustomerInstallmentCards();

  const { customerInstallmentPayments, isCustomerInstallmentsPaymentsLoading } =
    useCustomerInstallmentPayments();


  // 🔥 Find selected card
  const card = customerInstallmentCards?.find(
    (c) => String(c.id) === String(cardId),
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
const [editForm, setEditForm] = useState({});
const handleEditCard = (card) => {
  setEditForm({
    ...card,
    remarks: card.remarks || ""
  });
  setIsEditOpen(true);
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setEditForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const officialStaff = useMemo(() => {
    const allowedRoles = ["admin", "manager", "staff", "developer"];

    return (users || []).filter((u) => {
      // Case A: roles array
      if (Array.isArray(u.roles)) {
        return u.roles.some((r) =>
          allowedRoles.includes(String(r).toLowerCase())
        );
      }

      // Case B: single role fields (fallback)
      const role =
        u.role_name ?? u.role ?? u.user_role ?? u.userType ?? u.type ?? "";
      return allowedRoles.includes(String(role).toLowerCase());
    });
  }, [users]);
const handleUpdateCard = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // ✅ ONLY required fields
    formData.append("id", editForm.id);
    formData.append("card_number", editForm.card_number);
    formData.append("user_id", editForm.user_id);
    formData.append("reference_user_id", editForm.reference_user_id);
    formData.append("product_name", editForm.product_name);
    formData.append("mrp", editForm.mrp);
    formData.append("purchase_price", editForm.purchase_price);
    formData.append("additional_cost", editForm.additional_cost);
    formData.append("sale_price", editForm.sale_price);
    formData.append("down_payment", editForm.down_payment);
    formData.append("installment_count", editForm.installment_count);
    formData.append("per_installment_amount", editForm.per_installment_amount);
    formData.append("delivery_date", editForm.delivery_date);
    formData.append("first_installment_date", editForm.first_installment_date);
    formData.append("status", editForm.status);
    formData.append("remarks", editForm.remarks);

    const res = await fetch(
      `${import.meta.env.VITE_LOCALHOST_KEY}/customers/update_installment_card.php`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();

    if (!result.success) {
      toast.error(result.message || "Update failed");
      return;
    }

    toast.success("Card Updated ✅");
    setIsEditOpen(false);

  } catch (err) {

    toast.error("Server error");
  }
};
  // 🔥 Payments for this card
  const payments = customerInstallmentPayments?.filter(
    (p) => String(p.card_id) === String(card.id),
  );
    if (
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading
  ) {
    return <Loader />;
  }
  if (!card) {
    return <p className="text-red-500">Card not found</p>;
  }


const input= "w-full px-3 py-2 rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  return (
    <div>
      <BackButton />
      <div className="space-y-6 pt-5">
        {/* ===== Product Info ===== */}
        <div
          className="rounded-xl p-5 space-y-5"
          style={{
            backgroundColor: "#182337",
            border: "1px solid #0f1d3a",
            color: "#e5e7eb",
          }}
        >
          {/* ===== Header ===== */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400">Card Number</p>
              <p className="text-lg font-semibold">{card.card_number}</p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {card.created_at}
              </p>
            </div>

           <div className="space-x-3">
             <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor:
                  card.status === "Fully Paid"
                    ? "rgba(16,185,129,0.15)"
                    : card.status === "Overdue"
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(59,130,246,0.15)",
                color:
                  card.status === "Fully Paid"
                    ? "#6ee7b7"
                    : card.status === "Overdue"
                      ? "#fca5a5"
                      : "#93c5fd",
              }}
            >
              {card.status}
            </span>
<button
onClick={()=>handleEditCard(card)}
  className="px-4 py-1 text-[#93c5fd] text-xs rounded-full"
  style={{
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    color: "rgb(147, 197, 253)"
  }}
>
  Edit
</button>
           </div>

          
          </div>

          {/* ===== Product Info ===== */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-sky-300">
              📦 Product Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Product Name</p>
                <p>{card.product_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Sale Type</p>
                <p>{card.sale_type}</p>
              </div>
              <div>
                <p className="text-gray-400">Delivery Date</p>
                <p>{card.delivery_date || "—"}</p>
              </div>
            </div>
          </div>

          {/* ===== Price Breakdown ===== */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-emerald-300">
              💰 Price Breakdown
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">MRP</p>
                <p>৳ {card.mrp}</p>
              </div>
              <div>
                <p className="text-gray-400">Purchase Price</p>
                <p>৳ {card.purchase_price}</p>
              </div>
              <div>
                <p className="text-gray-400">Additional Cost</p>
                <p>৳ {card.additional_cost || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Cost Price</p>
                <p>৳ {card.cost_price}</p>
              </div>
              <div>
                <p className="text-gray-400">Sale Price</p>
                <p className="font-semibold">৳ {card.sale_price}</p>
              </div>
              <div>
                <p className="text-gray-400">Profit</p>
                <p className="font-semibold text-green-400">৳ {card.profit}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Installment Details ===== */}
        <div className="bg-[#182337] border border-[#0f1d3a] rounded-xl overflow-x-auto">
          <table className="min-w-[700px] w-full text-gray-200">
            <thead>
              <tr className="bg-[#0b1833]">
                <th className="p-3 border border-[#0f1d3a]">Installment</th>
                <th className="p-3 border border-[#0f1d3a]">Due Date</th>
                <th className="p-3 border border-[#0f1d3a]">Amount</th>
                <th className="p-3 border border-[#0f1d3a]">Paid Date</th>
                <th className="p-3 border border-[#0f1d3a]">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#0b1833]/60">
                  <td className="p-3 border border-[#0f1d3a] text-center">
                    {p.installment_no === 0 ? "Down Payment" : p.tag}
                  </td>
                  <td className="p-3 border border-[#0f1d3a] text-center">
                    {p.due_date}
                  </td>
                  <td className="p-3 border border-[#0f1d3a] text-center">
                    ৳ {p.due_amount}
                  </td>
                  <td className="p-3 border border-[#0f1d3a] text-center">
                    {p.paid_date || "-"}
                  </td>
                  <td className="p-3 border border-[#0f1d3a] text-center">
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
{isEditOpen && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-3">
    
    <div className="bg-[#0f172a] w-full max-w-4xl rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          ✏️ Edit Card
        </h2>
        <button
          onClick={() => setIsEditOpen(false)}
          className="text-gray-400 hover:text-red-400 text-lg"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleUpdateCard} className="space-y-6">
<div>
  <h3 className="text-sm text-yellow-400 mb-3">🔑 Basic Info</h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <Input
      label="Card Number"
      name="card_number"
      value={editForm.card_number}
      onChange={handleChange}
    />

    <Input
      label="User ID"
      name="user_id"
      value={editForm.user_id}
      onChange={handleChange}
    />

<div className="flex flex-col gap-1">
  <label className="text-xs text-gray-400">
    Reference User Id
  </label>

  <div className="relative">
    <select
      name="reference_user_id"
      value={editForm.reference_user_id}
      onChange={handleChange}
      className="w-full h-11 px-3 pr-8 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select User</option>
      {officialStaff?.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name} (ID: {u.id})
        </option>
      ))}
    </select>

    {/* arrow */}
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
      ▼
    </span>
  </div>
</div>

  </div>
</div>
        {/* 🔹 Section 1 */}
        <div>
          <h3 className="text-sm text-blue-400 mb-3">📦 Product Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Product Name" name="product_name" value={editForm.product_name} onChange={handleChange} />

            <Input label="MRP (৳)" name="mrp" value={editForm.mrp} onChange={handleChange} />

            <Input label="Purchase Price" name="purchase_price" value={editForm.purchase_price} onChange={handleChange} />

            <Input label="Additional Cost" name="additional_cost" value={editForm.additional_cost} onChange={handleChange} />

            <Input label="Sale Price" name="sale_price" value={editForm.sale_price} onChange={handleChange} />

          </div>
        </div>

        {/* 🔹 Section 2 */}
        <div>
          <h3 className="text-sm text-emerald-400 mb-3">💳 Installment Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Installment Count" name="installment_count" value={editForm.installment_count} onChange={handleChange} />

            <Input label="Per Installment Amount" name="per_installment_amount" value={editForm.per_installment_amount} onChange={handleChange} />

            <Input label="Down Payment" name="down_payment" value={editForm.down_payment} onChange={handleChange} />


          </div>
        </div>

        {/* 🔹 Section 3 */}
        <div>
          <h3 className="text-sm text-purple-400 mb-3">📅 Others</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Delivery Date</label>
              <input
                type="date"
                name="delivery_date"
                value={editForm.delivery_date || ""}
                onChange={handleChange}
  className={`${input} date-fix`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">First Installment Date</label>
              <input
                type="date"
                name="first_installment_date"
                value={editForm.first_installment_date || ""}
                onChange={handleChange}
  className={`${input} date-fix`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Status</label>
              <select
                name="status"
                value={editForm.status || ""}
                onChange={handleChange}
                className={input}
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Fully Paid">Fully Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

          </div>
        </div>

        {/* 🔹 Remarks */}
        <div>
          <label className="text-xs text-gray-400">Remarks</label>
          <textarea
            name="remarks"
            value={editForm.remarks || ""}
            onChange={handleChange}
            className="mt-1 p-3 rounded-lg bg-[#020617] border border-gray-700 text-white w-full focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={() => setIsEditOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition font-medium shadow"
          >
            Update Card
          </button>
        </div>

      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CustomerCardDetails;
