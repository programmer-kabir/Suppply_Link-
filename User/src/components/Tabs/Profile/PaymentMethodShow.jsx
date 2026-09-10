import React from "react";
import { MdPayments } from "react-icons/md";
const PaymentMethodShow = ({ paymentMethods, setIsBankModalOpen }) => {
  // console.log(paymentMethods);
  const hasBank =
    paymentMethods?.bank &&
    (paymentMethods.bank.bank_name ||
      paymentMethods.bank.bank_account_number ||
      paymentMethods.bank.bank_account_name);

  const hasWallet =
    paymentMethods?.mobile_wallet &&
    (paymentMethods.mobile_wallet.bkash ||
      paymentMethods.mobile_wallet.nagad ||
      paymentMethods.mobile_wallet.rocket);
  const getReviewBadge = (review) => {
    switch (review) {
      case "approved":
        return {
          text: "Approved",
          className: "bg-green-100 text-green-700 border-green-200",
        };
      case "rejected":
        return {
          text: "Rejected",
          className: "bg-red-100 text-red-700 border-red-200",
        };
      case "pending":
      default:
        return {
          text: "Pending",
          className:
            "bg-yellow-500 text-black-500 border-yellow-200 font-semibold ",
        };
    }
  };

  return (
    <div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="pb-5">
          <div className="flex items-center gap-2 pob">
            <span className="">
              <MdPayments size={23} />
            </span>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              পেমেন্ট তথ্য
            </h3>
            {paymentMethods?.review && (
              <p
                className={`px-2 py-0.5 rounded-full text-[10px] border font-bold ${
                  getReviewBadge(paymentMethods.review).className
                }`}
              >
                {getReviewBadge(paymentMethods.review).text}
              </p>
            )}
          </div>
          {paymentMethods?.review === "rejected" && paymentMethods?.remarks && (
            <div className="mt-2  rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <span className="font-semibold">❌ Rejection Reason:</span>{" "}
              {paymentMethods.remarks}
            </div>
          )}
        </div>

        {hasBank && hasWallet && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BANK */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                🏦 ব্যাংক ট্রান্সফার
              </p>

              <p className="text-sm">
                <span className="text-slate-500">ব্যাংক:</span>{" "}
                {paymentMethods.bank.bank_name}
              </p>
              <p className="text-sm">
                <span className="text-slate-500">অ্যাকাউন্ট নাম:</span>{" "}
                {paymentMethods.bank.bank_account_name}
              </p>
              <p className="text-sm">
                <span className="text-slate-500">অ্যাকাউন্ট নাম্বার:</span> ****
                {paymentMethods.bank.bank_account_number?.slice(-4)}
              </p>
              <p className="text-sm">
                <span className="text-slate-500">ব্রাঞ্চ:</span>{" "}
                {paymentMethods.bank.bank_branch}
              </p>

              {paymentMethods?.bank?.bank_statement_image && (
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="mt-2 text-xs text-indigo-600 hover:underline"
                >
                  📄 ব্যাংক ডকুমেন্ট দেখুন
                </button>
              )}
            </div>

            {/* WALLET */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                📱 মোবাইল ওয়ালেট
              </p>

              {paymentMethods.mobile_wallet.bkash && (
                <p className="text-sm">
                  bKash: {paymentMethods.mobile_wallet.bkash}
                </p>
              )}
              {paymentMethods.mobile_wallet.nagad && (
                <p className="text-sm">
                  Nagad: {paymentMethods.mobile_wallet.nagad}
                </p>
              )}
              {paymentMethods.mobile_wallet.rocket && (
                <p className="text-sm">
                  Rocket: {paymentMethods.mobile_wallet.rocket}
                </p>
              )}
            </div>
          </div>
        )}
        {hasBank && !hasWallet && (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              🏦 ব্যাংক ট্রান্সফার
            </p>

            <p className="text-sm">ব্যাংক: {paymentMethods.bank.bank_name}</p>
            <p className="text-sm">
              অ্যাকাউন্ট নাম: {paymentMethods.bank.bank_account_name}
            </p>
            <p className="text-sm">
              অ্যাকাউন্ট নাম্বার: ****
              {paymentMethods.bank.bank_account_number?.slice(-4)}
            </p>
            <p className="text-sm">
              ব্রাঞ্চ: {paymentMethods.bank.bank_branch}
            </p>
            {paymentMethods?.bank?.bank_statement_image && (
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="mt-2 text-xs text-indigo-600 hover:underline"
              >
                📄 ব্যাংক ডকুমেন্ট দেখুন
              </button>
            )}
          </div>
        )}
        {!hasBank && hasWallet && (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              📱 মোবাইল ওয়ালেট
            </p>

            {paymentMethods.mobile_wallet.bkash && (
              <p className="text-sm">
                bKash: {paymentMethods.mobile_wallet.bkash}
              </p>
            )}
            {paymentMethods.mobile_wallet.nagad && (
              <p className="text-sm">
                Nagad: {paymentMethods.mobile_wallet.nagad}
              </p>
            )}
            {paymentMethods.mobile_wallet.rocket && (
              <p className="text-sm">
                Rocket: {paymentMethods.mobile_wallet.rocket}
              </p>
            )}
          </div>
        )}
        {!hasBank && !hasWallet && (
          <div className="text-sm text-slate-700">
            <span className="text-slate-500">পদ্ধতি:</span>{" "}
            <span className="font-medium">হাতেকলমে (Cash)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodShow;
