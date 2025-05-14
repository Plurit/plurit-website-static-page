const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getOrdinalSuffix(day: number): string {
  const suffixes: Record<number, string> = {
    1: "st",
    2: "nd",
    3: "rd",
  };

  if (day >= 11 && day <= 13) return "th";

  return suffixes[day % 10] || "th";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getUTCDate();
  const suffix = getOrdinalSuffix(day);

  const weekday = weekdays[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear().toString().slice(-2);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const time = `${hours}:${minutes} ${ampm}`;

  return `${weekday}, ${day}${suffix} ${month} '${year}   ${time}`;
}
