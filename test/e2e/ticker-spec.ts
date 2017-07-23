import {HomePage} from './page-objects/home.page';
import {} from 'jasmine';
// import {} from 'jasmine';

describe('Ticker WebComponent', function () {

  it('should contain a shadow dom', async function () {
    const homepage = new HomePage();
    await homepage.get();
    expect(homepage.getTicker().getShadowDom()).not.toBe(null);
  });

  /*
    it('should contain a canvas', async function () {
      const homepage = new HomePage();
      await homepage.get();
      expect(await homepage.getTicker().getCanvas().isPresent())
        .toBe(true);
    });
  */

});
