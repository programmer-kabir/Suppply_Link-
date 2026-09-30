import React, { useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaHashtag,
  FaBox,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTruck,
  FaStore,
  FaCalculator,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaInfoCircle,
  FaCheckCircle,
  FaChevronDown,
  FaSearch
} from "react-icons/fa";
import IconInput from "../../../components/IconInput";
import useUsers from "../../../utils/Hooks/useUsers";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";

const SearchableDropdown = ({ users, value, onChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = search.toLowerCase();
      const name = (u.name ?? u.full_name ?? u.username ?? "").toLowerCase();
      const mobile = (u.mobile ?? "").toLowerCase();
      const idNum = String(u.user_id || u.id);
      return name.includes(term) || mobile.includes(term) || idNum.includes(term);
    });
  }, [users, search]);
  const selectedUser = users.find((u) => String(u.user_id || u.id) === String(value));
  return (
    <div className="relative w-full">
      <div
        className={`w-full py-1 text-white bg-transparent flex justify-between items-center cursor-pointer transition-colors ${disabled ? "opacity-50 pointer-events-none" : ""
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-base">
          {selectedUser
            ? `${selectedUser.name ?? `User#${selectedUser.id}`} (ID: ${selectedUser.user_id || selectedUser.id})`
            : placeholder || "Select User..."}
        </span>
        <FaChevronDown className={`transition-transform text-slate-400 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[#1A2642] border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#1A2642] p-2 border-b border-white/10 z-10">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-[#0F1B2D] text-white pl-9 pr-3 py-2 rounded-lg outline-none border border-white/5 focus:border-blue-500 transition-colors"
                  placeholder="Search name, phone, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="py-2">
              {filteredUsers.length === 0 ? (
                <div className="p-3 text-slate-400 text-center text-sm">No users found</div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="px-4 py-2.5 hover:bg-blue-600/30 cursor-pointer text-white flex justify-between items-center transition-colors"
                    onClick={() => {
                      onChange(u.user_id || u.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{u.name ?? `User#${u.id}`}</span>
                      {u.mobile && <span className="text-xs text-slate-400">{u.mobile}</span>}
                    </div>
                    <span className="text-blue-400 text-xs font-mono bg-blue-500/10 px-2 py-1 rounded">
                      ID: {u.user_id || u.id}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreateInstallmentCards = () => {
  const { register, handleSubmit, reset, watch, setValue, control } = useForm();
  const saleType = watch("sale_type", "Installment");
  const { customerInstallmentCards } = useCustomerInstallmentCards();


  const { isUsersLoading, users = [], isUsersError } = useUsers();

  useEffect(() => {
    if (users && users.length > 0 && !watch("user_id")) {
      const lastUser = [...users].sort((a, b) => Number(b.id) - Number(a.id))[0];
      if (lastUser) {
        setValue("user_id", lastUser.id);
      }
    }
  }, [users, setValue, watch]);

  const officialStaff = useMemo(() => {
    const allowedRoles = ["admin", "manager", "staff", "developer"];

    return (users || []).filter((u) => {
      // Case A: roles array
      if (Array.isArray(u.roles)) {
        return u.roles.some((r) =>
          allowedRoles.includes(String(r).toLowerCase())
        );
      }

      // Case B: single role fields (fallback)
      const role =
        u.role_name ?? u.role ?? u.user_role ?? u.userType ?? u.type ?? "";
      return allowedRoles.includes(String(role).toLowerCase());
    });
  }, [users]);

  const onSubmit = async (data) => {
    // Required validation
    const requiredFields = [
      { key: "user_id", message: "User নির্বাচন করতে হবে" },
      { key: "product_name", message: "Product নাম দিতে হবে" },
      { key: "mrp", message: "MRP দিতে হবে" },
      { key: "sale_price", message: "Sale price দিতে হবে" },
      { key: "purchase_price", message: "purchase price দিতে হবে" },
      { key: "delivery_date", message: "delivery date দিতে হবে" },
      { key: "reference_user_id", message: "reference user id দিতে হবে" },
    ];

    if (data.sale_type === "Installment") {
      requiredFields.push({ key: "installment_count", message: "installment count দিতে হবে" });
      requiredFields.push({ key: "first_installment_date", message: "first installment date দিতে হবে" });
    }

    for (let field of requiredFields) {
      if (!data[field.key]) {
        toast.error(field.message);
        return;
      }
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/customers/create_installment_card.php`,
        { method: "POST", body: formData }
      );

      const result = await res.json();
      if (!result.success) {
        toast.error(result.message || "Installment create failed");
        return;
      }

      toast.success("Installment Card সফলভাবে তৈরি হয়েছে ✅");
      reset();
    } catch (error) {
      toast.error("সার্ভার সমস্যা হয়েছে");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8"
    >
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
          <FaCreditCard className="text-blue-500" />
          Create Installment Card
        </h1>
        <p className="mt-2 text-gray-400 text-sm">Create a new installment or cash sale record for your customer seamlessly.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 pt-5"
      >
        {/* Customer & Product Information */}
        <motion.div variants={itemVariants} className="bg-[#111C35]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative group z-30">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:w-2 transition-all duration-300 rounded-l-3xl"></div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <FaInfoCircle className="text-blue-400" /> General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <IconInput
              label="User ID (Customer)"
              icon={FaUser}
            >
              <Controller
                name="user_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SearchableDropdown
                    users={users}
                    value={value || watch("user_id")}
                    onChange={(val) => {
                      onChange(val);
                      setValue("user_id", val);
                    }}
                    disabled={isUsersLoading || isUsersError}
                    placeholder={isUsersLoading ? "Loading users..." : "Select Customer"}
                  />
                )}
              />
            </IconInput>

            <IconInput
              label="Product Name"
              icon={FaBox}
              register={register}
              name="product_name"
              placeholder="Enter product name..."
            />

            <IconInput
              label="Supplier ID (Optional)"
              icon={FaStore}
              register={register}
              name="supplier_id"
              type="number"
              placeholder="e.g. 5"
            />
          </div>
        </motion.div>

        {/* Pricing & Financials */}
        <motion.div variants={itemVariants} className="bg-[#111C35]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative group z-20">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 group-hover:w-2 transition-all duration-300 rounded-l-3xl"></div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <FaFileInvoiceDollar className="text-purple-400" /> Pricing & Financials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <IconInput
              label="MRP"
              icon={FaMoneyBillWave}
              register={register}
              name="mrp"
              placeholder="0.00"
              type="number"
            />

            <IconInput
              label="Purchase Price"
              icon={FaMoneyBillWave}
              register={register}
              name="purchase_price"
              placeholder="0.00"
              type="number"
            />

            <IconInput
              label="Additional Cost"
              icon={FaMoneyBillWave}
              register={register}
              name="additional_cost"
              placeholder="0.00"
              type="number"
            />

            <IconInput
              label="Sale Price"
              icon={FaMoneyBillWave}
              register={register}
              name="sale_price"
              placeholder="0.00"
              type="number"
            />
          </div>
        </motion.div>

        {/* Payment Configuration */}
        <motion.div variants={itemVariants} className="bg-[#111C35]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative group z-10">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 group-hover:w-2 transition-all duration-300 rounded-l-3xl"></div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <FaCalculator className="text-emerald-400" /> Payment Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <IconInput
              label="Sale Type"
              icon={FaStore}
              register={register}
              name="sale_type"
            >
              <select
                {...register("sale_type")}
                className="bg-[#0F1B2D] text-white w-full py-2 outline-none"
              >
                <option value="Installment">Installment</option>
                <option value="Cash">Cash</option>
              </select>
            </IconInput>

            <IconInput
              label="Reference (Official Staff)"
              icon={FaUser}
            >
              <Controller
                name="reference_user_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SearchableDropdown
                    users={officialStaff}
                    value={value || watch("reference_user_id")}
                    onChange={(val) => {
                      onChange(val);
                      setValue("reference_user_id", val);
                    }}
                    disabled={isUsersLoading || isUsersError}
                    placeholder={isUsersLoading ? "Loading staff..." : "Select Reference Staff"}
                  />
                )}
              />
            </IconInput>
          </div>

          {saleType === "Installment" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black/20 p-6 rounded-2xl border border-white/5"
            >
              <IconInput
                label="Down Payment"
                icon={FaMoneyBillWave}
                register={register}
                name="down_payment"
                type="number"
                placeholder="0.00"
              />

              <IconInput
                label="Installments"
                icon={FaHashtag}
                register={register}
                name="installment_count"
              >
                <select
                  {...register("installment_count")}
                  className="bg-[#0F1B2D] text-white w-full py-2 outline-none"
                >
                  <option value="">Select Count</option>
                  <option value="6">6 Installments</option>
                  <option value="12">12 Installments</option>
                </select>
              </IconInput>

              <IconInput
                label="Per Installment (Opt)"
                icon={FaCalculator}
                register={register}
                name="per_installment_amount"
                placeholder="Auto calculated"
                type="number"
              />

              <IconInput
                label="First Installment"
                icon={FaCalendarAlt}
                register={register}
                name="first_installment_date"
                type="date"
                style={{ colorScheme: "dark" }}
              />
            </motion.div>
          )}

          <div className="mt-6 md:w-1/2">
            <IconInput
              label="Delivery Date"
              icon={FaTruck}
              register={register}
              name="delivery_date"
              type="date"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="flex justify-end pt-4">
          <button
            type="submit"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full skew-x-12 transition-transform duration-700 ease-in-out"></div>
            <FaCheckCircle className="text-xl" /> Generate Card
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CreateInstallmentCards;
