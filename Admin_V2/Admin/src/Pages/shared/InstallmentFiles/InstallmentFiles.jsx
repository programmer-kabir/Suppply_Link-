import React, { useState } from "react";
import useInstallmentFiles from "../../../utils/Hooks/InstallmentFiles/useInstallmentFiles";

const InstallmentFiles = () => {
  const { installmentFiles, isLoading, isError } = useInstallmentFiles();
  const [selectedRemark, setSelectedRemark] = useState(null);
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">Failed to load installment files.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Installment File Records</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-white">
              <th className="px-4 py-4 text-left w-16">#</th>
              <th className="px-4 py-4 text-left min-w-[220px]">Customer</th>
              <th className="px-4 py-4 text-left min-w-[180px]">User_Id</th>
              <th className="px-4 py-4 text-left min-w-[180px]">Card_Id</th>
              <th className="px-4 py-4 text-left min-w-[220px]">
                Product Name
              </th>
              <th className="px-4 py-4 text-left min-w-[180px]">
                Delivery Date
              </th>
              <th className="px-4 py-4 text-left min-w-[180px]">
                Last Installment
              </th>
              <th className="px-4 py-4 text-left min-w-[170px]">
                Have Check (yes/no)
              </th>
              <th className="px-4 py-4 text-left min-w-[170px]">
                File Received
              </th>
              <th className="px-4 py-4 text-left min-w-[170px]">Approved By</th>
              <th className="px-4 py-4  min-w-[180px]">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {installmentFiles?.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-slate-700 hover:bg-slate-800 transition"
              >
                <td className="px-4 py-5 font-bold">#{index + 1}</td>

                <td className="px-4 py-5 align-top">
                  <p className="font-semibold text-white">
                    {item.customer_name}
                  </p>
                </td>
                <td className="px-4 py-5 align-top">
                  <p className="font-semibold text-white">{item.user_id}</p>
                </td>

                <td className="px-4 py-5 align-top">
                  <p className="font-semibold text-white">{item.card_id}</p>
                </td>

                <td className="px-4 py-5 align-top">
                  <p className="font-semibold text-white">
                    {item.product_name}
                  </p>
                </td>

                <td className="px-4 py-5 align-top">
                  <p className="font-semibold text-white">
                    {item.delivery_date}
                  </p>
                </td>

                <td className="px-4 py-5 align-top">
                  {" "}
                  <p className="font-semibold text-white">
                    {item.last_installment_paid_date}
                  </p>
                </td>

                <td className="px-4 py-5 align-top">
                  {" "}
                  <p className="font-semibold text-white">{item.has_cheque}</p>
                </td>

                <td className="px-4 py-5 align-top">
                  {" "}
                  <p className="font-semibold text-white">
                    {item.file_received_date}
                  </p>
                </td>

                <td className="px-4 py-5 align-top">
                  {" "}
                  <p className="font-semibold text-white">
                    {item.approved_by_name}
                  </p>
                </td>
                <td className="px-4 py-5 text-center">
                  <button
                    onClick={() => setSelectedRemark(item.remarks)}
                    className="font-semibold text-white hover:text-primary cursor-pointer"
                  >
                    {item.remarks?.length > 5
                      ? `${item.remarks.slice(0, 5)}...`
                      : item.remarks}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRemark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-bold mb-4 text-white">Remarks</h3>

            <p className="text-white whitespace-pre-wrap break-words">
              {selectedRemark}
            </p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedRemark(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default InstallmentFiles;
