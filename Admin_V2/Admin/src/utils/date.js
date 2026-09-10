export const addMonths = (dateString, monthsToAdd) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  date.setMonth(date.getMonth() + monthsToAdd);

  if (date.getDate() !== day) date.setDate(0);

  return date.toISOString().split("T")[0];
};
