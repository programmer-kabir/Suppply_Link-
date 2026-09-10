import { configureStore } from "@reduxjs/toolkit";
import investInstallmentCardsSlice from "./Investores/InstallmentCards/investInstallmentCardsSlice";
import InvestInstallments from "./Investores/Installments/investInstallments";
import InvestmentsProfitSlice from "./Investores/InvestmentsProfit/InvestmentsProfitSlice";
import CompanyExpensesSlice from "./Expenses/CompanyExpensesSlice";
import cardProfitHistorySlice from "./Investores/InvestmentProfitSatus/InvestmentProfitStatusSlice";
import allInvestInstallmentsSlice from "./Investores/AllInvestInstallments/allInvestInstallmentsSlice";
import UsersSlice from "./Users/UsersSlice";
import customerInstallmentCardsSlice from "./Customers/InstallmentCards/InstallmentCardSlice";
import customerInstallmentPaymentsSlice from "./Customers/InstallmentsPayments/InstallmentsPaymentsSlice";
import paymentMethodSlice from "./PaymentMethod/paymentMethodSlice";
import ProfitAnalyticsSlice from "./ProfitAnalytics/ProfitAnalyticsSlice";
import investorsProfitHistorySlice from "./ProfitHistory/investorsProfitHistorySlice";

const store = configureStore({
  reducer: {
    investInstallmentCards: investInstallmentCardsSlice,
    investInstallments: InvestInstallments,
    investProfit: InvestmentsProfitSlice,
    companyExpenses: CompanyExpensesSlice,
    profitHistory: cardProfitHistorySlice,
    allInvestInstallments: allInvestInstallmentsSlice,
    users: UsersSlice,
    customerInstallmentCards: customerInstallmentCardsSlice,
    customerInstallmentPayments: customerInstallmentPaymentsSlice,
    paymentMethods: paymentMethodSlice,
    profitAnalytics: ProfitAnalyticsSlice,
    investorProfitHistory: investorsProfitHistorySlice,
  },
});
export default store;
