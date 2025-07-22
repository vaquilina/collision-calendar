import { createMemo, type JSX, type Setter, Show } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import { CaretLeft, CaretRight } from 'phosphor-solid-js';

/**
 * Calendar navigator component.
 * @remarks
 * The navigator consists of:
 * - a 'today' shortcut
 * - an indicator displaying the current timeframe in view
 * - buttons to shift the timeframe forward or backward
 */
export function CalendarNavigator(
  props: { date: Temporal.PlainDate; setDate: Setter<Temporal.PlainDate>; view: string },
) {
  const monthName = createMemo(() =>
    props.date.toLocaleString('en-US', {
      calendar: props.date.calendarId,
      month: 'long',
    })
  );

  const handleClickToday: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_e) => {
    props.setDate(Temporal.Now.plainDateISO());
  };

  const handleClickBackward: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_e) => {
    const duration: Temporal.Duration | Temporal.DurationLike = {};
    switch (props.view) {
      case 'view-month':
        duration.months = 1;
        break;
      case 'view-week':
        duration.weeks = 1;
        break;
      default:
        return;
    }

    props.setDate((prev) => prev.subtract(duration));
  };

  const handleClickForward: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_e) => {
    const duration: Temporal.Duration | Temporal.DurationLike = {};
    switch (props.view) {
      case 'view-month':
        duration.months = 1;
        break;
      case 'view-week':
        duration.weeks = 1;
        break;
      default:
        return;
    }

    props.setDate((prev) => prev.add(duration));
  };

  return (
    <div class='cal-navigator'>
      <div>
        <button type='button' title='Go to today' onclick={handleClickToday}>Today</button>
        <button id='cal-backward' type='button' onclick={handleClickBackward}>
          <CaretLeft size={12} />
        </button>
        <button id='cal-forward' type='button' onclick={handleClickForward}>
          <CaretRight size={12} />
        </button>
      </div>
      <Show when={props.view === 'view-month'}>
        <h5>{monthName()} {props.date.year}</h5>
      </Show>
      <Show when={props.view === 'view-week'}>
        <h5>Week {props.date.weekOfYear}, {props.date.year}</h5>
      </Show>
    </div>
  );
}
