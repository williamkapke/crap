var crap = require('../../');

module.exports = function(dependencies, callback){
  console.log("session provider initializing...");
  callback(null, dependencies);
};

