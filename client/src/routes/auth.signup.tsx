import { createSignal } from 'solid-js';
import { createFileRoute } from '@tanstack/solid-router';
import { createForm, formOptions } from '@tanstack/solid-form';
import { z } from 'zod';

import { MIN_NAME_LENGTH, MIN_PW_LENGTH } from '../const/auth.tsx';
import { authClient } from '../lib/auth-client.ts';

export const Route = createFileRoute('/auth/signup')({
  component: SignUpComponent,
});

interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
}

function SignUpComponent() {
  const [authError, setAuthError] = createSignal<string | undefined>();

  const formOpts = formOptions({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
    } as Register,
  });

  const form = createForm(() => ({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log(value);

      const { data, error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: `${value.firstName} ${value.lastName}`,
        callbackURL: '/app',
      }, {
        onError: (ctx) => {
          setAuthError(ctx.error?.message ?? ctx.error?.statusText);
        },
      });

      console.log({ data, error });
    },
  }));

  const formMeta = form.useStore((state) => state.fieldMeta);

  return (
    <article class='auth-box'>
      <h5>
        Sign Up{' '}
        <form.Subscribe
          selector={(state) => ({ isSubmitting: state.isSubmitting })}
          children={(state) => state().isSubmitting && <div class='circle-pulse-1' />}
        />
      </h5>
      <span>
        Enter your information to create an account
      </span>
      {authError() && <small class='invalid'>{authError()}</small>}
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
            name='firstName'
            validators={{
              onChange: z.string().min(MIN_NAME_LENGTH, {
                error: (iss) => `must be at least ${iss.minimum} character${iss.minimum > 1 ? 's' : ''} long`,
              }),
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
                  id='firstname'
                  class={!field().state.meta.isValid ? 'invalid' : undefined}
                  type='text'
                  autocomplete='given-name'
                  placeholder='Jane'
                />
              </>
            )}
          />
          <label tabindex={-1} for='firstname' class={!formMeta().firstName?.isValid ? 'invalid' : undefined}>
            first name
          </label>
        </div>
        <div class='form-input'>
          <form.Field
            name='lastName'
            validators={{
              onChange: z.string().min(MIN_NAME_LENGTH, {
                error: (iss) => `must be at least ${iss.minimum} character${iss.minimum > 1 ? 's' : ''} long`,
              }),
            }}
            children={(field) => (
              <>
                {!field().state.meta.isValid && (
                  <small class='helperText invalid'>{field().state.meta.errors[0]?.message}</small>
                )}
                <input
                  name={field().name}
                  value={field().state.value}
                  onblur={field().handleBlur}
                  oninput={(e) => field().handleChange(e.target.value)}
                  class={!field().state.meta.isValid ? 'invalid' : undefined}
                  id='lastname'
                  type='text'
                  autocomplete='family-name'
                  placeholder='Doe'
                />
              </>
            )}
          />
          <label
            tabindex={-1}
            for='lastName'
            class={!formMeta().lastName?.isValid ? 'invalid' : undefined}
          >
            last name
          </label>
        </div>
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
                  class={!field().state.meta.isValid ? 'invalid' : undefined}
                  id='email'
                  type='text'
                  autocomplete='email'
                  placeholder='name@example.com'
                />
              </>
            )}
          />
          <label tabindex={-1} for='email' class={!formMeta().email?.isValid ? 'invalid' : undefined}>email</label>
        </div>
        <div class='form-input'>
          <form.Field
            name='password'
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'required';
                if (value.length < MIN_PW_LENGTH) {
                  return `must be at least ${MIN_PW_LENGTH} character${MIN_PW_LENGTH > 1 ? 's' : ''} long`;
                }
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
          <label tabindex={-1} for='password' class={!formMeta().password?.isValid ? 'invalid' : undefined}>
            password
          </label>
        </div>
        <div class='form-input'>
          <form.Field
            name='confirm'
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) => {
                if (!value) return 'required';
                if (value !== fieldApi.form.getFieldValue('password')) return 'passwords do not match';
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
                  id='confirm'
                  type='password'
                />
              </>
            )}
          />
          <label tabindex={-1} for='confirm' class={!formMeta().confirm?.isValid ? 'invalid' : undefined}>
            confirm password
          </label>
        </div>
        <br />
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={(state) => (
            <button type='submit' id='register' disabled={!state().canSubmit}>
              {state().isSubmitting ? '...' : 'create account'}
            </button>
          )}
        />
      </form>
      <small class='better-auth'>
        secured by <a href='https://www.better-auth.com/'>better-auth</a>
      </small>
    </article>
  );
}
