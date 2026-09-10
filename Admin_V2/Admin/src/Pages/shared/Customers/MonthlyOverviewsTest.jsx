import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useUsers from "../../../utils/Hooks/useUsers";
import useCustomerInstallmentPayments from "../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import useCustomerInstallmentCards from "../../../utils/Hooks/useCustomerInstallmentCards";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoData/NoDataFound";
import Pagination from "../../../components/Pagination";
import { MONTHS } from "../../../../public/month";

const LS_KEY = "SLStaffInstallmentOverviewFilters_v1";

const safeInt = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

const MonthlyOverviewsTest = () => {
    const today = new Date();
    const [reportType, setReportType] = useState("due");
    const [paymentType, setPaymentType] = useState("all");
    const [collectionType, setCollectionType] = useState("all");
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
        refetch: isInstallmentPaymentRefetch
    } = useCustomerInstallmentPayments();
    const {
        customerInstallmentCards,
        isCustomerInstallmentsCardsError,
        isCustomerInstallmentsCardsLoading,
        refetch: isCardRefetch
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
    // const validCards = useMemo(() => {
    //   return (customerInstallmentCards || []).filter(
    //     (c) => String(c?.remarks).toLowerCase() !== "daily"
    //   );
    // }, [customerInstallmentCards]);



    /* ---------------- DATE HELPERS ---------------- */

    // Date থেকে YYYY-MM format বানাবে
    // Example: 2026-07
    const getMonthKey = (dateValue) => {
        if (!dateValue) return null;

        const d = new Date(dateValue);

        if (isNaN(d.getTime())) return null;

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };


    // Date থেকে readable Month + Year বানাবে
    // Example: July 2026
    const getMonthLabel = (dateValue) => {
        if (!dateValue) return "-";

        const d = new Date(dateValue);

        if (isNaN(d.getTime())) return "-";

        const monthName =
            MONTHS.find((m) => m.value === d.getMonth() + 1)?.label || "";

        return `${monthName} ${d.getFullYear()}`;
    };


    // বর্তমানে filter করা selected month
    // Example: July 2026 => 2026-07
    const selectedMonthKey = `${year}-${String(month).padStart(2, "0")}`;


    /* =========================================================
       ALL PAYMENT DATA
       ---------------------------------------------------------
       এখানে সব মাসের installment রাখা হবে।
    
       কারণ:
       July select করলে শুধু July due দেখলেই হবে না।
    
       আমাদের জানতে হবে:
       - June due → July paid = Previous Due Collection
       - July due → July paid = Current Collection
       - August due → July paid = Advance Collection
    ========================================================= */

    const allPaymentRows = useMemo(() => {
        const rows = [];

        (customerInstallmentPayments || []).forEach((payment) => {

            // Due date না থাকলে skip
            if (!payment?.due_date) return;


            /* ---------------- VALIDATE DUE DATE ---------------- */

            const dueDate = new Date(payment.due_date);

            if (isNaN(dueDate.getTime())) return;


            /* ---------------- FIND CARD ---------------- */

            const card = (customerInstallmentCards || []).find(
                (c) =>
                    String(c?.card_number) === String(payment?.card_id) ||
                    String(c?.id) === String(payment?.card_id)
            );

            if (!card) return;


            /* ---------------- FIND CUSTOMER ---------------- */

            const customer = (customers || []).find(
                (u) => String(u?.id) === String(card?.user_id)
            );

            if (!customer) return;


            /* ---------------- PAID STATUS ---------------- */

            const isPaid =
                String(payment?.status || "").toLowerCase() === "paid" ||
                Boolean(payment?.paid_date);


            /* ---------------- MONTH KEYS ---------------- */

            const dueMonthKey = getMonthKey(payment?.due_date);

            const paidMonthKey = getMonthKey(payment?.paid_date);


            /* ---------------- PAYMENT TIMING ---------------- */

            let paymentTiming = "Unpaid";

            let paymentTimingLabel = "Unpaid";


            if (isPaid && paidMonthKey) {

                // Example:
                // Due July
                // Paid July
                if (paidMonthKey === dueMonthKey) {

                    paymentTiming = "Current";

                    paymentTimingLabel = "On Time";

                }

                // Example:
                // Due June
                // Paid July
                else if (paidMonthKey > dueMonthKey) {

                    paymentTiming = "Late";

                    paymentTimingLabel = `Paid Late • ${getMonthLabel(
                        payment?.paid_date
                    )}`;

                }

                // Example:
                // Due August
                // Paid July
                else if (paidMonthKey < dueMonthKey) {

                    paymentTiming = "Prepaid";

                    paymentTimingLabel = `Prepaid • ${getMonthLabel(
                        payment?.paid_date
                    )}`;

                }

            }


            /* ---------------- PUSH ROW ---------------- */

            rows.push({

                // Payment ID
                paymentId: payment?.id,

                // Card
                cardSerial: cardSerialMap[card?.card_number] || "-",

                cardNo:
                    card?.card_number ||
                    payment?.card_id ||
                    "-",


                // Customer
                customerName:
                    customer?.name ||
                    "Unknown",

                phone:
                    customer?.mobile ||
                    "-",

                image:
                    customer?.photo ||
                    "-",

                userId:
                    customer?.id ||
                    "-",


                // Installment amounts
                dueAmount: Number(
                    payment?.due_amount || 0
                ),

                principal: Number(
                    payment?.principal_amount || 0
                ),

                profit: Number(
                    payment?.profit_amount || 0
                ),


                // Installment
                installmentNo:
                    payment?.tag || "-",

                installmentNumber: Number(payment?.installment_no ?? -1),



                // Dates
                dueDate:
                    payment?.due_date,

                paidDate:
                    payment?.paid_date || null,


                // Month keys
                dueMonthKey,

                paidMonthKey,


                // Payment
                method:
                    payment?.payment_method ||
                    "-",

                status:
                    isPaid
                        ? "Paid"
                        : "Unpaid",


                // NEW
                paymentTiming,

                paymentTimingLabel,


                // Receipt
                recipt:
                    payment?.receipt_number ||
                    null,


                // Reference Staff
                refStaffId:
                    card?.reference_user_id
                        ? String(card.reference_user_id)
                        : "Unknown",

            });

        });


        return rows;

    }, [
        customers,
        customerInstallmentCards,
        customerInstallmentPayments,
        cardSerialMap,
    ]);

    const reportData = useMemo(() => {
        let rows = [...allPaymentRows];
        if (paymentType === "installment") {
            rows = rows.filter(
                (row) =>
                    Number(row?.installmentNumber) > 0
            );
        }
        else if (paymentType === "down_payment") {
            rows = rows.filter(
                (row) =>
                    Number(row?.installmentNumber) === 0
            );
        }
        if (reportType === "due") {
            rows = rows.filter(
                (row) =>
                    row?.dueMonthKey === selectedMonthKey
            );
        }
        else if (reportType === "paid") {
            rows = rows.filter(
                (row) =>
                    row?.status === "Paid" &&
                    row?.paidMonthKey === selectedMonthKey
            );
        }
        else if (reportType === "previous_due") {
            rows = rows.filter(
                (row) =>
                    row?.status === "Unpaid" &&
                    row?.dueMonthKey &&
                    row?.dueMonthKey < selectedMonthKey
            );
        }
        if (reportType === "previous_due") {
            rows.sort((a, b) => {
                const dateA = new Date(a?.dueDate || 0);
                const dateB = new Date(b?.dueDate || 0);
                return dateA - dateB;
            });
        }
        else {
            rows.sort((a, b) => {
                if (
                    a?.cardSerial === "-" &&
                    b?.cardSerial === "-"
                ) {
                    return 0;
                }
                if (a?.cardSerial === "-") return 1;
                if (b?.cardSerial === "-") return -1;
                return (
                    Number(a?.cardSerial) -
                    Number(b?.cardSerial)
                );
            });
        }
        return rows;
    }, [
        allPaymentRows,
        selectedMonthKey,
        reportType,
        paymentType,

    ]);



//     const filteredReportData = useMemo(() => {

//         let data = [...reportData];
// // ================= COLLECTION TYPE FILTER =================
// if (collectionType === "old_due") {
//     data = data.filter(
//         (row) =>
//             row?.status === "Paid" &&
//             row?.paidMonthKey === selectedMonthKey &&
//             row?.dueMonthKey &&
//             row?.dueMonthKey < selectedMonthKey
//     );
// }

// else if (collectionType === "advance") {
//     data = data.filter(
//         (row) =>
//             row?.status === "Paid" &&
//             row?.paidMonthKey === selectedMonthKey &&
//             row?.dueMonthKey &&
//             row?.dueMonthKey > selectedMonthKey
//     );
// }
//         if (selectedStaffId !== "All") {

//             data = data.filter(
//                 (row) =>
//                     String(row?.refStaffId) ===
//                     String(selectedStaffId)
//             );

//         }

//         if (statusFilter !== "All") {

//             data = data.filter(
//                 (row) =>
//                     String(row?.status).toLowerCase() ===
//                     String(statusFilter).toLowerCase()
//             );

//         }




//         const q = String(search || "")
//             .trim()
//             .toLowerCase();


//         if (q) {

//             data = data.filter((row) => {

//                 const customerName = String(
//                     row?.customerName || ""
//                 ).toLowerCase();


//                 const cardSerial = String(
//                     row?.cardSerial ?? ""
//                 ).toLowerCase();


//                 const cardNo = String(
//                     row?.cardNo ?? ""
//                 ).toLowerCase();


//                 const userId = String(
//                     row?.userId ?? ""
//                 ).toLowerCase();


//                 const phone = String(
//                     row?.phone ?? ""
//                 ).toLowerCase();


//                 const receipt = String(
//                     row?.recipt ?? ""
//                 ).toLowerCase();


//                 return (

//                     customerName.includes(q) ||

//                     cardSerial.includes(q) ||

//                     cardNo.includes(q) ||

//                     userId.includes(q) ||

//                     phone.includes(q) ||

//                     receipt.includes(q)

//                 );

//             });

//         }


//         return data;

//     }, [
//         reportData,
//         statusFilter,
//         search,
//         selectedStaffId,
//             collectionType,
//     selectedMonthKey,
//     ]);

const filteredReportData = useMemo(() => {
    let data = [];

    // ==========================================
    // COLLECTION TYPE
    // Old Due / Advance অবশ্যই ALL payment data
    // থেকে বের করতে হবে
    // ==========================================
if (collectionType === "current") {
    data = [...allPaymentRows].filter(
        (row) =>
            row?.status === "Paid" &&
            row?.paidMonthKey === selectedMonthKey &&
            row?.dueMonthKey === selectedMonthKey
    );
}

else if (collectionType === "old_due") {
    data = [...allPaymentRows].filter(
        (row) =>
            row?.status === "Paid" &&
            row?.paidMonthKey === selectedMonthKey &&
            row?.dueMonthKey &&
            row?.dueMonthKey < selectedMonthKey
    );
}

else if (collectionType === "advance") {
    data = [...allPaymentRows].filter(
        (row) =>
            row?.status === "Paid" &&
            row?.paidMonthKey === selectedMonthKey &&
            row?.dueMonthKey &&
            row?.dueMonthKey > selectedMonthKey
    );
}

else {
    data = [...reportData];
}

    // ==========================================
    // PAYMENT TYPE
    // Old Due / Advance allPaymentRows থেকে আসায়
    // এখানে payment type apply করতে হবে
    // ==========================================

    if (collectionType !== "all") {

        if (paymentType === "installment") {
            data = data.filter(
                (row) => Number(row?.installmentNumber) > 0
            );
        }

        else if (paymentType === "down_payment") {
            data = data.filter(
                (row) => Number(row?.installmentNumber) === 0
            );
        }
    }


    // ==========================================
    // STAFF FILTER
    // ==========================================

    if (selectedStaffId !== "All") {
        data = data.filter(
            (row) =>
                String(row?.refStaffId) ===
                String(selectedStaffId)
        );
    }


    // ==========================================
    // STATUS FILTER
    // Old Due / Advance সবসময় Paid,
    // তাই normal report-এ status filter apply
    // ==========================================

    if (
        collectionType === "all" &&
        statusFilter !== "All"
    ) {
        data = data.filter(
            (row) =>
                String(row?.status).toLowerCase() ===
                String(statusFilter).toLowerCase()
        );
    }


    // ==========================================
    // SEARCH
    // ==========================================

    const q = String(search || "")
        .trim()
        .toLowerCase();

    if (q) {
        data = data.filter((row) => {

            const customerName = String(
                row?.customerName || ""
            ).toLowerCase();

            const cardSerial = String(
                row?.cardSerial ?? ""
            ).toLowerCase();

            const cardNo = String(
                row?.cardNo ?? ""
            ).toLowerCase();

            const userId = String(
                row?.userId ?? ""
            ).toLowerCase();

            const phone = String(
                row?.phone ?? ""
            ).toLowerCase();

            const receipt = String(
                row?.recipt ?? ""
            ).toLowerCase();

            return (
                customerName.includes(q) ||
                cardSerial.includes(q) ||
                cardNo.includes(q) ||
                userId.includes(q) ||
                phone.includes(q) ||
                receipt.includes(q)
            );
        });
    }


    // ==========================================
    // SORT
    // ==========================================

    data.sort((a, b) => {

        if (
            a?.cardSerial === "-" &&
            b?.cardSerial === "-"
        ) {
            return 0;
        }

        if (a?.cardSerial === "-") return 1;
        if (b?.cardSerial === "-") return -1;

        return (
            Number(a?.cardSerial) -
            Number(b?.cardSerial)
        );
    });


    return data;

}, [
    reportData,
    allPaymentRows,
    collectionType,
    selectedMonthKey,
    paymentType,
    selectedStaffId,
    statusFilter,
    search,
]);



    const staffFilteredAllPayments = useMemo(() => {

        let data = [...allPaymentRows];


        /* ==========================================
           INSTALLMENT / DOWN PAYMENT
        ========================================== */

        if (paymentType === "installment") {

            data = data.filter(
                (row) =>
                    Number(row?.installmentNumber) > 0
            );

        }

        if (paymentType === "down_payment") {

            data = data.filter(
                (row) =>
                    Number(row?.installmentNumber) === 0
            );

        }


        /* ==========================================
           STAFF FILTER
        ========================================== */

        if (selectedStaffId !== "All") {

            data = data.filter(
                (row) =>
                    String(row?.refStaffId) ===
                    String(selectedStaffId)
            );

        }


        return data;

    }, [
        allPaymentRows,
        selectedStaffId,
        paymentType, // এটা অবশ্যই লাগবে
    ]);

    const actualCollectedThisMonth = useMemo(() => {

        return staffFilteredAllPayments.filter(
            (row) =>
                row?.status === "Paid" &&
                row?.paidMonthKey === selectedMonthKey
        );

    }, [
        staffFilteredAllPayments,
        selectedMonthKey,
    ]);

    const currentDueCollected = useMemo(() => {

        return actualCollectedThisMonth.filter(
            (row) =>
                row?.dueMonthKey === selectedMonthKey
        );

    }, [
        actualCollectedThisMonth,
        selectedMonthKey,
    ]);

    const previousDueCollected = useMemo(() => {

        return actualCollectedThisMonth.filter(
            (row) =>
                row?.dueMonthKey &&
                row?.dueMonthKey < selectedMonthKey
        );

    }, [
        actualCollectedThisMonth,
        selectedMonthKey,
    ]);

    const advanceCollected = useMemo(() => {

        return actualCollectedThisMonth.filter(
            (row) =>
                row?.dueMonthKey &&
                row?.dueMonthKey > selectedMonthKey
        );

    }, [
        actualCollectedThisMonth,
        selectedMonthKey,
    ]);

    const paid = filteredReportData.filter(
        (row) =>
            row?.status === "Paid"
    );

    const unpaid = filteredReportData.filter(
        (row) =>
            row?.status === "Unpaid"
    );

    const paidAmount = paid.reduce(
        (sum, row) =>
            sum + Number(row?.dueAmount || 0),
        0
    );

    const unpaidAmount = unpaid.reduce(
        (sum, row) =>
            sum + Number(row?.dueAmount || 0),
        0
    );

    const expectedAmount = filteredReportData.reduce(
        (sum, row) =>
            sum + Number(row?.dueAmount || 0),
        0
    );

    const expectedCount =
        filteredReportData.length;


    const actualCollectedAmount =
        actualCollectedThisMonth.reduce(

            (sum, row) =>
                sum + Number(row?.dueAmount || 0),

            0

        );

    const currentDueCollectedAmount =
        currentDueCollected.reduce(

            (sum, row) =>
                sum + Number(row?.dueAmount || 0),

            0

        );

    const previousDueCollectedAmount =
        previousDueCollected.reduce(

            (sum, row) =>
                sum + Number(row?.dueAmount || 0),

            0

        );

    const advanceCollectedAmount =
        advanceCollected.reduce(

            (sum, row) =>
                sum + Number(row?.dueAmount || 0),

            0

        );

    const PAGE_SIZE = 30;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        month,
        year,
        statusFilter,
        search,
        selectedStaffId,
        reportType,
        paymentType,
            collectionType,
    ]);
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

            <div className="bg-slate-800 border border-slate-700 rounded-xl mb-5 overflow-hidden">

                {/* REPORT MONTH */}
                <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-[11px] md:text-xs text-slate-400">
                        Report Month
                    </p>

                    <div className="flex items-center justify-between gap-3 mt-1">
                        <p className="text-base md:text-lg font-bold">
                            🗓️ {MONTHS.find((m) => m.value === month)?.label} {year}
                        </p>

                        {selectedStaffId !== "All" && (
                            <span className="text-[10px] md:text-xs bg-slate-700 px-2 py-1 rounded">
                                Staff #{selectedStaffId}
                            </span>
                        )}
                    </div>
                </div>


                {/* ================= DUE SUMMARY ================= */}

                <div className="grid grid-cols-2 md:grid-cols-4">

                    {/* EXPECTED */}
                    <div className="p-3 md:p-4 border-r border-b md:border-b-0 border-slate-700">
                        <p className="text-[11px] md:text-xs text-slate-400">
                            Expected
                        </p>

                        <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-xl md:text-2xl font-bold">
                                {expectedCount}
                            </span>

                            <span className="text-[10px] text-slate-500">
                                installments
                            </span>
                        </div>

                        <p className="text-xs md:text-sm font-semibold mt-1">
                            ৳ {expectedAmount.toLocaleString()}
                        </p>
                    </div>


                    {/* DUE PAID */}
                    <div className="p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-700">
                        <p className="text-[11px] md:text-xs text-slate-400">
                            Due Paid
                        </p>

                        <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-xl md:text-2xl font-bold text-emerald-400">
                                {paid.length}
                            </span>

                            <span className="text-[10px] text-slate-500">
                                paid
                            </span>
                        </div>

                        <p className="text-xs md:text-sm font-semibold text-emerald-400 mt-1">
                            ৳ {paidAmount.toLocaleString()}
                        </p>
                    </div>


                    {/* UNPAID */}
                    <div className="p-3 md:p-4 border-r border-slate-700">
                        <p className="text-[11px] md:text-xs text-slate-400">
                            Unpaid
                        </p>

                        <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-xl md:text-2xl font-bold text-red-400">
                                {unpaid.length}
                            </span>

                            <span className="text-[10px] text-slate-500">
                                remaining
                            </span>
                        </div>

                        <p className="text-xs md:text-sm font-semibold text-red-400 mt-1">
                            ৳ {unpaidAmount.toLocaleString()}
                        </p>
                    </div>


                    {/* PROGRESS */}
                    <div className="p-3 md:p-4">
                        <p className="text-[11px] md:text-xs text-slate-400">
                            Due Progress
                        </p>

                        <p className="text-xl md:text-2xl font-bold text-blue-400 mt-1">
                            {expectedCount > 0
                                ? ((paid.length / expectedCount) * 100).toFixed(1)
                                : 0}
                            %
                        </p>

                        <p className="text-[10px] md:text-xs text-slate-500 mt-1">
                            {paid.length}/{expectedCount} paid
                        </p>
                    </div>

                </div>


                {/* ================= ACTUAL RECEIVED ================= */}

            {reportType !== "previous_due" && (
  <>
    {/* ================= ACTUAL RECEIVED ================= */}

    <div className="border-t border-slate-700">

      {/* TOTAL RECEIVED */}
      <div className="px-4 py-3 md:py-4 bg-emerald-500/5 flex items-center justify-between gap-4">

        <div>
          <p className="text-[11px] md:text-xs text-slate-400">
            Actual Received
          </p>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl md:text-2xl font-bold text-emerald-400">
              {actualCollectedThisMonth.length}
            </span>

            <span className="text-[10px] md:text-xs text-slate-500">
              payments
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-500">
            Total Received
          </p>

          <p className="text-lg md:text-xl font-bold text-emerald-400 mt-1">
            ৳ {actualCollectedAmount.toLocaleString()}
          </p>
        </div>

      </div>


      {/* ACTUAL BREAKDOWN */}

      <div className="border-t border-slate-700 p-3 md:p-4">

        <p className="text-[11px] md:text-xs text-slate-500 mb-2.5">
          Actual Collection Breakdown
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

          {/* CURRENT */}
          <div className="bg-slate-900/40 rounded-lg px-3 py-2.5">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-slate-300">
                {MONTHS.find((m) => m.value === month)?.label} Due Paid
              </span>
            </div>

            <div className="flex mt-2 items-center gap-2">
              <span className="font-bold text-sm">
                {currentDueCollected.length}
              </span>

              <span className="font-semibold text-xs md:text-sm text-emerald-400">
                ৳{currentDueCollectedAmount.toLocaleString()}
              </span>
            </div>

          </div>


          {/* OLD DUE */}
          <div className="bg-slate-900/40 rounded-lg px-3 py-2.5">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />

              <span className="text-xs text-slate-300">
                Old Due Collected
              </span>
            </div>

            <div className="flex mt-2 items-center gap-2">
              <span className="font-bold text-sm">
                {previousDueCollected.length}
              </span>

              <span className="font-semibold text-xs md:text-sm text-orange-400">
                ৳{previousDueCollectedAmount.toLocaleString()}
              </span>
            </div>

          </div>


          {/* ADVANCE */}
          <div className="bg-slate-900/40 rounded-lg px-3 py-2.5">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />

              <span className="text-xs text-slate-300">
                Advance Collected
              </span>
            </div>

            <div className="flex mt-2 items-center gap-2">
              <span className="font-bold text-sm">
                {advanceCollected.length}
              </span>

              <span className="font-semibold text-xs md:text-sm text-blue-400">
                ৳{advanceCollectedAmount.toLocaleString()}
              </span>
            </div>

          </div>

        </div>


        {/* TOTAL */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-700/70">

          <span className="text-xs text-slate-400">
            Total Actual Collection
          </span>

          <div className="flex items-center gap-2">

            <span className="text-xs text-slate-500">
              {actualCollectedThisMonth.length} payments
            </span>

            <span className="font-bold text-sm md:text-base text-emerald-400">
              ৳{actualCollectedAmount.toLocaleString()}
            </span>

          </div>

        </div>

      </div>

    </div>
  </>
)}

            </div>






            {/* FILTER */}
            {/* ================= RESPONSIVE FILTER BAR ================= */}

            <div className="mb-6 bg-slate-900/40 border border-slate-800 rounded-xl p-3 md:p-4">

                <div className="flex flex-col lg:flex-row lg:items-center gap-3">

                    {/* ================= SEARCH ================= */}

                    <div className="w-full lg:w-[320px] shrink-0">

                        <div className="relative">

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search customer / card / phone..."
                                className="
            w-full
            bg-slate-800
            border border-slate-700
            text-white
            text-sm
            px-3 py-2.5
            rounded-lg
            outline-none
            focus:border-blue-500
            focus:ring-1
            focus:ring-blue-500
          "
                            />

                            {/* SEARCH CLEAR */}

                            {search.trim() && (

                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-white
              text-lg
            "
                                    title="Clear search"
                                >
                                    ×
                                </button>

                            )}

                        </div>

                    </div>


                    {/* ================= FILTER GRID ================= */}

                    <div
                        className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:flex
        lg:items-center
        gap-2
        w-full
      "
                    >

                        {/* REPORT TYPE */}

                        <select
                            value={reportType}
                            onChange={(e) => {

                                const value = e.target.value;

                                setReportType(value);

                                if (value === "previous_due") {
                                    setStatusFilter("Unpaid");
                                } else {
                                    setStatusFilter("All");
                                }

                            }}
                            className="
          w-full
          lg:w-auto
          lg:min-w-[150px]
          bg-slate-800
          border border-slate-700
          text-white
          text-sm
          px-3 py-2.5
          rounded-lg
          outline-none
        "
                        >
                            <option value="due">
                                Due Collection
                            </option>

                            <option value="paid">
                                Paid Collection
                            </option>

                            <option value="previous_due">
                                Previous Due
                            </option>

                        </select>


                        {/* PAYMENT TYPE */}

                        <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            disabled={reportType === "previous_due"}
                            className={`
    w-full
    lg:w-auto
    lg:min-w-[145px]
    bg-slate-800
    border border-slate-700
    text-white
    text-sm
    px-3 py-2.5
    rounded-lg
    outline-none

    ${reportType === "previous_due"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
  `}
                        >
                            <option value="all">
                                All Payments
                            </option>

                            <option value="installment">
                                Installment
                            </option>

                            <option value="down_payment">
                                Down Payment
                            </option>
                        </select>

{/* COLLECTION TYPE */}

<select
    value={collectionType}
    onChange={(e) => setCollectionType(e.target.value)}
    className="
        w-full
        lg:w-auto
        lg:min-w-[145px]
        bg-slate-800
        border border-slate-700
        text-white
        text-sm
        px-3 py-2.5
        rounded-lg
        outline-none
    "
>
    <option value="all">
        All Collections
    </option>
<option value="current">
    Current
</option>
    <option value="old_due">
        Old Due
    </option>

    <option value="advance">
        Advance
    </option>
</select>

                        {/* MONTH */}

                        <select
                            value={month}
                            onChange={(e) =>
                                setMonth(Number(e.target.value))
                            }
                            className="
          w-full
          lg:w-auto
          lg:min-w-[110px]
          bg-slate-800
          border border-slate-700
          text-white
          text-sm
          px-3 py-2.5
          rounded-lg
          outline-none
        "
                        >

                            {MONTHS.map((m) => (

                                <option
                                    key={m.value}
                                    value={m.value}
                                >
                                    {m.label}
                                </option>

                            ))}

                        </select>


                        {/* YEAR */}

                        <select
                            value={year}
                            onChange={(e) =>
                                setYear(Number(e.target.value))
                            }
                            className="
          w-full
          lg:w-auto
          lg:min-w-[90px]
          bg-slate-800
          border border-slate-700
          text-white
          text-sm
          px-3 py-2.5
          rounded-lg
          outline-none
        "
                        >

                            {years.map((y) => (

                                <option
                                    key={y}
                                    value={y}
                                >
                                    {y}
                                </option>

                            ))}

                        </select>


                        {/* STATUS */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            disabled={reportType === "previous_due"}
                            className={`
          w-full
          lg:w-auto
          lg:min-w-[100px]
          bg-slate-800
          border border-slate-700
          text-white
          text-sm
          px-3 py-2.5
          rounded-lg
          outline-none

          ${reportType === "previous_due"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
        `}
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Paid">
                                Paid
                            </option>

                            <option value="Unpaid">
                                Unpaid
                            </option>

                        </select>


                        {/* STAFF */}

                        <select
                            value={selectedStaffId}
                            onChange={(e) =>
                                setSelectedStaffId(e.target.value)
                            }
                            className="
          w-full
          lg:w-auto
          lg:min-w-[180px]
          bg-slate-800
          border border-slate-700
          text-white
          text-sm
          px-3 py-2.5
          rounded-lg
          outline-none
        "
                        >

                            <option value="All">
                                All Staff
                            </option>

                            {officialStaff.map((staff) => (

                                <option
                                    key={staff?.id}
                                    value={String(staff?.id)}
                                >
                                    {staff?.name} (ID: {staff?.id})
                                </option>

                            ))}

                        </select>


                        {/* RESET */}

                        <button
                            type="button"
                            onClick={() => {

                                setMonth(today.getMonth() + 1);

                                setYear(today.getFullYear());

                                setStatusFilter("All");

                                setSelectedStaffId("All");

                                setSearch("");

                                setReportType("due");

                                setPaymentType("all");
setCollectionType("all");
                                try {
                                    localStorage.removeItem(LS_KEY);
                                } catch { }

                            }}
                            className="
          col-span-2
          sm:col-span-1
          w-full
          lg:w-auto
          bg-slate-700
          hover:bg-slate-600
          text-white
          text-sm
          font-medium
          px-4 py-2.5
          rounded-lg
          transition
        "
                        >
                            Reset
                        </button>

                    </div>

                </div>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-700 text-slate-300">
                        <tr>
                            <th className="px-4 py-3 text-left ">
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
                                Paid Date
                            </th>

                            <th className="px-4 py-3 text-left">
                                Payment Timing
                            </th>

                            <th className="px-4 py-3 text-left hidden md:table-cell">
                                পেমেন্ট মেথড
                            </th>

                            <th className="px-4 py-3 text-left hidden md:table-cell">
                                রসিদ/TnxID
                            </th>

                            <th className="px-4 py-3 text-left">
                                স্ট্যাটাস
                            </th>
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
                                    <td className="px-4 ">
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

                                        {row.installmentNo} -

                                        <br />

                                        <span className="font-semibold">
                                            ৳ {Number(row?.dueAmount || 0).toLocaleString()}
                                        </span>

                                    </td>


                                    {/* PRINCIPAL */}

                                    <td className="px-4 capitalize hidden md:table-cell">

                                        ৳ {Number(row.principal || 0).toLocaleString()}

                                    </td>


                                    {/* PROFIT */}

                                    <td className="px-4 capitalize hidden md:table-cell">

                                        ৳ {Number(row.profit || 0).toLocaleString()}

                                    </td>


                                    {/* DUE DATE */}

                                    <td className="px-4 hidden md:table-cell whitespace-nowrap">

                                        {row.dueDate || "-"}

                                    </td>


                                    {/* PAID DATE */}

                                    <td className="px-4 hidden md:table-cell whitespace-nowrap">

                                        {row.paidDate ? (

                                            <span className="text-emerald-400">
                                                {row.paidDate}
                                            </span>

                                        ) : (

                                            <span className="text-slate-500">
                                                -
                                            </span>

                                        )}

                                    </td>


                                    {/* PAYMENT TIMING */}

                                    <td className="px-4 py-3 min-w-[150px]">

                                        {/* CURRENT / SAME MONTH */}

                                        {row.paymentTiming === "Current" && (

                                            <div>

                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">

                                                    ✓ Current

                                                </span>

                                                <p className="text-[11px] text-slate-500 mt-1">
                                                    Paid in due month
                                                </p>

                                            </div>

                                        )}


                                        {/* LATE */}

                                        {row.paymentTiming === "Late" && (

                                            <div>

                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-semibold">

                                                    ⚠ Paid Late

                                                </span>

                                                <p className="text-[11px] text-slate-400 mt-1">

                                                    Paid in{" "}

                                                    <span className="text-orange-400">
                                                        {getMonthLabel(row.paidDate)}
                                                    </span>

                                                </p>

                                            </div>

                                        )}


                                        {/* PREPAID */}

                                        {row.paymentTiming === "Prepaid" && (

                                            <div>

                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold">

                                                    ↑ Prepaid

                                                </span>

                                                <p className="text-[11px] text-slate-400 mt-1">

                                                    Paid in{" "}

                                                    <span className="text-blue-400">
                                                        {getMonthLabel(row.paidDate)}
                                                    </span>

                                                </p>

                                            </div>

                                        )}


                                        {/* UNPAID */}

                                        {row.paymentTiming === "Unpaid" && (

                                            <div>

                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-semibold">

                                                    ● Unpaid

                                                </span>

                                                <p className="text-[11px] text-slate-500 mt-1">
                                                    Not collected yet
                                                </p>

                                            </div>

                                        )}

                                    </td>


                                    {/* PAYMENT METHOD */}

                                    <td className="px-4 capitalize hidden md:table-cell">

                                        {row.method}

                                    </td>


                                    {/* RECEIPT */}

                                    <td
                                        className="px-4 max-w-[140px] break-words truncate cursor-pointer hidden md:table-cell"
                                        title={row.recipt || ""}
                                    >

                                        {row.recipt || "-"}

                                    </td>


                                    {/* STATUS */}

                                    <td className="px-4 capitalize">

                                        {row.status === "Paid" ? (

                                            <span className="inline-flex px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">

                                                Paid

                                            </span>

                                        ) : (

                                            <span className="inline-flex px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-semibold">

                                                Unpaid

                                            </span>

                                        )}

                                    </td>
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

export default MonthlyOverviewsTest;
