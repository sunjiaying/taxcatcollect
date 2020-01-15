const {Builder, By, Key, until} = require('selenium-webdriver');
var chrome = require("selenium-webdriver/chrome");
var fs = require('fs');

(async function vcode() {
  options = new chrome.Options()
  options.addArguments('no-sandbox');
  options.addArguments('disable-dev-shm-usage');
  options.addArguments('headless');
  options.addArguments('disable-gpu');
  let driver = await new Builder().setChromeOptions(options).forBrowser('chrome').build();
  var s = '';
  try {
    await driver.get('https://u.jss.com.cn/Contents/usercenter/allow/login/login.jsp?redirecturl=bmjc');
    let code = await driver.findElement(By.className('x-img'));
    var d = await code.takeScreenshot();
    var dataBuffer = new Buffer(d, 'base64');
    fs.writeFile("./image.png", dataBuffer, function(err) {
      if(err){
        console.log(err);
      }else{
        console.log("保存成功！");
      }
    });
  } finally {
    await driver.quit();
    // console.log(s);
  }
})();

// (async function example() {
//   options = new chrome.Options()
//   options.addArguments('no-sandbox');
//   options.addArguments('disable-dev-shm-usage');
//   options.addArguments('headless');
//   options.addArguments('disable-gpu');
//   let driver = await new Builder().setChromeOptions(options).forBrowser('chrome').build();
//   var s = '';
//   try {
//     await driver.get('https://www.baidu.com');
//     await driver.findElement(By.name('wd')).sendKeys('webdriver', Key.RETURN);
//     let countResult = await driver.wait(until.elementLocated(By.className('nums_text')), 10000);
//     console.log(await countResult.getText());
//     let firstResult = await driver.wait(until.elementLocated(By.id('1')), 10000);
//     console.log(await firstResult.getText());
//   } finally {
//     await driver.quit();
//     console.log(s);
//   }
// })();