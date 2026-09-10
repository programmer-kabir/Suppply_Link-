import { useMemo } from "react";
import useUsers from "../useUsers";

export default function useStaffUsers() {
  const { isUsersLoading, users = [], isUsersError } = useUsers();

  const staffUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(
      (u) => Array.isArray(u.roles) && u.roles.includes("staff"),
    );
  }, [users]);

  return {
    staffUsers,
    isStaffUsersLoading: isUsersLoading,
    isStaffUsersError: isUsersError,
  };
}
