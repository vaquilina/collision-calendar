import { createEffect, createSignal } from 'solid-js';
import { Moon as DarkIcon, SunDim as LightIcon } from 'phosphor-solid-js';

import { SegmentedControl } from './primitives/SegmentedControl.tsx';

import type { SegmentedControlItem } from './primitives/SegmentedControl.tsx';
import type { Component, JSX } from 'solid-js';

export const ThemeSwitcher: Component = () => {
  const [selected, setSelected] = createSignal('light');

  const handleChange: JSX.BoundEventHandler<Element, Event>[0] = (id: string, _event) => {
    setSelected(id);
  };

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', selected());
  });

  const items: SegmentedControlItem[] = [
    {
      id: 'light',
      disabled: false,
      title: 'Light theme',
      icon: <LightIcon size={20} aria-role='img' aria-label='Light theme' />,
    },
    {
      id: 'dark',
      disabled: false,
      title: 'Dark theme',
      icon: <DarkIcon size={20} aria-role='img' aria-label='Dark theme' />,
    },
  ];

  return (
    <div class='theme-switcher'>
      <SegmentedControl checked={selected()} onchange={handleChange} name='theme-switcher' items={items} />
    </div>
  );
};
