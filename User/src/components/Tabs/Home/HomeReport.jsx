import React from "react";
import useInvestInstallmentCards from "../../../Utils/Hooks/useInvestInstallmentCards";
import Loader from "../../Loader/Loader";
import HomeGreeting from "./HomeGreeting";
import currentUser from "../../../Utils/currentUser";
import { formatCurrency } from "../../formatCurrency";
import useUsers from "../../../Utils/Hooks/useUsers";
import { FaUserTie } from "react-icons/fa";
import { HiCreditCard, HiDocumentCurrencyBangladeshi } from "react-icons/hi2";
import { BiSolidCategory } from "react-icons/bi";
const paymentTypeBn = (type) => {
  switch (type) {
    case "onetime":
      return "এককালীন";
    case "daily":
      return "দৈনিক";
    case "weekly":
      return "সাপ্তাহিক";
    case "monthly":
      return "মাসিক";
    case "flexible":
      return "ফ্লেক্সিবল";
    default:
      return "অজানা";
  }
};

const rankMeta = {
  1: {
    color: "text-amber-500",
    bg: "bg-amber-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_1.png",
  },
  2: {
    color: "text-slate-500",
    bg: "bg-slate-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_2.png",
  },
  3: {
    color: "text-orange-500",
    bg: "bg-orange-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_3.png",
  },
  4: {
    color: "text-blue-500",
    bg: "bg-blue-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_4.png",
  },
  5: {
    color: "text-green-500",
    bg: "bg-green-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_5.png",
  },
  6: {
    color: "text-purple-500",
    bg: "bg-purple-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_6.png",
  },
  7: {
    color: "text-pink-500",
    bg: "bg-pink-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_7.png",
  },
  8: {
    color: "text-teal-500",
    bg: "bg-teal-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_8.png",
  },
  9: {
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_9.png",
  },
  10: {
    color: "text-gray-500",
    bg: "bg-gray-50",
    image: "https://app.supplylinkbd.com/uploads/Badge/rank_10.png",
  },
};

const getInitials = (name) => {
  if (!name) return "?";
  const part = name.split(" ");
  return part[0].charAt(0);
};

