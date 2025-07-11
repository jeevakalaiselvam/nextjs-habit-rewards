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

export const formatDate1 = (date) => {
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const day = getOrdinal(date.getDate());
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
export const formatDate2 = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};
