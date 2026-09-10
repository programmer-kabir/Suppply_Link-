import React, { useState } from "react";
import { useAuth } from "../../../Provider/AuthProvider";
import useUsers from "../../../utils/Hooks/useUsers";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import useInstallmentFiles from "../../../utils/Hooks/InstallmentFiles/useInstallmentFiles";

const AddNewInstallmentFiles = () => {
  const { user } = useAuth();
  const { isUsersLoading, users, isUsersError } = useUsers();
  const { installmentFiles, isLoading, isError } = useInstallmentFiles();
  
  // কাস্টমার কিস্তি কার্ডের ডাটা
  const { customerInstallmentCards, isCustomerInstallmentsCardsLoading } =
    useCustomerInstallmentCards();

  const [formData, setFormData] = useState({
    user_id: "",
    card_id: "",
    has_cheque: "no",
    file_received_date: new Date().toISOString().split("T")[0],
    approved_by: user?.id,
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      
      // কাস্টমার চেঞ্জ হলে আগের সিলেক্ট করা কার্ড আইডি রিসেট হবে
      if (name === "user_id") {
        updatedData.card_id = "";
      }
      
      return updatedData;
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const submitData = new FormData();

    submitData.append("user_id", formData.user_id);
    submitData.append("card_id", formData.card_id);
    submitData.append("has_cheque", formData.has_cheque);
    submitData.append("approved_by", user.id);
    submitData.append("remarks", formData.remarks);

    const response = await fetch(
      `${import.meta.env.VITE_LOCALHOST_KEY}/installmentFiles/add_installment_file.php`,
      {
        method: "POST",
        body: submitData,
      }
    );

    const data = await response.json();



    if (data.success) {
      alert("Installment File Saved Successfully");

      setFormData({
        user_id: "",
        card_id: "",
        has_cheque: "no",
        file_received_date: new Date().toISOString().split("T")[0],
        approved_by: user?.id,
        remarks: "",
      });
    } else {
      alert(data.message || "Failed to save file");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};

  // ১. শুধুমাত্র 'customer' রোল থাকা ইউজারদের ফিল্টার
  const customersOnly = users?.filter((singleUser) =>
    singleUser?.roles?.includes("customer")
  );

  // ২. সিলেক্ট করা কাস্টমারের আইডি এবং যাদের স্ট্যাটাস শুধুমাত্র "fully paid" তাদের ফিল্টার করা হচ্ছে
  const filteredCards = customerInstallmentCards?.filter(
    (card) => 
      String(card?.user_id) === String(formData.user_id) && 
      card?.status?.toLowerCase() === "fully paid"
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            Add Installment File
          </h2>
          <p className="text-slate-400 mt-1">
            Create a new installment file record
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-5">
            
            {/* User Dropdown */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Select Customer</span>
              </label>

              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">
                  {isUsersLoading ? "Loading customers..." : "Select a Customer"}
                </option>
                
                {isUsersError && (
                  <option disabled>Error loading customers</option>
                )}

                {customersOnly &&
                  customersOnly.map((singleUser) => (
                    <option key={singleUser.id} value={singleUser.id}>
                      {singleUser.name || "Unknown"} (ID: {singleUser.id})
                    </option>
                  ))}
              </select>
            </div>

            {/* Card ID Dropdown */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Select Card ID</span>
              </label>

              <select
                name="card_id"
                value={formData.card_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                disabled={!formData.user_id || isLoading}
                required
              >
                <option value="">
                  {isCustomerInstallmentsCardsLoading || isLoading
                    ? "Loading cards..."
                    : !formData.user_id
                    ? "Please select a customer first"
                    : filteredCards?.length === 0
                    ? "No fully paid card found for this customer"
                    : "Select a Card"}
                </option>

                {/* ফিল্টার করা fully paid কার্ডগুলো এখানে ম্যাপ হচ্ছে */}
                {formData.user_id &&
                  filteredCards &&
                  filteredCards.map((card) => {
                    // চেক করা হচ্ছে এই কার্ড আইডিটি ইতিমধ্যে installmentFiles-এ আছে কি না
                    const isAlreadyTaken = installmentFiles?.some(
                      (file) => String(file?.card_id) === String(card?.id)
                    );

                    return (
                      <option 
                        key={card.id} 
                        value={card.id}
                        disabled={isAlreadyTaken} // অলরেডি নেওয়া থাকলে সিলেক্ট করা যাবে না
                        className={isAlreadyTaken ? "text-slate-500 bg-slate-900" : ""}
                      >
                        Card ID: {card.id} {card.card_number ? `(${card.card_number})` : ""}
                        {isAlreadyTaken ? " - (File already taken)" : ""}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Has Cheque */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Has Cheque</span>
              </label>
              <select
                name="has_cheque"
                value={formData.has_cheque}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Remarks</span>
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="Write remarks here..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="btn btn-primary px-8">
              Save File Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewInstallmentFiles;