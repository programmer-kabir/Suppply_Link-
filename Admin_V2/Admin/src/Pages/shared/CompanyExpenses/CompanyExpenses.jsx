import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import useCashReports from "../../../utils/Hooks/cash/useCashReports";

const pad2 = (n) => String(n).padStart(2, "0");
const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(
    Number(n || 0),
  );

export default function CompanyExpenses() {
  const { CashReports, isCashReportsError, isCashReportsLoading, refetch } =
    useCashReports();
  const companyExpenses = Array.isArray(CashReports)
    ? CashReports.filter((cash) => cash.source === "company-expense")
    : [];



  const [q, setQ] = useState("");


  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return companyExpenses;
    return companyExpenses.filter((x) => {
      return (
        String(x.id).includes(s) ||
        (x.purpose || "").toLowerCase().includes(s) ||
        (x.remarks || "").toLowerCase().includes(s) ||
        (x.date || "").toLowerCase().includes(s)
      );
    });
  }, [companyExpenses, q]);

  const total = useMemo(
    () => filtered.reduce((sum, x) => sum + Number(x.amount || 0), 0),
    [filtered],
  );






  const truncate = (text = "", len = 15) =>
    text.length > len ? text.slice(0, len) + "..." : text;

  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");





  return (
    <div className="w-full">
      {/* Page purpose */}
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Company Expenses
        </h1>
        <p className="text-sm text-white/60">
          Add and track company running costs (Rent, Bills, Salary, Transport,
          etc.)
        </p>
      </div>

      {/* Layout */}
      <div c>
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Recent Expenses
                </h2>
                <p className="text-sm text-white/60">
                  Showing:{" "}
                  <span className="text-white/80">{filtered.length}</span> items
                  • Total:{" "}
                  <span className="text-white font-medium">
                    {formatMoney(total)}
                  </span>
                </p>
              </div>

              {/* Search */}
              <div className="w-full md:w-72">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by purpose / date / remarks..."
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="p-5">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="text-left px-4 py-3">#</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">purpose</th>
                      <th className="text-left px-4 py-3">remarks</th>
                      <th className="text-right px-4 py-3">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-white/60"
                        >
                          No expenses found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="text-white/85 hover:bg-white/5"
                        >
                          <td className="px-4 py-3">{idx + 1}</td>
                          <td className="px-4 py-3">{row?.date}</td>
                          <td className="px-4 py-3 font-medium text-white">
                            {row?.purpose.length > 15 ? (
                              <button
                                onClick={() => {
                                  setModalText(row.purpose);
                                  setOpenModal(true);
                                }}
                                className="text-left hover:underline hover:text-white"
                              >
                                {truncate(row.purpose, 15)}
                              </button>
                            ) : (
                              row.purpose
                            )}
                          </td>

                          <td className="px-4 py-3 text-white/70 max-w-[420px]">
                            {row.remarks && row.remarks.length > 15 ? (
                              <button
                                onClick={() => {
                                  setModalText(row.remarks);
                                  setOpenModal(true);
                                }}
                                className="text-left hover:underline hover:text-white/90"
                              >
                                {truncate(row.remarks, 15)}
                              </button>
                            ) : (
                              row.remarks || "-"
                            )}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold">
                            {formatMoney(row.amount)}
                          </td>
                         
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0f172a] rounded-xl w-full max-w-md p-5 border border-white/10 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Full Text</h3>

            <p className="text-white/80 break-words">{modalText}</p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    
    </div>
  );
}
