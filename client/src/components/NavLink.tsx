import * as Solid from 'solid-js';
import { createLink, LinkComponent } from '@tanstack/solid-router';

type BasicLinkProps = Solid.JSX.IntrinsicElements['a'];

const BasicLinkComponent: Solid.Component<BasicLinkProps> = (props) => (
  <a {...props} role='button' class='nav-link'>
    {props.children}
  </a>
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

/** A link component for an item in the navigation menu. */
export const NavLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload='intent' {...props} />;
};
