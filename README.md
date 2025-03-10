# Next.js Theme Provider Plugin

This plugin provides the core functionality to build Next.js applications that respect
the user's theme preference (system, light or dark).

Because a cookie is used to persist the theme, Next.js always selects the
[dynamic rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering) strategy.  
Local storage is not used because it is not available on the server side and
would cause [hydration mismatch errors](https://nextjs.org/docs/messages/react-hydration-error)
if used on the client side.

Because the theme is properly initialized on the server side, users see the correct theme
on the first render, without any flickering.  
Thanks to `BroadcastChannel`, the theme is synchronized across all tabs.

## Installation

```shell
npm install next.js-theme-provider
```

## Usage

Use this minimal example to update your root layout:

```jsx
import { loadTheme, ThemeProvider } from "next.js-theme-provider";

export default async function RootLayout({ children }) {
  const theme = await loadTheme();

  return (
    <html data-theme={theme}>
      <body>
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Here is a simple theme selector component:

```jsx
"use client";
import { THEME, useThemeContext } from "next.js-theme-provider";

export const ThemeSelector = () => {
  const { theme, setTheme } = useThemeContext();

  return (
    <div>
      <button onClick={() => setTheme(THEME.SYSTEM)}>🖥️</button>
      <button onClick={() => setTheme(THEME.LIGHT)}>🌞</button>
      <button onClick={() => setTheme(THEME.DARK)}>🌙</button>
      <p>Current theme: {theme}</p>
    </div>
  );
};
```

You can also use a theme toggle component. It does not support reverting to the system theme,
but it is a simpler design:

```jsx
"use client";
import { useThemeContext } from "next.js-theme-provider";

export const ThemeToggle = () => {
  const { toggleTheme } = useThemeContext();

  return <button onClick={toggleTheme}>Toggle Theme</button>;
};
```

Lastly, you will need to style both light and dark themes.  
If you are using Tailwind CSS 4, add the following custom variant in `app/globals.css` to
override the default dark variant:

```css
@custom-variant dark {
  &:root[data-theme="dark"],
  :root[data-theme="dark"] & {
    /*noinspection CssInvalidAtRule*/
    @slot;
  }

  &:root[data-theme="system"],
  :root[data-theme="system"] & {
    @media (prefers-color-scheme: dark) {
      /*noinspection CssInvalidAtRule*/
      @slot;
    }
  }
}
```

Note: the `noinspection` comments are only needed to suppress WebStorm warnings.

Use the `dark:` variant as usual in your components:

```jsx
<div className="dark:bg-black bg-white">...</div>
```

If you prefer to use plain CSS, you can use CSS custom properties:

```css
:root {
  --bg: white;
  --text: black;

  --dark-bg: black;
  --dark-text: white;
}

:root[data-theme="dark"] {
  --bg: var(--dark-bg);
  --text: var(--dark-text);
}

@media (prefers-color-scheme: dark) {
  :root[data-theme="system"] {
    --bg: var(--dark-bg);
    --text: var(--dark-text);
  }
}
```

## Copyright

© 2025 Johnny Gérard
