export const calculateEarnings = (salaryTimeline) => {
  if (salaryTimeline?.length > 0) {
    let firstEntry = salaryTimeline?.[0];
    let yearlySalary = firstEntry?.amountYearly;
    const [day, month, year] = firstEntry.date.split("-").map(Number);
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

    console.log({
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
    });
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
