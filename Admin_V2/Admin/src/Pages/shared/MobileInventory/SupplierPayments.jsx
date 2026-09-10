import React, { useState } from "react";
import useSupplierPayments from "../../../utils/Hooks/useSupplierPayments";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import SupplierPaymentsTable from "../../../components/Dashboard/SupplierPayments/SupplierPaymentsTable";
import SupplierPaymentDetailsModal from "../../../components/Dashboard/SupplierPayments/SupplierPaymentDetailsModal";
import SupplierPaymentAddModal from "../../../components/Dashboard/SupplierPayments/SupplierPaymentAddModal";
import SupplierPaymentEditModal from "../../../components/Dashboard/SupplierPayments/SupplierPaymentEditModal";

const SupplierPayments = () => {
  const {
    isSupplierPaymentsError,
    isSupplierPaymentsLoading,
    refetch,
    supplierPayments,
  } = useSupplierPayments();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };
  
  const filteredPayments = supplierPayments?.filter((item) => {
    if (!startDate && !endDate) return true;

    const itemDate = new Date(item.date);

    if (startDate && new Date(startDate) > itemDate) return false;
    if (endDate && new Date(endDate) < itemDate) return false;

    return true;
  });
const handleEdit = (item) => {
  setSelectedItem(item);
  setIsEditOpen(true);
};
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_LOCALHOST_KEY}/supplierPayments/deleteSupplierPayments.php?id=${id}`
    );

    if (res.data.success) {
      Swal.fire({
        title: "Deleted!",
        text: "Payment deleted successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Delete failed ❌",
      icon: "error",
    });
  }
};
  return (
    <div>
      <div className=" min-h-screen">
        {/* Header */}
        <div className="md:flex items-center justify-between mb-4 pt-4 md:px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-200">
              Supplier Payment Sheet
            </h2>
          </div>

          {/* Project / Shop Name */}
          <div className="flex items-center justify-between gap-3 pt-5 md:pt-0">
            <span className="text-sm bg-gray-800 px-4 py-2 rounded flex items-center gap-3">
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                Total:
              </span>

              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                Paid:
              </span>

              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                Due:
              </span>
            </span>

            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-medium"
            >
              + Add
            </button>
          </div>
        </div>
        <div className="mx-auto shadow-xl ">
          <div className="flex gap-4 mb-4 justify-end pt-4 px-5 bg-[#0f172a]">
            {" "}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded date-fix"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded date-fix"
            />
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition duration-200 font-medium"
            >
              Reset
            </button>
          </div>
          <div className="overflow-x-auto">
            <SupplierPaymentsTable
              filteredPayments={filteredPayments}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              setSelectedItem={setSelectedItem}
              setIsDetailsOpen={setIsDetailsOpen}
            />
          </div>
          {/* Table */}
        </div>
      </div>
      {isDetailsOpen && (
        <SupplierPaymentDetailsModal selectedItem={selectedItem} setIsDetailsOpen={setIsDetailsOpen} />
      )}
      <SupplierPaymentAddModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => refetch()}
/>
<SupplierPaymentEditModal
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  onSuccess={() => refetch()}
  item={selectedItem}
/>
    </div>
  );
};

export default SupplierPayments;
