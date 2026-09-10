import { configureStore } from "@reduxjs/toolkit";
import UsersSlice from "./Users/UsersSlice";
import investmentCardsSlice from "./Investors/InvestmentCards/investmentCardsSlice";
import customerInstallmentCardsSlice from "../Redux/Customers/InstallmentCards/InstallmentCardSlice";
import InvestInstallments from "../Redux/Investors/InvestmentPayments/investInstallments";
import customerInstallmentPaymentsSlice from "../Redux/Customers/InstallmentPayment/InstallmentPaymentSlice";
import CustomerGranterSlice from "../Redux/Customers/CustomerGranter/CustomerGranterSlice";
import CashDailyReportSlice from "../Redux/Cash/CashDailyReportSlice";
import CashMonthlyReportSlice from "../Redux/Cash/CashMonthlyReportSlice";
import CashYearlyReportSlice from "../Redux/Cash/CashYearlyReportSlice";
import MobileAnalyticsSlice from '../Redux/MobileInventory/MobileAnalyticsSlice';
import SupplierPaymentAnalyticsSlice from '../Redux/SupplierPayment/SupplierPaymentAnalyticsSlice';
import CashReportSlice from '../Redux/Cash/CashReporSlice';
import InstallmentFileSlice from '../Redux/InstallmentFiles/InstallmentFilesSlice';

const store = configureStore({
  reducer: {
    users: UsersSlice,
    investmentCards: investmentCardsSlice,
    customerInstallmentCards: customerInstallmentCardsSlice,
    investInstallments: InvestInstallments,
    customerInstallmentPayments: customerInstallmentPaymentsSlice,
    CustomerGranter: CustomerGranterSlice,
    DailyCashReports: CashDailyReportSlice,
    CashMonthlyReports: CashMonthlyReportSlice,
    CashYearlyReports: CashYearlyReportSlice,
    stockMobiles: MobileAnalyticsSlice,
    supplierPayments: SupplierPaymentAnalyticsSlice,
    CashReports: CashReportSlice,
    installmentFiles: InstallmentFileSlice,
  },
});
export default store;
