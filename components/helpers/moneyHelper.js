export const calculateEarnings = (salaryTimeline) => {
  const sorted = salaryTimeline
    .map((item) => {
      const rawDateParts = item.date.split("-"); // assuming format is "dd-mm-yyyy"
      const year = parseInt(rawDateParts[2], 10);
      const month = parseInt(rawDateParts[1], 10) - 1; // JS months are 0-based

      return {
        amountYearly: item.amountYearly,
        date: new Date(year, month, 1), // force to first of the month
      };
    })
    .sort((a, b) => a.date - b.date);

  const now = new Date();
  let totalEarned = 0;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    const startDate = current.date;
    const endDate = next
      ? new Date(next.date.getFullYear(), next.date.getMonth(), 1)
      : new Date(startDate.getFullYear() + 1, 0, 1); // Jan 1 next year fallback

    if (now < startDate) break;

    const effectiveEnd = now < endDate ? now : endDate;
    const secondsInRange = (effectiveEnd - startDate) / 1000;
    const earningsPerSecond = current.amountYearly / (365.25 * 24 * 60 * 60);

    totalEarned += secondsInRange * earningsPerSecond;
  }

  return totalEarned;
};
