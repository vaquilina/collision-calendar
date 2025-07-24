import { createSignal, Match, Switch } from 'solid-js';
import { createFileRoute } from '@tanstack/solid-router';
import { Temporal } from '@js-temporal/polyfill';
import { MiniCalendar } from '../components/calendar/MiniCalendar.tsx';
import { MonthCalendar } from '../components/calendar/MonthCalendar.tsx';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar.tsx';
import { TimezoneDisplay } from '../components/calendar/TimezoneDisplay.tsx';
import { WeekCalendar } from '../components/calendar/WeekCalendar.tsx';

export const Route = createFileRoute('/calendar')({
  component: CalendarComponent,
});

function CalendarComponent() {
  const [calendarView, setCalendarView] = createSignal('view-month');
  const [date, setDate] = createSignal(Temporal.Now.plainDateISO());

  return (
    <>
      <header>
        <CalendarToolbar
          date={date()}
          setDate={setDate}
          selectedView={calendarView()}
          setSelectedView={setCalendarView}
        />
      </header>
      <aside>
        <button type='button' class='new-block-button'>new block</button>
        <TimezoneDisplay />
        <MiniCalendar />
        <div>
          <fieldset>
            <legend>Spaces</legend>
            <div class='form-check-input'>
              <input type='checkbox' id='space1' />
              <label tabIndex={-1} for='space1'>Jam Room</label>
            </div>
            <div class='form-check-input'>
              <input type='checkbox' id='space2' />
              <label tabIndex={-1} for='space2'>Workshop</label>
            </div>
            <div class='form-check-input'>
              <input type='checkbox' id='space3' />
              <label tabIndex={-1} for='space3'>Fringe</label>
            </div>
          </fieldset>
        </div>
      </aside>
      <main>
        <Switch fallback={<div>Error</div>}>
          <Match when={calendarView() === 'view-month'}>
            <MonthCalendar date={date()} />
          </Match>
          <Match when={calendarView() === 'view-week'}>
            <WeekCalendar date={date()} />
          </Match>
          <Match when={calendarView() === 'view-day'}>
            todo
          </Match>
        </Switch>
      </main>
    </>
  );
}
