import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerApplications } from "../../../Redux/Applications/customerApplicationFromSlice";

export default function useCustomerApplicationFrom() {
  const dispatch = useDispatch();

  const {
    isCustomerApplicationsLoading,
    customerApplications,
    isCustomerApplicationsError,
  } = useSelector((state) => state.customerApplications);

  const fetch = useCallback(() => {
    dispatch(fetchCustomerApplications());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isCustomerApplicationsLoading,
    customerApplications,
    isCustomerApplicationsError,
    refetch: fetch,
  };
}
