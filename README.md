# next-env

Automatic static (build-time) or runtime environment variables injection for [Next.js](https://github.com/zeit/next.js).

The plugin doesn't handle loading of dotenv files. Use [dotenv](https://github.com/motdotla/dotenv) or [dotenv-load](https://github.com/formatlos/dotenv-load).

## Installation

```sh
npm install --save next-env dotenv-load
```

or

```sh
yarn add next-env dotenv-load
```

## How it works

Your project can consume variables declared in your environment as if they were declared locally in your JS files. 

By default any environment variables starting with `NEXT_STATIC_` will be embedded in the js bundles on build time. 
Variables starting with `NEXT_PUBLIC_` are injected on runtime (using [Next.js](https://github.com/zeit/next.js) publicRuntimeConfig internally).
On node-side (SSR) all environment variables are available by default, but it is a good idea to follow the naming convention `NEXT_SERVER_`.

## Usage

### Simple

This module exposes a function that allows to configure the plugin.

In your `next.config.js`:

```js
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const withNextEnv = nextEnv();

module.exports = withNextEnv({
  // Your Next.js config.
});
```

In your `.env`:

```
NEXT_SERVER_TEST_1=ONLY_ON_SSR
NEXT_PUBLIC_TEST_1=INJECTED_BY_SSR
NEXT_STATIC_TEST_1=STATIC_TEXT
```

In your `pages/index.js`:

```js
export default () => (
  <ul>
    <li>{process.env.NEXT_SERVER_TEST_1}</li>
    <li>{process.env.NEXT_PUBLIC_TEST_1}</li>
    <li>{process.env.NEXT_STATIC_TEST_1}</li>
  </ul>
)
```

In the above example the output of `process.env.NEXT_SERVER_TEST_1` should only be visible until client-side rendering kicks in.


### Advanced

In your `next.config.js`:

```js
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const withNextEnv = nextEnv({
  staticPrefix: 'CUSTOM_STATIC_',
  publicPrefix: 'CUSTOM_PUBLIC_',
});

module.exports = withNextEnv({
  // Your Next.js config.
});
```

In your `.env`:

```
CUSTOM_SERVER_TEST_1=ONLY_ON_SSR
CUSTOM_PUBLIC_TEST_1=INJECTED_BY_SSR
CUSTOM_STATIC_TEST_1=STATIC_TEXT
```

### with [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins)

In your `next.config.js`:

```js
const withPlugins = require('next-compose-plugins');
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const nextConfig = {
  // Your Next.js config.
};

module.exports = withPlugins([

  nextEnv({
    staticPrefix: 'CUSTOM_STATIC_',
    publicPrefix: 'CUSTOM_PUBLIC_',
  }),

  // another plugin with a configuration
  [typescript, {
    typescriptLoaderOptions: {
      transpileOnly: false,
    },
  }],

], nextConfig);
```
