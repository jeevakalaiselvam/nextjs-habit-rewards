import {
  getDateInFormatDMY,
  getDaysInMonth,
  getLastDateOfMonth,
} from "./dateHelper";

export const calculateEarnings = (salary, jsDate) => {
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

    let now;

    const isSameMonthAndYear =
      today?.getFullYear() === selectedDate?.getFullYear() &&
      today?.getMonth() === selectedDate?.getMonth();

    console.log(
      today?.getFullYear(),
      selectedDate?.getFullYear(),
      today?.getMonth(),
      letStartDate?.getMonth()
    );

    let msDiff;
    let seconds;
    let minutes;
    let hours;
    let days;

    let TperSecond;
    let TperMinute;
    let TperHour;
    let TperDay;

    let PMperSecond;
    let PMperMinute;
    let PMperHour;
    let PMperDay;

    let totalSalary = Number(monthSalary);
    let pocketSalary = getDaysInMonth(selectedDate) * 1000;

    if (isSameMonthAndYear) {
      now = today;

      msDiff = now - letStartDate;
      seconds = Math.floor(msDiff / 1000);
      minutes = Math.floor(seconds / 60);
      hours = Math.floor(minutes / 60);
      days = Math.floor(hours / 24);

      TperSecond = totalSalary / seconds;
      TperMinute = totalSalary / minutes;
      TperHour = totalSalary / hours;
      TperDay = totalSalary / days;

      PMperSecond = pocketSalary / seconds;
      PMperMinute = pocketSalary / minutes;
      PMperHour = pocketSalary / hours;
      PMperDay = pocketSalary / days;
    } else {
      now = new Date(year, month, 0);

      msDiff = now - letStartDate;
      seconds = getDaysInMonth(letStartDate) * 24 * 60 * 60;
      minutes = getDaysInMonth(letStartDate) * 24 * 60;
      hours = getDaysInMonth(letStartDate) * 24;
      days = getDaysInMonth(letStartDate);

      TperSecond = totalSalary / seconds;
      TperMinute = totalSalary / minutes;
      TperHour = totalSalary / hours;
      TperDay = totalSalary / days;

      PMperSecond = pocketSalary / seconds;
      PMperMinute = pocketSalary / minutes;
      PMperHour = pocketSalary / hours;
      PMperDay = pocketSalary / days;
    }

    console.log({
      letStartDate,
      now,
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
