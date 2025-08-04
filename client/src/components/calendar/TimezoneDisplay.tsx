import { createEffect, createSignal } from 'solid-js';
import { Temporal } from '@js-temporal/polyfill';
import { Globe } from 'phosphor-solid-js';

import type { Component } from 'solid-js';

/**
 * Timezone display component.
 * @remarks
 * Displays the name of the browser's current timezone.
 */
export const TimezoneDisplay: Component = () => {
  const [timezone, setTimezone] = createSignal('');

  createEffect(() => {
    setTimezone(Temporal.Now.timeZoneId);
  });

  return (
    <h6 class='timezone-display' title={`${timezone()} time zone`}>
      <Globe aria-role='img' aria-label='Globe' />
      {timezone()}
    </h6>
  );
};
