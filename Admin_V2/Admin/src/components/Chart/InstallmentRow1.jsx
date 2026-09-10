import { useState, useEffect } from "react";
import { FiSave, FiTrash2 } from "react-icons/fi";
import { InstallmentItemRow } from "./InstallmentItemRow";
import { DownPaymentRow } from "./DownPaymentRow";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const headers = [
  "ট্যাগ",
  "পরিমাণ",
  "মূলধন",
  "লাভ",
  "নির্ধারিত তারিখ",
  "পরিশোধের তারিখ",
  "পেমেন্ট",
  "রশিদ",
  "স্ট্যাটাস",
  "Action",
];

const today = new Date().toISOString().split("T")[0];
const pad2 = (n) => String(n).padStart(2, "0");

const toYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const addMonthsYMD = (ymd, add) => {
  const [y, m, d] = (ymd || "").split("-").map(Number);
  if (!y || !m || !d) return "";

  const base = new Date(y, m - 1, d);
  const temp = new Date(base.getFullYear(), base.getMonth() + add, 1);

  const lastDay = new Date(
    temp.getFullYear(),
    temp.getMonth() + 1,
    0,
  ).getDate();

  const day = Math.min(d, lastDay);
  return toYMD(new Date(temp.getFullYear(), temp.getMonth(), day));
};

