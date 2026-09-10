import { MdPhoneAndroid } from "react-icons/md";
import useMobileInventory from "../../../utils/Hooks/useMobileInventory";
import { useState } from "react";
import AddStockModal from "../../../components/Dashboard/MobileInventory/AddStockModal";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit, MdDelete } from "react-icons/md";
import EditStockModal from "../../../components/Dashboard/MobileInventory/EditStockModal";
import Swal from "sweetalert2";
const InventoryList = () => {
  const { isStockMobilesError, isStockMobilesLoading, refetch, stockMobiles } =
    useMobileInventory();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };
  const filteredMobiles = stockMobiles?.filter((item) => {
    if (!startDate && !endDate) return true;

    const itemDate = new Date(item.date);

    if (startDate && new Date(startDate) > itemDate) return false;
    if (endDate && new Date(endDate) < itemDate) return false;

    return true;
  });
  const availableCount = filteredMobiles?.filter(
    (item) => item?.status === "available",
  ).length;
  const soldCount = filteredMobiles?.filter(
    (item) => item?.status === "sold",
  ).length;

  const [formData, setFormData] = useState({
    date: "",
    brand: "",
    model: "",
    variant: "",
    color: "",
    image: "",
    purchase_price: "",
    mrp: "",
    supplier: "",
    status: "available",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const brands = ["Samsung", "Tecno", "Xiaomi", "Realme", "Vivo", "Oppo"];
  const variants = [
    "3GB + 32GB",
    "3GB + 64GB",
    "4GB + 64GB",
    "4GB + 128GB",
    "6GB + 128GB",
    "6GB + 256GB",
    "8GB + 128GB",
    "8GB + 256GB",
    "8GB + 512GB",
    "12GB + 256GB",
    "12GB + 512GB",
  ];
  const [brandInput, setBrandInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandInput.toLowerCase()),
  );
  const [variantInput, setVariantInput] = useState("");
  const [showVariantSuggestions, setShowVariantSuggestions] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
const [editData, setEditData] = useState(null);
  const filteredVariants = variants.filter((v) =>
    v.toLowerCase().includes(variantInput.toLowerCase()),
  );
const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.brand ||
    !formData.model ||
    !formData.date ||
    !formData.purchase_price ||
    !formData.variant
  ) {
    toast.info("সব field fill করো!");
    return;
  }

  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // ✅ FIXED
    const res = await axios.post(
      `${import.meta.env.VITE_LOCALHOST_KEY}/Inventory/addMobileStock.php`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      toast.success("Stock Added ✅");
      setIsOpen(false);
      refetch();
    }
  } catch (error) {
    toast.error("Error adding stock ❌");
    setIsOpen(false);
  }
};
const handleEdit = (item) => {
  setEditData(item);
  setIsEditOpen(true);
};


const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

    Object.keys(editData).forEach((key) => {
      data.append(key, editData[key]);
    });

    // 🔥 old image পাঠাও
    data.append("old_image", editData.image);

    const res = await axios.post(
      `${import.meta.env.VITE_LOCALHOST_KEY}/Inventory/updateMobileStock.php`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      toast.success("Updated ✅");
      setIsEditOpen(false);
      refetch();
    }
  } catch (err) {
  
    toast.error("Update failed ❌");
  }
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
      `${import.meta.env.VITE_LOCALHOST_KEY}/Inventory/deleteMobileStock.php?id=${id}`
    );

    if (res.data.success) {
      Swal.fire({
        title: "Deleted!",
        text: "Your item has been deleted.",
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
    <div className=" min-h-screen">
      {/* Header */}
      <div className="md:flex items-center justify-between mb-4 pt-4 md:px-4">
        <div className="flex items-center gap-2">
          <MdPhoneAndroid className="text-3xl text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-200">Mobile Inventory</h2>
        </div>

        {/* Project / Shop Name */}
        <div className="flex items-center justify-between gap-3 pt-5 md:pt-0">
          <span className="text-sm bg-gray-800 px-4 py-2 rounded flex items-center gap-3">
            <span className="text-gray-300 font-medium">My Mobile Shop</span>

            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
              Available: {availableCount}
            </span>

            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
              Sold: {soldCount}
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
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-[#334155] text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Model</th>
                <th className="px-4 py-3 text-left">Variant</th>
                <th className="px-4 py-3 text-left">Color</th>
                <th className="px-4 py-3 text-left">IMEI Image</th>
                
                <th className="px-4 py-3 text-left">Purchase Price</th>
                <th className="px-4 py-3 text-left">MRP</th>
                <th className="px-4 py-3 text-left">Supplier</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMobiles?.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-gray-400">
                    <p className="text-lg">No data found</p>
                    <p className="text-sm text-gray-500">
                      Try changing date filter
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMobiles?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-700 hover:bg-[#1e293b]/80 transition duration-200"
                  >
                    <td className="px-4 py-3">{item?.date}</td>
                    <td className="px-4 py-3">{item?.brand}</td>
                    <td className="px-4 py-3">{item?.model}</td>
                    <td className="px-4 py-3">{item?.variant}</td>
                    <td className="px-4 py-3">{item?.color}</td>
                    <td className="px-4 py-3">
                      <img className="w-12 h-12 object-cover rounded" src={`${item.image}`} alt="" />
                    </td>
                   
                   
                   
                    
                    <td className="px-4 py-3 text-green-400 font-medium">
                      ৳ {item?.purchase_price}
                    </td>
                    <td className="px-4 py-3 text-green-400 font-medium">
                      ৳ {item?.mrp}
                    </td>
                    <td className="px-4 py-3">{item?.supplier}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item?.status === "available"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item?.status === "available" ? "Available" : "Sold"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Table */}
      </div>
      {isOpen && (
        <AddStockModal
          setIsOpen={setIsOpen}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          setFormData={setFormData}
          inputClass={inputClass}
          brandInput={brandInput}
          setBrandInput={setBrandInput}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          variantInput={variantInput}
          setVariantInput={setVariantInput}
          filteredBrands={filteredBrands}
          showVariantSuggestions={showVariantSuggestions}
          setShowVariantSuggestions={setShowVariantSuggestions}
          filteredVariants={filteredVariants}
        />
      )}
      {isEditOpen && (
<EditStockModal
  setIsEditOpen={setIsEditOpen}
  handleUpdate={handleUpdate}
  editData={editData}
  setEditData={setEditData}
  inputClass={inputClass}

  // 🔥 ADD THESE
  brandInput={brandInput}
  setBrandInput={setBrandInput}
  showSuggestions={showSuggestions}
  setShowSuggestions={setShowSuggestions}
  filteredBrands={filteredBrands}

  variantInput={variantInput}
  setVariantInput={setVariantInput}
  showVariantSuggestions={showVariantSuggestions}
  setShowVariantSuggestions={setShowVariantSuggestions}
  filteredVariants={filteredVariants}
/>
)}
    </div>
  );
};

export default InventoryList;
