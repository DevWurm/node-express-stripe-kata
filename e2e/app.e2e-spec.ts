import { NodeExpressStripeDojoPage } from './app.po';

describe('node-express-stripe-dojo App', function() {
  let page: NodeExpressStripeDojoPage;

  beforeEach(() => {
    page = new NodeExpressStripeDojoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
