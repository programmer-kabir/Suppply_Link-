import React, { useEffect, useMemo, useState } from "react";

const MonthlyInstallmentsReport = () => {
  const [data, setData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetch(
      "https://management.supplylinkbd.com/apis/DailyInstallments/getDailyInstallments.php"
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const monthlyData = useMemo(() => {
    const filtered = data.filter((item) =>
      item.date?.startsWith(selectedMonth)
    );

    const grouped = {};

    filtered.forEach((item) => {
      const date = item.date;

      if (!grouped[date]) {
        grouped[date] = {
          date,
          totalAmount: 0,
          customers: new Set(),
        };
      }

      grouped[date].totalAmount += Number(item.amount || 0);
      grouped[date].customers.add(item.userId);
    });

    let runningTotal = 0;

    return Object.values(grouped)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((row, index) => {
        runningTotal += row.totalAmount;

        return {
          serial: index + 1,
          date: row.date,
          customerCount: row.customers.size,
          dailyCollection: row.totalAmount,
          runningTotal,
        };
      });
  }, [data, selectedMonth]);

  const totalCollection = useMemo(() => {
    return monthlyData.reduce(
      (sum, item) => sum + item.dailyCollection,
      0
    );
  }, [monthlyData]);

  const totalCustomers = useMemo(() => {
    const allCustomers = new Set();

    data
      .filter((item) => item.date?.startsWith(selectedMonth))
      .forEach((item) => {
        allCustomers.add(item.userId);
      });

    return allCustomers.size;
  }, [data, selectedMonth]);

  return (

    <>
    <div id="print-area">
<div className="report-container bg-[#020617] text-white p-3">

  {/* PRINT HEADER */}
  <div className="print-header">
    <h1>📊 দৈনিক কিস্তি সংগ্রহ রিপোর্ট</h1>
    <p>মাস: {selectedMonth}</p>
  </div>

  {/* SCREEN HEADER */}
  <div className="no-print flex justify-between items-center mb-4">
    <div>
      <h1 className="text-2xl font-bold text-cyan-400">
        📊 মাসিক কিস্তি সংগ্রহ রিপোর্ট
      </h1>
    </div>

    <div className="flex gap-2">
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
      />

      <button
        onClick={() => window.print()}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
      >
        🖨 Print
      </button>
    </div>
  </div>

<div className="overflow-x-auto print:border-0">    <table className="w-full text-sm">
      <thead className="bg-slate-700 text-white">
        <tr>
          <th className="px-3 py-2">ক্রমিক</th>
          <th className="px-3 py-2">তারিখ</th>
          <th className="px-3 py-2">ইনভেস্টর সংখ্যা</th>
          <th className="px-3 py-2">দৈনিক সংগ্রহ</th>
          <th className="px-3 py-2">এখন পর্যন্ত মোট</th>
        </tr>
      </thead>

      <tbody>
        {monthlyData.map((row) => (
          <tr
            key={row.date}
            className="border-t border-slate-800"
          >
            <td className="px-3 py-2">{row.serial}</td>

            <td className="px-3 py-2">
              {row.date}
            </td>

            <td className="px-3 py-2">
              {row.customerCount}
            </td>

            <td className="px-3 py-2 text-emerald-400 font-semibold">
              {row.dailyCollection.toLocaleString()}
            </td>

            <td className="px-3 py-2 text-cyan-400 font-semibold">
              {row.runningTotal.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr className="bg-slate-800">
          <td colSpan="3" className="px-3 py-2 font-bold">
            মোট
          </td>

          <td className="px-3 py-2 text-green-400 font-bold">
            ৳{totalCollection.toLocaleString()}
          </td>

          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div> </div><style>{`
    @media print {

  html,
  body,
  #root,
  #print-area {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }

 @page {
    size: A4 portrait;
    margin: 2mm;
  }

  body * {
  padding:5px 10px;
    visibility: hidden;
  }

  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .no-print {
    display: none !important;
  }

  .print-header {
    display: block !important;
    text-align: center;
    margin-bottom: 10px;
  }

  .report-container {
    background: white !important;
    color: black !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 13px !important;
  }

  th,
  td {
    border: 1px solid #ccc !important;
    padding: 3px !important;
    color: black !important;
  }
}
  `}</style>
    </>
  );
};

export default MonthlyInstallmentsReport;