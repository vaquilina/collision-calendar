import { createEffect, createSignal } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import { Globe } from 'phosphor-solid-js';

/**
 * Timezone display component.
 * @remarks
 * Displays the name of the browser's current timezone.
 */
export function TimezoneDisplay() {
  const [timezone, setTimezone] = createSignal('');

  createEffect(() => {
    setTimezone(Temporal.Now.timeZoneId);
  });

  return (
    <h6 class='timezone-display' title='Timezone'>
      <Globe />
      {timezone()}
    </h6>
  );
}
