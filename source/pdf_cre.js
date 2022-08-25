const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch(
    {
      headless: false, 
      "args": [ "--kiosk-printing" ]
    });

  //const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://wksp000e6499:3000/get/deliveryInform?function=downs_check_list&shipmentNo=11707547', {waitUntil: 'networkidle2'});
  //await page.pdf({path: 'hn.pdf', format: 'A4'});
  await page.evaluate(() => {window.print()})
  //await browser.close();
})();