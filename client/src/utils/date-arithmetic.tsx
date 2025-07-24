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

  const firstDayOfMonth = date.with({ day: 1 });
  const firstDowOfMonth = firstDayOfMonth.dayOfWeek;

  const daysBeforeFirstOfMonth = (firstDayOfMonth.daysInWeek + firstDowOfMonth - START_OF_WEEK) %
    firstDayOfMonth.daysInWeek;

  const firstDayInView = firstDayOfMonth.subtract({ days: daysBeforeFirstOfMonth });

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

  const daysBefore = (date.daysInWeek + date.dayOfWeek - START_OF_WEEK) % date.daysInWeek;

  const firstDayInView = date.subtract({ days: daysBefore });

  return firstDayInView;
};
