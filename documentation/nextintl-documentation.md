TITLE: Using `useTranslations` Hook in Next.js with next-intl
DESCRIPTION: This snippet demonstrates how to use the `useTranslations` hook from `next-intl` within a React component to fetch and display localized messages. It shows interpolation for dynamic values like `firstName`, `memberSince`, and pluralization for `followers` count. The `UserProfile` namespace is used to scope the translations.
SOURCE: https://github.com/amannn/next-intl/blob/main/README.md#_snippet_0

LANGUAGE: jsx
CODE:
```
// UserProfile.tsx
import {useTranslations} from 'next-intl';

export default function UserProfile({user}) {
  const t = useTranslations('UserProfile');

  return (
    <section>
      <h1>{t('title', {firstName: user.firstName})}</h1>
      <p>{t('membership', {memberSince: user.memberSince})}</p>
      <p>{t('followers', {count: user.numFollowers})}</p>
    </section>
  );
}
```

----------------------------------------

TITLE: Using next-intl Translations in Server Components (getTranslations)
DESCRIPTION: This snippet from `src/app/[locale]/page.tsx` demonstrates how to fetch translations directly within an async Server Component. It uses the awaitable `getTranslations` function from `next-intl/server` to retrieve messages for a namespace ('HomePage') without requiring a client-side hook.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/with-i18n-routing.mdx#_snippet_12

LANGUAGE: tsx
CODE:
```
import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

----------------------------------------

TITLE: Setting Request Locale in Root Layout for Static Rendering (TypeScript)
DESCRIPTION: This code snippet shows how to use `setRequestLocale` within a root layout (`app/[locale]/layout.tsx`) to enable static rendering. It validates the incoming `locale` parameter against a list of supported locales, redirecting to a 404 page if invalid. By calling `setRequestLocale(locale)`, the current locale is made available to all Server Components, allowing `next-intl` APIs to function without opting into dynamic rendering.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/with-i18n-routing.mdx#_snippet_14

LANGUAGE: tsx
CODE:
```
import {setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    // ...
  );
}
```

----------------------------------------

TITLE: Configuring Server-Side Internationalization with getRequestConfig (TypeScript)
DESCRIPTION: This snippet demonstrates how to configure server-side internationalization using `getRequestConfig` from `next-intl/server`. It defines a default export function that receives `requestLocale` and returns an object containing `locale` and `messages`, which are used for internationalization in Server Components, Server Actions, and related server-only code. This configuration is created once per request and can access request-specific data like cookies or headers.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/configuration.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import {getRequestConfig} from 'next-intl/server';
import {routing} from '@/i18n/routing';

export default getRequestConfig(async ({requestLocale}) => {
  // ...

  return {
    locale,
    messages
    // ...
  };
});
```

----------------------------------------

TITLE: Configuring Root Layout for Locale Handling in Next.js App Router
DESCRIPTION: This `src/app/[locale]/layout.tsx` snippet shows how to integrate 'next-intl' into the root layout. It validates the incoming locale, sets the `lang` attribute on the `<html>` tag, and wraps children with `NextIntlClientProvider` to make i18n configuration available to Client Components.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/with-i18n-routing.mdx#_snippet_10

LANGUAGE: tsx
CODE:
```
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

----------------------------------------

TITLE: Creating Navigation APIs with Defined Locales (TSX)
DESCRIPTION: This snippet demonstrates the standard way to create locale-aware navigation APIs using `createNavigation`. It imports the function from `next-intl/navigation` and a local `routing` configuration (expected to include defined `locales`), then calls `createNavigation` with this configuration to destructure and export the internationalized `Link`, `redirect`, `usePathname`, `useRouter`, and `getPathname` functions/components.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/navigation.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

----------------------------------------

TITLE: Setting Request Locale in Individual Page for Static Rendering (TypeScript)
DESCRIPTION: This snippet illustrates how to apply `setRequestLocale` within an individual page (`app/[locale]/page.tsx`) to enable static rendering. It extracts the `locale` from `params` and sets it using `setRequestLocale` before any `next-intl` hooks like `useTranslations` are invoked. This ensures that the page can be statically rendered while still utilizing `next-intl`'s translation capabilities.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/with-i18n-routing.mdx#_snippet_15

LANGUAGE: tsx
CODE:
```
import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {useTranslations} from 'next-intl';

