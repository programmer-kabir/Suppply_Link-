import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineUserGroup,
} from "react-icons/hi2";

import {
  FaBuilding,
  FaUser,
  FaUserPlus,
  FaBoxOpen,
  FaCartShopping,
  FaCashRegister,
} from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";

import {
  TbUsers,
  TbFilePlus,
  TbShoppingCartPlus,
  TbCashBanknote,
  TbClipboardList,
  TbWallet,
  TbShoppingCart,
  TbChartBar,
  TbReport,
  TbClock,
  TbFiles,
  TbFileUpload,
} from "react-icons/tb";

import { RiBankCardLine, RiBankCard2Line } from "react-icons/ri";
import { MdDeveloperMode, MdInventory, MdOutlineDashboard, MdOutlineInventory2, MdPayments, MdProductionQuantityLimits, MdShowChart } from "react-icons/md";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { IoStatsChart } from "react-icons/io5";
import { BsBank, BsGraphUpArrow, BsClipboardData, BsCashStack } from "react-icons/bs";
import { AiFillCloseCircle, AiOutlineUserAdd } from "react-icons/ai";
import { FiFile, FiUser } from "react-icons/fi";

export const sidebarMenu = [
  // DASHBOARD
  {
    label: "Dashboard",
    path: "/",
    icon: MdOutlineDashboard,
    roles: ["admin", "developer", "manager", "staff"],
  },

  {
    type: "collapse",
    label: "Cash Management",
    icon: BsCashStack,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Cash In",
        path: "/cash/cash_in",
        icon: GiReceiveMoney,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Cash Out",
        path: "/cash/cash_out",
        icon: GiPayMoney,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "রিপোর্ট",
        path: "/cash/cash_reports",
        icon: TbReport,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "রিপোর্ট প্রিন্ট",
        path: "/cash/cash_reports_print",
        icon: TbReport,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "অনুদান অনুমোদন",
        path: "/cash/cash-report-approval",
        icon: TbCashBanknote,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },


  // USERS
  {
    type: "collapse",
    label: "Users",
    icon: TbUsers,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "All Users",
        path: "users/all_sers",
        icon: FaUser,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Add User",
        path: "users/add_user",
        icon: AiOutlineUserAdd,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Add Roles",
        path: "users/add_roles",
        icon: FaUserPlus,
        roles: ["admin", "developer", "manager", "staff"],
      },

    ],
  },

  // CUSTOMERS
  {
    type: "collapse",
    label: "Customers",
    icon: HiOutlineUserGroup,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Customer List",
        path: "/customers/all_customer",
        icon: FaUser,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Installment Cards",
        path: "/customers/installment_cards",
        icon: RiBankCardLine,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Create Installment Cards",
        path: "/customers/create_installment_cards",
        icon: RiBankCard2Line,
        roles: ["admin", "developer", "manager"],
      },

      {
        label: "Installment Analytics",
        path: "/customers/monthly_installment_overviews",
        icon: MdShowChart,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Installment Analytics Test",
        path: "/customers/monthly_installment_overviews_test",
        icon: MdShowChart,
        roles: ["admin", "developer", "manager", "staff"],
      },

      {
        label: "Monthly Installment Reports",
        path: "/customers/monthly_installment_reports",
        icon: TbChartBar,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Monthly Installment Print",
        path: "/customers/monthly_installment_overview",
        icon: TbChartBar,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },
  {
    type: "collapse",
    label: "Regular Installments",
    icon: HiOutlineUserGroup,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Regular Installment  List",
        path: "/dailyInstallments/daily_installments_users",
        icon: TbUsers,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Collection Report",
        path: "/dailyInstallments/daily_installments_reports",
        icon: TbClipboardList,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Full Paid Report",
        path: "/dailyInstallments/daily_installments_PaidReport",
        icon: TbCashBanknote,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Daily Installments Reports Print",
        path: "/dailyInstallments/daily_installments_report_print",
        icon: FiFile,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },

  // INVESTORS
  {
    type: "collapse",
    label: "Investors",
    icon: GiReceiveMoney,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Investor List",
        path: "/investors/all_investors",
        icon: TbUsers,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Investment Cards",
        path: "/investors/investment_cards",
        icon: RiBankCardLine,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Create Investment Cards",
        path: "/investor/create_investment_card",
        icon: RiBankCard2Line,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Daily Investment Summary",
        path: "/investors/daily_investment_reports",
        icon: TbChartBar,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Monthly Investment Summary",
        path: "/investors/monthly_investment_reports",
        icon: TbReport,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },


  {
    type: "collapse",
    label: "Products",
    icon: HiOutlineCube,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Products Summary",
        path: "/products/products_summery",
        icon: FaBoxOpen,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },
  {
    type: "collapse",
    label: "Stock Inventory",
    icon: MdInventory,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Inventory List",
        path: "inventory/inventory_list",
        icon: MdOutlineInventory2,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Supplier Payments",
        path: "inventory/supplier_payments",
        icon: MdPayments,
        roles: ["admin", "developer", "manager", "staff"],
      }
    ],
  },

  // COMPANY

  // {
  //   type: "collapse",
  //   label: "Finance",
  //   icon: IoStatsChart,
  //   roles: ["admin", "developer", "manager"],
  //   children: [
  //     {
  //       label: "Finance Overview",
  //       path: "/finance/finance_overview",
  //       icon: IoStatsChart,
  //       roles: ["admin", "developer", "manager"],
  //     },
  //     {
  //       label: "Company Health",
  //       path: "/finance/company-health",
  //       icon: BsGraphUpArrow,
  //       roles: ["admin", "developer", "manager"],
  //     },
  //   ],
  // },
  {
    label: "Company Expenses",
    path: "/expenses/company_expenses",
    icon: FaBuilding,
    roles: ["admin", "developer", "manager", "staff"],
  },
  // DEVELOPER


  {
    type: "collapse",
    label: "Installment Files",
    icon: TbFiles,
    roles: ["admin", "developer", "manager"],
    children: [
      {
        label: "Installment File Records",
        path: "/files/installment_file_record",
        icon: TbFiles,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Add Installment File",
        path: "/files/add_installment_file",
        icon: TbFileUpload,
        roles: ["admin", "developer", "manager", "staff"],
      },

    ],
  },

  {
    label: "Profile",
    path: "/profile/account",
    icon: FiUser,
    roles: ["admin", "developer", "manager", "staff"],
  },
];
