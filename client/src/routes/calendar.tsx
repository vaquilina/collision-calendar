import { createEffect, createSignal } from 'solid-js';
import { createFileRoute } from '@tanstack/solid-router';
import { Temporal } from '@js-temporal/polyfill';
import { CaretLeft, CaretRight, Globe, MagnifyingGlass, UserRectangle } from 'phosphor-solid-js';
import { MiniCalendar } from '../components/calendar/MiniCalendar.tsx';
import { MonthCalendar } from '../components/calendar/MonthCalendar.tsx';
import { ViewSwitcher } from '../components/calendar/ViewSwitcher.tsx';

export const Route = createFileRoute('/calendar')({
  component: CalendarComponent,
});

function CalendarComponent() {
  return (
    <>
      <header>
        <CalendarToolbar />
      </header>
      <aside>
        <button type='button' class='new-block-button'>new block</button>
        <TimezoneDisplay />
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

function CalendarToolbar() {
  return (
    <>
      <button type='button' title='Search'>
        <MagnifyingGlass />
      </button>
      <CalendarNavigator />
      <ViewSwitcher />
      <UserDisplay />
    </>
  );
}

function CalendarNavigator() {
  return (
    <div class='cal-navigator'>
      <div>
        <button type='button' title='Go to today'>Today</button>
        <button id='cal-backward' type='button'>
          <CaretLeft size={12} />
        </button>
        <button id='cal-forward' type='button'>
          <CaretRight size={12} />
        </button>
      </div>
      <h5>September 2025</h5>
    </div>
  );
}

function TimezoneDisplay() {
  const [timezone, setTimezone] = createSignal('');

  createEffect(() => {
    setTimezone(Temporal.Now.timeZoneId);
  });

  return (
    <h6 class='timezone-display' title='Timezone'>
      <Globe />
      {timezone()}
    </h6>
  );
}

function UserDisplay() {
  return (
    <div class='user-display'>
      <div class='user-display-text'>
        <h6>Vince Aquilina</h6>
        <address>vince.aquilina@protonmail.com</address>
      </div>
      <UserRectangle size={38} weight='thin' />
    </div>
  );
}