export default function IndexPage({params}) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  // Once the request locale is set, you
  // can call hooks from `next-intl`
  const t = useTranslations('IndexPage');

  return (
    // ...
  );
}
```

----------------------------------------

TITLE: Formatting Dates and Times with `useFormatter` in Next.js (JavaScript)
DESCRIPTION: This snippet demonstrates how to use the `dateTime` function from `next-intl`'s `useFormatter` hook to format a `Date` object. It shows how to specify formatting options like year, month, day, hour, and minute, similar to `Intl.DateTimeFormat`.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/dates-times.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import {useFormatter} from 'next-intl';

function Component() {
  const format = useFormatter();
  const dateTime = new Date('2020-11-20T10:36:01.516Z');

  // Renders "Nov 20, 2020"
  format.dateTime(dateTime, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Renders "11:36 AM"
  format.dateTime(dateTime, {hour: 'numeric', minute: 'numeric'});
}
```

----------------------------------------

TITLE: Using NextIntlClientProvider in RootLayout (TSX)
DESCRIPTION: This snippet demonstrates how to integrate `NextIntlClientProvider` within a Next.js `RootLayout` Server Component. It provides internationalization context to client components, inheriting locale and messages from the server.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/configuration.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function RootLayout(/* ... */) {
  // ...

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>...</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

----------------------------------------

TITLE: Augmenting Messages Type for Strict Key Validation (TypeScript)
DESCRIPTION: This snippet shows how to augment the `Messages` type in `AppConfig` by importing a default locale message file. This enables `next-intl` to infer the message structure, providing strict type checking for message keys used with `useTranslations`.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/workflows/typescript.mdx#_snippet_7

LANGUAGE: ts
CODE:
```
import messages from './messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    // ...
    Messages: typeof messages;
  }
}
```

----------------------------------------

TITLE: Implementing Localized Pathnames Navigation - next-intl
DESCRIPTION: This example shows how to configure localized pathnames using `createLocalizedPathnamesNavigation` from `next-intl`. It defines a `pathnames` object to map internal paths to locale-specific external paths, enabling flexible routing for internationalized applications. This approach allows for upgrading from shared to localized pathnames by replacing the factory function.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-3-0.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';

export const locales = ['en', 'de'] as const;

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  '/': '/',
  '/blog': '/blog',

  // If locales use different paths, you can
  // specify each external path per locale.
  '/about': {
    en: '/about',
    de: '/ueber-uns'
  }
} satisfies Pathnames<typeof locales>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, pathnames});
```

----------------------------------------

TITLE: Using useTranslations Hook in React Component
DESCRIPTION: This snippet demonstrates how to use the `useTranslations` hook from `use-intl` within a React functional component. It shows how to retrieve a translation function `t` scoped to 'UserProfile' and use it to display localized messages, including interpolated values for `firstName` and `memberSince`, and handling pluralization for `followers` count.
SOURCE: https://github.com/amannn/next-intl/blob/main/packages/use-intl/README.md#_snippet_0

LANGUAGE: jsx
CODE:
```
// UserProfile.tsx
import {useTranslations} from 'use-intl';

export default function UserProfile({user}) {
  const t = useTranslations('UserProfile');

  return (
    <section>
      <h1>{t('title', {firstName: user.firstName})}</h1>
      <p>{t('membership', {memberSince: user.memberSince})}</p>
      <p>{t('followers', {count: user.numFollowers})}</p>
    </section>
  );
}
```

----------------------------------------

TITLE: Using `useTranslations` Hook in React Components (Next.intl)
DESCRIPTION: Demonstrates the standard way to consume translations within a React component using the `useTranslations` hook from `next-intl`. It initializes a translation function `t` scoped to 'About' messages, which is then used to display a translated title.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/translations-outside-of-react-components.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import {useTranslations} from 'next-intl';

function About() {
  const t = useTranslations('About');
  return <h1>{t('title')}</h1>;
}
```

----------------------------------------

