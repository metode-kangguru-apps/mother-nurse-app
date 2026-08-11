import { format } from "date-fns";

export function weekDifference(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
}

export function calculateStringDateTime(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = format(date, "MMM");
  const year = date.getFullYear().toString().slice(2);
  return `${day} ${month} \'${year}`;
}

export function isObjectContainUndefined(object: Record<string, any>) {
  return Object.values(object).includes(undefined);
}
