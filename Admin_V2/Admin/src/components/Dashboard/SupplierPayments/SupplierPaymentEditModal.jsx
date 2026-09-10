import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SupplierPaymentEditModal = ({ isOpen, onClose, onSuccess, item }) => {
  const [formData, setFormData] = useState({
    memo_no: "",
    date: "",
    shop_name: "",
    supplier: "",
    brand: "",
    total_amount: "",
    paid: "",
    due: "",
    remarks: "",
  });

  // 🔥 data set when modal open
  useEffect(() => {
    if (item) {
      setFormData({
        memo_no: item.memo_no || "",
        date: item.date || "",
        shop_name: item.shop_name || "",
        supplier: item.supplier || "",
        brand: item.brand || "",
        total_amount: item.total_amount || "",
        paid: item.paid || "",
        due: item.due || "",
        remarks: item.remarks || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };

    // auto due
    if (name === "total_amount" || name === "paid") {
      const total = Number(updatedData.total_amount) || 0;
      const paid = Number(updatedData.paid) || 0;
      updatedData.due = total - paid;
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/supplierPayments/updateSupplierPayments.php`,
        {
          id: item.id,
          ...formData,
        },
      );

      if (res.data.success) {
        onSuccess && onSuccess();
        onClose();
      }
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Payment Not Update");
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
      <div className="bg-[#0f172a] w-full max-w-3xl h-[80vh] md:h-[90vh] rounded-xl shadow-2xl border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Edit Supplier Payment
          </h2>
          <button onClick={onClose} className="text-gray-400 text-xl">
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1"
        >
          <div>
            <label className="text-sm text-gray-400">Memo No</label>
            <input
              type="text"
              name="memo_no"
              value={formData.memo_no}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Shop Name</label>
            <input
              type="text"
              name="shop_name"
              value={formData.shop_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Paid</label>
            <input
              type="number"
              name="paid"
              value={formData.paid}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Due</label>
            <input
              type="number"
              name="due"
              value={formData.due}
              readOnly
              className={inputClass}
            />
          </div>

          {/* ❌ Image নাই এখানে */}

          <div className="md:col-span-2">
            <label className="text-sm text-gray-400">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className={inputClass}
              rows="3"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
            >
              Update Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierPaymentEditModal;
