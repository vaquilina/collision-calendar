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

  const mediaQuery = matchMedia('(max-width: 450px)');

  return (
    <div class='logo-nav'>
      <NavMenu />
      {mediaQuery.matches || sidebarState.expanded && <ThemeSwitcher />}
    </div>
  );
};