TITLE: Creating next-intl Middleware in TypeScript
DESCRIPTION: This snippet demonstrates how to set up the `next-intl` middleware in a `middleware.ts` file. It imports `createMiddleware` and a `routing` configuration, then exports the middleware. Additionally, it defines a `config` object with a `matcher` regex to apply the middleware to all pathnames except those starting with `/api`, `/trpc`, `/_next`, `/_vercel`, or containing a dot (like file extensions).
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/middleware.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

----------------------------------------

TITLE: Using useTranslations with Type-Safe Message Keys (TypeScript)
DESCRIPTION: This snippet demonstrates the type-safe usage of `useTranslations` with augmented `Messages`. It shows how valid message keys like 'title' are accepted, while unknown keys like 'description' are flagged as errors, ensuring strict message key validation.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/workflows/typescript.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
function About() {
  // ✅ Valid namespace
  const t = useTranslations('About');

  // ✖️ Unknown message key
  t('description');

  // ✅ Valid message key
  t('title');
}
```

----------------------------------------

TITLE: Defining ICU Messages in JSON for next-intl
DESCRIPTION: This JSON snippet illustrates how to define messages using ICU message syntax for `next-intl`. It includes examples of simple interpolation (`title`), date formatting (`membership`), and pluralization rules (`followers`) for different counts. The `UserProfile` key corresponds to the namespace used in the `useTranslations` hook.
SOURCE: https://github.com/amannn/next-intl/blob/main/README.md#_snippet_1

LANGUAGE: json
CODE:
```
// en.json
{
  "UserProfile": {
    "title": "{firstName}'s profile",
    "membership": "Member since {memberSince, date, short}",
    "followers": "{count, plural, \n                    =0 {No followers yet} \n                    =1 {One follower} \n                    other {# followers} \n                  }"
  }
}
```

----------------------------------------

TITLE: Augmenting next-intl AppConfig for Locale, Messages, and Formats (TypeScript)
DESCRIPTION: This snippet demonstrates how to augment the `AppConfig` interface within the `next-intl` module to provide type definitions for `Locale`, `Messages`, and `Formats`. This enhances autocompletion and type safety across the application by linking to routing locales, message files, and format definitions.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/workflows/typescript.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import {routing} from '@/i18n/routing';
import {formats} from '@/i18n/request';
import messages from './messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
```

----------------------------------------

TITLE: Defining ICU Messages in JSON for Localization
DESCRIPTION: This JSON snippet illustrates the structure for defining localized messages using ICU message syntax. It includes examples of simple string interpolation (`title`), date formatting (`membership` using `date, short`), and complex cardinal pluralization (`followers`) based on a `count` variable, demonstrating how different forms are selected for zero, one, and other values.
SOURCE: https://github.com/amannn/next-intl/blob/main/packages/use-intl/README.md#_snippet_1

LANGUAGE: js
CODE:
```
// en.json
{
  "UserProfile": {
    "title": "{firstName}'s profile",
    "membership": "Member since {memberSince, date, short}",
    "followers": "{count, plural,\n                    =0 {No followers yet}\n                    =1 {One follower}\n                    other {# followers}\n                  }"
  }
}
```

----------------------------------------

TITLE: Using `createNavigation` for Routing in Next-intl (TypeScript)
DESCRIPTION: This snippet illustrates the basic usage of the new `createNavigation` function, which unifies and supersedes previous navigation APIs. It shows how to import `createNavigation` and `defineRouting`, then destructure `Link`, `redirect`, `usePathname`, and `useRouter` for use in Next.js applications.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-3-22.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting(/* ... */);

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
```

----------------------------------------

TITLE: Accessing Message with Cardinal Pluralization - JavaScript
DESCRIPTION: This JavaScript snippet demonstrates how to use the `t` function to retrieve a pluralized message. The `count` parameter is passed, and `next-intl` automatically selects the correct plural form based on the number and locale rules.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/messages.mdx#_snippet_15

LANGUAGE: javascript
CODE:
```
t('message', {count: 3580}); // "You have 3,580 followers."
```

----------------------------------------

TITLE: Integrating Centralized Routing with `next-intl` Middleware (TypeScript)
DESCRIPTION: This example shows how to integrate the centralized `routing` configuration, previously defined using `defineRouting`, into `next-intl`'s middleware. By importing `createMiddleware` and the `routing` object, it simplifies the setup of internationalized routing for Next.js applications.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-3-22.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

// ...
```

