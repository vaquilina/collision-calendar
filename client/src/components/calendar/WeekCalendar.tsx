import { createEffect, createSignal, For, Index } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import { firstDayInWeekView } from '../../utils/date-arithmetic.tsx';
import { DAYS_OF_WEEK, HOURS_OF_DAY } from '../../const/calendar.tsx';

type WeekViewDay = {
  date: Temporal.PlainDate;
  isToday?: boolean;
};

const today = Temporal.Now.plainDateISO();

/** Week Calendar component. */
export function WeekCalendar(props: { date: Temporal.PlainDate }) {
  const [days, setDays] = createSignal<WeekViewDay[]>();

  createEffect(() => {
    const firstDayInView = firstDayInWeekView(props.date);

    const daysInView: WeekViewDay[] = [{
      date: firstDayInView,
      isToday: Temporal.PlainDate.compare(firstDayInView, today) === 0,
    }];

    let currDate = firstDayInView;
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
    <div class='week-calendar'>
      <div class='tz-offset' />
      <div class='all-day' />
      <Index each={days()}>
        {(day, index) => (
          <>
            <div class={`day-of-week-container dow0${index + 1}`} data-day-of-month={day().date.day}>
              <h6>{DAYS_OF_WEEK[index]}</h6>
            </div>
            <div class={`all-day-container all-day0${index + 1}`} />
          </>
        )}
      </Index>
      <For each={HOURS_OF_DAY}>
        {(hour) => (
          <>
            <div
              class={`hour-label hour${hour < 10 ? `0${hour}` : hour}`}
              data-hour={`${hour < 10 ? `0${hour}` : hour}:00`}
            />
            <Index each={DAYS_OF_WEEK}>
              {(_day, index) => (
                <div class={`day-container-week dow0${index + 1}-hour${hour < 10 ? `0${hour}` : hour}`} />
              )}
            </Index>
          </>
        )}
      </For>
    </div>
  );
}
