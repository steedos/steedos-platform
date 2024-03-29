/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-28 17:18:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 18:17:46
 * @Description: 
 */
import { test, expect } from '@playwright/test';
const path =require('path');
delete process.env.ROOT_URL
delete process.env.LOGIN_NAME
delete process.env.PASSWORD
require('dotenv-flow').config({path: path.join(__dirname, '..')});


test('登录-新建对象-新建字段-新建记录', async ({ page }) => {
  const newObjectName = `test_obj_name_${Date.now()}`;
  // 固定显示名称, 用于对比截图
  const newObjectLabel = `测试对象`;
  await page.goto(process.env.ROOT_URL);
  await page.goto(`${process.env.ROOT_URL}/accounts/a/#/login?redirect_uri=/`);
  await page.getByPlaceholder('手机或邮箱').click();
  await page.getByPlaceholder('手机或邮箱').fill(process.env.LOGIN_NAME);
  await page.getByPlaceholder('手机或邮箱').press('Tab');
  await page.getByPlaceholder('密码').fill(process.env.PASSWORD || '123456');
  await page.getByPlaceholder('密码').press('Enter');
  await page.locator('.slds-icon-waffle').click();
  await page.getByText('设置管理员设置公司、人员、权限等。').click();
  await page.getByRole('menuitem', { name: '对象' }).locator('a').click();
  await page.getByRole('button', { name: '新建' }).click();
  await page.locator('input[name="label"]').click();
  await page.locator('input[name="label"]').fill(newObjectLabel);
  await page.locator('input[name="label"]').press('Tab');
  await page.locator('input[name="name"]').fill(newObjectName);
  await page.getByText('请选择', { exact: true }).click();
  await page.getByText('account', { exact: true }).click();
  await page.locator('textarea[name="description"]').click();
  await page.locator('textarea[name="description"]').fill('');
  await page.locator('textarea[name="description"]').press('CapsLock');
  await page.locator('textarea[name="description"]').fill('自动化测试');
  await page.getByRole('button', { name: '保存', exact: true }).click();
  await page.getByText('对象字段').click();
  await page.getByRole('button', { name: '新建' }).click();
  await page.locator('input[name="label"]').click();
  await page.locator('input[name="label"]').fill('自动测试1');
  await page.locator('input[name="label"]').press('Tab');
  await page.locator('input[name="_name"]').fill('field');
  await page.locator('input[name="_name"]').press('CapsLock');
  await page.locator('input[name="_name"]').fill('field1');
  await page.locator('input[name="_name"]').press('Tab');
  await page.getByText('请选择').click();
  await page.getByTitle('文本', { exact: true }).click();
  await page.getByRole('button', { name: '保存', exact: true }).click();
  const page1Promise = page.waitForEvent('popup');

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: '预览' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: '新建' }).click();
  await page1.locator('input[name="name"]').click();
  await page1.locator('input[name="name"]').fill('1');
  await page1.locator('input[name="field1__c"]').click();
  await page1.locator('input[name="field1__c"]').fill('1');
  await page1.getByRole('button', { name: '保存', exact: true }).click();

  await page1.waitForTimeout(3000);

  await expect(page1).toHaveScreenshot('login.insert.object.png');
});