const HomeReport = () => {
  const { investInstallmentCards, isInvestInstallmentsCardsLoading } =
    useInvestInstallmentCards();
  const { users, isUsersLoading, isUsersError } = useUsers();
  const runningUser = currentUser();
  const isLoading = isInvestInstallmentsCardsLoading || isUsersLoading;
const runningCards = investInstallmentCards.filter(iv=>iv.status==='running')


  const sortedTop5 = [...(runningCards || [])]
    .sort((a, b) => Number(b.investment_amount) - Number(a.investment_amount))
    .slice(0, 10);
  const sortedAllCards = [...(runningCards || [])].sort(
    (a, b) => Number(b.investment_amount) - Number(a.investment_amount)
  );

  const myBestCard = sortedAllCards.find(
    (inv) => inv.investor_id === runningUser?.id
  );

  const myRank = myBestCard
    ? sortedAllCards.findIndex((inv) => inv.id === myBestCard.id) + 1
    : null;

  return (
    <div className="mt-6 pb-24 px-1">
      <HomeGreeting userName={runningUser?.name} />
      <div className="rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                শীর্ষ ১০ ইনভেস্টর
              </h2>
              <p className="text-xs md:text-sm text-indigo-100">
                সর্বোচ্চ বিনিয়োগকারীদের ইনভেস্টমেন্ট কার্ডসমূহ
              </p>
            </div>
          </div>
          {/* <span className="hidden md:inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] text-indigo-50 border border-white/20"> */}
          {myRank && (
            <div className="mb-4 rounded-xl border text-white border-indigo-200 md:px-4 px-2 py-1 md:py-3 text-sm text-indigo-700">
              <p className="md:hidden">
                {" "}
                🏆 আপনার র‍্যাঙ্ক:
                <span className="font-bold">#{myRank}</span>
              </p>
              <p className="hidden md:flex">
                {" "}
                🏆 আপনার সেরা ইনভেস্টমেন্ট কার্ডের র‍্যাঙ্ক:
                <span className="font-bold ml-1">#{myRank}</span>
              </p>
            </div>
          )}
          {/* </span> */}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader />
          </div>
        ) : sortedTop5.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            কোনো ইনভেস্টমেন্ট কার্ড পাওয়া যায়নি।
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-slate-50 text-xs font-semibold text-slate-500 border-b border-slate-100">
              <div className="col-span-7">প্রোফাইল</div>
              <div className="col-span-3 text-right">ব্যাজ</div>
            </div>

            {/* Rows */}
            {/* Des */}
            <div className="hidden md:inline">
              <div className="grid grid-cols-2 items-center w-full gap-5 px-4">
                {sortedTop5.map((inv, index) => {
                  const rank = index + 1;
                  const meta = rankMeta[rank]; // ⛔️ || {} বাদ

                  // এখানে investor_id থেকে user বের করছি
                  const user = users?.find((u) => u.id === inv.investor_id);

                  // ধরি user.image বা user.img এ ছবি থাকে
                  const imgSrc = user?.photo
                    ? `https://app.supplylinkbd.com/${user.photo}`
                    : null;

                  const displayName =
                    user?.name || user?.full_name || inv.card_name;

                  return (
                    <div
                      key={inv.id}
                      className="p-4  bg-white  transition border border-gray-500 rounded-md "
                    >
                      <div className="flex items-center gap-4 relative">
                        <div>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={displayName}
                              className="h-32 w-32 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center  font-semibold border border-indigo-200">
                              <FaUserTie />
                              {getInitials(displayName)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base flex items-center gap-2 font-semibold text-slate-800">
                            <FaUserTie size={19} />
                            {inv?.card_name}
                          </span>
                          <span className="text-sm text-slate-800 flex items-center gap-2">
                            <HiCreditCard size={19} />
                            ইনভেস্টমেন্ট কার্ড নাম্বার:{" "}
                            <span className="font-semibold">{inv?.id}</span>
                          </span>
                          <div className="flex items-center gap-2 text-sm text-slate-800 mt-1">
                            <BiSolidCategory size={19} />
                            <span className="">
                              পেমেন্ট টাইপ:{" "}
                              <span className="font-semibold ml-1">
                                {paymentTypeBn(inv.payment_type)}
                              </span>
                            </span>
                          </div>
                          <span className=" flex items-center gap-2 text-sm text-slate-800 mt-1">
                            <HiDocumentCurrencyBangladeshi size={19} />{" "}
                            বিনিয়োগ:{" "}
                            <span className="text-base font-semibold text-slate-900">
                              ৳{formatCurrency(inv.investment_amount)}
                            </span>
                          </span>
                        </div>
                        <div className=" absolute right-2">
                          {meta ? (
                            <span className="">
                              <img
                                className="w-20 h-auto"
                                src={meta?.image}
                                alt=""
                              />
                            </span>
                          ) : (
                            <span className="text-lg font-bold text-slate-400">
                              #{rank}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* small */}
            <div className="md:hidden z-10">
              <div className="divide-y divide-slate-100">
                {sortedTop5.map((inv, index) => {
                  const rank = index + 1;
                  const meta = rankMeta[rank];

                  // এখানে investor_id থেকে user বের করছি
                  const user = users?.find((u) => u.id === inv.investor_id);

                  // ধরি user.image বা user.img এ ছবি থাকে
                  const imgSrc = user?.photo
                    ? `https://app.supplylinkbd.com/${user.photo}`
                    : null;

                  const displayName =
                    user?.name || user?.full_name || inv.card_name;

                  return (
                    <div
                      key={inv.id}
                      className="px-4 md:px-6 py-4 md:py-3 flex flex-col md:grid md:grid-cols-12 gap-3 items-center bg-white hover:bg-slate-50 transition shadow-xl"
                    >
                      {/* Profile */}
                      <div className="flex items-center gap-5 w-full relative">
                        <div>
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={displayName}
                              className="h-28 w-28 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold border border-indigo-200">
                              {getInitials(displayName)}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col ">
                          <span className="text-base flex items-center gap-2 font-semibold text-slate-800">
                            <FaUserTie size={19} /> {inv?.card_name}
                          </span>
                          <span className="text-xs text-slate-800 flex items-center gap-2">
                            <HiCreditCard size={19} />
                            ইনভেস্টমেন্ট কার্ড নাম্বার:
                            <span className="font-bold">{inv?.id}</span>
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-800 mt-1">
                            <BiSolidCategory size={19} />
                            <span className="">
                              পেমেন্ট টাইপ:{" "}
                              <span className="font-semibold ml-1">
                                {paymentTypeBn(inv.payment_type)}
                              </span>
                            </span>
                          </div>
                          <span className=" flex items-center gap-2 text-xs text-slate-800 mt-1">
                            <HiDocumentCurrencyBangladeshi size={19} />{" "}
                            বিনিয়োগ:{" "}
                            <span className="text-base font-semibold text-slate-900">
                              ৳{formatCurrency(inv.investment_amount)}
                            </span>
                          </span>
                        </div>
                        <div className="absolute right-2.5 ">
                          {meta ? (
                            <span className=" ">
                              <img
                                className="w-6 h-auto"
                                src={meta?.image}
                                alt=""
                              />
                            </span>
                          ) : (
                            <span className="text-[40px]  font-bold text-slate-400">
                              #{rank}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer small note */}
            <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
              <span>ডাটা সোর্স: ইনভেস্টমেন্ট কার্ডসমূহ</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeReport;
