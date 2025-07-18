import { createFileRoute } from '@tanstack/solid-router';
import { MiniCalendar } from '../components/MiniCalendar.tsx';

export const Route = createFileRoute('/calendar')({
  component: CalendarComponent,
});

function CalendarComponent() {
  return (
    <>
      <header></header>
      <aside>
        <MiniCalendar />
        <div>
          <fieldset>
            <legend>Calendars</legend>
            <div class='form-check-input'>
              <input type='checkbox' id='cal1' />
              <label tabIndex={-1} for='cal1'>personal</label>
            </div>
            <div class='form-check-input'>
              <input type='checkbox' id='cal2' />
              <label tabIndex={-1} for='cal2'>work</label>
            </div>
            <div class='form-check-input'>
              <input type='checkbox' id='cal3' />
              <label tabIndex={-1} for='cal3'>band</label>
            </div>
          </fieldset>
        </div>
      </aside>
      <main>
        <div class='month-calendar'>
          <div class='week0' />
          <div class='day-of-week-container dow01'>
            <h6>Sun</h6>
          </div>
          <div class='day-of-week-container dow02'>
            <h6>Mon</h6>
          </div>
          <div class='day-of-week-container dow03'>
            <h6>Tue</h6>
          </div>
          <div class='day-of-week-container dow04'>
            <h6>Wed</h6>
          </div>
          <div class='day-of-week-container dow05'>
            <h6>Thu</h6>
          </div>
          <div class='day-of-week-container dow06'>
            <h6>Fri</h6>
          </div>
          <div class='day-of-week-container dow07'>
            <h6>Sat</h6>
          </div>
          <div class='week-number-container week1' data-week-of-year='23'></div>
          <div class='week-number-container week2'></div>
          <div class='week-number-container week3'></div>
          <div class='week-number-container week4'></div>
          <div class='week-number-container week5'></div>
          <div class='day-container day01' data-day-of-month='1'></div>
          <div class='day-container day02'></div>
          <div class='day-container day03'></div>
          <div class='day-container day04'></div>
          <div class='day-container day05'></div>
          <div class='day-container day06'></div>
          <div class='day-container day07'></div>
          <div class='day-container day08' data-day-of-month='8'></div>
          <div class='day-container day09'></div>
          <div class='day-container day10'></div>
          <div class='day-container day11'></div>
          <div class='day-container day12'></div>
          <div class='day-container day13'></div>
          <div class='day-container day14'></div>
          <div class='day-container day15' data-day-of-month='15'></div>
          <div class='day-container day16'></div>
          <div class='day-container day17'></div>
          <div class='day-container day18'></div>
          <div class='day-container day19'></div>
          <div class='day-container day20'></div>
          <div class='day-container day21'></div>
          <div class='day-container day22'></div>
          <div class='day-container day23'></div>
          <div class='day-container day24'></div>
          <div class='day-container day25'></div>
          <div class='day-container day26'></div>
          <div class='day-container day27'></div>
          <div class='day-container day28'></div>
          <div class='day-container day29'></div>
          <div class='day-container day30'></div>
          <div class='day-container day31'></div>
          <div class='day-container day32'></div>
          <div class='day-container day33'></div>
          <div class='day-container day34'></div>
          <div class='day-container day35'></div>
        </div>
      </main>
    </>
  );
}
