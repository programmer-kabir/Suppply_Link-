import React, { useState } from "react";
import { formatMoney, formatNumber } from "../../../../Utils/format";
import { FiChevronRight } from "react-icons/fi";

const AllProfitChartTable = ({ visibleMonthly, totals }) => {
  const [openRow, setOpenRow] = useState(null);

  return (
    <div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-right">
                Personal Investment
              </th>

              <th className="px-3 py-2 text-right">
                Profit Reinvested
              </th>

              <th className="px-3 py-2 text-right">
                Total Monthly Deposit
              </th>

              <th className="px-3 py-2 text-right">
                Current Balance (মোট টাকা)
              </th>

              <th className="px-3 py-2 text-right">
                Personal Weight
              </th>

              <th className="px-3 py-2 text-right">
                Total Weight
              </th>

              <th className="px-3 py-2 text-right">
                Percent (%)
              </th>

              <th className="px-3 py-2 text-right">
                Generated Profit (লাভ)
              </th>

              <th className="px-3 py-2 text-right">
                Company Profit (50%)
              </th>

              <th className="px-3 py-2 text-right">
                Investors Profit (50%)
              </th>

              <th className="px-3 py-2 text-right">
                Personal Profit (নিজস্ব লাভ)
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleMonthly.map((m) => (
              <React.Fragment key={m.monthIndex}>
                {/* MAIN ROW */}
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-3 py-2 text-left">
                    <button
                      onClick={() =>
                        setOpenRow(
  openRow === m.monthIndex
    ? null
    : m.monthIndex
)
                      }
                      className="group flex items-center gap-2 font-medium text-slate-700 transition-all duration-200 hover:text-slate-900"
                    >
                      <span
                        className={`transition-transform duration-300 ease-in-out ${
                          openRow === m.monthIndex
                            ? "rotate-90 text-blue-600"
                            : "rotate-0"
                        }`}
                      >
                        <FiChevronRight size={18} />
                      </span>

                      <span>{m.monthName}</span>
                    </button>
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.selfDeposit)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.profitCarry)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.deposit)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.activeAmount)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {formatNumber(m.personalWeight)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {formatNumber(m.totalWeight)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {formatMoney(m.totalPercent)} %
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.generatedProfit)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.companyProfit)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.investorsProfit)}
                  </td>

                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    ৳ {formatMoney(m.personalProfit)}
                  </td>
                </tr>

                {/* EXPANDABLE ROW */}
                <tr>
                  <td colSpan={12} className="p-0 border-0">
                  <div
  className={`transition-all duration-500 ease-in-out ${
    openRow === m.monthIndex
      ? "max-h-[1000px] opacity-100 overflow-y-auto"
      : "max-h-0 opacity-0 overflow-hidden"
  }`}
>
                      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="px-3 py-2 text-left">
                                  Type
                                </th>

                                <th className="px-3 py-2 text-left">
                                  Date
                                </th>

                                <th className="px-3 py-2 text-right">
                                  Amount
                                </th>

                                <th className="px-3 py-2 text-right">
                                  Active Days
                                </th>

                                <th className="px-3 py-2 text-right">
                                  Weight
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {m.weightBreakdown?.map((w, i) => (
                                <tr
                                  key={i}
                                  className="border-t hover:bg-slate-50 transition-colors duration-200"
                                >
                                  <td className="px-3 py-2">
                                    <span
                                      className={
                                        w.type === "Profit Reinvest"
                                          ? "text-emerald-600 font-medium"
                                          : "text-slate-700"
                                      }
                                    >
                                      {w.type}
                                    </span>
                                  </td>

                                  <td className="px-3 py-2">
                                    {w.originalDate}
                                  </td>

                                  <td className="px-3 py-2 text-right whitespace-nowrap">
                                    ৳ {formatMoney(w.amount)}
                                  </td>

                                  <td className="px-3 py-2 text-right">
                                    {w.days}

                                    {w.isReinvest && (
                                      <div className="text-[10px] text-emerald-600 mt-1">
                                        Profit active for {w.days} days
                                      </div>
                                    )}
                                  </td>

                                  <td className="px-3 py-2 text-right whitespace-nowrap">
                                    {formatNumber(w.weight)}
                                  </td>
                                </tr>
                              ))}

                              {/* TOTAL */}
                              <tr className="border-t bg-slate-100 font-semibold">
                                <td
                                  colSpan={4}
                                  className="px-3 py-2 text-right"
                                >
                                  Total Weight
                                </td>

                                <td className="px-3 py-2 text-right whitespace-nowrap">
                                  {formatNumber(m.personalWeight)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}

            {/* GRAND TOTAL */}
            <tr className="bg-slate-100 font-semibold">
              <td className="px-3 py-2 text-left">
                Grand Total
              </td>

              <td></td>
              <td></td>
              <td></td>

              <td className="px-3 py-2 text-right whitespace-nowrap">
                ৳{" "}
                {formatMoney(
                  visibleMonthly[
                    visibleMonthly.length - 1
                  ]?.activeAmount || 0,
                )}
              </td>

              <td></td>
              <td></td>
              <td></td>

              <td className="px-3 py-2 text-right whitespace-nowrap">
                ৳ {formatNumber(totals.generatedProfit)}
              </td>

              <td className="px-3 py-2 text-right whitespace-nowrap">
                ৳ {formatNumber(
                  totals.totalCompanyProfit,
                )}
              </td>

              <td className="px-3 py-2 text-right whitespace-nowrap">
                ৳ {formatNumber(
                  totals.totalCompanyProfit,
                )}
              </td>

              <td className="px-3 py-2 text-right whitespace-nowrap">
                ৳ {formatMoney(totals.profit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProfitChartTable;