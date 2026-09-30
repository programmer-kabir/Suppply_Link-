import React, { useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import Loader from "../../../components/Loader/Loader";
import BackButton from "../../../components/BackButton/BackButton";
import { toast } from "react-toastify";
import useUsers from "../../../utils/Hooks/useUsers";
import {
  FaEdit,
  FaCheckCircle,
  FaCalculator,
  FaSearch,
  FaChevronDown,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Reusable text / number input component
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = "",
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        readOnly ? "opacity-70 bg-gray-900 cursor-not-allowed" : ""
      } ${className}`}
    />
  </div>
);

// Searchable Customer Dropdown Component
const CustomerSearchDropdown = ({ users = [], value, onChange, label = "Customer (User ID) *" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedUser = useMemo(() => {
    return users.find((u) => String(u.user_id || u.id) === String(value));
  }, [users, value]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return users;
    return users.filter((u) => {
      const name = (u.name ?? u.full_name ?? u.username ?? "").toLowerCase();
      const mobile = (u.mobile ?? "").toLowerCase();
      const idNum = String(u.user_id || u.id);
      return name.includes(term) || mobile.includes(term) || idNum.includes(term);
    });
  }, [users, search]);

  return (
    <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
      <label className="text-xs font-medium text-gray-300">{label}</label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white flex justify-between items-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-left"
      >
        <div className="flex items-center gap-2.5 truncate">
          <FaUser className="text-gray-400 text-xs shrink-0" />
          {selectedUser ? (
            <span className="truncate text-white font-medium">
              {selectedUser.name ?? `User #${selectedUser.id}`}
              {selectedUser.mobile ? ` (${selectedUser.mobile})` : ""}
            </span>
          ) : (
            <span className="text-gray-400">Select Customer...</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {selectedUser && (
            <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
              ID: {selectedUser.user_id || selectedUser.id}
            </span>
          )}
          <FaChevronDown
            className={`text-gray-400 text-xs transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-400" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1A2642] border border-gray-700/80 rounded-xl shadow-2xl max-h-72 flex flex-col overflow-hidden"
          >
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-gray-700 bg-[#141e34]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search name, phone, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0F1B2D] text-white pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition placeholder-gray-500"
                />
              </div>
            </div>

            {/* List of Customers */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-800/60 max-h-56">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                  No matching customer found
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const uid = u.user_id || u.id;
                  const isSelected = String(uid) === String(value);

                  return (
                    <div
                      key={u.id || uid}
                      onClick={() => {
                        onChange(uid);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`px-3.5 py-2.5 cursor-pointer flex justify-between items-center transition ${
                        isSelected
                          ? "bg-blue-600/30 text-white"
                          : "hover:bg-blue-900/30 text-gray-200"
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="font-semibold text-xs text-white truncate">
                          {u.name ?? `User #${u.id}`}
                        </span>
                        {u.mobile && (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <FaPhoneAlt className="text-[9px] text-gray-500" />
                            {u.mobile}
                          </span>
                        )}
                      </div>

                      <span className="text-blue-400 text-xs font-mono font-medium bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded shrink-0">
                        ID: {uid}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomerCardDetails = () => {
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get("cardId");
  const { users } = useUsers();

  const {
    customerInstallmentCards,
    isCustomerInstallmentsCardsLoading,
    refetch: refetchCards,
  } = useCustomerInstallmentCards();

  const {
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsLoading,
    refetch: refetchPayments,
  } = useCustomerInstallmentPayments();

  // Find selected card by DB id or card_id
  const card = customerInstallmentCards?.find(
    (c) => String(c.id) === String(cardId) || String(c.card_id) === String(cardId)
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const officialStaff = useMemo(() => {
    const allowedRoles = ["admin", "manager", "staff", "developer"];
    return (users || []).filter((u) => {
      if (Array.isArray(u.roles)) {
        return u.roles.some((r) => allowedRoles.includes(String(r).toLowerCase()));
      }
      const role = u.role_name ?? u.role ?? u.user_role ?? u.userType ?? u.type ?? "";
      return allowedRoles.includes(String(role).toLowerCase());
    });
  }, [users]);

  const handleEditCard = (c) => {
    setEditForm({
      id: c.id,
      card_id: c.card_id ?? c.id,
      user_id: c.user_id,
      reference_user_id: c.reference_user_id || "",
      product_name: c.product_name || "",
      mrp: c.mrp || "",
      purchase_price: c.purchase_price || "",
      additional_cost: c.additional_cost || 0,
      cost_price: c.cost_price || "",
      sale_type: c.sale_type || "Installment",
      sale_price: c.sale_price || "",
      down_payment: c.down_payment || 0,
      total_due_amount: c.total_due_amount || 0,
      installment_count: c.installment_count || "",
      per_installment_amount: c.per_installment_amount || "",
      profit: c.profit || 0,
      delivery_date: c.delivery_date || "",
      first_installment_date: c.first_installment_date || "",
      supplier_id: c.supplier_id || "",
      status: c.status || "Running",
      remarks: c.remarks || "",
    });
    setIsEditOpen(true);
  };

  // Dynamic live calculation on change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => {
      const next = { ...prev, [name]: value };

      // Number values
      const purchase = parseFloat(name === "purchase_price" ? value : next.purchase_price) || 0;
      const additional = parseFloat(name === "additional_cost" ? value : next.additional_cost) || 0;
      const sale = parseFloat(name === "sale_price" ? value : next.sale_price) || 0;
      const down = parseFloat(name === "down_payment" ? value : next.down_payment) || 0;
      const count = parseInt(name === "installment_count" ? value : next.installment_count) || 0;

      const calcCost = purchase + additional;
      const calcProfit = sale - calcCost;
      const calcDue = Math.max(0, sale - down);
      const calcPerInst = count > 0 ? Math.round(calcDue / count) : 0;

      next.cost_price = calcCost;
      next.profit = calcProfit;
      next.total_due_amount = calcDue;

      // Auto update per_installment_amount unless explicitly being edited
      if (name !== "per_installment_amount") {
        next.per_installment_amount = calcPerInst;
      }

      return next;
    });
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        id: editForm.id,
        card_id: editForm.card_id,
        user_id: editForm.user_id,
        reference_user_id: editForm.reference_user_id,
        product_name: editForm.product_name,
        mrp: editForm.mrp,
        purchase_price: editForm.purchase_price,
        additional_cost: editForm.additional_cost || 0,
        sale_type: editForm.sale_type || "Installment",
        sale_price: editForm.sale_price,
        down_payment: editForm.down_payment || 0,
        installment_count: editForm.installment_count,
        per_installment_amount: editForm.per_installment_amount,
        delivery_date: editForm.delivery_date,
        first_installment_date: editForm.first_installment_date,
        supplier_id: editForm.supplier_id || null,
        status: editForm.status,
        remarks: editForm.remarks || "",
      };

      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/customers/update_installment_card.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || result.error || "Update failed");
        return;
      }

      toast.success("Card Updated Successfully ✅");
      setIsEditOpen(false);

      // Instantly refresh cards & payments
      refetchCards?.();
      refetchPayments?.();
    } catch (err) {
      toast.error("Network or server error during update");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payments for this card
  const payments = customerInstallmentPayments?.filter(
    (p) => card && String(p.card_id) === String(card.card_id)
  );

  if (isCustomerInstallmentsCardsLoading || isCustomerInstallmentsPaymentsLoading) {
    return <Loader />;
  }

  if (!card) {
    return (
      <div className="p-6">
        <BackButton />
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300">
          <p className="font-semibold">Card not found</p>
          <p className="text-xs text-red-400 mt-1">
            Could not find an installment card with ID: {cardId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton />

      {/* ===== Card Header / Info Box ===== */}
      <div
        className="rounded-2xl p-6 space-y-6 shadow-xl"
        style={{
          backgroundColor: "#111827",
          border: "1px solid #1f2937",
          color: "#e5e7eb",
        }}
      >
        {/* Top Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                Card #{card.card_id}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  card.status === "Fully Paid"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : card.status === "Overdue"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : "bg-blue-950 text-blue-400 border border-blue-800"
                }`}
              >
                {card.status}
              </span>
            </div>
            <p className="text-xl font-bold text-white mt-2">{card.product_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Created: {card.created_at || "N/A"}
            </p>
          </div>

          <button
            onClick={() => handleEditCard(card)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-sm font-medium transition shadow-sm"
          >
            <FaEdit />
            Edit Card
          </button>
        </div>

        {/* Product & Sale Info */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-sky-400">
            📦 Product & Schedule Information
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-gray-950/60 p-4 rounded-xl border border-gray-800/80">
            <div>
              <p className="text-xs text-gray-400">Sale Type</p>
              <p className="font-medium text-white">{card.sale_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Delivery Date</p>
              <p className="font-medium text-white">{card.delivery_date || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">First Installment</p>
              <p className="font-medium text-white">{card.first_installment_date || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Installments</p>
              <p className="font-medium text-white">{card.installment_count} Months</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-emerald-400">
            💰 Price & Profit Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-sm">
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">MRP</p>
              <p className="font-semibold text-white">৳ {Number(card.mrp || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Purchase</p>
              <p className="font-semibold text-white">৳ {Number(card.purchase_price || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Additional Cost</p>
              <p className="font-semibold text-amber-300">৳ {Number(card.additional_cost || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Cost Price</p>
              <p className="font-semibold text-sky-300">৳ {Number(card.cost_price || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Sale Price</p>
              <p className="font-bold text-white">৳ {Number(card.sale_price || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Down Payment</p>
              <p className="font-semibold text-yellow-300">৳ {Number(card.down_payment || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Profit</p>
              <p className="font-bold text-emerald-400">৳ {Number(card.profit || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Installment Payments Table ===== */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-base font-semibold text-white">📋 Installment Schedule & Payments</h3>
          <span className="text-xs text-gray-400">{payments?.length || 0} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-gray-200 text-sm">
            <thead>
              <tr className="bg-[#0b1324] text-xs text-gray-400 uppercase">
                <th className="p-3.5 border-b border-gray-800 text-left">Installment</th>
                <th className="p-3.5 border-b border-gray-800 text-center">Due Date</th>
                <th className="p-3.5 border-b border-gray-800 text-right">Due Amount</th>
                <th className="p-3.5 border-b border-gray-800 text-center">Paid Date</th>
                <th className="p-3.5 border-b border-gray-800 text-center">Payment Method</th>
                <th className="p-3.5 border-b border-gray-800 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {!payments || payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No installment schedule generated yet for this card.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/40 transition">
                    <td className="p-3.5 font-medium text-white">
                      {p.installment_no === 0
                        ? "Down Payment"
                        : p.tag || `Installment #${p.installment_no}`}
                    </td>
                    <td className="p-3.5 text-center text-gray-300">
                      {p.due_date || "—"}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-emerald-400">
                      ৳ {Number(p.due_amount || 0).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center text-gray-300">
                      {p.paid_date || "—"}
                    </td>
                    <td className="p-3.5 text-center text-gray-400">
                      {p.payment_method || "Cash"}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          p.status === "Paid"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-red-950 text-red-400 border border-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1324] w-full max-w-4xl rounded-2xl border border-gray-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#070d18]">
              <div className="flex items-center gap-2">
                <FaEdit className="text-blue-400 text-lg" />
                <h2 className="text-lg font-bold text-white">Edit Installment Card</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateCard} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Live Financial Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-800/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wide mb-3">
                  <FaCalculator />
                  <span>Live Calculated Summary</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                  <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                    <p className="text-gray-400">Total Cost</p>
                    <p className="font-bold text-sky-400 text-sm">
                      ৳ {Number(editForm.cost_price || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                    <p className="text-gray-400">Sale Price</p>
                    <p className="font-bold text-white text-sm">
                      ৳ {Number(editForm.sale_price || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                    <p className="text-gray-400">Total Due</p>
                    <p className="font-bold text-yellow-400 text-sm">
                      ৳ {Number(editForm.total_due_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                    <p className="text-gray-400">Per Installment</p>
                    <p className="font-bold text-indigo-300 text-sm">
                      ৳ {Number(editForm.per_installment_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800">
                    <p className="text-gray-400">Expected Profit</p>
                    <p
                      className={`font-bold text-sm ${
                        Number(editForm.profit || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      ৳ {Number(editForm.profit || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Basic Info */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3">
                  🔑 Basic & Customer Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Card ID / Number *"
                    name="card_id"
                    type="number"
                    value={editForm.card_id}
                    onChange={handleChange}
                  />

                  {/* Searchable Customer Dropdown */}
                  <CustomerSearchDropdown
                    label="Customer (Select User) *"
                    users={users}
                    value={editForm.user_id}
                    onChange={(selectedUserId) => {
                      setEditForm((prev) => ({ ...prev, user_id: selectedUserId }));
                    }}
                  />

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-300">Reference Staff *</label>
                    <select
                      name="reference_user_id"
                      value={editForm.reference_user_id || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Reference Staff</option>
                      {officialStaff?.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} (ID: {u.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Product & Cost Info */}
              <div>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                  📦 Product & Cost Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-2 md:col-span-4">
                    <Input
                      label="Product Name *"
                      name="product_name"
                      value={editForm.product_name}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    label="MRP (৳) *"
                    name="mrp"
                    type="number"
                    value={editForm.mrp}
                    onChange={handleChange}
                  />

                  <Input
                    label="Purchase Price (৳) *"
                    name="purchase_price"
                    type="number"
                    value={editForm.purchase_price}
                    onChange={handleChange}
                  />

                  <Input
                    label="Additional Cost (৳)"
                    name="additional_cost"
                    type="number"
                    value={editForm.additional_cost}
                    onChange={handleChange}
                  />

                  <Input
                    label="Sale Price (৳) *"
                    name="sale_price"
                    type="number"
                    value={editForm.sale_price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Section 3: Installment Plan */}
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  💳 Installment Plan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Down Payment (৳)"
                    name="down_payment"
                    type="number"
                    value={editForm.down_payment}
                    onChange={handleChange}
                  />

                  <Input
                    label="Installment Count (Months) *"
                    name="installment_count"
                    type="number"
                    value={editForm.installment_count}
                    onChange={handleChange}
                  />

                  <Input
                    label="Per Installment Amount (৳)"
                    name="per_installment_amount"
                    type="number"
                    value={editForm.per_installment_amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Section 4: Dates & Status */}
              <div>
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
                  📅 Dates & Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-300">Delivery Date *</label>
                    <input
                      type="date"
                      name="delivery_date"
                      value={editForm.delivery_date || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 date-fix"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-300">
                      First Installment Date *
                    </label>
                    <input
                      type="date"
                      name="first_installment_date"
                      value={editForm.first_installment_date || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 date-fix"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-300">Status</label>
                    <select
                      name="status"
                      value={editForm.status || "Running"}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Running">Running</option>
                      <option value="Fully Paid">Fully Paid</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Remarks */}
              <div>
                <label className="text-xs font-medium text-gray-300">Remarks / Notes</label>
                <textarea
                  name="remarks"
                  value={editForm.remarks || ""}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Optional notes or remarks regarding this installment card..."
                  className="mt-1 w-full p-3 rounded-lg bg-[#020617] border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/30 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Updating...</span>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Save Changes</span>
                    </>
                  )}
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
