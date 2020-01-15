const {Builder, By, Key, until} = require('selenium-webdriver');
var chrome = require("selenium-webdriver/chrome");

(async function example() {
  options = new chrome.Options()
  options.addArguments('–no-sandbox');
  options.addArguments('–disable-dev-shm-usage');
  options.addArguments('–headless');
  let driver = await new Builder().setChromeOptions(options).forBrowser('chrome').build();
  try {
    await driver.get('http://www.baidu.com');
    await driver.findElement(By.name('wd')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();