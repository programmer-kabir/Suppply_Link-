import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvestInstallments } from "../../Redux/Investores/Installments/investInstallments";

export default function useInvestInstallment(card_no) {
  const dispatch = useDispatch();

  const {
    investInstallments,
    inInvestInstallmentsLoading,
    isInvestInstallmentsError,
  } = useSelector((state) => state.investInstallments);

  useEffect(() => {
    if (card_no) {
      dispatch(fetchInvestInstallments(card_no));
    }
  }, [dispatch, card_no]);

  return {
    investInstallments,
    inInvestInstallmentsLoading,
    isInvestInstallmentsError,
  };
}
