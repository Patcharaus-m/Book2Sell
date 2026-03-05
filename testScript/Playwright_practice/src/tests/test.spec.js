import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';

/**
 * =====================================================================
 * ระบบทดสอบสมาชิกแบบละเอียดสูงสุด (Ultimate Comprehensive Authentication Test)
 * แก้ไขให้ผ่าน 100% พร้อมรองรับข้อมูลซ้ำและการสุ่มชื่อผู้ใช้
 * =====================================================================
 */

test.describe('Authentication Exhaustive Suite', () => {
  let authPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test.describe('การสมัครสมาชิก (Registration)', () => {

    test('TC-REG-001: สมัครสมาชิกสำเร็จ', async () => {
      const unique = `u${Date.now()}`;
      await authPage.register({
        username: unique,
        email: `${unique}@test.com`,
        phone: '0812345678',
        password: 'Password123'
      });

      // รอให้ Modal ปิดลง (แสดงว่าสำเร็จ)
      await expect(authPage.registerForm).not.toBeVisible();
      await expect(authPage.userMenuTrigger).toBeVisible();
      await expect(authPage.userMenuTrigger).toContainText(unique);
    });

    test('TC-REG-002: รหัสผ่านสั้นเกินไป', async () => {
      await authPage.register({
        username: `u${Date.now()}`,
        email: `e${Date.now()}@test.com`,
        password: '123'
      });

      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(/อย่างน้อย 6 ตัวอักษร/);
    });

    test('TC-REG-003: รหัสผ่านไม่มีตัวพิมพ์ใหญ่', async () => {
      await authPage.register({
        username: `u${Date.now()}`, // ใช้ชื่อใหม่เสมอเพื่อไม่ให้ติด Duplicate Check ก่อน
        email: `e${Date.now()}@test.com`,
        password: 'password'
      });

      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(/ตัวอักษรพิมพ์ใหญ่/);
    });

    test('TC-REG-004: ชื่อผู้ใช้ซ้ำ', async () => {
      // ใช้ชื่อที่รู้ว่าซ้ำแน่ๆ (jirawat หรือ testuser)
      await authPage.register({
        username: 'testuser',
        email: `new${Date.now()}@test.com`,
        password: 'Password123'
      });

      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(/ใช้งานแล้ว|มีอยู่แล้ว/);
    });

    test('TC-REG-005: อีเมลซ้ำ', async () => {
      await authPage.register({
        username: `u${Date.now()}`,
        email: 'jirawat@gmail.com',
        password: 'Password123'
      });

      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(/ใช้งานแล้ว|มีอยู่แล้ว/);
    });

    test('TC-REG-006: รูปแบบอีเมลไม่ถูกต้อง', async () => {
      await authPage.openRegisterModal();
      await authPage.registerEmailInput.fill('invalid-email');
      await authPage.registerSubmitButton.click();

      const isInvalid = await authPage.isElementInvalid(authPage.registerEmailInput);
      expect(isInvalid).toBeTruthy();
    });

    test('TC-REG-007: ข้อมูลไม่ครบ', async () => {
      await authPage.openRegisterModal();
      await authPage.registerUsernameInput.fill('');
      await authPage.registerSubmitButton.click();

      const isInvalid = await authPage.isElementInvalid(authPage.registerUsernameInput);
      expect(isInvalid).toBeTruthy();
    });
  });

  test.describe('การเข้าสู่ระบบ (Login)', () => {

    test('TC-LOG-001: เข้าสู่ระบบสำเร็จ', async () => {
      await authPage.login('testuser', 'Password123');
      await expect(authPage.userMenuTrigger).toBeVisible();
    });

    test('TC-LOG-002: รหัสผ่านไม่ถูกต้อง', async () => {
      await authPage.login('testuser', 'Wrong123');
      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(/ไม่ถูกต้อง|failed|400/);
    });

    test('TC-LOG-003: ไม่พบชื่อผู้ใช้', async () => {
      await authPage.login(`none${Date.now()}`, 'Password123');
      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(/ไม่พบ|ไม่ถูกต้อง|failed|404/);
    });
  });

  test.describe('ความต่อเนื่อง (Session)', () => {

    test('TC-INT-001: รีเฟรชหน้าแล้วยังล็อกอินอยู่', async ({ page }) => {
      await authPage.login('testuser', 'Password123');
      await expect(authPage.userMenuTrigger).toBeVisible();
      await page.reload();
      await expect(authPage.userMenuTrigger).toBeVisible();
    });

    test('TC-INT-002: ออกจากระบบสำเร็จ', async () => {
      await authPage.login('testuser', 'Password123');
      await authPage.logout();
      await expect(authPage.navLoginButton.first()).toBeVisible();
    });
  });
});