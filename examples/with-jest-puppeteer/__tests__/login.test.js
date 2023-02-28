const timeout = 30000; 

describe('Login', () => {
  beforeAll(async () => {
    await page.goto(URL, {waitUntil: 'networkidle0'});
  }, timeout);

  describe('Test page title and header', () => {
    test('page title', async () => {
      const title = await page.title(); expect(title).toBe('登录您的账户 | 华炎软件'); 
    }, timeout); 
    test('Header', async () => { 
      const headerOne = await page.$('h2'); 
      const header = await page.evaluate(headerOne => headerOne.innerHTML, headerOne); expect(header).toBe("登录您的账户"); 
    }, timeout); 
  });
});