import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstallmentsCards } from "../../Redux/Investores/InstallmentCards/investInstallmentCardsSlice";

export default function useInvestInstallmentCards() {
  const dispatch = useDispatch();

  const {
    investInstallmentCards,
    isInvestInstallmentsCardsLoading,
    isInvestInstallmentsCardsError,
  } = useSelector((state) => state.investInstallmentCards);

  useEffect(() => {
    dispatch(fetchInstallmentsCards());
  }, [dispatch]);

  return {
    investInstallmentCards,
    isInvestInstallmentsCardsLoading,
    isInvestInstallmentsCardsError,
  };
}
