import React from "react";
import useCustomerInstallmentCards from "../../../../utils/Hooks/useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../../../../utils/Hooks/Customers/useCustomerInstallmentPayments";
import useCashReports from "../../../../utils/Hooks/cash/useCashReports";
import Loader from "../../../../components/Loader/Loader";
import ErrorPage from "../../../ErrorPage";
import useInvestInstallment from "../../../../utils/Investors/useInvestInstallment";
import useInvestmentCards from "../../../../utils/Investors/useInvestmentCards";
const StatsCard = ({ title, value }) => {
  return (
    <>
      <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800">
        <p className="text-gray-400 text-xs">{title}</p>
        <h2 className="text-xl font-bold text-green-400">
          ৳{value.toLocaleString()}
        </h2>
      </div>
    </>
  );
};

const CompanyHealth = () => {
  const {
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
    isCustomerInstallmentsCardsLoading,
  } = useCustomerInstallmentCards();
  const {
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
    isCustomerInstallmentsPaymentsLoading,
  } = useCustomerInstallmentPayments();
  const { CashReports, isCashReportsError, isCashReportsLoading } =
    useCashReports();

  const {
    inInvestInstallmentsLoading,
    investInstallments,
    isInvestInstallmentsError,
  } = useInvestInstallment();
  const { investmentCards, isInvestmentCardsError, isInvestmentCardsLoading } =
    useInvestmentCards();

  const productPurchasePrice = customerInstallmentCards.reduce(
    (sum, card) => sum + Number(card.cost_price || 0),
    0,
  );


  const totalCashIn = Array.isArray(CashReports)
    ? CashReports.filter(
        (cash) => cash.type === "in" && cash.approval_status === "approved",
      )?.reduce((sum, item) => sum + Number(item.amount), 0)
    : [];
const totalCashOut = Array.isArray(CashReports)
  ? CashReports
      .filter(
        (cash) =>
          cash.type === "out" &&
          cash.approval_status === "approved" &&
          (
            cash.category?.toLowerCase() === "purchase" ||
            cash.category?.toLowerCase() === "investor-payout" ||
            cash.category?.toLowerCase() === "profit-payout"
          )
      )
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  : 0;

  const currentCashBalance = Number(totalCashIn) - Number(totalCashOut);
  const customerDue = customerInstallmentPayments.filter(
    (payments) => payments.status === "Unpaid",
  );
  const totalCustomerDueAmount = customerDue.reduce(
    (sum, card) => sum + Number(card.due_amount || 0),
    0,
  );

  const totalInvestorPayout = Array.isArray(CashReports)
  ? CashReports
      .filter(
        (cash) =>
          cash.type === "out" &&
          cash.approval_status === "approved" &&
          (

            cash.category?.toLowerCase() === "investor-payout" 
  
          )
      )
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  : 0;


  const investorProfitPayout = Array.isArray(CashReports)
  ? CashReports
      .filter(
        (cash) =>
          cash.type === "out" &&
          cash.approval_status === "approved" &&
          (
            cash.category?.toLowerCase() === "profit-payout"
          )
      )
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  : 0;

  const cashCustomerDue = currentCashBalance + totalCustomerDueAmount;

const ActiveInvestmentAmount = investmentCards
  .filter(
    (card) =>
      card.status?.toLowerCase() === "running" &&
      Number(card.id) !== 1 &&
      Number(card.id) !== 2
  )
  .reduce(
    (sum, card) => sum + Number(card.investment_amount || 0),
    0
  );
  const Card1Investment = investmentCards
  .filter((card) => Number(card.id) === 1)
  .reduce(
    (sum, card) => sum + Number(card.investment_amount || 0),
    0
  );

const CompanyProfit = 0;
const InvestorProfitAvailable = 0;

const TotalInvestorAssets =
  ActiveInvestmentAmount ;
const NetCompanyAssets =
  cashCustomerDue - TotalInvestorAssets;

  const CompanyAssets = CompanyProfit + Card1Investment


  const companyExpenss= Array.isArray(CashReports)
  ? CashReports
      .filter(
        (cash) =>
          // cash.type === "out" &&
          cash.source === "company-expense" 
      )
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  : 0;

  const isLoading =
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading ||
    isCashReportsLoading;
  const isError =
    isCustomerInstallmentsCardsError ||
    isCustomerInstallmentsPaymentsError ||
    isCashReportsError;
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        {" "}
        <Loader />{" "}
      </div>
    );
  if (isError)
    return (
      <div>
        {" "}
        <ErrorPage />{" "}
      </div>
    );
  return (
<>
<div className="grid grid-cols-1 md:grid-cols-4  gap-4 mt-4">
  <StatsCard
    title="Total Cash Received"
    value={totalCashIn}
  />

  <StatsCard
    title="Total Products Purchase"
    value={productPurchasePrice}
  />


</div>
<div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-4">
    <StatsCard
    title="Available Cash Balance"
    value={currentCashBalance}
  />



  <StatsCard
    title="Outstanding Customer Receivables"
    value={totalCustomerDueAmount}
  />
  <StatsCard
    title="Total Liquid & Receivable Assets"
    value={cashCustomerDue}
  />

</div>
<div className="grid grid-cols-1 md:grid-cols-4  gap-4 mt-4">
    <StatsCard
    title="Active Investment Amount"
    value={ActiveInvestmentAmount}
  />



  <StatsCard
    title="Active Investor Profit"
    value={InvestorProfitAvailable}
  />

    <StatsCard
    title="Net Company Assets"
    value={NetCompanyAssets}
  />

</div>
<div className="grid grid-cols-1 md:grid-cols-4  gap-4 mt-4">

    <StatsCard
    title="Company Profit"
    value={CompanyProfit}
  />
    <StatsCard
    title="Company Investment Balance"
    value={Card1Investment}
  />
    <StatsCard
    title="Total Company Assets"
    value={CompanyAssets}
  />
    <StatsCard
    title="Company Expenss"
    value={companyExpenss}
  />



</div>


</>
  );
};

export default CompanyHealth;
