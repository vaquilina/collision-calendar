import { createStore } from 'solid-js/store';

import { INITIAL_SIDEBAR_EXPANDED, SidebarContext } from './SidebarContext.tsx';

import type { SidebarContextValue } from './SidebarContext.tsx';
import type { ParentComponent } from 'solid-js';

interface SidebarProviderProps {
  expanded: boolean;
}

export const SidebarProvider: ParentComponent<SidebarProviderProps> = (props) => {
  const [value, setValue] = createStore({ expanded: props.expanded || INITIAL_SIDEBAR_EXPANDED });

  const sidebarContextValue: SidebarContextValue = [
    value,
    setValue,
  ];

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      {props.children}
    </SidebarContext.Provider>
  );
};
