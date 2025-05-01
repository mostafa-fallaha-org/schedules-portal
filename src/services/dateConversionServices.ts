export function formatToAmPm(time24: string): string {
  const date = new Date(`1970-01-01T${time24}`);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatTimeFromDatetime(datetimeString: string): string {
  const date = new Date(datetimeString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid datetime: ${datetimeString}`);
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric", // 1–12
    minute: "2-digit", // 00–59
    second: "2-digit", // 00–59
    hour12: true, // AM/PM
  });
}

export function formatDateFromDatetime(datetimeString: string): string {
  const date = new Date(datetimeString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid datetime: ${datetimeString}`);
  }
  // zero-pad helper
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

export function getWeekdayFromDatetime(datetimeString: string): string {
  const date = new Date(datetimeString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid datetime: ${datetimeString}`);
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long", // "Monday", "Tuesday", ...
  });
}
