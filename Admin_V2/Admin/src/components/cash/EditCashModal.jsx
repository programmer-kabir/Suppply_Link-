import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTag,
  FaEdit,
  FaTimes,
  FaExclamationCircle,
  FaInfoCircle
} from "react-icons/fa";
import { MdOutlineDescription, MdCategory } from "react-icons/md";
import { useAuth } from "../../Provider/AuthProvider";

const EditCashModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    purpose: "",
    category: "",
    date: "",
    remarks: "",
    refId: "",
    edit_reason: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        amount: item.amount || "",
        source: item.source || "",
        purpose: item.purpose || "",
        category: item.category || (item.type === "in" ? "invest" : "expense"),
        date: item.date || new Date().toISOString().split("T")[0],
        remarks: item.remarks || "",
        refId: item.refId || "",
        edit_reason: "",
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const isCashIn = item.type === "in";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.edit_reason.trim()) {
      toast.error("এডিটের কারণ (Edit Reason) অবশ্যই লিখতে হবে!");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("সঠিক টাকার পরিমাণ দিন!");
      return;
    }

    if (!formData.date) {
      toast.error("তারিখ নির্বাচন করুন!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: item.id,
        amount: Number(formData.amount),
        source: formData.source,
        purpose: formData.purpose,
        category: formData.category,
        date: formData.date,
        remarks: formData.remarks,
        refId: formData.refId,
        edit_reason: formData.edit_reason.trim(),
        user_id: user?.id || 1,
        user_name: user?.name || user?.phone || "Admin",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/edit_cash.php`,
        payload
      );

      if (res.data?.success) {
        toast.success(res.data.message || "সফলভাবে আপডেট করা হয়েছে!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data?.message || "আপডেট ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "সার্ভার এরর! আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isCashIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <FaEdit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isCashIn ? "ক্যাশ ইন সম্পাদন" : "ক্যাশ আউট সম্পাদন"}
              </h2>
              <p className="text-xs text-slate-400 font-mono">ID: #{item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaMoneyBillWave className="text-emerald-400" /> টাকার পরিমাণ *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                step="any"
                placeholder="যেমন: 5000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaCalendarAlt className="text-blue-400" /> তারিখ *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Source or Purpose */}
          {isCashIn ? (
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaTag className="text-cyan-400" /> সোর্স / উৎস
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="উৎস / গ্রাহকের নাম"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaTag className="text-rose-400" /> খরচের বিবরণ (Purpose)
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="যেমন: অফিস ভাড়া, বিদ্যুৎ বিল"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          )}

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MdCategory className="text-amber-400" /> ক্যাটাগরি
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            >
              {isCashIn ? (
                <>
                  <option value="invest">বিনিয়োগ (Invest)</option>
                  <option value="installment">কিস্তি (Installment)</option>
                  <option value="downpayment">ডাউন পেমেন্ট (Down Payment)</option>
                  <option value="daily-installment">দৈনিক কিস্তি (Daily Installment)</option>
                  <option value="loan">লোন (Loan)</option>
                  <option value="loan-return">লোন ফেরত (Loan Return)</option>
                  <option value="others">অন্যান্য (Others)</option>
                </>
              ) : (
                <>
                  <option value="expense">সাধারণ খরচ (Expense)</option>
                  <option value="company-expense">কোম্পানি খরচ (Company Expense)</option>
                  <option value="office-expense">অফিস খরচ (Office Expense)</option>
                  <option value="loan-given">লোন প্রদান (Loan Given)</option>
                  <option value="loan-repayment">লোন পরিশোধ (Loan Repayment)</option>
                  <option value="investor-payout">বিনিয়োগকারী ফেরত (Investor Payout)</option>
                  <option value="profit-payout">মুনাফা প্রদান (Profit Payout)</option>
                  <option value="others">অন্যান্য (Others)</option>
                </>
              )}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MdOutlineDescription className="text-purple-400" /> নোট / মন্তব্য (Remarks)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="2"
              placeholder="অতিরিক্ত কোনো তথ্য থাকলে লিখুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
            />
          </div>

          {/* Edit Reason (MANDATORY) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <FaExclamationCircle className="w-3.5 h-3.5" /> এডিটের কারণ লিখুন (বাধ্যতামূলক) *
            </label>
            <textarea
              name="edit_reason"
              value={formData.edit_reason}
              onChange={handleChange}
              required
              rows="2"
              placeholder="কেন এই লেনদেনটি সম্পাদন বা পরিবর্তন করছেন তার কারণ লিখুন..."
              className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition resize-none"
            />
            <p className="text-[11px] text-amber-300/80 flex items-center gap-1">
              <FaInfoCircle className="w-3 h-3 shrink-0" /> পরিবর্তনের পূর্বের ডাটা অডিট হিস্টোরিতে সংরক্ষিত থাকবে।
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                "আপডেট করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCashModal;
