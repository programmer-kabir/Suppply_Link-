import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvestmentCards } from "../../Redux/Investors/InvestmentCards/investmentCardsSlice";

export default function useInvestmentCards() {
  const dispatch = useDispatch();

  const { investmentCards, isInvestmentCardsLoading, isInvestmentCardsError } =
    useSelector((state) => state.investmentCards);

  useEffect(() => {
    dispatch(fetchInvestmentCards());
  }, [dispatch]);

  return {
    investmentCards,
    isInvestmentCardsLoading,
    isInvestmentCardsError,
  };
}
