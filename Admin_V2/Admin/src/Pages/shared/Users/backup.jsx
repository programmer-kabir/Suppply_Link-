import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ID_TYPES, ROLES } from "./UsersType";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaLock,
  FaUserTag,
  FaImage,
  FaCalendarAlt,
} from "react-icons/fa";
import IconInput from "../../../components/IconInput";

const AddUser = () => {
  const { register, handleSubmit, reset } = useForm();
  // const [preview, setPreview] = useState(null);
  // component এর ভিতরে
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);
  const photoReg = register("photo");

  useEffect(() => {
    // cleanup object URL
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const onSubmit = async (data) => {
    const requiredFields = [
      { key: "name", message: "নাম দিতে হবে" },
      { key: "id_type", message: "ID টাইপ নির্বাচন করতে হবে" },
      { key: "id_number", message: "ID নম্বর দিতে হবে" },
      { key: "mobile", message: "মোবাইল নম্বর দিতে হবে" },
      { key: "address", message: "ঠিকানা দিতে হবে" },
      { key: "role", message: "রোল নির্বাচন করতে হবে" },
    ];

    for (let field of requiredFields) {
      if (!data[field.key]) {
        toast.error(field.message);
        return; // ⛔ প্রথম error দেখিয়েই stop
      }
    }

    try {
      // 🔹 FormData বানাও
      const formData = new FormData();

      // Object.entries(data).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      // if (data.photo?.[0]) formData.append("photo", data.photo[0]);
      Object.entries(data).forEach(([k, v]) => {
        if (k !== "photo") formData.append(k, v ?? "");
      });

      // ✅ file
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      // 🔹 API CALL
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/users/create_user.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      if (!result.success) {
        toast.error(result.message || "User create failed");
        return;
      }

      // ✅ SUCCESS
      toast.success("ইউজার সফলভাবে তৈরি হয়েছে 🎉");
      setPreview("");
      reset(); // form clear
    } catch (error) {
      toast.error("সার্ভার সমস্যা হয়েছে");
    }
  };

  const DATE_INPUT_PROPS = {
    style: { colorScheme: "dark" },
  };

  return (
    <form
      className="max-w-7xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <IconInput
        label="Name"
        icon={FaUser}
        register={register}
        name="name"
        placeholder="Name"
      />

      <div className="grid grid-cols-2 gap-4">
        <IconInput
          label="ID Type"
          icon={FaIdCard}
          register={register}
          name="id_type"
        >
          <select
            {...register("id_type")}
            className="bg-[#0F1B2D]  text-white w-full py-2 outline-none"
          >
            <option value="" className="rounded-md">
              ID Type
            </option>
            {ID_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </IconInput>

        <IconInput
          label="ID Number"
          icon={FaIdCard}
          register={register}
          name="id_number"
          placeholder="ID Number"
        />
      </div>

      <IconInput
        label="Mobile"
        icon={FaPhone}
        register={register}
        name="mobile"
        placeholder="Mobile"
      />

      <IconInput
        label="Address"
        icon={FaMapMarkerAlt}
        register={register}
        name="address"
        textarea
      />

      <IconInput
        label="Start Date"
        icon={FaCalendarAlt}
        register={register}
        name="start_date"
        style={{ colorScheme: "dark" }}
        type="date"
      />

      <IconInput
        label="Password"
        icon={FaLock}
        register={register}
        name="password"
        type="password"
      />

      <IconInput label="Role" icon={FaUserTag} register={register} name="role">
        <select
          {...register("role")}
          className="bg-[#0F1B2D] text-white w-full py-2"
        >
          <option value="">Role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </IconInput>

      {/* ✅ BEAUTIFUL IMAGE UPLOAD */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Photo</label>

        <label
          htmlFor="photo"
          className="relative block w-full rounded-2xl border border-dashed border-white/20
               bg-white/5 hover:bg-white/10 transition cursor-pointer
               overflow-hidden"
        >
          {/* fixed height */}
          <div className="h-40 w-full flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-contain bg-black/20"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-4">
                <FaImage className="text-3xl text-white/40 mb-2" />
                <p className="text-sm text-white/70">Click to upload image</p>
                <p className="text-xs text-white/40 mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          {/* remove button */}
          {preview ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (preview) URL.revokeObjectURL(preview);
                setPreview("");
                setFileName("");
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="absolute top-2 right-2 rounded-lg bg-black/60 px-2.5 py-1 text-xs text-white hover:bg-black/80"
            >
              Remove
            </button>
          ) : null}

          <input
            id="photo"
            type="file"
            accept="image/*"
            className="hidden"
            {...photoReg}
            ref={(el) => {
              photoReg.ref(el); // ✅ keep react-hook-form ref
              fileRef.current = el;
            }}
            onChange={(e) => {
              photoReg.onChange(e); // ✅ keep RHF updated

              const file = e.target.files?.[0];
              if (!file) return;

              if (preview) URL.revokeObjectURL(preview);
              setPreview(URL.createObjectURL(file));
              setFileName(file.name);
            }}
          />
        </label>

        {/* file name */}
        {fileName ? (
          <div className="mt-2 text-xs text-white/60 truncate">
            Selected: <span className="text-white/80">{fileName}</span>
          </div>
        ) : null}
      </div>

      <button className="w-full py-2 bg-blue-600 rounded-xl text-white">
        সাবমিট
      </button>
    </form>
  );
};

export default AddUser;
