import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Provider/AuthProvider";

const useTodayWorkSessions = () => {
  const { user } = useAuth();

  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_LOCALHOST_KEY;

  const fetchToday = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/EmployerAttendance/get_today.php?employee_id=${user.id}`
      );

      if (res.data.success) {
        setTodayData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, [user]);

  return {
    todayData,
    loading,
    refetch: fetchToday, // 🔥 important
  };
};

export default useTodayWorkSessions;