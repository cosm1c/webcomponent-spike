import {by, element, ElementFinder} from 'protractor';
import {Util} from './util';
import {} from 'jasmine';

export class TickerPage {

  private readonly tickerEl = element(by.name('x-ticker'));

  getShadowDom(): any {
    return this.tickerEl.shadowRoot;
  }

  getCanvas(): ElementFinder {
    Util.waitForWebComponents();
    return element(by.deepCss('canvas'));
  }
}
