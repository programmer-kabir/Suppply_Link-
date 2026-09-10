import React from "react";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";

const SupplierPaymentsTable = ({
  filteredPayments,
  handleDelete,
  handleEdit,
  setSelectedItem,
  setIsDetailsOpen,
}) => {
  return (
    <div>
      <table className="min-w-full text-sm text-gray-300">
        <thead className="bg-[#334155] text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Memo No</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Telecom Name</th>
            <th className="px-4 py-3 text-left">Supplier</th>
            <th className="px-4 py-3 text-left">Brand</th>
            <th className="px-4 py-3 text-left">Total Amount</th>
            <th className="px-4 py-3 text-left">Paid</th>
            <th className="px-4 py-3 text-left">Due</th>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayments?.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-10 text-gray-400">
                <p className="text-lg">No data found</p>
                <p className="text-sm text-gray-500">
                  Try changing date filter
                </p>
              </td>
            </tr>
          ) : (
            filteredPayments?.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-700 hover:bg-[#1e293b]/80 transition duration-200"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item?.memo_no}</td>
                <td className="px-4 py-3">{item?.date}</td>
                <td className="px-4 py-3">{item?.shop_name}</td>
                <td className="px-4 py-3">{item?.supplier}</td>
                <td className="px-4 py-3">{item?.brand}</td>
                <td className="px-4 py-3">{item?.total_amount}</td>
                <td className="px-4 py-3">{item?.paid}</td>
                <td className="px-4 py-3">{item?.due}</td>
                <td className="px-4 py-3">
                  <img
                    className="w-12 h-12 object-cover rounded"
                    src={`https://management.supplylinkbd.com/${item?.image}`}
                    alt="Memo"
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      title="View Details"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailsOpen(true);
                      }}
                      className="p-1 rounded hover:bg-green-500/20"
                    >
                      <MdVisibility size={18} className="text-green-400" />
                    </button>
                    <button className="p-1 rounded hover:bg-blue-500/20">
                      <MdEdit
                        onClick={() => handleEdit(item)}
                        size={18}
                        className="text-blue-400"
                      />
                    </button>

                    <button className="p-1 rounded hover:bg-red-500/20">
                      <MdDelete
                        onClick={() => handleDelete(item.id)}
                        size={18}
                        className="text-red-400"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPaymentsTable;
