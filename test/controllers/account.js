var crap = require('../../');


module.exports = function(crap_cfg, type, name, callback){
  console.log("account controller initializing...");

  crap.load.providers("account", crap_cfg, function(err, providers) {
    callback(null, providers);
  });
};

