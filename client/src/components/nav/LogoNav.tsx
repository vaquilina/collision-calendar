import { Component, useContext } from 'solid-js';

import { NavMenu } from './NavMenu.tsx';
import { ThemeSwitcher } from '../ThemeSwitcher.tsx';
import { SidebarContext } from '../../context/SidebarContext.tsx';

/**
 * Nav/Theme component.
 * @remarks
 * Section in the screen's top-left corner.
 */
export const LogoNav: Component = () => {
  const [sidebarState] = useContext(SidebarContext);

  return (
    <div class='logo-nav'>
      <NavMenu />
      {sidebarState.expanded && <ThemeSwitcher />}
    </div>
  );
};
