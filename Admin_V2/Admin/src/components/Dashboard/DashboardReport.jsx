import React from "react";
import useDashboardData from "../../utils/Hooks/dashboard/useDashboardData";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { MONTHS } from "../../../public/month";
import ReportTable from "../ReportTable/ReportTable";

const DashboardReport = () => {
  const {
    customerInstallmentCards,
    customerInstallmentPayments,
    investInstallments,
    companyExpenses,
    approvedCashReports,
    cashReports,
    dailyInstallments,
    isLoading,
    isError,
    investorWithdrawApplications,
    users,
    roleStats,
    openingCash,
  } = useDashboardData();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  const allCash = approvedCashReports || cashReports || [];

  const monthlyInstallments = customerInstallmentPayments?.filter((item) => {
    const card = customerInstallmentCards?.find(
      (c) =>
        Number(c.card_id) === Number(item.card_id) ||
        Number(c.id) === Number(item.card_id) ||
        Number(c.card_number) === Number(item.card_id),
    );

    return (
      item.status === "Paid" &&
      item.paid_date?.split(" ")[0] === today &&
      card?.remarks !== "Daily"
    );
  });
  const cardUserMap = {};

  customerInstallmentCards?.forEach((card) => {
    const user = users?.find(
      (u) =>
        Number(u.user_id) === Number(card.user_id) ||
        Number(u.id) === Number(card.user_id),
    );

    const cardKey = card.card_id || card.id || card.card_number;
    if (cardKey) cardUserMap[cardKey] = user?.name || "-";
  });

  const todayInvestments = investInstallments?.filter(
    (item) =>
      item.investment_date?.split(" ")[0] === today &&
      Number(item.investment_card_no) !== 1 &&
      Number(item.investment_card_no) !== 2,
  );
  const investmentUserMap = {};

  investInstallments?.forEach((investment) => {
    const user = users?.find(
      (u) => Number(u.id) === Number(investment.investor_id),
    );

    investmentUserMap[investment.investment_card_no] = user?.name || "-";
  });
  const todayDailyInstallments = dailyInstallments?.filter(
    (item) => item.date?.split(" ")[0] === today,
  );
  const todayExpenses = companyExpenses?.filter(
    (item) => item.date?.split(" ")[0] === today,
  );
  const todayProductPurchase = customerInstallmentCards?.filter(
    (item) => item.delivery_date?.split(" ")[0] === today,
  );
  const todayCompleteInvestorReturnAmount =
    investorWithdrawApplications?.filter(
      (item) => item.reviewed_at?.split(" ")[0] === today,
    );

  // 🔹 Loan & Other Cash In/Out Filters
  // 1. Loan Taken (ঋণ গ্রহণ / কার কাছ থেকে আনা হয়েছে)
  const todayLoansTaken = allCash.filter(
    (item) =>
      (item.date?.split(" ")[0] === today || item.date === today) &&
      item.type === "in" &&
      item.category?.toLowerCase()?.trim() === "loan"
  );

  // 2. Loan Return Received (ঋণ ফেরত আদায় / কে ব্যাক করেছে)
  const todayLoanReturns = allCash.filter(
    (item) =>
      (item.date?.split(" ")[0] === today || item.date === today) &&
      item.type === "in" &&
      item.category?.toLowerCase()?.trim() === "loan-return"
  );

  // 3. Loan Given (ঋণ প্রদান / কাকে দেওয়া হয়েছে)
  const todayLoansGiven = allCash.filter(
    (item) =>
      (item.date?.split(" ")[0] === today || item.date === today) &&
      item.type === "out" &&
      item.category?.toLowerCase()?.trim() === "loan-given"
  );

  // 4. Loan Repaid / Settled (ঋণ পরিশোধ / ক্লিয়ার করা হয়েছে)
  const todayLoanRepayments = allCash.filter(
    (item) =>
      (item.date?.split(" ")[0] === today || item.date === today) &&
      item.type === "out" &&
      item.category?.toLowerCase()?.trim() === "loan-repayment"
  );

  // 5. Other Cash In
  const todayOtherCashIn = allCash.filter(
    (item) =>
      (item.date?.split(" ")[0] === today || item.date === today) &&
      item.type === "in" &&
      !["invest", "installment", "downpayment", "daily-installment", "loan", "loan-return"].includes(
        item.category?.toLowerCase()?.trim()
      )
  );

  const totalInstallmentCollection =
    monthlyInstallments?.reduce(
      (sum, item) => sum + Number(item.due_amount || 0),
      0,
    ) || 0;

  const totalInvestment =
    todayInvestments?.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ) || 0;

  const totalDailyCollection =
    todayDailyInstallments?.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ) || 0;

  const totalExpense =
    todayExpenses?.reduce((sum, item) => sum + Number(item.amount || 0), 0) ||
    0;

  const totalProductPurchase =
    todayProductPurchase?.reduce(
      (sum, item) => sum + Number(item.cost_price || 0),
      0,
    ) || 0;

  const totalInvestorWithdraw =
    todayCompleteInvestorReturnAmount?.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ) || 0;

  const totalLoanTaken = todayLoansTaken.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalLoanReturn = todayLoanReturns.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalLoanGiven = todayLoansGiven.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalLoanRepaid = todayLoanRepayments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalOtherCashIn = todayOtherCashIn.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const dailyMonthlyInstallments = customerInstallmentPayments?.filter(
    (item) => {
      const card = customerInstallmentCards?.find(
        (c) => Number(c.card_number) === Number(item.card_id),
      );

      return (
        item.status === "Paid" &&
        item.paid_date?.split(" ")[0] === today &&
        card?.remarks === "Daily"
      );
    },
  );
  const totalDailyMonthlyInstallmentCollection =
    dailyMonthlyInstallments?.reduce(
      (sum, item) => sum + Number(item.due_amount || 0),
      0,
    ) || 0;

  // Cash In
  const cashIn =
    totalInstallmentCollection +
    totalInvestment +
    totalDailyCollection +
    totalLoanTaken +
    totalLoanReturn +
    totalOtherCashIn;

  // Cash Out
  const cashOut =
    totalExpense +
    totalProductPurchase +
    totalInvestorWithdraw +
    totalLoanGiven +
    totalLoanRepaid;

  // Net Cash
  const totalCash = openingCash + cashIn - cashOut;
  const printRef = useRef(null);
  const [year, month, day] = today.split("-");

  const formattedDate = `${
    MONTHS.find((m) => m.value === Number(month))?.label
  } ${Number(day)}, ${year}`;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Dashboard_Report_${new Date().toISOString().split("T")[0]}`,
  });

  return (
    <>
      <div className="bg-white text-black p-6 print:p-2">
        <p className="text-center mb-5">Date: {today}</p>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="btn bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
          >
            Print Report
          </button>
        </div>
        <div ref={printRef} className="dashboard-report-print">
          <div className="report-first-page px-10 pt-5">
            <div className="border border-black rounded-lg p-6 mb-8 cash-summary">
              <h2 className="text-2xl font-bold text-center mb-6">
                {formattedDate} Cash Summary
              </h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">💰 Opening Cash</span>
                  <span className="font-bold text-green-600">
                    ৳ {openingCash.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">💰 Cash In</span>
                  <span className="font-bold text-green-600">
                    ৳ {cashIn.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">💸 Cash Out</span>
                  <span className="font-bold text-red-600">
                    ৳ {cashOut.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between pt-2 text-xl">
                  <span className="font-bold">💵 Net Cash</span>
                  <span
                    className={`font-bold ${
                      totalCash >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    ৳ {totalCash.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="report-tables-container space-y-6">
            {/* Investment Collection Report */}
            <ReportTable
              title="Today's Investment Collection Report"
              columns={["#", "Investor", "Investor Id", "Card No", "Amount"]}
              data={todayInvestments}
              total={totalInvestment}
              totalColSpan={4}
              renderRow={(item, index) => {
                const user = users.find(
                  (u) => Number(u.id) === Number(item.investor_id) || Number(u.user_id) === Number(item.investor_id),
                );

                return [
                  index + 1,
                  user?.name || "-",
                  user?.user_id || user?.id || item.investor_id || "-",
                  item.investment_card_no,
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* Daily Installment Collection Report */}
            <ReportTable
              title="Today's Daily Installment Collection Report"
              columns={["#", "Customer", "Customer Id", "Card No", "Amount"]}
              data={todayDailyInstallments}
              total={totalDailyCollection}
              totalColSpan={4}
              renderRow={(item, index) => {
                const user = users.find(
                  (u) => Number(u.id) === Number(item.userId) || Number(u.user_id) === Number(item.userId),
                );

                return [
                  index + 1,
                  user?.name || "-",
                  user?.user_id || user?.id || item.userId || "-",
                  item.cardId,
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* Daily Installment Complete Monthly  */}
            <ReportTable
              title="Today's Daily Card Installment Collection Report"
              columns={[
                "#",
                "Customer",
                "Customer Id",
                "Card No",
                "Installment",
                "Amount",
              ]}
              data={dailyMonthlyInstallments}
              total={totalDailyMonthlyInstallmentCollection}
              totalColSpan={5}
              renderRow={(item, index) => {
                const card = customerInstallmentCards?.find(
                  (c) =>
                    Number(c.card_id) === Number(item.card_id) ||
                    Number(c.id) === Number(item.card_id) ||
                    Number(c.card_number) === Number(item.card_id),
                );

                const user = users?.find(
                  (u) =>
                    Number(u.user_id) === Number(card?.user_id) ||
                    Number(u.id) === Number(card?.user_id),
                );
                return [
                  index + 1,
                  user?.name || "-",
                  user?.user_id || user?.id || card?.user_id || "-",
                  card?.card_id || card?.id || item.card_id || "-",
                  item?.tag,
                  Number(item.due_amount).toLocaleString(),
                ];
              }}
            />

            {/* Monthly Installment Report */}
            <ReportTable
              title="Today's Monthly Installment Collection Report"
              columns={[
                "#",
                "Customer",
                "Customer Id",
                "Card No",
                "Installment",
                "Method",
                "Amount",
              ]}
              data={monthlyInstallments}
              total={totalInstallmentCollection}
              totalColSpan={6}
              renderRow={(item, index) => {
                const card = customerInstallmentCards?.find(
                  (c) =>
                    Number(c.card_id) === Number(item.card_id) ||
                    Number(c.id) === Number(item.card_id) ||
                    Number(c.card_number) === Number(item.card_id),
                );

                const user = users?.find(
                  (u) =>
                    Number(u.user_id) === Number(card?.user_id) ||
                    Number(u.id) === Number(card?.user_id),
                );
                
                return [
                  index + 1,
                  user?.name || "-",
                  user?.user_id || user?.id || card?.user_id || "-",
                  card?.card_id || card?.id || item.card_id || "-",
                  item?.tag,
                  item?.payment_method || "-",
                  Number(item.due_amount).toLocaleString(),
                ];
              }}
            />

            {/* 🔹 1. Today's Loan Taken Report (ঋণ গ্রহণ) */}
            <ReportTable
              title="Today's Loan Taken Report (ঋণ গ্রহণ)"
              columns={["#", "Date", "Source / কার থেকে নেওয়া", "Ref ID", "Remarks / বিবরণ", "Amount"]}
              data={todayLoansTaken}
              total={totalLoanTaken}
              totalColSpan={5}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.date || "-",
                  item?.source || "-",
                  item?.refId || "-",
                  item?.remarks || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* 🔹 2. Today's Loan Return Received Report (ঋণ ফেরত আদায়) */}
            <ReportTable
              title="Today's Loan Return Report (ঋণ ফেরত আদায়)"
              columns={["#", "Date", "Source / কে ফেরত দিয়েছে", "Ref ID", "Remarks / বিবরণ", "Amount"]}
              data={todayLoanReturns}
              total={totalLoanReturn}
              totalColSpan={5}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.date || "-",
                  item?.source || "-",
                  item?.refId || "-",
                  item?.remarks || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* 🔹 3. Today's Loan Given Report (ঋণ প্রদান) */}
            <ReportTable
              title="Today's Loan Given Report (ঋণ প্রদান)"
              columns={["#", "Date", "Recipient / কাকে দেওয়া হয়েছে", "Remarks / বিবরণ", "Amount"]}
              data={todayLoansGiven}
              total={totalLoanGiven}
              totalColSpan={4}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.date || "-",
                  item?.purpose || item?.source || "-",
                  item?.remarks || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* 🔹 4. Today's Loan Repayment / Settled Report (ঋণ পরিশোধ) */}
            <ReportTable
              title="Today's Loan Repayment Report (ঋণ পরিশোধ)"
              columns={["#", "Date", "Paid To / কার ঋণ ক্লিয়ার করা হয়েছে", "Remarks / বিবরণ", "Amount"]}
              data={todayLoanRepayments}
              total={totalLoanRepaid}
              totalColSpan={4}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.date || "-",
                  item?.purpose || item?.source || "-",
                  item?.remarks || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* 🔹 5. Today's Other Cash In Report */}
            <ReportTable
              title="Today's Other Cash In Report (অন্যান্য ক্যাশ ইন)"
              columns={["#", "Date", "Source / উৎস", "Category", "Remarks / বিবরণ", "Amount"]}
              data={todayOtherCashIn}
              total={totalOtherCashIn}
              totalColSpan={5}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.date || "-",
                  item?.source || "-",
                  item?.category || "-",
                  item?.remarks || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            <ReportTable
              title="Today's Expenses Report"
              columns={["#", "Date", "Purpose", "Remarks", "Amount"]}
              data={todayExpenses}
              total={totalExpense}
              totalColSpan={4}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.date || "-",
                  item?.purpose || "-",
                  item?.remarks || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* Product Purchase */}
            <ReportTable
              title="Today's Product Purchase Report"
              columns={["#", "Date", "Product Name", "Amount"]}
              data={todayProductPurchase}
              total={totalProductPurchase}
              totalColSpan={3}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.delivery_date || "-",
                  item?.product_name || "-",
                  Number(item.cost_price).toLocaleString(),
                ];
              }}
            />

            {/* Investor Amount Withdraw */}
            <ReportTable
              title="Today's Investor Amount Withdraw Report"
              columns={[
                "#",
                "Name",
                "User Id",
                "Card Id",
                "Request Date",
                "Approved Date",
                "Reason",
                "Amount",
              ]}
              data={todayCompleteInvestorReturnAmount}
              total={totalInvestorWithdraw}
              totalColSpan={7}
              renderRow={(item, index) => {
                return [
                  index + 1,
                  item?.investor_name || "-",
                  item?.investor_id || "-",
                  item?.card_id || "-",
                  item?.requested_at?.split(" ")[0],
                  item?.reviewed_at?.split(" ")[0],
                  item.reason || "-",
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard-report-print {
          background: #fff;
          color: #000;
          width: 100%;
        }

        .report-table-title {
          font-size: 15px !important;
          font-weight: 700 !important;
          margin-bottom: 6px !important;
        }

        .dashboard-report-print table {
          width: 100%;
          border-collapse: collapse;
        }

        .dashboard-report-print th,
        .dashboard-report-print td {
          border: 1px solid #000;
          padding: 8px;
          font-size: 13px;
        }

        .dashboard-report-print thead {
          background: #f3f4f6;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          .dashboard-report-print {
            padding: 0 !important;
            margin: 0 !important;
          }

          .report-table-title {
            font-size: 12px !important;
            font-weight: 700 !important;
            margin-bottom: 4px !important;
            margin-top: 8px !important;
          }

          .report-first-page {
            page-break-after: always;
            break-after: page;
            min-height: calc(100vh - 25mm);
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-sizing: border-box;
            padding: 0 10mm !important;
          }

          .cash-summary {
            border: 1px solid #000 !important;
            border-radius: 8px;
            padding: 24px;
            box-sizing: border-box;
            width: 100%;
          }

          .dashboard-report-print table {
            page-break-inside: auto;
          }

          .dashboard-report-print thead {
            display: table-header-group;
          }

          .dashboard-report-print tfoot {
            display: table-footer-group;
          }

          .dashboard-report-print tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          .dashboard-report-print th,
          .dashboard-report-print td {
            font-size: 11px;
            padding: 6px;
          }

          html,
          body,
          #root,
          #app-scroll-container {
            display: block !important;
            position: static !important;
            height: auto !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardReport;
