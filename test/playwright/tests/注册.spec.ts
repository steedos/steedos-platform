import { test, expect } from '@playwright/test';

const path =require('path');
delete process.env.ROOT_URL
require('dotenv-flow').config({path: path.join(__dirname, '..')});

test('注册账户工作区', async ({ page }) => {
  await page.goto(`${process.env.ROOT_URL}`);
  await page.goto(path.join(`${process.env.ROOT_URL}`,'accounts/a/#/login?redirect_uri=/'));
  await page.getByPlaceholder('手机或邮箱').click();
  await page.getByRole('button', { name: '注册新账户' }).click();
  await page.getByPlaceholder('您的邮箱').click();
  await page.getByPlaceholder('您的邮箱').fill(`${process.env.LOGIN_NAME}@steedos.com`);
  await page.getByPlaceholder('您的邮箱').press('Tab');
  await page.getByPlaceholder('设置您的账户密码').fill('123456');
  await page.getByPlaceholder('设置您的账户密码').press('Tab');
  await page.getByPlaceholder('您的姓名').fill(`${process.env.LOGIN_NAME}`);
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByPlaceholder('企业名称').click();
  await page.getByPlaceholder('企业名称').fill('test');
  await page.getByRole('button', { name: '提交' }).click();
});