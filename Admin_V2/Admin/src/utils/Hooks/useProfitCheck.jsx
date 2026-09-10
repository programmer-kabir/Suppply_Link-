import { useCallback, useEffect, useState } from "react";

/**
 * Check if profit already generated for a given year & month
 */
export default function useProfitCheck(year, month) {
  const API_BASE = import.meta.env.VITE_LOCALHOST_KEY;

  const [checking, setChecking] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState(null);

  const checkMonth = useCallback(async () => {
    // invalid selection → not generated
    if (
      !year ||
      !month ||
      year === "All" ||
      month === "All" ||
      Number(month) < 1 ||
      Number(month) > 12
    ) {
      setGenerated(false);
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/profit_generator/check_month_generated.php?profit_year=${year}&profit_month=${month}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data?.success !== true) {
        throw new Error(data?.message || "Check failed");
      }

      setGenerated(!!data.generated);
    } catch (err) {
      setGenerated(false);
      setError(err?.message || "Network error");
    } finally {
      setChecking(false);
    }
  }, [API_BASE, year, month]);

  // 🔁 auto check when year/month changes
  useEffect(() => {
    checkMonth();
  }, [checkMonth]);

  return {
    checking,
    generated, // ✅ true = already generated
    error,
    recheck: checkMonth,
  };
}
