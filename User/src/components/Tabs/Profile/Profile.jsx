import { FaEdit } from "react-icons/fa";
import currentUser from "../../../Utils/currentUser";
import useInvestInstallmentCards from "../../../Utils/Hooks/useInvestInstallmentCards";
import { formatCurrency } from "../../formatCurrency";
import { useState } from "react";
import usePaymentMethod from "../../../Utils/Hooks/usePaymentMethod";
import { toast } from "react-toastify";
import PaymentMethodShow from "./PaymentMethodShow";
const Profile = () => {
  const { investInstallmentCards } = useInvestInstallmentCards();
  const runningUser = currentUser();
  const { paymentMethods, isPaymentMethodsLoading, isPaymentMethodsError } =
    usePaymentMethod(runningUser?.id);
  const userInstallmentsCards = investInstallmentCards.filter(
    (userCard) => userCard.investor_id === runningUser?.id,
  );
  const totalAmount = userInstallmentsCards.reduce(
    (sum, card) => sum + Number(card.investment_amount || 0),
    0,
  );
  const activeCardsCount = userInstallmentsCards.filter(
    (card) => card.status === "running",
  ).length;

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "সক্রিয় সদস্য";
      case "pending":
        return "অপেক্ষমান সদস্য";
      case "blocked":
        return "ব্লক করা সদস্য";
      default:
        return "সক্রিয় সদস্য";
    }
  };
  const getInvestorBadge = (amount) => {
    if (amount >= 1000000) {
      return {
        label: "প্লাটিনাম",
        icon: "🏆",
        chipBg: "bg-violet-50",
        chipText: "text-violet-700",
        chipBorder: "border-violet-100",
      };
    } else if (amount >= 500000) {
      return {
        label: "গোল্ড",
        icon: "🥇",
        chipBg: "bg-amber-50",
        chipText: "text-amber-500",
        chipBorder: "border-amber-100",
      };
    } else if (amount >= 200000) {
      return {
        label: "সিলভার",
        icon: "🥈",
        chipBg: "bg-slate-50",
        chipText: "text-slate-700",
        chipBorder: "border-slate-200",
      };
    } else if (amount >= 50000) {
      return {
        label: "ব্রোঞ্জ",
        icon: "🥉",
        chipBg: "bg-orange-50",
        chipText: "text-orange-700",
        chipBorder: "border-orange-100",
      };
    } else {
      return {
        label: "নতুন ইনভেস্টর",
        icon: "🌱",
        chipBg: "bg-emerald-50",
        chipText: "text-emerald-700",
        chipBorder: "border-emerald-100",
      };
    }
  };
  const badge = getInvestorBadge(totalAmount);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("handCash");

  const [bankInfo, setBankInfo] = useState({
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    bank_branch: "",
    bank_statement_image: null,
  });

  const [walletNumbers, setWalletNumbers] = useState({
    bkash: "",
    nagad: "",
    rocket: "",
  });
  const handleProfileDetails = async () => {
    if (paymentMethod === "bank") {
      if (
        !bankInfo.bank_name ||
        !bankInfo.bank_account_name ||
        !bankInfo.bank_account_number ||
        !bankInfo.bank_branch
      ) {
        toast.error("ব্যাংকের সব তথ্য পূরণ করা বাধ্যতামূলক ❌");
        return;
      }
    }
    if (paymentMethod === "mobileWallet") {
      const hasAnyWallet =
        walletNumbers.bkash || walletNumbers.nagad || walletNumbers.rocket;

      if (!hasAnyWallet) {
        toast.error("মোবাইল ওয়ালেটের কমপক্ষে একটি নাম্বার দিতে হবে ❌");
        return;
      }
    }
    const formData = new FormData();

    formData.append("user_id", runningUser?.id);
    formData.append("payment_method", paymentMethod);
    formData.append("review", "pending");

    // ===== BANK =====
    if (paymentMethod === "bank") {
      formData.append("bank_name", bankInfo.bank_name);
      formData.append("bank_account_name", bankInfo.bank_account_name);
      formData.append("bank_account_number", bankInfo.bank_account_number);
      formData.append("bank_branch", bankInfo.bank_branch);

      if (bankInfo.bank_statement_image) {
        formData.append("bank_statement_image", bankInfo.bank_statement_image);
      }
    }

    // ===== MOBILE WALLET =====
    if (paymentMethod === "mobileWallet") {
      formData.append("bkash_number", walletNumbers.bkash || "");
      formData.append("nagad_number", walletNumbers.nagad || "");
      formData.append("rocket_number", walletNumbers.rocket || "");
    }


    // ===== API CALL =====
    const res = await fetch(
      "https://app.supplylinkbd.com/apis/paymentMethod/update_payment_method.php",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    if (data?.success) {
      toast.success("পেমেন্ট তথ্য সফলভাবে আপডেট হয়েছে ✅");
      setIsEditOpen(false);
    } else {
      toast.error(data?.message || "কিছু একটা সমস্যা হয়েছে ❌");
    }
  };
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  return (
    <div className="mt-6  pb-24 px-1">
      <div className="rounded-3xl bg-white shadow-lg border border-slate-100 px-6 sm:px-10 py-8 sm:py-10 max-w-4xl mx-auto">
        {/* Top avatar + name */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-indigo-100 shadow-md overflow-hidden bg-slate-100">
              <img
                src={`https://app.supplylinkbd.com/${runningUser?.photo}`}
                alt={runningUser?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-white text-lg shadow-md">
              {badge.icon}
            </span>
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-slate-800">
            {runningUser?.name}
          </h2>
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-xs sm:text-base text-indigo-600 font-medium mt-1 flex items-center gap-2 cursor-pointer hover:underline"
          >
            প্রোফাইল তথ্য <FaEdit />
          </button>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] text-indigo-700 border border-indigo-100">
            <span className="text-xs">👑 ইনভেস্টর ব্যাজ:</span>
            <span className="font-semibold">{badge.label}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">😊</span>
            <div>
              <p className="text-xs text-slate-400">নাম</p>
              <p className="font-semibold">{runningUser?.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">📱</span>
            <div>
              <p className="text-xs text-slate-400">মোবাইল</p>
              <p className="font-semibold">{runningUser?.mobile}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">📍</span>
            <div>
              <p className="text-xs text-slate-400">ঠিকানা</p>
              <p className="font-semibold">{runningUser?.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">🆔</span>
            <div>
              <p className="text-xs text-slate-400">এনআইডি / মেম্বার আইডি</p>
              <p className="font-semibold">{runningUser?.id_number}</p>
            </div>
          </div>
        </div>
        {/* ===== Payment Information ===== */}
        <PaymentMethodShow
          paymentMethods={paymentMethods}
          setIsBankModalOpen={setIsBankModalOpen}
        />

        {/* Small stats cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">ইনভেস্টমেন্ট কার্ড</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {formatCurrency(userInstallmentsCards?.length)} টি
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">সক্রিয় ইনভেস্টমেন্ট কার্ড</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {formatCurrency(activeCardsCount)} টি
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-xs text-emerald-600">মোট বিনিয়োগ</p>
            <p className="mt-1 text-lg font-semibold text-emerald-700">
              ৳{formatCurrency(totalAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-600">ইনভেস্টর স্ট্যাটাস</p>
            <p className="mt-1 text-lg font-semibold text-amber-700">
              {getStatusLabel(runningUser?.status)}
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-[11px] text-slate-500 text-center">
          আপনার প্রোফাইল তথ্য সর্বশেষ আপডেট আছে। কোনো ভুল থাকলে কর্তৃপক্ষের সাথে
          যোগাযোগ করুন।
        </p>
      </div>
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-slate-800">
                প্রোফাইল ও পেমেন্ট তথ্য আপডেট
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1">
                পেমেন্ট মেথড
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="handCash">হাতেকলমে (Cash)</option>
                <option value="bank">ব্যাংক ট্রান্সফার</option>
                <option value="mobileWallet">মোবাইল ওয়ালেট</option>
              </select>
            </div>

            {/* ===== BANK INFO ===== */}
            {paymentMethod === "bank" && (
              <div className="space-y-3 border rounded-lg p-4 bg-slate-50 mb-4">
                <p className="text-sm font-semibold text-slate-700">
                  ব্যাংক তথ্য
                </p>

                <input
                  placeholder="ব্যাংকের নাম"
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue={paymentMethods?.bank?.bank_name}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bank_name: e.target.value })
                  }
                />

                <input
                  placeholder="অ্যাকাউন্ট হোল্ডারের নাম"
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue={paymentMethods?.bank?.bank_account_name}
                  onChange={(e) =>
                    setBankInfo({
                      ...bankInfo,
                      bank_account_name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="অ্যাকাউন্ট নাম্বার"
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue={paymentMethods?.bank?.bank_account_number}
                  onChange={(e) =>
                    setBankInfo({
                      ...bankInfo,
                      bank_account_number: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="ব্রাঞ্চ"
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue={paymentMethods?.bank?.bank_branch}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bank_branch: e.target.value })
                  }
                />

                <input
                  type="file"
                  className="w-full text-sm"
                  onChange={(e) =>
                    setBankInfo({
                      ...bankInfo,
                      bank_statement_image: e.target.files[0],
                    })
                  }
                />
              </div>
            )}

            {/* ===== MOBILE WALLET (ALL 3) ===== */}
            {paymentMethod === "mobileWallet" && (
              <div className="space-y-3 border rounded-lg p-4 bg-slate-50 mb-4">
                <p className="text-sm font-semibold text-slate-700">
                  মোবাইল ওয়ালেট নাম্বার
                </p>

                <input
                  placeholder="bKash নাম্বার"
                  className="w-full border rounded px-3 py-2 text-sm"
                  // value={walletNumbers.bkash}
                  defaultValue={paymentMethods?.mobile_wallet?.bkash}
                  onChange={(e) =>
                    setWalletNumbers({
                      ...walletNumbers,
                      bkash: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Nagad নাম্বার"
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue={paymentMethods?.mobile_wallet?.nagad}
                  onChange={(e) =>
                    setWalletNumbers({
                      ...walletNumbers,
                      nagad: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Rocket নাম্বার"
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue={paymentMethods?.mobile_wallet?.rocket}
                  onChange={(e) =>
                    setWalletNumbers({
                      ...walletNumbers,
                      rocket: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded-lg text-sm border border-slate-300 text-slate-600"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  handleProfileDetails();
                  setIsEditOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">
                ব্যাংক তথ্য ও ডকুমেন্ট
              </h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-slate-800">
              {/* ===== LEFT: IMAGE ===== */}
              <div className="flex justify-center w-full h-full">
                <img
                  src={`https://app.supplylinkbd.com/${paymentMethods.bank.bank_statement_image}`}
                  alt="Bank Document"
                  className="rounded-lg  w-full border p-2 border-slate-200 max-h-[500px]  w-full  bg-slate-50"
                />
              </div>

              {/* ===== RIGHT: BANK INFO ===== */}
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">ব্যাংকের নাম</p>
                  <p className="font-medium">
                    {paymentMethods.bank.bank_name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">অ্যাকাউন্ট হোল্ডারের নাম</p>
                  <p className="font-medium">
                    {paymentMethods.bank.bank_account_name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">অ্যাকাউন্ট নাম্বার</p>
                  <p className="font-medium">
                    ****
                    {paymentMethods.bank.bank_account_number?.slice(-4) || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">ব্রাঞ্চ</p>
                  <p className="font-medium">
                    {paymentMethods.bank.bank_branch || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
