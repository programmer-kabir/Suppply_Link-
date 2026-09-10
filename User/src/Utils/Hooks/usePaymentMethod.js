import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPaymentMethod } from "../../Redux/PaymentMethod/paymentMethodSlice";

export default function usePaymentMethod(user_id) {
  const dispatch = useDispatch();

  const { paymentMethods, isPaymentMethodsLoading, isPaymentMethodsError } =
    useSelector((state) => state.paymentMethods);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchAllPaymentMethod(user_id));
    }
  }, [dispatch, user_id]);

  return {
    paymentMethods,
    isPaymentMethodsLoading,
    isPaymentMethodsError,
  };
}
