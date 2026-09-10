import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstallmentsPayments } from "../../../Redux/Customers/InstallmentPayment/InstallmentPaymentSlice";

export default function useCustomerInstallmentPayments() {
  const dispatch = useDispatch();

  const {
    isCustomerInstallmentsPaymentsLoading,
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
  } = useSelector((state) => state.customerInstallmentPayments);

  const fetch = useCallback(() => {
    dispatch(fetchInstallmentsPayments());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isCustomerInstallmentsPaymentsLoading,
    customerInstallmentPayments,
    isCustomerInstallmentsPaymentsError,
    refetch: fetch,
  };
}
