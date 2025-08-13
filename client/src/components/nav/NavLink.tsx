import { createLink, LinkComponent } from '@tanstack/solid-router';

import type { Component, JSX } from 'solid-js';

type BasicLinkProps = JSX.IntrinsicElements['a'];

const BasicLinkComponent: Component<BasicLinkProps> = (props) => (
  <a {...props} role='button' class='nav-link'>
    {props.children}
  </a>
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

/** A link component for an item in the navigation menu. */
export const NavLink: LinkComponent<typeof BasicLinkComponent> = (props) => (
  <CreatedLinkComponent preload='intent' {...props} />
);
