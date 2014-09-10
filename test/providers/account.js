var crap = require('../../');

module.exports = function(dependencies, callback){
  console.log("account provider initializing...");
  callback(null, dependencies);
};

