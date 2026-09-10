// import { useContext, useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { AuthContext } from "../../Provider/AuthProvider";
// import Lottie from "lottie-react";
// import loginAnimation from "./login-security.json";
// import { toast } from "react-toastify";

// export default function LoginForm() {
//   const { loginWithIdAndPassword } = useContext(AuthContext);
//   const navigate = useNavigate();
// const [searchParams] = useSearchParams();

// const {
//   register,
//   handleSubmit,
//   setValue,
//   formState: { errors },
// } = useForm();

//   const id = searchParams.get("id");
//   const password = searchParams.get("password");
//   const [loading, setLoading] = useState(false);
// useEffect(() => {
//   const id = searchParams.get("id");
//   const password = searchParams.get("password");

//   if (id) setValue("id", id);
//   if (password) setValue("password", password);
// }, [searchParams, setValue]);
//   const onSubmit = async (formData) => {
//     const { id, password } = formData;

//     setLoading(true);

//     try {
//       // 🔹 PHP backend check
//       const res = await fetch(
//         `${import.meta.env.VITE_LOCALHOST_KEY}/Login/login.php`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ id, password }),
//         }
//       );

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         toast.error("Server error, পরে আবার চেষ্টা করুন");
//         return;
//       }
//       if (!data.valid) {
//         toast.error(data.message || "Invalid ID or Password");
//         return;
//       }

//       // 🔐 Firebase / Context login
//       await loginWithIdAndPassword(id, password);
//       toast.success(`${data?.user?.name} আপনার লগইন সম্পন্ন হয়েছে`);
//       navigate("/");
//     } catch (err) {
//       toast.err("Network error! আবার চেষ্টা করুন।");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
//         {/* 🎞️ Lottie */}
//         <div className="flex justify-center mb-4">
//           <Lottie animationData={loginAnimation} loop className="w-28" />
//         </div>

//         <h2 className="text-2xl font-semibold text-slate-800 text-center mb-1">
//           User Login
//         </h2>

//         <p className="text-sm text-slate-500 text-center mb-4">
//           আপনার আইডি ও পাসওয়ার্ড দিয়ে লগইন করুন
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* ID */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               User ID
//             </label>
//             <input
//               type="text"
//               placeholder="যেমন: 5968613272"
//               {...register("id", { required: "ID আবশ্যক" })}
//               className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm
//               outline-none"
//             />
//             {errors.id && (
//               <p className="text-xs text-red-500 mt-1">{errors.id.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="আপনার পাসওয়ার্ড"
//               autoComplete="new-password"
//               {...register("password", {
//                 required: "Password আবশ্যক",
//                 minLength: {
//                   value: 3,
//                   message: "কমপক্ষে ৩ অক্ষর হতে হবে",
//                 },
//               })}
//               className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm
//               outline-none"
//             />
//             {errors.password && (
//               <p className="text-xs text-red-500 mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full mt-2 inline-flex justify-center items-center rounded-xl px-4 py-2.5
//               text-sm font-semibold text-white shadow-md transition-all duration-150
//               ${
//                 loading
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
//               }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Provider/AuthProvider";
import Lottie from "lottie-react";
import loginAnimation from "./login-security.json";
import { toast } from "react-toastify";

export default function LoginForm() {
  const { loginWithIdAndPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    const { id, password } = formData;

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/Login/login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id, password }),
        }
      );

      let data;

      try {
        data = await res.json();
      } catch {
        toast.error("Server error, পরে আবার চেষ্টা করুন");
        return;
      }

      if (!data.valid) {
        toast.error(data.message || "Invalid ID or Password");
        return;
      }

      await loginWithIdAndPassword(id, password);

      toast.success(`${data?.user?.name} আপনার লগইন সম্পন্ন হয়েছে`);

      navigate("/");
    } catch (err) {
      toast.error("Network error! আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // URL থেকে ID + Password auto fill
  useEffect(() => {
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    if (id) setValue("id", id);
    if (password) setValue("password", password);
  }, [searchParams, setValue]);

  // Auto Login
  useEffect(() => {
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    if (!id || !password) return;

    onSubmit({
      id,
      password,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex justify-center mb-4">
          <Lottie animationData={loginAnimation} loop className="w-28" />
        </div>

        <h2 className="text-2xl font-semibold text-slate-800 text-center mb-1">
          User Login
        </h2>

        <p className="text-sm text-slate-500 text-center mb-4">
          আপনার আইডি ও পাসওয়ার্ড দিয়ে লগইন করুন
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              User ID
            </label>

            <input
              type="text"
              placeholder="যেমন: 5968613272"
              {...register("id", { required: "ID আবশ্যক" })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none"
            />

            {errors.id && (
              <p className="text-xs text-red-500 mt-1">
                {errors.id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="আপনার পাসওয়ার্ড"
              autoComplete="new-password"
              {...register("password", {
                required: "Password আবশ্যক",
                minLength: {
                  value: 3,
                  message: "কমপক্ষে ৩ অক্ষর হতে হবে",
                },
              })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none"
            />

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 inline-flex justify-center items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}