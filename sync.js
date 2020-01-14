const sqlite3 = require('sqlite3');
var request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var data = [];

var headers = {
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Referer': 'http://www.acc5.com/tools/tax_guid/1/',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
  'Cookie': 'li_referrer=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3D-o7s8tl_7UXKEVKmwcMxovc4Tj0Pm9p02BEx_NS08Z-apnhhOjf46InWHZrUCW8E%26wd%3D%26eqid%3D81626c43001df80c000000065e1d5e4a; li_first_access_time=1578982996; Hm_lvt_1e531798c221147143a6d33847c60bc5=1578982997; Hm_lpvt_1e531798c221147143a6d33847c60bc5=1578983174'
};

var options = {
  url: 'http://www.acc5.com/tools/tax_guid/1/',
  headers: headers,
  gzip: true
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body);
    var dd = new JSDOM(body);
    var tab = dd.window.document.getElementsByClassName('table-tax-rate');
    if (tab === null || tab[0] === null) {
      console.log('找不到数据.');
      return;
    }
    tab = tab[0];
    var tbody = tab.firstElementChild.nextElementSibling;

    for (let index = 0; index < tbody.children.length; index++) {
      const row = tbody.children[index];
      if (row.classList === undefined || !row.classList.contains('collapse')) {
        data.push({
          code: row.children[2].innerHTML,
          big: row.children[0].innerHTML,
          small: row.children[1].innerHTML,
          rate: row.children[3].innerHTML,
          desc: getMore(dd, row.lastElementChild),
        });
      }
    }
    
    // console.log(data);
    save();
  }
}

function getMore(dd, m) {
  try {
    var href = m.firstElementChild.href;
    var id = href.split('#')[1];
    var more = dd.window.document.getElementById(id);
    // return id;
    return more.firstElementChild.firstElementChild.innerHTML;
  } catch (e) {
    return '';
  }
}

function save() {
  var db = new sqlite3.Database('./data.sqlite3', function () {
    db.serialize(function() {
      var stmt = db.prepare("INSERT INTO taxcategory VALUES (?,?,?,?,?)");
      data.forEach(element => {
        stmt.run(
          element.code,
          element.big,
          element.small,
          element.rate,
          element.desc);
      });
      stmt.finalize();
    });
    db.close();
    console.log('同步成功.');
  });
}

function sync(cid) {
  options = {
    url: `http://www.acc5.com/tools/tax_guid/${cid}/`,
    headers: headers,
    gzip: true
  };
  request(options, callback);
}

module.exports = {
  sync
}