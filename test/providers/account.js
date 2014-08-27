var crap = require('../../');

module.exports = function(cfg, callback){
  console.log("account provider initializing...");

  crap.load.resources("users", cfg, function(err, resources) {
    callback(null, resources);
  });
};

