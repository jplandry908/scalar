import { expect, test } from '@playwright/test'

import { testApiReference, testHelloWorld } from './testApiReference'

const HOST = process.env.HOST || 'localhost'

test('@scalar/api-reference jsdelivr build', async ({ page, isMobile }) => {
  await page.goto(`http://${HOST}:3173/api-reference-jsdelivr.html`)
  await testApiReference(page, isMobile)

  /**
   * Visual Regression Testing
   * use Playwright built in screenshot functionality https://playwright.dev/docs/screenshots
   * Playwright uses pixelmatch to compare screenshots
   * update screenshots with npx playwright test --update-snapshots
   */
  await expect(page).toHaveScreenshot('jsdelivr-snapshot.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.02,
  })

  /**
   * Capture into buffer
   * If we are unsatisfied with the built in visual regression testing
   * this is how we could pass it to a third party pixel diff facility eg. Chromatic
   *   const buffer = await page.screenshot()
   *   console.log(buffer.toString('base64'))
   */
})

test('@scalar/api-reference jsdelivr build (json content)', async ({ page }) => {
  await page.goto(`http://${HOST}:3173/api-reference-jsdelivr-json-content.html`)
  await testHelloWorld(page)
})

// TODO: Will be fixed with the next release.
test.skip('@scalar/api-reference jsdelivr build (yaml content)', async ({ page }) => {
  await page.goto(`http://${HOST}:3173/api-reference-jsdelivr-yaml-content.html`)
  await testHelloWorld(page)
})
