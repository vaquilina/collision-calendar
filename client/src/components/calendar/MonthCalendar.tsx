import { createEffect, createSignal, Index } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { firstDayInMonthView } from '../../utils/date-arithmetic.tsx';
import { DAYS_OF_WEEK, WEEKS_IN_MONTH_VIEW } from '../../const/calendar.tsx';

type MonthViewDay = {
  date: Temporal.PlainDate;
  isOutsideMonth?: boolean;
  isToday?: boolean;
};

type MonthViewWeek = {
  weekNumber: Temporal.PlainDate['weekOfYear'];
  days: MonthViewDay[];
};

const today = Temporal.Now.plainDateISO();

/** Month calendar component. */
export function MonthCalendar(props: { date: Temporal.PlainDate }) {
  const [weeks, setWeeks] = createSignal<MonthViewWeek[]>([]);
  const [days, setDays] = createSignal<MonthViewDay[]>([]);

  createEffect(() => {
    /* Get the first day in the view
     * e.g. If the 1st of the month falls on a Tuesday,
     *      the first day in the view would fall on the prior Sunday
     */
    const firstInView = firstDayInMonthView(props.date);

    const month = props.date.month;

    const daysInView: MonthViewDay[] = [{
      date: firstInView,
      isOutsideMonth: firstInView.month !== month,
      isToday: Temporal.PlainDate.compare(firstInView, today) === 0,
    }];

    let currDate = firstInView;
    for (let i = 1; i < props.date.daysInWeek * WEEKS_IN_MONTH_VIEW; i++) {
      currDate = currDate.add({ days: 1 });
      daysInView.push({
        date: currDate,
        isOutsideMonth: currDate.month !== month,
        isToday: Temporal.PlainDate.compare(currDate, today) === 0,
      });
    }

    setDays(daysInView);

    const weeksOfYearInView = new Set(
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
      <WeekDayHeaders />
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
}

function WeekDayHeaders() {
  return (
    <>
      <div class='week0' />
      <Index each={DAYS_OF_WEEK}>
        {(dow, index) => (
          <div
            class={`day-of-week-container dow0${index + 1}`}
            data-today={today.dayOfWeek === index + 1}
          >
            <h6>{dow()}</h6>
          </div>
        )}
      </Index>
    </>
  );
}
