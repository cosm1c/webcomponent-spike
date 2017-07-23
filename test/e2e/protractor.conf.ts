'use strict';
import {browser} from 'protractor';

exports.config = {

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
  },

  seleniumAddress: 'http://localhost:4444/wd/hub',

  capabilities: {
    browserName: 'chrome',
  },

  // You could set no globals to true to avoid jQuery '$' and protractor '$' collisions on the global namespace.
  // noGlobals: true,

  specs: [
    '*-spec.js',
    '**/*-spec.js'
  ],

  SELENIUM_PROMISE_MANAGER: false,

  onPrepare: function () {
    browser.ignoreSynchronization = true;
  },

  beforeLaunch: function () {
    require('ts-node').register({
      project: '.'
    });
  }
};
