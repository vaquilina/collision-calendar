import { createEffect, createSignal, Index } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { NowLine } from './NowLine.tsx';

import { firstDayInWeekView } from '../../utils/date-arithmetic.tsx';
import { DAYS_OF_WEEK, HOURS_OF_DAY } from '../../const/calendar.tsx';

import type { Component } from 'solid-js';

type WeekViewDay = {
  date: Temporal.PlainDate;
  isToday?: boolean;
};

interface WeekCalendarProps {
  date: Temporal.PlainDate;
}

/** Week view calendar. */
export const WeekCalendar: Component<WeekCalendarProps> = (props) => {
  const mediaQuery = matchMedia('(max-width: 450px)');

  const [days, setDays] = createSignal<WeekViewDay[]>();

  createEffect(() => {
    const today: Temporal.PlainDate = Temporal.Now.plainDateISO();
    const firstDayInView: Temporal.PlainDate = firstDayInWeekView(props.date);

    const daysInView: WeekViewDay[] = [{
      date: firstDayInView,
      isToday: Temporal.PlainDate.compare(firstDayInView, today) === 0,
    }];

    let currDate: Temporal.PlainDate = firstDayInView;
    for (let i = 1; i < props.date.daysInWeek; i++) {
      currDate = currDate.add({ days: 1 });
      daysInView.push({
        date: currDate,
        isToday: Temporal.PlainDate.compare(currDate, today) === 0,
      });
    }

    setDays(daysInView);
  });

  return (
    <>
      <div class='week-calendar'>
        <div class='tz-offset' />
        <div class='all-day' />
        <Index each={days()}>
          {(day, index) => (
            <>
              {day().isToday && <NowLine view='view-week' />}
              <div
                class={`day-of-week-container dow0${index + 1}`}
                title={day().date.toLocaleString('en-US', { weekday: 'long' })}
                data-today={day().isToday}
                data-month={day().date.month}
                data-day-of-month={day().date.day}
                data-year={day().date.year}
              >
                <h6>{DAYS_OF_WEEK[index]}</h6>
              </div>
              <div class={`all-day-container all-day0${index + 1}`} data-today={day().isToday} />
              <Index each={HOURS_OF_DAY}>
                {(hour) => {
                  const hourLabel = `${hour() < 10 ? `0${hour()}` : hour()}:00`;

                  return (
                    <>
                      <div
                        class={`hour-label hour${hour() < 10 ? `0${hour()}` : hour()}`}
                        title={hourLabel}
                        data-hour={hourLabel}
                      />
                      <div
                        class={`day-container-week dow0${index + 1}-hour${hour() < 10 ? `0${hour()}` : hour()}`}
                        data-today={day().isToday}
                      />
                    </>
                  );
                }}
              </Index>
            </>
          )}
        </Index>
      </div>
    </>
  );
};
