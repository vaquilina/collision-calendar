import { For, JSX, mergeProps } from 'solid-js';

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

export function SegmentedControl(props: SegmentedControlProps) {
  const finalProps = mergeProps({ items: [] }, props);
  return (
    <div class='segmented-control'>
      <For each={finalProps.items}>
        {(item) => (
          <>
            <input
              type='radio'
              id={item.id}
              name={finalProps.name}
              checked={finalProps.checked === item.id}
              disabled={item.disabled}
              onchange={[finalProps.onchange, item.id]}
            />
            <label tabIndex={-1} for={item.id} title={item.title}>{item?.icon} {item?.label}</label>
          </>
        )}
      </For>
      <div class='segmented-control-focus' />
    </div>
  );
}
