/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root.tsx'
import { Route as SettingsRouteImport } from './routes/settings.tsx'
import { Route as PlaygroundRouteImport } from './routes/playground.tsx'
import { Route as LogoutRouteImport } from './routes/logout.tsx'
import { Route as CalendarRouteImport } from './routes/calendar.tsx'
import { Route as AccountRouteImport } from './routes/account.tsx'
import { Route as AboutRouteImport } from './routes/about.tsx'
import { Route as IndexRouteImport } from './routes/index.tsx'

const SettingsRoute = SettingsRouteImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRouteImport,
} as any)
const PlaygroundRoute = PlaygroundRouteImport.update({
  id: '/playground',
  path: '/playground',
  getParentRoute: () => rootRouteImport,
} as any)
const LogoutRoute = LogoutRouteImport.update({
  id: '/logout',
  path: '/logout',
  getParentRoute: () => rootRouteImport,
} as any)
const CalendarRoute = CalendarRouteImport.update({
  id: '/calendar',
  path: '/calendar',
  getParentRoute: () => rootRouteImport,
} as any)
const AccountRoute = AccountRouteImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/account': typeof AccountRoute
  '/calendar': typeof CalendarRoute
  '/logout': typeof LogoutRoute
  '/playground': typeof PlaygroundRoute
  '/settings': typeof SettingsRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/account': typeof AccountRoute
  '/calendar': typeof CalendarRoute
  '/logout': typeof LogoutRoute
  '/playground': typeof PlaygroundRoute
  '/settings': typeof SettingsRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/account': typeof AccountRoute
  '/calendar': typeof CalendarRoute
  '/logout': typeof LogoutRoute
  '/playground': typeof PlaygroundRoute
  '/settings': typeof SettingsRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/account'
    | '/calendar'
    | '/logout'
    | '/playground'
    | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/account'
    | '/calendar'
    | '/logout'
    | '/playground'
    | '/settings'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/account'
    | '/calendar'
    | '/logout'
    | '/playground'
    | '/settings'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  AccountRoute: typeof AccountRoute
  CalendarRoute: typeof CalendarRoute
  LogoutRoute: typeof LogoutRoute
  PlaygroundRoute: typeof PlaygroundRoute
  SettingsRoute: typeof SettingsRoute
}

declare module '@tanstack/solid-router' {
  interface FileRoutesByPath {
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/playground': {
      id: '/playground'
      path: '/playground'
      fullPath: '/playground'
      preLoaderRoute: typeof PlaygroundRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/logout': {
      id: '/logout'
      path: '/logout'
      fullPath: '/logout'
      preLoaderRoute: typeof LogoutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/calendar': {
      id: '/calendar'
      path: '/calendar'
      fullPath: '/calendar'
      preLoaderRoute: typeof CalendarRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/account': {
      id: '/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AccountRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  AccountRoute: AccountRoute,
  CalendarRoute: CalendarRoute,
  LogoutRoute: LogoutRoute,
  PlaygroundRoute: PlaygroundRoute,
  SettingsRoute: SettingsRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
