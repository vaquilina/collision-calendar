import { useContext } from 'solid-js';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-solid-js';

import { SidebarContext } from '../../context/SidebarContext.tsx';

import type { Component, JSX } from 'solid-js';

/** Button component for expanding/collapsing the sidebar. */
export const ExpandCollapseButton: Component = () => {
  const [state, setSidebarStore] = useContext(SidebarContext);

  const toggleState = () => {
    setSidebarStore((prevState) => ({ expanded: !prevState.expanded }));
  };

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent> = (event) => {
    if (
      event instanceof MouseEvent ||
      (event instanceof KeyboardEvent && (event.key === ' ' || event.key === 'Space' || event.key === 'Enter'))
    ) {
      toggleState();
    }
  };

  return (
    <button type='button' onclick={handleClick}>
      {state.expanded ? <CaretDoubleLeft weight='bold' size='1em' /> : <CaretDoubleRight weight='bold' size='1em' />}
    </button>
  );
};
