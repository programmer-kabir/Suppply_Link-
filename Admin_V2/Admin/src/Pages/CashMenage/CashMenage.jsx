import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaWallet,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineCreditCard } from "react-icons/ai";
import CashCard from "../../components/cash/CashCard";
import CashButton from "../../components/cash/CashButton";
import CashOutModal from "../../components/cash/CashOutModal";
import CashInModal from "../../components/cash/CashInModal";
import { Link } from "react-router-dom";

const CashManage = () => {
  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);
  const [data, setData] = useState({
    todayIn: 0,
    todayOut: 0,
    net: 0,
    totalCash: 0,
  });
  const loadData = () => {
    fetch(`${import.meta.env.VITE_LOCALHOST_KEY}/cash/dashboard_today.php`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div className="p-6 bg-[#0B1120] min-h-screen">
      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <CashCard
          title="আজকের জমা"
          subtitle={"আজকের সারাংশ"}
          value={`৳ ${data.todayDeposit}`}
          icon={FaMoneyBillWave}
          accent="text-green-400"
        />
        <CashCard
          title="আজকের খরচ"
          subtitle={"আজকের সারাংশ"}
          value={`৳ ${data.todayWithdraw}`}
          icon={AiOutlineCreditCard}
          accent="text-red-400"
        />
        <CashCard
          title="নেট ব্যালেন্স"
          subtitle={"আজকের সারাংশ"}
          value={`৳ ${data?.todayNet}`}
          icon={FaChartLine}
          accent="text-blue-400"
        />
        <CashCard
          title="মোট ক্যাশ"
          subtitle={"আজকের সারাংশ"}
          value={`৳ ${data.handCash}`}
          icon={FaWallet}
          accent="text-orange-400"
        />
      </div>

      {/* Buttons */}
      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <CashButton
          text="ক্যাশ ইন"
          icon={MdOutlineAttachMoney}
          accent="text-green-400"
          onClick={() => setOpenIn(true)}
        />
        <CashButton
          text="ক্যাশ আউট"
          icon={AiOutlineCreditCard}
          accent="text-red-400"
          onClick={() => setOpenOut(true)}
        />
        <CashButton
          link={"../cash/daily_reports"}
          text="দৈনিক রিপোর্ট"
          icon={FaCalendarAlt}
          accent="text-blue-400"
        />
        <CashButton
          link={"../cash/monthly_reports"}
          text="মাসিক রিপোর্ট"
          icon={FaCalendarAlt}
          accent="text-indigo-400"
        />
      </div>

      {/* Yearly */}
      <div className="mt-6">
        <Link
          to={"/cash/yearly_reports"}
          className="w-full p-4 rounded-xl bg-[#111827] border border-white/10 text-white hover:bg-[#1f2937] flex items-center justify-center gap-2 transition"
        >
          <FaChartLine className="text-purple-400" />
          বার্ষিক রিপোর্ট
        </Link>
      </div>

      {/* Modals */}
      <CashInModal isOpen={openIn} onClose={() => setOpenIn(false)} />
      <CashOutModal isOpen={openOut} onClose={() => setOpenOut(false)} />
    </div>
  );
};

export default CashManage;
