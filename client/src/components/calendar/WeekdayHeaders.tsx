import { For } from 'solid-js';

import { DAYS_OF_WEEK } from '../../const/calendar.tsx';

import type { Component } from 'solid-js';

interface WeekdayHeadersProps {
  narrow?: boolean;
}

/** Renders the weekday headers for the month view. */
export const WeekdayHeaders: Component<WeekdayHeadersProps> = (props) => (
  <>
    <div class='week0' />
    <For each={DAYS_OF_WEEK}>
      {(dow, index) => (
        <div class={`day-of-week-container dow0${index() + 1}`}>
          <h6>{props?.narrow ? dow.slice(0, 1) : dow}</h6>
        </div>
      )}
    </For>
  </>
);
