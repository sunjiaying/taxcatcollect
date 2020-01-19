const fs = require('fs')
const express = require('express');
var { ruoruo } = require('./ruoruo.js');

const app = express();

var count = 0;
var all = 0;
var result = [];

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', function (req, res) {
  res.send('Hello World! ');
});

app.post('/query', function (req, res) {
  req.on('data', function (data) {
    var obj = JSON.parse(data.toString());
    count = 0;
    result = [];    
    all = obj.data.length;
    fs.readFile('./cookies', 'utf-8', function(error, data) {
      if (error) {
        result = {'msg':'cookies获取失败'};
        count = all;
      } else {
        obj.data.forEach(k => {
          ruoruo(k, finished, data);
        });
      }
    });    
  });
  var inter = setInterval(() => {
    // console.log(count, all);
    if (count>=all) {
      clearInterval(inter);
      res.send(result);
    }
  }, 500);
});

function finished(cxmc, o) {
  result.push({
    CXMC: cxmc,
    BM: o.BM,
    MC: o.MC,
    HBBM: o.HBBM,
    SLV: o.SLV,
    MCJC: o.MCJC,
    HGJCKSPPM: o.HGJCKSPPM,
  });
  count = count + 1;
}

app.listen(3006, () => console.log('webapi listening on port http://127.0.0.1:3003/'));
