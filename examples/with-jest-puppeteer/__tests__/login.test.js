describe('Login', () => {
  beforeAll(async () => {
    await page.goto('https://demo.steedos.cn');
  });

  it('should be titled "Steedos"', async () => {
    await expect(page.title()).resolves.toMatch('Steedos');
  });
});