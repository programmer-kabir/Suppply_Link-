import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCashReports } from "../../../Redux/Cash/CashReporSlice";
export default function useCashReports( ) {
  const dispatch = useDispatch();

  const {
    isCashReportsLoading,
    CashReports,
    isCashReportsError,
  } = useSelector((state) => state.CashReports);

  const fetchData = useCallback(() => {
 
      dispatch(fetchCashReports());

  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isCashReportsLoading,
    CashReports,
    isCashReportsError,
    refetch: fetchData,
  };
}
