import { v4 as uuidv4 } from "uuid";
import { differenceInMinutes, formatDistanceStrict } from "date-fns";

export function generateId(): string {
  return uuidv4();
}

export function formatDuration(
  startedAt: string,
  completedAt: string | null
): string {
  if (!completedAt) return "In progress";
  const start = new Date(startedAt);
  const end = new Date(completedAt);
  return formatDistanceStrict(start, end);
}

export function getDurationMinutes(
  startedAt: string,
  completedAt: string | null
): number | null {
  if (!completedAt) return null;
  return differenceInMinutes(new Date(completedAt), new Date(startedAt));
}

export function cn(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
