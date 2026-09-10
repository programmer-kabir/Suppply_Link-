import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockMobiles } from "../../Redux/MobileInventory/MobileAnalyticsSlice";

export default function useMobileInventory() {
  const dispatch = useDispatch();

  const {
    isStockMobilesLoading,
    stockMobiles,
    isStockMobilesError,
  } = useSelector((state) => state.stockMobiles);

  const fetch = useCallback(() => {
    dispatch(fetchStockMobiles());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isStockMobilesLoading,
    stockMobiles,
    isStockMobilesError,
    refetch: fetch,
  };
}
