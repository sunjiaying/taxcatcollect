var request = require('request');
var urlencode = require('urlencode');

var finished;

var headers = {
    'Connection': 'keep-alive',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Referer': 'https://bmjc.jss.com.cn/Contents/smartCode/web/index.html',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
    // 'Cookie': `JSSESIONID=${sessionid}; Hm_lvt_e4c6f837018617d2975633e9ef9d3102=1578887025; Hm_lvt_f0a19fd3b9e4656b260329ac98702ee6=1578903959; Hm_lpvt_f0a19fd3b9e4656b260329ac98702ee6=1578904135; SESSION=${sessionid}; Hm_lpvt_e4c6f837018617d2975633e9ef9d3102=1578991037`
};

var options = {
    url: 'https://bmjc.jss.com.cn/global/searchByRecommendatedName.do?_=1578991051762&name=%e9%a1%b9%e9%93%be',
    headers: headers,
    gzip: true
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var p = response.req.path;
      var pos = p.indexOf('name=');
      var k = p.substring(pos + 5, p.length);
      var key = urlencode.decode(k);
      if (JSON.parse(body).data.length>0) {
        if(finished!=null) {
          finished(key, JSON.parse(body).data[0]);
        }
      } else {
        finished(key, {
          'BM': '',
          'MC': '',
          'HBBM': '',
          'SLV': '',
          'MCJC': '',
          'HGJCKSPPM': ''
        });
      }
    }
}

// request(options, callback);

function ruoruo(keyword, f, cookies) {
  finished = f;

  if (keyword==='') {
    finished(keyword, {});
    return;
  }

  headers = {
      'Connection': 'keep-alive',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Referer': 'https://bmjc.jss.com.cn/Contents/smartCode/web/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
      // 'Cookie': `JSSESIONID=${sessionid}; Hm_lvt_e4c6f837018617d2975633e9ef9d3102=1578887025; Hm_lvt_f0a19fd3b9e4656b260329ac98702ee6=1578903959; Hm_lpvt_f0a19fd3b9e4656b260329ac98702ee6=1578904135; SESSION=${sessionid}; Hm_lpvt_e4c6f837018617d2975633e9ef9d3102=1578991037`
      'Cookie': cookies
  };
  options = {
      url: `https://bmjc.jss.com.cn/global/searchByRecommendatedName.do?_=1578991051762&name=${urlencode(keyword)}`,
      headers: headers,
      gzip: true
  };
  request(options, callback);
}

module.exports = {
  ruoruo
}