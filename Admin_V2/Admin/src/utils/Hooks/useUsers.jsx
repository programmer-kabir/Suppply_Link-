import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../Redux/Users/UsersSlice";

export default function useUsers() {
  const dispatch = useDispatch();

  const { isUsersLoading, users, isUsersError } = useSelector(
    (state) => state.users
  );

  const fetch = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isUsersLoading,
    users,
    isUsersError,
    refetch: fetch,
  };
}
