import { createMemo, Show } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import { CaretLeft, CaretRight } from 'phosphor-solid-js';

import type { Accessor, Component, JSX, Setter } from 'solid-js';

type NavigatorDirection = 'backward' | 'forward';

interface CalendarNavigatorProps {
  date: Temporal.PlainDate;
  setDate: Setter<Temporal.PlainDate>;
  view: string;
}

/**
 * Calendar navigator component.
 * @remarks
 * The navigator consists of:
 * - a 'go to today' shortcut
 * - an indicator displaying the current timeframe in view
 * - buttons to shift the timeframe forward or backward
 */
export const CalendarNavigator: Component<CalendarNavigatorProps> = (props) => {
  const monthLabel: Accessor<string> = createMemo(() =>
    props.date.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  );

  const dayLabel: Accessor<string> = createMemo(() =>
    props.date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );

  const handleGoToToday: JSX.EventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent> = (event) => {
    if (event instanceof MouseEvent || event.key === ' ' || event.key === 'Enter') {
      if (event instanceof KeyboardEvent) event.preventDefault();

      props.setDate(Temporal.Now.plainDateISO());
    }
  };

  const handleShift: JSX.BoundEventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent>[0] = (
    direction: NavigatorDirection,
    event,
  ) => {
    if (event instanceof MouseEvent || event.key === ' ' || event.key === 'Enter') {
      if (event instanceof KeyboardEvent) event.preventDefault();

      const duration: Temporal.Duration | Temporal.DurationLike = {};
      switch (props.view) {
        case 'view-month':
          duration.months = 1;
          break;
        case 'view-week':
          duration.weeks = 1;
          break;
        case 'view-day':
          duration.days = 1;
          break;
        default:
          return;
      }

      direction === 'backward'
        ? props.setDate((prev) => prev.subtract(duration))
        : props.setDate((prev) => prev.add(duration));
    }
  };

  return (
    <div class='cal-navigator'>
      <div>
        <button type='button' title='Go to today' onclick={handleGoToToday}>Today</button>
        <button
          id='cal-backward'
          title='Move backward'
          type='button'
          onclick={[handleShift, 'backward']}
          onkeydown={[handleShift, 'backward']}
        >
          <CaretLeft size={12} aria-role='img' aria-label='Shift back' />
        </button>
        <button
          id='cal-forward'
          title='Move forward'
          type='button'
          onclick={[handleShift, 'forward']}
          onkeydown={[handleShift, 'forward']}
        >
          <CaretRight size={12} aria-role='img' aria-label='Shift forward' />
        </button>
      </div>
      <Show when={props.view === 'view-month'}>
        <h5>{monthLabel()}</h5>
      </Show>
      <Show when={props.view === 'view-week'}>
        <h5>Week {props.date.weekOfYear}, {props.date.yearOfWeek}</h5>
      </Show>
      <Show when={props.view === 'view-day'}>
        <h5>{dayLabel()}</h5>
      </Show>
    </div>
  );
};
