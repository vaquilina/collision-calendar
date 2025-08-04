import { UserRectangle } from 'phosphor-solid-js';

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
    <UserRectangle aria-role='img' aria-label='user avatar' title='avatar' size={40} weight='thin' />
  </div>
);
