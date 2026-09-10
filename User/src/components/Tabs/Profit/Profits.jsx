import React, { useState } from "react";
import Profit from "./Profit";
import ProfitHistory from "../ProfitHistory/ProfitHistory";

const Profits = () => {
  const [activeTab, setActiveTab] = useState("investor");

  const tabClass = (key) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      activeTab === key
        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
        : "bg-slate-100 text-slate-600 hover:bg-white hover:text-slate-800"
    }`;

  return (
    <div className="space-y-6 mt-6  pb-24 px-1">
      {/* 🔹 Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          লাভ ও আর্থিক বিশ্লেষণ
        </h2>
        <p className="text-sm text-slate-500">
          আপনার লাভ এবং আপনার লাভ আর্থিক অবস্থার পর্যালোচনা।
        </p>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("investor")}
          className={tabClass("investor")}
        >
          নিজস্ব লাভ
        </button>

        <button
          onClick={() => setActiveTab("company")}
          className={tabClass("company")}
        >
          লাভের ইতিহাস
        </button>
      </div>

      {/* 🔹 Tab Content */}
      <div>
        {activeTab === "investor" && <Profit />}
        {activeTab === "company" && <ProfitHistory />}
      </div>
    </div>
  );
};

export default Profits;
// import React, { useEffect, useState } from "react";
// import { Clock3 } from "lucide-react";

// const Profits = () => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: "00",
//     hours: "00",
//     minutes: "00",
//     seconds: "00",
//   });

//   useEffect(() => {
//     // 72 Hours Countdown
//     const targetTime = new Date().getTime() + 72 * 60 * 60 * 1000;

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetTime - now;

//       if (distance <= 0) {
//         clearInterval(interval);

//         setTimeLeft({
//           days: "00",
//           hours: "00",
//           minutes: "00",
//           seconds: "00",
//         });

//         return;
//       }

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );

//       const minutes = Math.floor(
//         (distance % (1000 * 60 * 60)) / (1000 * 60)
//       );

//       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       setTimeLeft({
//         days: String(days).padStart(2, "0"),
//         hours: String(hours).padStart(2, "0"),
//         minutes: String(minutes).padStart(2, "0"),
//         seconds: String(seconds).padStart(2, "0"),
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const timeBoxes = [
//     { label: "দিন", value: timeLeft.days },
//     { label: "ঘন্টা", value: timeLeft.hours },
//     { label: "মিনিট", value: timeLeft.minutes },
//     { label: "সেকেন্ড", value: timeLeft.seconds },
//   ];

//   return (
//     <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16 md:px-10">
//       {/* Glow Effect */}
//       <div className="absolute top-0 left-0 h-72 w-72 bg-cyan-500/20 blur-3xl" />
//       <div className="absolute bottom-0 right-0 h-72 w-72 bg-blue-500/20 blur-3xl" />

//       <div className="relative z-10 mx-auto max-w-5xl text-center">
//         {/* Top Badge */}
//         <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur-xl">
//           <Clock3 size={18} />
//           সিস্টেম আপডেট চলমান
//         </div>

//         {/* Title */}
//         <h1 className="text-3xl font-black leading-tight text-white md:text-6xl">
//           72 ঘণ্টার <span className="text-cyan-400">মেইনটেন্যান্স</span>{" "}
//           কাউন্টডাউন
//         </h1>

//         {/* Description */}
//         <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-lg">
//           আমাদের অফিসিয়াল প্ল্যাটফর্মে গুরুত্বপূর্ণ আপডেট এবং সার্ভার
//           অপ্টিমাইজেশনের কাজ চলমান রয়েছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে
//           দুঃখিত।
//         </p>

//         {/* Countdown */}
//         <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
//           {timeBoxes.map((item, index) => (
//             <div
//               key={index}
//               className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-400/30"
//             >
//               <h2 className="text-5xl font-black tracking-widest text-white md:text-6xl">
//                 {item.value}
//               </h2>

//               <p className="mt-3 text-sm font-medium uppercase tracking-[3px] text-cyan-300">
//                 {item.label}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Message */}
//         <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-6 py-4 text-sm text-yellow-200 backdrop-blur-xl md:text-base">
//           আপডেট সম্পন্ন হওয়ার পর সকল সার্ভিস পুনরায় স্বাভাবিকভাবে চালু হবে।
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Profits;