----------------------------------------

TITLE: Migrate to `t.rich` for Rich Text Formatting in `useTranslations`
DESCRIPTION: This breaking change introduces a separate API for rich text formatting within the `useTranslations` hook. Previously, the `t` function handled both regular and rich text messages. Now, `t` is exclusively for regular messages, and `t.rich` must be used for rich text to avoid TypeScript type casting issues.
SOURCE: https://github.com/amannn/next-intl/blob/main/packages/use-intl/CHANGELOG.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
// Old API (deprecated for rich text formatting):
t(messageKey, { values, ...options }) // Used for both regular and rich text

// New API for rich text formatting:
t.rich(messageKey, { values, ...options })

// API for regular messages (unchanged):
t(messageKey, { values, ...options })
```

----------------------------------------

TITLE: Structuring a Next.js Form with Server-Side Internationalization
DESCRIPTION: This Server Component (`RegisterPage`) demonstrates how to build a form while keeping internationalization on the server. It uses `useTranslations` for labels and renders various Client Components (`RegisterForm`, `FormField`, `FormSubmitButton`) for interactive parts, passing translated labels as props. It also defines a server action `registerAction` for form submission.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/environments/server-client-components.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import {useTranslations} from 'next-intl';

// A Client Component, so that `useActionState` can be used
// to potentially display errors received after submission.
import RegisterForm from './RegisterForm';

// A Client Component, so that `useFormStatus` can be used
// to disable the input field during submission.
import FormField from './FormField';

// A Client Component, so that `useFormStatus` can be used
// to disable the submit button during submission.
import FormSubmitButton from './FormSubmitButton';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');

  function registerAction() {
    'use server';
    // ...
  }

  return (
    <RegisterForm action={registerAction}>
      <FormField label={t('firstName')} name="firstName" />
      <FormField label={t('lastName')} name="lastName" />
      <FormField label={t('email')} name="email" />
      <FormField label={t('password')} name="password" />
      <FormSubmitButton label={t('submit')} />
    </RegisterForm>
  );
}
```

----------------------------------------

TITLE: Setting up next-intl Request Configuration for Server Components
DESCRIPTION: This snippet from `src/i18n/request.ts` configures 'next-intl' for Server Components. It uses `getRequestConfig` to determine the current locale based on the request and dynamically loads the corresponding message file, falling back to a default locale if the requested one is invalid.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/with-i18n-routing.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

----------------------------------------

TITLE: Localize Zod Validation Errors in Server Actions with next-intl
DESCRIPTION: Shows how to integrate `next-intl/server` with Zod's `errorMap` to localize validation error messages within Next.js Server Actions. This approach allows mapping structured Zod errors to translated messages based on the current locale.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/environments/actions-metadata-route-handlers.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import {getTranslations} from 'next-intl/server';
import {loginUser} from '@/services/session';
import {z} from 'zod';

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// ...

async function loginAction(data: FormData) {
  'use server';

  const t = await getTranslations('LoginForm');
  const values = Object.fromEntries(data);

  const result = loginFormSchema.safeParse(values, {
    errorMap(issue, ctx) {
      const path = issue.path.join('.');

      const message = {
        email: t('invalidEmail'),
        password: t('invalidPassword')
      }[path];

      return {message: message || ctx.defaultError};
    }
  });

  // ...
}
```

----------------------------------------

TITLE: Setting Up IntlProvider and Using Translations
DESCRIPTION: This example demonstrates the core setup for `use-intl` by wrapping the application with `IntlProvider`. It shows how to pass a `messages` object and `locale` to the provider. Within a child component (`App`), the `useTranslations` hook is then used to access and display a localized greeting, illustrating the end-to-end flow of internationalization.
SOURCE: https://github.com/amannn/next-intl/blob/main/packages/use-intl/README.md#_snippet_2

LANGUAGE: jsx
CODE:
```
import {IntlProvider, useTranslations} from 'use-intl';

// You can get the messages from anywhere you like. You can also
// fetch them from within a component and then render the provider
// along with your app once you have the messages.
const messages = {
  App: {
    hello: 'Hello {firstName}!'
  }
};

