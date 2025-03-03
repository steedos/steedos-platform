/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-28 16:58:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 18:03:42
 * @Description: 
 */
import { test, expect } from '@playwright/test';
const path =require('path');
delete process.env.ROOT_URL
require('dotenv-flow').config({path: path.join(__dirname, '..')});

test('注册账户', async ({ page }) => {
  const name = `test_${Date.now()}`;
  await page.goto(process.env.ROOT_URL);
  await page.goto(`${process.env.ROOT_URL}/login?redirect_uri=/`);
  await page.getByRole('button', { name: '注册新账户' }).click();
  await page.getByPlaceholder('您的邮箱').click();
  await page.getByPlaceholder('您的邮箱').fill(`${name}@steedos.com`);
  await page.getByPlaceholder('您的邮箱').press('Tab');
  await page.getByPlaceholder('设置您的账户密码').fill('123456');
  await page.getByPlaceholder('设置您的账户密码').press('Tab');
  await page.getByPlaceholder('您的姓名').fill(name);
  await page.getByRole('button', { name: '提交' }).click();
});