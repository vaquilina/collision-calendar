import { useContext } from 'solid-js';

import ChevronDoubleLeft from '../../../assets/chevron-double-left.svg';
import ChevronDoubleRight from '../../../assets/chevron-double-right.svg';
import { SidebarContext } from '../../context/SidebarContext.tsx';

import type { Component, JSX } from 'solid-js';

/** Button component for expanding/collapsing the sidebar. */
export const ExpandCollapseButton: Component = () => {
  const [state, setSidebarStore] = useContext(SidebarContext);

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent | KeyboardEvent> = (event) => {
    if (
      event instanceof MouseEvent ||
      (event instanceof KeyboardEvent && (event.key === ' ' || event.key === 'Space' || event.key === 'Enter'))
    ) {
      setSidebarStore((prevState) => ({ expanded: !prevState.expanded }));
    }
  };

  return (
    <button type='button' onclick={handleClick} title={`${state.expanded ? 'collapse' : 'expand'} sidebar`}>
      {state.expanded
        ? <ChevronDoubleLeft aria-role='img' aria-label='double caret left' viewBox='2 0 20 20' />
        : <ChevronDoubleRight aria-role='img' aria-label='double caret right' viewBox='2 0 20 20' />}
    </button>
  );
};
