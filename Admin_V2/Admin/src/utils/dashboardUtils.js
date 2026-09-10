export const sumBy = (arr, field) => {
  return arr?.reduce((total, item) => {
    return total + Number(item?.[field] || 0);
  }, 0);
};

export const matchDate = ({
  itemDate,
  filterType,
  selectedDate,
  selectedMonth,
  selectedYear,
}) => {
  if (!itemDate) return false;

  const cleanDate = itemDate.split(" ")[0];
  const today = new Date().toISOString().split("T")[0];

  if (filterType === "daily") {
    return cleanDate === (selectedDate || today);
  }

  if (filterType === "monthly" && selectedMonth) {
    return cleanDate.startsWith(selectedMonth);
  }

  if (filterType === "yearly" && selectedYear) {
    return cleanDate.startsWith(selectedYear);
  }

  return true;
};

export const generateDates = (start, end) => {
  const dates = [];
  let current = new Date(start);

  while (current <= new Date(end)) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const inRange = (date, startDate, endDate) => {
  if (!startDate || !endDate) return true;

  const clean = date.split(" ")[0];
  return clean >= startDate && clean <= endDate;
};

export const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export const groupByDate = (data, field, dateField, startDate, endDate) => {
  if (!startDate || !endDate) return [];

  const map = {};

  data?.forEach((item) => {
    const rawDate = item[dateField];
    if (!rawDate) return;

const date = rawDate.split(" ")[0];

if (!inRange(date, startDate, endDate)) return;

map[date] = (map[date] || 0) + Number(item[field] || 0);
  });

  const allDates = generateDates(startDate, endDate);

  return allDates.map((date) => ({
    date,
    value: map[date] || 0,
  }));
};

export const groupByMonth = (data, field, dateField, MONTHS) => {
  const map = {};
  const currentMonth = new Date().getMonth() + 1;

  data?.forEach((item) => {
    const raw = item[dateField];
    if (!raw) return;


const date = new Date(raw);
if (isNaN(date)) return;

const month = date.getMonth() + 1;
map[month] = (map[month] || 0) + Number(item[field] || 0);

  });

  return MONTHS.filter((m) => m.value <= currentMonth).map((m) => ({
    date: m.label,
    value: map[m.value] || 0,
  }));
};

export const getChartData = ({
data,
field,
dateField,
startDate,
endDate,
activePreset,
MONTHS,
}) => {
// 🔥 FIRST: check year
if (activePreset === "year") {
return groupByMonth(data, field, dateField, MONTHS);
}

// 🔹 THEN: range
if (startDate && endDate) {
return groupByDate(data, field, dateField, startDate, endDate);
}

return [];
};


export const applyPreset = (type) => {
  const today = new Date();
  let start, end;

  if (type === "7d") {
    end = today;
    start = new Date();
    start.setDate(today.getDate() - 6);
  }

  if (type === "30d") {
    end = today;
    start = new Date();
    start.setDate(today.getDate() - 29);
  }

  if (type === "month") {
    const firstDay = new Date();
    firstDay.setDate(1);


start = firstDay;
end = today;

  }

  if (type === "year") {
    const firstDay = new Date();
    firstDay.setDate(1);

   
start = firstDay;
end = today;

  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    activePreset: type,
  };
};
