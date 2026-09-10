import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInvestInstallments } from "../../Redux/Investores/AllInvestInstallments/allInvestInstallmentsSlice";

export default function useAllInvestInstalments() {
  const dispatch = useDispatch();

  const {
    allInvestInstallments,
    isAllInvestInstallmentsLoading,
    isAllInvestInstallmentsError,
  } = useSelector((state) => state.allInvestInstallments);

  useEffect(() => {
    dispatch(fetchAllInvestInstallments());
  }, [dispatch]);

  return {
    allInvestInstallments,
    isAllInvestInstallmentsLoading,
    isAllInvestInstallmentsError,
  };
}
