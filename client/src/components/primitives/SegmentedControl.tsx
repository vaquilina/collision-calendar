import { For, mergeProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export type SegmentedControlItem = {
  id: string;
  title: string;
  icon?: JSX.Element;
  label?: string;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  name: string;
  checked: SegmentedControlItem['id'];
  items?: SegmentedControlItem[];
  onchange: (id: string) => void;
};

export const SegmentedControl: Component<SegmentedControlProps> = (props) => {
  const finalProps = mergeProps({ items: [] }, props);

  const handleKeyDown: JSX.BoundEventHandler<HTMLLabelElement, KeyboardEvent>[0] = (itemId, event) => {
    if (
      typeof itemId === 'string' &&
      (event instanceof KeyboardEvent && (event.key === ' ' || event.key === 'Space' || event.key === 'Enter'))
    ) {
      event.preventDefault();
      finalProps.onchange(itemId);
    }
  };

  return (
    <div class='segmented-control' aria-role='radiogroup'>
      <For each={finalProps.items}>
        {(item) => (
          <>
            <input
              aria-hidden
              type='radio'
              id={item.id}
              name={finalProps.name}
              value={item.id}
              checked={finalProps.checked === item.id}
              disabled={item.disabled}
              onchange={[finalProps.onchange, item.id]}
            />
            <label
              aria-label={item.title}
              aria-role='button'
              tabIndex={0}
              for={item.id}
              onkeydown={[handleKeyDown, item.id]}
              title={item.title}
            >
              {item?.icon} {item?.label}
              <span class='visually-hidden'>{item.title}</span>
            </label>
          </>
        )}
      </For>
      <div class='segmented-control-focus' />
    </div>
  );
};
