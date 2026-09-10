import React from 'react'

const SupplierPaymentDetailsModal = ({selectedItem,setIsDetailsOpen}) => {
  return (
    <div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
          <div
            className="bg-[#0f172a] w-full max-w-4xl h-full md:h-[90vh] rounded-xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-700">
              {" "}
              <h2 className="text-lg font-semibold text-gray-200">
                {selectedItem?.brand} Details
              </h2>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1">
              {/* Image */}
              <div className="border border-gray-700 rounded-lg bg-[#020617] overflow-hidden flex items-center justify-center h-56 md:h-full">
                <img
                  src={`https://management.supplylinkbd.com/${selectedItem?.image}`}
                  alt="Memo"
                  className="h-full object-contain transition-transform duration-300"
                  onMouseMove={(e) => {
                    const { left, top, width, height } =
                      e.target.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;

                    e.target.style.transformOrigin = `${x}% ${y}%`;
                    e.target.style.transform = "scale(2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.transformOrigin = "center";
                  }}
                />
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm text-gray-300">
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <span className="text-gray-400">Memo:</span>{" "}
                    {selectedItem?.memo_no}
                  </p>
                  <p>
                    <span className="text-gray-400">Date:</span>{" "}
                    {selectedItem?.date}
                  </p>
                </div>

                <p>
                  <span className="text-gray-400">Shop:</span>{" "}
                  {selectedItem?.shop_name}
                </p>
                <p>
                  <span className="text-gray-400">Supplier:</span>{" "}
                  {selectedItem?.supplier}
                </p>
                <p>
                  <span className="text-gray-400">Brand:</span>{" "}
                  {selectedItem?.brand}
                </p>

                {/* Amount box */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="bg-gray-800 p-3 rounded text-center">
                    <p className="text-xs text-gray-400">Total</p>
                    <p>৳ {selectedItem?.total_amount}</p>
                  </div>

                  <div className="bg-gray-800 p-3 rounded text-center">
                    <p className="text-xs text-gray-400">Paid</p>
                    <p>৳ {selectedItem?.paid}</p>
                  </div>

                  <div className="bg-gray-800 p-3 rounded text-center">
                    <p className="text-xs text-gray-400">Due</p>
                    <p className="text-green-400">৳ {selectedItem?.due}</p>
                  </div>
                </div>

                <p className="pt-3">
                  <span className="text-gray-400">Remarks:</span>
                  <br />
                  {selectedItem?.remarks || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SupplierPaymentDetailsModal