import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaMoneyBillWave,
  FaHashtag,
} from "react-icons/fa";
import { MdCategory, MdNotes } from "react-icons/md";
import { toast } from "react-toastify";

const CashInModal = ({ openCashInModal, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    source: "",
    amount: "",
    category: "invest",
    refId: "",
    remarks: "",
  });

  // 👉 auto today date
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  if (!openCashInModal) return null;

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.source || !formData.amount || !formData.category) {
      alert("Source এবং Amount লাগবে!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/cashIn.php`,
        {
          ...formData,
          amount: Number(formData.amount), 
        },
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed!");
        return;
      }
        toast.success("Cash In Success ✅");

      // reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        source: "",
        amount: "",
        category: "invest",
        refId: "",
        remarks: "",
      });
      onClose();
      
    } catch (err) {
      toast.error("Error submitting!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div
        className="w-full max-w-xl bg-[#0F172A] rounded-2xl border border-white/10 shadow-2xl 
                  max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold">ক্যাশ ইন</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        {/* Form */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormGroup
              label="তারিখ"
              icon={<FaCalendarAlt className="text-red-400" />}
            >
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-dark date-fix"
              />
            </FormGroup>

            <FormGroup
              label="উৎস (Source)"
              icon={<FaUser className="text-blue-400" />}
            >
              <input
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="যে ব্যক্তি/মাধ্যম থেকে টাকা এসেছে"
                className="input-dark"
              />
            </FormGroup>

            <FormGroup
              label="পরিমাণ (Amount)"
              icon={<FaMoneyBillWave className="text-green-400" />}
            >
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="উদাহরণ: 1500"
                className="input-dark"
              />
            </FormGroup>

            <FormGroup
              label="ক্যাটাগরি"
              icon={<MdCategory className="text-orange-400" />}
            >
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-dark"
              >
                <option className="bg-[#0F172A]" value="invest">
                  বিনিয়োগ
                </option>
                <option className="bg-[#0F172A]" value="installment">
                  কিস্তি
                </option>
                <option className="bg-[#0F172A]" value="downpayment">
                  ডাউন পেমেন্ট
                </option>
                <option className="bg-[#0F172A]" value="loan">
                 লোন
                </option>
                <option className="bg-[#0F172A]" value="loan-return">
                 লোন ফেরত
                </option>
                <option className="bg-[#0F172A]" value="daily-installment">
                  দৈনিক কিস্তি
                </option>
                <option className="bg-[#0F172A]" value="others">
                  অন্যান্য
                </option>
              </select>
            </FormGroup>

            <FormGroup
              label="Reference ID (optional)"
              icon={<FaHashtag className="text-indigo-400" />}
            >
              <input
                name="refId"
                value={formData.refId}
                onChange={handleChange}
                placeholder="ট্রানজেকশন আইডি / ইনভয়েস নম্বর"
                className="input-dark"
              />
            </FormGroup>

            <FormGroup
              label="মন্তব্য (Remarks)"
              icon={<MdNotes className="text-pink-400" />}
            >
              <textarea
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="যেমন: ফুল পেমেন্ট, অগ্রিম..."
                className="input-dark resize-none"
              />
            </FormGroup>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition"
            >
              ⬇ জমা দিন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashInModal;

/* 🔹 Reusable FormGroup */

const FormGroup = ({ label, icon, children }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
};
