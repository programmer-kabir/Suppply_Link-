import Lottie from "lottie-react";
import { useForm } from "react-hook-form";
import loginAnimation from "./login-security.json";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FiEye, 
  FiEyeOff, 
  FiUser, 
  FiLock, 
  FiShield, 
  FiArrowRight, 
  FiCheckCircle,
  FiZap,
  FiActivity,
  FiLayers,
  FiKey
} from "react-icons/fi";

const AdminLogin = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const id = data?.id?.trim();
    const password = data?.password;
    
    setIsSubmitting(true);
    try {
      const res = await login(id, password);

      if (res?.success) {
        toast.success("লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...", {
          theme: "dark",
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/");
      } else {
        toast.error("ইউজার আইডি বা পাসওয়ার্ড সঠিক নয়!", {
          theme: "dark",
          position: "top-center"
        });
      }
    } catch (err) {
      toast.error("সার্ভারে সংযোগ করা সম্ভব হয়নি!", {
        theme: "dark",
        position: "top-center"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickId = (val) => {
    setValue("id", val, { shouldValidate: true });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050811] overflow-x-hidden p-4 sm:p-6 lg:p-10 select-none">
      
      {/* ===== Ambient Floating Glowing Nebulas ===== */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 30, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-96 sm:w-[580px] h-96 sm:h-[580px] rounded-full bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent blur-[140px] pointer-events-none"
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -35, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-96 sm:w-[620px] h-96 sm:h-[620px] rounded-full bg-gradient-to-tl from-cyan-600/25 via-blue-600/20 to-transparent blur-[150px] pointer-events-none"
      />

      <motion.div 
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[180px] pointer-events-none"
      />

      {/* ===== Cyber Grid & Hex Pattern ===== */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)'
        }}
      />

      {/* ===== Main Dual-Pane Luxury Glass Container ===== */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 rounded-[2.5rem] backdrop-blur-3xl bg-slate-900/70 border border-slate-700/60 shadow-[0_0_80px_-15px_rgba(79,70,229,0.3)] overflow-hidden"
      >
        
        {/* Glowing Top Rainbow Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent opacity-90 z-20" />

        {/* ================================================================= */}
        {/* LEFT COLUMN: Visual Brand Showcase & Feature Cards (Desktop) */}
        {/* ================================================================= */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-10 xl:p-12 relative bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 border-r border-slate-800/80 overflow-hidden">
          
          {/* Subtle Light Rays */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Status */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                    <FiLayers className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-wide text-white flex items-center gap-1.5 font-sans">
                    Supply<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Link</span>
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Enterprise ERP v2.0
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>System Online</span>
              </div>
            </div>
          </div>

          {/* Middle: Lottie Security Shield & Cyber Sphere */}
          <div className="my-auto py-6 flex flex-col items-center text-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Spinning Radar Ring */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-cyan-500/20 border-dashed animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-6 rounded-full bg-indigo-500/10 blur-xl" />
              
              <Lottie 
                animationData={loginAnimation} 
                loop 
                className="w-36 h-36 relative z-10 drop-shadow-[0_0_25px_rgba(99,102,241,0.6)]" 
              />
            </div>

            <h3 className="text-xl font-bold text-white mt-4 tracking-tight">
              স্মার্ট সাপ্লাই ও বিজনেস ম্যানেজমেন্ট
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
              দৈনন্দিন সেলস, ক্যাশ রিপোর্ট, ইনভেন্টরি ও সিকিউর এক্সেস কন্ট্রোল এক ক্লিকেই পরিচালনা করুন।
            </p>

            {/* Feature Mini Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">
              <motion.div 
                whileHover={{ y: -2 }}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex items-center gap-2.5 text-left"
              >
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FiZap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-200">Realtime Cash</div>
                  <div className="text-[9px] text-slate-400">স্বয়ংক্রিয় হিসাব</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex items-center gap-2.5 text-left"
              >
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <FiActivity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-200">256-bit AES</div>
                  <div className="text-[9px] text-slate-400">এনক্রিপ্টেড ডাটা</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="w-3.5 h-3.5 text-indigo-400" />
              Multi-Role Access Guard
            </span>
            <span>© 2026 SupplyLink Inc.</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: The Interactive Login Form */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center p-8 sm:p-10 xl:p-12 relative bg-slate-900/50 backdrop-blur-2xl">
          
          {/* Mobile Only: Top Brand */}
          <div className="flex lg:hidden items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <FiLayers className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Supply<span className="text-indigo-400">Link</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3 shadow-inner">
              <FiShield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Authentication Gate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              এডমিন লগইন
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              আপনার নির্ধারিত ইউজার আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
            </p>
          </div>



          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* User ID Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                ইউজার আইডি বা মোবাইল নম্বর
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="যেমন: 1 অথবা 01941145876"
                  {...register("id", { required: "ইউজার আইডি বা মোবাইল নম্বর দেওয়া আবশ্যক" })}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium
                  focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 shadow-inner"
                />
              </div>
              <AnimatePresence>
                {errors.id && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-rose-400 text-xs pl-1 font-medium mt-1"
                  >
                    {errors.id.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  পাসওয়ার্ড
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  {...register("password", {
                    required: "পাসওয়ার্ড দেওয়া আবশ্যক",
                    minLength: {
                      value: 4,
                      message: "পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে",
                    },
                  })}
                  className="w-full pl-10 pr-12 py-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium
                  focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 shadow-inner"
                />

                {/* Show/Hide Password Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white focus:outline-none transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-rose-400 text-xs pl-1 font-medium mt-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Glowing Action Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="relative w-full group overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-4 shadow-xl shadow-indigo-950/60"
            >
              {/* Moving Neon Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 rounded-2xl transition duration-300 group-hover:opacity-100 opacity-80 blur-sm" />
              
              <div className="relative flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500/80 inline-block"></span>
              <span>AES-256 Bit Encryption</span>
            </div>
            <span>SupplyLink Security</span>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;