var crap = require('../../');


module.exports = function(cfg, callback){
  console.log("account controller initializing...");

  crap.load.providers("account", cfg, function(err, providers) {
    callback(null, providers);
  });
};

