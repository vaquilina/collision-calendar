import { createEffect, createSignal, onCleanup } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { createAnimationLoop } from '../../utils/scheduler.tsx';

import type { CalendarView } from './ViewSwitcher.tsx';

const getCurrentTime = () => Temporal.Now.plainDateTimeISO();

/** A line rendered across the hour axis to indicate the current time. */
export function NowLine(props: { view: CalendarView }) {
  const [currentTime, setCurrentTime] = createSignal<Temporal.PlainDateTime>(getCurrentTime());
  const [rowHeight, setRowHeight] = createSignal<number>(0);

  let ref!: HTMLDivElement;

  /* determine hour row height */
  createEffect(() => {
    // In the week view, get the previous sibling; in the day view, get the next sibling
    const sibling: Element | null = props.view === 'view-week' ? ref.previousElementSibling! : ref.nextElementSibling!;
    const height = Math.round(sibling.getBoundingClientRect().height);
    setRowHeight(height || 0);
  });

  const dispose = createAnimationLoop(() => {
    setCurrentTime(getCurrentTime());
  });
  onCleanup(dispose);

  const dayOfWeek = () => currentTime().dayOfWeek;
  const hour = () => currentTime().hour;
  const minute = () => currentTime().minute;

  return (
    <span
      id='now-line'
      ref={ref}
      style={`
        --col: ${props.view === 'view-week' ? dayOfWeek() + 1 : 2 /* always column 2 in day view */};
        --row: ${hour() + 3 /* offset to account for label & all-day section */};
        --minute: ${minute()};
        --row-height: ${rowHeight()}px
        `}
    />
  );
}
