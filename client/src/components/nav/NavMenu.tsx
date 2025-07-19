import {
  CalendarBlank as CalendarIcon,
  Flask as PlaygroundIcon,
  Gear as SettingsIcon,
  HouseSimple as HomeIcon,
  Info as AboutIcon,
  List as HamburgerIcon,
  SignOut as LogoutIcon,
  UserCircle as AccountIcon,
} from 'phosphor-solid-js';

import { NavLink } from './NavLink.tsx';

import { Route as homeRoute } from '../../routes/index.tsx';
import { Route as calendarRoute } from '../../routes/calendar.tsx';
import { Route as settingsRoute } from '../../routes/settings.tsx';
import { Route as aboutRoute } from '../../routes/about.tsx';
import { Route as accountRoute } from '../../routes/account.tsx';
import { Route as playgroundRoute } from '../../routes/playground.tsx';
import { Route as logoutRoute } from '../../routes/logout.tsx';

export function NavMenu() {
  return (
    <>
      <button type='button' id='hamburger-menu' popovertarget='nav-menu'>
        <HamburgerIcon />
      </button>
      <div id='nav-menu' popover>
        <nav class='content'>
          <NavLink to={homeRoute.to} viewTransition>
            <HomeIcon />
            <span>Home</span>
          </NavLink>
          <NavLink to={calendarRoute.to} viewTransition>
            <CalendarIcon />
            <span>Calendar</span>
          </NavLink>
          <NavLink to={settingsRoute.to} viewTransition>
            <SettingsIcon />
            <span>Settings</span>
          </NavLink>
          <NavLink to={accountRoute.to} viewTransition>
            <AccountIcon />
            <span>Account</span>
          </NavLink>
          <NavLink to={aboutRoute.to} viewTransition>
            <AboutIcon />
            <span>About</span>
          </NavLink>
          <NavLink to={playgroundRoute.to} viewTransition>
            <PlaygroundIcon />
            <span>Playground</span>
          </NavLink>
          <NavLink to={logoutRoute.to} viewTransition>
            <LogoutIcon />
            <span>Log out</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
}
