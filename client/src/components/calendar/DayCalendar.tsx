import { createEffect, createSignal, Index } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { NowLine } from './NowLine.tsx';

import { DAYS_OF_WEEK, HOURS_OF_DAY } from '../../const/calendar.tsx';

/** Day view calendar. */
export function DayCalendar(props: { date: Temporal.PlainDate }) {
  const [isToday, setIsToday] = createSignal(false);

  createEffect(() => setIsToday(Temporal.PlainDate.compare(props.date, Temporal.Now.plainDateISO()) === 0));

  return (
    <div class='day-calendar'>
      <div class='tz-offset' />
      <div class='all-day' />
      <div
        class='day-of-week-container dow01'
        data-today={isToday()}
        data-month={props.date.month}
        data-day-of-month={props.date.day}
        data-year={props.date.year}
      >
        <h6>{DAYS_OF_WEEK[props.date.dayOfWeek - 1]}</h6>
      </div>
      <div class='all-day-container all-day01' data-today={isToday()} />
      {isToday() && <NowLine view='view-day' />}
      <Index each={HOURS_OF_DAY}>
        {(hour) => (
          <>
            <div
              class={`hour-label hour${hour() < 10 ? `0${hour()}` : hour()}`}
              data-hour={`${hour() < 10 ? `0${hour()}` : hour()}:00`}
            />
            <div
              class={`day-container-week dow01-hour${hour() < 10 ? `0${hour()}` : hour()}`}
              data-today={isToday()}
            />
          </>
        )}
      </Index>
    </div>
  );
}
