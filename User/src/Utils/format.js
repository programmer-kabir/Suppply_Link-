export const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
export const formatMoney = (n) =>
  toNumber(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatNumber = (n) =>
  toNumber(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
