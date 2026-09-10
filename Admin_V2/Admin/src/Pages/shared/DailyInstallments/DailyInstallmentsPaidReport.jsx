import React, { useMemo, useState } from 'react'
import { useAuth } from '../../../Provider/AuthProvider';
import useUsers from '../../../utils/Hooks/useUsers';
import useCustomerInstallmentPayments from '../../../utils/Hooks/Customers/useCustomerInstallmentPayments';
import useCustomerInstallmentCards from '../../../utils/Hooks/useCustomerInstallmentCards';
import Loader from '../../../components/Loader/Loader';
import BackButton from '../../../components/BackButton/BackButton';
import { MONTHS } from '../../../../public/month';
/* 🔁 yyyy-mm-dd → yy-mm-dd */
const toYYMMDD = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y.slice(2)}-${m}-${d}`;
};
const getMonthNameFromYYMMDD = (dateStr) => {
  if (!dateStr) return "";

  const parts = dateStr.split("-");
  if (parts.length < 2) return "";

  const monthNumber = Number(parts[1]); // MM
  const month = MONTHS.find((m) => m.value === monthNumber);

  return month?.label || "";
};
const DailyInstallmentsPaidReport = () => {
  const { user, logout } = useAuth();
const userRoles = Array.isArray(user?.role) ? user.role : [user?.role];

  const isDeveloper = userRoles.includes("developer");
  const { users, isUsersLoading } = useUsers();
  const {
    isCustomerInstallmentsPaymentsLoading,
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
  } = useCustomerInstallmentPayments();

  const {
    isCustomerInstallmentsCardsLoading,
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
  } = useCustomerInstallmentCards();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  /* 🧠 users map (id → name) */
  const usersMap = useMemo(() => {
    return (
      users?.reduce((acc, u) => {
        acc[u.id] = u.name;
        return acc;
      }, {}) || {}
    );
  }, [users]);
  const cardsById = useMemo(() => {
    return (
      customerInstallmentCards?.reduce((acc, c) => {
        const cardId = Number(c.id);
        acc[cardId] = {
          card_id: cardId,
          card_number: c.card_number || "N/A",
          user_id: Number(c.user_id || 0),
           remarks: c.remarks || "",
        };
        return acc;
      }, {}) || {}
    );
  }, [customerInstallmentCards]);
const filteredData = useMemo(() => {
  if (!customerInstallmentPayments?.length) return [];

  return customerInstallmentPayments
    .filter((p) => {
  if ((p.paid_date || "").slice(0, 10) !== date) return false;

  const card = cardsById[Number(p.card_id || 0)];
  const remarks = (card?.remarks || "").trim().toLowerCase();

  return remarks === "daily";
})
    .map((p) => {
      const cardId = Number(p.card_id || 0);
      const card = cardsById[cardId];

      const customerId = Number(
        card?.user_id || p.user_id || p.customer_id || p.investor_id || 0
      );

      const collected_by = p.collected_by;
      const collectedByName = usersMap[collected_by] || "Unknown Staff";

      const dueDate = p.due_date || "";
      const monthName = getMonthNameFromYYMMDD(dueDate);

      return {
        id: p.id,
        paid_date: (p.paid_date || "").slice(0, 10),
        customerId,
        customerName: usersMap[customerId] || "Unknown",
        collectedByName,
        cardId,
        cardNumber: card?.card_number || "N/A",
        dueDate,
        monthName,
        amount: Number(p.due_amount || 0),
        installmentNo: p.tag,
      };
    })
    .sort((a, b) => a.customerId - b.customerId);
}, [
  customerInstallmentPayments,
  customerInstallmentCards,
  date,
  cardsById,
  usersMap,
]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }, [filteredData]);

  if (
    isUsersLoading ||
    isCustomerInstallmentsPaymentsLoading ||
    isCustomerInstallmentsCardsLoading
  ) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <main className="text-slate-200 p-6">
      <BackButton />
      {/* Header */}
      <header className="flex flex-col py-5 md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            দৈনিক কিস্তি সংগ্রহের রিপোর্ট
          </h1>
          <p className="text-sm text-slate-400">তারিখ: {toYYMMDD(date)}</p>
        </div>

        {/* Date Filter */}
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none date-fix"
          />

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm"
          >
            প্রিন্ট
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">গ্রাহকের নাম (ID)</th>
              <th className="px-4 py-3 text-left">কার্ড নং</th>
              <th className="px-4 py-3 text-left">মাসের নাম</th>
              <th className="px-4 py-3 text-left">কিস্তি</th>
              <th className="px-4 py-3 text-left">টাকা (৳)</th>
              {isDeveloper && (
                <th className="px-4 py-3 text-left">আদায়</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-slate-400">
                  এই তারিখে কোন ডাটা নেই
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {row.customerName} ({row.customerId})
                  </td>
                  <td className="px-4 py-3">{row.cardNumber} </td>
                  <td className="px-4 py-3 text-slate-300">{row.monthName}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {row.installmentNo}
                  </td>

                  <td className="px-4 py-3 font-semibold text-emerald-400">
                    {row.amount.toFixed(2)}
                  </td>
                  {isDeveloper && (
                 <td className="px-4 py-3 font-semibold text-emerald-400">
                    {row.collectedByName}
                  </td>
              )}
                  
                </tr>
              ))
            )}
          </tbody>

          {/* Footer total */}
          {filteredData.length > 0 && (
            <tfoot className="bg-slate-700">
              <tr>
                <td colSpan="5" className="px-4 py-3 text-right font-semibold">
                  মোট
                </td>
                <td className="px-4 py-3 font-bold text-emerald-400">
                  {totalAmount.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </main>
  )
}

export default DailyInstallmentsPaidReport