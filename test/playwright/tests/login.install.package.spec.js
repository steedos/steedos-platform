import { test, expect } from '@playwright/test';
const path =require('path');
delete process.env.ROOT_URL
delete process.env.LOGIN_NAME
delete process.env.PASSWORD
require('dotenv-flow').config({path: path.join(__dirname, '..')});

test('登录-安装软件包', async ({ page }) => {
  await page.goto(process.env.ROOT_URL);
  await page.goto(`${process.env.ROOT_URL}/login?redirect_uri=/`);
  await page.getByPlaceholder('手机或邮箱').click();
  await page.getByPlaceholder('手机或邮箱').fill(process.env.LOGIN_NAME);
  await page.getByPlaceholder('手机或邮箱').press('Tab');
  await page.getByPlaceholder('密码').fill(process.env.PASSWORD || '123456');
  await page.getByPlaceholder('密码').press('Enter');
  await page.locator('.slds-icon-waffle').click();
  await page.getByText('设置管理员设置公司、人员、权限等。').click();
  await page.getByRole('menuitem', { name: '开发' }).getByRole('img').click();
  await page.getByRole('menuitem', { name: '软件包' }).locator('a').click();
  await page.getByRole('button', { name: '手动安装软件包' }).click();
  await page.locator('input[name="package"]').click();
  await page.locator('input[name="package"]').fill('@steedos-labs/project');
  await page.getByRole('button', { name: '确认' }).click();

  await page.waitForTimeout(3000);

  await page.getByTitle('项目管理', { exact: true }).click();

  if(await page.getByRole('button', { name: '启用' }).isVisible()){
    await page.getByRole('button', { name: '启用' }).click();
  }
  
  await page.locator('.slds-r6').click();
  await page.getByText('计划通过项目、任务、里程碑，管理项目的进度与计划。').click();

  await page.waitForTimeout(3000);

  await expect(page).toHaveScreenshot('login.install.package.png');
});