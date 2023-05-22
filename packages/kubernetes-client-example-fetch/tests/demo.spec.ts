import { expect, test } from '@playwright/test'

test.describe('demo form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await page.locator('#token').type(process.env['PLAYWRIGHT_KUBERNETES_API_TOKEN'])
    await page.locator('#createClient').click()
    await expect(page.locator('#demo-container')).toBeVisible()
  })

  test('should list all secrets', async ({ page }) => {
    await page.locator('#resourceKind').selectOption('Secret')
    await page.locator('#listBtn').click()
    const area = page.locator('#kubeobject')
    await expect(area).toBeEnabled()
    const value = await area
      .inputValue()
      .then((v) => JSON.parse(v))
      .then((json) => {
        delete json.metadata.resourceVersion
        delete json.items
        return json
      })
    const expected = {
      kind: 'SecretList',
      apiVersion: 'v1',
      metadata: {},
    }
    await expect(value).toEqual(expected)
  })

  test('should fetch single configmap', async ({ page }) => {
    await page.locator('#resourceKind').selectOption('ConfigMap')
    await page.locator('#resourceName').type('kube-root-ca.crt')
    await page.locator('#namespace').type('default')
    await page.locator('#getBtn').click()
    const area = page.locator('#kubeobject')
    await expect(area).toBeEnabled()
    const value = await area
      .inputValue()
      .then((v) => JSON.parse(v))
      .then((json) => {
        delete json.metadata.resourceVersion
        delete json.metadata.managedFields
        delete json.metadata.uid
        delete json.metadata.annotations
        delete json.metadata.creationTimestamp
        json.data['ca.crt'] = ''
        return json
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

  test('should watch configmaps', async ({ page }) => {
    await page.locator('#resourceKind').selectOption('ConfigMap')
    await page.locator('#namespace').type('default')
    await page.locator('#watchBtn').click()
    const area = page.locator('#kubeobject')
    await expect(area).toBeEnabled()
    const value = await area
      .inputValue()
      .then((v) => JSON.parse(v))
      .then((json) => {
        const obj = json[0].object
        delete obj.metadata.resourceVersion
        delete obj.metadata.managedFields
        delete obj.metadata.uid
        delete obj.metadata.annotations
        delete obj.metadata.creationTimestamp
        obj.data['ca.crt'] = ''
        return json[0]
      })
    const expected = {
      type: 'ADDED',
      object: {
        kind: 'ConfigMap',
        apiVersion: 'v1',
        metadata: {
          name: 'kube-root-ca.crt',
          namespace: 'default',
        },
        data: {
          'ca.crt': '',
        },
      },
    }
    await expect(value).toEqual(expected)
    await page.locator('#watchBtn').click()

    const res = await page.locator('#alerts')
    await expect(res).toHaveText(['Watch stopped'])
  })
})
