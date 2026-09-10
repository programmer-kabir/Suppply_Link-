import React from "react";
import { formatMoney, formatNumber } from "../../../../Utils/format";

const ProfitChartTable = ({ visibleMonthly, totals }) => {
  return (
    <div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-left">Personal Investment</th>
              <th className="px-3 py-2 text-left">Profit Reinvested</th>
              <th className="px-3 py-2 text-left">Total Monthly Deposit</th>
              <th className="px-3 py-2 text-right">
                Current Balance (মোট টাকা)
              </th>
              <th className="px-3 py-2 text-right">Personal Weight</th>

              <th className="px-3 py-2 text-right">Total Weight</th>

              <th className="px-3 py-2 text-right">Percent (%)</th>
              <th className="px-3 py-2 text-right">Generated Profit (লাভ)</th>
              <th className="px-3 py-2 text-right">Company Profit (50%)</th>
              <th className="px-3 py-2 text-right">Investors Profit (50%)</th>
              <th className="px-3 py-2 text-right">
                {" "}
                Personal Profit (নিজস্ব লাভ)
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleMonthly.map((m) => (
              <tr
                key={m.monthIndex}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-3 py-2 text-left">{m.monthName}</td>
                <td className="px-3 py-3 text-right">
                  ৳ {formatMoney(m.selfDeposit)}
                </td>
                <td className="px-3 py-3 text-right text-emerald-600">
                  ৳ {formatMoney(m.profitCarry)}
                </td>
                <td className="px-3 py-3 text-right font-medium">
                  ৳ {formatMoney(m.deposit)}
                </td>
                {/* 🔥 Running Investment */}
                <td className="px-3 py-2 text-right">
                  ৳ {formatMoney(m.activeAmount)}
                </td>

                {/* Weight */}
                <td className="px-3 py-2 text-right">
                  {formatNumber(m.personalWeight)}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatNumber(m.totalWeight)}
                </td>

                {/* Percent */}
                <td className="px-3 py-2 text-right">
                  {formatMoney(m.totalPercent)} %
                </td>

                {/* Profit */}
                <td className="px-3 py-2 text-right">
                  ৳ {formatMoney(m.generatedProfit)}
                </td>
                <td className="px-3 py-2 text-right">
                  ৳ {formatMoney(m.companyProfit)}
                </td>
                <td className="px-3 py-2 text-right">
                  ৳ {formatMoney(m.investorsProfit)}
                </td>
                <td className="px-3 py-2 text-right">
                  ৳ {formatMoney(m.personalProfit)}
                </td>
              </tr>
            ))}

            <tr className="bg-slate-100 font-semibold">
              <td className="px-3 py-2 text-left">Grand Total</td>

              {/* <td className="px-3 py-2 text-right">
                ৳ {formatMoney(totals.amount)}
              </td> */}
              <td></td>
              <td></td>
              <td></td>
              <td className="px-3 py-2 text-right">
                ৳{" "}
                {formatMoney(
                  visibleMonthly[visibleMonthly.length - 1]?.activeAmount || 0,
                )}
              </td>
              {/* <td className="px-3 py-2 text-right">
                {formatNumber(totals.weight)}
              </td> */}
              {/* <td className="px-3 py-2 text-right">
                      {formatNumber(totals.totalWeight)}
                    </td> */}

              <td></td>
              <td></td>
              <td></td>
              <td className="px-3 py-2 text-right">
                {formatNumber(totals.generatedProfit)}
              </td>

              <td className="px-3 py-2 text-right">
                {formatNumber(totals.totalCompanyProfit)}
              </td>

              <td className="px-3 py-2 text-right">
                {formatNumber(totals.totalCompanyProfit)}
              </td>

              <td className="px-3 py-2 text-right">
                ৳ {formatMoney(totals.profit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitChartTable;
