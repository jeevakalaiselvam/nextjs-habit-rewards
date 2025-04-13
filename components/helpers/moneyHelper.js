import { getDateInFormatDMY } from "./dateHelper";

export const calculateEarnings = (salaryTimeline) => {
  if (salaryTimeline?.length > 0) {
    let firstEntry = salaryTimeline?.[0];
    let yearlySalary = firstEntry?.salary;
    const date = getDateInFormatDMY(new Date(firstEntry?.date));
    const [day, month, year] = date.split("-").map(Number);
    const letStartDate = new Date(year, month - 1, 1);

    const now = new Date();

    const msDiff = now - letStartDate;
    const seconds = Math.floor(msDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // approx months

    let totalSalary = Number(yearlySalary);
    let pocketSalary = 365000;

    const TperSecond = totalSalary / (365 * 24 * 60 * 60);
    const TperMinute = totalSalary / (365 * 24 * 60);
    const TperHour = totalSalary / (365 * 24);
    const TperDay = totalSalary / 365;
    const TperMonth = totalSalary / 12;
    const TperYear = totalSalary;

    const PMperSecond = pocketSalary / (365 * 24 * 60 * 60);
    const PMperMinute = pocketSalary / (365 * 24 * 60);
    const PMperHour = pocketSalary / (365 * 24);
    const PMperDay = pocketSalary / 365;
    const PMperMonth = pocketSalary / 12;
    const PMperYear = pocketSalary;

    return {
      TperSecond,
      TperMinute,
      TperHour,
      TperDay,
      TperMonth,
      TperYear,
      PMperSecond,
      PMperMinute,
      PMperHour,
      PMperDay,
      PMperMonth,
      PMperYear,
      seconds,
      minutes,
      hours,
      days,
      months,
    };
  } else {
    return {};
  }
};

export const calculateEarningsToday = (salaryTimeline) => {
  if (salaryTimeline?.length > 0) {
    let firstEntry = salaryTimeline?.[0];
    let yearlySalary = firstEntry?.salary;
    const [day, month, year] = firstEntry.date.split("-").map(Number);
    const letStartDate = new Date(new Date().setHours(0, 0, 0, 0));

    const now = new Date();

    const msDiff = now - letStartDate;
    console.timeLog({ msDiff });
    const seconds = Math.floor(msDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // approx months

    let totalSalary = Number(yearlySalary);
    let pocketSalary = 365000;

    const TperSecond = totalSalary / (365 * 24 * 60 * 60);
    const TperMinute = totalSalary / (365 * 24 * 60);
    const TperHour = totalSalary / (365 * 24);
    const TperDay = totalSalary / 365;
    const TperMonth = totalSalary / 12;
    const TperYear = totalSalary;

    const PMperSecond = pocketSalary / (365 * 24 * 60 * 60);
    const PMperMinute = pocketSalary / (365 * 24 * 60);
    const PMperHour = pocketSalary / (365 * 24);
    const PMperDay = pocketSalary / 365;
    const PMperMonth = pocketSalary / 12;
    const PMperYear = pocketSalary;

    return {
      TperSecond,
      TperMinute,
      TperHour,
      TperDay,
      TperMonth,
      TperYear,
      PMperSecond,
      PMperMinute,
      PMperHour,
      PMperDay,
      PMperMonth,
      PMperYear,
      seconds,
      minutes,
      hours,
      days,
      months,
    };
  } else {
    return {};
  }
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
