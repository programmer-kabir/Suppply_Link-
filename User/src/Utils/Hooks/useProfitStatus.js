// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCardProfitHistory } from "../../Redux/InvestmentProfitSatus/InvestmentProfitStatusSlice";

// export default function useProfitStatus({ cardId, year, month, investorId }) {
//   const dispatch = useDispatch();

//   const { profitHistory, isProfitHistoryLoading, isProfitHistoryError } =
//     useSelector((state) => state.profitHistory);

//   useEffect(() => {
//     dispatch(fetchCardProfitHistory({ cardId, year, month, investorId }));
//   }, [dispatch, cardId, year, month, investorId]);

//   return {
//     profitHistory,
//     isProfitHistoryLoading,
//     isProfitHistoryError,
//   };
// }
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardProfitHistory } from "../../Redux/Investores/InvestmentProfitSatus/InvestmentProfitStatusSlice";

export default function useProfitStatus({ cardId, year, month, investorId }) {
  const dispatch = useDispatch();

  const { profitHistory, isProfitHistoryLoading, isProfitHistoryError } =
    useSelector((state) => state.profitHistory);

  // debug logs (তুমি dev mode এ রেখে দেখতে পারো)
  useEffect(() => {
  }, [cardId, year, month, investorId]);

  const fetch = useCallback(() => {
    if (!cardId && !investorId) {
      return;
    }
    // যদি তোমার অ্যাকশন expects numbers, ensure type:
    const payload = {
      cardId: typeof cardId === "string" && /^\d+$/.test(cardId) ? Number(cardId) : cardId,
      year,
      month,
      investorId,
    };
    dispatch(fetchCardProfitHistory(payload));
  }, [dispatch, cardId, year, month, investorId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    profitHistory,
    isProfitHistoryLoading,
    isProfitHistoryError,
    refetch: fetch, // component থেকে manual refetch করার জন্য
  };
}
