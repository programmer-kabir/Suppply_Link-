import React from 'react'

const YearCashReport = ({years,AllCashIn,AllCashOut,totalCashOut,totalCashIn,totalBalance}) => {
  return (
    <div>
        {/* yearly summary */}
<div className="bg-[#131c31] border border-[#1d2942] rounded-3xl p-5">

  {/* header */}
  <div className="mb-5">

    <h2 className="text-xl font-bold text-white">
      বছর ভিত্তিক সারসংক্ষেপ
    </h2>

    <p className="text-sm text-gray-400 mt-1">
      বছর অনুযায়ী আয়, ব্যয় এবং ব্যালেন্স
    </p>

  </div>

  {/* table */}
  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="bg-[#0b1324] text-gray-300 text-sm">

          <th className="px-4 py-4 text-left rounded-l-2xl">
            বছর
          </th>

          <th className="px-4 py-4 text-center">
            আয় (৳)
          </th>

          <th className="px-4 py-4 text-center">
            ব্যয় (৳)
          </th>

          <th className="px-4 py-4 text-center">
            মাসিক নীট (৳)
          </th>

          <th className="px-4 py-4 text-right rounded-r-2xl">
            ক্যাশ ব্যালেন্স (৳)
          </th>

        </tr>

      </thead>

      <tbody>

        {years.reverse().map((year) => {

          // yearly in
          const yearlyIn = AllCashIn
            .filter((item) => {

              const itemYear = new Date(item.date).getFullYear();

              return itemYear === year;
            })
            .reduce((sum, item) => sum + Number(item.amount), 0);

          // yearly out
          const yearlyOut = AllCashOut
            .filter((item) => {

              const itemYear = new Date(item.date).getFullYear();

              return itemYear === year;
            })
            .reduce((sum, item) => sum + Number(item.amount), 0);

          // balance
          const balance = yearlyIn - yearlyOut;

          // avg monthly
          const avgMonthly = balance / 12;

          return (

            <tr
              key={year}
              className="border-b border-[#1d2942] hover:bg-[#18233d] transition"
            >

              {/* year */}
              <td className="px-4 py-5 font-bold text-blue-400">
                {year}
              </td>

              {/* income */}
              <td className="px-4 py-5 text-center text-green-400 font-medium">
                {yearlyIn.toLocaleString()}
              </td>

              {/* expense */}
              <td className="px-4 py-5 text-center text-red-400 font-medium">
                {yearlyOut.toLocaleString()}
              </td>

              {/* avg */}
              <td
                className={`px-4 py-5 text-center font-bold ${
                  avgMonthly >= 0
                    ? "text-cyan-400"
                    : "text-red-400"
                }`}
              >
                {avgMonthly.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>

              {/* balance */}
              <td
                className={`px-4 py-5 text-right font-black ${
                  balance >= 0
                    ? "text-white"
                    : "text-red-400"
                }`}
              >
                {balance.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>

            </tr>

          );
        })}

        {/* footer total */}
        <tr className="bg-[#0b1324]">

          <td className="px-4 py-5 rounded-l-2xl font-bold text-white">
            সর্বমোট
          </td>

          <td className="px-4 py-5 text-center font-black text-white">
            {totalCashIn.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </td>

          <td className="px-4 py-5 text-center font-black text-white">
            {totalCashOut.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </td>

          <td className="px-4 py-5 text-center font-black text-white">
            —
          </td>

          <td className="px-4 py-5 rounded-r-2xl text-right font-black text-white">
            {totalBalance.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</div>
    </div>
  )
}

export default YearCashReport