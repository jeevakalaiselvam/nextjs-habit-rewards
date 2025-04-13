import { getDateInFormatDMY, getDaysInMonth } from "./dateHelper";

export const calculateEarnings = (salary, jsDate) => {
  if (salary == 0) {
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
    const selectedDate = jsDate?.$d;
    let monthSalary = salary;
    const date = getDateInFormatDMY(new Date(selectedDate));
    const [day, month, year] = date?.split("-").map(Number);
    const letStartDate = new Date(year, month - 1, 1);

    const today = new Date(); // actual current date

    let now;

    const isSameMonthAndYear =
      letStartDate.getFullYear() === today.getFullYear() &&
      letStartDate.getMonth() === today.getMonth();

    if (isSameMonthAndYear) {
      now = today;
    } else {
      now = new Date(year, month, 0); // day 0 of next month = last day of given month
    }

    const msDiff = now - letStartDate;
    const seconds = Math.floor(msDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let totalSalary = Number(monthSalary);
    let pocketSalary = getDaysInMonth(selectedDate) * 1000;

    console.log("DIFFERENCE TOTAL", {
      letStartDate,
      now,
      salary,
      pocketSalary,
      msDiff,
      seconds,
      minutes,
      hours,
      days,
    });

    const TperSecond = totalSalary / seconds;
    const TperMinute = totalSalary / minutes;
    const TperHour = totalSalary / hours;
    const TperDay = totalSalary / days;

    const PMperSecond = pocketSalary / seconds;
    const PMperMinute = pocketSalary / minutes;
    const PMperHour = pocketSalary / hours;
    const PMperDay = pocketSalary / days;

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
    };
  }
};

export const calculateEarningsToday = (salary, jsDate) => {
  if (salary == 0) {
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
    const selectedDate = jsDate?.$d;
    let monthSalary = salary;
    const date = getDateInFormatDMY(new Date(selectedDate));
    const [day, month, year] = date?.split("-").map(Number);
    const letStartDate = new Date(new Date().setHours(0, 0, 0, 0));

    const today = new Date(); // actual current date

    let now;

    const isSameMonthAndYear =
      letStartDate.getFullYear() === today.getFullYear() &&
      letStartDate.getMonth() === today.getMonth();

    if (isSameMonthAndYear) {
      now = today;
    } else {
      now = new Date(selectedDate);
      now.setDate(now.getDate() + 1); // day 0 of next month = last day of given month
    }

    const msDiff = now - letStartDate;
    const seconds = Math.floor(msDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let totalSalary = Number(monthSalary);
    let pocketSalary = getDaysInMonth(selectedDate) * 1000;

    const TperSecond = totalSalary / seconds;
    const TperMinute = totalSalary / minutes;
    const TperHour = totalSalary / hours;
    const TperDay = totalSalary / days;

    const PMperSecond = pocketSalary / seconds;
    const PMperMinute = pocketSalary / minutes;
    const PMperHour = pocketSalary / hours;
    const PMperDay = pocketSalary / days;

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

export const formatIndianNumber = (num) => {
  const number = num?.toString().split(".");
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
