const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1080 } });
  page.setDefaultTimeout(5000);
  await page.goto('http://127.0.0.1:8010', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByRole('button', { name: 'CRM Access' }).click();
  await page.getByRole('button', { name: 'Manager' }).click();
  await page.getByRole('button', { name: 'Login to CRM' }).click();
  await page.getByText('CRM - Manager').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Reports' }).click();
  await page.getByText('Auto-Synced Reports').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Projects' }).click();
  await page.getByText('Manage All Projects').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'AI Sales Forecast' }).click();
  await page.getByText('Forecasted Revenue').waitFor({ state: 'visible' });
  await page.screenshot({ path: 'iseet-manager-forecast.png', fullPage: true });
  console.log('manager flow ok');
  await browser.close();
})();
