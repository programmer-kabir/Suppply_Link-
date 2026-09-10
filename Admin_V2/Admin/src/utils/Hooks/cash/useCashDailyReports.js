import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCashDailyReports } from "../../../Redux/Cash/CashDailyReportSlice";
export default function useCashDailyReports(date) {
  const dispatch = useDispatch();

  const {
    isDailyCashReportsLoading,
    DailyCashReports,
    isProfitReinvestCardsError,
  } = useSelector((state) => state.DailyCashReports);

  const fetchData = useCallback(() => {
    if (date) {
      dispatch(fetchCashDailyReports({ date }));
    }
  }, [dispatch, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isDailyCashReportsLoading,
    DailyCashReports,
    isProfitReinvestCardsError,
    refetch: fetchData,
  };
}
