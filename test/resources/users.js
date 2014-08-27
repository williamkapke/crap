var crap = require('../../');

module.exports = function(cfg, callback){
  console.log("user service initializing...");
  callback(null, 'users');
};

