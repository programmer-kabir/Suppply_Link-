import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProfitStatus from "../../../Utils/Hooks/useProfitStatus";
import currentUser from "../../../Utils/currentUser";
import Loader from "../../Loader/Loader";
import useProfitAnalytics from "../../../Utils/Hooks/useProfitAnalytics";

const ProfitHistory = () => {
  const navigate = useNavigate();
  const runningUser = currentUser();
  const { profitHistory, isProfitHistoryLoading } = useProfitStatus({
    investorId: Number(runningUser?.id),
  });
  const formatNumber = (n) =>
    n != null
      ? Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })
      : "-";

  if (isProfitHistoryLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Loader />
      </div>
    );
  }

  // console.log(profitHistory);
  return (
    <div className="space-y-5">
      {/* Empty */}
      {(!profitHistory || profitHistory.length === 0) && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">
            এখনো কোনো Profit History পাওয়া যায়নি।
          </p>
        </div>
      )}

      {/* Table */}
      {profitHistory && profitHistory.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Card ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Profit Year
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Amount (৳)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold">
                  Invoice
                </th>
              </tr>
            </thead>

            <tbody>
              {profitHistory.map((row) => (
                <tr key={row.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm">#{row.card_id}</td>
                  <td className="px-4 py-3 text-sm">{row.profit_year}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">
                    ৳{formatNumber(row.amount)}
                  </td>
                  <td
                    className="px-4 py-3 flex gap-3
                  "
                  >
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${
                          row.status === "withdraw"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                      {row.status}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${
                          row.action_name === "pending" ||
                          row.action_name === "reject"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                      {row.action_name}
                    </span>
                  </td>

                  {/* 🔥 Invoice button */}
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/invoice/${row.id}`, {
                          state: {
                            row,
                            runningUser,
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfitHistory;
