import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MONTHS = [
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

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (n) =>
  toNumber(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

const colorForIndex = (i) => `hsl(${(i * 47) % 360}, 75%, 45%)`;

const CompanyProfitChart = ({
  profitAnalytics = [],
  companyCards = [],
  selectedCardForSummary = [],
}) => {
  const hasCards = companyCards.length > 0;

  const [selectedCardId, setSelectedCardId] = useState(0);
  useEffect(() => {
    if (!companyCards?.length) return;
    setSelectedCardId(selectedCardForSummary?.id);
  }, [selectedCardForSummary]);

  useEffect(() => {
    // console.log("✅ selectedCardId changed =>", selectedCardId);
  }, [selectedCardId]);

  const handleSelect = useCallback((id) => {
    // console.log("🔥 CARD CLICKED:", id);
    setSelectedCardId(Number(id));
  }, []);

  const idSet = useMemo(
    () => new Set(companyCards.map((c) => Number(c.id))),
    [companyCards]
  );

  const companyRows = useMemo(() => {
    return (profitAnalytics || []).filter((p) => idSet.has(Number(p.card_id)));
  }, [profitAnalytics, idSet]);

  const years = useMemo(() => {
    return Array.from(
      new Set(companyRows.map((p) => Number(p.profit_year)).filter(Boolean))
    ).sort((a, b) => a - b);
  }, [companyRows]);

  const [year, setYear] = useState(() => {
    if (!years.length) return new Date().getFullYear();
    return years[years.length - 1];
  });

  useEffect(() => {
    if (!years.length) return;
    if (!years.includes(Number(year))) setYear(years[years.length - 1]);
  }, [years, year]);

  // ✅ cardId -> [12 month profit]
  const cardMonthlyProfitMap = useMemo(() => {
    const map = new Map();
    companyCards.forEach((c) => map.set(Number(c.id), new Array(12).fill(0)));

    companyRows
      .filter((p) => Number(p.profit_year) === Number(year))
      .forEach((p) => {
        const cardId = Number(p.card_id);
        const m = Number(p.profit_month);
        if (!map.has(cardId)) return;
        if (!m || m < 1 || m > 12) return;
        map.get(cardId)[m - 1] += toNumber(p.profit_amount);
      });

    return map;
  }, [companyCards, companyRows, year]);

  const datasets = useMemo(() => {
    return companyCards.map((card, idx) => {
      const cardId = Number(card.id);
      const arr = cardMonthlyProfitMap.get(cardId) || new Array(12).fill(0);
      const isSelected = cardId === Number(selectedCardId);

      return {
        label: card.card_name || `Card #${cardId}`,
        data: arr,
        borderColor: colorForIndex(idx),
        backgroundColor: "transparent",
        fill: false,
        tension: 0.35,
        pointRadius: isSelected ? 3 : 2,
        borderWidth: isSelected ? 4 : 2, // ✅ selected highlight
      };
    });
  }, [companyCards, cardMonthlyProfitMap, selectedCardId]);

  const chartData = useMemo(() => {
    return { labels: MONTHS, datasets };
  }, [datasets]);

  // ✅ selected card summary data
  const selectedCard = useMemo(() => {
    return (
      companyCards.find((c) => Number(c.id) === Number(selectedCardId)) || null
    );
  }, [companyCards, selectedCardId]);

  const selectedMonthly = useMemo(() => {
    const arr =
      cardMonthlyProfitMap.get(Number(selectedCardId)) || new Array(12).fill(0);
    return MONTHS.map((name, idx) => ({
      monthIndex: idx + 1,
      monthName: name,
      profit: arr[idx] ?? 0,
    }));
  }, [cardMonthlyProfitMap, selectedCardId]);

  const selectedTotal = useMemo(() => {
    return selectedMonthly.reduce((a, m) => a + toNumber(m.profit), 0);
  }, [selectedMonthly]);

  const hasData = companyRows.length > 0;

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          // ✅ legend click selects card (NO default hide)
          onClick: (e, legendItem) => {
            const i = legendItem.datasetIndex;
            const card = companyCards[i];
            if (card?.id) handleSelect(card.id);
          },
        },
        title: { display: true, text: `Company Card-wise Profit (${year})` },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ৳ ${formatMoney(ctx.raw)}`,
          },
        },
      },
      onClick: (evt, elements) => {
        if (!elements?.length) return;
        const i = elements[0].datasetIndex;
        const card = companyCards[i];
        if (card?.id) handleSelect(card.id);
      },
      scales: {
        y: { ticks: { callback: (v) => `৳ ${formatMoney(v)}` } },
      },
    };
  }, [year, companyCards, handleSelect]);

  if (!hasCards) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">Company কার্ড পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              🧾 Company Card-wise Profit
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Legend/Line এ click করলে নিচের summary/table শুধু ওই card-এর হবে।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Year:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            >
              {years.length ? (
                years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))
              ) : (
                <option value={year}>{year}</option>
              )}
            </select>
          </div>
        </div>

        {!hasData ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">
              কোনো profit data পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <Line options={chartOptions} data={chartData} />
            </div>

            {/* ✅ Selected card summary + table */}
            <div className="mt-5 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedCard?.card_name || `Card #${selectedCardId}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Card ID: {selectedCardId} • Year: {year}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">Total Profit</p>
                  <p className="text-sm font-bold text-emerald-700">
                    ৳ {formatMoney(selectedTotal)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-3 py-2 text-left">Month</th>
                      <th className="px-3 py-2 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMonthly.map((m) => (
                      <tr
                        key={m.monthIndex}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-3 py-2 text-left">{m.monthName}</td>
                        <td className="px-3 py-2 text-right">
                          ৳ {formatMoney(m.profit)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-semibold">
                      <td className="px-3 py-2 text-left">Total</td>
                      <td className="px-3 py-2 text-right">
                        ৳ {formatMoney(selectedTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CompanyProfitChart;
