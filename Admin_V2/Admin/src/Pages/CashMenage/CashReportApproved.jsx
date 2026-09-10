import React, { useState } from "react";
import useCashReports from "../../utils/Hooks/cash/useCashReports";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../Provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

const CashReportApproved = () => {
  const { CashReports, isCashReportsError, isCashReportsLoading, refetch } =
    useCashReports();
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReason, setSelectedReason] = useState("");
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedCash, setSelectedCash] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  if (isCashReportsLoading) return <Loader />;

  if (isCashReportsError) {
    return (
      <div className="text-red-500 p-5">
        Failed to load cash reports.
      </div>
    );
  }
  const reports = Array.isArray(CashReports)
    ? CashReports
    : CashReports?.data || [];
  const pendingReports = reports.filter(
    (item) => item.approval_status === "pending"
  );

  const rejectedReports = reports.filter(
    (item) => item.approval_status === "rejected"
  );

  const approvedReports = reports.filter(
    (item) => item.approval_status === "approved"
  );

  const currentData =
    activeTab === "pending"
      ? pendingReports
      : activeTab === "rejected"
        ? rejectedReports
        : approvedReports;


  const handleApprove = async (cash) => {
    try {
      const payload = {
        id: cash.id,
        approval_status: "approved",
        approved_by: user?.id,
      };

      const result = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/update_cash.php`,
        payload
      );

      if (result.data.success) {
        toast.success(result.data.message);

        setRejectModal(false);
        setRejectReason("");
        setSelectedCash(null);

        refetch?.();
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleReject = async () => {
    try {
      const payload = {
        id: selectedCash.id,
        approval_status: "rejected",
        approved_by: user?.id,
        reject_reason: rejectReason,
      };


      const result = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/update_cash.php`,
        payload
      );


      if (result.data.success) {
        toast.success(result.data.message);

        setRejectModal(false);
        setRejectReason("");
        setSelectedCash(null);

        refetch?.();
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Reject failed");
    }
  };
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-5 md:space-y-8">

      <div className="grid grid-cols-3 gap-2 mb-5 md:flex md:gap-3 md:mb-6">

        <button
          onClick={() => setActiveTab("pending")}
          className={`
      px-2 sm:px-4 md:px-5
      py-2.5
      rounded-lg md:rounded-xl
      font-semibold
      text-xs sm:text-sm
      whitespace-nowrap
      transition
      ${activeTab === "pending"
              ? "bg-yellow-500 text-black"
              : "bg-[#1f2937] text-gray-300"
            }
    `}
        >
          <span className="hidden sm:inline">Pending </span>
          <span className="sm:hidden">Pending</span>
          {" "}({pendingReports.length})
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`
      px-2 sm:px-4 md:px-5
      py-2.5
      rounded-lg md:rounded-xl
      font-semibold
      text-xs sm:text-sm
      whitespace-nowrap
      transition
      ${activeTab === "rejected"
              ? "bg-red-500 text-white"
              : "bg-[#1f2937] text-gray-300"
            }
    `}
        >
          Rejected ({rejectedReports.length})
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`
      px-2 sm:px-4 md:px-5
      py-2.5
      rounded-lg md:rounded-xl
      font-semibold
      text-xs sm:text-sm
      whitespace-nowrap
      transition
      ${activeTab === "approved"
              ? "bg-green-500 text-white"
              : "bg-[#1f2937] text-gray-300"
            }
    `}
        >
          Approved ({approvedReports.length})
        </button>

      </div>


      {/* =====================================================
    DESKTOP TABLE
===================================================== */}

      <div className="hidden md:block bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-[#1f2937]">

              <tr>

                <th className="px-4 py-3 text-left">
                  #
                </th>

                <th className="px-4 py-3 text-left">
                  Purpose
                </th>

                <th className="px-4 py-3 text-left">
                  Amount
                </th>

                <th className="px-4 py-3 text-left">
                  Category
                </th>

                <th className="px-4 py-3 text-left">
                  Type
                </th>


                {activeTab === "rejected" && (

                  <th className="px-4 py-3 text-left">
                    Reject Reason
                  </th>

                )}


                <th className="px-4 py-3 text-left">
                  Date
                </th>


                {activeTab === "pending" && (

                  <th className="px-4 py-3 text-center">
                    Action
                  </th>

                )}

              </tr>

            </thead>


            <tbody>

              {currentData.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center text-gray-500 py-10"
                  >
                    No cash reports found
                  </td>

                </tr>

              ) : (

                currentData.map((cash, index) => (

                  <tr
                    key={cash.id}
                    className="border-t border-gray-800 hover:bg-gray-800/30"
                  >

                    <td className="px-4 py-3">
                      {currentData.length - index}
                    </td>


                    {/* PURPOSE */}

                    <td className="px-4 py-3 max-w-[250px]">

                      <p className="truncate">

                        {cash?.type === "in"
                          ? cash?.source || "-"
                          : cash?.purpose || "-"}

                      </p>

                    </td>


                    {/* AMOUNT */}

                    <td className="px-4 py-3 font-semibold whitespace-nowrap">

                      ৳ {Number(cash.amount || 0).toLocaleString()}

                    </td>


                    {/* CATEGORY */}

                    <td className="px-4 py-3">

                      {cash.category || "-"}

                    </td>


                    {/* TYPE */}

                    <td className="px-4 py-3">

                      <span
                        className={`
                    inline-flex
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                    whitespace-nowrap

                    ${cash.type === "in"

                            ? "bg-green-500/20 text-green-400 border border-green-500/20"

                            : "bg-red-500/20 text-red-400 border border-red-500/20"
                          }
                  `}
                      >

                        {cash.type === "in"
                          ? "Cash In"
                          : "Cash Out"}

                      </span>

                    </td>


                    {/* REJECT REASON */}

                    {activeTab === "rejected" && (

                      <td className="px-4 py-3 max-w-[250px]">

                        <button
                          onClick={() =>
                            setSelectedReason(cash.reject_reason)
                          }
                          className="text-red-400 hover:text-red-300 text-left"
                        >

                          {cash.reject_reason?.length > 40

                            ? cash.reject_reason.slice(0, 40) + "..."

                            : cash.reject_reason || "-"}

                        </button>

                      </td>

                    )}


                    {/* DATE */}

                    <td className="px-4 py-3 whitespace-nowrap">

                      {cash.date || "-"}

                    </td>


                    {/* ACTION */}

                    {activeTab === "pending" && (

                      <td className="px-4 py-3">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() =>
                              handleApprove(cash)
                            }
                            className="
                        px-3 py-1.5
                        rounded-lg
                        bg-green-500
                        hover:bg-green-600
                        text-white
                        text-xs
                        font-semibold
                      "
                          >
                            Approve
                          </button>


                          <button
                            onClick={() => {

                              setSelectedCash(cash);

                              setRejectModal(true);

                            }}
                            className="
                        px-3 py-1.5
                        rounded-lg
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        text-xs
                        font-semibold
                      "
                          >
                            Reject
                          </button>

                        </div>

                      </td>

                    )}

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
    MOBILE CARD VIEW
===================================================== */}

      <div className="md:hidden space-y-3">

        {currentData.length === 0 ? (

          <div className="
      bg-[#111827]
      border border-gray-800
      rounded-xl
      p-8
      text-center
      text-gray-500
    ">
            No cash reports found
          </div>

        ) : (

          currentData.map((cash, index) => (

            <div
              key={cash.id}
              className="
          bg-[#111827]
          border border-gray-800
          rounded-xl
          overflow-hidden
        "
            >

              {/* CARD HEADER */}

              <div className="
          flex
          items-start
          justify-between
          gap-3
          p-3
          border-b
          border-gray-800
        ">

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <span className="
                text-[10px]
                bg-gray-800
                text-gray-400
                px-2 py-0.5
                rounded
              ">

                      #{currentData.length - index}

                    </span>


                    <span
                      className={`
                  inline-flex
                  px-2 py-1
                  rounded-full
                  text-[10px]
                  font-semibold

                  ${cash.type === "in"

                          ? "bg-green-500/15 text-green-400"

                          : "bg-red-500/15 text-red-400"
                        }
                `}
                    >

                      {cash.type === "in"
                        ? "Cash In"
                        : "Cash Out"}

                    </span>

                  </div>


                  <h3 className="
              text-sm
              font-semibold
              text-white
              mt-2
              break-words
            ">

                    {cash?.type === "in"
                      ? cash?.source || "-"
                      : cash?.purpose || "-"}

                  </h3>

                </div>


                {/* AMOUNT */}

                <div className="text-right shrink-0">

                  <p className="text-[10px] text-gray-500">
                    Amount
                  </p>

                  <p
                    className={`
                text-base
                font-bold

                ${cash.type === "in"
                        ? "text-green-400"
                        : "text-red-400"
                      }
              `}
                  >

                    ৳{Number(
                      cash.amount || 0
                    ).toLocaleString()}

                  </p>

                </div>

              </div>


              {/* DETAILS */}

              <div className="p-3">

                <div className="grid grid-cols-2 gap-3">

                  {/* CATEGORY */}

                  <div>

                    <p className="text-[10px] text-gray-500 mb-1">
                      Category
                    </p>

                    <p className="text-xs text-gray-200 break-words">
                      {cash.category || "-"}
                    </p>

                  </div>


                  {/* DATE */}

                  <div>

                    <p className="text-[10px] text-gray-500 mb-1">
                      Date
                    </p>

                    <p className="text-xs text-gray-200">
                      {cash.date || "-"}
                    </p>

                  </div>

                </div>


                {/* REJECT REASON */}

                {activeTab === "rejected" && (

                  <div className="
              mt-3
              pt-3
              border-t
              border-gray-800
            ">

                    <p className="text-[10px] text-gray-500 mb-1">
                      Reject Reason
                    </p>

                    <button
                      onClick={() =>
                        setSelectedReason(
                          cash.reject_reason
                        )
                      }
                      className="
                  text-xs
                  text-red-400
                  text-left
                  break-words
                "
                    >

                      {cash.reject_reason?.length > 80

                        ? cash.reject_reason.slice(0, 80) + "..."

                        : cash.reject_reason || "-"}

                    </button>

                  </div>

                )}


                {/* PENDING ACTIONS */}

                {activeTab === "pending" && (

                  <div className="
              grid
              grid-cols-2
              gap-2
              mt-3
              pt-3
              border-t
              border-gray-800
            ">

                    <button
                      onClick={() =>
                        handleApprove(cash)
                      }
                      className="
                  w-full
                  py-2
                  rounded-lg
                  bg-green-500/15
                  border border-green-500/20
                  text-green-400
                  text-xs
                  font-semibold
                  active:bg-green-500/30
                "
                    >
                      ✓ Approve
                    </button>


                    <button
                      onClick={() => {

                        setSelectedCash(cash);

                        setRejectModal(true);

                      }}
                      className="
                  w-full
                  py-2
                  rounded-lg
                  bg-red-500/15
                  border border-red-500/20
                  text-red-400
                  text-xs
                  font-semibold
                  active:bg-red-500/30
                "
                    >
                      ✕ Reject
                    </button>

                  </div>

                )}

              </div>

            </div>

          ))

        )}

      </div>

      {selectedReason && (

        <div className="
    fixed inset-0
    z-50
    bg-black/60
    flex
    items-center
    justify-center
    p-3 sm:p-4
  ">

          <div className="
      bg-[#111827]
      border border-gray-700
      rounded-xl md:rounded-2xl
      p-4 md:p-6
      w-full
      max-w-lg
      max-h-[85vh]
      overflow-y-auto
      shadow-2xl
    ">

            <div className="flex justify-between items-center gap-3 mb-4">

              <h2 className="text-base md:text-lg font-semibold text-white">
                Reject Reason
              </h2>

              <button
                onClick={() => setSelectedReason("")}
                className="
            w-8 h-8
            flex items-center justify-center
            rounded-lg
            bg-gray-800
            text-gray-400
            hover:text-red-400
            text-xl
          "
              >
                ×
              </button>

            </div>

            <div className="
        bg-[#0f172a]
        border border-gray-800
        rounded-xl
        p-3 md:p-4
      ">

              <p className="
          text-sm
          text-gray-300
          leading-6
          break-words
        ">
                {selectedReason}
              </p>

            </div>

          </div>

        </div>

      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">

          <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-md p-5">

            <h2 className="text-xl font-semibold text-white mb-4">
              Reject Cash Request
            </h2>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reject reason লিখুন..."
              className="w-full h-32 bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white resize-none"
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => {
                  setRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-500 rounded-lg text-white"
              >
                Reject
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default CashReportApproved;