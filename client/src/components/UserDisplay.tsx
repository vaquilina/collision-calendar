import { UserRectangle } from 'phosphor-solid-js';

/**
 * User display component.
 * @remarks
 * Displays the logged-in user's name, email and avatar.
 */
export function UserDisplay() {
  return (
    <div class='user-display'>
      <div class='user-display-text'>
        <h6>Vince Aquilina</h6>
        <address>vince.aquilina@protonmail.com</address>
      </div>
      <UserRectangle size={38} weight='thin' />
    </div>
  );
}
