import React from "react";

const ReportTable = ({
  title,
  columns = [],
  data = [],
  renderRow,
  total = null,
  totalColSpan,
}) => {
  if (!data?.length) return null;

  return (
    <div className="mt-6 px-6 md:px-10">
      <h2 className="text-base md:text-lg font-bold text-center mb-2.5 report-table-title text-gray-900">
        {title}
      </h2>

      <table className="w-full border-collapse mb-5">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="border p-2">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id ?? index}>
              {renderRow(item, index).map((value, i) => (
                <td key={i} className="border p-2">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {total !== null && (
          <tfoot>
            <tr className="font-bold">
              <td
                colSpan={totalColSpan ?? columns.length - 2}
                className="border p-2 text-right"
              >
                Total
              </td>

              <td className="border p-2">
                {Number(total).toLocaleString()}
              </td>

              {columns.length - (totalColSpan ?? columns.length - 2) - 2 >
                0 &&
                Array.from({
                  length:
                    columns.length -
                    (totalColSpan ?? columns.length - 2) -
                    2,
                }).map((_, i) => (
                  <td key={i} className="border"></td>
                ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default ReportTable;