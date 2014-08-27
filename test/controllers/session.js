var crap = require('../../');


module.exports = function(cfg, callback){
  console.log(JSON.stringify(cfg, null, 2));
  console.log('initializing session');
  callback(null, 'hey session');
};

