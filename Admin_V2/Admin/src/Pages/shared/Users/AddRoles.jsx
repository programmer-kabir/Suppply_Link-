import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaUser, FaUserTag } from "react-icons/fa";
import IconInput from "../../../components/IconInput";
import { ROLES } from "./UsersType";

const AddRoles = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // simple validation
    if (!data.user_id) {
      toast.error("User ID দিতে হবে");
      return;
    }
    if (!data.role) {
      toast.error("Role নির্বাচন করতে হবে");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", data.user_id);
      formData.append("role", data.role);

      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/users/assign_role.php`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message || "Role assign failed");
        return;
      }

      toast.success("Role সফলভাবে assign হয়েছে ✅");
      reset();
    } catch (error) {
      toast.error("সার্ভার সমস্যা হয়েছে");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold text-white">Assign Role</h2>

      {/* USER ID */}
      <IconInput
        label="User ID"
        icon={FaUser}
        register={register}
        name="user_id"
        placeholder="User ID"
        type="number"
      />

      {/* ROLE */}
      <IconInput label="Role" icon={FaUserTag} register={register} name="role">
        <select
          {...register("role")}
          className="bg-[#0F1B2D] text-white w-full py-2 outline-none"
        >
          <option value="">Select Role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </IconInput>

      <button className="w-full py-2 bg-blue-600 rounded-xl text-white">
        Assign Role
      </button>
    </form>
  );
};

export default AddRoles;