function Root() {
  return (
    <IntlProvider messages={messages} locale="en">
      <App user={{firstName: 'Jane'}} />
    </IntlProvider>
  );
}

function App({user}) {
  const t = useTranslations('App');
  return <h1>{t('hello', {firstName: user.firstName})}</h1>;
}
```

----------------------------------------

TITLE: Define Routing Configuration with `next-intl`
DESCRIPTION: This snippet demonstrates how to use the `defineRouting` function from `next-intl/routing` to configure global routing settings. It specifies the list of supported `locales` and the `defaultLocale` to be used when no locale matches. This configuration is shared between middleware and navigation APIs.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de'],

  // Used when no locale matches
  defaultLocale: 'en'
});
```

----------------------------------------

TITLE: Using `useTranslations` Hook in Next.js App Router (TSX)
DESCRIPTION: This snippet demonstrates how to use the `useTranslations` hook from `next-intl` in a client-side or synchronous React component within the Next.js App Router. It initializes a translation function `t` for the 'HomePage' namespace, which is then used to display a translated title. This approach is suitable for components that do not require asynchronous data fetching for translations.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/without-i18n-routing.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

----------------------------------------

TITLE: Using Type-Safe Message Arguments in a React Component (TSX)
DESCRIPTION: This TSX component demonstrates how to use `useTranslations` with type-safe message arguments. It highlights that calling `t('title')` without the required `firstName` argument results in a type error, while providing it correctly satisfies the type contract.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/workflows/typescript.mdx#_snippet_10

LANGUAGE: tsx
CODE:
```
function UserProfile({user}) {
  const t = useTranslations('UserProfile');

  // ✖️ Missing argument
  t('title');

  // ✅ Argument is provided
  t('title', {firstName: user.firstName});
}
```

----------------------------------------

TITLE: Formatting Dates in Components with next-intl/useFormatter (TypeScript)
DESCRIPTION: This snippet illustrates how to use the `useFormatter` hook from `next-intl` within a React component to format dates consistently across server and client environments. It shows examples of formatting a date as a full date string (`dateTime`) and as a relative time string (`relativeTime`), leveraging the centralized configuration from `i18n/request.ts`.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/date-formatting-nextjs.mdx#_snippet_10

LANGUAGE: TypeScript
CODE:
```
import {useFormatter} from 'next-intl';

type Props = {
  published: Date;
};

export default function BlogPostPublishedDate({published}: Props) {
  // ✅ Works in any environment
  const format = useFormatter();

  // "Sep 25, 2024"
  format.dateTime(published);

  // "8 days ago"
  format.relativeTime(published);
}
```

----------------------------------------

TITLE: Using getTranslations in an Async Server Component (next-intl, TSX)
DESCRIPTION: This example illustrates the use of the awaitable `getTranslations` function from `next-intl/server` within an async React Server Component. This approach is suitable for components that primarily fetch data and cannot use React hooks. It demonstrates fetching user data and then translations for the 'ProfilePage' namespace, passing a dynamic username to the translation.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/environments/server-client-components.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
import {getTranslations} from 'next-intl/server';

