var crap = require('../../');


module.exports = function(crap_cfg, type, name, callback){
  console.log(JSON.stringify(crap_cfg, null, 2));
  console.log('initializing session');
  callback(null, 'hey session');
};

