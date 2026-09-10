import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Dashboard from "../Pages/Dashboard";
import AdminLogin from "../Pages/Authencation/AdminLogin/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../Pages/ErrorPage";
import AllUsers from "../Pages/shared/Users/AllUsers";
import Customers from "../Pages/shared/Customers/Customers";
import CustomerDetails from "../Pages/shared/Customers/CustomerDetails";
import CustomerCardDetails from "../Pages/shared/Customers/CustomerCardDetails";
import InstallmentCards from "../Pages/shared/Customers/InstallmentCards";
import MonthlyInstallmentOverview from "../Pages/shared/MonthlyInstallments/MonthlyInstallmentOverview";
import InvestmentCards from "../Pages/shared/Investors/InvestmentCards";
import InvestorDetails from "../Pages/shared/Investors/InvestorDetails";
import InvestorDetailsWithId from "../Pages/shared/Investors/InvestorDetailsWithId";
import CreateInvestmentCard from "../Pages/shared/Investors/CreateInvestmentCard";
import InvestmentPayments from "../Pages/shared/Investors/InvestmentPayments";
import DailyInvestmentReports from "../Pages/shared/Investors/DailyInvestmentReports";
import MonthlyInvestmentReport from "../Pages/shared/Investors/MonthlyInvestmentReport";
import ProductsSummery from "../Pages/shared/Products/ProductsSummery";
import CompanyExpenses from "../Pages/shared/CompanyExpenses/CompanyExpenses";
import AddRoles from "../Pages/shared/Users/AddRoles";
import AddUser from "../Pages/shared/Users/AddUser";
import InstallmentPayments from "../Pages/shared/Customers/InstallmentPayments";
import CreateInstallmentCards from "../Pages/shared/Customers/CreateInstallmentCards";
import InstallmentChart from "../Pages/shared/Customers/InstallmentChart";
import Investors from "../Pages/shared/Investors/Investors";
import MonthlyInstallmentOverviews from "../Pages/shared/Customers/MonthlyInstallmentOverviews";
import MonthlyInstallmentReport from "../Pages/shared/Customers/MonthlyInstallmentReport";
import DailyInstallmentsUsers from "../Pages/shared/DailyInstallments/DailyInstallmentsUsers";
import DailyInstallmentsReports from "../Pages/shared/DailyInstallments/DailyInstallmentsReports";
import DailyInstallmentsUsersDetails from "../Pages/shared/DailyInstallments/DailyInstallmentsUsersDetails";
import InventoryList from "../Pages/shared/MobileInventory/InventoryList";
import SupplierPayments from "../Pages/shared/MobileInventory/SupplierPayments";
import CashIn from "../Pages/CashMenage/CashIn";
import CashReport from "../Pages/CashMenage/CashReport";
import CashOut from "../Pages/CashMenage/CashOut";
import CashReportApproved from "../Pages/CashMenage/CashReportApproved";
import CashReportPrint from "../Pages/CashMenage/CashReportPrint";
import FinanceOverview from "../Pages/shared/Finance/Finance_Overview/FinanceOverview";
import CompanyHealth from "../Pages/shared/Finance/CompanyHealth/CompanyHealth";
import InstallmentFiles from "../Pages/shared/InstallmentFiles/InstallmentFiles";
import AddNewInstallmentFiles from "../Pages/shared/InstallmentFiles/AddNewInstallmentFiles";
import DailyInstallmentReportPrint from "../Pages/shared/DailyInstallments/DailyInstallmentReportPrint";
import DashboardReport from "../components/Dashboard/DashboardReport";
import DailyInstallmentsPaidReport from "../Pages/shared/DailyInstallments/DailyInstallmentsPaidReport";
import Account from "../Pages/shared/Account/Account";
import MonthlyOverviewsTest from "../Pages/shared/Customers/MonthlyOverviewsTest";

