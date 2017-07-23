import {browser} from 'protractor';
import {TickerPage} from './ticker.page';

export class HomePage {

  async get() {
    await browser.driver.get('http://localhost:9000');
  }

  // getTicker returns a webdriver.promise.Promise.<string>. For simplicity setting the return value to any
  getTicker(): TickerPage {
    return new TickerPage();
  }
}