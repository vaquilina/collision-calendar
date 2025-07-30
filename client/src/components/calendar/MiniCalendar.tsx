import { createEffect, createSignal, Index, type JSX, type Setter } from 'solid-js';
import { CalendarDot, CaretLeft, CaretRight } from 'phosphor-solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { WeekdayHeaders } from './WeekdayHeaders.tsx';

import { firstDayInMonthView } from '../../utils/date-arithmetic.tsx';
import { WEEKS_IN_MONTH_VIEW } from '../../const/calendar.tsx';

import type { CalendarView } from './ViewSwitcher.tsx';
import type { MonthViewDay, MonthViewWeek } from './MonthCalendar.tsx';

type NavigatorDirection = 'backward' | 'forward';

export function MiniCalendar(
  props: { date: Temporal.PlainDate; setDate: Setter<Temporal.PlainDate>; view: CalendarView },
) {
  const [localDate, setLocalDate] = createSignal<Temporal.PlainDate>(props.date);
  const [weeks, setWeeks] = createSignal<MonthViewWeek[]>([]);
  const [days, setDays] = createSignal<MonthViewDay[]>([]);

  /* sync with the parent calendar date when it changes */
  createEffect(() => setLocalDate(props.date));

  createEffect(() => {
    /* Get the first day in the view
     * e.g. If the 1st of the month falls on a Wednesday,
     *      the first day in the view would fall on the prior Monday
     */
    const firstInView = firstDayInMonthView(localDate());

    const today = Temporal.Now.plainDateISO();

    const month = localDate().month;

    const daysInView: MonthViewDay[] = [{
      date: firstInView,
      isOutsideMonth: firstInView.month !== month,
      isToday: Temporal.PlainDate.compare(firstInView, today) === 0,
    }];

    let currDate = firstInView;
    for (let i = 1; i < localDate().daysInWeek * WEEKS_IN_MONTH_VIEW; i++) {
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

  const handleClickToday: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_e) =>
    setLocalDate(Temporal.Now.plainDateISO());

  const handleClickArrow = (direction: NavigatorDirection) => {
    const duration = Temporal.Duration.from({ months: 1 });

    direction === 'backward'
      ? setLocalDate((prev) => prev.subtract(duration))
      : setLocalDate((prev) => prev.add(duration));
  };

  return (
    <div class='mini-calendar'>
      <header>
        <h5>
          {localDate().toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h5>
        <span class='mini-calendar-navigator-buttons'>
          <MiniTodayButton onclick={handleClickToday} />
          <MiniNavigatorButtons onclick={handleClickArrow} />
        </span>
      </header>
      <WeekdayHeaders narrow />
      <Index each={weeks()}>
        {(week, index) =>
          index === WEEKS_IN_MONTH_VIEW
            ? null
            : <div class={`week-number-container week${index + 1}`} data-week-of-year={week().weekNumber}></div>}
      </Index>
      <Index each={days()}>
        {(day, index) => (
          <span
            role='button'
            onclick={(_e) => props.setDate(day().date)}
            class={`mini-day-container day${index + 1 < 10 ? '0' : ''}${index + 1}`}
            data-view={props.view}
            data-selected={props.view === 'view-week'
              ? day().date.weekOfYear === props.date.weekOfYear
              : Temporal.PlainDate.compare(day().date, props.date) === 0}
            data-day-of-month={day().date.day}
            data-outside-month={day().isOutsideMonth || undefined}
            data-today={day().isToday || undefined}
          >
          </span>
        )}
      </Index>
    </div>
  );
}

/** Small navigator buttons. */
function MiniNavigatorButtons(props: { onclick: (direction: NavigatorDirection) => void }) {
  return (
    <>
      <button
        id='mini-cal-month-backward'
        title='Shift back by 1 month'
        class='small-button'
        type='button'
        onclick={(_e) => props.onclick('backward')}
      >
        <CaretLeft size={12} />
      </button>
      <button
        id='mini-cal-month-forward'
        title='Shift forward by 1 month'
        class='small-button'
        type='button'
        onclick={(_e) => props.onclick('forward')}
      >
        <CaretRight size={12} />
      </button>
    </>
  );
}

/** Small 'today' button. */
function MiniTodayButton(props: { onclick: JSX.EventHandler<HTMLButtonElement, MouseEvent> }) {
  return (
    <button type='button' id='mini-cal-today' class='small-button' title='Go to today' onclick={props.onclick}>
      <CalendarDot size={12} weight='duotone' />
    </button>
  );
}
