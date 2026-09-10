// import React, { useState } from "react";
// import { FaHome, FaUser, FaChartLine, FaHistory } from "react-icons/fa";
// import { FaArrowTrendUp } from "react-icons/fa6";
// import Invest from "../components/Tabs/Invest/Invest";
// import HomeReport from "../components/Tabs/Home/HomeReport";
// import Profile from "../components/Tabs/Profile/Profile";
// import Profits from "../components/Tabs/Profit/Profits";
// import CompanySummary from "../components/Tabs/CompanySummary/CompanySummary";
// const tabs = [
//   { id: "home", label: "হোম", icon: <FaHome /> },
//   { id: "profile", label: "প্রোফাইল", icon: <FaUser /> },
//   { id: "invest", label: "বিনিয়োগ", icon: <FaChartLine /> },
//   { id: "profit", label: "লাভ", icon: <FaArrowTrendUp /> },
//   { id: "company_summary", label: "সারসংক্ষেপ", icon: <FaHistory /> },
// ];

// const InvestorHome = () => {
//   // console.log(runningUser);
//   const [activeTab, setActiveTab] = useState("home");

//   return (
//     <div className="w-full max-w-6xl mx-auto mt-6 px-3">
//       <div className="flex justify-center mb-6">
//         <nav className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 shadow backdrop-blur">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 rounded-full md:px-4 px-2 py-1  md:py-2 text-sm font-medium transition-all duration-200
//               ${
//                 activeTab === tab.id
//                   ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md scale-[1.05]"
//                   : "text-gray-700 hover:bg-white hover:shadow"
//               }`}
//             >
//               <span className="text-base hidden md:flex">{tab.icon}</span>
//               <span>{tab.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* 🔽 HOME TAB: সব কার্ড + ডিটেইলস */}
//       {activeTab === "home" && <HomeReport />}

//       {activeTab === "profile" && <Profile />}
//       {activeTab === "invest" && <Invest />}
//       {activeTab === "profit" && <Profits />}
//       {activeTab === "company_summary" && <CompanySummary />}
//     </div>
//   );
// };

// export default InvestorHome;

import React, { useState } from "react";
import { FaHome, FaUser, FaChartLine, FaHistory } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import Invest from "../components/Tabs/Invest/Invest";
import HomeReport from "../components/Tabs/Home/HomeReport";
import Profile from "../components/Tabs/Profile/Profile";
import Profits from "../components/Tabs/Profit/Profits";
import CompanySummary from "../components/Tabs/CompanySummary/CompanySummary";
const tabs = [
  // { id: "home", label: "হোম", icon: <FaHome /> },
  { id: "profile", label: "প্রোফাইল", icon: <FaUser /> },
  { id: "invest", label: "বিনিয়োগ", icon: <FaChartLine /> },
  { id: "profit", label: "লাভ", icon: <FaArrowTrendUp /> },
  // { id: "company_summary", label: "সারসংক্ষেপ", icon: <FaHistory /> },
];

const InvestorHome = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full md:max-w-7xl mx-auto mt-6 md:px-3">
      {/* ONly mobile */}
      <div className="md:hidden flex justify-center fixed w-full bottom-0 z-50">
        <nav className="w-full bg-white rounded-b shadow-sm border flex justify-between px-2 py-2 border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200
        ${activeTab === tab.id
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-500"
                }`}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="md:flex justify-center mb-6 hidden ">
        <nav className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 shadow backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full md:px-4 px-2 py-1  md:py-2 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md scale-[1.05]"
                  : "text-gray-700 hover:bg-white hover:shadow"
                }`}
            >
              <span className="text-base hidden md:flex">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 🔽 HOME TAB: সব কার্ড + ডিটেইলস */}
      {activeTab === "home" && <HomeReport />}

      {activeTab === "profile" && <Profile />}
      {activeTab === "invest" && <Invest />}
      {activeTab === "profit" && <Profits />}
      {activeTab === "company_summary" && <CompanySummary />}
    </div>
  );
};

export default InvestorHome;
