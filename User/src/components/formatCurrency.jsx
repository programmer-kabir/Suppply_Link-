export  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });