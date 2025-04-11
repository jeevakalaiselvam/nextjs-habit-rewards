export const getCurrentDayIdentifier = () => {
  const date = new Date("2025-08-01");
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formatted = date.toLocaleDateString("en-GB", options);

  return formatted;
};
