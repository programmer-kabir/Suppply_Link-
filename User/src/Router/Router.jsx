import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import HomePage from "../Pages/HomePage";
import LoginForm from "../Pages/Authencation/Login";
import InvoicePage from "../Pages/InvoicePage";
import ProtectedRoute from "./ProtectedRoute";

// const routes = createBrowserRouter([
//   {
//     path: "/",
//     element: (

//       <MainLayout />
//     ),
//     children: [
//       {
//         path: "/",
//         element: <HomePage />,
//       },
//       {
//         path: "/login",
//         element: <LoginForm />,
//       },
//       {
//         path:"/invoice/:id",
//         element:<InvoicePage />
//       }
//     ],
//   },
// ]);
const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />, // 🔐 protected wrapper
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/invoice/:id", element: <InvoicePage /> },
        ],
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
    ],
  },
]);
export default routes;
