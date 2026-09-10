import React, { useState } from "react";
import { formatMoney, formatNumber } from "../../../../Utils/format";

const AllProfitChartTable = ({ visibleMonthly, totals }) => {

  const [openRow, setOpenRow] = useState(null);
  return (
    <div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-right">Personal Investment</th>

              <th className="px-3 py-2 text-right">Profit Reinvested </th>
              <th className="px-3 py-2 text-right">Total Monthly Deposit </th>
              <th className="px-3 py-2 text-right">Current Balance (মোট টাকা)</th>
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
              <>
              
              <tr
                key={m.monthIndex}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
               <td className="px-3 py-2 text-left">
  <button
    onClick={() =>
      setOpenRow(openRow === m.monthIndex ? null : m.monthIndex)
    }
    className="flex items-center gap-2"
  >
    <span>
      {openRow === m.monthIndex ? "▼" : "▶"}
    </span>

    {m.monthName}
  </button>
</td>

                {/* 🔥 Running Investment */}
                {/* <td className="px-3 py-2 text-right">
                  ৳ {formatMoney(m.activeAmount)}
                </td> */}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  ৳ {formatMoney(m.selfDeposit)}
                </td>

                <td className="px-3 py-2 text-right whitespace-nowrap">
                  ৳ {formatMoney(m.profitCarry)}
                </td>
                {/* Deposit */}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  ৳ {formatMoney(m.deposit)}
                </td>
                {/* Balance */}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  ৳ {formatMoney(m.activeAmount)}
                </td>
                {/* Weight */}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatNumber(m.personalWeight)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatNumber(m.totalWeight)}
                </td>

                {/* Percent */}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatMoney(m.totalPercent)} %
                </td>

                {/* Profit */}
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
              {openRow === m.monthIndex && (
  <tr className="bg-slate-50 border-b border-slate-200">
    <td colSpan={12} className="px-5 py-4">

    <div className="mt-4 overflow-x-auto">
  <table className="min-w-full text-xs border border-slate-200">

    <thead className="bg-slate-100">
      <tr>
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
        <tr key={i} className="border-t">

          <td className="px-3 py-2">
            {w.date}
          </td>

          <td className="px-3 py-2 text-right">
            ৳ {formatMoney(w.amount)}
          </td>

          <td className="px-3 py-2 text-right">
            {w.days}
          </td>

          <td className="px-3 py-2 text-right">
            {formatNumber(w.weight)}
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>

    </td>
  </tr>
)}
              </>
              
            ))}

            <tr className="bg-slate-100 font-semibold">
              <td className="px-3 py-2 text-left">Grand Total</td>
              <td></td>
              <td></td>
              <td></td>
              <td className="px-3 py-2 text-right whitespace-nowrap">
                ৳{" "}
                {formatMoney(
                  visibleMonthly[visibleMonthly.length - 1]?.activeAmount || 0,
                )}
              </td>
              <td></td>
              {/* <td className="px-3 py-2 text-right whitespace-nowrap">
                {formatNumber(totals.weight)}
              </td> */}
              {/* <td className="px-3 py-2 text-right">
                        {formatNumber(totals.totalWeight)}
                      </td> */}

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

export default AllProfitChartTable;
