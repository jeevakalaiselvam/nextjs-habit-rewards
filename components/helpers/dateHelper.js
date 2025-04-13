export const getCurrentDayIdentifier = () => {
  const date = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formatted = date.toLocaleDateString("en-GB", options);

  return formatted;
};

export const getDateInFormatDMY = (arg) => {
  let date;
  if (arg) {
    date = new Date(arg);
  } else {
    date = new Date();
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const formatted = `${day}-${month}-${year}`;

  return formatted;
};

export const getFormattedDateWords = (dateArg) => {
  const dateString = getDateInFormatDMY(new Date(dateArg)); // dd-mm-yyyy

  const [day, month, year] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}`); // yy

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = date.toLocaleDateString("en-US", options);

  return formatted;
};

export const generateHourlyTimestamps = (dateString) => {
  const startDateStr = dateString; // dd-mm-yyyy
  const [day, month, year] = startDateStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const now = new Date();

  const hoursArray = [];
  let current = new Date(startDate);

  while (current <= now) {
    const dateStr = current
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");

    let hour = current.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    const hourStr = `${dateStr} ${hour.toString().padStart(2, "0")} ${ampm}`;
    hoursArray.push(hourStr);

    current.setHours(current.getHours() + 1);
  }

  return hoursArray;
};
