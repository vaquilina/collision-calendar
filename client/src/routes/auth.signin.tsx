import { createFileRoute } from '@tanstack/solid-router';
import { createForm, formOptions } from '@tanstack/solid-form';
import { z } from 'zod';

export const Route = createFileRoute('/auth/signin')({
  component: SignInComponent,
});

interface Login {
  email: string;
  password: string;
  remember: boolean;
}

function SignInComponent() {
  const formOpts = formOptions({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    } as Login,
  });

  const form = createForm(() => ({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  }));

  const formMeta = form.useStore((state) => state.fieldMeta);

  return (
    <article class='auth-box'>
      <h5>
        Sign In{' '}
        <form.Subscribe
          selector={(state) => ({ isSubmitting: state.isSubmitting })}
          children={(state) => state().isSubmitting && <div class='circle-pulse-1' />}
        />
      </h5>
      <span>
        Enter your email below to login to your account
      </span>
      <form
        class='auth-form'
        onsubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div class='form-input'>
          <form.Field
            name='email'
            validators={{
              onChange: z.email({ error: 'please enter a valid email address' }),
            }}
            children={(field) => (
              <>
                {!field().state.meta.isValid && (
                  <small class='helper-text invalid'>{field().state.meta.errors[0]?.message}</small>
                )}
                <input
                  name={field().name}
                  value={field().state.value}
                  onblur={field().handleBlur}
                  oninput={(e) => field().handleChange(e.target.value)}
                  id='email'
                  class={!field().state.meta.isValid ? 'invalid' : undefined}
                  type='text'
                  autocomplete='email'
                  placeholder='name@example.com'
                />
              </>
            )}
          />
          <label tabindex={-1} for='email' class={!formMeta().email?.isValid ? 'invalid' : undefined}>
            email
          </label>
        </div>
        <div class='form-input'>
          <form.Field
            name='password'
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'required';
                return undefined;
              },
            }}
            children={(field) => (
              <>
                {!field().state.meta.isValid && (
                  <small class='helper-text invalid'>{field().state.meta.errors[0]}</small>
                )}
                <input
                  name={field().name}
                  class={!field().state.meta.isValid ? 'invalid' : undefined}
                  value={field().state.value}
                  onblur={field().handleBlur}
                  oninput={(e) => field().handleChange(e.target.value)}
                  id='password'
                  type='password'
                />
              </>
            )}
          />
          <label tabindex={-1} for='password' class={!formMeta().password?.isValid ? 'invalid' : ''}>
            password
            <a href='#'>
              <small>forgot your password?</small>
            </a>
          </label>
        </div>
        <div class='form-check-input'>
          <form.Field
            name='remember'
            children={(field) => (
              <input
                name={field().name}
                checked={field().state.value}
                onblur={field().handleBlur}
                oninput={(e) => field().handleChange(e.target.checked)}
                id='remember'
                type='checkbox'
              />
            )}
          />
          <label tabindex={-1} for='remember'>remember me</label>
        </div>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={(state) => (
            <button type='submit' id='login' disabled={!state().canSubmit}>
              {state().isSubmitting ? '...' : 'login'}
            </button>
          )}
        />
      </form>
    </article>
  );
}
