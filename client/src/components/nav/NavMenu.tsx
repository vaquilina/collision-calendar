import {
  CalendarBlank as CalendarIcon,
  Flask as PlaygroundIcon,
  Gear as SettingsIcon,
  HouseSimple as HomeIcon,
  Info as AboutIcon,
  List as HamburgerIcon,
  UserCircle as AccountIcon,
} from 'phosphor-solid-js';

import { NavLink } from './NavLink.tsx';

import { Route as homeRoute } from '../../routes/app.index.tsx';
import { Route as calendarRoute } from '../../routes/app.calendar.tsx';
import { Route as settingsRoute } from '../../routes/app.settings.tsx';
import { Route as aboutRoute } from '../../routes/app.about.tsx';
import { Route as accountRoute } from '../../routes/app.account.tsx';
import { Route as playgroundRoute } from '../../routes/app.playground.tsx';

import type { Component } from 'solid-js';

/** Navigation menu component. */
export const NavMenu: Component = () => (
  <>
    <button type='button' id='hamburger-menu' title='navigation' popovertarget='nav-menu'>
      <HamburgerIcon aria-label='hamburger' />
    </button>
    <div id='nav-menu' popover>
      <nav class='content'>
        <NavLink to={homeRoute.to} title='home' viewTransition>
          <HomeIcon aria-role='img' aria-label='house' />
          <span>Home</span>
        </NavLink>
        <NavLink to={calendarRoute.to} title='calendar' viewTransition>
          <CalendarIcon aria-role='img' aria-label='calendar' />
          <span>Calendar</span>
        </NavLink>
        <NavLink to={settingsRoute.to} title='settings' viewTransition>
          <SettingsIcon aria-role='img' aria-label='cog' />
          <span>Settings</span>
        </NavLink>
        <NavLink to={accountRoute.to} title='account' viewTransition>
          <AccountIcon aria-role='img' aria-label='person' />
          <span>Account</span>
        </NavLink>
        <NavLink to={aboutRoute.to} title='about' viewTransition>
          <AboutIcon aria-role='img' aria-label='info' />
          <span>About</span>
        </NavLink>
        <NavLink to={playgroundRoute.to} title='playground' viewTransition>
          <PlaygroundIcon aria-role='img' aria-label='beaker' />
          <span>Playground</span>
        </NavLink>
      </nav>
    </div>
  </>
);
