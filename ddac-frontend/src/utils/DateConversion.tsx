export const formatDate = (dateInput: string) => {
  const date = new Date(dateInput);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};

export const reverseFormatDate = (formatted: string) => {
  const date = new Date(formatted);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};
