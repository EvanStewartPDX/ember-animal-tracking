/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-animal-tracking',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    firebase: {
        apiKey: "AIzaSyBwYilB82GAPg9D7CsUjoANsMNPTWkcrWI",
      authDomain: "wildlife-tracker.firebaseapp.com",
      databaseURL: "https://wildlife-tracker.firebaseio.com",
      storageBucket: "wildlife-tracker.appspot.com",
      messagingSenderId: "307727413352"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.contentSecurityPolicy = {
      'script-src': "'self' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com",
         'img-src': "'self' https://*.googleapis.com https://*.gstatic.com",
         'font-src': "'self' https://*.gstatic.com",
         'style-src': "'self' 'unsafe-inline' https://*.googleapis.com"
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
