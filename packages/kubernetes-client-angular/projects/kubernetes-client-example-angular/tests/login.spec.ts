import { expect, test } from '@playwright/test'

test.describe('login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/login')
    await page.evaluate(() => window.localStorage.removeItem('kubetoken'))
  })

  test('should accept login token', async ({ page }) => {
    const expectedToken = process.env['PLAYWRIGHT_KUBERNETES_API_TOKEN'] ?? ''
    await page.locator('#token').type(expectedToken)
    await expect(page.locator('.invalid-feedback')).not.toBeVisible()
    await page.locator('#btnSubmit').click()
    await page.waitForURL('http://localhost:4200/')
    await page
      .evaluate(() => window.localStorage.getItem('kubetoken'))
      .then((token) => expect(token).toEqual(expectedToken))
  })

  test('should highlight invalid JWT', async ({ page }) => {
    await page.locator('#token').type('invalid JWT')
    await expect(page.locator('.invalid-feedback')).toBeVisible()
    await expect(page.locator('#btnSubmit')).toBeDisabled()
  })
})
