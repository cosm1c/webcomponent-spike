import {browser} from 'protractor';

export class Util {

  static waitForWebComponents() {
    browser.wait(Util.getWebComponentsReady, 5000);
  }

  private static getWebComponentsReady() {
    return browser.driver.executeScript('return window.WebComponents && window.WebComponents.ready');
  }
}
