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

  const tickerElem = document.getElementById('ticker') as Ticker;
  if (!tickerElem) {
    throw new Error('No Ticker element found');
  }

  const sliderElem = document.getElementById('slider1') as HTMLInputElement;
  if (!sliderElem) {
    throw new Error('No Slider element found');
  }

  window.setInterval(() => {
    const half = tickerElem.height / 2;
    const value = half * Math.sin(window.performance.now() / (half * parseInt(sliderElem.value))) + half;
    tickerElem.addTick({
      value: Math.round(value),
      strokeStyle: 'red'
    });
  }, 10);
});

