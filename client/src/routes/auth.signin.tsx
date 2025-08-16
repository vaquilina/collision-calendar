import { createFileRoute } from '@tanstack/solid-router';

import GoogleLogo from '../../assets/google-logo.svg';

export const Route = createFileRoute('/auth/signin')({
  component: SignInComponent,
});

function SignInComponent() {
  return (
    <article class='auth-box'>
      <h5>
        Sign In <div class='circle-pulse-1' />
      </h5>
      <span>
        Enter your email below to login to your account
      </span>
      <form class='auth-form'>
        <div class='form-input'>
          <input id='email' type='email' placeholder='name@example.com' />
          <label tabindex={-1} for='email'>email</label>
        </div>
        <div class='form-input'>
          <input id='password' type='password' />
          <label tabindex={-1} for='password'>
            password
            <a href='#'>
              <small>forgot your password?</small>
            </a>
          </label>
        </div>
        <div class='form-check-input'>
          <input id='remember-me' type='checkbox' />
          <label tabindex={-1} for='remember-me'>remember me</label>
        </div>
        <button type='submit' id='login'>login</button>
      </form>
      <hr />
      <button type='button' id='oauth-google'>
        <GoogleLogo role='img' aria-label='google logo' />sign in with google
      </button>
    </article>
  );
}