export default async function ProfilePage() {
  const user = await fetchUser();
  const t = await getTranslations('ProfilePage');

  return (
    <PageLayout title={t('title', {username: user.name})}>
      <UserDetails user={user} />
    </PageLayout>
  );
}
```

----------------------------------------

TITLE: Defining a Message with Cardinal Pluralization - JSON
DESCRIPTION: This JSON snippet defines a message key 'message' that utilizes ICU message syntax for cardinal pluralization. It provides different forms based on the `count` value, including specific cases for zero and one, and a general 'other' case using the '#' marker for number formatting.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/messages.mdx#_snippet_14

LANGUAGE: json
CODE:
```
"message": "You have {count, plural, =0 {no followers yet} =1 {one follower} other {# followers}}."
```

----------------------------------------

TITLE: Configuring Request-Specific Environment with next-intl/server (TypeScript)
DESCRIPTION: This snippet demonstrates how to configure request-specific environment properties (`now`, `timeZone`, `locale`) using `getRequestConfig` from `next-intl/server`. This centralized configuration helps prevent hydration mismatches by ensuring consistent values across server and client, allowing dynamic settings per user request.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/date-formatting-nextjs.mdx#_snippet_9

LANGUAGE: TypeScript
CODE:
```
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => ({
  // (opt-in to use a shared value across the app)
  now: new Date(),

  // (defaults to the server's time zone)
  timeZone: 'Europe/Berlin',

  // (requires an explicit preference)
  locale: 'en'

  // ...
}));
```

----------------------------------------

TITLE: Inferring ICU Argument Types with next-intl `t` function (TSX)
DESCRIPTION: This snippet demonstrates how `next-intl` automatically infers the required types for ICU message arguments based on the message string. It shows examples for various ICU formats like `string`, `Date`, `number`, `plural`, `select`, and `rich` tags, enabling autocompletion and early error detection in the IDE.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-4-0.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
// "Hello {name}"
t('message', {});
//           ^? {name: string}

// "It's {today, date, long}"
t('message', {});
//           ^? {today: Date}

// "Page {page, number} out of {total, number}"
t('message', {});
//           ^? {page: number, total: number}

// "You have {count, plural, =0 {no followers yet} one {one follower} other {# followers}}."
t('message', {});
//           ^? {count: number}

// "Country: {country, select, US {United States} CA {Canada} other {Other}"
t('message', {});
//           ^? {country: 'US' | 'CA' | (string & {})}

// "Please refer to the <link>guidelines</link>."
t.rich('message', {});
//                ^? {link: (chunks: ReactNode) => ReactNode}
```

----------------------------------------

TITLE: Using useRouter for Programmatic Navigation (next-intl, TSX)
DESCRIPTION: Demonstrates how to use the `useRouter` hook from `next-intl` for programmatic navigation within a client component. It shows examples of pushing a new route by pathname, pushing with search parameters using the `query` option, and replacing the current route while overriding the locale. Requires importing `useRouter` from the `next-intl` navigation module.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/navigation.mdx#_snippet_8

LANGUAGE: TSX
CODE:
```
'use client';

import {useRouter} from '@/i18n/navigation';

const router = useRouter();

// When the user is on `/en`, the router will navigate to `/en/about`
router.push('/about');

// Search params can be added via `query`
router.push({
  pathname: '/users',
  query: {sortBy: 'name'}
});

// You can override the `locale` to switch to another language
router.replace('/about', {locale: 'de'});
```

----------------------------------------

TITLE: Using `getTranslations` Function in Next.js App Router (TSX)
DESCRIPTION: This snippet illustrates the use of the awaitable `getTranslations` function from `next-intl/server` for asynchronous components, typically server components, in the Next.js App Router. It asynchronously fetches the translation function `t` for the 'HomePage' namespace, enabling server-side translation rendering. This method is essential for components that need to fetch translations before rendering on the server.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/without-i18n-routing.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

----------------------------------------

TITLE: Using useTranslations in a Non-Async Server Component (next-intl, TSX)
DESCRIPTION: This snippet demonstrates how to use the `useTranslations` hook from `next-intl` within a regular (non-async) React Server Component. Since this component avoids interactive React features like `useState` or `useEffect`, it can be rendered entirely on the server, ensuring messages and library code remain server-side. It fetches translations for the 'HomePage' namespace.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/environments/server-client-components.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import {useTranslations} from 'next-intl';

// Since this component doesn't use any interactive features
// from React, it can be run as a Server Component.

export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

----------------------------------------

TITLE: Using `getTranslations` for Server-Side Translations (Next.js API Routes)
DESCRIPTION: Demonstrates how to fetch translations on the server-side using `getTranslations` from `next-intl/server`. This function is suitable for Next.js API routes, Route Handlers, or the Metadata API, allowing translation consumption outside of React components by providing the locale as a parameter.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/translations-outside-of-react-components.mdx#_snippet_3

LANGUAGE: tsx
CODE:
```
import {getTranslations} from 'next-intl/server';

// The `locale` is received from Next.js via `params`
const locale = params.locale;

// This creates the same function that is returned by `useTranslations`.
const t = await getTranslations({locale});

// Result: "Hello world!"
t('hello', {name: 'world'});
```

----------------------------------------

