import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvestProfit } from "../../Redux/Investores/InvestmentsProfit/InvestmentsProfitSlice";

export default function useInvestmentProfit({ start, end, months, year }) {
  const dispatch = useDispatch();
  const { investProfit, isInvestProfitLoading, isInvestProfitError } =
    useSelector((state) => state.investProfit);

  useEffect(() => {
    // Validation: only fetch if at least one valid filter provided
    const hasDateRange = start && end;
    const hasMonths =
      months !== undefined && months !== null && String(months).trim() !== "";
    const hasYear =
      year !== undefined && year !== null && String(year).trim() !== "";

    if (!hasDateRange && !hasMonths && !hasYear) {
      // No valid filter → don't dispatch
      return;
    }

    // Optional: basic date format check for start/end (YYYY-MM-DD)
    if (hasDateRange) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(String(start)) || !dateRegex.test(String(end))) {
        // console.warn(
        //   "useInvestmentProfit: start/end format should be YYYY-MM-DD",
        //   { start, end }
        // );
        return; // skip fetch if bad date format
      }
    }

    // All good → dispatch
    dispatch(fetchInvestProfit({ start, end, months, year }));
  }, [dispatch, start, end, months, year]);

  return {
    investProfit,
    isInvestProfitLoading,
    isInvestProfitError,
  };
}
