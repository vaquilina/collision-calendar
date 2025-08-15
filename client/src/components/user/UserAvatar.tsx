import type { Component } from 'solid-js';

interface UserAvatarProps {
  name?: string;
}

/**
 * Avatar component.
 * @remarks
 * Displays a user's initials.
 */
export const UserAvatar: Component<UserAvatarProps> = (props) => {
  const initials: string | null = props?.name ? abbreviate(props.name) : null;

  return (
    <figure role='img' class='user-avatar'>
      <figcaption title={props?.name}>{initials || '??'}</figcaption>
    </figure>
  );
};

const abbreviate = (str: string) => str.split(' ').map((word) => word.at(0)).join('').slice(0, 2);
