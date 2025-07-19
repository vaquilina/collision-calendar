import { createFileRoute } from '@tanstack/solid-router';
import { MiniCalendar } from '../components/calendar/MiniCalendar.tsx';
import { MonthCalendar } from '../components/calendar/MonthCalendar.tsx';
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx';
import { ViewSwitcher } from '../components/calendar/ViewSwitcher.tsx';

export const Route = createFileRoute('/calendar')({
  component: CalendarComponent,
});

function CalendarComponent() {
  return (
    <>
      <header>
        <button type='button' title='Go to today'>Today</button>
        <ViewSwitcher />
        <ThemeSwitcher />
      </header>
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
        <MonthCalendar />
      </main>
    </>
  );
}
