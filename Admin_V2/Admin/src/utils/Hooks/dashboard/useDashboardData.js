import React, { useEffect, useState } from "react";
import useCustomerInstallmentCards from "../useCustomerInstallmentCards";
import useCustomerInstallmentPayments from "../Customers/useCustomerInstallmentPayments";
import useInvestInstallment from "../../Investors/useInvestInstallment";
import useUsers from "../useUsers";
import useCashReports from "../cash/useCashReports";

const useDashboardData = () => {
  const [dailyInstallments, setDailyInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 🔹 Custom hooks (already fetching data)
  const {
    customerInstallmentCards,
    isCustomerInstallmentsCardsLoading,
    isCustomerInstallmentsCardsError,
  } = useCustomerInstallmentCards();
  const { isUsersError, isUsersLoading, users } = useUsers();
  const {
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsLoading,
    isCustomerInstallmentsPaymentsError,
  } = useCustomerInstallmentPayments();

  const {
    investInstallments,
    inInvestInstallmentsLoading,
    isInvestInstallmentsError,
  } = useInvestInstallment();

  const { CashReports, isCashReportsError, isCashReportsLoading } = useCashReports();

  const safeCashReports = Array.isArray(CashReports) ? CashReports : [];
  const safeInvestInstallments = Array.isArray(investInstallments) ? investInstallments : [];
  const safeCustomerCards = Array.isArray(customerInstallmentCards) ? customerInstallmentCards : [];
  const safeCustomerPayments = Array.isArray(customerInstallmentPayments) ? customerInstallmentPayments : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const approvedCashReports = safeCashReports.filter(
    (cash) => cash.approval_status === "approved"
  );

  const companyExpenses = approvedCashReports.filter(
    (cash) =>
      cash.type === "out" &&
      cash.source === "company-expense"
  );

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  const previousCashReports = approvedCashReports.filter(
    (cash) => cash.date?.split(" ")[0] < today
  );

  const openingCashIn = previousCashReports
    .filter((cash) => cash.type === "in")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const openingCashOut = previousCashReports
    .filter((cash) => cash.type === "out")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const openingCash = openingCashIn - openingCashOut;

  useEffect(() => {
    const fetchDailyInstallments = async () => {
      try {
        const baseUrl = import.meta.env.VITE_LOCALHOST_KEY || "https://management.supplylinkbd.com/apis";
        const res = await fetch(
          `${baseUrl}/DailyInstallments/getDailyInstallments.php`,
        );
        const data = await res.json();
        setDailyInstallments(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError(true);
        setDailyInstallments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyInstallments();
  }, []);

  // 🔹 Combined loading state
  const isLoading =
    isCustomerInstallmentsCardsLoading ||
    isCustomerInstallmentsPaymentsLoading ||
    inInvestInstallmentsLoading ||
    isCashReportsLoading ||
    isUsersLoading || 
    loading;

  // 🔹 Combined error state
  const isError =
    isCustomerInstallmentsCardsError ||
    isCustomerInstallmentsPaymentsError ||
    isInvestInstallmentsError ||
    isCashReportsError ||
    isUsersError || 
    error;

  const roleStats = React.useMemo(() => {
    const stats = {
      total: 0,
      customer: 0,
      investor: 0,
      staff: 0,
      manager: 0,
      admin: 0,
      developer: 0,
    };

    if (!Array.isArray(safeUsers)) return stats;

    stats.total = safeUsers.length;

    safeUsers.forEach((u) => {
      const roles = Array.isArray(u.roles) ? u.roles : [];

      if (roles.includes("customer")) stats.customer++;
      if (roles.includes("investor")) stats.investor++;
      if (roles.includes("staff")) stats.staff++;
      if (roles.includes("manager")) stats.manager++;
      if (roles.includes("admin")) stats.admin++;
      if (roles.includes("developer")) stats.developer++;
    });

    return stats;
  }, [safeUsers]);

  return {
    customerInstallmentCards: safeCustomerCards,
    customerInstallmentPayments: safeCustomerPayments,
    investInstallments: safeInvestInstallments,
    companyExpenses,
    dailyInstallments,
    isLoading,
    isError,
    users: safeUsers,
    roleStats,
    openingCash
  };
};

export default useDashboardData;
