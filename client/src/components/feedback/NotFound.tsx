import { faker } from '@faker-js/faker';
import { Link } from '@tanstack/solid-router';

export function NotFound() {
  return (
    <>
      <header />
      <aside />
      <main>
        <div id='not-found-screen'>
          <div>
            <h3>
              there is <mark>nothing</mark> here
            </h3>
            <p id='not-found-message'>
              You <em>could</em> try to <strong>{faker.company.buzzPhrase()}</strong>... Or just{' '}
              <Link to='..'>go back.</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