export const InstallmentRow = ({
  installmentType,
  hasDownPayment,
  card,
  onSaveSuccess,
  InstallmentPayments,
  user,
}) => {
  /* ================= BASIC ================= */
  const installmentCount = Number(installmentType || 0);

  const bnNumbers = [
    "১ম",
    "২য়",
    "৩য়",
    "৪র্থ",
    "৫ম",
    "৬ষ্ঠ",
    "৭ম",
    "৮ম",
    "৯ম",
    "১০ম",
    "১১তম",
    "১২তম",
    "১৩তম",
    "১৪তম",
    "১৫তম",
    "১৬তম",
    "১৭তম",
    "১৮তম",
    "১৯তম",
    "২০তম",
    "২১তম",
    "২২তম",
    "২৩তম",
    "২৪তম",
  ];

  const costPrice = Number(card?.cost_price || 0);
  const salePrice = Number(card?.sale_price || 0);
  const baseAmount = Number(card?.per_installment_amount || 0);

  /* ================= CORE CALCULATION ================= */
  const calculatePrincipalProfit = (amount) => {
    const due = Number(amount) || 0;

    if (costPrice > 0 && salePrice > 0) {
      const principal = Number(((due * costPrice) / salePrice).toFixed(2));
      const profit = Number((due - principal).toFixed(2));
      return { principal, profit };
    }

    return { principal: 0, profit: 0 };
  };

  /* ================= DOWN PAYMENT ================= */
  const downPaymentAmount = Number(card?.down_payment || 0);
  const downPaymentCalc = calculatePrincipalProfit(downPaymentAmount);
  /* ================= PRINCIPAL-BASED ADJUSTMENT ================= */
  // principal from base installment
  const basePrincipal = Number(
    ((baseAmount * costPrice) / salePrice).toFixed(2),
  );

  // total principal if all base installments used
  const principalSum = basePrincipal * installmentCount;

  // rounding difference (THIS is the real problem)
  const principalDiff = Number((costPrice - principalSum).toFixed(2));

  /* ================= INSTALLMENTS STATE ================= */
  const [installments, setInstallments] = useState([]);

  useEffect(() => {
    setInstallments(
      Array.from({ length: installmentCount }).map((_, index) => {
        // adjust ONLY first installment and ONLY when no down payment
        if (!hasDownPayment && index === 0 && principalDiff !== 0) {
          const adjustedPrincipal = basePrincipal + principalDiff;

          // reverse-calc amount from adjusted principal
          const adjustedAmount = Number(
            ((adjustedPrincipal * salePrice) / costPrice).toFixed(2),
          );

          return { amount: adjustedAmount };
        }

        return { amount: baseAmount };
      }),
    );
  }, [
    installmentCount,
    baseAmount,
    basePrincipal,
    principalDiff,
    hasDownPayment,
    costPrice,
    salePrice,
  ]);

  /* ================= HANDLER ================= */
  const handleAmountChange = (index, value) => {
    const updated = [...installments];
    updated[index].amount = Number(value) || 0;
    setInstallments(updated);
  };

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setPayments(
      InstallmentPayments.map((p) => ({
        ...p,
      })),
    );
  }, [InstallmentPayments]);
  const handlePaidDateChange = (index, value) => {
    const updated = [...payments];
    updated[index].paid_date = value;
    setPayments(updated);
  };
  const handleStatusChange = (index, value) => {
    const updated = [...payments];
    updated[index].status = value;

    if (value === "Paid" && !updated[index].paid_date) {
      updated[index].paid_date = today;
    }

    setPayments(updated);
  };

  const handlePaymentMethodChange = (index, value) => {
    const updated = [...payments];
    updated[index].payment_method = value;
    setPayments(updated);
  };
  const handleReceiptChange = (index, value) => {
    const updated = [...payments];
    updated[index].receipt_number = value;
    setPayments(updated);
  };
  const handleUpdateInstallment = async (index) => {
    const updatedItem = payments[index];

    const payload = {
      id: updatedItem.id,
      paid_date: updatedItem.paid_date,
      payment_method: updatedItem.payment_method,
      receipt_number: updatedItem.receipt_number,
      status: updatedItem.status,
      signature: user?.id,
    };
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/customers/installment_payment_update.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      toast.success("Your Data has update");
    } catch (err) {
      toast.error("Update failed", err);
    }
  };

  // Save all
  /* ================= BUILD PAYLOAD ================= */

  const buildPaymentsPayload = () => {
    const rows = [];

    /* ---- Down Payment (optional) ---- */
    if (hasDownPayment && downPaymentAmount > 0) {
      const { principal, profit } = calculatePrincipalProfit(downPaymentAmount);

      rows.push({
        card_id: card.id,
        installment_no: 0,
        tag: "ডাউন পেমেন্ট",
        due_amount: downPaymentAmount,
        principal_amount: principal,
        profit_amount: profit,
        due_date: card.delivery_date || today,
        paid_date: card.delivery_date || today,
        payment_method: "Cash",
        receipt_number: "",
        signature: null,
        status: "Paid",
      });
    }

    /* ---- Installments ---- */
    const firstDue = card.first_installment_date;

    installments.forEach((inst, index) => {
      const { principal, profit } = calculatePrincipalProfit(inst.amount);
      const dueDate = addMonthsYMD(firstDue, index);
      rows.push({
        card_id: card.id,
        installment_no: index + 1,
        tag: `${bnNumbers[index] || index + 1} কিস্তি`,
        due_amount: inst.amount,
        principal_amount: principal,
        profit_amount: profit,
        due_date: dueDate,
        paid_date: null,
        payment_method: "Cash",
        receipt_number: "",
        Signature: null,
        status: "Unpaid",
      });
    });

    return rows;
  };
  const handleSaveAll = async () => {
    const payload = buildPaymentsPayload();

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/customers/installment_payments_insert.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success(
          "কিস্তি সংক্রান্ত সকল তথ্য সফলভাবে সিস্টেমে সংরক্ষিত হয়েছে।",
        );

        onSaveSuccess?.();
        navigate("/customers/installment_cards");
      }
    } catch (err) {
      toast.error("সার্ভার সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
    }
  };

  /* ================= RENDER ================= */
  const isAllPaid =
    payments.length > 0 && payments.every((p) => p.status === "Paid");
  const navigate = useNavigate();
  const handleMarkFullPaid = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/customers/installment_card_update.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            card_id: card.id,
            status: "Fully Paid",
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(
          `কার্ড ${card.id} সফলভাবে সম্পূর্ণ পরিশোধ (Fully Paid) হিসেবে আপডেট করা হয়েছে।`,
        );

        setTimeout(() => {
          navigate("/customers/installment_cards");
        }, 200);
      }
    } catch (err) {
      toast.error("কার্ড আপডেট করা যায়নি");
    }
  };

  return (
    <>
      <div className="relative w-full overflow-x-auto bg-slate-800 rounded-lg shadow-md text-slate-300">
        
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="p-4  border-b border-slate-600 bg-slate-700 text-sm font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ===== DOWN PAYMENT ===== */}
            {hasDownPayment && (
              <DownPaymentRow
                card={card}
                amount={downPaymentAmount}
                calc={downPaymentCalc}
                today={today}
              />
            )}
            {/* ===== INSTALLMENTS ===== */}
            {installments.map((item, index) => (
              <InstallmentItemRow
                key={index}
                index={index}
                item={item}
                card={card}
                bnNumbers={bnNumbers}
                costPrice={costPrice}
                salePrice={salePrice}
                onAmountChange={handleAmountChange}
              />
            ))}

            {InstallmentPayments.map((item, index) => {
              const { principal, profit } = calculatePrincipalProfit(
                item.due_amount,
              );

              return (
                <tr key={index} className="border-t border-slate-700">
                  <td className="p-4 border-r border-slate-700">{item?.tag}</td>

                  <td className="p-4 border-r border-slate-700">
                    <input
                      value={item?.due_amount}
                      readOnly
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    />
                  </td>

                  <td className="p-4 border-r border-slate-700">
                    <input
                      value={principal}
                      readOnly
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-300"
                    />
                  </td>

                  <td className="p-4 border-r border-slate-700 w-[150px]">
                    <input
                      value={profit}
                      readOnly
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-yellow-300"
                    />
                  </td>

                  <td className="p-4 border-r border-slate-700">
                    <input
                      type="date"
                      defaultValue={item?.due_date}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 date-fix"
                    />
                  </td>

                  <td className="p-4 border-r border-slate-700">
                    <input
                      type="date"
                      value={payments[index]?.paid_date || ""}
                      onChange={(e) =>
                        handlePaidDateChange(index, e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 date-fix"
                    />
                  </td>

                  <td className="p-4 border-r border-slate-700">
                    <select
                      value={payments[index]?.payment_method || "Cash"}
                      onChange={(e) =>
                        handlePaymentMethodChange(index, e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                    </select>
                  </td>

                  <td className="p-4  w-[120px]  border-r border-slate-700">
                    <input
                      value={payments[index]?.receipt_number || ""}
                      onChange={(e) =>
                        handleReceiptChange(index, e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    />
                  </td>

                  <td className="p-4 border-r border-slate-700">
                    <select
                      value={payments[index]?.status || "Unpaid"}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleUpdateInstallment(index)}
                      className="p-2 bg-emerald-600/20 rounded text-emerald-400"
                    >
                      <FiSave />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {installmentType && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              handleSaveAll();
              onSaveSuccess?.(); // 👈 save হলে hide
            }}
            className="flex items-center gap-2
        rounded-xl px-6 py-3
        bg-gradient-to-r from-green-600 to-emerald-600
        text-sm font-semibold text-white
        shadow-md shadow-green-900/30
        hover:from-green-500 hover:to-emerald-500
        transition"
          >
            <FiSave />
            Save
          </button>
        </div>
      )}
      {InstallmentPayments.length > 0 && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            disabled={!isAllPaid}
            onClick={handleMarkFullPaid}
            className={`
        flex items-center gap-2 px-6 py-3 rounded-xl
        text-sm font-semibold text-white transition
        ${
          isAllPaid
            ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500"
            : "bg-gray-600 cursor-not-allowed opacity-50"
        }
      `}
          >
            ✅ Mark as Full Paid
          </button>
        </div>
      )}

    </>
  );
};
