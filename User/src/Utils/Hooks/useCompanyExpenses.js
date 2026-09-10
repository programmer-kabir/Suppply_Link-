// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCompanyExpenses } from "../../Redux/Expenses/CompanyExpensesSlice";

// export default function useCompanyExpenses({ start, end, months, year }) {
//   const dispatch = useDispatch();
//   const { isCompanyExpensesLoading, companyExpenses, isExpensesError } =
//     useSelector((state) => state.companyExpenses);

//   useEffect(() => {
//     dispatch(fetchCompanyExpenses({ start, end, months, year }));
//   }, [dispatch, start, end, months, year]);

//   return {
//     isCompanyExpensesLoading,

//     companyExpenses,
//     isExpensesError,
//   };
// }
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyExpenses } from "../../Redux/Expenses/CompanyExpensesSlice";

export default function useCompanyExpenses({ start, end, months, year }) {
  const dispatch = useDispatch();

  const { isCompanyExpensesLoading, companyExpenses, isExpensesError } =
    useSelector((state) => state.companyExpenses);

  useEffect(() => {
    // -----------------------------------
    // VALIDATION CHECKS
    // -----------------------------------

    const hasDateRange = start && end;
    const hasMonths =
      months !== undefined && months !== null && String(months).trim() !== "";
    const hasYear =
      year !== undefined && year !== null && String(year).trim() !== "";

    // ❌ No usable filter → Don't dispatch
    if (!hasDateRange && !hasMonths && !hasYear) {
      return;
    }

    // Optional: date format check (YYYY-MM-DD)
    if (hasDateRange) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(String(start)) || !dateRegex.test(String(end))) {
        // console.warn(
        //   "useCompanyExpenses: Invalid date format (expected YYYY-MM-DD)"
        // );
        return;
      }
    }

    // -----------------------------------
    // VALID → DISPATCH
    // -----------------------------------
    dispatch(fetchCompanyExpenses({ start, end, months, year }));
  }, [dispatch, start, end, months, year]);

  return {
    isCompanyExpensesLoading,
    companyExpenses,
    isExpensesError,
  };
}