TITLE: Registering Augmented Types for next-intl 4.0 (TSX)
DESCRIPTION: This snippet demonstrates how to register `Messages` and `Formats` types under a single `AppConfig` interface within the `next-intl` module. This centralizes type augmentation, improving type safety for internationalization messages and formats in Next.js applications. It requires importing `formats` and message definitions.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-4-0.mdx#_snippet_0

LANGUAGE: TSX
CODE:
```
// global.ts

import {formats} from '@/i18n/request';
import en from './messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof en;
    Formats: typeof formats;
  }
}
```

----------------------------------------

TITLE: Handling Request Locale with hasLocale in next-intl 4.0 (TypeScript)
DESCRIPTION: This example demonstrates using `getRequestConfig` and the new `hasLocale` function to determine the active locale based on the request. It validates the `requestLocale` against a predefined list of supported locales, falling back to a default if invalid, ensuring a valid locale is always used for message loading.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-4-0.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

----------------------------------------

TITLE: Providing Individual Messages to Client Components with NextIntlClientProvider (TypeScript)
DESCRIPTION: This example illustrates how to selectively provide specific message namespaces to client-side components using NextIntlClientProvider. The Counter component fetches all available messages via useMessages() and then uses lodash/pick to pass only the 'ClientCounter' namespace to its child ClientCounter component, ensuring that only necessary translations are bundled for the client. This is useful for components that cannot be server-rendered but require dynamic message access.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/environments/server-client-components.mdx#_snippet_9

LANGUAGE: tsx
CODE:
```
import pick from 'lodash/pick';
import {NextIntlClientProvider, useMessages} from 'next-intl';
import ClientCounter from './ClientCounter';

export default function Counter() {
  // Receive messages provided in `i18n/request.ts` …
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={
        // … and provide the relevant messages
        pick(messages, 'ClientCounter')
      }
    >
      <ClientCounter />
    </NextIntlClientProvider>
  );
}
```

----------------------------------------

TITLE: Creating Server-Side Date Instance in Next.js Page Component (TypeScript)
DESCRIPTION: This snippet demonstrates how to instantiate a `Date` object (`now`) directly within a Next.js Server Component (a default page component). This ensures the `Date` is created only on the server, and then passed as a serializable prop to a client or server child component, avoiding client-side re-creation and potential hydration issues.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/date-formatting-nextjs.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import BlogPostPublishedDate from './BlogPostPublishedDate';

export default function BlogPostPage() {
  // ✅ Is only called on the server
  const now = new Date();

  const published = ...;

  return <BlogPostPublishedDate now={now} published={published} />;
}
```

----------------------------------------

TITLE: Integrating next-intl with Root Layout - TypeScript
DESCRIPTION: This `RootLayout` component integrates `next-intl` by retrieving the current locale using `getLocale` and setting it on the `<html>` tag. It also wraps the application children with `NextIntlClientProvider` to make the i18n configuration available to Client Components.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/without-i18n-routing.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

----------------------------------------

TITLE: Configuring next-intl Plugin - JavaScript
DESCRIPTION: This configuration sets up the `next-intl` plugin in `next.config.js`. It requires `createNextIntlPlugin` and wraps the existing Next.js configuration, enabling `next-intl` to create an alias for request-specific i18n configuration in Server Components.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router/without-i18n-routing.mdx#_snippet_3

LANGUAGE: js
CODE:
```
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(nextConfig);
```

----------------------------------------

TITLE: Checking Message Availability with t.has in next-intl (JavaScript)
DESCRIPTION: Demonstrates how to use the `t.has` function from `next-intl` to programmatically check if a specific message key exists for the current locale. This is useful for rendering content conditionally based on message availability, preventing errors when messages are optional.
SOURCE: https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/messages.mdx#_snippet_30

LANGUAGE: js
CODE:
```
const t = useTranslations('About');

t.has('title'); // true
t.has('unknown'); // false
```

----------------------------------------

TITLE: New API: t.has for Message Existence Check
DESCRIPTION: Introduces `t.has`, a new method on the translation function `t`, allowing developers to check if a specific message key exists before attempting to translate it.
SOURCE: https://github.com/amannn/next-intl/blob/main/packages/next-intl/CHANGELOG.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
New API Method:
  `t.has(messageKey: string): boolean`

Purpose: Checks for the existence of a translation message key.
```