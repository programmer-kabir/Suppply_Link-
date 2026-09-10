import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupplierPayments } from "../../Redux/SupplierPayment/SupplierPaymentAnalyticsSlice";

export default function useSupplierPayments() {
  const dispatch = useDispatch();

  const {
    isSupplierPaymentsLoading,
    supplierPayments,
    isSupplierPaymentsError,
  } = useSelector((state) => state.supplierPayments);

  const fetch = useCallback(() => {
    dispatch(fetchSupplierPayments());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isSupplierPaymentsLoading,
    supplierPayments,
    isSupplierPaymentsError,
    refetch: fetch,
  };
}
