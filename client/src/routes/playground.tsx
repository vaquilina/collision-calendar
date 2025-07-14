import { createFileRoute } from '@tanstack/solid-router';
import { CalendarBlank } from 'phosphor-solid-js';

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
        'gap': '1em',
        width: '300px',
      }}
    >
      <h1>This is h1</h1>
      <h2>This is h2</h2>
      <h3>This is h3</h3>
      <h4>This is h4</h4>
      <p>
        This is a paragraph with <mark>mark text</mark>.
      </p>
      <small>This is small text.</small>
      <br />
      <strong>This is strong text</strong>
      <a href='#'>anchor</a>
      <time dateTime='2025-08-23'>August 23</time>
      <button type='button'>button</button>
      <details>
        <summary>details</summary>
        <div class='content'>
          details content
        </div>
      </details>
      <span title='calendar icon' style={{ display: 'flex', 'align-items': 'center' }}>
        <CalendarBlank size={18} /> icon
      </span>
      <abbr title='abbreviation'>ABBR</abbr>
      <address class='home'>103 Campbell Ave.</address>
      <address class='place'>H.E. Brown building</address>
      <address class='email'>example@email.com</address>
      <address class='tel'>(705) 978-3845</address>
      <dfn role='definition' id='dfn-example'>definition</dfn>
      <em>emphasis</em>
      <kbd>Kbd</kbd>
      <ul>
        <li>
          A<ul>
            <li>very</li>
          </ul>
        </li>
        <li>Unordered</li>
        <li>List</li>
      </ul>
      <ol>
        <li>
          A<ol>
            <li>very,</li>
            <li>very,</li>
            <ol>
              <li>very</li>
            </ol>
          </ol>
        </li>
        <li>Orderly</li>
        <li>List</li>
      </ol>
      <fieldset>
        <legend>fieldset</legend>
        <div
          style={{
            display: 'flex',
            'flex-direction': 'column',
            gap: '1em',
          }}
        >
          <div style={{ width: '150px' }}>
            <div class='form-check-input'>
              <input id='checkbox' type='checkbox' />
              <label tabIndex={-1} for='checkbox'>checkbox</label>
            </div>
            <div class='form-check-input'>
              <input id='radio' type='radio' />
              <label tabIndex={-1} for='radio'>radio</label>
            </div>
          </div>
          <div class='form-input'>
            <select id='select' name='select' multiple>
              <option disabled>disabled</option>
              <option selected>selected</option>
              <option>normal</option>
            </select>
            <label tabIndex={-1} for='select'>Select</label>
          </div>
          <div class='form-input'>
            <textarea required id='textarea' rows={5} cols={33} placeholder='placeholder'></textarea>
            <label tabIndex={-1} for='textarea'>Textarea</label>
          </div>
          <div class='form-input'>
            <input id='text' type='text' />
            <label tabIndex={-1} for='text'>text input</label>
          </div>
          <div class='form-input'>
            <input id='search' type='search' />
            <label tabIndex={-1} for='search'>search input</label>
          </div>
          <div class='form-input'>
            <input id='number' type='number' />
            <label tabIndex={-1} for='number'>number input</label>
          </div>
          <div class='form-input'>
            <input id='url' type='url' />
            <label tabIndex={-1} for='url'>url input</label>
          </div>
          <div class='form-input'>
            <input id='date' type='date' />
            <label tabIndex={-1} for='date'>date input</label>
          </div>
          <div class='form-input'>
            <input id='datetime' type='datetime-local' />
            <label tabIndex={-1} for='datetime'>datetime-local input</label>
          </div>
          <div class='form-input'>
            <input id='month' type='month' />
            <label tabIndex={-1} for='month'>month input (no ff/safari)</label>
          </div>
          <div class='form-input'>
            <input id='week' type='week' />
            <label tabIndex={-1} for='week'>week input (no ff/safari)</label>
          </div>
          <div class='form-input'>
            <input id='time' type='time' />
            <label tabIndex={-1} for='time'>time input</label>
          </div>
          <div class='form-input'>
            <input id='tel' type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' placeholder='555-867-5309' />
            <label tabIndex={-1} for='tel'>tel input</label>
          </div>
          <div class='form-input'>
            <input id='email' type='email' placeholder='email@tld.suf' />
            <label tabIndex={-1} for='email'>email input</label>
          </div>
          <div class='form-input'>
            <input id='password' type='password' />
            <label tabIndex={-1} for='password'>password input</label>
          </div>
          <div class='form-input'>
            <input aria-hidden tabIndex={-1} id='file' type='file' />
            <label role='button' tabIndex={0} for='file'>file input</label>
          </div>
          <div class='form-input'>
            <input id='color' type='color' />
            <label tabIndex={-1} for='color'>color input</label>
          </div>
          <div class='form-input'>
            <input id='range' type='range' min={0} max={10} step={1} />
            <label tabIndex={-1} for='range'>range input</label>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
