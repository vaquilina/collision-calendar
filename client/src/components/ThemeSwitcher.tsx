import { createEffect, useContext } from 'solid-js';

import { SegmentedControl } from './primitives/SegmentedControl.tsx';
import { ThemeContext } from '../context/ThemeContext.tsx';

import type { SegmentedControlItem } from './primitives/SegmentedControl.tsx';
import type { Component, JSX } from 'solid-js';
import type { Theme } from '../utils/detect-theme.tsx';

export const ThemeSwitcher: Component = () => {
  const [state, setThemeStore] = useContext(ThemeContext);

  const handleChange: JSX.BoundEventHandler<Element, Event>[0] = (id: Theme, _event) => {
    setThemeStore({ theme: id });
  };

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  });

  const items: SegmentedControlItem[] = [
    {
      id: 'light',
      disabled: false,
      title: 'Light theme',
      label: 'LIGHT',
    },
    {
      id: 'dark',
      disabled: false,
      title: 'Dark theme',
      label: 'DARK',
    },
  ];

  return (
    <div class='theme-switcher'>
      <SegmentedControl checked={state.theme} onchange={handleChange} name='theme-switcher' items={items} />
    </div>
  );
};
