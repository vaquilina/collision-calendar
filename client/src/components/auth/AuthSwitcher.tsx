import { SegmentedControl } from '../primitives/SegmentedControl.tsx';

import type { SegmentedControlItem } from '../primitives/SegmentedControl.tsx';
import type { Component, JSX, Setter } from 'solid-js';

export type AuthView = 'sign-in' | 'sign-up' | string;

interface AuthSwitcherProps {
  selected: AuthView;
  setSelected: Setter<AuthView>;
}

/**
 * Component for switching between the {@link AuthView auth views}.
 * @remarks
 * Views are:
 * - Sign in -> 'sign-in'
 * - Sign up -> 'sign-up'
 */
export const AuthSwitcher: Component<AuthSwitcherProps> = (props) => {
  const handleChange: JSX.BoundEventHandler<Element, Event>[0] = (
    id: AuthView,
    _event,
  ) => {
    props.setSelected(id);
  };

  const items: SegmentedControlItem[] = [
    {
      id: 'sign-in',
      title: 'Sign in',
      label: 'sign in',
    },
    {
      id: 'sign-up',
      title: 'Sign up',
      label: 'sign up',
    },
  ];

  return <SegmentedControl checked={props.selected} name='auth-switcher' items={items} onchange={handleChange} />;
};
