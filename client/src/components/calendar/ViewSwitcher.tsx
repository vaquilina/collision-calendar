import { type Setter } from 'solid-js';
import { SegmentedControl, type SegmentedControlItem } from '../primitives/SegmentedControl.tsx';

/**
 * Component for switching between the calendar views.
 * @remarks
 * Views are:
 * - Month -> `view-month`
 * - Week -> `view-week`
 * - Day -> `view-day`
 */
export function ViewSwitcher(props: { selected: string; setSelected: Setter<string> }) {
  const handleChange = (id: string) => {
    props.setSelected(id);
  };

  const items: SegmentedControlItem[] = [
    {
      id: 'view-month',
      title: 'Month view',
      disabled: false,
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
      disabled: true,
      label: 'Day',
    },
  ];

  return <SegmentedControl checked={props.selected} name='view-switcher' items={items} onchange={handleChange} />;
}
