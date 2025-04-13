export const getCurrentDayIdentifier = () => {
  const date = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formatted = date.toLocaleDateString("en-GB", options);

  return formatted;
};

export const getFirstDateOfMonth = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return `01-${month}-${year}`;
};

export const getFirstDateOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const getEndOfMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0, 23, 59, 59, 999);
};

export const getDateInFormatDMY = (arg) => {
  let date;
  if (arg) {
    date = new Date(arg);
  } else {
    date = new Date();
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const formatted = `${day}-${month}-${year}`;

  return formatted;
};

export const getTotalDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

export const getFormattedDateWords = (dateArg) => {
  const dateString = getDateInFormatDMY(new Date(dateArg)); // dd-mm-yyyy

  const [day, month, year] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}`); // yy

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = date.toLocaleDateString("en-US", options);

  return formatted;
};

export const formatDateToMonthYear = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

// Helper to parse date
const getStartDate = (dateString) => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const generateMonthlyTimestamps = (dateString) => {
  const startDate = new Date(getStartDate(getFirstDateOfMonth(dateString)));
  const now = new Date();
  const monthsArray = [];

  let current = new Date(startDate);

  while (current <= now) {
    const monthStr = `${current
      .toLocaleDateString("en-GB", { month: "2-digit", year: "numeric" })
      .replace("/", "-")}`;

    monthsArray.push(monthStr);
    current.setMonth(current.getMonth() + 1);
  }

  return monthsArray;
};

export const generateDailyTimestamps = (dateString) => {
  const startDate = new Date(getStartDate(getFirstDateOfMonth(dateString)));
  const daysArray = [];

  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  let current = new Date(startDate);

  while (current.getMonth() === month) {
    const dateStr = current.toLocaleDateString("en-GB").split("/").join("-");
    daysArray.push(dateStr);
    current.setDate(current.getDate() + 1);
  }

  return daysArray;
};

export const generateHourlyTimestamps = (dateString) => {
  const startDateStr = getFirstDateOfMonth(dateString); // dd-mm-yyyy
  const [day, month, year] = startDateStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const now = new Date();

  const hoursArray = [];
  let current = new Date(startDate);

  while (current <= now) {
    const dateStr = current
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");

    let hour = current.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    const hourStr = `${dateStr} ${hour.toString().padStart(2, "0")} ${ampm}`;
    hoursArray.push(hourStr);

    current.setHours(current.getHours() + 1);
  }

  return hoursArray;
};

export const getDDMMYYFromUTC = (utcString) => {
  const date = new Date(Date.parse(utcString)); // Ensures proper UTC parsing
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

export const utcToLocal = (utcString) => {
  const localDate = new Date(utcString);
  return localDate; // or .toLocaleDateString() if you want only the date
};

export const isSameMonthUTCZGMT = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1?.getFullYear() === d2?.getFullYear() && d1?.getMonth() === d2?.getMonth()
  );
};

export const getDaysInMonth = (date) => {
  if (date) {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    return new Date(year, month + 1, 0).getDate();
  } else {
    return new Date().getDate();
  }
};

export const isInEarlierMonth = (dateToCheck, referenceDate = new Date()) => {
  const checkYear = dateToCheck?.getFullYear();
  const checkMonth = dateToCheck?.getMonth();

  const refYear = referenceDate?.getFullYear();
  const refMonth = referenceDate?.getMonth();

  return (
    checkYear < refYear || (checkYear === refYear && checkMonth < refMonth)
  );
};

export const getLastDateOfMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0); // 0th day of next month = last day of current month
};
