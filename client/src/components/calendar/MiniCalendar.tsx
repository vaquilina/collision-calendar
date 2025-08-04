import { createEffect, createSignal, Index } from 'solid-js';
import { CalendarDot, CaretLeft, CaretRight } from 'phosphor-solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { WeekdayHeaders } from './WeekdayHeaders.tsx';

import { firstDayInMonthView } from '../../utils/date-arithmetic.tsx';
import { WEEKS_IN_MONTH_VIEW } from '../../const/calendar.tsx';

import type { Component, JSX, Setter } from 'solid-js';
import type { CalendarView } from './ViewSwitcher.tsx';
import type { MonthViewDay, MonthViewWeek } from './MonthCalendar.tsx';

type NavigatorDirection = 'backward' | 'forward';

interface MiniCalendarProps {
  date: Temporal.PlainDate;
  setDate: Setter<Temporal.PlainDate>;
  view: CalendarView;
}

export const MiniCalendar: Component<MiniCalendarProps> = (props) => {
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
    const firstInView: Temporal.PlainDate = firstDayInMonthView(localDate());

    const today: Temporal.PlainDate = Temporal.Now.plainDateISO();

    const month: number = localDate().month;

    const daysInView: MonthViewDay[] = [{
      date: firstInView,
      isOutsideMonth: firstInView.month !== month,
      isToday: Temporal.PlainDate.compare(firstInView, today) === 0,
    }];

    let currDate: Temporal.PlainDate = firstInView;
    for (let i = 1; i < localDate().daysInWeek * WEEKS_IN_MONTH_VIEW; i++) {
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

  const handleGoToToday: JSX.EventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent> = (event) => {
    if (event instanceof MouseEvent || event.key === ' ' || event.key === 'Enter') {
      if (event instanceof KeyboardEvent) event.preventDefault();

      setLocalDate(Temporal.Now.plainDateISO());
    }
  };

  const handleShift: JSX.BoundEventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent>[0] = (
    direction: NavigatorDirection,
    event,
  ) => {
    if (event instanceof MouseEvent || event.key === ' ' || event.key === 'Enter') {
      const duration = Temporal.Duration.from({ months: 1 });

      direction === 'backward'
        ? setLocalDate((prev) => prev.subtract(duration))
        : setLocalDate((prev) => prev.add(duration));
    }
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
          <MiniTodayButton onGoToToday={handleGoToToday} />
          <MiniNavigatorButtons onShift={handleShift} />
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
            tabIndex={0}
            title={day().date.toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
            })}
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
};

interface MiniNavigatorButtonsProps {
  onShift: JSX.BoundEventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent>[0];
}

/** Small navigator buttons. */
const MiniNavigatorButtons: Component<MiniNavigatorButtonsProps> = (props) => {
  const handleClick: JSX.BoundEventHandler<HTMLButtonElement, MouseEvent>[0] = (direction, event) => {
    props.onShift(direction, event);
  };

  const handleKeyDown: JSX.BoundEventHandler<HTMLButtonElement, KeyboardEvent>[0] = (direction, event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      props.onShift(direction, event);
    }
  };

  return (
    <>
      <button
        id='mini-cal-month-backward'
        title='Shift back by 1 month'
        class='small-button'
        type='button'
        onclick={[handleClick, 'backward']}
        onkeydown={[handleKeyDown, 'backward']}
      >
        <CaretLeft size={12} aria-role='img' aria-label='Left caret' />
      </button>
      <button
        id='mini-cal-month-forward'
        title='Shift forward by 1 month'
        class='small-button'
        type='button'
        onclick={[handleClick, 'forward']}
        onkeydown={[handleKeyDown, 'forward']}
      >
        <CaretRight size={12} aria-role='img' aria-label='Right caret' />
      </button>
    </>
  );
};

interface MiniTodayButtonProps {
  onGoToToday: JSX.EventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent>;
}

/** Small 'go to today' button. */
const MiniTodayButton: Component<MiniTodayButtonProps> = (props) => (
  <button
    type='button'
    id='mini-cal-today'
    class='small-button'
    title='Go to today'
    onclick={props.onGoToToday}
    onkeydown={props.onGoToToday}
  >
    <CalendarDot size={12} weight='duotone' aria-role='img' aria-label='calendar dot' />
  </button>
);
