 import { formatISO } from "date-fns";

export const formatTime = (time: string | Date) => {
  return formatISO(new Date(time)); // Converts to ISO string
};