import { createSignal, Match, Switch } from 'solid-js';
import { createFileRoute } from '@tanstack/solid-router';
import { Temporal } from '@js-temporal/polyfill';

import { MiniCalendar } from '../components/calendar/MiniCalendar.tsx';
import { MonthCalendar } from '../components/calendar/MonthCalendar.tsx';
import { DayCalendar } from '../components/calendar/DayCalendar.tsx';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar.tsx';
import { TimezoneDisplay } from '../components/calendar/TimezoneDisplay.tsx';
import { WeekCalendar } from '../components/calendar/WeekCalendar.tsx';

import type { Component } from 'solid-js';
import type { CalendarView } from '../components/calendar/ViewSwitcher.tsx';

export const Route = createFileRoute('/calendar')({
  component: CalendarComponent,
});

function CalendarComponent() {
  const [calendarView, setCalendarView] = createSignal<CalendarView>('view-month');
  const [date, setDate] = createSignal<Temporal.PlainDate>(Temporal.Now.plainDateISO());

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
        <button type='button' id='new-block-button'>new block</button>
        <TimezoneDisplay />
        <MiniCalendar date={date()} setDate={setDate} view={calendarView()} />
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
        <Calendar view={calendarView()} date={date()} />
      </main>
    </>
  );
}

interface CalendarProps {
  view: CalendarView;
  date: Temporal.PlainDate;
}

const Calendar: Component<CalendarProps> = (props) => {
  return (
    <Switch fallback={<div>Error</div>}>
      <Match when={props.view === 'view-month'}>
        <MonthCalendar date={props.date} />
      </Match>
      <Match when={props.view === 'view-week'}>
        <WeekCalendar date={props.date} />
      </Match>
      <Match when={props.view === 'view-day'}>
        <DayCalendar date={props.date} />
      </Match>
    </Switch>
  );
};
