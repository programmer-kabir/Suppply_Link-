import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfitReinvestInstallments } from "../../../Redux/AutoReinvest/profitAutoReinvestInstallmentsSlice";

export default function useProfitReinvestInstallments() {
  const dispatch = useDispatch();

  const {
    isProfitReinvestInstallmentsLoading,
    profitReinvestInstallments,
    isProfitReinvestInstallmentsError,
  } = useSelector((state) => state.profitReinvestInstallments);

  const fetch = useCallback(() => {
    dispatch(fetchProfitReinvestInstallments());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return {
    isProfitReinvestInstallmentsLoading,
    profitReinvestInstallments,
    isProfitReinvestInstallmentsError,
    refetch: fetch,
  };
}
