const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('mapbox') || msg.text().includes('Mapbox')) {
      console.log(`[Browser ${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[Browser pageerror] ${error.message}`);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  console.log("Page loaded");
  
  // Wait a sec for mapbox to settle
  await page.waitForTimeout(2000);
  
  // Click Water Infrastructure (MICES)
  await page.click('text=Water Infrastructure (MICES)');
  await page.waitForTimeout(500);
  
  // Click Dugwell Schemes
  await page.click('text=Dugwell Schemes');
  console.log("Clicked Dugwell Schemes");
  
  await page.waitForTimeout(2000);
  
  console.log("Switching to satellite...");
  // Click satellite
  const satelliteBtn = await page.$('[title="Satellite View"]');
  if (satelliteBtn) await satelliteBtn.click();
  
  await page.waitForTimeout(3000);
  console.log("Test finished.");
  await browser.close();
})();
