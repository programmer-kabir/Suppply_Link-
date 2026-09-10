import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvestProfitHistory } from "../../Redux/ProfitHistory/investorsProfitHistorySlice";

export default function useInvestorProfitHistory() {
  const dispatch = useDispatch();

  const {
    investorProfitHistory,
    isInvestProfitHistoryLoading,
    isInvestProfitHistoryError,
  } = useSelector((state) => state.investorProfitHistory);

  useEffect(() => {
    dispatch(fetchInvestProfitHistory());
  }, [dispatch]);

  return {
    investorProfitHistory,
    isInvestProfitHistoryLoading,
    isInvestProfitHistoryError,
  };
}
