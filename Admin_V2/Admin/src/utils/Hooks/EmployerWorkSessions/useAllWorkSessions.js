import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Provider/AuthProvider";

const useAllWorkSessions = () => {
  const { user } = useAuth();

  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_LOCALHOST_KEY;

  const fetchAll = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/EmployerAttendance/get_all.php`,
        {
          params: {
            employee_id: user.id,
            roles: JSON.stringify(user.role), // 🔥 role array send
          },
        }
      );

      if (res.data.success) {
        setAllData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user]);

  return {
    allData,   // 🔥 rename clean
    loading,
    refetch: fetchAll,
  };
};

export default useAllWorkSessions;