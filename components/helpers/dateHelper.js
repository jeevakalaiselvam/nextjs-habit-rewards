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

export const getSecondsElapsedToday = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const diffMs = date.getTime() - startOfDay.getTime();
  return Math.floor(diffMs / 1000);
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

export const generateDailyTimestamps = (
  dateOldFormat,
  ifSelectedDateIsCurrentMonth
) => {
  const [day, month, year] = dateOldFormat.split("-").map(Number);
  const startDate = new Date(
    year,
    month - 1,
    ifSelectedDateIsCurrentMonth ? 1 : day
  );
  const now = new Date();

  const isSameMonth =
    now.getFullYear() === startDate.getFullYear() &&
    now.getMonth() === startDate.getMonth();

  const endDate =
    ifSelectedDateIsCurrentMonth && isSameMonth
      ? now
      : new Date(year, month, 0); // last day of month

  const dates = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dd = String(current.getDate()).padStart(2, "0");
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const yyyy = current.getFullYear();
    dates.push(`${dd}-${mm}-${yyyy}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const getFifteenth = (date) => {
  const fifteenth = new Date(date);
  fifteenth.setDate(15);
  return fifteenth;
};

export const getSecondsFromMonthStart = () => {
  // Get current date in IST
  const now = new Date();

  // Adjust for IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const nowIST = new Date(now.getTime() + istOffset);

  // Get start of the current month (e.g., April 1, 2025, 00:00:00 IST)
  const startOfMonth = new Date(
    nowIST.getFullYear(),
    nowIST.getMonth(),
    1,
    0,
    0,
    0,
    0
  );

  // Calculate difference in milliseconds
  const diffMs = nowIST - startOfMonth;

  // Convert to seconds (integer)
  const seconds = Math.floor(diffMs / 1000);

  return seconds;
};

export const generateHourlyTimestamps = (
  dateOldFormat,
  ifSelectedDateIsCurrentMonth
) => {
  const [day, month, year] = dateOldFormat.split("-").map(Number);
  const startDate = new Date(
    year,
    month - 1,
    ifSelectedDateIsCurrentMonth ? 1 : day,
    0,
    0,
    0,
    0
  );
  const now = new Date();
  const timestamps = [];

  const endDate = ifSelectedDateIsCurrentMonth
    ? now
    : new Date(year, month - 1, day, 23, 59, 59, 999);

  let current = new Date(startDate);

  while (current <= endDate) {
    const dd = String(current.getDate()).padStart(2, "0");
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const yyyy = current.getFullYear();
    const hour = current.getHours();
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";

    timestamps.push(`${dd}-${mm}-${yyyy} ${hour12} ${ampm}`);
    current.setHours(current.getHours() + 1);
  }

  return timestamps;
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
