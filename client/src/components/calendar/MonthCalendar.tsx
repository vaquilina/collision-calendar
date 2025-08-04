import { createEffect, createSignal, Index } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { WeekdayHeaders } from './WeekdayHeaders.tsx';

import { firstDayInMonthView } from '../../utils/date-arithmetic.tsx';
import { WEEKS_IN_MONTH_VIEW } from '../../const/calendar.tsx';

import type { Component } from 'solid-js';

/** A day in the month view, complete with metadata. */
export type MonthViewDay = {
  date: Temporal.PlainDate;
  isOutsideMonth?: boolean;
  isToday?: boolean;
};

/** A week in the month view, comprised of the week number and {@link MonthViewDay MonthViewDays} within. */
export type MonthViewWeek = {
  weekNumber: Temporal.PlainDate['weekOfYear'];
  days: MonthViewDay[];
};

interface MonthCalendarProps {
  date: Temporal.PlainDate;
}

/** Month view calendar. */
export const MonthCalendar: Component<MonthCalendarProps> = (props) => {
  const [weeks, setWeeks] = createSignal<MonthViewWeek[]>([]);
  const [days, setDays] = createSignal<MonthViewDay[]>([]);

  createEffect(() => {
    /* Get the first day in the view
     * e.g. If the 1st of the month falls on a Tuesday,
     *      the first day in the view would fall on the prior Sunday
     */
    const firstInView: Temporal.PlainDate = firstDayInMonthView(props.date);

    const today: Temporal.PlainDate = Temporal.Now.plainDateISO();

    const month: number = props.date.month;

    const daysInView: MonthViewDay[] = [{
      date: firstInView,
      isOutsideMonth: firstInView.month !== month,
      isToday: Temporal.PlainDate.compare(firstInView, today) === 0,
    }];

    let currDate: Temporal.PlainDate = firstInView;
    for (let i = 1; i < props.date.daysInWeek * WEEKS_IN_MONTH_VIEW; i++) {
      currDate = currDate.add({ days: 1 });
      daysInView.push({
        date: currDate,
        isOutsideMonth: currDate.month !== month,
        isToday: Temporal.PlainDate.compare(currDate, today) === 0,
      });
    }

    setDays(daysInView);

    const weeksOfYearInView: Set<number | undefined> = new Set(
      daysInView.map((day) => day.date.weekOfYear),
    );
    const weeksInView: MonthViewWeek[] = [];
    for (const weekNumber of weeksOfYearInView.keys()) {
      weeksInView.push({
        weekNumber,
        days: daysInView.filter((day) => day.date.weekOfYear === weekNumber),
      });
    }

    setWeeks(weeksInView);
  });

  return (
    <div class='month-calendar'>
      <WeekdayHeaders />
      <Index each={weeks()}>
        {(week, index) =>
          index === WEEKS_IN_MONTH_VIEW
            ? null
            : <div class={`week-number-container week${index + 1}`} data-week-of-year={week().weekNumber}></div>}
      </Index>
      <Index each={days()}>
        {(day, index) => (
          <div
            class={`day-container day${index + 1 < 10 ? '0' : ''}${index + 1}`}
            data-day-of-month={day().date.day}
            data-outside-month={day().isOutsideMonth || undefined}
            data-today={day().isToday || undefined}
          >
          </div>
        )}
      </Index>
    </div>
  );
};
