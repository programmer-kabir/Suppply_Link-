import { useEffect } from "react";

// 🔥 Auto refetch hook
export const useLiveUpdate = (refetch, interval = 5000) => {
  useEffect(() => {
    if (!refetch) return;

    const timer = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(timer);
  }, [refetch, interval]);
};