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
