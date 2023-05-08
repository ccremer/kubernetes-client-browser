import { expect, test } from '@playwright/test'

test.describe('enter token', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await page.evaluate(() => window.localStorage.removeItem('token'))
  })

  test('should display demo container', async ({ page }) => {
    const expectedToken = process.env['PLAYWRIGHT_KUBERNETES_API_TOKEN']
    await page.locator('#token').type(expectedToken)
    await page.locator('#createClient').click()
    await expect(page.locator('#demo-container')).toBeVisible()
    await page
      .evaluate(() => window.localStorage.getItem('token'))
      .then((token) => expect(token).toEqual(expectedToken))
  })

  test('should highlight invalid JWT', async ({ page }) => {
    await page.locator('#token').type('invalid JWT')
    await page.locator('#createClient').click()
    await expect(page.locator('#alerts')).toContainText('could not fetch object: Error: Unauthorized')
    await page.evaluate(() => window.localStorage.getItem('token')).then((token) => expect(token).toBeNull())
  })
})
