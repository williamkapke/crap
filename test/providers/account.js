var crap = require('../../');

module.exports = function(cfg, callback){
  console.log("account provider initializing...");

  crap.resources.load("users", cfg, function(err, resources) {
    callback(null, resources);
  });
};

