import type { Setter } from 'solid-js';
import { MagnifyingGlass } from 'phosphor-solid-js';
import { CalendarNavigator } from './CalendarNavigator.tsx';
import { ViewSwitcher } from './ViewSwitcher.tsx';
import { UserDisplay } from '../UserDisplay.tsx';

/** Toolbar component for the calendar screen header. */
export function CalendarToolbar(props: { selectedView: string; setSelectedView: Setter<string> }) {
  return (
    <>
      <button type='button' title='Search'>
        <MagnifyingGlass />
      </button>
      <CalendarNavigator />
      <ViewSwitcher selected={props.selectedView} setSelected={props.setSelectedView} />
      <UserDisplay />
    </>
  );
}
