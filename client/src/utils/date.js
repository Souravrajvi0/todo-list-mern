import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  isValid,
} from 'date-fns';

export const weekStartsOn = 1; // Monday

export const getWeekDays = (ref = new Date()) => {
  const start = startOfWeek(ref, { weekStartsOn });
  const end = endOfWeek(ref, { weekStartsOn });
  return eachDayOfInterval({ start, end });
};

export const weekStartISO = (ref = new Date()) =>
  startOfWeek(ref, { weekStartsOn }).toISOString();

export const formatDayLabel = (date) => format(date, 'EEE');
export const formatDayNum = (date) => format(date, 'dd');
export const formatLongDate = (date) => format(date, 'EEEE d, MMMM');
export const formatShortDate = (date) => format(date, 'MMM d, yyyy');

export const toDateInput = (date) => format(date, 'yyyy-MM-dd');

export const parseTaskDate = (value) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const d = typeof value === 'string' ? parseISO(value) : new Date(value);
  return isValid(d) ? d : new Date();
};

export const sameDay = (a, b) => isSameDay(parseTaskDate(a), parseTaskDate(b));
