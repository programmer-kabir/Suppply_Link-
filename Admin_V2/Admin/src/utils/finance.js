export const calculatePrincipalProfit = (amount, cost, sale) => {
  const due = Number(amount) || 0;
  if (cost > 0 && sale > 0) {
    const principal = Number(((due * cost) / sale).toFixed(2));
    return { principal, profit: Number((due - principal).toFixed(2)) };
  }
  return { principal: 0, profit: 0 };
};
