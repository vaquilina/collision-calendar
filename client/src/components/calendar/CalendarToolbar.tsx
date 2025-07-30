import type { Setter } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';

import { CalendarNavigator } from './CalendarNavigator.tsx';
import { ViewSwitcher } from './ViewSwitcher.tsx';
import { UserDisplay } from '../UserDisplay.tsx';

import type { CalendarView } from './ViewSwitcher.tsx';

/** Toolbar component for the calendar screen header. */
export function CalendarToolbar(
  props: {
    date: Temporal.PlainDate;
    setDate: Setter<Temporal.PlainDate>;
    selectedView: CalendarView;
    setSelectedView: Setter<CalendarView>;
  },
) {
  return (
    <>
      <CalendarNavigator date={props.date} setDate={props.setDate} view={props.selectedView} />
      <ViewSwitcher selected={props.selectedView} setSelected={props.setSelectedView} />
      <UserDisplay />
    </>
  );
}
