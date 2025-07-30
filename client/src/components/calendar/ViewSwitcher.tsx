import { type Setter } from 'solid-js';

import { SegmentedControl, type SegmentedControlItem } from '../primitives/SegmentedControl.tsx';

export type CalendarView = 'view-month' | 'view-week' | 'view-day' | string;

/**
 * Component for switching between the {@link CalendarView calendar views}.
 * @remarks
 * Views are:
 * - Month -> `view-month`
 * - Week -> `view-week`
 * - Day -> `view-day`
 */
export function ViewSwitcher(props: { selected: CalendarView; setSelected: Setter<CalendarView> }) {
  const handleChange = (id: CalendarView) => {
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
}
