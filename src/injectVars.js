if(window) {
  // next < 8 stores __NEXT_DATA__ in a js variable already
  var nextData = window.__NEXT_DATA__;
  // since next 8 __NEXT_DATA__ is stored as json
  var nextDataScript = document.getElementById('__NEXT_DATA__');
  if(nextDataScript) {
    nextData = JSON.parse(nextDataScript.textContent);
  }
  if (nextData && nextData.runtimeConfig) {
    var publicRuntimeConfig = nextData.runtimeConfig;
    if (!process) process = {};
    if (!process.env) process.env = {};

    Object.keys(publicRuntimeConfig).forEach(function(key) {
      process.env[key] = publicRuntimeConfig[key];
    });
  }
}




