const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

const defaultOptions = {
  staticPrefix: 'NEXT_STATIC_',
  publicPrefix: 'NEXT_PUBLIC_',
};

const MAIN_BUNDLE = 'main.js';

function keysWithPrefix(prefix) {
  return Object.keys(process.env).reduce(
    (acc, key) => (key.indexOf(prefix) === 0 ? acc.concat([key]) : acc),
    [],
  );
}

function pick(keys, obj) {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}

module.exports = options => {
  const opts = {
    ...defaultOptions,
    ...options,
  };

  if (!opts.staticPrefix || !opts.publicPrefix) {
    throw new TypeError('The `staticPrefix` and `publicPrefix` options can not be empty');
  }

  return (nextConfig = {}, composePlugins = {}) => {
    const { nextComposePlugins, phase } = composePlugins;

    const nextConfigMethod = (phase, args) => {
      if (typeof nextConfig === 'function') {
        nextConfig = nextConfig(phase, args);
      }

      const newConfig = {
        ...nextConfig,
      };

      const publicKeys = keysWithPrefix(opts.publicPrefix);
      const staticKeys = keysWithPrefix(opts.staticPrefix);

      if (
        (publicKeys.length || staticKeys.length) &&
        (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_DEVELOPMENT_SERVER)
      ) {
        Object.assign(newConfig, {
          webpack(config, options) {
            if (!options.defaultLoaders) {
              throw new Error(
                'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
              );
            }

            if (!options.isServer && publicKeys.length) {
              const path = require('path');
              const originalEntry = config.entry;
              config.entry = async () => {
                const entries = await originalEntry();
                const filePath = path.resolve(__dirname, 'src', 'injectVars.js');
                if (entries[MAIN_BUNDLE] && !entries[MAIN_BUNDLE].includes(filePath)) {
                  entries[MAIN_BUNDLE].unshift(filePath);
                }
                return entries;
              };
            }

            // include static keys
            if (staticKeys.length) {
              const webpack = require('webpack');
              config.plugins.push(new webpack.EnvironmentPlugin(staticKeys));
            }

            if (typeof nextConfig.webpack === 'function') {
              return nextConfig.webpack(config, options);
            }

            return config;
          },
        });
      }

      if (
        publicKeys.length &&
        (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_DEVELOPMENT_SERVER)
      ) {
        Object.assign(newConfig, {
          publicRuntimeConfig: {
            ...nextConfig.publicRuntimeConfig,
            ...pick(publicKeys, process.env),
          },
        });
      }

      return newConfig;
    };

    return nextComposePlugins ? nextConfigMethod(phase) : nextConfigMethod;
  };
};
