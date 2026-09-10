import React, { useMemo, useState, useEffect, useRef } from "react";
import InvestmentCardLayout from "../../InvestmentCardLayout";
import Loader from "../../Loader/Loader";
import Chart from "./Chart";
import useProfitAnalytics from "../../../Utils/Hooks/useProfitAnalytics";
import { useReactToPrint } from "react-to-print";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Invest = () => {
  const fmt = (v) => (v !== null && v !== undefined && v !== "" ? v : "-");

  // 🔥 Default = ALL
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [selectedHistoryData, setSelectedHistoryData] = useState(null);
  const { isProfitAnalyticsLoading, profitAnalytics, isUProfitAnalyticsError } =
    useProfitAnalytics();
  const openHistoryData = profitAnalytics?.find(
    (data) => data.id === selectedHistoryData?.source_profit_id,
  );



  const [isPrinting, setIsPrinting] = useState(false);
const tableRef = useRef(null);

const handlePrint = useReactToPrint({
  contentRef: tableRef,

  onBeforePrint: () =>
    new Promise((resolve) => {
      setIsPrinting(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }),

  onAfterPrint: () => {
    setIsPrinting(false);
  },
});
  return (
    <div>
      <InvestmentCardLayout>
        {({
          investInstallments,
          inInvestInstallmentsLoading,
          selectedCard,
          statusBadgeClass,
          sortedCards,
        }) => {
          // ===== AVAILABLE YEARS =====
          const availableYears = useMemo(() => {
            if (!investInstallments || investInstallments.length === 0) {
              return [];
            }
            const years = investInstallments.map((i) =>
              new Date(i.investment_date).getFullYear(),
            );
            return [...new Set(years)].sort((a, b) => b - a);
          }, [investInstallments]);

          // ===== FILTERED INSTALLMENTS (ALL SUPPORT) =====
          const filteredInstallments = useMemo(() => {
            if (!investInstallments || investInstallments.length === 0)
              return [];

            const result = investInstallments.filter((i) => {
              const d = new Date(i.investment_date);
              const year = d.getFullYear();
              const month = d.getMonth() + 1;

              // ✅ ALL → no filter
              if (filterYear === "all") return true;

              if (year !== Number(filterYear)) return false;

              if (filterMonth === "all") return true;

              return month === Number(filterMonth);
            });

            // 🔥 SORT: date desc, then investment_no desc
            return [...result].sort((a, b) => {
              const dateDiff =
                new Date(b.investment_date) - new Date(a.investment_date);

              if (dateDiff !== 0) return dateDiff;

              return Number(b.investment_no) - Number(a.investment_no);
            });
          }, [investInstallments, filterYear, filterMonth]);

          // selectedCard change হলে filter reset
          useEffect(() => {
            setFilterYear("all");
            setFilterMonth("all");
          }, [selectedCard?.id]);

          return (
            <main className="w-full mt-6  pb-24 px-2">
              {/* ===== CARD INFO ===== */}
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  ইনভেস্টমেন্ট ডিটেইলস
                </h2>

                {!selectedCard ? (
                  <p className="text-sm text-slate-500">
                    কোনো কার্ড সিলেক্ট করা হয়নি।
                  </p>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">
                          বিনিয়োগকারীর নাম
                        </p>
                        <p className="text-base font-semibold text-slate-800">
                          {fmt(selectedCard.card_name)}
                        </p>
                      </div>
                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass}`}
                      >
                        {selectedCard.status === "running" ? "চলমান" : "বন্ধ"}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-2" />

                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <div>
                        <p className="text-xs text-slate-500">
                          বিনিয়োগের পরিমাণ
                        </p>
                        <p className="font-semibold">
                          ৳{fmt(selectedCard?.investment_amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">পেমেন্ট টাইপ</p>
                        <p>{fmt(selectedCard?.payment_type)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">শুরুর তারিখ</p>
                        <p>{fmt(selectedCard?.start_date)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">মেয়াদ শেষ</p>
                        <p>{fmt(selectedCard?.maturity_date)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Total Time Weighted Value
                        </p>
                        <p className="font-semibold text-emerald-600">
                          {fmt(selectedCard?.total_time_wighted_value)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== CHART ===== */}
              <Chart sortedCards={sortedCards} selectedCard={selectedCard} />

              {/* ===== FILTERS ===== */}
              <div className="flex justify-end w-full items-end gap-4 mb-4 mt-6">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Year
                  </label>
                  <select
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                    <option value="all">All</option>
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Month
                  </label>
                  <select
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                  >
                    <option value="all">All</option>
                    {monthNames.map((name, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* ===== TABLE ===== */}
              <div   ref={tableRef} className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
                <div className="align-middle inline-block min-w-full shadow bg-white px-8 pt-3 rounded-bl-lg rounded-br-lg">
                  {inInvestInstallmentsLoading ? (
                    <div className="py-6 flex justify-center">
                      <Loader />
                    </div>
                  ) : (
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-6 py-3 border-b text-left text-blue-500">
                            কিস্তি নং
                          </th>
                          <th className="px-6 py-3 border-b text-left text-blue-500">
                            প্রদানের তারিখ
                          </th>
                          <th className="px-6 py-3 border-b text-left text-blue-500">
                            জমার পরিমাণ
                          </th>
                          <th className="px-6 py-3 border-b text-left text-blue-500">
                            অতিক্রান্ত দিন
                          </th>
                          <th className="px-6 py-3 border-b text-left text-blue-500">
                            গ্রহণকারীর স্বাক্ষর
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInstallments.length > 0 ? (
                          filteredInstallments.map((i) => {
                            const isHistoryCard =
                              Number(selectedCard?.id) === 1;
                            const openHistoryData = profitAnalytics?.find(
                              (data) => data.id === i.source_profit_id,
                            );

                            return (
                              <React.Fragment
                                key={`${i.investment_no}-${i.investment_date}`}
                              >
                                <tr>
                                  <td className="px-6 py-4 border-b">
                                    {isHistoryCard ? (
                                      <button
                                        onClick={() => {
                                          setSelectedHistoryData(
                                            isPrinting  || selectedHistoryData?.id === i.id
                                              ? null
                                              : i,
                                          );
                                        }}
                                        className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 cursor-pointer"
                                      >
                                        <span>
                                          {selectedHistoryData?.id === i.id
                                            ? "▼"
                                            : "▶"}
                                        </span>

                                        <span className="text-black font-medium">
                                          {i.investment_no}
                                        </span>
                                      </button>
                                    ) : (
                                      i.investment_no
                                    )}
                                  </td>

                                  <td className="px-6 py-4 border-b">
                                    {i.investment_date}
                                  </td>

                                  <td className="px-6 py-4 border-b">
                                    {i.amount}
                                  </td>

                                  <td className="px-6 py-4 border-b">
                                    {i.active_days}
                                  </td>

                                  <td className="px-6 py-4 border-b">
                                    {i.signature_by}
                                  </td>
                                </tr>

                                { (isPrinting || selectedHistoryData?.id === i.id) &&
                                  openHistoryData && (
                                    <tr>
                                      <td
                                        colSpan={5}
                                        className="bg-slate-50 px-6 py-5 border-b"
                                      >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="font-semibold">
                                              Investor:
                                            </span>{" "}
                                            {openHistoryData.investor_name}(
                                            {openHistoryData?.investor_id})
                                          </div>

                                          <div>
                                            <span className="font-semibold">
                                              Card Id:
                                            </span>{" "}
                                            {openHistoryData.card_id}
                                          </div>

                                          <div>
                                            <span className="font-semibold">
                                              Profit Amount:
                                            </span>{" "}
                                            ৳
                                            {Number(
                                              openHistoryData.original_profit_amount ||
                                                0,
                                            ).toLocaleString()}
                                          </div>

                                          <div>
                                            <span className="font-semibold">
                                              Profit parcent:
                                            </span>{" "}
                                            {Number(
                                              openHistoryData.original_percent ||
                                                0,
                                            ).toFixed(4)}
                                            %
                                          </div>

                                          <div>
                                            <span className="font-semibold">
                                              Profit Month:
                                            </span>{" "}
                                            {
                                              monthNames[
                                                openHistoryData.profit_month - 1
                                              ]
                                            }
                                          </div>

                                          <div>
                                            <span className="font-semibold">
                                              Profit Year:
                                            </span>{" "}
                                            {openHistoryData.profit_year}
                                          </div>

                                          <div className="md:col-span-2">
                                            <span className="font-semibold">
                                              Note:
                                            </span>{" "}
                                            {openHistoryData.note}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-4 text-center text-sm text-slate-500"
                            >
                              কোনো কিস্তির ডাটা পাওয়া যায়নি।
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </main>
          );
        }}
      </InvestmentCardLayout>
    </div>
  );
};

export default Invest;
