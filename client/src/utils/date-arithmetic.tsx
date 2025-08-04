import { Temporal } from '@js-temporal/polyfill';
import { START_OF_WEEK } from '../const/calendar.tsx';

/**
 * Get the first day visible in the month view.
 * @throws {RangeError} The value passed as argument to the `date` parameter is not a valid instance of {@link Temporal.PlainDate}.
 */
export const firstDayInMonthView = (date: Temporal.PlainDate): Temporal.PlainDate => {
  if (!date || !(date instanceof Temporal.PlainDate)) {
    throw new RangeError('date argument must be a Temporal.PlainDate instance');
  }

  const firstDayOfMonth: Temporal.PlainDate = date.with({ day: 1 });
  const firstDowOfMonth: number = firstDayOfMonth.dayOfWeek;

  const daysBeforeFirstOfMonth: number = (firstDayOfMonth.daysInWeek + firstDowOfMonth - START_OF_WEEK) %
    firstDayOfMonth.daysInWeek;

  const firstDayInView: Temporal.PlainDate = firstDayOfMonth.subtract({ days: daysBeforeFirstOfMonth });

  return firstDayInView;
};

/**
 * Get the first day visible in the week view.
 * @throws {RangeError} The value passed as argument to the `date` parameter is not a valid instance of {@link Temporal.PlainDate}.
 */
export const firstDayInWeekView = (date: Temporal.PlainDate): Temporal.PlainDate => {
  if (!date || !(date instanceof Temporal.PlainDate)) {
    throw new RangeError('date argument must be a Temporal.PlainDate instance');
  }

  const daysBefore: number = (date.daysInWeek + date.dayOfWeek - START_OF_WEEK) % date.daysInWeek;

  const firstDayInView: Temporal.PlainDate = date.subtract({ days: daysBefore });

  return firstDayInView;
};
