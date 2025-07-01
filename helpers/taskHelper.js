export const generateShortId = (type) => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");

  const year = now.getFullYear().toString().slice(-2); // e.g. '25'
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());

  return `${type[0].toUpperCase()}${year}${month}${day}${hour}${minute}`;
};

export const getColorForType = (type) => {
  switch (type) {
    case "Analysis":
      return "#F2668B";
    case "Task":
      return "#3082ED";
    case "Inspire":
      return "#C068F2";
    case "Issue":
      return "#F54D41";
    case "Call":
      return "#F2D43D";
    case "Team":
      return "#7CEB7C";
    default:
      return "#000";
  }
};

export const formatZTime = (zTimeStr) => {
  const date = new Date(zTimeStr);

  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${day}${daySuffix} ${monthName}, ${year} ${hours}:${minutes}${ampm}`;
};
