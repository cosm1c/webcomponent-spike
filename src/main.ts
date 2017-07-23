import {Ticker} from './ticker/Ticker';

require('./main.less');

window.addEventListener('WebComponentsReady', () => {
  window.customElements.define('x-ticker', Ticker);
});
