import { Temporal } from '@js-temporal/polyfill';

import { CalendarNavigator } from './CalendarNavigator.tsx';
import { ViewSwitcher } from './ViewSwitcher.tsx';
import { UserDisplay } from '../user/UserDisplay.tsx';

import type { Component, Setter } from 'solid-js';
import type { CalendarView } from './ViewSwitcher.tsx';

interface CalendarToolbarProps {
  date: Temporal.PlainDate;
  setDate: Setter<Temporal.PlainDate>;
  selectedView: CalendarView;
  setSelectedView: Setter<CalendarView>;
}

/** Toolbar component for the calendar screen header. */
export const CalendarToolbar: Component<CalendarToolbarProps> = (props) => (
  <>
    <CalendarNavigator date={props.date} setDate={props.setDate} view={props.selectedView} />
    <ViewSwitcher selected={props.selectedView} setSelected={props.setSelectedView} />
    <UserDisplay />
  </>
);
