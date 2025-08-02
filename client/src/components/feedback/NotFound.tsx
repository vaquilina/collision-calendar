import { faker } from '@faker-js/faker';

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
              <a href='#'>go back.</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
