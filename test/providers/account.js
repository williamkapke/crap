var crap = require('../../');

module.exports = function(crap_cfg, type, name, callback){
  console.log("account provider initializing...");

  crap.load.resources("users", crap_cfg, function(err, resources) {
    callback(null, resources);
  });
};

