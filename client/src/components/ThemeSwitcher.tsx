import { createEffect, useContext } from 'solid-js';
import { Moon, Sun } from 'phosphor-solid-js';

import { SegmentedControl } from './primitives/SegmentedControl.tsx';
import { ThemeContext } from '../context/ThemeContext.tsx';

import type { SegmentedControlItem } from './primitives/SegmentedControl.tsx';
import type { Component, JSX } from 'solid-js';
import type { Theme } from '../utils/detect-theme.tsx';

/** Segmented control for switching between light/dark theme. */
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
      icon: <Sun aria-role='img' aria-label='sun' weight='duotone' size='1rem' />,
    },
    {
      id: 'dark',
      disabled: false,
      title: 'Dark theme',
      icon: <Moon aria-role='img' aria-label='moon' weight='duotone' size='1rem' />,
    },
  ];

  return (
    <div class='theme-switcher'>
      <SegmentedControl checked={state.theme} onchange={handleChange} name='theme-switcher' items={items} />
    </div>
  );
};
