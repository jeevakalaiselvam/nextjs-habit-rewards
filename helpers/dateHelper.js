export const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Get ordinal suffix
  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  // Format time in 12-hour clock
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  const minuteStr = minutes.toString().padStart(2, "0");

  return `${day}${ordinal} ${month}, ${hour12}:${minuteStr} ${ampm}`;
};
