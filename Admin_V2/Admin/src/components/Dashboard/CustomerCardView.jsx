const CustomerCardView = ({ card }) => {
  const downPayment = card.payments.find((p) => Number(p.installment_no) === 0);
  const hasDownPayment = !!downPayment;

  const regularInstallments = card.payments.filter(
    (p) => Number(p.installment_no) > 0
  );

  const allInstallments = hasDownPayment
    ? [downPayment, ...regularInstallments]
    : regularInstallments;

  const paidCount = allInstallments.filter((p) => p.status === "Paid").length;

  const totalInstallments =
    Number(card.installment_count) + (hasDownPayment ? 1 : 0);

  const progress = Math.min(
    100,
    Math.round((paidCount / totalInstallments) * 100)
  );

  const downPaymentAmount = downPayment ? Number(downPayment.due_amount) : 0;

  const paidInstallmentAmount = regularInstallments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + Number(p.due_amount), 0);

  const baseInstallmentAmount = Number(card.sale_price) - downPaymentAmount;

  const totalRemaining = Math.max(
    0,
    baseInstallmentAmount - paidInstallmentAmount
  );

  return (
    <>
      {/* ===== Customer Info ===== */}
   

      {/* ===== Card ===== */}
      <div
        className="rounded-xl mb-6 overflow-x-auto md:overflow-hidden w-full
                   scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{
          backgroundColor: "#182337",
          border: "1px solid #0f1d3a",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(56,189,248,0.04)",
          color: "#e5e7eb",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex justify-between items-center min-w-[700px]"
          style={{
            background: "linear-gradient(180deg, #0b1833 0%, #182337 100%)",
            borderBottom: "1px solid #0f1d3a",
          }}
        >
          <div className="flex items-center gap-2">
            <span>📦</span>
            <h3 className="font-semibold text-sm md:text-base">
              {card.product_name}
            </h3>
            <span className="text-xs text-gray-400">
              | কার্ড নম্বর: {card.card_number}
            </span>
          </div>

          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor:
                progress === 100
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(59,130,246,0.15)",
              color: progress === 100 ? "#6ee7b7" : "#93c5fd",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {progress === 100 ? "সম্পূর্ণ পরিশোধিত" : "চলমান"}
          </span>
        </div>

        {/* Summary */}
        <div
          className="px-4 py-3 text-sm grid grid-cols-2 md:grid-cols-4 gap-4 min-w-[700px]"
          style={{ borderBottom: "1px solid #0f1d3a" }}
        >
          {[
            ["মূল্য", card.sale_price],
            ["ডাউন পেমেন্ট", card.down_payment || 0],
            ["মোট বাকি", totalRemaining],
            ["কিস্তি", `${paidCount}/${totalInstallments}`],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-400">{label}</p>
              <p className="font-semibold text-gray-100">৳ {value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="px-4 py-2 min-w-[700px]">
          <div className="h-2 bg-gray-700/40 rounded-full">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #22d3ee, #3b82f6)",
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {progress}% কিস্তি পরিশোধ সম্পন্ন
          </p>
        </div>

        {/* Table */}
        <table
          className="border-collapse w-full min-w-[700px]"
          style={{ color: "#e5e7eb" }}
        >
          <thead>
            <tr>
              {[
                "কিস্তি",
                "নির্ধারিত তারিখ",
                "পরিমাণ",
                "পরিশোধের তারিখ",
                "স্ট্যাটাস",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 hidden lg:table-cell text-sm text-gray-300"
                  style={{
                    backgroundColor: "#0b1833",
                    border: "1px solid #0f1d3a",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[downPayment, ...regularInstallments].filter(Boolean).map((p) => (
              <tr key={p.id} className="hover:bg-[#0b1833]/60 transition">
                <td className="p-3 border border-[#0f1d3a] text-center">
                  {p.installment_no === 0 ? "ডাউন পেমেন্ট" : p.tag}
                </td>
                <td className="p-3 border border-[#0f1d3a] text-center">
                  {p.due_date}
                </td>
                <td className="p-3 border border-[#0f1d3a] text-center">
                  ৳ {p.due_amount}
                </td>
                <td className="p-3 border border-[#0f1d3a] text-center">
                  {p.paid_date || "-"}
                </td>
                <td className="p-3 border border-[#0f1d3a] text-center">
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerCardView;
