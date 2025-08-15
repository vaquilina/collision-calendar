import Calendar from '../../../assets/calendar.svg';
import Lock from '../../../assets/lock.svg';
import Settings from '../../../assets/settings.svg';
import Info from '../../../assets/circle-information.svg';
import Menu from '../../../assets/menu.svg';
import User from '../../../assets/user.svg';
import { NavLink } from './NavLink.tsx';

import { Route as calendarRoute } from '../../routes/app.calendar.tsx';
import { Route as settingsRoute } from '../../routes/app.settings.tsx';
import { Route as aboutRoute } from '../../routes/app.about.tsx';
import { Route as accountRoute } from '../../routes/app.account.tsx';
import { Route as playgroundRoute } from '../../routes/app.playground.tsx';

import type { Component } from 'solid-js';

/** Navigation menu component. */
export const NavMenu: Component = () => (
  <>
    <button type='button' id='hamburger-menu' class='small-button' title='navigation' popovertarget='nav-menu'>
      <Menu aria-role='img' aria-label='hamburger' viewBox='0 0 24 24' />
    </button>
    <div id='nav-menu' popover>
      <nav class='content'>
        <NavLink to={calendarRoute.to} title='calendar' viewTransition>
          <Calendar aria-role='img' aria-label='calendar' viewBox='0 0 24 24' />
          <span>Calendar</span>
        </NavLink>
        <NavLink to={settingsRoute.to} title='settings' viewTransition>
          <Settings aria-role='img' aria-label='cog' viewBox='0 0 24 24' />
          <span>Settings</span>
        </NavLink>
        <NavLink to={accountRoute.to} title='account' viewTransition>
          <User aria-role='img' aria-label='person' viewBox='0 0 24 24' />
          <span>Account</span>
        </NavLink>
        <NavLink to={aboutRoute.to} title='about' viewTransition>
          <Info aria-role='img' aria-label='info' viewBox='0 0 24 24' />
          <span>About</span>
        </NavLink>
        <NavLink to={playgroundRoute.to} title='playground' viewTransition>
          <Lock aria-role='img' aria-label='lock' viewBox='0 0 24 24' />
          <span>Playground</span>
        </NavLink>
      </nav>
    </div>
  </>
);
