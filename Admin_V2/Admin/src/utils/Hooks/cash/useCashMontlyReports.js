import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCashMonthlyReports } from "../../../Redux/Cash/CashMonthlyReportSlice";
export default function useCashMonthlyReports(month) {
  const dispatch = useDispatch();
  const {
    isCashMonthlyReportsLoading,
    CashMonthlyReports,
    isCashMonthlyReportsError,
  } = useSelector((state) => state.CashMonthlyReports);

  const fetchData = useCallback(() => {
    if (month) {
      dispatch(fetchCashMonthlyReports({ month }));
    }
  }, [dispatch, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isCashMonthlyReportsLoading,
    CashMonthlyReports,
    isCashMonthlyReportsError,
    refetch: fetchData,
  };
}
