if (window && window.__NEXT_DATA__ && window.__NEXT_DATA__.runtimeConfig) {
  var publicRuntimeConfig = window.__NEXT_DATA__.runtimeConfig;
  if (!process) process = {};
  if (!process.env) process.env = {};

  Object.keys(publicRuntimeConfig).forEach(key => {
    process.env[key] = publicRuntimeConfig[key];
  });
}
