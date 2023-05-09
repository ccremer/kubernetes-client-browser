import { expect, test } from '@playwright/test'

test.describe('demo form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/login')
    const token = process.env['PLAYWRIGHT_KUBERNETES_API_TOKEN'] ?? ''
    await page.locator('#token').type(token)
    await expect(page.locator('.invalid-feedback')).not.toBeVisible()
    await page.locator('#btnSubmit').click()
    await page.waitForURL('http://localhost:4200/')
  })

  test('should list all configmaps', async ({ page }) => {
    await page.locator('#resourceKind').selectOption('ConfigMap')
    await page.locator('#listBtn').click()
    const area = page.locator('#kubeobject')
    await expect(area).toHaveCount(1)
    const value = await area.inputValue().then((v) => JSON.parse(v))
    await expect(value.length).toBeGreaterThanOrEqual(1)
  })

  test('should fetch single configmap', async ({ page }) => {
    await page.locator('#resourceKind').selectOption('ConfigMap')
    await page.locator('#resourceName').type('kube-root-ca.crt')
    await page.locator('#namespace').type('default')
    await page.locator('#getBtn').click()
    const area = page.locator('#kubeobject')
    await expect(area).toHaveCount(1)
    const value = await area
      .inputValue()
      .then((v) => {
        return JSON.parse(v)
      })
      .then((json) => {
        delete json.metadata.resourceVersion
        delete json.metadata.managedFields
        delete json.metadata.uid
        delete json.metadata.annotations
        delete json.metadata.creationTimestamp
        json.data['ca.crt'] = ''
        return json
      })
      .catch((err) => {
        console.error(err)
        expect(err).not.toBeUndefined()
      })
    const expected = {
      kind: 'ConfigMap',
      apiVersion: 'v1',
      metadata: {
        name: 'kube-root-ca.crt',
        namespace: 'default',
      },
      data: {
        'ca.crt': '',
      },
    }
    await expect(value).toEqual(expected)
  })
})
