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
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${weekday}, ${day}${suffix} ${month} '${year}   ${time}`;
}
