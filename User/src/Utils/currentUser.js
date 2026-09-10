import Loader from "../components/Loader/Loader";
import useAuth from "./Hooks/useAuth";
import useUsers from "./Hooks/useUsers";

const useCurrentUser = () => {
  const { user } = useAuth();
  const { users } = useUsers();

  if (!user || !users?.length) {
    return null;
  }

  const runningUser = users.find((u) => String(u.id) === String(user.id));

  return runningUser || null;
};

export default useCurrentUser;
