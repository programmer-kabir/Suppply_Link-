import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt, FaTimes, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../../Provider/AuthProvider";

const DeleteCashModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  if (!isOpen || !item) return null;

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!deleteReason.trim()) {
      toast.error("মুছে ফেলার কারণ (Delete Reason) অবশ্যই লিখতে হবে!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: item.id,
        delete_reason: deleteReason.trim(),
        user_id: user?.id || 1,
        user_name: user?.name || user?.phone || "Admin",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/delete_cash.php`,
        payload
      );

      if (res.data?.success) {
        toast.success(res.data.message || "লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে!");
        setDeleteReason("");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data?.message || "মুছে ফেলা ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "সার্ভার এরর! আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-red-950/40 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <FaTrashAlt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">লেনদেন মুছে ফেলা</h2>
              <p className="text-xs text-red-400/80 font-mono">ID: #{item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleDelete} className="p-6 space-y-4">
          {/* Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-sm">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>ধরণ:</span>
              <span className={`px-2 py-0.5 rounded font-semibold uppercase ${item.type === 'in' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {item.type === 'in' ? 'Cash In' : 'Cash Out'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">টাকার পরিমাণ:</span>
              <span className="text-base font-bold font-mono text-white">
                ৳ {Number(item.amount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">বিবরণ / সোর্স:</span>
              <span className="text-slate-200 font-medium truncate max-w-[200px]">
                {item.source || item.purpose || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">তারিখ:</span>
              <span className="text-slate-400 font-mono">{item.date || "-"}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-2.5 items-start">
            <FaExclamationTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 leading-relaxed">
              এই লেনদেনটি মুছে ফেললে এটি সমস্ত রিপোর্ট, ব্যালেন্স এবং চার্ট থেকে বাদ দেওয়া হবে।
            </p>
          </div>

          {/* Delete Reason (MANDATORY) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              মুছে ফেলার কারণ লিখুন (বাধ্যতামূলক) *
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              required
              rows="3"
              placeholder="কেন এই লেনদেনটি মুছে ফেলা হচ্ছে তার সঠিক কারণ লিখুন..."
              className="w-full bg-slate-950 border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition resize-none"
            />
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <FaInfoCircle className="w-3 h-3 shrink-0" /> অডিট ট্রেইলের জন্য কারণটি ডাটাবেজে সংরক্ষিত থাকবে।
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
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                "হ্যাঁ, মুছে ফেলুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteCashModal;
