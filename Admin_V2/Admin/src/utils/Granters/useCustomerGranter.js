import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerGranters } from "../../Redux/Customers/CustomerGranter/CustomerGranterSlice";

export default function useCustomerGranter() {
  const dispatch = useDispatch();

  const { isCustomerGranterLoading, CustomerGranter, isCustomerGranterError } =
    useSelector((state) => state.CustomerGranter);

  const fetch = useCallback(() => {
    dispatch(fetchCustomerGranters());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isCustomerGranterLoading,
    CustomerGranter,
    isCustomerGranterError,
    refetch: fetch,
  };
}
