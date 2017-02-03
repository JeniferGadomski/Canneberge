import { AdminClientPage } from './app.po';

describe('admin-client App', function() {
  let page: AdminClientPage;

  beforeEach(() => {
    page = new AdminClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
