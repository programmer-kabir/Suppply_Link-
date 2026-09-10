import React, { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const Invoice = () => {
  const { state } = useLocation(); // row data
  const printRef = useRef();

  if (!state) {
    return (
      <div className="text-center mt-10 text-red-500">
        Invoice data পাওয়া যায়নি
      </div>
    );
  }

  const { row, runningUser } = state;
  const handleDownload = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${row.card_id}-${row.profit_year}`,
  });
  return (
    <>
      <div className="max-w-3xl mx-auto mt-5 flex justify-end">
        <button
          onClick={() => {
            if (!printRef.current) {
              // console.error("Nothing to print");
              return;
            }
            handleDownload();
          }}
          className="px-4 downloadButton py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          Download PDF
        </button>
      </div>
      <div
        ref={printRef}
        className="max-w-3xl mt-5 mx-auto p-6 bg-white shadow-xl font-sans"
      >
        {/* Header Section with Blue Background */}
        <div className="relative bg-blue-900 text-white p-6 pb-20 rounded-t-lg overflow-hidden">
          {/* Decorative Wave-like Shape (mimicking the image) */}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-blue-700 to-blue-900 opacity-90"></div>
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C30,10 60,0 100,20 L100,0 L0,0 Z"
              fill="#ffffff"
              opacity="0.1"
            />
            <path
              d="M0,0 C40,5 70,10 100,0 L100,0 L0,0 Z"
              fill="#ffffff"
              opacity="0.1"
            />
          </svg>

          <div className="relative z-10 flex justify-between items-start">
            <h1 className="text-4xl font-extrabold tracking-tight">INVOICE</h1>
            <div className="text-right">
              <p className="text-lg font-semibold">
                NO: INV{row?.card_id}-{row?.profit_year}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex justify-between mb-6 relative z-20">
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {" "}
                বিল প্রাপক:
              </h3>
              <p className="font-semibold text-gray-800">
                সাপ্লাইলিঙ্ক বাংলাদেশ লিমিটেড
              </p>
              <p className="text-gray-600">01941145876</p>
              <p className="text-gray-600">
                রফিক মঞ্জিল, মঙ্গলকাটা বাজার,সুনামগঞ্জ সদর,
                <br /> সুনামগঞ্জ, সিলেট, বাংলাদেশ।
              </p>
            </div>

            {/* From */}
            <div className="text-right">
              <h3 className="text-lg font-bold text-gray-700 mb-2">প্রেরক:</h3>
              <p className="font-semibold text-gray-800">{runningUser?.name}</p>
              <p className="text-gray-600">{runningUser?.mobile}</p>
              <p className="text-gray-600">{runningUser?.address}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            তারিখ: {new Date(row?.created_at).toLocaleDateString("bn-BD")}
          </p>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-4 py-3 text-left w-1/2">Description</th>
                  <th className="px-4 py-3 text-right w-1/2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-left text-gray-700">
                    # {row?.card_id} প্রফিটের লাভ
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-700">
                    ৳ {row?.amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sub Total */}
          <div className="flex justify-end mt-4">
            <div className="w-1/3  p-3 flex justify-between rounded-b-md">
              <span className="font-bold">Sub Total</span>
              <span className="font-bold"> ৳ {row?.amount}</span>
            </div>
          </div>

          {/* Notes and Payment Info */}
          <div className="flex justify-between items-end mt-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-1"> নোট:</h4>
              <div className="w-64 border-b border-gray-400 pb-2 mb-6"></div>{" "}
              {/* Note line */}
              <h4 className="font-semibold text-gray-700 mb-2">
                পেমেন্ট তথ্য:
              </h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium w-16 inline-block">ব্যাংক:</span>{" "}
                বিকাশ/নগদ
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium w-16 inline-block">Email:</span>{" "}
                supplylinkbdltd@gmail.com
              </p>
            </div>

            {/* Thank You Message */}
            <div className="text-3xl font-serif text-blue-900 font-semibold">
              ধন্যবাদ
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
