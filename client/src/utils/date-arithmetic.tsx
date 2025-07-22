import { Temporal } from '@js-temporal/polyfill';

/**
 * @throws {RangeError} The value passed as argument to the `date` parameter is not a valid instance of {@link Temporal.PlainDate}.
 */
export const firstDayInMonthView = (date: Temporal.PlainDate): Temporal.PlainDate => {
  if (!date || !(date instanceof Temporal.PlainDate)) {
    throw new RangeError('date argument must be a Temporal.PlainDate instance');
  }

  const START_OF_WEEK = 1;

  const firstDayOfMonth = date.with({ day: 1 });
  const firstDowOfMonth = firstDayOfMonth.dayOfWeek;

  const daysBeforeFirstOfMonth = (firstDayOfMonth.daysInWeek + firstDowOfMonth - START_OF_WEEK) %
    firstDayOfMonth.daysInWeek;

  const firstDayInView = firstDayOfMonth.subtract({ days: daysBeforeFirstOfMonth });

  return firstDayInView;
};
