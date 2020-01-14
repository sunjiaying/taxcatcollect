const sqlite3 = require('sqlite3');
const arg = require('arg');
var { sync } = require('./sync.js');
var { query } = require('./query.js');
var { ruoruo } = require('./ruoruo.js');

const args = arg({
  // Types
  '--help': Boolean,
  '--version': Boolean,
  '--command': String,
  '--keyword': String,

  // Aliases
  '-H': '--help',
  '-V': '--version',
  '-C': '--command',
  '-K': '--keyword',
});

function clear() {
  var db = new sqlite3.Database('./data.sqlite3', function () {
    db.all(`delete from taxcategory`, function (err, res) {
      if (!err) {
        console.log('清空成功.');
      }      
    });
  });
}

function finished(o) {
  console.log(o);
}

if (args['--command']==='clear') {
  clear();
} else if (args['--command']==='sync') {  
  sync(1);
} else if (args['--command']==='query') {  
  ruoruo(args['--keyword'], finished);
}
// sync(4);