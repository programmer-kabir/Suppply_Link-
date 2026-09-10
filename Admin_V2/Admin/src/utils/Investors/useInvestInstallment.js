import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvestInstallments } from "../../Redux/Investors/InvestmentPayments/investInstallments";

export default function useInvestInstallment() {
  const dispatch = useDispatch();

  const {
    investInstallments,
    inInvestInstallmentsLoading,
    isInvestInstallmentsError,
  } = useSelector((state) => state.investInstallments);

  // initial fetch
  useEffect(() => {
      dispatch(fetchInvestInstallments());
  }, [dispatch, ]);

  // 🔥 manual refetch
  const refetch = () => {
      dispatch(fetchInvestInstallments());
  };

  return {
    investInstallments,
    inInvestInstallmentsLoading,
    isInvestInstallmentsError,
    refetch, // 👈 expose this
  };
}
