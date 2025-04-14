import {
  getDateInFormatDMY,
  getDaysInMonth,
  getEndOfMonth,
  getLastDateOfMonth,
  getSecondsElapsedToday,
  getSecondsFromMonthStart,
  getTotalDaysInMonth,
} from "./dateHelper";

export const calculateEarningsCurrentMonth = (salary, jsDate) => {
  if (salary == 0 && !jsDate) {
    return {
      TperSecond: 0,
      TperMinute: 0,
      TperHour: 0,
      TperDay: 0,
      PMperSecond: 0,
      PMperMinute: 0,
      PMperHour: 0,
      PMperDay: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
    };
  } else {
    const selectedDate = jsDate;
    let monthSalary = salary;
    const date = getDateInFormatDMY(new Date(selectedDate));
    const [day, month, year] = date?.split("-").map(Number);
    const letStartDate = new Date(year, month - 1, 1);

    const today = new Date(); // actual current date

    let now, end;

    let msDiff;
    let seconds;
    let minutes;
    let hours;
    let days;

    let totalSeconds;
    let totalMinutes;
    let totalHours;
    let totalDays;
    let totalSecondsInToday;
    let totalSecondsTillNow;
    let totalSecondsTillEnd;

    let TperSecond;
    let TperMinute;
    let TperHour;
    let TperDay;

    let PMperSecond;
    let PMperMinute;
    let PMperHour;
    let PMperDay;

    let totalSalary = Number(monthSalary);
    let totalDaysInMonth = getDaysInMonth(selectedDate);
    let pocketSalary = totalDaysInMonth * 1000;

    now = getEndOfMonth(today);
    end = getEndOfMonth(today);

    msDiff = now - letStartDate;
    seconds = Math.floor(msDiff / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    days = Math.floor(hours / 24);

    totalSeconds = totalDaysInMonth * 24 * 60 * 60;
    totalMinutes = totalDaysInMonth * 24 * 60;
    totalHours = totalDaysInMonth * 24;
    totalDays = totalDaysInMonth;

    totalSecondsInToday = getSecondsElapsedToday(today);
    totalSecondsTillNow = getSecondsFromMonthStart(today);
    totalSecondsTillEnd = (end - letStartDate) / 1000;

    TperSecond = totalSalary / totalSeconds;
    TperMinute = totalSalary / totalMinutes;
    TperHour = totalSalary / totalHours;
    TperDay = totalSalary / totalDays;

    PMperSecond = pocketSalary / totalSeconds;
    PMperMinute = pocketSalary / totalMinutes;
    PMperHour = pocketSalary / totalHours;
    PMperDay = pocketSalary / totalDays;

    return {
      TperSecond,
      TperMinute,
      TperHour,
      TperDay,
      PMperSecond,
      PMperMinute,
      PMperHour,
      PMperDay,
      seconds,
      minutes,
      hours,
      days,
      totalSeconds,
      totalMinutes,
      totalHours,
      totalDays,
      totalSecondsInToday,
      totalSecondsTillNow,
      totalSecondsTillEnd,
    };
  }
};

export const calculateEarningsEarlierMonths = (salary, jsDate) => {
  if (salary == 0 && !jsDate) {
    return {
      TperSecond: 0,
      TperMinute: 0,
      TperHour: 0,
      TperDay: 0,
      PMperSecond: 0,
      PMperMinute: 0,
      PMperHour: 0,
      PMperDay: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
    };
  } else {
    const selectedDate = jsDate;
    let monthSalary = salary;
    const date = getDateInFormatDMY(new Date(selectedDate));
    const [day, month, year] = date?.split("-").map(Number);
    const letStartDate = new Date(year, month - 1, 1);

    let now;

    let msDiff;
    let seconds;
    let minutes;
    let hours;
    let days;

    let totalSeconds;
    let totalMinutes;
    let totalHours;
    let totalDays;
    let totalSecondsInToday;

    let TperSecond;
    let TperMinute;
    let TperHour;
    let TperDay;

    let PMperSecond;
    let PMperMinute;
    let PMperHour;
    let PMperDay;

    let totalSalary = Number(monthSalary);
    let totalDaysInMonth = getDaysInMonth(selectedDate);
    let pocketSalary = totalDaysInMonth * 1000;

    now = getLastDateOfMonth(letStartDate);
    now = now.setDate(now.getDate() + 1);

    msDiff = now - letStartDate;
    seconds = Math.floor(msDiff / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    days = Math.floor(hours / 24);

    totalSeconds = totalDaysInMonth * 24 * 60 * 60;
    totalMinutes = totalDaysInMonth * 24 * 60;
    totalHours = totalDaysInMonth * 24;
    totalDays = totalDaysInMonth;

    totalSecondsInToday = 24 * 60 * 60;

    TperSecond = totalSalary / totalSeconds;
    TperMinute = totalSalary / totalMinutes;
    TperHour = totalSalary / totalHours;
    TperDay = totalSalary / totalDays;

    PMperSecond = pocketSalary / totalSeconds;
    PMperMinute = pocketSalary / totalMinutes;
    PMperHour = pocketSalary / totalHours;
    PMperDay = pocketSalary / totalDays;

    console.log({
      totalDaysInMonth,
      TperSecond,
      TperMinute,
      TperHour,
      TperDay,
      PMperSecond,
      PMperMinute,
      PMperHour,
      PMperDay,
      seconds,
      minutes,
      hours,
      days,
      totalSeconds,
      totalMinutes,
      totalHours,
      totalDays,
      totalSecondsInToday,
    });

    return {
      TperSecond,
      TperMinute,
      TperHour,
      TperDay,
      PMperSecond,
      PMperMinute,
      PMperHour,
      PMperDay,
      seconds,
      minutes,
      hours,
      days,
      totalSeconds,
      totalMinutes,
      totalHours,
      totalDays,
      totalSecondsInToday,
    };
  }
};

export const isInEarlierMonth = (dateToCheck) => {
  const today = new Date();
  const checkYear = dateToCheck.getFullYear();
  const checkMonth = dateToCheck.getMonth();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return (
    checkYear < currentYear ||
    (checkYear === currentYear && checkMonth < currentMonth)
  );
};

export const formatIndianNumber = (num, precision = 0) => {
  let inner = Number(num)?.toFixed(precision);
  const number = inner?.toString().split(".");
  let integerPart = number?.[0];
  const decimalPart = number?.[1] ? "." + number?.[1] : "";

  // First split last 3 digits
  const lastThree = integerPart?.slice(-3);
  const otherDigits = integerPart?.slice(0, -3);

  const formatted =
    otherDigits?.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherDigits ? "," : "") +
    lastThree;

  return formatted + decimalPart;
};
