/**
 * Week helpers — weeks run Monday → Sunday (assignment requirement).
 */

const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

/** Monday 00:00 of the week containing `date` */
const getWeekStart = (date = new Date()) => {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

/** Sunday 23:59:59 of the week containing `date` */
const getWeekEnd = (date = new Date()) => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return endOfDay(end);
};

module.exports = {
  startOfDay,
  endOfDay,
  getWeekStart,
  getWeekEnd,
};
