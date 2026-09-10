import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstallmentCards } from "../../Redux/Customers/InstallmentCards/InstallmentCardSlice";

export default function useCustomerInstallmentCards() {
  const dispatch = useDispatch();

  const {
    isCustomerInstallmentsCardsLoading,
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
  } = useSelector((state) => state.customerInstallmentCards);

  const fetch = useCallback(() => {
    dispatch(fetchInstallmentCards());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isCustomerInstallmentsCardsLoading,
    customerInstallmentCards,
    isCustomerInstallmentsCardsError,
    refetch: fetch,
  };
}
