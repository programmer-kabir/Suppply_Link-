import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useUsers from "../../../utils/Hooks/useUsers";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";
import { MONTHS } from "../../../../public/month";
import Pagination from "../../../components/Pagination";

const LS_KEY = "StaffInstallmentOverviewFilters_v1";

const safeInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const StaffInstallmentOverview = () => {
  /* ---------------- LOCAL STORAGE INIT ---------------- */
  const today = new Date();

  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  /* ---------------- STATE ---------------- */
  const [month, setMonth] = useState(() =>
    saved?.month
      ? safeInt(saved.month, today.getMonth() + 1)
      : today.getMonth() + 1,
  );
  const [year, setYear] = useState(() =>
    saved?.year
      ? safeInt(saved.year, today.getFullYear())
      : today.getFullYear(),
  );
  const [statusFilter, setStatusFilter] = useState(
    () => saved?.statusFilter || "All",
  );
  const [search, setSearch] = useState(() => saved?.search || "");
  const [selectedStaffId, setSelectedStaffId] = useState(
    () => saved?.selectedStaffId || "All",
  );

  /* ---------------- DATA ---------------- */
  const { users, isUsersLoading, isUsersError } = useUsers();
  const {
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
    isCustomerInstallmentsPaymentsLoading,
  } = useCustomerInstallmentPayments();
  const {
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
    isCustomerInstallmentsCardsLoading,
  } = useCustomerInstallmentCards();

  /* ---------------- CUSTOMERS ---------------- */
  const customers = users || [];

  const officialStaff = useMemo(() => {
    const allowedRoles = ["manager", "staff", "developer"];

    return (users || []).filter((u) => {
      if (Array.isArray(u.roles)) {
        return u.roles.some((r) =>
          allowedRoles.includes(String(r).toLowerCase()),
        );
      }
      const role =
        u.role_name ?? u.role ?? u.user_role ?? u.userType ?? u.type ?? "";
      return allowedRoles.includes(String(role).toLowerCase());
    });
  }, [users]);

  /* ---------------- YEARS (SAFE) ---------------- */
  const years = useMemo(() => {
    if (!customerInstallmentPayments?.length) return [];

    const validYears = customerInstallmentPayments
      .map((p) => {
        if (!p.due_date) return null;
        const d = new Date(p.due_date);
        if (isNaN(d.getTime())) return null;
        return d.getFullYear();
      })
      .filter((y) => Number.isInteger(y));

    if (!validYears.length) return [];

    const minYear = Math.min(...validYears);
    const maxYear = Math.max(...validYears);

    const result = [];
    for (let y = minYear; y <= maxYear; y++) result.push(y);
    return result;
  }, [customerInstallmentPayments]);

  /* ---------------- CLAMP YEAR/MONTH (IF OUT OF RANGE) ---------------- */
  useEffect(() => {
    // month clamp
    if (month < 1) setMonth(1);
    else if (month > 12) setMonth(12);

    // year clamp (if years list available)
    if (years.length) {
      const minY = years[0];
      const maxY = years[years.length - 1];
      if (year < minY) setYear(minY);
      else if (year > maxY) setYear(maxY);
    }
  }, [month, year, years]);

  /* ---------------- SAVE FILTERS TO LOCAL STORAGE ---------------- */
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          month,
          year,
          statusFilter,
          search,
          selectedStaffId,
        }),
      );
    } catch {
      // ignore storage errors
    }
  }, [month, year, statusFilter, search, selectedStaffId]);

  /* ---------------- CARD SERIAL (NUMERIC SORT) ---------------- */
  const cardSerialMap = useMemo(() => {
    const map = {};
    let serial = 1;

    const sortedCards = [...(customerInstallmentCards || [])].sort(
      (a, b) => Number(a.card_number) - Number(b.card_number),
    );

    sortedCards.forEach((card) => {
      if (!map[card.card_number]) {
        map[card.card_number] = serial;
        serial++;
      }
    });

    return map;
  }, [customerInstallmentCards]);

  /* ---------------- REPORT DATA ---------------- */
  const reportData = useMemo(() => {
    const rows = [];

    (customerInstallmentPayments || []).forEach((payment) => {
      if (!payment.due_date) return;

      const dueDate = new Date(payment.due_date);
      if (isNaN(dueDate.getTime())) return;

      const isSameMonth =
        dueDate.getFullYear() === year && dueDate.getMonth() + 1 === month;

      if (!isSameMonth) return;

      const card = (customerInstallmentCards || []).find(
        (c) =>
          String(c.card_number) === String(payment.card_id) ||
          String(c.id) === String(payment.card_id),
      );

      const customer = customers.find((u) => u.id === card?.user_id);

      const isPaid = payment.status === "Paid" || payment.paid_date;

      rows.push({
        cardSerial: card ? cardSerialMap[card.card_number] : "-",
        cardNo: card?.card_number || payment.card_id || "-",
        customerName: customer?.name || "Unknown",
        phone: customer?.mobile || "-",
        image: customer?.photo || "-",
        userId: customer?.id || "-",
        dueAmount: Number(payment.due_amount || 0),
        principal: Number(payment.principal_amount || 0),
        installmentNo: payment?.tag,
        profit: Number(payment.profit_amount || 0),
        dueDate: payment.due_date,
        method: payment.payment_method || "-",
        status: isPaid ? "Paid" : "Unpaid",
        recipt: payment?.receipt_number,
        refStaffId: card?.reference_user_id
          ? String(card.reference_user_id)
          : "Unknown",
      });
    });

    rows.sort((a, b) => {
      if (a.cardSerial === "-" || b.cardSerial === "-") return 0;
      return a.cardSerial - b.cardSerial;
    });

    return rows;
  }, [
    customers,
    customerInstallmentCards,
    customerInstallmentPayments,
    cardSerialMap,
    month,
    year,
  ]);

  /* ---------------- FILTERED DATA ---------------- */
  const filteredReportData = useMemo(() => {
    let data = reportData;

    // ✅ staff filter
    if (selectedStaffId !== "All") {
      data = data.filter(
        (r) => String(r.refStaffId) === String(selectedStaffId),
      );
    }

    // ✅ status filter
    if (statusFilter !== "All") {
      data = data.filter((r) => r.status === statusFilter);
    }

    // ✅ search
    const q = search.trim().toLowerCase();
    if (q) {
      data = data.filter((r) => {
        const name = String(r.customerName || "").toLowerCase();
        const cardSerial = String(r.cardSerial ?? "").toLowerCase();
        const cardNo = String(r.cardNo ?? "").toLowerCase();
        const userId = String(r.userId ?? "").toLowerCase();

        return (
          name.includes(q) ||
          cardSerial.includes(q) ||
          cardNo.includes(q) ||
          userId.includes(q)
        );
      });
    }

    return data;
  }, [reportData, statusFilter, search, selectedStaffId]);

  /* ---------------- SUMMARY ---------------- */
  const paid = filteredReportData.filter((r) => r.status === "Paid");
  const unpaid = filteredReportData.filter((r) => r.status === "Unpaid");

  const paidAmount = paid.reduce((s, r) => s + r.dueAmount, 0);
  const unpaidAmount = unpaid.reduce((s, r) => s + r.dueAmount, 0);

  /* ---------------- PAGINATION ---------------- */
  const PAGE_SIZE = 25;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [month, year, statusFilter, search, selectedStaffId]);

  const totalPages = Math.ceil(filteredReportData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredReportData.slice(start, end);
  }, [filteredReportData, currentPage]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  /* ---------------- LOAD/ERROR ---------------- */
  const isLoading =
    isUsersLoading ||
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading;

  const isError =
    isCustomerInstallmentsPaymentsError ||
    isCustomerInstallmentsCardsError ||
    isUsersError;

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex items-center justify-center">
        <NoDataFound />
      </div>
    );

  /* ---------------- UI ---------------- */
  return (
    <main>
      <h1 className="text-2xl font-bold text-center mb-6">
        মাসিক কিস্তি আদায় রিপোর্ট
      </h1>

      {/* SUMMARY */}
      <div className="bg-slate-800 md:p-4 p-2 rounded mb-6">
        <h2 className="font-semibold mb-2">
          📊 {MONTHS.find((m) => m.value === month)?.label} {year}{" "}
          {statusFilter !== "All" ? `(${statusFilter})` : ""}
          {selectedStaffId !== "All" ? ` • Staff: ${selectedStaffId}` : ""}
        </h2>
        <p>
          Paid: {paid.length} | ৳ {paidAmount}
        </p>
        <p>
          Unpaid: {unpaid.length} | ৳ {unpaidAmount}
        </p>
        <p className="text-slate-300 mt-2">
          Total Rows: {filteredReportData.length}
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 justify-between mb-6 flex-wrap">
        <div className="mb-4 flex justify-center">
          <div className="w-full md:w-[420px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name / card id / serial / userId..."
              className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded outline-none
                 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {search.trim() ? (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear search
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          {/* Staff Filter */}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
          >
            <option value="All">All Staff</option>
            {officialStaff.map((staff) => (
              <option key={staff?.id} value={String(staff?.id)}>
                {staff?.name} (ID: {staff?.id})
              </option>
            ))}
          </select>

          {/* Optional: Clear all filters */}
          <button
            onClick={() => {
              setMonth(today.getMonth() + 1);
              setYear(today.getFullYear());
              setStatusFilter("All");
              setSelectedStaffId("All");
              setSearch("");
              // also clear localStorage
              try {
                localStorage.removeItem(LS_KEY);
              } catch {}
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm"
            title="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                সিরিয়াল
              </th>
              <th className="px-4 py-3 text-left">ছবি</th>
              <th className="px-4 py-3 text-left">কার্ড নং</th>
              <th className="px-4 py-3 text-left">গ্রাহক</th>
              <th className="px-4 py-3 text-left">ফোন</th>
              <th className="px-4 py-3 text-left">কিস্তি</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                মূল টাকা (৳)
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                লাভ (৳)
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                Due Date
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                পেমেন্ট মেথড
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                রসিদ/TnxID
              </th>
              <th className="px-4 py-3 text-left">স্ট্যাটাস</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-6 text-slate-400">
                  এই তারিখে কোন ডাটা নেই
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={`${row.cardNo}-${index}`}
                  className="border-b border-slate-700 hover:bg-slate-700/50"
                >
                  <td className="px-4 hidden md:table-cell">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>

                  <td className="px-4 py-2">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={`https://management.supplylinkbd.com/${row?.image}`}
                      alt=""
                    />
                  </td>

                  <td
                    title={row.cardNo}
                    className="text-blue-400 font-semibold px-4"
                  >
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      to={`/customer/create_installment_chart?cardId=${row.cardSerial}`}
                    >
                      {row.cardSerial}
                    </Link>
                  </td>

                  <td className="px-4">
                    {row.userId !== "-" ? (
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        to={`/customers/all_customer/customer_details?userId=${row.userId}`}
                      >
                        {row.customerName}{" "}
                        <span className="text-blue-400">({row.userId})</span>
                      </Link>
                    ) : (
                      `${row.customerName} (${row.userId})`
                    )}
                  </td>

                  <td className="px-4 font-semibold text-emerald-400">
                    {row.phone !== "-" ? (
                      <a
                        href={`tel:${String(row.phone).replace(/\s+/g, "")}`}
                        className="hover:underline"
                        title="Call"
                      >
                        {row.phone}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 capitalize">
                    {row.installmentNo} - <br /> {row?.dueAmount} (৳)
                  </td>

                  <td className="px-4 capitalize hidden md:table-cell">
                    {row.principal}
                  </td>
                  <td className="px-4 capitalize hidden md:table-cell">
                    {row.profit}
                  </td>
                  <td className="px-4 capitalize hidden md:table-cell">
                    {row.dueDate}
                  </td>
                  <td className="px-4 capitalize hidden md:table-cell">
                    {row.method}
                  </td>

                  <td
                    className="px-4 max-w-[140px] break-words truncate cursor-pointer hidden md:table-cell"
                    title={row.recipt}
                  >
                    {row.recipt || "-"}
                  </td>

                  <td className="px-4 capitalize">{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        reportData={filteredReportData}
        currentPage={currentPage}
        totalPages={totalPages}
        PAGE_SIZE={PAGE_SIZE}
        pageNumbers={pageNumbers}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
};

export default StaffInstallmentOverview;
