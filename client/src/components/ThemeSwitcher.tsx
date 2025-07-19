import { createSignal } from 'solid-js';

import { DesktopTower as SystemIcon, Moon as DarkIcon, SunDim as LightIcon } from 'phosphor-solid-js';

import { SegmentedControl, type SegmentedControlItem } from './primitives/SegmentedControl.tsx';

export function ThemeSwitcher() {
  const [selected, setSelected] = createSignal('theme-light');

  const handleChange = (id: string) => {
    setSelected(id);
  };

  const items: SegmentedControlItem[] = [
    {
      id: 'theme-light',
      disabled: false,
      title: 'Light theme',
      icon: <LightIcon size={20} />,
    },
    {
      id: 'theme-dark',
      disabled: false,
      title: 'Dark theme',
      icon: <DarkIcon size={20} />,
    },
    {
      id: 'theme-system',
      disabled: false,
      title: 'System theme',
      icon: <SystemIcon size={20} />,
    },
  ];

  return (
    <div class='theme-switcher'>
      <SegmentedControl checked={selected()} onchange={handleChange} name='theme-switcher' items={items} />
    </div>
  );
}
