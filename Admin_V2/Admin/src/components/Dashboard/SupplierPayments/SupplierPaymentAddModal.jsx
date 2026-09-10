import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const SupplierPaymentAddModal = ({ isOpen, onClose, onSuccess }) => {
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
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      const updatedData = { ...formData, [name]: value };

      // auto calculate due
      if (name === "total_amount" || name === "paid") {
        const total = Number(updatedData.total_amount) || 0;
        const paid = Number(updatedData.paid) || 0;
        updatedData.due = total - paid;
      }

      setFormData(updatedData);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("memo_no", formData.memo_no);
    form.append("date", formData.date);
    form.append("shop_name", formData.shop_name);
    form.append("supplier", formData.supplier);
    form.append("brand", formData.brand);
    form.append("total_amount", formData.total_amount);
    form.append("paid", formData.paid);
    form.append("due", formData.due);
    form.append("remarks", formData.remarks);

    // 🔥 IMPORTANT
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/supplierPayments/addSupplierPayments.php`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success(res?.data?.message);
      onClose()
    } catch (err) {
      toast.error("Payment Not Added");
      onClose()
    }
  };
  if (!isOpen) return null;
  const inputClass =
    "bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
      <div className="bg-[#0f172a] w-full max-w-3xl  h-[80vh] md:h-[90vh] rounded-xl shadow-2xl border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Add Supplier Payment
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
          {/* Memo No */}
          <div>
            <label className="text-sm text-gray-400">Memo No</label>
            <input
              type="text"
              name="memo_no"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              className={`${inputClass} date-fix`}
              required
            />
          </div>

          {/* Shop */}
          <div>
            <label className="text-sm text-gray-400">Shop Name</label>
            <input
              type="text"
              name="shop_name"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="text-sm text-gray-400">Supplier</label>
            <input
              type="text"
              name="supplier"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Brand */}
          <div>
            <label className="text-sm text-gray-400">Brand</label>
            <input
              type="text"
              name="brand"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Total */}
          <div>
            <label className="text-sm text-gray-400">Total Amount</label>
            <input
              type="number"
              name="total_amount"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Paid */}
          <div>
            <label className="text-sm text-gray-400">Paid</label>
            <input
              type="number"
              name="paid"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Due */}
          <div>
            <label className="text-sm text-gray-400">Due</label>
            <input
              type="number"
              name="due"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <div className="col-span-full">
              <label
                for="cover-photo"
                className="block text-sm/6 font-medium text-white"
              >
                Cover photo
              </label>
              <label
                for="file-upload"
                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
              >
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      data-slot="icon"
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-600"
                    >
                      <path
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-400">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="sr-only"
                      />

                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-400">Remarks</label>
            <textarea
              name="remarks"
              onChange={handleChange}
              className={inputClass}
              rows="3"
            />
          </div>

          {/* Buttons */}
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
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
            >
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierPaymentAddModal;
