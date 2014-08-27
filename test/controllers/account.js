var crap = require('../../');


module.exports = function(cfg, callback){
  console.log("account controller initializing...");

  crap.providers.load("account", cfg, function(err, providers) {
    callback(null, providers);
  });
};

