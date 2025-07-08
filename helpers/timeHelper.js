export const formatTimeSpent = (timeSpent) => {
  if (typeof timeSpent !== "number" || timeSpent < 0) {
    throw new Error("timeSpent must be a non-negative number");
  }

  if (timeSpent < 60) {
    return `${timeSpent} mins`;
  }

  const hours = Math.floor(timeSpent / 60);
  const minutes = timeSpent % 60;

  let result = hours === 1 ? "1 hour" : `${hours} hours`;

  if (minutes > 0) {
    result += ` ${minutes} mins`;
  }

  return result;
};

export const getDateFormatted = (passed) => {
  const date = passed ? new Date(passed) : new Date();
  const dateStr =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");
  return dateStr;
};

export const getDateFormattedName = (passed) => {
  const date = passed ? new Date(passed) : new Date();
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatted;
};

export const getRelativeDateString = (inputDate) => {
  const now = new Date();
  const date = new Date(inputDate);

  // Normalize to midnight to compare only date, not time
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const msPerDay = 24 * 60 * 60 * 1000;
  const dayDiff = Math.round((startOfDay(date) - startOfDay(now)) / msPerDay);

  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  if (dayDiff === -1) return "Yesterday";
  if (dayDiff > 1 && dayDiff < 30) return `in ${dayDiff} days`;
  if (dayDiff < -1 && dayDiff > -30) return `${-dayDiff} days ago`;

  // Handle months
  const monthDiff =
    (date.getFullYear() - now.getFullYear()) * 12 +
    (date.getMonth() - now.getMonth());

  if (monthDiff === 1) return "in 1 month";
  if (monthDiff === -1) return "1 month ago";
  if (monthDiff > 1) return `in ${monthDiff} months`;
  if (monthDiff < -1) return `${-monthDiff} months ago`;

  // Fallback to year if months are too far apart
  const yearDiff = date.getFullYear() - now.getFullYear();
  if (yearDiff === 1) return "in 1 year";
  if (yearDiff === -1) return "1 year ago";
  if (yearDiff > 1) return `in ${yearDiff} years`;
  if (yearDiff < -1) return `${-yearDiff} years ago`;

  return "Unknown";
};
