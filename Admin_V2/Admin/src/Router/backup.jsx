import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Dashboard from "../Pages/Dashboard";
import ProfitHistory from "../Pages/AdminDashboard/Investors_Profit/ProfitHistory";
import NoProfitAction from "../Pages/AdminDashboard/Investors_Profit/NoProfitAction";
import AllUsers from "../Pages/AdminDashboard/Users/AllUsers";
import InstallmentCards from "../Pages/AdminDashboard/Customers/InstallmentCards";
import Investors from "../Pages/AdminDashboard/Investors/Investors";
import InvestmentCards from "../Pages/AdminDashboard/Investors/InvestmentCards";
import InvestmentPayments from "../Pages/AdminDashboard/Investors/InvestmentPayments";
import Customers from "../Pages/AdminDashboard/Customers/Customers";
import InstallmentPayments from "../Pages/AdminDashboard/Customers/InstallmentPayments";
import InstallmentChart from "../Pages/AdminDashboard/Customers/InstallmentChart";
import AdminLogin from "../Pages/Authencation/AdminLogin/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";

// const routes = createBrowserRouter([
//   {
//     path: "/sign_in",
//     element: <AdminLogin />,
//   },
//   {
//     path: "/",
//     element: (

//         <MainLayout />

//     ),
//     children: [
//       {
//         path: "/",
//         element: <Dashboard />,
//       },
//       {
//         path: "/all_users",
//         element: <AllUsers />,
//       },
//       // Customer
//       {
//         path: "/customers/all_customer",
//         element: <Customers />,
//       },
//       {
//         path: "/customers/installment_cards",
//         element: <InstallmentCards />,
//       },
//       {
//         path: "/customers/Installment_payments/:cardId",
//         element: <InstallmentPayments />,
//       },
//       {
//         path: "/customer/create_installment_chart",
//         element: <InstallmentChart />,
//       },
//       // Investors
//       {
//         path: "/investors/all_investors",
//         element: <Investors />,
//       },
//       {
//         path: "/investors/investment_payments/:cardId",
//         element: <InvestmentPayments />,
//       },
//       {
//         path: "/investors/investment_cards",
//         element: <InvestmentCards />,
//       },
//       {
//         path: "/profit/profit-history",
//         element: <ProfitHistory />,
//       },
//       {
//         path: "/profit/no-action",
//         // element: <NoProfitAction />,
//         element: <Dashboard />,
//       },
//     ],
//   },
// ]);

const routes = createBrowserRouter([
  {
    path: "/sign_in",
    element: <AdminLogin />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // 🔒 আগে check হবে
    children: [
      {
        element: <MainLayout />, // layout protected
        children: [
          { path: "/", element: <Dashboard /> },
          {
            path: "/all_users",
            element: <AllUsers />,
          },
          {
            path: "/customers/all_customer",
            element: <Customers />,
          },
          {
            path: "/customers/installment_cards",
            element: <InstallmentCards />,
          },
          {
            path: "/customers/Installment_payments/:cardId",
            element: <InstallmentPayments />,
          },
          {
            path: "/customer/create_installment_chart",
            element: <InstallmentChart />,
          },
          //       // Investors
          {
            path: "/investors/all_investors",
            element: <Investors />,
          },
          {
            path: "/investors/investment_payments/:cardId",
            element: <InvestmentPayments />,
          },
          {
            path: "/investors/investment_cards",
            element: <InvestmentCards />,
          },
          {
            path: "/profit/profit-history",
            element: <ProfitHistory />,
          },
          {
            path: "/profit/no-action",
            // element: <NoProfitAction />,
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

export default routes;
