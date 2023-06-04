import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";

export const dateFormat = (timestamp) => {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const chatDateFormat = (ts) => {
  const date = new Date(ts);
  return formatDistanceToNow(date, { addSuffix: false });
};

export const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  const fullDate = format(date, "MMMM dd, yyyy");
  return fullDate;
};
