export const generateIdForBacklog = (name) => {
  if (!name || typeof name !== "string" || name.length === 0) {
    throw new Error("Invalid name input");
  }

  const firstLetter = name[0].toUpperCase();
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${firstLetter}${year}${month}${day}${hours}${minutes}`;
};
