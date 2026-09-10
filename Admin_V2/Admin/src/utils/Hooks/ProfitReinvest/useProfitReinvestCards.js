import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfitReinvestCards } from "../../../Redux/AutoReinvest/profitAutoReinvestCardsSlice";

export default function useProfitReinvestCards() {
  const dispatch = useDispatch();

  const {
    isProfitReinvestCardsLoading,
    profitReinvestCards,
    isProfitReinvestCardsError,
  } = useSelector((state) => state.profitReinvestCards);
  const fetch = useCallback(() => {
    dispatch(fetchProfitReinvestCards());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isProfitReinvestCardsLoading,
    profitReinvestCards,
    isProfitReinvestCardsError,
    refetch: fetch,
  };
}
