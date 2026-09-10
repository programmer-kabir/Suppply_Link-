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

  const monthlyInstallments = customerInstallmentPayments?.filter((item) => {
    const card = customerInstallmentCards?.find(
      (c) => Number(c.card_number) === Number(item.card_id),
    );

    return (
      item.status === "Paid" &&
      item.paid_date?.split(" ")[0] === today &&
      card?.remarks !== "Daily"
    );
  });
  const cardUserMap = {};

  customerInstallmentCards?.forEach((card) => {
    const user = users?.find((u) => Number(u.id) === Number(card.user_id));

    cardUserMap[card.card_number] = user?.name || "-";
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
    totalInstallmentCollection + totalInvestment + totalDailyCollection;

  // Cash Out
  const cashOut =
    totalExpense +
    totalProductPurchase +
    totalInvestorWithdraw 

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
        <div ref={printRef} className="dashboard-report-print ">
          <div className="px-10 pt-5 report-page">
            <div className="border border-black rounded-lg p-5 mb-8 cash-summary">
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
         
            <div className="page-break" />
          </div>

            {/* Daily Investment */}
          <div className="report-page">
            <ReportTable
              title="Today's Investment Report"
              columns={[
                "#",
                "Investor",
                "Investor Id",
                "Card No",
                "Investment No",
                "Amount",
              ]}
              data={todayInvestments}
              total={totalInvestment}
              totalColSpan={5}
              renderRow={(item, index) => {
                const user = users.find(
                  (u) => Number(u.id) === Number(item.investor_id),
                );

                return [
                  index + 1,
                  user?.name || "-",
                  user?.id || "-",
                  item.investment_card_no,
                  item.investment_no,
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />
     
          </div>

          <div className="page-break" />
          <div className="report-page">
            {/* Daily Installment */}
            <ReportTable
              title="Today's Daily Installment Report"
              columns={["#", "Customer", "Customer Id", "Card No", "Amount"]}
              data={todayDailyInstallments}
              total={totalDailyCollection}
              totalColSpan={4}
              renderRow={(item, index) => {
                const user = users.find(
                  (u) => Number(u.id) === Number(item.userId),
                );

                return [
                  index + 1,
                  user?.name || "-",
                  user?.id || "-",
                  item.cardId,
                  Number(item.amount).toLocaleString(),
                ];
              }}
            />

            {/* Daily Installment Complete Monthly  */}

            <ReportTable
              title="  Today's Daily Card Installment Collection Report"
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
                const card = customerInstallmentCards.find(
                  (c) => Number(c.card_number) === Number(item.card_id),
                );

                const user = users.find(
                  (u) => Number(u.id) === Number(card?.user_id),
                );
                return [
                  index + 1,
                  user?.name || "-",
                  user?.id || "-",
                  item.card_id,
                  item?.tag,
                  Number(item.due_amount).toLocaleString(),
                ];
              }}
            />
           
          </div>
          <div className="page-break" />
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
              const card = customerInstallmentCards.find(
                (c) => Number(c.card_number) === Number(item.card_id),
              );

              const user = users.find(
                (u) => Number(u.id) === Number(card?.user_id),
              );
              
              return [
                index + 1,
                user?.name || "-",
                user?.id || "-",
                item.card_id,
                item?.tag,
                item?.payment_method,
                Number(item.due_amount).toLocaleString(),

              ];
            }}
          />

          <ReportTable
            title="Today's Expenses Report"
            columns={["#", "Date", "purpose", "Remarks", "Amount"]}
            data={todayExpenses}
            total={totalExpense}
            totalColSpan={4}
            renderRow={(item, index) => {
              return [
                index + 1,
                item?.date || "-",
                item?.purpose || "-",
                item?.remarks,
                Number(item.amount).toLocaleString(),
              ];
            }}
          />
          {/* product Purchase */}
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
          {/* Investor amount withdraw */}

          <ReportTable
            title=" Today's Investor Amount Withdraw Report"
            columns={[
              "#",
              "Name",
              "User Id",
              "Card Id",
              "Request Date",
              "Approved Date",
              "reason",
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
                item.reason,
                Number(item.amount).toLocaleString(),
              ];
            }}
          />
       

        </div>
      </div>
      
      <style>{`
      
.dashboard-report-print{
  background:#fff;
  color:#000;
  width:100%;
}
.report-section{
  page-break-before: always;
  padding-top: 15mm;
}
      .dashboard-report-print table{
        width:100%;
        border-collapse:collapse;
      }

      .dashboard-report-print th,
      .dashboard-report-print td{
        border:1px solid #000;
        padding:8px;
        font-size:13px;
      }

      .dashboard-report-print thead{
        background:#f3f4f6;
      }

      @media print{

        @page{
          size:A4 portrait;
          margin:10mm;
        }

        .dashboard-report-print{
          padding:0 !important;
        }

        .dashboard-report-print table{
          page-break-inside:auto;
        }

        .dashboard-report-print thead{
          display:table-header-group;
        }

        .dashboard-report-print tfoot{
          display:table-footer-group;
        }

        .dashboard-report-print tr{
          page-break-inside:avoid;
          page-break-after:auto;
        }

        .dashboard-report-print th,
        .dashboard-report-print td{
          font-size:11px;
          padding:6px;
        }
 .page-break {
    page-break-after: always;
    break-after: page;
  }

  .cash-summary,
  .daily-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }
.cash-summary{
  border: 1px solid #000 !important;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;   /* center না */
  min-height: calc(100vh - 20mm);
  box-sizing: border-box;
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

  .dashboard-report-print {
    margin: 0 !important;
    padding: 0 !important;
  }



  signature-section {
    position: fixed;
    bottom: 8mm;
    left: 10mm;
    right: 10mm;

    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    background: white;
  }

  .signature-box {
    width: 22%;
    text-align: center;
  }

  .signature-box .line {
    border-top: 1px solid #000;
    margin-bottom: 6px;
  }

  .signature-box p {
    margin: 0;
    font-size: 11px;
    font-weight: bold;
  }
      }
    `}</style>
    </>
  );
};

export default DashboardReport;
