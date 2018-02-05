import { CateringAppAdminPage } from './app.po';

describe('catering-app-business-admin App', () => {
  let page: CateringAppAdminPage;

  beforeEach(() => {
    page = new CateringAppAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
