import { createMemo, Show } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import Calendar from '../../../assets/calendar.svg';
import ChevronLeft from '../../../assets/chevron-left.svg';
import ChevronRight from '../../../assets/chevron-right.svg';

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
  const mediaQuery = matchMedia('(max-width: 450px)');

  const monthLabel: Accessor<string> = createMemo(() =>
    props.date.toLocaleString('en-US', {
      month: mediaQuery.matches ? 'short' : 'long',
      year: 'numeric',
    })
  );

  const dayLabel: Accessor<string> = createMemo(() =>
    props.date.toLocaleString('en-US', {
      day: 'numeric',
      month: mediaQuery.matches ? 'short' : 'long',
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
        <TodayButton small={mediaQuery.matches} onclick={handleGoToToday} />
        <button
          id='cal-backward'
          title='Move backward'
          type='button'
          onclick={[handleShift, 'backward']}
          onkeydown={[handleShift, 'backward']}
        >
          <ChevronLeft aria-role='img' aria-label='chevron left' viewBox='2 0 20 20' />
        </button>
        <button
          id='cal-forward'
          title='Move forward'
          type='button'
          onclick={[handleShift, 'forward']}
          onkeydown={[handleShift, 'forward']}
        >
          <ChevronRight aria-role='img' aria-label='chevron right' viewBox='2 0 20 20' />
        </button>
      </div>
      <Show when={props.view === 'view-month'}>
        <h6>{monthLabel()}</h6>
      </Show>
      <Show when={props.view === 'view-week'}>
        <h6>Week {props.date.weekOfYear}, {props.date.yearOfWeek}</h6>
      </Show>
      <Show when={props.view === 'view-day'}>
        <h6>{dayLabel()}</h6>
      </Show>
    </div>
  );
};

interface TodayButtonProps {
  onclick: JSX.EventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent>;
  small: boolean;
}

const TodayButton: Component<TodayButtonProps> = (props) => {
  return (
    <button type='button' title='Go to today' onclick={props.onclick}>
      {props.small ? <Calendar role='img' aria-label='calendar' viewBox='1 0 20 20' /> : 'Today'}
    </button>
  );
};
