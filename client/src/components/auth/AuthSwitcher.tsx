import { useNavigate } from '@tanstack/solid-router';

import { SegmentedControl } from '../primitives/SegmentedControl.tsx';
import { Route as SignInRoute } from '../../routes/auth.signin.tsx';
import { Route as SignUpRoute } from '../../routes/auth.signup.tsx';

import type { SegmentedControlItem } from '../primitives/SegmentedControl.tsx';
import type { Component, JSX, Setter } from 'solid-js';

export type AuthView = 'signin' | 'signup';

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
  const navigate = useNavigate();

  const handleChange: JSX.BoundEventHandler<Element, Event>[0] = (
    id: AuthView,
    _event,
  ) => {
    props.setSelected(id);
    navigate({ to: id === 'signin' ? SignInRoute.to : SignUpRoute.to, viewTransition: true });
  };

  const items: SegmentedControlItem[] = [
    {
      id: 'signin',
      title: 'Sign in',
      label: 'sign in',
    },
    {
      id: 'signup',
      title: 'Sign up',
      label: 'sign up',
    },
  ];

  return <SegmentedControl checked={props.selected} name='auth-switcher' items={items} onchange={handleChange} />;
};
