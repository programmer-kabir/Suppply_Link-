import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfitAnalytics } from "../../Redux/ProfitAnalytics/ProfitAnalyticsSlice";

export default function useProfitAnalytics() {
  const dispatch = useDispatch();

  const { isProfitAnalyticsLoading, profitAnalytics, isUProfitAnalyticsError } =
    useSelector((state) => state.profitAnalytics);

  const fetch = useCallback(() => {
    dispatch(fetchProfitAnalytics());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isProfitAnalyticsLoading,
    profitAnalytics,
    isUProfitAnalyticsError,
    refetch: fetch,
  };
}
