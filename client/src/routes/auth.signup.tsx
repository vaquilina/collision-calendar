import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/auth/signup')({
  component: SignUpComponent,
});

function SignUpComponent() {
  return (
    <article class='auth-box'>
      <h5>
        Sign Up <div class='circle-pulse-1' />
      </h5>
      <span>
        Enter your information to create an account
      </span>
      <form class='auth-form'>
        <div class='form-input'>
          <input id='firstname' type='text' placeholder='Jane' />
          <label tabindex={-1} for='firstname'>first name</label>
        </div>
        <div class='form-input'>
          <input id='lastname' type='text' placeholder='Doe' />
          <label tabindex={-1} for='lastName'>last name</label>
        </div>
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
        <div class='form-input'>
          <input id='confirm-password' type='password' />
          <label tabindex={-1} for='confirm-password'>confirm password</label>
        </div>
        <br />
        <button type='submit' id='login'>create account</button>
      </form>
      <small class='better-auth'>
        secured by <a href='https://www.better-auth.com/'>better-auth</a>
      </small>
    </article>
  );
}
