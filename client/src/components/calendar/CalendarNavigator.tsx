import { CaretLeft, CaretRight } from 'phosphor-solid-js';

/**
 * Calendar navigator component.
 * @remarks
 * The navigator consists of:
 * - a 'today' shortcut
 * - an indicator displaying the current timeframe in view
 * - buttons to shift the timeframe forward or backward
 */
export function CalendarNavigator() {
  return (
    <div class='cal-navigator'>
      <div>
        <button type='button' title='Go to today'>Today</button>
        <button id='cal-backward' type='button'>
          <CaretLeft size={12} />
        </button>
        <button id='cal-forward' type='button'>
          <CaretRight size={12} />
        </button>
      </div>
      <h5>September 2025</h5>
    </div>
  );
}
