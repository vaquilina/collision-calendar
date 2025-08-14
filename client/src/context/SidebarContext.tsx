import { createContext } from 'solid-js';

import type { SetStoreFunction } from 'solid-js/store';

export type SidebarContextValue = [{ expanded: boolean }, SetStoreFunction<{ expanded: boolean }>];

export const INITIAL_SIDEBAR_EXPANDED: boolean = true;

export const INITIAL_SIDEBAR_SETTER: SetStoreFunction<{ expanded: boolean }> = () => {};

export const SidebarContext = createContext<SidebarContextValue>([
  { expanded: INITIAL_SIDEBAR_EXPANDED },
  INITIAL_SIDEBAR_SETTER,
]);
