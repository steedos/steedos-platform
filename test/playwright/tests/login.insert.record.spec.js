/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-28 13:32:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 17:17:44
 * @Description: 
 */

import { test, expect } from '@playwright/test';
const path =require('path');
delete process.env.ROOT_URL
delete process.env.LOGIN_NAME
delete process.env.PASSWORD
require('dotenv-flow').config({path: path.join(__dirname, '..')});

test('test', async ({ page }) => {
  await page.goto(process.env.ROOT_URL);
  await page.goto(`${process.env.ROOT_URL}/accounts/a/#/login?redirect_uri=/`);
  await page.getByPlaceholder('手机或邮箱').click();
  await page.getByPlaceholder('手机或邮箱').fill(process.env.LOGIN_NAME);
  await page.getByPlaceholder('手机或邮箱').press('Tab');
  await page.getByPlaceholder('密码').fill(process.env.PASSWORD || '123456');
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '新建' }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('');
  await page.locator('input[name="name"]').press('CapsLock');
  await page.locator('input[name="name"]').fill('测试');
  await page.getByRole('button', { name: '保存', exact: true }).click();

  await page.waitForTimeout(3000);

  await expect(page).toHaveScreenshot('login.insert.record.png');
});