import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCashYearlyReports } from "../../../Redux/Cash/CashYearlyReportSlice";

export default function useCashYearlyReports(year) {
  const dispatch = useDispatch();

  const {
    isCashYearlyReportsLoading,
    CashYearlyReports,
    isCashYearlyReportsError,
  } = useSelector((state) => state.CashYearlyReports);

  const fetchData = useCallback(() => {
    if (!year) return;

    // 🔥 condition here
    if (year === "all") {
      dispatch(fetchCashYearlyReports({ type: "all" }));
    } else {
      dispatch(fetchCashYearlyReports({ type: "year", year }));
    }
  }, [dispatch, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isCashYearlyReportsLoading,
    CashYearlyReports,
    isCashYearlyReportsError,
    refetch: fetchData,
  };
}
