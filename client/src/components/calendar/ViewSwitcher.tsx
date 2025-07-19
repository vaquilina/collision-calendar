import { createSignal } from 'solid-js';
import { SegmentedControl, type SegmentedControlItem } from '../primitives/SegmentedControl.tsx';

export function ViewSwitcher() {
  const [selected, setSelected] = createSignal('view-month');

  const handleChange = (id: string) => {
    setSelected(id);
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
      disabled: true,
      label: 'Week',
    },
    {
      id: 'view-day',
      title: 'Day view',
      disabled: true,
      label: 'Day',
    },
  ];

  return <SegmentedControl checked={selected()} name='view-switcher' items={items} onchange={handleChange} />;
}
