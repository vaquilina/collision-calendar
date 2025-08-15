import { UserAvatar } from './UserAvatar.tsx';

import type { Component } from 'solid-js';

/**
 * User display component.
 * @remarks
 * Displays the logged-in user's name, email and avatar.
 */
export const UserDisplay: Component = () => (
  <div class='user-display'>
    <div class='user-display-text'>
      <h6>Vince Aquilina</h6>
      <address>vince.aquilina@protonmail.com</address>
    </div>
    <UserAvatar name='Vince Aquilina' />
  </div>
);
