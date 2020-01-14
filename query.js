const sqlite3 = require('sqlite3');

function query(keyword) {
  var db = new sqlite3.Database('./data.sqlite3', function () {
    db.all(`select * from taxcategory 
    where 
    rate>'' and (
    small like '%${keyword}%' or 
    desc like '%${keyword}、%'
    )`, function (err, res) {
      if (!err) {
        console.log(res);
      }      
    });
  });
}

module.exports = {
  query
}