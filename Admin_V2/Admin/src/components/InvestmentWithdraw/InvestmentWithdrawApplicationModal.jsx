
const money = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "0";
  return x.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

const Field = ({ label, value }) => (
  <div className="min-w-0">
    <div className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </div>
    <div className="mt-0.5 text-sm text-slate-100 break-words">
      {value ?? "-"}
    </div>
  </div>
);

export const InvestmentWithdrawApplicationModal = ({
  open,
  onClose,
  investorId,
  investor,
  cardId,
  card,
  withdrawDate,
  sumOfCardProfit,
  payableAmount,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4 bg-gradient-to-b from-white/[0.06] to-transparent">
          <div>
            <div className="text-lg font-semibold text-white">
              Withdraw Preview (Demo)
            </div>
            <div className="mt-0.5 text-sm text-slate-400">
              Demo text only — তুমি পরে backend data বসাবে।
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="px-5 py-5 space-y-4">
          {/* quick meta */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-400">Investor ID</div>
              <div className="mt-1 text-base font-semibold text-white">
                {investorId || "-"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-400">Card ID</div>
              <div className="mt-1 text-base font-semibold text-white">
                {cardId || "-"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-400">Withdraw Date</div>
              <div className="mt-1 text-base font-semibold text-white">
                {withdrawDate || "-"}
              </div>
            </div>
          </div>

          {/* Investor + Card */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-100">
                Investor
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Name"
                  value={investor?.name || "Demo Investor Name"}
                />
                <Field label="Phone" value={investor?.mobile || "01XXXXXXXXX"} />
                <Field
                  label="Address "
                  value={investor?.address || "-"}
                />
                <Field label="ID" value={investor?.id || investorId || "-"} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-100">
                Card
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Card Name"
                  value={card?.card_name || "Demo Card Name"}
                />
                <Field label="Card ID" value={card?.id || cardId || "-"} />
                <Field
                  label="Invest Amount"
                  value={`৳ ${money(card?.investment_amount ?? 100000)}`}
                />
                <Field
                  label="Status"
                  value={(card?.status || "active").toUpperCase()}
                />
                <Field
                  label="Start Date"
                  value={card?.start_date || "2026-01-01"}
                />
                <Field
                  label="Maturity Date"
                  value={card?.maturity_date || "2026-12-31"}
                />
              </div>
            </div>
          </div>

          {/* Profit Summary (demo) */}
          <div className="rounded-2xl border border-white/10 bg-[#071025] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Profit </span>
              <span className="text-slate-100 font-semibold">
                ৳ {sumOfCardProfit}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Payable Amount
                {card?.payment_type === "flexible" && (
                  <span className="ml-1 text-xs text-amber-400">
                    (Flexible)
                  </span>
                )}
              </span>

              <span
                className={`font-semibold ${
                  payableAmount === 0 ? "text-rose-300" : "text-white"
                }`}
              >
                ৳ {money(payableAmount)}
              </span>
            </div>

            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
              
               Note: Early withdraw হলে profit 0 দেখাবে 
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end border-t border-white/10 px-5 py-4 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-auto rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
