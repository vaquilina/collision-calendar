import { SegmentedControl } from '../primitives/SegmentedControl.tsx';

import type { Component, JSX, Setter } from 'solid-js';
import type { SegmentedControlItem } from '../primitives/SegmentedControl.tsx';

export type CalendarView = 'view-month' | 'view-week' | 'view-day' | string;

interface ViewSwitcherProps {
  selected: CalendarView;
  setSelected: Setter<CalendarView>;
}

/**
 * Component for switching between the {@link CalendarView calendar views}.
 * @remarks
 * Views are:
 * - Month -> `view-month`
 * - Week -> `view-week`
 * - Day -> `view-day`
 */
export const ViewSwitcher: Component<ViewSwitcherProps> = (props) => {
  const handleChange: JSX.BoundEventHandler<Element, Event>[0] = (
    id: CalendarView,
    _event,
  ) => {
    props.setSelected(id);
  };

  const items: SegmentedControlItem[] = [
    {
      id: 'view-month',
      title: 'Month view',
      label: 'Month',
    },
    {
      id: 'view-week',
      title: 'Week view',
      label: 'Week',
    },
    {
      id: 'view-day',
      title: 'Day view',
      label: 'Day',
    },
  ];

  return <SegmentedControl checked={props.selected} name='view-switcher' items={items} onchange={handleChange} />;
};
