import { formatISO } from "date-fns";

export const formatTime = (time: string | Date) => {
  return formatISO(new Date(time)); // Converts to ISO string
};

// convert the incoming time to a UTC Time
export const convertToUTC = (time: string | Date) => {
  const date = new Date(time);
  return new Date(
    date.getTime() + date.getTimezoneOffset() * 60000
  ).toISOString();
};
