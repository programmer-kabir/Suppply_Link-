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

const CashOutModal = ({ openCashOutModal, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isCompanyExpense, setIsCompanyExpense] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    source: "",
    amount: "",
      category: "purchase",
    purpose: "",
  });

  // auto date
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  if (!openCashOutModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.purpose) {
      toast.error("Amount এবং Purpose লাগবে!");
      return;
    }

    try {
      setLoading(true);

      // 🆕 যদি ইউজার টিকমার্ক দেয়, তবে source কলামে 'company-expense' যাবে, অন্যথায় খালি যাবে।
      const finalSource = isCompanyExpense ? "company-expense" : "";
const payload = {
  ...formData,
  amount: Number(formData.amount),
  source: isCompanyExpense ? "company-expense" : "",
};


      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/cashOut.php`,
        
        payload
        ,

      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed!");
        return;
      }

      toast.success("Cash Out Success ✅");

      // 🆕 ফর্ম রিসেটের সাথে চেকবক্সটিও রিসেট (false) করে দেওয়া হচ্ছে
      setFormData({
        date: new Date().toISOString().split("T")[0],
        source: "",
        amount: "",
        category: "",
        purpose: "",
      });
      setIsCompanyExpense(false);

      onClose();
    } catch (err) {
      toast.error("Error submitting!");
    } finally {
      setLoading(false);
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
          <h2 className="text-white text-lg font-semibold">ক্যাশ আউট</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {/* Form */}
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
              label="পরিমাণ (Amount)"
              icon={<FaMoneyBillWave className="text-red-400" />}
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
            <div className="bg-[#111827] border border-gray-700 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompanyExpense}
                  onChange={(e) => setIsCompanyExpense(e.target.checked)}
                  className="w-5 h-5 accent-red-500"
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    Company Expense
                  </p>

                  <p className="text-xs text-gray-400">
                    এটি কোম্পানির খরচ হলে টিক দিন
                  </p>
                </div>
              </label>
            </div>
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
                {/* normal */}
                <option className="bg-[#0F172A]" value="purchase">
                  কেনাকাটা
                </option>
                <option className="bg-[#0F172A]" value="loan-repayment">
                  লোন পরিশোধ
                </option>
                <option className="bg-[#0F172A]" value="loan-given">
                  লোন প্রদান
                </option>
                <option className="bg-[#0F172A]" value="investor-payout">
                  ইনভেস্টর পেআউট
                </option>

                <option className="bg-[#0F172A]" value="profit-payout">
                  প্রফিট পেআউট
                </option>
                <option className="bg-[#0F172A]" value="others">
                  অন্যান্য
                </option>
                {/* company expense */}
                {isCompanyExpense && (
                  <>
                    <option className="bg-[#0F172A]" value="salary">
                      বেতন
                    </option>

                    <option className="bg-[#0F172A]" value="rent">
                      ভাড়া
                    </option>

                    <option className="bg-[#0F172A]" value="bill">
                      বিল
                    </option>

                    <option className="bg-[#0F172A]" value="office-expense">
                      অফিস খরচ
                    </option>
                  </>
                )}
              </select>
            </FormGroup>

            <FormGroup
              label="খরচের বিবরণ (Purpose)"
              icon={<MdNotes className="text-pink-400" />}
            >
              <textarea
                rows="3"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="যেমন: অফিস খরচ, বাজার..."
                className="input-dark resize-none"
              />
            </FormGroup>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
            >
              {loading ? "Saving..." : "⬇ খরচ সেভ করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashOutModal;

/* 🔹 FormGroup */

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
