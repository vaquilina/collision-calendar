import { createEffect, createSignal } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import { firstDayInWeekView } from '../../utils/date-arithmetic.tsx';

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

    console.log(daysInView.map((day) => ({
      ...day,
      date: day.date.toLocaleString(),
      dayOfWeek: day.date.dayOfWeek,
      weekOfYear: day.date.weekOfYear,
      yearOfWeek: day.date.yearOfWeek,
    })));

    setDays(daysInView);
  });

  return (
    <div class='week-calendar'>
      <div class='tz-offset'></div>
      <div class='all-day'></div>
      <div class='day-of-week-container dow01' data-day-of-month={14}>
        <h6>Sun</h6>
      </div>
      <div class='day-of-week-container dow02' data-day-of-month={15}>
        <h6>Mon</h6>
      </div>
      <div class='day-of-week-container dow03' data-day-of-month={16}>
        <h6>Tue</h6>
      </div>
      <div class='day-of-week-container dow04' data-day-of-month={17}>
        <h6>Wed</h6>
      </div>
      <div class='day-of-week-container dow05' data-day-of-month={18}>
        <h6>Thu</h6>
      </div>
      <div class='day-of-week-container dow06' data-day-of-month={19}>
        <h6>Fri</h6>
      </div>
      <div class='day-of-week-container dow07' data-day-of-month={20}>
        <h6>Sat</h6>
      </div>
      <div class='all-day-container all-day01'></div>
      <div class='all-day-container all-day02'></div>
      <div class='all-day-container all-day03'></div>
      <div class='all-day-container all-day04'></div>
      <div class='all-day-container all-day05'></div>
      <div class='all-day-container all-day06'></div>
      <div class='all-day-container all-day07'></div>
      <div class='hour-label hour00' data-hour='00:00'></div>
      <div class='hour-label hour01' data-hour='01:00'></div>
      <div class='hour-label hour02' data-hour='02:00'></div>
      <div class='hour-label hour03' data-hour='03:00'></div>
      <div class='hour-label hour04' data-hour='04:00'></div>
      <div class='hour-label hour05' data-hour='05:00'></div>
      <div class='hour-label hour06' data-hour='06:00'></div>
      <div class='hour-label hour07' data-hour='07:00'></div>
      <div class='hour-label hour08' data-hour='08:00'></div>
      <div class='hour-label hour09' data-hour='09:00'></div>
      <div class='hour-label hour10' data-hour='10:00'></div>
      <div class='hour-label hour11' data-hour='11:00'></div>
      <div class='hour-label hour12' data-hour='12:00'></div>
      <div class='hour-label hour13' data-hour='13:00'></div>
      <div class='hour-label hour14' data-hour='14:00'></div>
      <div class='hour-label hour15' data-hour='15:00'></div>
      <div class='hour-label hour16' data-hour='16:00'></div>
      <div class='hour-label hour17' data-hour='17:00'></div>
      <div class='hour-label hour18' data-hour='18:00'></div>
      <div class='hour-label hour19' data-hour='19:00'></div>
      <div class='hour-label hour20' data-hour='20:00'></div>
      <div class='hour-label hour21' data-hour='21:00'></div>
      <div class='hour-label hour22' data-hour='22:00'></div>
      <div class='hour-label hour23' data-hour='23:00'></div>
      <div class='day-container-week dow01-hour00'></div>
      <div class='day-container-week dow01-hour01'></div>
      <div class='day-container-week dow01-hour02'></div>
      <div class='day-container-week dow01-hour03'></div>
      <div class='day-container-week dow01-hour04'></div>
      <div class='day-container-week dow01-hour05'></div>
      <div class='day-container-week dow01-hour06'></div>
      <div class='day-container-week dow01-hour07'></div>
      <div class='day-container-week dow01-hour08'></div>
      <div class='day-container-week dow01-hour09'></div>
      <div class='day-container-week dow01-hour10'></div>
      <div class='day-container-week dow01-hour11'></div>
      <div class='day-container-week dow01-hour12'></div>
      <div class='day-container-week dow01-hour13'></div>
      <div class='day-container-week dow01-hour14'></div>
      <div class='day-container-week dow01-hour15'></div>
      <div class='day-container-week dow01-hour16'></div>
      <div class='day-container-week dow01-hour17'></div>
      <div class='day-container-week dow01-hour18'></div>
      <div class='day-container-week dow01-hour19'></div>
      <div class='day-container-week dow01-hour20'></div>
      <div class='day-container-week dow01-hour21'></div>
      <div class='day-container-week dow01-hour22'></div>
      <div class='day-container-week dow01-hour23'></div>

      <div class='day-container-week dow02-hour00'></div>
      <div class='day-container-week dow02-hour01'></div>
      <div class='day-container-week dow02-hour02'></div>
      <div class='day-container-week dow02-hour03'></div>
      <div class='day-container-week dow02-hour04'></div>
      <div class='day-container-week dow02-hour05'></div>
      <div class='day-container-week dow02-hour06'></div>
      <div class='day-container-week dow02-hour07'></div>
      <div class='day-container-week dow02-hour08'></div>
      <div class='day-container-week dow02-hour09'></div>
      <div class='day-container-week dow02-hour10'></div>
      <div class='day-container-week dow02-hour11'></div>
      <div class='day-container-week dow02-hour12'></div>
      <div class='day-container-week dow02-hour13'></div>
      <div class='day-container-week dow02-hour14'></div>
      <div class='day-container-week dow02-hour15'></div>
      <div class='day-container-week dow02-hour16'></div>
      <div class='day-container-week dow02-hour17'></div>
      <div class='day-container-week dow02-hour18'></div>
      <div class='day-container-week dow02-hour19'></div>
      <div class='day-container-week dow02-hour20'></div>
      <div class='day-container-week dow02-hour21'></div>
      <div class='day-container-week dow02-hour22'></div>
      <div class='day-container-week dow02-hour23'></div>

      <div class='day-container-week dow03-hour00'></div>
      <div class='day-container-week dow03-hour01'></div>
      <div class='day-container-week dow03-hour02'></div>
      <div class='day-container-week dow03-hour03'></div>
      <div class='day-container-week dow03-hour04'></div>
      <div class='day-container-week dow03-hour05'></div>
      <div class='day-container-week dow03-hour06'></div>
      <div class='day-container-week dow03-hour07'></div>
      <div class='day-container-week dow03-hour08'></div>
      <div class='day-container-week dow03-hour09'></div>
      <div class='day-container-week dow03-hour10'></div>
      <div class='day-container-week dow03-hour11'></div>
      <div class='day-container-week dow03-hour12'></div>
      <div class='day-container-week dow03-hour13'></div>
      <div class='day-container-week dow03-hour14'></div>
      <div class='day-container-week dow03-hour15'></div>
      <div class='day-container-week dow03-hour16'></div>
      <div class='day-container-week dow03-hour17'></div>
      <div class='day-container-week dow03-hour18'></div>
      <div class='day-container-week dow03-hour19'></div>
      <div class='day-container-week dow03-hour20'></div>
      <div class='day-container-week dow03-hour21'></div>
      <div class='day-container-week dow03-hour22'></div>
      <div class='day-container-week dow03-hour23'></div>

      <div class='day-container-week dow04-hour00'></div>
      <div class='day-container-week dow04-hour01'></div>
      <div class='day-container-week dow04-hour02'></div>
      <div class='day-container-week dow04-hour03'></div>
      <div class='day-container-week dow04-hour04'></div>
      <div class='day-container-week dow04-hour05'></div>
      <div class='day-container-week dow04-hour06'></div>
      <div class='day-container-week dow04-hour07'></div>
      <div class='day-container-week dow04-hour08'></div>
      <div class='day-container-week dow04-hour09'></div>
      <div class='day-container-week dow04-hour10'></div>
      <div class='day-container-week dow04-hour11'></div>
      <div class='day-container-week dow04-hour12'></div>
      <div class='day-container-week dow04-hour13'></div>
      <div class='day-container-week dow04-hour14'></div>
      <div class='day-container-week dow04-hour15'></div>
      <div class='day-container-week dow04-hour16'></div>
      <div class='day-container-week dow04-hour17'></div>
      <div class='day-container-week dow04-hour18'></div>
      <div class='day-container-week dow04-hour19'></div>
      <div class='day-container-week dow04-hour20'></div>
      <div class='day-container-week dow04-hour21'></div>
      <div class='day-container-week dow04-hour22'></div>
      <div class='day-container-week dow04-hour23'></div>

      <div class='day-container-week dow05-hour00'></div>
      <div class='day-container-week dow05-hour01'></div>
      <div class='day-container-week dow05-hour02'></div>
      <div class='day-container-week dow05-hour03'></div>
      <div class='day-container-week dow05-hour04'></div>
      <div class='day-container-week dow05-hour05'></div>
      <div class='day-container-week dow05-hour06'></div>
      <div class='day-container-week dow05-hour07'></div>
      <div class='day-container-week dow05-hour08'></div>
      <div class='day-container-week dow05-hour09'></div>
      <div class='day-container-week dow05-hour10'></div>
      <div class='day-container-week dow05-hour11'></div>
      <div class='day-container-week dow05-hour12'></div>
      <div class='day-container-week dow05-hour13'></div>
      <div class='day-container-week dow05-hour14'></div>
      <div class='day-container-week dow05-hour15'></div>
      <div class='day-container-week dow05-hour16'></div>
      <div class='day-container-week dow05-hour17'></div>
      <div class='day-container-week dow05-hour18'></div>
      <div class='day-container-week dow05-hour19'></div>
      <div class='day-container-week dow05-hour20'></div>
      <div class='day-container-week dow05-hour21'></div>
      <div class='day-container-week dow05-hour22'></div>
      <div class='day-container-week dow05-hour23'></div>

      <div class='day-container-week dow06-hour00'></div>
      <div class='day-container-week dow06-hour01'></div>
      <div class='day-container-week dow06-hour02'></div>
      <div class='day-container-week dow06-hour03'></div>
      <div class='day-container-week dow06-hour04'></div>
      <div class='day-container-week dow06-hour05'></div>
      <div class='day-container-week dow06-hour06'></div>
      <div class='day-container-week dow06-hour07'></div>
      <div class='day-container-week dow06-hour08'></div>
      <div class='day-container-week dow06-hour09'></div>
      <div class='day-container-week dow06-hour10'></div>
      <div class='day-container-week dow06-hour11'></div>
      <div class='day-container-week dow06-hour12'></div>
      <div class='day-container-week dow06-hour13'></div>
      <div class='day-container-week dow06-hour14'></div>
      <div class='day-container-week dow06-hour15'></div>
      <div class='day-container-week dow06-hour16'></div>
      <div class='day-container-week dow06-hour17'></div>
      <div class='day-container-week dow06-hour18'></div>
      <div class='day-container-week dow06-hour19'></div>
      <div class='day-container-week dow06-hour20'></div>
      <div class='day-container-week dow06-hour21'></div>
      <div class='day-container-week dow06-hour22'></div>
      <div class='day-container-week dow06-hour23'></div>

      <div class='day-container-week dow07-hour00'></div>
      <div class='day-container-week dow07-hour01'></div>
      <div class='day-container-week dow07-hour02'></div>
      <div class='day-container-week dow07-hour03'></div>
      <div class='day-container-week dow07-hour04'></div>
      <div class='day-container-week dow07-hour05'></div>
      <div class='day-container-week dow07-hour06'></div>
      <div class='day-container-week dow07-hour07'></div>
      <div class='day-container-week dow07-hour08'></div>
      <div class='day-container-week dow07-hour09'></div>
      <div class='day-container-week dow07-hour10'></div>
      <div class='day-container-week dow07-hour11'></div>
      <div class='day-container-week dow07-hour12'></div>
      <div class='day-container-week dow07-hour13'></div>
      <div class='day-container-week dow07-hour14'></div>
      <div class='day-container-week dow07-hour15'></div>
      <div class='day-container-week dow07-hour16'></div>
      <div class='day-container-week dow07-hour17'></div>
      <div class='day-container-week dow07-hour18'></div>
      <div class='day-container-week dow07-hour19'></div>
      <div class='day-container-week dow07-hour20'></div>
      <div class='day-container-week dow07-hour21'></div>
      <div class='day-container-week dow07-hour22'></div>
      <div class='day-container-week dow07-hour23'></div>
    </div>
  );
}
