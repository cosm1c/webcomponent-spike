import {Ticker} from './ticker';

// Used by DefinePlugin
declare const IS_PROD: string;

require('./main.less');

if (IS_PROD) {
  console.info('main.ts - Production Mode');
} else {
  console.warn('main.ts - Development Mode');
}

window.addEventListener('HTMLImportsLoaded', function (evt: Event) {
  console.debug('HTMLImportsLoaded', evt);
});

window.addEventListener('WebComponentsReady', function (evt: Event) {
  console.debug('WebComponentsReady', evt);
});

const tickerElem = document.getElementById('ticker') as Ticker;
if (!tickerElem) {
  throw new Error('No Ticker element found');
}
