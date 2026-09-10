// 🔥 Growth Calculation
export const calculateGrowth = (current, previous) => {
  // edge case
  if (!previous || previous === 0) {
    return {
      value: 0,
      label: "New",
      type: "neutral",
    };
  }

  const change = ((current - previous) / previous) * 100;

  return {
    value: Number(change.toFixed(2)),
    label:
      change > 0
        ? `+${change.toFixed(1)}%`
        : `${change.toFixed(1)}%`,
    type:
      change > 0 ? "up" : change < 0 ? "down" : "neutral",
  };
};



// 🔥 Alert System
export const generateAlerts = ({
  todaySales = 0,
  yesterdaySales = 0,
  todayExpense = 0,
  last7DaysExpenses = [],
  todayTransactions = 0,
}) => {
  const alerts = [];

  // 🔴 Sales Drop Alert
  if (yesterdaySales > 0) {
    const change =
      ((todaySales - yesterdaySales) / yesterdaySales) * 100;

    if (change < -30) {
      alerts.push({
        type: "danger",
        message: `Sales dropped ${Math.abs(change).toFixed(1)}%`,
      });
    }
  }

  // 🟠 Expense Spike Alert
  if (last7DaysExpenses.length > 0) {
    const avg =
      last7DaysExpenses.reduce((a, b) => a + b, 0) /
      last7DaysExpenses.length;

    if (todayExpense > avg * 1.5) {
      alerts.push({
        type: "warning",
        message: "Expense unusually high today",
      });
    }
  }

  // 🔵 No Activity Alert
  if (todayTransactions === 0) {
    alerts.push({
      type: "info",
      message: "No transactions today",
    });
  }

  // 🟢 Positive Growth Alert
  if (yesterdaySales > 0) {
    const change =
      ((todaySales - yesterdaySales) / yesterdaySales) * 100;

    if (change > 30) {
      alerts.push({
        type: "success",
        message: "Sales growing fast 🚀",
      });
    }
  }

  return alerts;
};