const routes = createBrowserRouter([
  {
    path: "/sign_in",
    element: <AdminLogin />,
  },
  { path: "/not-found", element: <ErrorPage /> },
  { path: "*", element: <Navigate to="/not-found" replace /> },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Dashboard
          { path: "/", element: <Dashboard /> },
          {
            path: "/today-report",
            element: <DashboardReport />,
          },
          // Cash
          {
            path: "/cash/cash_in",
            element: <CashIn />,
          },
          {
            path: "/cash/cash_out",
            element: <CashOut />,
          },
          {
            path: "/cash/cash_reports",
            element: <CashReport />,
          },
          {
            path: "/cash/cash_reports_print",
            element: <CashReportPrint />,
          },
          {
            path: "/cash/cash-report-approval",
            element: <CashReportApproved />,
          },
          // Users

          { path: "/users/all_sers", element: <AllUsers /> },
          { path: "/users/add_user", element: <AddUser /> },
          {
            path: "/users/add_roles",
            element: <AddRoles />,
          },
          // customers
          { path: "/customers/all_customer", element: <Customers /> },
          {
            path: "/customers/installment_cards",
            element: <InstallmentCards />,
          },
          {
            path: "/customers/create_installment_cards",
            element: <CreateInstallmentCards />,
          },
          {
            path: "/customers/monthly_installment_overviews",
            element: <MonthlyInstallmentOverviews />,
          },
          {
            path: "/customers/monthly_installment_overviews_test",
            element: <MonthlyOverviewsTest />,
          },
          {
            path: "customers/all_customer/customer_details",
            element: <CustomerDetails />,
          },
          {
            path: "customers/installment_cards/card_Details",
            element: <CustomerCardDetails />,
          },
          {
            path: "/customers/monthly_installment_overview",
            element: <MonthlyInstallmentOverview />,
          },
          {
            path: "/customers/monthly_installment_reports",
            element: <MonthlyInstallmentReport />,
          },
          {
            path: "/customers/Installment_payments/:cardId",
            element: <InstallmentPayments />,
          },


          {
            path: "/customer/create_installment_chart",
            element: <InstallmentChart />,
          },

          // Daily Installments

          {
            path: "/dailyInstallments/daily_installments_users",
            element: <DailyInstallmentsUsers />,
          },

          {
            path: "/dailyInstallments/daily_installments_users/:id",
            element: <DailyInstallmentsUsersDetails />,
          },
          {
            path: "/dailyInstallments/daily_installments_reports",
            element: <DailyInstallmentsReports />,
          },
          {
            path: "/dailyInstallments/daily_installments_PaidReport",
            element: <DailyInstallmentsPaidReport />,
          },
          {
            path: "/dailyInstallments/daily_installments_report_print",
            element: <DailyInstallmentReportPrint />,
          },

          // Investors
          { path: "/investors/all_investors", element: <Investors /> },

          { path: "/investors/investment_cards", element: <InvestmentCards /> },
          {
            path: "/investors/investment_cards/details",
            element: <InvestorDetails />,
          },
          { path: "/investors/details", element: <InvestorDetailsWithId /> },
          {
            path: "/investor/create_investment_card",
            element: <CreateInvestmentCard />,
          },
          {
            path: "/investors/investment_payments",
            element: <InvestmentPayments />,
          },

          {
            path: "/investors/daily_investment_reports",
            element: <DailyInvestmentReports />,
          },
          {
            path: "/investors/monthly_investment_reports",
            element: <MonthlyInvestmentReport />,
          },

          // Products
          {
            path: "/products/products_summery",
            element: <ProductsSummery />,
          },

          // Stock Inventory
          {
            path: "/inventory/inventory_list",
            element: <InventoryList />,
          },
          {
            path: "/inventory/supplier_payments",
            element: <SupplierPayments />,
          },
          // Finance
          {
            path: "/finance/finance_overview",
            element: <FinanceOverview />,
          },
          {
            path: "/finance/company-health",
            element: <CompanyHealth />,
          },
          // Company Expenses
          {
            path: "/expenses/company_expenses",
            element: <CompanyExpenses />,
          },

          // installment_file
          {
            path: "/files/installment_file_record",
            element: <InstallmentFiles />,
          },
          {
            path: "/files/add_installment_file",
            element: <AddNewInstallmentFiles />,
          },

          // Profile

          {
            path: "/profile/account",
            element: <Account />,
          },

        ],
      },
    ],
  },
]);

export default routes;