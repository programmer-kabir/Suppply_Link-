export const calculatePrincipalProfit = (amount, costPrice, salePrice) => {
  const due = Number(amount) || 0;

  if (costPrice > 0 && salePrice > 0) {
    const principal = Number(((due * costPrice) / salePrice).toFixed(2));
    const profit = Number((due - principal).toFixed(2));
    return { principal, profit };
  }

  return { principal: 0, profit: 0 };
};
