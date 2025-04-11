export const getCurrentDayIdentifier = () => {
  const date = new Date("2025-08-01");
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formatted = date.toLocaleDateString("en-GB", options);

  return formatted;
};

export const getDateInFormatDMY = () => {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const formatted = `${day}-${month}-${year}`;

  return formatted;
};

export const getFormattedDateWords = (dateArg) => {
  const dateString = dateArg; // dd-mm-yyyy

  const [day, month, year] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}`); // yy

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = date.toLocaleDateString("en-US", options);

  return formatted;
};
