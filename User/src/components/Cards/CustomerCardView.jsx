const CustomerCardView = ({ card, user }) => {
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
// console.log(user)
  return (
       <>
      {/* ===== Customer Info ===== */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 px-4 py-4 space-y-2">
        <p>🆔 {user?.id} {user?.name}</p>
        <p>📞 মোবাইল: {user?.mobile}</p>
        <p>📍 ঠিকানা: {user?.address}</p>
      </div>

      {/* ===== Main Card ===== */}
      <div className="bg-white border border-gray-200 rounded-xl mb-8 overflow-x-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200 min-w-[700px]">
          <div className="flex items-center gap-2">
            <span>📦</span>
            <h3 className="font-semibold text-gray-800">
              {card.product_name}
            </h3>
            <span className="text-xs text-gray-500">
              | কার্ড নম্বর: {card.card_number}
            </span>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full ${
              progress === 100
                ? "bg-emerald-100 text-emerald-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {progress === 100 ? "সম্পূর্ণ পরিশোধিত" : "চলমান"}
          </span>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-4 border-b border-gray-200 min-w-[700px]">
          <div>
            <p className="text-gray-500 text-sm">মূল্য</p>
            <p className="font-semibold text-gray-800">
              ৳ {card.sale_price}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">ডাউন পেমেন্ট</p>
            <p className="font-semibold text-gray-800">
              ৳ {card.down_payment || 0}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">মোট বাকি</p>
            <p className="font-semibold text-gray-800">
              ৳ {totalRemaining}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">কিস্তি</p>
            <p className="font-semibold text-gray-800">
              {paidCount}/{totalInstallments}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 border-b border-gray-200 min-w-[700px]">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress}% কিস্তি পরিশোধ সম্পন্ন
          </p>
        </div>

        {/* Table */}
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-gray-50">
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
                  className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {downPayment && (
              <tr className="hover:bg-gray-50">
                <td className="p-3 text-center border-b border-gray-200">
                  ডাউন পেমেন্ট
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  {downPayment.due_date}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  ৳ {downPayment.due_amount}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  {downPayment.paid_date || "-"}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  {downPayment.status}
                </td>
              </tr>
            )}

            {regularInstallments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-3 text-center border-b border-gray-200">
                  {p.tag}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  {p.due_date}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  ৳ {p.due_amount}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
                  {p.paid_date || "-"}
                </td>
                <td className="p-3 text-center border-b border-gray-200">
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
