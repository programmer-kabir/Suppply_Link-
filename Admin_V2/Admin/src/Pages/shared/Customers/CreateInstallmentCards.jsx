import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FaUser,
  FaHashtag,
  FaBox,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTruck,
  FaStore,
  FaCalculator,
} from "react-icons/fa";
import IconInput from "../../../components/IconInput";
import useUsers from "../../../utils/Hooks/useUsers";

const CreateInstallmentCards = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const saleType = watch("sale_type", "Installment");
  const { isUsersLoading, users = [], isUsersError } = useUsers();
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
    // Required validation (ordered)
    const requiredFields = [
      { key: "card_number", message: "কার্ড নাম্বার দিতে হবে" },
      { key: "user_id", message: "User নির্বাচন করতে হবে" },
      { key: "product_name", message: "Product নাম দিতে হবে" },
      { key: "mrp", message: "MRP দিতে হবে" },
      { key: "sale_price", message: "Sale price দিতে হবে" },
      { key: "purchase_price", message: "purchase price দিতে হবে" },
      { key: "installment_count", message: "installment count দিতে হবে" },
      { key: "delivery_date", message: "delivery bdate দিতে হবে" },
      {
        key: "first_installment_date",
        message: "first installment date  দিতে হবে",
      },
      {
        key: "reference_user_id",
        message: "reference user id দিতে হবে",
      },
    ];

    for (let field of requiredFields) {
      if (!data[field.key]) {
        toast.error(field.message);
        return;
      }
    }
    if (data.sale_type === "Installment") {
      if (!data.installment_count) {
        toast.error("Installment count দিতে হবে");
        return;
      }
    }

    try {
      // ================= FORM DATA =================
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });
      // ================= API CALL =================
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/customers/create_installment_card.php`,
        {
          method: "POST",
          body: formData,
        }
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold text-white">
        Create Installment Card
      </h2>

      <IconInput
        label="Card Number"
        icon={FaHashtag}
        register={register}
        name="card_number"
        placeholder="Card Number"
      />

      <IconInput
        label="User ID"
        icon={FaUser}
        register={register}
        name="user_id"
        placeholder="User ID"
        type="number"
      />

      <IconInput
        label="Product Name"
        icon={FaBox}
        register={register}
        name="product_name"
        placeholder="Product Name"
      />

      <div className="grid grid-cols-2 gap-4">
        <IconInput
          label="MRP"
          icon={FaMoneyBillWave}
          register={register}
          name="mrp"
          placeholder="MRP"
          type="number"
        />

        <IconInput
          label="Sale Price"
          icon={FaMoneyBillWave}
          register={register}
          name="sale_price"
          placeholder="Sale Price"
          type="number"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <IconInput
          label="Purchase Price"
          icon={FaMoneyBillWave}
          register={register}
          name="purchase_price"
          placeholder="Purchase Price"
          type="number"
        />

        <IconInput
          label="Additional Cost"
          icon={FaMoneyBillWave}
          register={register}
          name="additional_cost"
          placeholder="Additional Cost"
          type="number"
        />
      </div>

      <IconInput
        label="Sale Type"
        icon={FaStore}
        register={register}
        name="sale_type"
      >
        <select
          {...register("sale_type")}
          className="bg-[#0F1B2D] text-white w-full py-2"
        >
          <option value="Installment">Installment</option>
          <option value="Cash">Cash</option>
        </select>
      </IconInput>

      {saleType === "Installment" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <IconInput
              label="Down Payment"
              icon={FaMoneyBillWave}
              register={register}
              name="down_payment"
              type="number"
            />

            <IconInput
              label="Installment Count"
              icon={FaHashtag}
              register={register}
              name="installment_count"
              type="number"
            />
          </div>
          <IconInput
            label="Per Installment Amount"
            icon={FaCalculator}
            register={register}
            name="per_installment_amount"
            placeholder="Per installment amount"
            type="number"
          />

          <IconInput
            label="First Installment Date"
            icon={FaCalendarAlt}
            register={register}
            name="first_installment_date"
            type="date"
            style={{ colorScheme: "dark" }}
          />
        </>
      )}

      <IconInput
        label="Delivery Date"
        icon={FaTruck}
        register={register}
        name="delivery_date"
        type="date"
        style={{ colorScheme: "dark" }}
      />
      <IconInput
        label="Reference (Official Staff)"
        icon={FaUser}
        register={register}
        name="reference_user_id"
      >
        <select
          {...register("reference_user_id")}
          className="bg-[#0F1B2D] text-white w-full py-2"
          disabled={isUsersLoading || isUsersError}
        >
          <option value="">
            {isUsersLoading
              ? "Loading staff..."
              : isUsersError
              ? "Staff load failed"
              : "Select Reference Staff"}
          </option>

          {officialStaff.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name ?? u.full_name ?? u.username ?? `User#${u.id}`}
            </option>
          ))}
        </select>
      </IconInput>
      <IconInput
        label="Supplier ID"
        icon={FaStore}
        register={register}
        name="supplier_id"
        type="number"
      />

      <button className="w-full py-2 bg-blue-600 rounded-xl text-white">
        Create Installment Card
      </button>
    </form>
  );
};

export default CreateInstallmentCards;
